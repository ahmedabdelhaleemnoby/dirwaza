"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  getPaymentsAction, 
  refreshPaymentsAction, 
  type PaymentsData, 
  type PaymentsFilters 
} from '@/lib/api/paymentsActions';

interface UsePaymentsReturn {
  data: PaymentsData | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  filters: PaymentsFilters;
  setFilters: (filters: PaymentsFilters) => void;
  updateFilter: (key: keyof PaymentsFilters, value: PaymentsFilters[keyof PaymentsFilters]) => void;
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
  resetFilters: () => void;
}

const defaultFilters: PaymentsFilters = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  status: '',
  method: '',
  startDate: '',
  endDate: '',
  search: ''
};

export function usePayments(): UsePaymentsReturn {
  const [data, setData] = useState<PaymentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFiltersState] = useState<PaymentsFilters>(defaultFilters);

  // جلب البيانات الأولي
  const fetchPayments = useCallback(async (currentFilters: PaymentsFilters, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setError(null);
      } else {
        setLoading(true);
        setError(null);
      }

      const result = await getPaymentsAction(currentFilters);
      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        throw new Error(result.message || result.error || 'فشل في تحميل البيانات');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(errorMessage);
      console.error('Payments fetch error:', err);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // إعادة تحديث البيانات باستخدام cache-busting
  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      const result = await refreshPaymentsAction(filters);
      
      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        throw new Error(result.message || result.error || 'فشل في إعادة تحميل البيانات');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(errorMessage);
      console.error('Payments refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  }, [filters]);

  // إعادة المحاولة عند الفشل
  const retry = useCallback(async () => {
    await fetchPayments(filters, false);
  }, [fetchPayments, filters]);

  // تحديث الـ filters
  const setFilters = useCallback((newFilters: PaymentsFilters) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  // تحديث فلتر واحد
  const updateFilter = useCallback((key: keyof PaymentsFilters, value: PaymentsFilters[keyof PaymentsFilters]) => {
    setFiltersState(prev => ({ 
      ...prev, 
      [key]: value,
      // إعادة تعيين الصفحة إلى 1 عند تغيير أي فلتر عدا الصفحة نفسها
      ...(key !== 'page' && { page: 1 })
    }));
  }, []);

  // إعادة تعيين الـ filters
  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  // تحميل البيانات عند mount أو تغيير filters
  useEffect(() => {
    fetchPayments(filters, false);
  }, [fetchPayments, filters]);

  // تحديث تلقائي كل دقيقة للـ payments (الصفحة الأولى فقط)
  useEffect(() => {
    if (!data || error || filters.page !== 1) return;

    const interval = setInterval(() => {
      fetchPayments(filters, true);
    }, 60 * 1000); // دقيقة واحدة

    return () => clearInterval(interval);
  }, [data, error, filters, fetchPayments]);

  return {
    data,
    loading,
    error,
    refreshing,
    filters,
    setFilters,
    updateFilter,
    refresh,
    retry,
    resetFilters
  };
} 