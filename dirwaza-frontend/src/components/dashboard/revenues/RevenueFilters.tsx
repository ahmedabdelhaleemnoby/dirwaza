'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Download, RefreshCw, ChevronDown } from 'lucide-react';
import { RevenueFilters as RevenueFiltersType } from '@/types/revenues';

interface RevenueFiltersProps {
  onFiltersChange?: (filters: RevenueFiltersType) => void;
  onExport?: () => void;
  onRefresh?: () => void;
}

export default function RevenueFilters({
  onFiltersChange,
  onExport,
  onRefresh
}: RevenueFiltersProps) {
  const t = useTranslations('Revenues.filters');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [service, setService] = React.useState('');
  const [dateFrom, setDateFrom] = React.useState('');
  const [dateTo, setDateTo] = React.useState('');

  const handleFiltersChange = React.useCallback(() => {
    onFiltersChange?.({
      service,
      dateFrom,
      dateTo,
      searchTerm: ''
    });
  }, [service, dateFrom, dateTo, onFiltersChange]);

  React.useEffect(() => {
    handleFiltersChange();
  }, [handleFiltersChange]);

  const serviceOptions = [
    { value: '', label: t('allServices') },
    { value: 'equestrian', label: 'الفروسية' },
    { value: 'nursery', label: 'المشتل' },
    { value: 'rest', label: 'الاستراحات' }
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Side - Filter Controls */}
        <div className="flex flex-row items-center gap-4 flex-wrap">
          {/* From Date */}
          <div className="flex flex-col items-start gap-1">
            <label className="text-xs text-gray-600">{t('fromDate')}</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-32 h-8 rounded-md bg-white border border-gray-200 px-2 text-xs"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col items-start gap-1">
            <label className="text-xs text-gray-600">{t('toDate')}</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-32 h-8 rounded-md bg-white border border-gray-200 px-2 text-xs"
            />
          </div>

          {/* Service Filter */}
          <div className="relative flex flex-col items-start gap-1">
            <label className="text-xs text-gray-600">{t('service')}</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-40 h-10 rounded-lg bg-white border border-gray-200 px-3 text-sm appearance-none cursor-pointer"
              style={{ direction: isRTL ? 'rtl' : 'ltr' }}
            >
              {serviceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className={`absolute bottom-1/4 transform translate-y-1/4 w-4 h-4 text-gray-400 pointer-events-none ${isRTL ? 'left-3' : 'right-3'}`} />
          </div>
        </div>

        {/* Right Side - Export and Update Buttons */}
        <div className="flex flex-row items-center gap-3">
          <button
            onClick={onExport}
            className="rounded-lg bg-secondary h-10 flex flex-row items-center justify-center py-2 px-4 text-white font-medium gap-2 hover:bg-secondary/90 transition-colors text-sm"
          >
            <span>{t('exportReport')}</span>
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={onRefresh}
            className="rounded-lg bg-gray-100 h-10 flex flex-row items-center justify-center py-2 px-4 text-gray-700 font-medium gap-2 hover:bg-gray-200 transition-colors text-sm"
          >
            <span>{t('update')}</span>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 