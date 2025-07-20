import express from 'express';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import noqoodyPay from '../services/paymentService.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendErrorResponse, sendSuccessResponse } from '../utils/response.js';
import languageService from '../services/languageService.js';

const router = express.Router();

/**
 * Middleware to validate payment request data
 */
const validatePaymentData = (req, res, next) => {
  const { amount, description, customerName, customerEmail, customerPhone } = req.body;
  
  // Validate amount
  if (!amount || isNaN(amount) || amount <= 0) {
    return sendErrorResponse(res, 400, 'Amount must be a positive number');
  }
  
  // Validate description
  if (!description || typeof description !== 'string' || description.trim() === '') {
    return sendErrorResponse(res, 400, 'Description is required');
  }
  
  // Validate customer name
  if (!customerName || typeof customerName !== 'string' || customerName.trim() === '') {
    return sendErrorResponse(res, 400, 'Customer name is required');
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!customerEmail || !emailRegex.test(customerEmail)) {
    return sendErrorResponse(res, 400, 'Valid customer email is required');
  }
  
  // Validate phone number format
  const phoneRegex = /^\+?[0-9\s-]{8,}$/;
  if (!customerPhone || !phoneRegex.test(customerPhone)) {
    return sendErrorResponse(res, 400, 'Valid customer phone number is required');
  }
  
  // Sanitize and attach to request
  req.paymentData = {
    amount: parseFloat(amount).toFixed(3),
    description: description.substring(0, 40).trim(),
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim(),
    customerPhone: customerPhone.trim(),
    reference: req.body.reference || `DIRW-${Date.now()}`
  };
  
  next();
};

/**
 * @route   POST /api/payment/link
 * @desc    Create a payment link
 * @access  Private
 */
router.post('/link', authenticateToken, validatePaymentData, async (req, res) => {
  try {
    const { paymentData } = req;
    const userId = req.user?.id;
    
    console.log(`🔹 Creating payment link for user: ${userId}`);
    
    // Generate payment link
    console.log('🔹 Generating payment link...');
    const paymentResult = await noqoodyPay.generatePaymentLink({
      ...paymentData,
      userId
    });
    
    if (!paymentResult.success) {
      throw new Error(paymentResult.message || 'Failed to generate payment link');
    }
    
    console.log('✅ Payment link generated successfully:', { 
      reference: paymentResult.reference,
      amount: paymentData.amount 
    });

    // Create payment record
    const payment = new Payment({
      userId,
      reference: paymentResult.reference,
      amount: paymentData.amount,
      currency: 'SAR',
      status: 'pending',
      paymentMethod: 'noqoody',
      metadata: {
        sessionId: paymentResult.sessionId,
        uuid: paymentResult.uuid,
        customerEmail: paymentData.customerEmail,
        customerPhone: paymentData.customerPhone,
        description: paymentData.description,
        paymentUrl: paymentResult.paymentUrl
      }
    });

    await payment.save();
    console.log('✅ Payment record created:', payment.reference);

    // Return success response
    return sendSuccessResponse(res, 201, {
      success: true,
      message: 'Payment link generated successfully',
      data: {
        paymentUrl: paymentResult.paymentUrl,
        reference: paymentResult.reference,
        amount: paymentData.amount,
        currency: 'SAR',
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('❌ Payment processing error:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    return sendErrorResponse(
      res, 
      error.statusCode || 500, 
      `Payment processing failed: ${error.message}`
    );
  }
});

/**
 * @route   POST /api/payment/create-order
 * @desc    Create payment order with user management (find or create user by phone)
 * @access  Public
 */
router.post('/create-order', async (req, res) => {
  try {
    const { amount, description, customerName, customerEmail, customerPhone, orderType, orderData } = req.body;
    
    // Validate required fields
    if (!amount || !description || !customerName || !customerEmail || !customerPhone) {
      return sendErrorResponse(res, 400, 
        languageService.getText('validation.required', req.headers['accept-language'] || 'ar', {
          field: 'amount, description, customerName, customerEmail, customerPhone'
        })
      );
    }
    
    // Validate amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return sendErrorResponse(res, 400, 'Invalid amount. Amount must be a positive number.');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return sendErrorResponse(res, 400, 'Invalid email format.');
    }
    
    // Validate phone format (basic validation)
    const phoneRegex = /^\+?[0-9\s-]{8,}$/;
    if (!phoneRegex.test(customerPhone)) {
      return sendErrorResponse(res, 400, 'Invalid phone number format.');
    }
    
    console.log(`🔹 Processing payment order for phone: ${customerPhone}`);
    
    // Step 1: Find or create user by phone number
    let user;
    try {
      user = await User.findOne({ phone: customerPhone });
      
      if (user) {
        console.log(`✅ Found existing user: ${user._id}`);
        
        // Update user info if provided data is more complete
        let userUpdated = false;
        if (!user.name && customerName) {
          user.name = customerName;
          userUpdated = true;
        }
        if (!user.email && customerEmail) {
          user.email = customerEmail;
          userUpdated = true;
        }
        
        if (userUpdated) {
          await user.save();
          console.log(`✅ Updated user information`);
        }
      } else {
        // Create new user
        console.log(`🔹 Creating new user for phone: ${customerPhone}`);
        user = new User({
          name: customerName,
          phone: customerPhone,
          email: customerEmail,
          isActive: true, // Set as active since they're making a payment
          role: 'user'
        });
        
        await user.save();
        console.log(`✅ Created new user: ${user._id}`);
      }
    } catch (error) {
      console.error('❌ Error managing user:', error);
      return sendErrorResponse(res, 500, 'Error processing user information.');
    }
    
    // Step 2: Generate unique reference for this payment
    const reference = `DIRW-${user._id.toString().slice(-6)}-${Date.now()}`;
    
    // Step 3: Create payment data
    const paymentData = {
      amount: numericAmount.toFixed(3), // Format to 3 decimal places for SAR
      description: description.substring(0, 40).trim(), // Limit description length
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phone,
      reference
    };
    
    console.log(`🔹 Generating payment link with reference: ${reference}`);
    
    // Step 4: Generate payment link with NoqoodyPay
    let paymentResult;
    try {
      paymentResult = await noqoodyPay.generatePaymentLink(paymentData);
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Failed to generate payment link');
      }
      
      console.log('✅ Payment link generated successfully');
    } catch (error) {
      console.error('❌ Payment link generation error:', error);
      return sendErrorResponse(res, 500, 
        `Payment link generation failed: ${error.message}`
      );
    }
    
    // Step 5: Save payment record to database
    try {
      const paymentRecord = new Payment({
        userId: user._id,
        userPhone: user.phone,
        amount: numericAmount,
        description: description,
        sessionId: paymentResult.sessionId,
        uuid: paymentResult.uuid,
        paymentLink: paymentResult.paymentUrl,
        paymentStatus: 'pending',
        paymentMethod: 'creditCard', // Using enum value from schema
        metadata: new Map([
          ['reference', reference],
          ['currency', 'SAR'],
          ['customerName', user.name],
          ['customerEmail', user.email],
          ['orderType', orderType || 'general'],
          ['orderData', JSON.stringify(orderData || {})]
        ])
      });
      
      await paymentRecord.save();
      console.log(`✅ Payment record saved: ${paymentRecord._id}`);
      
      // Step 6: Return success response
      return sendSuccessResponse(res, 200, {
        paymentId: paymentRecord._id,
        paymentUrl: paymentResult.paymentUrl,
        reference: reference,
        sessionId: paymentResult.sessionId,
        uuid: paymentResult.uuid,
        amount: numericAmount,
        currency: 'SAR',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isNewUser: !user.createdAt || (Date.now() - user.createdAt.getTime()) < 60000 // Created in last minute
        },
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
      }, 
      languageService.getText('payment.linkGenerated', req.headers['accept-language'] || 'ar')
      );
      
    } catch (error) {
      console.error('❌ Error saving payment record:', error);
      return sendErrorResponse(res, 500, 'Error saving payment information.');
    }
    
  } catch (error) {
    console.error('❌ Payment order creation error:', error);
    return sendErrorResponse(res, 500, 
      `Payment order creation failed: ${error.message}`
    );
  }
});

/**
 * @route   GET /api/payment/test-payment
 * @desc    Test payment endpoint (development only)
 * @access  Public (in development)
 */
if (process.env.NODE_ENV !== 'production') {
  router.get('/test-payment', async (req, res) => {
    try {
      // Test payment data
      const testData = {
        amount: '1.000',
        description: 'Test Payment - Dirwaza',
        customerName: 'Test User',
        customerEmail: 'test@dirwaza.com',
        customerPhone: '+97312345678',
        reference: `TEST-${Date.now()}`
      };
      
      console.log('🔹 Starting test payment with data:', JSON.stringify(testData, null, 2));
      
      try {
        // Generate payment link
        console.log('🔹 Generating test payment link...');
        const result = await noqoodyPay.generatePaymentLink(testData);
        
        if (!result.success) {
          throw new Error(result.message || 'Failed to generate test payment link');
        }
        
        // Create test payment record
        const testPayment = new Payment({
          userId: 'test-user',
          reference: result.reference,
          amount: testData.amount,
          currency: 'SAR',
          status: 'pending',
          paymentMethod: 'noqoody',
          metadata: {
            test: true,
            sessionId: result.sessionId,
            uuid: result.uuid,
            customerEmail: testData.customerEmail,
            customerPhone: testData.customerPhone,
            description: testData.description,
            paymentUrl: result.paymentUrl
          }
        });
        
        await testPayment.save();
        
        console.log('✅ Test payment record created:', testPayment.reference);
        
        return sendSuccessResponse(res, 200, {
          success: true,
          message: 'Test payment link generated',
          data: {
            paymentUrl: result.paymentUrl,
            reference: result.reference,
            paymentId: testPayment._id,
            amount: testData.amount,
            status: 'pending'
          }
        });
        
      } catch (error) {
        console.error('❌ Test payment generation error:', error);
        throw error;
      }
      
    } catch (error) {
      console.error('❌ Test payment endpoint error:', {
        error: error.message,
        stack: error.stack
      });
      
      return sendErrorResponse(
        res, 
        error.statusCode || 500, 
        `Test payment failed: ${error.message}`
      );
    }
  });
}

/**
 * @route   GET /api/payment/status/:reference
 * @desc    Get payment status by reference
 * @access  Private
 */
router.get('/status/:reference', authenticateToken, async (req, res) => {
  try {
    const { reference } = req.params;
    const userId = req.user?.id;
    
    console.log(`🔍 Fetching payment status - Reference: ${reference}, User: ${userId}`);
    
    // Find payment by reference and user ID
    const payment = await Payment.findOne({ 
      reference,
      userId
    });
    
    if (!payment) {
      console.warn(`⚠️ Payment not found - Reference: ${reference}`);
      return sendErrorResponse(res, 404, 'Payment not found');
    }
    
    // Prepare response data
    const responseData = {
      reference: payment.reference,
      amount: payment.amount,
      currency: payment.currency || 'SAR',
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      metadata: {
        description: payment.metadata?.description,
        customerEmail: payment.metadata?.customerEmail
      }
    };
    
    console.log(`✅ Payment status retrieved - ${reference}: ${payment.status}`);
    
    return sendSuccessResponse(res, 200, {
      success: true,
      data: responseData
    });
    
  } catch (error) {
    console.error('❌ Error fetching payment status:', {
      error: error.message,
      reference: req.params.reference,
      userId: req.user?.id
    });
    
    return sendErrorResponse(
      res, 
      500, 
      'Failed to retrieve payment status'
    );
  }
});

/**
 * @route   POST /api/payment/webhook/noqoody
 * @desc    Webhook for Noqoody payment status updates
 * @access  Public (No authentication - secured by webhook signature)
 */
router.post('/webhook/noqoody', express.json(), async (req, res) => {
  try {
    const signature = req.headers['x-noqoody-signature'];
    const payload = req.body;
    
    console.log('🔔 Received Noqoody webhook:', { 
      event: payload.event,
      reference: payload.reference,
      status: payload.status
    });
    
    // TODO: Implement webhook signature verification
    // const isValid = verifyWebhookSignature(signature, payload);
    // if (!isValid) {
    //   console.error('❌ Invalid webhook signature');
    //   return res.status(401).send('Invalid signature');
    // }
    
    // Find and update payment record
    const updatedPayment = await Payment.findOneAndUpdate(
      { reference: payload.reference },
      { 
        status: mapNoqoodyStatus(payload.status),
        'metadata.paymentResponse': payload,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedPayment) {
      console.error(`❌ Payment not found for reference: ${payload.reference}`);
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    
    console.log(`✅ Updated payment status to ${payload.status} for reference: ${payload.reference}`);
    
    // TODO: Trigger additional actions (email notifications, etc.)
    
    return res.status(200).json({ success: true });
    
  } catch (error) {
    console.error('❌ Webhook processing error:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    
    return res.status(500).json({ 
      success: false, 
      message: 'Webhook processing failed',
      error: error.message
    });
  }
});

/**
 * Map Noqoody status to internal status
 */
function mapNoqoodyStatus(noqoodyStatus) {
  const statusMap = {
    'PAID': 'completed',
    'COMPLETED': 'completed',
    'PENDING': 'pending',
    'FAILED': 'failed',
    'CANCELLED': 'cancelled',
    'EXPIRED': 'expired',
    'REFUNDED': 'refunded',
    'PARTIALLY_REFUNDED': 'partially_refunded'
  };
  return statusMap[noqoodyStatus] || 'unknown';
}

/**
 * @route   GET /api/payment/channels
 * @desc    Get available payment channels/services
 * @access  Public
 */
router.get('/channels', async (req, res) => {
  try {
    console.log('🔹 Fetching available payment channels...');
    
    // Get payment channels from NoqoodyPay
    const channels = await noqoodyPay.getPaymentChannels();
    
    // Format response with Arabic translations
    const formattedChannels = channels.map(channel => {
      let arabicName = channel.description;
      let arabicDescription = channel.description;
      
      // Add Arabic translations based on service type
      if (channel.name.includes('QNB-MPGS-CC') || channel.description.includes('MASTER CARD')) {
        arabicName = 'بطاقة ائتمانية';
        arabicDescription = 'بطاقة ائتمانية - QNB';
      } else if (channel.name.includes('NAPS') || channel.description.includes('NAPS')) {
        arabicName = 'بطاقة مدى';
        arabicDescription = 'بطاقة مدى - QNB NAPS';
      } else if (channel.name.includes('Apple Pay') || channel.description.includes('Apple Pay')) {
        arabicName = 'Apple Pay';
        arabicDescription = 'Apple Pay - دفع بواسطة آبل';
      } else if (channel.name.includes('GooglePay') || channel.description.includes('Google Pay')) {
        arabicName = 'Google Pay';
        arabicDescription = 'Google Pay - دفع بواسطة جوجل';
      }
      
      return {
        id: channel.id,
        serviceId: channel.serviceId,
        name: channel.name,
        nameAr: arabicName,
        description: channel.description,
        descriptionAr: arabicDescription,
        isActive: channel.isActive,
        redirectUrl: channel.redirectUrl
      };
    });
    
    console.log(`✅ Successfully fetched ${formattedChannels.length} payment channels`);
    
    return sendSuccessResponse(res, 200, {
      channels: formattedChannels,
      total: formattedChannels.length
    }, req.t ? req.t('payment.channelsRetrieved') : 'Payment channels retrieved successfully');
    
  } catch (error) {
    console.error('❌ Error fetching payment channels:', error);
    return sendErrorResponse(
      res,
      500,
      req.t ? req.t('payment.channelsRetrievalFailed') : 'Failed to retrieve payment channels',
      error.message
    );
  }
});

// Get payment channels without payment status
router.get('/channels/:sessionId/:uuid', authenticateToken, async (req, res) => {
  try {
    const { sessionId, uuid } = req.params;
    const channels = await noqoodyPayService.getPaymentChannels(sessionId, uuid);

    res.json({
      success: true,
      message: languageService.getText('payment.channelsRetrieved', req.language),
      data: channels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: languageService.getText('payment.channelsRetrievalFailed', req.language),
      error: error.message
    });
  }
});

// Create payment order
router.post('/order', async (req, res) => {
  try {
    const { amount, description, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || !description || !customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        success: false,
        message: languageService.getText('validation.required', req.language, {
          field: 'amount, description, customerName, customerEmail, customerPhone'
        })
      });
    }

    const orderData = {
      amount,
      description,
      customerName,
      customerEmail,
      customerPhone
    };

    const paymentOrder = await noqoodyPayService.createPaymentOrder(orderData);

    res.json({
      success: true,
      message: languageService.getText('payment.orderCreated', req.language),
      data: paymentOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: languageService.getText('payment.creationFailed', req.language),
      error: error.message
    });
  }
});

// Update payment status
router.post('/status', async (req, res) => {
  try {
    const { paymentId, status, transactionId, method } = req.body;

    if (!paymentId || !status) {
      return res.status(400).json({
        success: false,
        message: languageService.getText('validation.required', req.language, {
          field: 'paymentId, status'
        })
      });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: languageService.getText('payment.notFound', req.language)
      });
    }

    // Update payment status
    payment.paymentStatus = status;
    if (transactionId) payment.transactionId = transactionId;
    if (method) payment.paymentMethod = method;
    await payment.save();

    // Update user's payment history
    const user = await User.findById(payment.userId);
    if (user) {
      if (!user.paymentHistory) user.paymentHistory = [];
      user.paymentHistory.push({
        paymentId: payment._id,
        amount: payment.amount,
        description: payment.description,
        status,
        date: new Date()
      });
      await user.save();
    }

    res.json({
      success: true,
      message: languageService.getText('payment.statusUpdated', req.language),
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: languageService.getText('payment.statusUpdateFailed', req.language),
      error: error.message
    });
  }
});

// Payment callback handler
router.post('/callback', async (req, res) => {
  try {
    const requestData = req.body;

    const result = await noqoodyPayService.handleCallback(requestData);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: languageService.getText('payment.callbackFailed', req.language),
      error: error.message
    });
  }
});

// Verify payment status
router.get('/:paymentId', async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const payment = await noqoodyPayService.verifyPayment(paymentId);

    res.json({
      success: true,
      message: languageService.getText('payment.verified', req.language),
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: languageService.getText('payment.verificationFailed', req.language),
      error: error.message
    });
  }
});

// Process refund
router.post('/:paymentId/refund', async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: languageService.getText('validation.required', req.language, {
          field: 'amount'
        })
      });
    }

    const refund = await noqoodyPayService.refundPayment(paymentId, amount);

    res.json({
      success: true,
      message: languageService.getText('payment.refundSuccess', req.language),
      data: refund
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Refund processing failed',
      error: error.message
    });
  }
});



/**
 * @route   GET /api/payment/settings
 * @desc    Get NoqoodyPay user settings (Admin only)
 * @access  Private (Admin)
 */
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin (you may want to add admin middleware)
    if (!req.user || req.user.role !== 'admin') {
      return sendErrorResponse(res, 403, 'Access denied. Admin privileges required.');
    }
    
    console.log('🔹 Fetching NoqoodyPay user settings...');
    
    // Get full user settings from NoqoodyPay
    const settings = await noqoodyPay.getUserSettings();
    
    console.log('✅ Successfully fetched user settings');
    
    return sendSuccessResponse(res, settings, 'User settings retrieved successfully');
    
  } catch (error) {
    console.error('❌ Error fetching user settings:', error);
    return sendErrorResponse(
      res,
      500,
      'Failed to retrieve user settings',
      error.message
    );
  }
});

export default router;
