import express from 'express';
import { createBooking, getBookings, cancelBooking, getFinanceData, exportBookingsToExcel, exportBookingsToPDF, getBookingById, updateBooking, deleteBooking } from '../controllers/bookingsController.js';
import { isAdmin } from '../middlewares/auth.js';

const router = express.Router();

// GET /api/bookings/export/excel
router.get('/export/excel', isAdmin, exportBookingsToExcel);
// GET /api/bookings/export/pdf
router.get('/export/pdf', isAdmin, exportBookingsToPDF);

// GET /api/bookings/finance
router.get('/finance', isAdmin, getFinanceData);

// GET /api/bookings
router.get('/', isAdmin, getBookings);

// تفاصيل وتعديل وحذف حجز (للأدمن)
router.get('/:id', isAdmin, getBookingById);
router.put('/:id', isAdmin, updateBooking);
router.delete('/:id', isAdmin, deleteBooking);

// POST /api/bookings
router.post('/', createBooking);

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', isAdmin, cancelBooking);

export default router;
