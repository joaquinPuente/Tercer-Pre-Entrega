import RouterBase from "./RouterBase.js";
import CartController from "../../controllers/cart.controller.js";

export default class CartBaseController extends RouterBase {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.get('/cart', ['PUBLIC'], CartController.getCartDetails);
    this.post('/removeFromCart', ['PUBLIC'], CartController.removeFromCart);
    this.post('/addToCart', [], CartController.addToCart);
    this.get('/:cid/purchase',['PUBLIC'], CartController.purchase)
  }

  getRouter() {
    return this.router;
  }
}
