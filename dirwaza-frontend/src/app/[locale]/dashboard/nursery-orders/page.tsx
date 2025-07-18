'use client';

import React from 'react';

import OrderStatistics from '@/components/dashboard/nursery/OrderStatistics';
import InventoryStatus from '@/components/dashboard/nursery/InventoryStatus';
import OrdersTable from '@/components/dashboard/nursery/OrdersTable';
import OrderFilters from '@/components/dashboard/nursery/OrderFilters';
import ComingSoonOverlay from '@/components/ui/ComingSoonOverlay';

export default function NurseryOrdersPage() {

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-3 sm:p-4 md:p-6 box-border mix-blend-normal text-right text-xs sm:text-sm text-darkslategray-200 font-ibm-plex-sans-arabic">
      {/* Statistics Cards Section */}
      <div className="w-full max-w-7xl flex flex-row items-start justify-center pb-4 sm:pb-6 ">
        <OrderStatistics />
      </div>

      {/* Inventory Status Section */}
      <div className="w-full max-w-7xl relative flex flex-row items-start justify-center pb-4 sm:pb-6 text-center text-sm sm:text-base text-white font-ibm-plex-sans">
        <InventoryStatus />
        <ComingSoonOverlay visible={true} />

      </div>

      {/* Filters Section */}
      <div className="w-full max-w-7xl flex flex-row items-start justify-center py-3 sm:py-4 text-center text-sm text-darkslategray-100">
        <OrderFilters />
      </div>

      {/* Orders Table */}
      <div className="w-full max-w-7xl flex flex-row items-start justify-center">
        <OrdersTable />
      </div>
    </div>
  );
} 