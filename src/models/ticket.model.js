import mongoose from 'mongoose';

const generateUniqueCode = () => {
  const length = 8; // Longitud del código
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // Caracteres válidos

  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return code;
};


const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: generateUniqueCode(6),
  },
  purchase_datetime: {
    type: Date,
    required: true,
    default: Date.now()
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },

  productsAdded: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products'
  }],
  productsNotAdded: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products' 
  }]

}, { timestamps: true });

export default mongoose.model('Ticket', ticketSchema);