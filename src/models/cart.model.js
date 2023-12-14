import mongoose, { Schema } from 'mongoose';
import product from './product.model.js'
import user from './user.model.js'

const cartItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number, default: 1 }
});

const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    items: [cartItemSchema]
});

export default mongoose.model('carts', cartSchema);