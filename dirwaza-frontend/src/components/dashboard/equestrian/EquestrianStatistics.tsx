'use client';

import React, { useState, useEffect } from 'react';
import StatisticsGrid, { StatData } from '@/components/ui/StatisticsGrid';
import { fetchEquestrianStatistics } from '@/__mocks__/equestrian.mock';

interface EquestrianStatisticsProps {
  data?: StatData[];
  loading?: boolean;
  error?: string | null;
}

export default function EquestrianStatistics({ 
  data, 
  loading = false, 
  error = null 
}: EquestrianStatisticsProps) {
  const [statsData, setStatsData] = useState<StatData[]>([]);
  const [isLoading, setIsLoading] = useState(loading);
  const [statsError, setStatsError] = useState<string | null>(error);

  useEffect(() => {
    if (data) {
      setStatsData(data);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      fetchEquestrianStatistics()
        .then(result => {
          console.log(result);
          setStatsData(result as StatData[]);
          setIsLoading(false);
        })
        .catch(() => {
          setStatsError('خطأ في تحميل الإحصائيات');
          setIsLoading(false);
        });
    }
  }, [data]);

  return (
    <StatisticsGrid
      data={statsData}
      loading={isLoading}
      error={statsError}
      loadingMessage="جاري تحميل إحصائيات الحصص..."
      errorMessage="خطأ في تحميل الإحصائيات"
      className="w-full"
      isTrend={false}
      
    />
  );
} 