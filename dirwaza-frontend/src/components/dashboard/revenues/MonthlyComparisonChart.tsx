'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MonthlyComparison } from '@/types/revenues';
import { fetchMonthlyComparison } from '@/mock/revenuesMockData';

interface MonthlyComparisonChartProps {
  data?: MonthlyComparison[];
  loading?: boolean;
  error?: string | null;
}

export default function MonthlyComparisonChart({
  data: propData,
  loading: propLoading,
  error: propError,
}: MonthlyComparisonChartProps) {
  const t = useTranslations('Revenues.charts');
  const [apiData, setApiData] = useState<MonthlyComparison[] | null>(null);
  const [loading, setLoading] = useState(!propData);
  const [error, setError] = useState<string | null>(null);
  const selectedMonth = 'يونيو 2025';

  useEffect(() => {
    if (propData) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchMonthlyComparison();
        setApiData(data);
      } catch (err) {
        setError('Failed to load monthly comparison');
        console.error('Error loading monthly comparison:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [propData]);

  const dataToUse = propData || apiData || [];
  const loadingState = propLoading !== undefined ? propLoading : loading;
  const errorState = propError !== undefined ? propError : error;

  // Format Y-axis tick
  const formatYAxisTick = (value: number) => {
    return `${(value / 1000).toFixed(0)} ألف`;
  };

  // Custom tooltip for the bar chart
  const CustomTooltip = (props: { active?: boolean; payload?: Array<{ dataKey: string; color: string; value: number }>; label?: string }) => {
    const { active, payload, label } = props;
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="text-gray-900 font-medium mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'currentYear' ? 'عام 2025' : 'عام 2024'}: {entry.value?.toLocaleString()} ريال
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (errorState) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-80">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading monthly comparison</p>
        </div>
      </div>
    );
  }

  if (loadingState) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-80">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-80">
      {/* Header with Month Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="rounded-lg bg-gray-100 h-10 flex items-center justify-center px-4">
            <span className="text-sm text-gray-700">{selectedMonth}</span>
          </div>

          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-gray-900">
          {t('monthlyComparison')}
        </h3>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dataToUse}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barCategoryGap="25%"
          >
            <CartesianGrid strokeDasharray="1 1" stroke="#f3f4f6" />
            <XAxis
              dataKey="month"
              axisLine={true}
              tickLine={true}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis
              axisLine={true}
              tickLine={true}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={formatYAxisTick}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => {
                return value === 'currentYear' ? t('currentYear') : t('previousYear');
              }}
            />

            <Bar
              dataKey="currentYear"
              fill="#113218"
              radius={[4, 4, 0, 0]}
              name="currentYear"
              barSize={15}
            />
            <Bar
              dataKey="previousYear"
              fill="#F03500"
              radius={[4, 4, 0, 0]}
              name="previousYear"
              barSize={15}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
