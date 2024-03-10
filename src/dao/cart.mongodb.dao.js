import cartModel from "./models/cart.model.js";

export default class CartDAO {
  static async getUserCart(userId) {
    return await cartModel.findOne({ user: userId }).populate('items.product');
  }
}
