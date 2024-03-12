import TicketModel from "../dao/models/ticket.model.js";
import ProductService from "../service/product.service.js";
import CartService from "../service/cart.service.js";
import TicketService from "../service/ticket.service.js";

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
      let userId;
      if (req.session.user && req.session.user._id) {
          userId = req.session.user._id;
      } else if (req.body.userCart) {
          userId = req.body.userCart;
      } else {
          throw new Error('No se proporcionó userId en la sesión ni en el cuerpo de la solicitud.');
      }

      const { productId } = req.body;
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
  
  static async purchase(req, res) {
    try {
      const userId = req.session.user._id;
      const cartDetails = await CartService.getCartDetails(userId);
      const productsAdded = [];
      const productsNotAdded = [];
      let totalAmountAdded = 0;
      for (const cartProduct of cartDetails) {
        const productId = cartProduct.id;
        const quantityToPurchase = cartProduct.quantity;
        const product = await ProductService.getProductById(productId);
        if (!product) {
          return res.status(404).json({ error: 'El producto no se encontró' });
        }
        if (product.stock >= quantityToPurchase) {
          product.stock -= quantityToPurchase;
          await ProductService.updateProductById(productId, { stock: product.stock });
          productsAdded.push(productId);
          totalAmountAdded += product.price * quantityToPurchase;
        } else {
          // Producto sin suficiente stock
          productsNotAdded.push(productId);
        }
      }
      const email = req.session.user.email;
      const existingTicket = await TicketService.findByPurchaserEmail(email);
      if (existingTicket.length === 0) {
        const newTicket = new TicketModel({
          purchase_datetime: Date.now(),
          amount: totalAmountAdded,
          purchaser: email,
          productsAdded: productsAdded,
          productsNotAdded: productsNotAdded
        });
  
        await newTicket.save();
      }
      await CartService.clearCart(userId);
      res.render('generatorTicket');
    } catch (error) {
      console.error('Error al realizar la compra:', error.message);
      res.status(500).json({ error: 'Error al realizar la compra' });
    }
  }
  
 

}