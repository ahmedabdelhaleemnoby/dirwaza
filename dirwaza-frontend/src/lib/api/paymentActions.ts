"use server";

import { API_CONFIG } from "./config";

// Types for Payment Order API
export interface PaymentOrderItem {
  plantId?: string;
  name: string;
  quantity: number;
  price: number;
}

export interface PaymentOrderData {
  items?: PaymentOrderItem[];
  deliveryAddress?: string;
  giftInfo?: {
    recipientName: string;
    phoneNumber: string;
    message: string;
    deliveryDate: string;
  };
}

export interface CreateOrderRequest {
  amount: number;
  description: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: 'plants' | 'gift';
  orderData: PaymentOrderData;
}

export interface PaymentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  isNewUser: boolean;
}

export interface CreateOrderResponse {
  success: boolean;
  paymentId: string;
  paymentUrl: string;
  reference: string;
  sessionId: string;
  uuid: string;
  amount: number;
  currency: string;
  user: PaymentUser;
  expiresAt: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
}

// Helper function to get API URL
const getApiUrl = () => {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
};

// Create payment order
export async function createPaymentOrderAction(orderData: CreateOrderRequest): Promise<ApiResponse<CreateOrderResponse>> {
  try {
    const apiUrl = getApiUrl();
    
    const response = await fetch(`${apiUrl}/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result: CreateOrderResponse = await response.json();
    
    return {
      success: true,
      data: result,
      message: result.message || 'تم إنشاء رابط الدفع بنجاح'
    };
  } catch (error) {
    console.error('Create payment order error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment order',
      message: 'فشل في إنشاء طلب الدفع'
    };
  }
}

// Check payment status (for monitoring URL changes)
export async function checkPaymentStatusAction(paymentId: string): Promise<ApiResponse<any>> {
  try {
    const apiUrl = getApiUrl();
    
    const response = await fetch(`${apiUrl}/payment/status/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      data: result,
      message: 'تم جلب حالة الدفع بنجاح'
    };
  } catch (error) {
    console.error('Check payment status error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check payment status',
      message: 'فشل في جلب حالة الدفع'
    };
  }
} 