import express from 'express';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import languageService from '../services/languageService.js';
import { noqoodyPayService } from '../services/paymentService.js';

const router = express.Router();

// Create payment order
// Generate payment link with user management
router.post('/link', async (req, res) => {
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

    // Find or create user
    let user = await User.findOne({ phone: customerPhone });
    
    if (!user) {
      user = await User.create({
        phone: customerPhone,
        name: customerName,
        email: customerEmail,
        isActive: true
      });
    } else {
      // Update user info if different
      if (user.name !== customerName || user.email !== customerEmail) {
        user.name = customerName;
        user.email = customerEmail;
        await user.save();
      }
    }

    // Generate payment link
    const paymentLink = await noqoodyPayService.generatePaymentLink({
      amount,
      description,
      customerName,
      customerEmail,
      customerPhone
    });

    // Create payment record
    const payment = await Payment.create({
      userId: user._id,
      amount: parseFloat(amount),
      description,
      sessionId: paymentLink.SessionID,
      uuid: paymentLink.UUID,
      paymentLink: paymentLink.PaymentLink,
      metadata: {
        customerName,
        customerEmail,
        customerPhone
      }
    });

    res.json({
      success: true,
      message: languageService.getText('payment.linkGenerated', req.language),
      data: {
        paymentLink: paymentLink.PaymentLink,
        sessionId: paymentLink.SessionID,
        uuid: paymentLink.UUID,
        paymentId: payment._id,
        userId: user._id
      }
    });
  } catch (error) {
    console.error('❌ Error generating payment link:', error);
    res.status(500).json({
      success: false,
      message: languageService.getText('payment.linkGenerationFailed', req.language),
      error: error.message
    });
  }
});

// Get payment channels with payment status
router.get('/channels/:sessionId/:uuid', async (req, res) => {
  try {
    const { sessionId, uuid } = req.params;
    
    // Get channels
    const channels = await noqoodyPayService.getPaymentChannels(sessionId, uuid);
    
    // Get payment record
    const payment = await Payment.findOne({ sessionId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: languageService.getText('payment.notFound', req.language)
      });
    }

    res.json({
      success: true,
      message: languageService.getText('payment.channelsRetrieved', req.language),
      data: {
        channels,
        paymentStatus: payment.paymentStatus,
        userId: payment.userId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: languageService.getText('payment.channelsRetrievalFailed', req.language),
      error: error.message
    });
  }
});

// Get payment channels without payment status
router.get('/channels/:sessionId/:uuid', async (req, res) => {
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
      message: languageService.getText('payment.refundFailed', req.language),
      error: error.message
    });
  }
});

export default router;
