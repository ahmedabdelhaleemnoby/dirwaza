import axios from 'axios';
import { createHmac } from 'crypto';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// NoqoodyPay Configuration
const NOQOODY_BASE_URL = process.env.NOQOODY_BASE_URL || 'https://noqoodypay.com/sdk';
const NOQOODY_USERNAME = process.env.NOQOODY_USERNAME || 'YOUR_NOQOODY_USERNAME';
const NOQOODY_PASSWORD = process.env.NOQOODY_PASSWORD || 'YOUR_NOQOODY_PASSWORD';
const NOQOODY_PROJECT_CODE = process.env.NOQOODY_PROJECT_CODE || 'YOUR_PROJECT_CODE';
const NOQOODY_CLIENT_SECRET = process.env.NOQOODY_CLIENT_SECRET || 'YOUR_CLIENT_SECRET';

// Validate required environment variables
const validateConfig = () => {
  const required = [
    'NOQOODY_USERNAME',
    'NOQOODY_PASSWORD',
    // 'NOQOODY_PROJECT_CODE',
    // 'NOQOODY_CLIENT_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    const errorMsg = `Missing required NoqoodyPay environment variables: ${missing.join(', ')}`;
    if (process.env.NODE_ENV === 'production') {
      console.error(`❌ ${errorMsg}`);
      process.exit(1);
    } else {
      console.warn(`⚠️  ${errorMsg}`);
    }
    return false;
  }
  return true;
};

const isConfigValid = validateConfig();

// Validate required environment variables in production
if (process.env.NODE_ENV === 'production' && (!NOQOODY_PROJECT_CODE || !NOQOODY_CLIENT_SECRET)) {
  console.error('❌ Error: Missing required NoqoodyPay environment variables. Please set NOQOODY_PROJECT_CODE and NOQOODY_CLIENT_SECRET in your .env file');
  process.exit(1);
} else if (!NOQOODY_PROJECT_CODE || !NOQOODY_CLIENT_SECRET) {
  console.warn('⚠️  Warning: NoqoodyPay environment variables not set. Payment features will be disabled.');
}

export class NoqoodyPayService {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Get an access token from NoqoodyPay
   * @returns {Promise<string>} Access token
   */
  async getAccessToken() {
    try {
      if (this.accessToken && this.tokenExpiry > Date.now()) {
        return this.accessToken;
      }

      console.log('🔹 Requesting new access token from NoqoodyPay...');
      const response = await axios.post(
        `${NOQOODY_BASE_URL}/token`,
        new URLSearchParams({
          grant_type: 'password',
          username: NOQOODY_USERNAME,
          password: NOQOODY_PASSWORD
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          timeout: 15000 // 15 seconds timeout
        }
      );
      
      if (!response.data.access_token) {
        throw new Error('No access token in response');
      }
      
      // Cache the token with 5-minute buffer before expiry
      const expiresIn = (response.data.expires_in || 1209599) * 1000; // Default to ~14 days in ms
      this.tokenExpiry = Date.now() + expiresIn - 300000; // 5 minutes buffer
      this.accessToken = response.data.access_token;
      
      console.log('✅ Successfully obtained access token');
      return this.accessToken;
      
    } catch (error) {
      console.error('❌ Error getting access token:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        isAxiosError: error.isAxiosError
      });
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Generate a secure hash for NoqoodyPay
   * @param {Object} data - Payment data
   * @returns {string} SHA256 hash
   */
  generateSecureHash(data) {
    try {
      const { CustomerEmail, CustomerName, CustomerMobile, Description, ProjectCode, Reference } = data;
      const hashString = `${CustomerEmail}${CustomerName}${CustomerMobile}${Description}${ProjectCode}${Reference}`;
      
      const hmac = createHmac('sha256', NOQOODY_CLIENT_SECRET);
      hmac.update(hashString);
      return hmac.digest('hex');
    } catch (error) {
      console.error('❌ Error generating secure hash:', error);
      throw new Error('Failed to generate secure hash');
    }
  }

  /**
   * Generate a payment link with NoqoodyPay
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Payment URL and reference
   */
  async generatePaymentLink(paymentData) {
    if (!isConfigValid) {
      throw new Error('Payment gateway is not properly configured');
    }

    try {
      console.log('🔹 generatePaymentLink called with data:', JSON.stringify(paymentData, null, 2));
      
      // Extract and validate required fields
      const { amount, description, customerName, customerEmail, customerPhone } = paymentData || {};
      
      // Generate a unique reference if not provided
      const reference = paymentData.reference || `DIRW-${Date.now()}`;
      
      console.log('🔹 Generated reference:', reference);

      // Validate required fields with detailed error messages
      const missingFields = [];
      if (!amount) missingFields.push('amount');
      if (!description) missingFields.push('description');
      if (!customerName) missingFields.push('customerName');
      if (!customerEmail) missingFields.push('customerEmail');
      if (!customerPhone) missingFields.push('customerPhone');
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required payment data: ${missingFields.join(', ')}`);
      }

      // Clean and prepare data
      const cleanDescription = description.substring(0, 40).replace(/[^a-zA-Z0-9 ]/g, '');
      const amountValue = parseFloat(amount).toFixed(2);
      
      // Prepare base request data
      const requestData = {
        ProjectCode: NOQOODY_PROJECT_CODE,
        Description: cleanDescription,
        Amount: amountValue,
        CustomerEmail: customerEmail,
        CustomerMobile: customerPhone,
        CustomerName: customerName,
        Reference: reference
      };

      // Generate secure hash
      requestData.SecureHash = this.generateSecureHash({
        ...requestData,
        CustomerMobile: customerPhone // Ensure mobile is included in hash
      });
      
      console.log('🔹 Request data with secure hash:', JSON.stringify(requestData, null, 2));

      // Get access token
      console.log('🔹 Getting access token...');
      const token = await this.getAccessToken();
      
      if (!token) {
        throw new Error('Failed to obtain access token');
      }
      console.log('🔹 Successfully obtained access token');
      
      // Make API request
      console.log('🔹 Sending request to NoqoodyPay...');
      const response = await axios.post(
        `${NOQOODY_BASE_URL}/api/PaymentLink/GenerateLinks`,
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 30000 // 30 seconds timeout
        }
      );
      
      console.log('🔹 NoqoodyPay response:', JSON.stringify(response.data, null, 2));

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to generate payment link');
      }

      return {
        paymentUrl: response.data.PaymentUrl,
        reference: response.data.Reference,
        sessionId: response.data.SessionId,
        uuid: response.data.Uuid,
        success: true
      };
    } catch (error) {
      console.error('❌ Error in generatePaymentLink:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        requestData: error.config?.data ? JSON.parse(error.config.data) : null
      });
      throw new Error(`Payment link generation failed: ${error.message}`);
    }
  }

  async getPaymentStatus(reference) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get(
        `${NOQOODY_BASE_URL}/api/Members/GetTransactionDetailStatusByClientReference/`,
        {
          params: { ReferenceNo: reference },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get payment status');
      }

      return {
        transactionId: response.data.TransactionID,
        status: response.data.TransactionStatus,
        message: response.data.TransactionMessage,
        amount: response.data.Amount,
        reference: response.data.Reference,
        date: response.data.TransactionDate,
        isSuccess: response.data.TransactionStatus === '0000'
      };
    } catch (error) {
      console.error('❌ Error getting payment status:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(`Failed to get payment status: ${error.message}`);
    }
  }

  async getPaymentChannels(sessionId, uuid) {
    try {
      const token = await this.getAccessToken();
      
      const response = await axios.get(
        `${NOQOODY_BASE_URL}/api/PaymentLink/PaymentChannels`,
        {
          params: { SessionID: sessionId, uuid },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          timeout: 10000
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to get payment channels');
      }

      return {
        channels: response.data.PaymentChannels,
        transactionDetails: response.data.TransactionDetail
      };
    } catch (error) {
      console.error('❌ Error getting payment channels:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(`Failed to get payment channels: ${error.message}`);
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

  /**
   * Get user settings including available payment services
   * @returns {Promise<Object>} User settings with payment services
   */
  async getUserSettings() {
    if (!isConfigValid) {
      throw new Error('Payment gateway is not properly configured');
    }

    try {
      console.log('🔹 Fetching user settings from NoqoodyPay...');
      
      // Get access token
      const token = await this.getAccessToken();
      
      if (!token) {
        throw new Error('Failed to obtain access token');
      }

      // Make API request to get user settings
      const response = await axios.get(
        `${NOQOODY_BASE_URL}/api/Members/GetUserSettings`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          timeout: 15000 // 15 seconds timeout
        }
      );

      if (!response.data.success) {
        throw new Error(`API Error: ${response.data.message || 'Failed to fetch user settings'}`);
      }

      console.log('✅ Successfully fetched user settings');
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching user settings:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });
      throw new Error(`Failed to fetch user settings: ${error.message}`);
    }
  }

  /**
   * Get available payment channels from user settings
   * @returns {Promise<Array>} Array of available payment services
   */
  async getPaymentChannels() {
    try {
      const userSettings = await this.getUserSettings();
      
      if (!userSettings.UserProjects || userSettings.UserProjects.length === 0) {
        return [];
      }

      // Extract services from the first active project
      const activeProject = userSettings.UserProjects.find(project => project.IsActive);
      if (!activeProject || !activeProject.ServicesList) {
        return [];
      }

      // Filter and format active services
      const activeServices = activeProject.ServicesList
        .filter(service => service.IsActive)
        .map(service => ({
          id: service.ID,
          serviceId: service.ServiceID,
          name: service.ServiceName,
          description: service.ServiceDescription,
          redirectUrl: service.RedirctUrl,
          isActive: service.IsActive
        }));

      return activeServices;
      
    } catch (error) {
      console.error('❌ Error getting payment channels:', error.message);
      throw new Error('Failed to get payment channels');
    }
  }
}

export default new NoqoodyPayService();
