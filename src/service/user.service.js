import UserDao from "../dao/User.dao.js";

export default class UserService {
    static findAll(filter={}){
        return UserDao.get(filter)
    }

    static async create(data){
        return await UserDao.create(data)
    }

    static findById(uid){
        return UserDao.getById(uid)
    }

    static updateById(uid,data){
        return UserDao.updateById(uid,data);
    }

    static deleteById(uid){
        return UserDao.deleteById(uid)
    }

}