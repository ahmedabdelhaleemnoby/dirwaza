import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  userPhone: {
    type: String,
    required: true
  },
  userEmail: {
    type: String
  },
  experienceType: {
    type: String,
    enum: ['rest_area', 'horse_training', 'nursery'],
    required: true
  },
  experienceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  paymentId: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
