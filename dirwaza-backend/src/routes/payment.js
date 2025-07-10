import express from 'express';
import { noqoodyPayService } from '../services/paymentService.js';
import languageService from '../services/languageService.js';

const router = express.Router();

// Create payment order
// Generate payment link
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

    const paymentLink = await noqoodyPayService.generatePaymentLink({
      amount,
      description,
      customerName,
      customerEmail,
      customerPhone
    });

    res.json({
      success: true,
      message: languageService.getText('payment.linkGenerated', req.language),
      data: paymentLink
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: languageService.getText('payment.linkGenerationFailed', req.language),
      error: error.message
    });
  }
});

// Get payment channels
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
