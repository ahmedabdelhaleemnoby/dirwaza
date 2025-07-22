"use client";

import { useState, useEffect, useCallback } from 'react';
import { getDashboardStatsAction, refreshDashboardStatsAction, type DashboardStats } from '@/lib/api/dashboardActions';

interface UseDashboardStatsReturn {
  data: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
  retry: () => Promise<void>;
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // جلب البيانات الأولي
  const fetchStats = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setError(null);
      } else {
        setLoading(true);
        setError(null);
      }

      const result = await getDashboardStatsAction();
      
      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        throw new Error(result.message || result.error || 'فشل في تحميل البيانات');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(errorMessage);
      console.error('Dashboard stats fetch error:', err);
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
      
      const result = await refreshDashboardStatsAction();
      
      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        throw new Error(result.message || result.error || 'فشل في إعادة تحميل البيانات');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(errorMessage);
      console.error('Dashboard stats refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // إعادة المحاولة عند الفشل
  const retry = useCallback(async () => {
    await fetchStats(false);
  }, [fetchStats]);

  // تحميل البيانات عند mount
  useEffect(() => {
    fetchStats(false);
  }, [fetchStats]);

  // تحديث تلقائي كل 5 دقائق (اختياري)
  useEffect(() => {
    if (!data || error) return;

    const interval = setInterval(() => {
      refresh();
    }, 5 * 60 * 1000); // 5 دقائق

    return () => clearInterval(interval);
  }, [data, error, refresh]);

  return {
    data,
    loading,
    error,
    refreshing,
    refresh,
    retry
  };
} 