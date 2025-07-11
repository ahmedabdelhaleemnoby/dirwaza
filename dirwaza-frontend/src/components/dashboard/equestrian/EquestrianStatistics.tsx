'use client';

import React, { useState, useEffect } from 'react';
import StatisticsGrid, { StatData } from '@/components/ui/StatisticsGrid';
import { Calendar, X, Activity, BarChart3 } from 'lucide-react';

interface EquestrianStatisticsProps {
  data?: StatData[];
  loading?: boolean;
  error?: string | null;
}

// Mock API function - replace with actual API call
const fetchEquestrianStatistics = async (): Promise<StatData[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return [{
      id: 'total',
      title: 'إجمالي الحصص',
      value: 60,
      change: '+12%',
      changeType: 'positive',
      subtitle: 'جميع الحصص',
      icon: <BarChart3 className="w-5 h-5" />
    },
    
    
    {
      id: 'active',
      title: 'الحصص النشطة',
      value: 39,
      change: '+25%',
      changeType: 'positive',
      subtitle: 'إجمالي الحصص النشطة',
      icon: <Activity className="w-5 h-5" />
    },{
      id: 'cancelled',
      title: 'الحصص الملغاة', 
      value: 8,
      change: '-5%',
      changeType: 'negative',
      subtitle: 'إلغاؤها',
      icon: <X className="w-5 h-5" />
    },{
      id: 'scheduled',
      title: 'الحصص المجدولة',
      value: 13,
      change: '+15%',
      changeType: 'positive',
      subtitle: 'متوسط شهري',
      icon: <Calendar className="w-5 h-5" />
    },
    
  ];
};

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
          setStatsData(result);
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
    />
  );
} 