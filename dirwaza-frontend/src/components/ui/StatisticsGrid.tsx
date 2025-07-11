'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

export interface StatData {
  id: string;
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative';
  subtitle: string;
  icon: React.ReactNode;
}

export interface StatisticsGridProps {
  data: StatData[];
  loading?: boolean;
  error?: string | null;
  loadingMessage?: string;
  errorMessage?: string;
  className?: string;
  cardClassName?: string;
  isTrend?: boolean;
  label?: React.ReactNode|null;
}

interface StatCardProps {
  stat: StatData;
  className?: string;
  isTrend?: boolean;
  label?: React.ReactNode|null;
}

export const StatCard: React.FC<StatCardProps> = ({ stat, className = '',isTrend=true,label=null }) => {
    const changeColorClass =
    stat.changeType === "positive" ? "text-emerald-600" : "text-red-500";
  const TrendIcon = stat.changeType === "positive" ? TrendingUp : TrendingDown;

  return (

    <div className={`w-full min-w-52 flex-1  shadow-sm rounded-xl bg-white h-28 sm:h-32 md:h-36 overflow-hidden shrink-0 flex flex-row items-start gap-5 p-3 sm:p-4 md:p-5 box-border border border-gray-100 hover:shadow-md transition-shadow ${className}`}>
      {/* Icon */}
      <div className="flex items-center justify-center !w-10 h-10 sm:!w-12 sm:h-12  bg-secondary rounded-lg text-white">
        {stat.icon}
      </div>
      <div className="h-full flex flex-col items-start justify-between">
        {/* Title */}
        <div className="flex flex-row items-start justify-start">
          <div className="text-gray-700 font-medium text-xs sm:text-sm md:text-base line-clamp-2">
            {stat.title}
          </div>
        </div>

        {/* Value and Change */}
        <div className="flex flex-col items-start justify-center gap-1">
          <div className="flex flex-row items-center justify-start gap-2">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-mono">
              {stat.value}
            </div>
           {isTrend&&!label ?<div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 ${changeColorClass}`}
            >
              <TrendIcon className="w-3 h-3" />
              <span className="text-xs font-medium">{stat.change}</span>
            </div>:label?label:null}
          </div>
        </div>

        {/* Subtitle */}
        <div className="flex flex-row items-start justify-start">
          <div className="text-gray-500 text-xs sm:text-sm line-clamp-1">
            {stat.subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatisticsGrid: React.FC<StatisticsGridProps> = ({
  data,
  loading = false,
  error = null,
  loadingMessage = 'Loading statistics...',
  errorMessage = 'Error loading statistics',
  className = '',
  cardClassName = '',
  isTrend=true,
  label=null
}) => {
  if (loading) {
    return (
      <div className={`w-full flex items-center justify-center  h-40 ${className}`}>
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{loadingMessage}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full flex items-center justify-center h-40 ${className}`}>
        <div className="text-red-500 text-center">
          <p>{errorMessage}</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    
    <div className={`w-full flex gap-4 flex-wrap ${className}`}>
          
       
      {data.map((stat) => (
        <StatCard
          key={stat.id}
          stat={stat}
          className={cardClassName}
          isTrend={isTrend}
          label={label}
        />
      ))}
       
    </div>
  );
};

export default StatisticsGrid; 