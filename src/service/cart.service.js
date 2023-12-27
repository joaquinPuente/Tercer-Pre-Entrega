import { CartDao } from "../dao/factory.js";

export default class CartService {

  static async getCartDetails(userId) {
    const userCart = await CartDao.getUserCart(userId);
    if (!userCart) {
      throw new Error("Carrito no encontrado");
    }
    return userCart.items.map(item => ({
      title: item.product.title,
      description: item.product.description,
      price: item.product.price,
      quantity: item.quantity,
      id: item.product._id
    }));
  }

  static async removeFromCart(userId, productId) {
    const userCart = await CartDao.getUserCart(userId);
    if (!userCart) {
      throw new Error('Carrito no encontrado');
    }
    const productIndex = userCart.items.findIndex(item => item.product.equals(productId));
    console.log('productIndex', productIndex);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado en el carrito');
    }
    userCart.items.splice(productIndex, 1);
    await userCart.save();
  }

  static async addToCart(userId, productId) {
    let userCart = await CartDao.getUserCart(userId);
    if (!userCart) {
      userCart = new CartDao({ user: userId, items: [] });
    }
    const existingProductIndex = userCart.items.findIndex(item => item.product.equals(productId));
    if (existingProductIndex !== -1) {
      userCart.items[existingProductIndex].quantity += 1;
    } else {
      userCart.items.push({ product: productId, quantity: 1 });
    }
    await userCart.save();
  }
}
