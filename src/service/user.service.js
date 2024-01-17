import userDAO from "../dao/ticket.mongodb.js";


export default class TicketService {
    static findAll(filter={}){
        return userDAO.get(filter)
    }

    static async create(data){
        return await userDAO.create(data)
    }

    static findById(tid){
        return userDAO.getById(tid)
    }

    static updateById(tid,data){
        return userDAO.updateById(tid,data);
    }

    static deleteById(tid){
        return userDAO.deleteById(tid)
    }

}