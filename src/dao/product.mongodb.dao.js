import productModel from '../dao/models/product.model.js';

export default class ProductDAO {
  static async getAll(criteria, options) {
    return await productModel.paginate(criteria, options);
  }

  static async getById(pid) {
    return await productModel.findById(pid);
  }

  static async create(data) {
    const newProduct = new productModel(data);
    return await newProduct.save();
  }

  static async updateById(pid, data) {
    return await productModel.findByIdAndUpdate(pid, data, { new: true });
  }

  static async deleteById(pid) {
    return await productModel.findByIdAndDelete(pid);
  }
}
