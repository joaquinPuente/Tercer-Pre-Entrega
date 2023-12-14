import mongoose from 'mongoose';
import cart from './cart.model.js';

const userSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    user: String,
    provider: String,
    role: { type: String, default: 'usuario' }, 
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' } 
}, { timestamps: true });

export default mongoose.model('users', userSchema);