import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import Experience from '../models/Experience.js';
import Rest from '../models/Rest.js';
import User from '../models/User.js';
import {
  notifyAdminBookingCancellation,
  notifyAdminBookingUpdate,
  notifyAdminNewBooking,
  sendBookingConfirmation
} from '../services/whatsappService.js';

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
    const bookings = await Booking.find(filter)
      .populate('experienceId')
      .populate('userId', 'name phone email');
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
    const populatedBooking = await Booking.findById(booking._id)
      .populate('experienceId')
      .populate('userId', 'name phone email');
    await notifyAdminBookingCancellation(populatedBooking);
    await notifyAdminBookingUpdate(populatedBooking, oldValues);

    res.json({ message: 'تم إلغاء الحجز بنجاح', booking: populatedBooking });
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
    const populatedBooking = await Booking.findById(booking._id)
      .populate('experienceId')
      .populate('userId', 'name phone email');
    await notifyAdminBookingUpdate(populatedBooking, {
      bookingStatus: oldBooking.bookingStatus,
      paymentStatus: oldBooking.paymentStatus,
      date: oldBooking.date,
      timeSlot: oldBooking.timeSlot
    });

    res.json({ message: 'تم تحديث الحجز بنجاح', booking: populatedBooking });
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

// Helper function to handle user creation/update
const handleUserForBooking = async (phone, name, email) => {
  // البحث عن المستخدم بناءً على رقم الهاتف
  let user = await User.findOne({ phone });
  
  if (user) {
    // إذا كان المستخدم موجود، تحديث البيانات
    console.log(`المستخدم موجود بالفعل: ${user._id}`);
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    console.log(`تم تحديث بيانات المستخدم: ${user.name}`);
  } else {
    // إذا لم يكن المستخدم موجود، إنشاء مستخدم جديد
    console.log(`إنشاء مستخدم جديد لرقم: ${phone}`);
    const uniqueId = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    const uniqueName = name || `user_${uniqueId}`;
    
    user = await User.create({
      phone,
      name: uniqueName,
      email: email || undefined,
      isActive: true
    });
    console.log(`تم إنشاء مستخدم جديد: ${user._id} - ${user.name}`);
  }
  
  return user;
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

    // Basic validation
    if (!experienceId || !date || !timeSlot) {
      return res.status(400).json({ 
        success: false,
        message: 'الرجاء إدخال جميع الحقول المطلوبة' 
      });
    }

    let user;
    
    // Check if user is authenticated via token
    if (req.user) {
      // Use the authenticated user
      user = req.user;
    } 
    // If not authenticated but phone is provided, find or create user
    else if (userPhone) {
      user = await User.findOneAndUpdate(
        { phone: userPhone },
        { 
          $setOnInsert: { 
            name: userName || 'مستخدم جديد',
            email: userEmail || '',
            isActive: true
          }
        },
        { 
          upsert: true,
          new: true,
          setDefaultsOnInsert: true 
        }
      );
    } 
    // No user info provided
    else {
      return res.status(400).json({ 
        success: false,
        message: 'يجب تسجيل الدخول أو توفير رقم الهاتف' 
      });
    }

    // Check for existing booking at the same time
    const existingBooking = await Booking.findOne({ 
      experienceId,
      date: new Date(date),
      timeSlot,
      bookingStatus: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(409).json({ 
        success: false,
        message: 'يوجد حجز آخر لنفس التجربة في نفس التاريخ والفترة الزمنية' 
      });
    }

    // Create the booking
    const booking = new Booking({
      userId: req.user.id,
      userName: user.name || userName,
      userPhone: req.user.phone,
      userEmail: user.email || userEmail || '',
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
    
    // Get experience details for notification
    const experience = await Experience.findById(experienceId);
    
    // Send confirmation to client if phone is available
    const phoneToNotify = user.phone || userPhone;
    if (phoneToNotify) {
      await sendBookingConfirmation({
        phone: phoneToNotify.startsWith('+') ? phoneToNotify : `+${phoneToNotify}`,
        bookingId: booking._id,
        experienceName: experience?.title || 'خدمة',
        date: booking.date,
        timeSlot: booking.timeSlot
      });
    }
    
    // Notify admin
    const populatedBooking = await Booking.findById(booking._id)
      .populate('experienceId')
      .populate('userId', 'name phone email');
    await notifyAdminNewBooking(populatedBooking);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحجز بنجاح',
      booking: populatedBooking
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      success: false,
      message: 'حدث خطأ أثناء إنشاء الحجز',
      error: error.message 
    });
  }
};

// POST /api/bookings/rest
export const createBookingRest = async (req, res) => {
  try {
    const { 
      fullName,
      email,
      phone,
      cardDetails,
      paymentAmount, // 'partial' or 'full'
      paymentMethod, // 'card'
      totalPrice,
      totalPaid,
      overnight, // boolean
      checkIn, // array of dates
      restId
    } = req.body;

    // Basic validation
    if (!fullName || !phone || !restId || !checkIn || !Array.isArray(checkIn) || checkIn.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'الرجاء إدخال جميع الحقول المطلوبة (الاسم، الهاتف، معرف الاستراحة، تواريخ الحجز)' 
      });
    }

    // Validate rest exists
    if (!mongoose.Types.ObjectId.isValid(restId)) {
      return res.status(400).json({ 
        success: false,
        message: 'معرف الاستراحة غير صحيح' 
      });
    }
    
    const rest = await Rest.findById(restId);
    if (!rest) {
      return res.status(404).json({ 
        success: false,
        message: 'الاستراحة المحددة غير موجودة' 
      });
    }

    // Find or create user by phone
    const normalizedPhone = phone.replace(/^0/, '+966');
    let user = await User.findOne({ phone: normalizedPhone });
    
    if (!user) {
      // Create new user
      user = new User({
        name: fullName,
        phone: normalizedPhone,
        email: email || '',
        isActive: true
      });
      await user.save();
    }
    // If user exists, use existing user without updating to avoid conflicts

    // Check for existing booking conflicts
    const checkInDates = checkIn.map(date => new Date(date));
    const existingBooking = await Booking.findOne({ 
      restId,
      date: { $in: checkInDates },
      bookingStatus: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(409).json({ 
        success: false,
        message: 'يوجد حجز آخر لنفس الاستراحة في أحد التواريخ المحددة' 
      });
    }

    // Create the rest booking
    const booking = new Booking({
      userId: user._id,
      userName: fullName,
      userPhone: phone,
      userEmail: email || '',
      experienceType: overnight ? 'overnight' : 'day_visit',
      restId: restId,
      date: checkInDates[0], // Primary check-in date
      checkInDates: checkInDates, // All check-in dates
      totalPrice: totalPrice,
      totalPaid: totalPaid,
      paymentAmount: paymentAmount,
      paymentMethod: paymentMethod,
      paymentStatus: paymentAmount === 'full' ? 'paid' : 'partially_paid',
      bookingStatus: 'confirmed',
      cardDetails: {
        lastFourDigits: cardDetails?.cardNumber ? cardDetails.cardNumber.slice(-4) : '',
        // Don't store full card details for security
      },
      bookingType: 'rest'
    });

    await booking.save();
    
    // Get the saved booking for response
    const savedBooking = await Booking.findById(booking._id);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء حجز الاستراحة بنجاح',
      booking: savedBooking
    });

  } catch (error) {
    console.error('Error creating rest booking:', error);
    res.status(500).json({ 
      success: false,
      message: 'حدث خطأ أثناء إنشاء حجز الاستراحة',
      error: error.message 
    });
  }
};

// POST /api/bookings/horse
export const createBookingHorse = async (req, res) => {
  try {
    const { 
      agreedToTerms,
      personalInfo: {
        fullName,
        parentName,
        age,
        mobileNumber,
        previousTraining,
        notes
      },
      numberPersons,
      selectedCategoryId,
      selectedCourseId, // This is experienceId
      selectedAppointments
    } = req.body;

    // Basic validation
    if (!agreedToTerms) {
      return res.status(400).json({ 
        success: false,
        message: 'يجب الموافقة على الشروط والأحكام' 
      });
    }

    if (!fullName || !mobileNumber || !selectedCourseId) {
      return res.status(400).json({ 
        success: false,
        message: 'الرجاء إدخال جميع الحقول المطلوبة (الاسم، رقم الهاتف، الدورة المحددة)' 
      });
    }

    if (!selectedAppointments || selectedAppointments.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'الرجاء اختيار موعد واحد على الأقل' 
      });
    }

    // Validate experience exists
    const experience = await Experience.findById(selectedCourseId);
    if (!experience) {
      return res.status(404).json({ 
        success: false,
        message: 'الدورة المحددة غير موجودة' 
      });
    }

    // Find or create user by phone
    const normalizedPhone = mobileNumber.replace(/^0/, '+966');
    let user = await User.findOne({ phone: normalizedPhone });
    
    if (!user) {
      // Create new user
      user = new User({
        name: fullName,
        phone: normalizedPhone,
        isActive: true
      });
      await user.save();
    }
    // If user exists, use existing user without updating to avoid conflicts

    // Check for existing booking conflicts for each appointment
    for (const appointment of selectedAppointments) {
      const existingBooking = await Booking.findOne({ 
        experienceId: selectedCourseId,
        date: new Date(appointment.date),
        timeSlot: appointment.timeSlot,
        bookingStatus: { $ne: 'cancelled' }
      });

      if (existingBooking) {
        return res.status(409).json({ 
          success: false,
          message: `يوجد حجز آخر لنفس الدورة في تاريخ ${appointment.date} والفترة ${appointment.timeSlot}` 
        });
      }
    }

    // Create bookings for each selected appointment
    const bookings = [];
    for (const appointment of selectedAppointments) {
      const booking = new Booking({
        userId: user._id,
        userName: fullName,
        userPhone: mobileNumber,
        userEmail: user.email || '',
        experienceType: 'day_visit',
        experienceId: selectedCourseId,
        date: new Date(appointment.date),
        timeSlot: appointment.timeSlot,
        amount: experience.price,
        notes: notes || '',
        paymentStatus: 'pending',
        bookingStatus: 'confirmed',
        bookingType: 'horse_training',
        horseTrainingDetails: {
          parentName: parentName,
          age: parseInt(age),
          previousTraining: previousTraining,
          numberPersons: numberPersons,
          selectedCategoryId: selectedCategoryId,
          agreedToTerms: agreedToTerms
        }
      });

      await booking.save();
      bookings.push(booking);
    }
    
    // Send confirmation to client
    if (mobileNumber) {
      const formattedPhone = mobileNumber.startsWith('+') ? mobileNumber : `+966${mobileNumber.replace(/^0/, '')}`;
      await sendBookingConfirmation({
        phone: formattedPhone,
        bookingId: bookings[0]._id,
        experienceName: experience.title || 'تدريب الفروسية',
        date: bookings[0].date,
        timeSlot: bookings[0].timeSlot,
        appointmentsCount: bookings.length
      });
    }
    
    // Notify admin for each booking
    for (const booking of bookings) {
      const populatedBooking = await Booking.findById(booking._id)
        .populate('experienceId')
        .populate('userId', 'name phone email');
      await notifyAdminNewBooking(populatedBooking);
    }

    res.status(201).json({
      success: true,
      message: `تم إنشاء ${bookings.length} حجز لتدريب الفروسية بنجاح`,
      bookings: bookings,
      totalBookings: bookings.length
    });

  } catch (error) {
    console.error('Error creating horse training booking:', error);
    res.status(500).json({ 
      success: false,
      message: 'حدث خطأ أثناء إنشاء حجز تدريب الفروسية',
      error: error.message 
    });
  }
};

// POST /api/bookings/plants
export const createBookingPlants = async (req, res) => {
  try {
    const {
      totalAmount,
      customerName,
      customerEmail,
      customerPhone,
      orderType,
      paymentMethod,
      recipientPerson: {
        recipientName,
        phoneNumber: recipientPhone,
        message: recipientMessage,
        deliveryDate: recipientDeliveryDate
      },
      deliveryAddress: {
        district,
        city,
        streetName,
        addressDetails
      },
      deliveryDate,
      deliveryTime,
      cardDetails: {
        cardNumber,
        expiryDate,
        cvv
      },
      orderData
    } = req.body;

    // Basic validation
    if (!customerName || !customerPhone || !totalAmount || !orderData || !Array.isArray(orderData) || orderData.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'الرجاء إدخال جميع الحقول المطلوبة (اسم العميل، رقم الهاتف، المبلغ الإجمالي، بيانات الطلب)' 
      });
    }

    if (!recipientName || !deliveryDate || !district || !city) {
      return res.status(400).json({ 
        success: false,
        message: 'الرجاء إدخال جميع بيانات التوصيل المطلوبة (اسم المستلم، تاريخ التوصيل، الحي، المدينة)' 
      });
    }

    // Validate phone number format
    const phoneRegex = /^(\+966|0)?[5][0-9]{8}$/;
    const normalizedPhone = customerPhone.startsWith('+') ? customerPhone : `+966${customerPhone.replace(/^0/, '')}`;
    
    if (!phoneRegex.test(customerPhone) && !normalizedPhone.match(/^\+966[5][0-9]{8}$/)) {
      return res.status(400).json({ 
        success: false,
        message: 'رقم الهاتف غير صحيح' 
      });
    }

    // Find or create user by phone
    let user = await User.findOne({ phone: normalizedPhone });
    
    if (!user) {
      // Create new user
      user = new User({
        name: customerName,
        email: customerEmail || '',
        phone: normalizedPhone,
        isActive: true
      });
      await user.save();
    }
    // If user exists, use existing user without updating to avoid conflicts

    // Validate plants exist (if Plant model is available)
    try {
      const Plant = (await import('../models/Plant.js')).default;
      const plantIds = orderData.map(item => item.plantId);
      const plants = await Plant.find({ _id: { $in: plantIds } });
      
      if (plants.length !== plantIds.length) {
        return res.status(404).json({ 
          success: false,
          message: 'بعض النباتات المحددة غير موجودة' 
        });
      }
    } catch (error) {
      // Plant model might not exist, continue without validation
      console.log('Plant model not available, skipping plant validation');
    }

    // Calculate total from order data
    const calculatedTotal = orderData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return res.status(400).json({ 
        success: false,
        message: 'المبلغ الإجمالي غير صحيح' 
      });
    }

    // Create booking
    const booking = new Booking({
      userId: user._id,
      userName: customerName,
      userPhone: normalizedPhone,
      userEmail: customerEmail || '',
      date: new Date(deliveryDate),
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      experienceType: 'delivery',
      amount: totalAmount,
      totalPrice: totalAmount,
      totalPaid: totalAmount,
      paymentAmount: 'full',
      paymentMethod: paymentMethod || 'card',
      cardDetails: {
        lastFourDigits: cardNumber ? cardNumber.replace(/\s/g, '').slice(-4) : ''
      },
      bookingType: 'plants',
      
      // Plant order specific details
      plantOrderDetails: {
        orderType: orderType,
        recipientName: recipientName,
        recipientPhone: recipientPhone,
        recipientMessage: recipientMessage || '',
        deliveryAddress: {
          district: district,
          city: city,
          streetName: streetName,
          addressDetails: addressDetails || ''
        },
        deliveryDate: new Date(deliveryDate),
        deliveryTime: deliveryTime,
        orderItems: orderData.map(item => ({
          plantId: item.plantId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.price * item.quantity
        }))
      },
      
      notes: recipientMessage || ''
    });

    await booking.save();
    
    // Get the saved booking for response
    const savedBooking = await Booking.findById(booking._id);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء طلب النباتات بنجاح',
      booking: savedBooking
    });

  } catch (error) {
    console.error('Error creating plant booking:', error);
    res.status(500).json({ 
      success: false,
      message: 'حدث خطأ أثناء إنشاء طلب النباتات',
      error: error.message 
    });
  }
};
