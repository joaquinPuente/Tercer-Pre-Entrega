import TicketDAO from "../dao/ticket.mongodb.js";


export default class TicketService {
    static findAll(filter={}){
        return TicketDAO.get(filter)
    }

    static async create(data){
        return await TicketDAO.create(data)
    }

    static findById(tid){
        return TicketDAO.getById(tid)
    }

    static updateById(tid,data){
        return TicketDAO.updateById(tid,data);
    }

    static deleteById(tid){
        return TicketDAO.deleteById(tid)
    }

}