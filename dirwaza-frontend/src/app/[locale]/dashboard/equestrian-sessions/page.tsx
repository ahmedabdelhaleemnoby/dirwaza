import React from 'react';
import { Metadata } from 'next';
import EquestrianStatistics from '@/components/dashboard/equestrian/EquestrianStatistics';
import EquestrianFilters from '@/components/dashboard/equestrian/EquestrianFilters';
import WeeklyCalendar from '@/components/dashboard/equestrian/WeeklyCalendar';
import EquestrianTable from '@/components/dashboard/equestrian/EquestrianTable';

export const metadata: Metadata = {
  title: 'حصص الفروسية | لوحة التحكم - دروازة',
  description: 'إدارة وتنظيم حصص تدريب الفروسية في مزرعة دروازة',
};

export default function EquestrianSessionsPage() {

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[71rem] mx-auto space-y-8">
    
        {/* Statistics Section */}
        <section aria-label="إحصائيات حصص الفروسية">
          <EquestrianStatistics />
        </section>

        {/* Weekly Calendar Section */}
        <section aria-label="الجدول الأسبوعي للحصص">
          <WeeklyCalendar />
        </section>

        {/* Filters Section */}
        <section aria-label="فلاتر الحصص">
          <EquestrianFilters />
        </section>

        {/* Sessions Table Section */}
        <section aria-label="جدول الحصص القادمة">
          <EquestrianTable />
        </section>
      </div>
    </div>
  );
} 