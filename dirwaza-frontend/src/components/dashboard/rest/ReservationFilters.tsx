'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Filter, Plus } from 'lucide-react';
import FilterBar, { FilterBarAction } from '@/components/ui/FilterBar';
import { useFilterBar } from '@/components/ui/useFilterBar';

// Mock API function - replace with actual API call
const fetchReservationFilters = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    statusOptions: [
      { id: "all", label: "جميع الحالات", labelEn: "All Statuses", value: "all" },
      { id: "confirmed", label: "مؤكد", labelEn: "Confirmed", value: "confirmed" },
      { id: "pending", label: "قيد التأكيد", labelEn: "Pending Confirmation", value: "pending" },
      { id: "cancelled", label: "ملغي", labelEn: "Cancelled", value: "cancelled" },
    ],
  };
};

export default function ReservationFilters() {
  const t = useTranslations('RestReservations.filters');

  // Get locale for RTL support
  const locale = typeof window !== "undefined" 
    ? window.location.pathname.includes("/ar") ? "ar" : "en" 
    : "ar";
  const isRTL = locale === "ar";

  // Use the custom hook for filter state management
  const filterBar = useFilterBar({
    initialDropdownValues: { status: 'all' },
    apiFunction: fetchReservationFilters,
    onStateChange: (state) => {
      // Handle filter state changes here
      console.log('Reservation filter state changed:', state);
      // You can trigger API calls, update URL params, etc.
    }
  });

  // Create dropdown filters configuration
  const statusFilter = filterBar.data?.statusOptions ? filterBar.createDropdownFilters([
    {
      id: 'status',
      label: 'جميع الحالات',
      labelEn: 'All Statuses',
      icon: <Filter className="w-4 h-4" />,
      options: filterBar.data.statusOptions,
      placeholder: t('allStatuses'),
    }
  ]) : [];

  // Define actions
  const actions: FilterBarAction[] = [
    {
      id: 'addReservation',
      label: 'إضافة حجز جديد',
      labelEn: 'Add New Reservation',
      icon: <Plus className="w-4 h-4" />,
      onClick: () => {
        console.log('Add new reservation');
        // Implement add new reservation functionality
      },
      variant: 'secondary',
    }
  ];

  return (
    <FilterBar
      // Search configuration
      searchValue={filterBar.searchQuery}
      onSearchChange={filterBar.updateSearchQuery}
      searchPlaceholder={t('searchPlaceholder')}
      showSearch={true}

      // Date input configuration
      dateValue={filterBar.dateValue}
      onDateChange={filterBar.updateDateValue}
      showDateInput={true}
      dateLabel="تاريخ الحجز"
      dateLabelEn="Reservation Date"

      // Dropdown filters
      data={{
        dropdownFilters: statusFilter,
        loading: filterBar.loading,
        error: filterBar.error,
      }}

      // Actions
      actions={actions}

      // Event handlers
      onRefresh={filterBar.refresh}

      // Layout and styling
      rtl={isRTL}
      responsive={true}
      variant="default"
      className=""

      // Custom messages
      loadingMessage="جاري تحميل المرشحات..."
      errorMessage="خطأ في تحميل المرشحات"
      errorFallbackMessage="استخدام البيانات الاحتياطية"
    />
  );
} 