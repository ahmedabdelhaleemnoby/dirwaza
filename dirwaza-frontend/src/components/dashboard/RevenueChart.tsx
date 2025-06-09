'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

// Simple line chart component (you can replace with a proper charting library like recharts)
function SimpleLineChart({ data }: { data: { name: string; value: number; }[] }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const height = 200;
  const width = 600;
  const padding = 40;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
    const y = height - padding - ((point.value / maxValue) * (height - 2 * padding));
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => {
          const y = height - padding - ((percent / 100) * (height - 2 * padding));
          return (
            <g key={percent}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={y + 4}
                fontSize="12"
                fill="#6b7280"
                textAnchor="end"
              >
                {Math.round((percent / 100) * maxValue)}
              </text>
            </g>
          );
        })}

        {/* Chart lines */}
        <polyline
          points={points}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
          const y = height - padding - ((point.value / maxValue) * (height - 2 * padding));
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
            />
          );
        })}

        {/* X-axis labels */}
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
          return (
            <text
              key={index}
              x={x}
              y={height - 10}
              fontSize="12"
              fill="#6b7280"
              textAnchor="middle"
            >
              {point.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

export default function RevenueChart() {
  const t = useTranslations('Dashboard');

  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Static data for the chart
  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2800 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 7200 },
    { name: 'Jul', value: 3500 },
  ];

  const periods = [
    { key: 'daily', label: t('revenueAnalysis.daily') },
    { key: 'weekly', label: t('revenueAnalysis.weekly') },
    { key: 'monthly', label: t('revenueAnalysis.monthly') }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{t('revenueAnalysis.title')}</h2>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {periods.map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <SimpleLineChart data={chartData} />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">Revenue</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Target</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-gray-600">Orders</span>
        </div>
      </div>
    </div>
  );
}