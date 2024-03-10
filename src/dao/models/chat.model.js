import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: String, required: true },
  timestamp: { type: Date, default: Date.now } 
});

messageSchema.plugin(mongoosePaginate)

export default mongoose.model('Message', messageSchema);

