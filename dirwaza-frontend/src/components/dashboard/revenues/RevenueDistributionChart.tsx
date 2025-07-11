'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { RevenueDistribution } from '@/types/revenues';
import { fetchRevenueDistribution } from '@/mock/revenuesMockData';

interface RevenueDistributionChartProps {
  data?: RevenueDistribution[];
  loading?: boolean;
  error?: string | null;
}

export default function RevenueDistributionChart({
  data: propData,
  loading: propLoading,
  error: propError,
}: RevenueDistributionChartProps) {
  const t = useTranslations('Revenues.charts');
  const [apiData, setApiData] = useState<RevenueDistribution[] | null>(null);
  const [loading, setLoading] = useState(!propData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propData) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchRevenueDistribution();
        setApiData(data);
      } catch (err) {
        setError('Failed to load revenue distribution');
        console.error('Error loading revenue distribution:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [propData]);

  const dataToUse = propData || apiData || [];
  const loadingState = propLoading !== undefined ? propLoading : loading;
  const errorState = propError !== undefined ? propError : error;

  const CustomLegend = ({ payload }: { payload: { color: string; value: number }[] }) => (
    <ul className="list-none m-0 p-0 text-sm space-y-2 text-right">
      {payload.map((entry: { color: string; value: number }, index: number) => (
        <li key={`item-${index}`} className="flex items-center justify-end gap-2">
          <span
            className="w-4 h-4 rounded-sm inline-block"
            style={{ backgroundColor: entry.color }}
          ></span>
          <span className="text-gray-800">{entry.value}</span>
        </li>
      ))}
    </ul>
  );

  if (errorState) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 w-full max-w-md">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading revenue distribution</p>
        </div>
      </div>
    );
  }

  if (loadingState) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 w-full max-w-md">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 text-right">
            {t('revenueDistribution')}
          </h3>
        </div>
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 w-full max-w-md">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 text-right">
          {t('revenueDistribution')}
        </h3>
      </div>

      {/* Chart */}
      <div className="h-80 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataToUse}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius="60%"
              outerRadius="90%"
              paddingAngle={4}
              isAnimationActive={false}
            >
              {dataToUse.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              verticalAlign="middle"
              align="right"
              layout="vertical"
              content={<CustomLegend payload={dataToUse} />}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString()} ريال`, '']}
              contentStyle={{ direction: 'rtl', fontSize: '13px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
