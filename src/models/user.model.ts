import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../schemas/user.schema';


const userSchema = new mongoose.Schema({
    name : { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isOnline: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const User = mongoose.model<IUser>('User', userSchema);