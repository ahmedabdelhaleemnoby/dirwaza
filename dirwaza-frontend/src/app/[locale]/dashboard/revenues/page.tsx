'use client';

import { Suspense, useState } from 'react';
import RevenueStatistics from '@/components/dashboard/revenues/RevenueStatistics';
import RevenueFilters from '@/components/dashboard/revenues/RevenueFilters';
import RevenueDistributionChart from '@/components/dashboard/revenues/RevenueDistributionChart';
import RevenueTrendsChart from '@/components/dashboard/revenues/RevenueTrendsChart';
import FinancialTransactionsTable from '@/components/dashboard/revenues/FinancialTransactionsTable';
import MonthlyComparisonChart from '@/components/dashboard/revenues/MonthlyComparisonChart';
import { RevenueFilters as RevenueFiltersType } from '@/types/revenues';

// Loading components for different sections
function StatisticsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-20 h-6 bg-gray-200 rounded mb-2"></div>
          <div className="w-16 h-3 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}

function TableLoading() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="w-64 h-9 bg-gray-200 rounded"></div>
        <div className="w-48 h-6 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
            <div className="w-32 h-4 bg-gray-200 rounded"></div>
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main revenues page component
export default function RevenuesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleFiltersChange = (filters: RevenueFiltersType) => {
    console.log('Filters changed:', filters);
    // Handle filter changes here
  };

  const handleExport = () => {
    console.log('Exporting revenue report...');
    // Handle export functionality
  };

  const handleRefresh = () => {
    console.log('Refreshing revenue data...');
    // Handle refresh functionality
  };

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    console.log('Search term changed:', searchTerm);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header with Filters */}
        <Suspense fallback={<div className="w-full h-24 bg-white rounded-lg animate-pulse shadow-sm"></div>}>
          <RevenueFilters
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            onRefresh={handleRefresh}
          />
        </Suspense>

        {/* Revenue Statistics Cards */}
        <Suspense fallback={<StatisticsLoading />}>
          <RevenueStatistics />
        </Suspense>

        {/* Charts Section - Side by Side */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
         

          {/* Revenue Trends Chart - Takes 7 columns on right */}
          <div className="xl:col-span-7">
            <Suspense fallback={<div className="w-full h-96 bg-white rounded-2xl animate-pulse shadow-sm"></div>}>
              <RevenueTrendsChart />
            </Suspense>
          </div> 
          {/* Revenue Distribution Chart - Takes 5 columns on left */}
          <div className="xl:col-span-5">
            <Suspense fallback={<div className="w-full h-96 bg-white rounded-2xl animate-pulse shadow-sm"></div>}>
              <RevenueDistributionChart />
            </Suspense>
          </div>
        </div>

        {/* Financial Transactions Table */}
        <Suspense fallback={<TableLoading />}>
          <FinancialTransactionsTable
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </Suspense>

        {/* Monthly Comparison Chart */}
        <Suspense fallback={<div className="w-full h-80 bg-white rounded-2xl animate-pulse shadow-sm"></div>}>
          <MonthlyComparisonChart />
        </Suspense>
      </div>
    </div>
  );
} 