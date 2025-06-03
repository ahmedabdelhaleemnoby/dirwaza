import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true // يسمح بأن يكون الحقل فارغًا لبعض المستخدمين
  },
  password: {
    type: String,
    required: true
  },
  realPassword: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  otp: {
    type: String,
    required: false
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
