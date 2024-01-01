import TicketModel from "../models/ticket.model.js";
import ProductService from "../service/product.service.js";
import CartService from "../service/cart.service.js";
import TicketService from "../service/ticket.service.js";
import { Types } from 'mongoose';

export default class CartController {
  static async getCartDetails(req, res) {
    try {
      const userId = req.session.user._id;
      const cartDetails = await CartService.getCartDetails(userId);
      res.render('cartDetails', { products: cartDetails, cid: userId });
    } catch (error) {
      console.error('Error al cargar el carrito', error.message);
      res.status(500).json({ error: 'Error al cargar el carrito' });
    }
  }

  static async removeFromCart(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.session.user._id;
      await CartService.removeFromCart(userId, productId);
      res.redirect('/api/cart');
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async addToCart(req, res) {
    try {
      const { productId } = req.body;
      const userId = req.session.user._id;
      await CartService.addToCart(userId, productId);
      res.redirect('/api/products');
    } catch (error) {
      console.error('Error al agregar al carrito:', error.message);
      res.status(500).send('Error al agregar al carrito');
    }
  }

  static async generateTicket(req, res) {
    try {
      const email = req.session.user.email;
      const userId = req.session.user._id;
      const existingTicket = await TicketService.findByPurchaserEmail(email);
      if (existingTicket.length > 0) {
        res.render('ticketExisting');
      } else {
        const cartDetails = await CartService.getCartDetails(userId);
        let totalAmount = 0;
        for (const cartProduct of cartDetails) {
          totalAmount += cartProduct.price * cartProduct.quantity;
        }
        const newTicket = new TicketModel({
          purchase_datetime: Date.now(),
          amount: totalAmount,
          purchaser: email,
        });
        await newTicket.save();
        res.render('generatorTicket'); 
      }
    } catch (error) {
      console.error('Error al generar el ticket:', error.message);
      res.status(500).send('Error al generar el ticket');
    }
  }

  static async purchaseFuncional(req, res) {
    try {
      const userId = req.session.user._id;

      // Obtener los detalles del carrito del usuario
      const cartDetails = await CartService.getCartDetails(userId);

      // Arrays para productos agregados y no agregados al ticket
      const productsAdded = [];
      const productsNotAdded = [];

      // Iterar sobre cada producto en el carrito
      for (const cartProduct of cartDetails) {
        const productId = cartProduct.id;
        const quantityToPurchase = cartProduct.quantity;

        // Obtener el producto desde la base de datos
        const product = await ProductService.getProductById(productId);

        if (!product) {
          return res.status(404).json({ error: 'El producto no se encontró' });
        }

        // Verificar si hay suficiente stock para el producto
        if (product.stock >= quantityToPurchase) {
          // Actualizar la cantidad de stock del producto
          product.stock -= quantityToPurchase;

          // Guardar los cambios en la base de datos
          await ProductService.updateProductById(productId, { stock: product.stock });

          // Agregar el producto a 'productsAdded'
          productsAdded.push(productId);
        } else {
          // Producto sin suficiente stock
          productsNotAdded.push(productId);
        }
      }

      // Si todos los productos tienen suficiente stock, proceder a generar el ticket
      const email = req.session.user.email;
      const existingTicket = await TicketService.findByPurchaserEmail(email);

      // Si no hay un ticket existente, generar uno nuevo
      if (existingTicket.length === 0) {
        let totalAmount = 0;
        for (const cartProduct of cartDetails) {
          totalAmount += cartProduct.price * cartProduct.quantity;
        }

        // Crear el ticket con los arrays de productos agregados y no agregados
        const newTicket = new TicketModel({
          purchase_datetime: Date.now(),
          amount: totalAmount,
          purchaser: email,
          productsAdded: productsAdded,
          productsNotAdded: productsNotAdded
        });

        await newTicket.save();
      }

      // Limpiar el carrito después de la compra
      await CartService.clearCart(userId);

      // Redireccionar a la vista de generación del ticket o enviar una respuesta adecuada
      res.render('generatorTicket');
    } catch (error) {
      console.error('Error al realizar la compra:', error.message);
      res.status(500).json({ error: 'Error al realizar la compra' });
    }
  }
  
  static async purchase(req, res) {
    try {
      const userId = req.session.user._id;
  
      // Obtener los detalles del carrito del usuario
      const cartDetails = await CartService.getCartDetails(userId);
  
      // Arrays para productos agregados y no agregados al ticket
      const productsAdded = [];
      const productsNotAdded = [];
  
      // Variable para calcular el monto solo de productos agregados
      let totalAmountAdded = 0;
  
      // Iterar sobre cada producto en el carrito
      for (const cartProduct of cartDetails) {
        const productId = cartProduct.id;
        const quantityToPurchase = cartProduct.quantity;
  
        // Obtener el producto desde la base de datos
        const product = await ProductService.getProductById(productId);
  
        if (!product) {
          return res.status(404).json({ error: 'El producto no se encontró' });
        }
  
        // Verificar si hay suficiente stock para el producto
        if (product.stock >= quantityToPurchase) {
          // Actualizar la cantidad de stock del producto
          product.stock -= quantityToPurchase;
  
          // Guardar los cambios en la base de datos
          await ProductService.updateProductById(productId, { stock: product.stock });
  
          // Agregar el producto a 'productsAdded'
          productsAdded.push(productId);
  
          // Calcular el monto solo para productos agregados
          totalAmountAdded += product.price * quantityToPurchase;
        } else {
          // Producto sin suficiente stock
          productsNotAdded.push(productId);
        }
      }
  
      // Si todos los productos tienen suficiente stock, proceder a generar el ticket
      const email = req.session.user.email;
      const existingTicket = await TicketService.findByPurchaserEmail(email);
  
      // Si no hay un ticket existente, generar uno nuevo
      if (existingTicket.length === 0) {
        // Crear el ticket con los arrays de productos agregados y no agregados
        const newTicket = new TicketModel({
          purchase_datetime: Date.now(),
          amount: totalAmountAdded, // Usar el monto solo de los productos agregados
          purchaser: email,
          productsAdded: productsAdded,
          productsNotAdded: productsNotAdded
        });
  
        await newTicket.save();
      }
  
      // Limpiar el carrito después de la compra
      await CartService.clearCart(userId);
  
      // Redireccionar a la vista de generación del ticket o enviar una respuesta adecuada
      res.render('generatorTicket');
    } catch (error) {
      console.error('Error al realizar la compra:', error.message);
      res.status(500).json({ error: 'Error al realizar la compra' });
    }
  }
  
 

}