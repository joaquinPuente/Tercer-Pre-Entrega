import TicketModel from '../models/ticket.model.js';

export default class TicketDAO {
  static async getAll(criteria, options) {
    return await TicketModel.paginate(criteria, options);
  }

  static async getById(tid) {
    return await TicketModel.findById(tid);
  }

  static async create(data) {
    const newProduct = new TicketModel(data);
    return await newProduct.save();
  }

  static async updateById(tid, data) {
    return await TicketModel.findByIdAndUpdate(tid, data, { new: true });
  }

  static async deleteById(tid) {
    return await TicketModel.findByIdAndDelete(tid);
  }
}