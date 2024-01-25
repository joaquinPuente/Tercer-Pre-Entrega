import mongoose,{Schema} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema({
	title:{type:String,required:true},
	description:{type:String,required:true},
	price:{type:Number,required:true},
	thumbnail:{type:String, required:true, unique:true},
	code:{type:String, required:true, unique:true},
	stock:{type:Number,required:true},
	owner: {
        role: { type: String, default: 'ADMIN' },
        email: { type: String, default: 'admin@example.com' }
    }
},{timestamps:true});

productSchema.plugin(mongoosePaginate)

export default mongoose.model('products', productSchema);