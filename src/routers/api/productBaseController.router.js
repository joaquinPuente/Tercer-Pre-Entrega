import RouterBase from "./RouterBase.js";
import ProductController from "../../controllers/product.controller.js";

export default class ProductBaseController extends RouterBase {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.get('/products', ['PUBLIC'], ProductController.getAllProducts);
    this.get('/products/:pid', ['PUBLIC'], ProductController.getProductById);

    this.get('/createProduct', ['ADMIN'], ProductController.getCreateProduct);
    this.post('/createProduct', ['ADMIN'], ProductController.createProduct);

    this.get('/deleteProduct', ['ADMIN'], ProductController.getDeleteProduct);
    this.post('/deleteProduct', ['ADMIN'], ProductController.deleteProductById);

    this.get('/updateProduct', ['ADMIN'], ProductController.getUpdateProduct);
    this.post('/updateProduct', ['ADMIN'], ProductController.updateProductById);
  }

  getRouter() {
    return this.router;
  }
}
