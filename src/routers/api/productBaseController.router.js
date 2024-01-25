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

    this.get('/createProduct', ['ADMIN','premium'], ProductController.getCreateProduct);
    this.post('/createProduct', ['ADMIN','premium'], ProductController.createProduct);

    this.get('/deleteProduct', ['ADMIN','premium'], ProductController.getDeleteProduct);
    this.post('/deleteProduct', ['ADMIN','premium'], ProductController.deleteProductById);

    this.get('/updateProduct', ['ADMIN','premium'], ProductController.getUpdateProduct);
    this.post('/updateProduct', ['ADMIN','premium'], ProductController.updateProductById);
  }

  getRouter() {
    return this.router;
  }
}
