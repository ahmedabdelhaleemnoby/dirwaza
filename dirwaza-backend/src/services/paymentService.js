import axios from 'axios';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const NOQOODY_BASE_URL = 'https://noqoodypay.com/sdk';
const NOQOODY_USERNAME = 'CHOICESDESIGNS';
const NOQOODY_PASSWORD = '5e*L!3Nz';
const NOQOODY_PROJECT_CODE = process.env.NOQOODY_PROJECT_CODE;
const NOQOODY_CLIENT_SECRET = process.env.NOQOODY_CLIENT_SECRET;

const generateSecureHash = (data) => {
  const text = `${data.CustomerEmail}${data.CustomerName}${data.CustomerMobile}${data.Description}${NOQOODY_PROJECT_CODE}${data.Reference}${data.Amount}`;
  return require('crypto').createHmac('sha256', NOQOODY_CLIENT_SECRET)
    .update(text)
    .digest('hex');
};

export class NoqoodyPayService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    try {
      // Check if token is still valid
      if (this.accessToken && this.tokenExpiry > Date.now()) {
        return this.accessToken;
      }

      // Get new token
      const response = await axios.post(`${NOQOODY_BASE_URL}/token`, {
        grant_type: 'password',
        username: NOQOODY_USERNAME,
        password: NOQOODY_PASSWORD
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { access_token, expires_in } = response.data;
      this.accessToken = access_token;
      this.tokenExpiry = Date.now() + (expires_in * 1000) - 300000; // 5 minutes buffer

      return access_token;
    } catch (error) {
      console.error('❌ Error getting NoqoodyPay access token:', error.message);
      throw new Error('Failed to get payment token');
    }
  }

  async generatePaymentLink(paymentData) {
    try {
      const { amount, description, customerName, customerEmail, customerPhone } = paymentData;

      // Validate amount format
      const formattedAmount = parseFloat(amount).toFixed(2);
      if (isNaN(formattedAmount)) {
        throw new Error('Invalid amount format');
      }

      // Generate reference ID
      const referenceId = `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Prepare payment data
      const paymentRequest = {
        ProjectCode: NOQOODY_PROJECT_CODE,
        Description: description.substring(0, 40).replace(/[^a-zA-Z0-9\s]/g, ''),
        Amount: formattedAmount,
        CustomerEmail: customerEmail,
        CustomerMobile: customerPhone,
        CustomerName: customerName,
        Reference: referenceId
      };

      // Generate secure hash
      paymentRequest.SecureHash = generateSecureHash(paymentRequest);

      const token = await this.getAccessToken();

      const response = await axios.post(`${NOQOODY_BASE_URL}/api/PaymentLink/GenerateLinks`, paymentRequest, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error generating payment link:', error.message);
      throw new Error('Failed to generate payment link');
    }
  }

  // Add payment channels API
  async getPaymentChannels(sessionId, uuid) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(`${NOQOODY_BASE_URL}/api/PaymentChannels`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'SessionID': sessionId,
          'UUID': uuid
        }
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error getting payment channels:', error.message);
      throw new Error('Failed to get payment channels');
    }
  }

  async createPaymentOrder(orderData) {
    try {
      const token = await this.getAccessToken();

      const order = {
        orderId: uuidv4(),
        amount: orderData.amount,
        currency: 'SAR',
        description: orderData.description,
        customer: {
          name: orderData.customerName,
          email: orderData.customerEmail,
          phone: orderData.customerPhone
        },
        callbackUrl: `${process.env.BASE_URL}/api/payment/callback`,
        successUrl: `${process.env.BASE_URL}/payment/success`,
        failureUrl: `${process.env.BASE_URL}/payment/failure`
      };

      const response = await axios.post(`${NOQOODY_BASE_URL}/order`, order, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error creating payment order:', error.message);
      throw new Error('Failed to create payment order');
    }
  }

  async verifyPayment(paymentId) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.get(`${NOQOODY_BASE_URL}/order/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error verifying payment:', error.message);
      throw new Error('Failed to verify payment');
    }
  }

  async handleCallback(requestData) {
    try {
      const token = await this.getAccessToken();

      // Verify the payment status
      const response = await axios.get(`${NOQOODY_BASE_URL}/order/${requestData.orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const payment = response.data;

      // Process the payment based on its status
      if (payment.status === 'completed') {
        // Update order status in your database
        // Send confirmation email/SMS
        return {
          success: true,
          message: 'Payment successfully completed',
          data: payment
        };
      } else if (payment.status === 'failed') {
        throw new Error('Payment failed');
      } else if (payment.status === 'pending') {
        throw new Error('Payment is still pending');
      }

    } catch (error) {
      console.error('❌ Error handling payment callback:', error.message);
      throw error;
    }
  }

  async refundPayment(paymentId, amount) {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(`${NOQOODY_BASE_URL}/refund`, {
        orderId: paymentId,
        amount
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error processing refund:', error.message);
      throw new Error('Failed to process refund');
    }
  }
}

export const noqoodyPayService = new NoqoodyPayService();
