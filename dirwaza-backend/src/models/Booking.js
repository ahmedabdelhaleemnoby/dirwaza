import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  userPhone: {
    type: String,
    required: true,
    match: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
  },
  experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience' },
  date: Date,
  timeSlot: String,
  bookingStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'partially_paid'], 
    default: 'pending' 
  },
  experienceType: { 
    type: String, 
    enum: ['overnight', 'day_visit'], 
    default: 'day_visit' 
  },
  // ... other fields
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
