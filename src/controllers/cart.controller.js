import TicketModel from "../models/ticket.model.js";
import ProductModel from "../models/product.model.js";
import CartService from "../service/cart.service.js";
import TicketService from "../service/ticket.service.js";


export default class CartController {
  static async getCartDetails(req, res) {
    try {
      const userId = req.session.user._id;
      const cartDetails = await CartService.getCartDetails(userId);
      res.render('cartDetails', { products: cartDetails });
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

  static async getTicket(req, res) {
    try {
      const email = req.session.user.email;
      console.log("email que va en el purcharser", email);
      const userId = req.session.user._id;
      
      // Obtener los detalles del carrito del usuario
      const cartDetails = await CartService.getCartDetails(userId);
  
      // Obtener los precios de los productos en el carrito
      const productIds = cartDetails.map((product) => product.product);
      const products = await ProductModel.find({ _id: { $in: productIds } });
  
      // Calcular el monto total del carrito sumando los precios de los productos
      let totalAmount = 0;
      cartDetails.forEach((cartProduct) => {
        const product = products.find((p) => p._id.toString() === cartProduct.product.toString());
        if (product) {
          totalAmount += product.price * cartProduct.quantity;
        }
      });
  
      // Crear un nuevo ticket
      const newTicket = new TicketModel({
        purchase_datetime: Date.now(),
        amount: totalAmount,
        purchaser: email,
      });
  
      // Guardar el ticket en la base de datos
      await newTicket.save();
  
      res.render('ticket', { ticket: newTicket }); // Renderizar la vista con el ticket creado
    } catch (error) {
      console.error('Error al traer vista del ticket', error.message);
      res.status(500).send('Error al traer vista del ticket');
    }
  }

  static async purchase(req, res) {
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
  

}
