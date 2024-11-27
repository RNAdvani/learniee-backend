import mongoose from 'mongoose';
import { IMessage } from '../schemas/message.schema';


const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  type: { type: String, enum: ['text', 'image'], default: 'text' },
  status: { 
    type: String, 
    enum: ['sent', 'delivered', 'read'], 
    default: 'sent' 
  },
}, { timestamps: true });

export const Message = mongoose.model<IMessage>('Message', messageSchema);