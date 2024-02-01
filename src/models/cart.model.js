import mongoose, { Schema } from 'mongoose';

const cartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number, default: 1 }
},{_id:false});

const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    items: [cartItemSchema]
});

export default mongoose.model('carts', cartSchema);