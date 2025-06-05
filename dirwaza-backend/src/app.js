import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
import adminRouter from './routes/admin.js';
import authRouter from './routes/auth.js';
import bookingsRouter from './routes/bookings.js';
import contactRouter from './routes/contact.js';
import experiencesRouter from './routes/experiences.js';
import otpRouter from './routes/otp.js';
app.use('/api/experiences', experiencesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/contact', contactRouter);
app.use('/api/otp', otpRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Dirwaza Backend API');
});

export default app;
