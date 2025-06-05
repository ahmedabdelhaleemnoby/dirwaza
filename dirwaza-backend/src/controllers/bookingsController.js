import Booking from '../models/Booking.js';
import Experience from '../models/Experience.js';
import { 
  sendBookingConfirmation, 
  notifyAdminNewBooking, 
  notifyAdminBookingUpdate, 
  notifyAdminBookingCancellation 
} from '../services/whatsappService.js';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

// GET /api/bookings/finance
export const getFinanceData = async (req, res) => {
  try {
    const match = {};
    if (req.query.status) match.bookingStatus = req.query.status;
    if (req.query.paymentStatus) match.paymentStatus = req.query.paymentStatus;
    if (req.query.from || req.query.to) {
      match.date = {};
      if (req.query.from) match.date.$gte = new Date(req.query.from);
      if (req.query.to) match.date.$lte = new Date(req.query.to);
    }
    const result = await Booking.aggregate([
      { $match: match },
      { $group: {
          _id: null,
          totalSales: { $sum: "$amount" },
          totalBookings: { $sum: 1 }
      }}
    ]);
    const data = result[0] || { totalSales: 0, totalBookings: 0 };
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب البيانات المالية', error: error.message });
  }
};

// GET /api/bookings/export/excel
export const exportBookingsToExcel = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.bookingStatus = req.query.status;
    if (req.query.experienceId) filter.experienceId = req.query.experienceId;
    if (req.query.date) filter.date = new Date(req.query.date);
    const bookings = await Booking.find(filter).populate('experienceId');

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Bookings');
    worksheet.columns = [
      { header: 'رقم الحجز', key: '_id', width: 26 },
      { header: 'العميل', key: 'userName', width: 20 },
      { header: 'الجوال', key: 'userPhone', width: 16 },
      { header: 'البريد', key: 'userEmail', width: 24 },
      { header: 'التجربة', key: 'experienceTitle', width: 20 },
      { header: 'النوع', key: 'experienceType', width: 14 },
      { header: 'التاريخ', key: 'date', width: 14 },
      { header: 'الفترة', key: 'timeSlot', width: 12 },
      { header: 'المبلغ', key: 'amount', width: 10 },
      { header: 'الحالة', key: 'bookingStatus', width: 12 },
      { header: 'الدفع', key: 'paymentStatus', width: 12 },
    ];
    bookings.forEach(b => {
      worksheet.addRow({
        _id: b._id.toString(),
        userName: b.userName,
        userPhone: b.userPhone,
        userEmail: b.userEmail,
        experienceTitle: b.experienceId?.title || '',
        experienceType: b.experienceType,
        date: b.date ? new Date(b.date).toLocaleDateString('ar-EG') : '',
        timeSlot: b.timeSlot,
        amount: b.amount,
        bookingStatus: b.bookingStatus,
        paymentStatus: b.paymentStatus
      });
    });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="bookings.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء تصدير البيانات إلى Excel', error: error.message });
  }
};

// GET /api/bookings/export/pdf
export const exportBookingsToPDF = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.bookingStatus = req.query.status;
    if (req.query.experienceId) filter.experienceId = req.query.experienceId;
    if (req.query.date) filter.date = new Date(req.query.date);
    const bookings = await Booking.find(filter).populate('experienceId');

    const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="bookings.pdf"');
    doc.pipe(res);
    doc.fontSize(16).text('تقرير الحجوزات', { align: 'center' });
    doc.moveDown();
    const tableHeaders = ['رقم الحجز', 'العميل', 'الجوال', 'البريد', 'التجربة', 'النوع', 'التاريخ', 'الفترة', 'المبلغ', 'الحالة', 'الدفع'];
    doc.fontSize(10);
    doc.text(tableHeaders.join(' | '), { align: 'right' });
    doc.moveDown(0.5);
    bookings.forEach(b => {
      const row = [
        b._id.toString(),
        b.userName,
        b.userPhone,
        b.userEmail,
        b.experienceId?.title || '',
        b.experienceType,
        b.date ? new Date(b.date).toLocaleDateString('ar-EG') : '',
        b.timeSlot,
        b.amount,
        b.bookingStatus,
        b.paymentStatus
      ];
      doc.text(row.join(' | '), { align: 'right' });
    });
    doc.end();
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء تصدير البيانات إلى PDF', error: error.message });
  }
};

// GET /api/bookings
export const getBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.bookingStatus = req.query.status;
    if (req.query.experienceId) filter.experienceId = req.query.experienceId;
    if (req.query.date) filter.date = new Date(req.query.date);
    const bookings = await Booking.find(filter).populate('experienceId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الحجوزات', error: error.message });
  }
};

// GET /api/bookings/:id (جلب تفاصيل حجز)
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'الحجز غير موجود' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الحجز', error: error.message });
  }
};

// PATCH /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'الحجز غير موجود' });
    }

    // حفظ القيم القديمة للإشعار
    const oldValues = {
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus
    };

    booking.bookingStatus = 'cancelled';
    booking.cancellationReason = cancellationReason;
    await booking.save();

    // إرسال إشعار للإدارة بالإلغاء
    const populatedBooking = await Booking.findById(booking._id).populate('experienceId');
    await notifyAdminBookingCancellation(populatedBooking);
    await notifyAdminBookingUpdate(populatedBooking, oldValues);

    res.json({ message: 'تم إلغاء الحجز بنجاح', booking });
  } catch (error) {
    console.error('خطأ في إلغاء الحجز:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء إلغاء الحجز', error: error.message });
  }
};

import Log from '../models/Log.js';
// PUT /api/bookings/:id (تعديل حجز)
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // الحصول على الحجز القديم
    const oldBooking = await Booking.findById(id);
    if (!oldBooking) {
      return res.status(404).json({ message: 'الحجز غير موجود' });
    }

    // تحديث الحجز
    const booking = await Booking.findByIdAndUpdate(id, updates, { new: true });
    
    // إرسال إشعار للإدارة بالتحديث
    const populatedBooking = await Booking.findById(booking._id).populate('experienceId');
    await notifyAdminBookingUpdate(populatedBooking, {
      bookingStatus: oldBooking.bookingStatus,
      paymentStatus: oldBooking.paymentStatus,
      date: oldBooking.date,
      timeSlot: oldBooking.timeSlot
    });

    res.json({ message: 'تم تحديث الحجز بنجاح', booking });
  } catch (error) {
    console.error('خطأ في تحديث الحجز:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث الحجز', error: error.message });
  }
};

// DELETE /api/bookings/:id (حذف حجز)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'الحجز غير موجود' });
    // سجل الحذف
    await Log.create({
      action: 'delete',
      entity: 'booking',
      entityId: booking._id,
      before: booking.toObject(),
      performedBy: req.user?.id || 'unknown',
      performedById: req.user?.id || undefined
    });
    res.json({ message: 'تم حذف الحجز بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء حذف الحجز', error: error.message });
  }
};

// POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { 
      experienceId, 
      date, 
      timeSlot, 
      userName, 
      userPhone, 
      userEmail, 
      experienceType, 
      amount,
      notes 
    } = req.body;

    // تحقق أساسي من الحقول المطلوبة
    if (!experienceId || !date || !timeSlot || !userName || !userPhone) {
      return res.status(400).json({ message: 'الرجاء إدخال جميع الحقول المطلوبة' });
    }

    // التحقق من توفر الموعد
    const existingBooking = await Booking.findOne({ 
      experienceId,
      date: new Date(date),
      timeSlot,
      bookingStatus: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'يوجد حجز آخر لنفس التجربة في نفس التاريخ والفترة الزمنية' });
    }

    // إنشاء الحجز
    const booking = new Booking({
      userName,
      userPhone,
      userEmail,
      experienceType,
      experienceId,
      date: new Date(date),
      timeSlot,
      amount,
      notes,
      paymentStatus: 'pending',
      bookingStatus: 'confirmed'
    });

    await booking.save();
    
    // جلب تفاصيل التجربة للإشعار
    const experience = await Experience.findById(experienceId);
    
    // إرسال إشعار تأكيد للعميل
    if (userPhone) {
      await sendBookingConfirmation({
        phone: userPhone.startsWith('+') ? userPhone : `+${userPhone}`,
        bookingId: booking._id,
        experienceName: experience?.title || 'خدمة',
        date: booking.date,
        timeSlot: booking.timeSlot
      });
    }
    
    // إرسال إشعار للإدارة
    const populatedBooking = await Booking.findById(booking._id).populate('experienceId');
    await notifyAdminNewBooking(populatedBooking);

    res.status(201).json({
      message: 'تم إنشاء الحجز بنجاح',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحجز', error: error.message });
  }
};
