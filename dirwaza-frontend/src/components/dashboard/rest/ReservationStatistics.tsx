'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { TrendingUp, TrendingDown, Home, Users } from 'lucide-react';
import StatisticsGrid, { StatData } from '@/components/ui/StatisticsGrid';

interface ApiReservationStatData {
  occupancyRate: {
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
  };
  cancelledReservations: {
    value: number;
    change: string;
    changeType: 'positive' | 'negative';
  };
  confirmedReservations: {
    value: number;
    change: string;
    changeType: 'positive' | 'negative';
  };
  totalReservations: {
    value: string;
    change: string;
    changeType: 'positive' | 'negative';
  };
}

// Mock API function - replace with actual API call
const fetchReservationStatistics = async (): Promise<ApiReservationStatData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock data that would come from your API
  return {
    occupancyRate: {
      value: '76',
      change: '+5%',
      changeType: 'positive',
    },
    cancelledReservations: {
      value: 12,
      change: '-3%',
      changeType: 'negative',
    },
    confirmedReservations: {
      value: 86,
      change: '+12%',
      changeType: 'positive',
    },
    totalReservations: {
      value: '85%',
      change: '+12%',
      changeType: 'positive',
    },
  };
};

interface ReservationStatisticsProps {
  data?: ApiReservationStatData;
  loading?: boolean;
  error?: string | null;
}

export default function ReservationStatistics({
  data: propData,
  loading: propLoading,
  error: propError
}: ReservationStatisticsProps) {
  const t = useTranslations('RestReservations.statistics');
  const [apiData, setApiData] = useState<ApiReservationStatData | null>(null);
  const [loading, setLoading] = useState(!propData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propData) return; // Don't fetch if data is provided via props

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchReservationStatistics();
        setApiData(data);
      } catch (err) {
        setError('Failed to load reservation statistics');
        console.error('Error loading reservation statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [propData]);

  // Fallback mock data if API fails
  const fallbackData: ApiReservationStatData = {
    occupancyRate: {
      value: '76',
      change: '+5%',
      changeType: 'positive',
    },
    cancelledReservations: {
      value: 12,
      change: '-3%',
      changeType: 'negative',
    },
    confirmedReservations: {
      value: 86,
      change: '+12%',
      changeType: 'positive',
    },
    totalReservations: {
      value: '85%',
      change: '+12%',
      changeType: 'positive',
    },
  };

  const dataToUse = propData || apiData || fallbackData;
  const loadingState = propLoading !== undefined ? propLoading : loading;
  const errorState = propError !== undefined ? propError : error;

  const statisticsData: StatData[] = [
    {
      id: 'occupancyRate',
      title: t('occupancyRate'),
      value: dataToUse.occupancyRate.value,
      change: dataToUse.occupancyRate.change,
      changeType: dataToUse.occupancyRate.changeType,
      subtitle: t('monthlyAverage'),
      icon: <TrendingUp size={32} />
    },
    {
      id: 'cancelledReservations',
      title: t('cancelledReservations'),
      value: dataToUse.cancelledReservations.value,
      change: dataToUse.cancelledReservations.change,
      changeType: dataToUse.cancelledReservations.changeType,
      subtitle: t('cancellations'),
      icon: <TrendingDown size={32} />
    },
    {
      id: 'confirmedReservations',
      title: t('confirmedReservations'),
      value: dataToUse.confirmedReservations.value,
      change: dataToUse.confirmedReservations.change,
      changeType: dataToUse.confirmedReservations.changeType,
      subtitle: t('activeReservations'),
      icon: <Home size={32} />
    },
    {
      id: 'totalReservations',
      title: t('totalReservations'),
      value: dataToUse.totalReservations.value,
      change: dataToUse.totalReservations.change,
      changeType: dataToUse.totalReservations.changeType,
      subtitle: t('thisMonth'),
      icon: <Users size={32} />
    }
  ];

  return (
    <StatisticsGrid
      data={statisticsData}
      loading={loadingState}
      error={errorState}
      loadingMessage="تحميل إحصائيات الحجوزات..."
      errorMessage="خطأ في تحميل إحصائيات الحجوزات"
    />
  );
} 