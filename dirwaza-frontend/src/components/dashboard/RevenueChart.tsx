'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Legend
} from 'recharts';
import PeriodButton from './PeriodButton';
import { mockRevenueChartData } from '@/__mocks__/dashboard.mock';


export default function RevenueChart() {
  const t = useTranslations('Dashboard');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const chartData = mockRevenueChartData;

  const periods = [
    { key: 'yearly', label: 'سنوي' },
    { key: 'monthly', label: 'شهري' },
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="text-gray-900 font-medium mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value?.toLocaleString()} ر.س
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom Y-axis tick formatter
  const formatYAxisTick = (value: number) => {
    return `${(value / 1000).toFixed(0)}ريال`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">تحليل الإيرادات</h2>
        <div className="flex gap-2">
          {periods.map((period) => (
            <PeriodButton
              key={period.key}
              periodKey={period.key}
              isSelected={selectedPeriod === period.key}
              onClick={() => setSelectedPeriod(period.key)}
            >
              {t(`revenueAnalysis.${period.key}`)}
            </PeriodButton>
          ))}
        </div>
      </div>

      <div className="mb-6 h-full min-h-80 " style={{ height: '300px' }} >
        <ResponsiveContainer width="100%" height="100%"  >
          <LineChart
            data={chartData}
            margin={{
              top: 15,
              right: 10,
              left: 5,
              bottom: 5,
            }}
            width={1000}
            
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" widths={"100%"} />
            <XAxis 
              dataKey="name" 
              axisLine={true}
              tickLine={true}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              axisLine={true}
              tickLine={true}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={formatYAxisTick}
              dx={-30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => {
                return t(`revenueAnalysis.${value}`);
              }}
            />

            <Line
              type="monotone"
              dataKey="operator"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 5 }}
            />
            <Line
              type="monotone"
              dataKey="training"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="rest"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#f59e0b', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      
    </div>
  );
}