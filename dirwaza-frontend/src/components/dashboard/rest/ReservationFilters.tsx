'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Filter, Search, ChevronDown, Loader2 } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  labelEn: string;
  value: string;
}

interface ReservationFiltersData {
  statusOptions: FilterOption[];
}

interface FilterState {
  searchQuery: string;
  selectedDate: string;
  selectedStatus: string;
  isStatusOpen: boolean;
}

// Mock API function - replace with actual API call
const fetchFilterOptions = async (): Promise<ReservationFiltersData> => {
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
  const [filterData, setFilterData] = useState<ReservationFiltersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    selectedDate: "",
    selectedStatus: "all",
    isStatusOpen: false,
  });

  // Get locale from URL or context
  const locale =
    typeof window !== "undefined"
      ? window.location.pathname.includes("/ar")
        ? "ar"
        : "en"
      : "ar";

  const isRTL = locale === "ar";

  useEffect(() => {
    const loadFilterData = async () => {
      try {
        setLoading(true);
        const data = await fetchFilterOptions();
        setFilterData(data);
      } catch (err) {
        setError("Failed to load filter options");
        console.error("Error loading filter options:", err);
      } finally {
        setLoading(false);
      }
    };

    loadFilterData();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterState.isStatusOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setFilterState(prev => ({ 
            ...prev, 
            isStatusOpen: false 
          }));
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterState.isStatusOpen]);

  // Fallback data if API fails
  const fallbackData: ReservationFiltersData = {
    statusOptions: [
      { id: "all", label: "جميع الحالات", labelEn: "All Statuses", value: "all" },
      { id: "confirmed", label: "مؤكد", labelEn: "Confirmed", value: "confirmed" },
    ],
  };

  const dataToUse = filterData || fallbackData;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState(prev => ({ ...prev, selectedDate: e.target.value }));
  };

  const handleStatusSelect = (value: string) => {
    setFilterState(prev => ({ 
      ...prev, 
      selectedStatus: value, 
      isStatusOpen: false 
    }));
  };

  const handleAddNewReservation = () => {
    console.log("Add new reservation");
    // Implement add new reservation functionality
  };

  const getSelectedLabel = (options: FilterOption[], value: string) => {
    const option = options.find(opt => opt.value === value);
    return option ? (isRTL ? option.label : option.labelEn) : "";
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading filters...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20">
          <div className="text-red-500 text-center">
            <p>Error loading filters</p>
            <p className="text-sm text-gray-500 mt-1">Using fallback data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg bg-white">
      <div className="overflow-visible">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6 p-4 sm:p-5">
          
          {/* Search Bar */}
          <div className="w-full lg:flex-1 max-w-2xl order-2 lg:order-1">
            <div className="relative">
              <input
                type="text"
                value={filterState.searchQuery}
                onChange={handleSearchChange}
                placeholder={t('searchPlaceholder')}
                className={`w-full rounded-2xl bg-white border border-gray-300 h-11 py-3 pl-4 ${
                  isRTL ? "pr-12 text-start" : "pr-4 text-left"
                } outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm placeholder:text-gray-400`}
                dir={isRTL ? "rtl" : "ltr"}
              />
              <div
                className={`absolute top-0 ${
                  isRTL ? "right-0" : "left-0"
                } h-11 w-12 flex items-center justify-center text-gray-400`}
              >
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 order-1 lg:order-2">
            
            {/* Status Filter */}
            <div className="relative w-full sm:w-auto min-w-[150px] dropdown-container">
              <button
                onClick={() => setFilterState(prev => ({ 
                  ...prev, 
                  isStatusOpen: !prev.isStatusOpen
                }))}
                className="w-full rounded-2xl bg-white border border-gray-300 h-11 flex items-center justify-between px-4 gap-2 hover:bg-gray-50 transition-colors text-sm"
              >
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${filterState.isStatusOpen ? 'rotate-180' : ''}`} />
                <span className="flex-1 text-center font-medium text-gray-700">
                  {getSelectedLabel(dataToUse.statusOptions, filterState.selectedStatus) || t('allStatuses')}
                </span>
                <Filter className="w-4 h-4 text-gray-400" />
              </button>
              
              {filterState.isStatusOpen && (
                <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-40 overflow-y-auto">
                  {dataToUse.statusOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleStatusSelect(option.value)}
                      className="w-full px-3 py-2.5 text-sm text-start hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex-shrink-0"
                    >
                      {isRTL ? option.label : option.labelEn}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date Input */}
            <div className="relative w-full sm:w-auto min-w-[150px]">
              <div className="relative">
                <input
                  type="date"
                  value={filterState.selectedDate}
                  onChange={handleDateChange}
                  className="w-full rounded-2xl bg-white border border-gray-300 h-11 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm text-gray-700"
                />
                {/* <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /> */}
              </div>
            </div>

            {/* Add New Reservation Button */}
            <button
              onClick={handleAddNewReservation}
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-4 py-2.5 rounded-lg transition-colors text-sm font-medium w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              {t('addNewReservation')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 