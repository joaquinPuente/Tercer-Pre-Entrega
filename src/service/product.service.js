import ProductDAO from '../dao/product.dao.js';

export default class ProductService {
  static async getAllProducts(criteria, options) {
    return await ProductDAO.getAll(criteria, options);
  }

  static async getProductById(pid) {
    return await ProductDAO.getById(pid);
  }

  static async createProduct(data) {
    return await ProductDAO.create(data);
  }

  static async updateProductById(pid, data) {
    return await ProductDAO.updateById(pid, data);
  }

  static async deleteProductById(pid) {
    return await ProductDAO.deleteById(pid);
  }
}
