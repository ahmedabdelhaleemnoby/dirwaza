import Booking from '../models/Booking.js';
import Experience from '../models/Experience.js';
import { sendWhatsAppNotification } from '../services/whatsappService.js';
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
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'الحجز غير موجود' });
    const before = booking.toObject();
    booking.status = 'cancelled';
    await booking.save();
    // سجل الإلغاء
    await Log.create({
      action: 'cancel',
      entity: 'booking',
      entityId: booking._id,
      before,
      after: booking.toObject(),
      performedBy: req.user?.id || 'unknown',
      performedById: req.user?.id || undefined
    });
    res.json({ message: 'تم إلغاء الحجز', booking });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء إلغاء الحجز', error: error.message });
  }
};

import Log from '../models/Log.js';
// PUT /api/bookings/:id (تعديل حجز)
export const updateBooking = async (req, res) => {
  try {
    const { clientName, clientPhone, experienceId, date, timeSlot, amount, paymentStatus, status, notes } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'الحجز غير موجود' });
    const before = booking.toObject();
    if (clientName) booking.clientName = clientName;
    if (clientPhone) booking.clientPhone = clientPhone;
    if (experienceId) booking.experienceId = experienceId;
    if (date) booking.date = date;
    if (timeSlot) booking.timeSlot = timeSlot;
    if (amount) booking.amount = amount;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    if (status) booking.status = status;
    if (notes) booking.notes = notes;
    await booking.save();
    // سجل التغيير
    await Log.create({
      action: 'update',
      entity: 'booking',
      entityId: booking._id,
      before,
      after: booking.toObject(),
      performedBy: req.user?.id || 'unknown',
      performedById: req.user?.id || undefined
    });
    res.json({ message: 'تم تحديث الحجز', booking });
  } catch (error) {
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
      userName,
      userPhone,
      userEmail,
      experienceType,
      experienceId,
      date,
      timeSlot,
      amount
    } = req.body;

    // تحقق أساسي (يمكن توسيعه لاحقًا)
    if (!userName || !userPhone || !experienceType || !experienceId || !date || !timeSlot || !amount) {
      return res.status(400).json({ message: 'يرجى تعبئة جميع الحقول المطلوبة' });
    }

    // تحقق من وجود التجربة وتفعيلها
    const experience = await Experience.findOne({ _id: experienceId, type: experienceType, isActive: true });
    if (!experience) {
      return res.status(404).json({ message: 'التجربة غير موجودة أو غير متاحة' });
    }

    // تحقق من أن التاريخ متاح
    const requestedDate = new Date(date);
    const isDateAvailable = experience.availableDates.some(d => new Date(d).toDateString() === requestedDate.toDateString());
    if (!isDateAvailable) {
      return res.status(400).json({ message: 'التاريخ غير متاح لهذه التجربة' });
    }

    // تحقق من عدم وجود حجز متعارض
    const existingBooking = await Booking.findOne({
      experienceId,
      date: new Date(date),
      timeSlot,
      bookingStatus: { $ne: 'cancelled' }
    });
    if (existingBooking) {
      return res.status(409).json({ message: 'يوجد حجز آخر لنفس التجربة في نفس التاريخ والفترة الزمنية' });
    }

    const booking = new Booking({
      userName,
      userPhone,
      userEmail,
      experienceType,
      experienceId,
      date,
      timeSlot,
      amount
    });
    await booking.save();

    // إرسال إشعار واتساب للعميل (إذا كان رقم الجوال يبدأ بـ +)
    if (userPhone && userPhone.startsWith('+')) {
      const msg = `تم تأكيد حجزك بنجاح\n\nرقم الحجز: ${booking._id}\nالتجربة: ${experience.title}\nالنوع: ${experience.type}\nالتاريخ: ${new Date(date).toLocaleDateString('ar-EG')}\nالفترة: ${timeSlot}\nالمبلغ: ${amount} ريال\nالموقع: https://maps.app.goo.gl/xxxxxx`;
      sendWhatsAppNotification({
        to: `whatsapp:${userPhone}`,
        body: msg
      });
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ أثناء إنشاء الحجز', error: error.message });
  }
};
