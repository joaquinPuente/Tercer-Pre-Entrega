import ProductDao from '../dao/factory.js';

export default class ProductService {
  static async getAllProducts(criteria, options) {
    return await ProductDao.getAll(criteria, options);
  }

  static async getProductById(pid) {
    return await ProductDao.getById(pid);
  }

  static async createProduct(data) {
    return await ProductDao.create(data);
  }

  static async updateProductById(pid, data) {
    return await ProductDao.updateById(pid, data);
  }

  static async deleteProductById(pid) {
    return await ProductDao.deleteById(pid);
  }
}
