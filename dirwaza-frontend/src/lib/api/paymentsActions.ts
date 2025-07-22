"use server";

import { API_CONFIG } from "./config";
import { getAdminAuthHeaders, checkAdminAuth } from "./authHelpers";

// Types للـ Payments API
export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  paymentMethod: 'creditCard' | 'debitCard' | 'bankTransfer' | 'cash' | 'applePay' | 'other';
  date: string;
  customer: string;
  invoice: string;
  currency?: string;
  type?: string;
  description?: string;
  customerEmail?: string;
  customerPhone?: string;
  processedAt?: string;
  refundedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface PaymentsPagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface PaymentsData {
  payments: Payment[];
  pagination: PaymentsPagination;
}

export interface PaymentsApiResponse {
  success: boolean;
  message: string;
  data: PaymentsData;
}

export interface PaymentsFilters {
  page?: number;
  limit?: number;
  status?: string;
  method?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Authentication helpers now imported from shared authHelpers.ts

// Build query string from filters
function buildQueryString(filters: PaymentsFilters): string {
  const params = new URLSearchParams();
  
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.status) params.append('status', filters.status);
  if (filters.method) params.append('method', filters.method);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.search) params.append('search', filters.search);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
  
  return params.toString();
}

// Get Payments List
export async function getPaymentsAction(filters: PaymentsFilters = {}) {
  try {
    // التحقق من صلاحيات الأدمن
    const authCheck = await checkAdminAuth();
    if (!authCheck.isAuthenticated) {
      return {
        success: false,
        error: authCheck.error,
        message: authCheck.error || "غير مصرح للوصول"
      };
    }

    // إعداد الـ filters الافتراضية
    const defaultFilters: PaymentsFilters = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...filters
    };

    const queryString = buildQueryString(defaultFilters);
    const url = `${API_CONFIG.BASE_URL}/dashboard/payments?${queryString}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: await getAdminAuthHeaders(),
      next: { 
        tags: ['dashboard-payments'], 
        revalidate: 60 // إعادة تحديث كل دقيقة
      }
    });
    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error: "انتهت صلاحية جلسة الأدمن",
          message: "يرجى تسجيل الدخول مرة أخرى"
        };
      }
      
      if (response.status === 403) {
        return {
          success: false,
          error: "صلاحيات غير كافية",
          message: "غير مصرح للوصول إلى هذه البيانات"
        };
      }
      
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'فشل في تحميل بيانات المدفوعات');
    }

    const result: PaymentsApiResponse = await response.json();
    
    return {
      success: true,
      data: result.data,
      message: result.message || 'تم تحميل بيانات المدفوعات بنجاح'
    };
  } catch (error) {
    console.error('Payments fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'خطأ غير متوقع',
      message: 'فشل في تحميل بيانات المدفوعات'
    };
  }
}

// Refresh payments data (for manual refresh)
export async function refreshPaymentsAction(filters: PaymentsFilters = {}) {
  try {
    const authCheck = await checkAdminAuth();
    if (!authCheck.isAuthenticated) {
      return {
        success: false,
        error: authCheck.error,
        message: authCheck.error || "غير مصرح للوصول"
      };
    }

    const defaultFilters: PaymentsFilters = {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...filters
    };

    const queryString = buildQueryString(defaultFilters);
    const url = `${API_CONFIG.BASE_URL}/dashboard/payments?${queryString}&t=${Date.now()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: await getAdminAuthHeaders(),
      cache: 'no-store' // Force fresh data
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'فشل في إعادة تحميل بيانات المدفوعات');
    }

    const result: PaymentsApiResponse = await response.json();
    
    return {
      success: true,
      data: result.data,
      message: 'تم إعادة تحميل بيانات المدفوعات بنجاح'
    };
  } catch (error) {
    console.error('Refresh payments error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'خطأ غير متوقع',
      message: 'فشل في إعادة تحميل بيانات المدفوعات'
    };
  }
} 