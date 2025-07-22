"use server";

import { API_CONFIG } from "./config";
import { getAdminAuthHeaders, checkAdminAuth } from "./authHelpers";

// Types للـ Dashboard Stats
export interface DashboardStats {
  equestrianBookings: {
    count: number;
    label: string;
    labelEn: string;
    status: string;
    statusEn: string;
    change: number;
    icon: string;
    color: string;
  };
  restBookings: {
    count: number;
    label: string;
    labelEn: string;
    status: string;
    statusEn: string;
    change: number;
    icon: string;
    color: string;
  };
  shipments: {
    count: number;
    label: string;
    labelEn: string;
    status: string;
    statusEn: string;
    change: number;
    icon: string;
    color: string;
  };
  plantOrders: {
    count: number;
    label: string;
    labelEn: string;
    status: string;
    statusEn: string;
    change: number;
    icon: string;
    color: string;
  };
  summary: {
    totalUsers: number;
    totalExperiences: number;
    totalRevenue: number;
    currency: string;
  };
}

export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

// Authentication helpers now imported from shared authHelpers.ts

// Get Dashboard Stats
export async function getDashboardStatsAction() {
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

    const response = await fetch(`${API_CONFIG.BASE_URL}/dashboard/stats`, {
      method: 'GET',
      headers: await getAdminAuthHeaders(),
      next: { 
        tags: ['dashboard-stats'], 
        revalidate: 300 // إعادة تحديث كل 5 دقائق
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
      throw new Error(errorData.message || 'فشل في تحميل إحصائيات لوحة التحكم');
    }

    const result: DashboardApiResponse = await response.json();
    
    return {
      success: true,
      data: result.data,
      message: result.message || 'تم تحميل الإحصائيات بنجاح'
    };
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'خطأ غير متوقع',
      message: 'فشل في تحميل إحصائيات لوحة التحكم'
    };
  }
}

// Refresh dashboard stats (for manual refresh)
export async function refreshDashboardStatsAction() {
  try {
    const authCheck = await checkAdminAuth();
    if (!authCheck.isAuthenticated) {
      return {
        success: false,
        error: authCheck.error,
        message: authCheck.error || "غير مصرح للوصول"
      };
    }

    // Use cache-busting technique
    const response = await fetch(`${API_CONFIG.BASE_URL}/dashboard/stats?t=${Date.now()}`, {
      method: 'GET',
      headers: await getAdminAuthHeaders(),
      cache: 'no-store' // Force fresh data
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'فشل في إعادة تحميل الإحصائيات');
    }

    const result: DashboardApiResponse = await response.json();
    
    return {
      success: true,
      data: result.data,
      message: 'تم إعادة تحميل الإحصائيات بنجاح'
    };
  } catch (error) {
    console.error('Refresh dashboard stats error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'خطأ غير متوقع',
      message: 'فشل في إعادة تحميل الإحصائيات'
    };
  }
} 