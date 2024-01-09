import mongoose from "mongoose";
import config from "../config.js";
import { CustomError } from '../service/errors/CustomError.js'
import EnumsError from '../service/errors/EnumsError.js'

export const init = async ()=>{
    try {
        await mongoose.connect(config.mongoUri);
        console.log('Database connected 😎');
    } catch (error) {
        CustomError.createError({
            name:'Error al conectar con la BD',
            cause:'Revisar enlace',
            message:'Error for mongoDB',
            code: EnumsError.DATA_BASE_ERROR,
        })
    }
    
}
