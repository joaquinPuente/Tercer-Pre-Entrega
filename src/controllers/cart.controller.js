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

}
