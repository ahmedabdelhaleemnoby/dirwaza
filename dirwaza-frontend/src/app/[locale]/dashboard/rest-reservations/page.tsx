'use client';

import React from 'react';
import ReservationStatistics from '@/components/dashboard/rest/ReservationStatistics';
import ReservationFilters from '@/components/dashboard/rest/ReservationFilters';
import ReservationsTable from '@/components/dashboard/rest/ReservationsTable';

export default function RestReservationsPage() {

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start p-3 sm:p-4 md:p-6 box-border text-center text-xs sm:text-sm text-darkslategray-200 font-ibm-plex-sans-arabic">
      {/* Statistics Cards Section */}
      <div className="w-full max-w-7xl flex flex-row items-start justify-center pb-4 sm:pb-6">
        <ReservationStatistics />
      </div>

      {/* Filters Section */}
      <div className="w-full max-w-7xl flex flex-row items-start justify-center pb-2 text-center text-sm text-darkslategray-100">
        <ReservationFilters />
      </div>

      {/* Reservations Table */}
      <div className="w-full max-w-7xl flex flex-row items-start justify-center">
        <ReservationsTable />
      </div>
    </div>
  );
} 