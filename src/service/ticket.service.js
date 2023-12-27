import TicketModel from "../models/ticket.model.js";

export default class TicketService {
    static findAll(filter={}){
        return TicketModel.get(filter)
    }

    static async create(data){
        return await TicketModel.create(data)
    }

    static findById(uid){
        return TicketModel.getById(uid)
    }

    static updateById(uid,data){
        return TicketModel.updateById(uid,data);
    }

    static deleteById(uid){
        return TicketModel.deleteById(uid)
    }

}