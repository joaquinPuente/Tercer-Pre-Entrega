import userModel from "../models/user.model.js";

export default class UserDao {
    static create(data){
        const newUser = userModel.create(data)
        return newUser
    }

    static get(criteria={}){
        const user = userModel.find(criteria)
        return user
    }

    static getById(uid){
        const user = userModel.findById(uid)
        return user
    }

    static updateById(uid,data){
        return userModel.updateOne({_id:uid}, {$set:data});
    }

    static deleteById(uid){
        return userModel.deleteOne({_id:uid})
    }

}