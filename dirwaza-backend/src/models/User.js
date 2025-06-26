import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    unique: false,
    sparse: true // يسمح بأن يكون الحقل فارغًا لبعض المستخدمين
  },
  password: {
    type: String,
    required: false
  },
  realPassword: {
    type: String,
    required: false
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
