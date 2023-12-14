import mongoose,{Schema} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema({
	title:{type:String,required:true},
	description:{type:String,required:true},
	price:{type:Number,required:true},
	thumbnail:{type:String, required:true, unique:true},
	code:{type:String, required:true, unique:true},
	stock:{type:Number,required:true}
},{timestamps:true});

productSchema.plugin(mongoosePaginate)

export default mongoose.model('products', productSchema);