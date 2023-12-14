import mongoose from "mongoose";
import config from "../config.js";

export const init = async ()=>{
    try {
        await mongoose.connect(config.mongoUri);
        console.log('Database connected 😎');
    } catch (error) {
        console.log('Error to connect to database', error.message);
    }
    
}
