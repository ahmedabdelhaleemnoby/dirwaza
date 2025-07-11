"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import { Search, ChevronDown,  Loader2 } from 'lucide-react';

// Types for filter configuration
export interface FilterOption {
  id: string;
  label: string;
  labelEn: string;
  value: string;
}

export interface DropdownFilter {
  id: string;
  label: string;
  labelEn: string;
  icon?: ReactNode;
  options: FilterOption[];
  selectedValue: string;
  placeholder?: string;
  onSelect: (value: string) => void;
}

export interface FilterBarAction {
  id: string;
  label: string;
  labelEn: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export interface FilterBarData {
  dropdownFilters?: DropdownFilter[];
  loading?: boolean;
  error?: string | null;
}

export interface FilterBarProps {
  // Search configuration
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;

  // Date input configuration
  dateValue?: string;
  onDateChange?: (value: string) => void;
  showDateInput?: boolean;
  dateLabel?: string;
  dateLabelEn?: string;

  // Dropdown filters data
  data?: FilterBarData;
  onRefresh?: () => void;

  // Actions (like Add buttons)
  actions?: FilterBarAction[];

  // Layout and styling
  className?: string;
  rtl?: boolean;
  variant?: 'default' | 'minimal' | 'compact';
  responsive?: boolean;

  // Loading and error states
  loadingMessage?: string;
  errorMessage?: string;
  errorFallbackMessage?: string;
}

export default function FilterBar({
  // Search props
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'البحث...',
  showSearch = true,

  // Date props
  dateValue = '',
  onDateChange,
  showDateInput = false,
  dateLabel = 'تاريخ',
  dateLabelEn = 'Date',

  // Data and filters
  data = { dropdownFilters: [], loading: false, error: null },
  onRefresh,

  // Actions
  actions = [],

  // Layout
  className = '',
  rtl = true,
  variant = 'default',
  responsive = true,

  // Messages
  loadingMessage = 'جاري التحميل...',
  errorMessage = 'خطأ في تحميل المرشحات',
  errorFallbackMessage = 'استخدام البيانات الاحتياطية',
}: FilterBarProps) {
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdowns({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = (filterId: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }));
  };

  const handleFilterSelect = (filter: DropdownFilter, value: string) => {
    filter.onSelect(value);
    setOpenDropdowns(prev => ({ ...prev, [filter.id]: false }));
  };

  const getSelectedLabel = (filter: DropdownFilter) => {
    const option = filter.options.find(opt => opt.value === filter.selectedValue);
    return option ? (rtl ? option.label : option.labelEn) : filter.placeholder;
  };

  const getActionVariantClass = (variant: FilterBarAction['variant'] = 'primary') => {
    const variants = {
      primary: 'bg-primary hover:bg-primary-dark text-white',
      secondary: 'bg-secondary hover:bg-secondary/90 text-white',
      success: 'bg-green-500 hover:bg-green-600 text-white',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
      danger: 'bg-red-500 hover:bg-red-600 text-white',
    };
    return variants[variant];
  };

  // Loading state
  if (data.loading) {
    return (
      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
        <div className="flex items-center justify-center h-20">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{loadingMessage}</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (data.error) {
    return (
      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
        <div className="flex items-center justify-center h-20">
          <div className="text-red-500 text-center">
            <p>{errorMessage}</p>
            <p className="text-sm text-gray-500 mt-1">{errorFallbackMessage}</p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="mt-2 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors text-sm"
              >
                إعادة المحاولة
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const containerClasses = `
    w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-lg
    ${variant === 'minimal' ? 'bg-transparent' : 'bg-white'}
    ${variant === 'compact' ? 'py-2' : ''}
    ${className}
  `.trim();

  return (
    <div className={containerClasses} dir={rtl ? 'rtl' : 'ltr'}>
      <div className="overflow-visible">
        <div className={`
          flex items-center justify-between gap-4 lg:gap-6 p-4 sm:p-5
          ${responsive ? 'flex-col lg:flex-row' : 'flex-row'}
        `}>
          
          {/* Search Bar Section */}
          {showSearch && onSearchChange && (
            <div className={`
              w-full max-w-2xl
              ${responsive ? 'order-2 lg:order-1 lg:flex-1' : 'flex-1'}
            `}>
              <div className="relative">
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={`
                    w-full rounded-2xl bg-white border border-gray-300 h-11 py-3 pl-4
                    ${rtl ? "pr-12 text-start" : "pr-4 text-left"}
                    outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary 
                    transition-colors text-sm placeholder:text-gray-400
                  `}
                  dir={rtl ? "rtl" : "ltr"}
                />
                <div className={`
                  absolute top-0 h-11 w-12 flex items-center justify-center text-gray-400
                  ${rtl ? "right-0" : "left-0"}
                `}>
                  <Search className="w-5 h-5" />
                </div>
              </div>
            </div>
          )}

          {/* Filter Controls Section */}
          <div className={`
            flex items-center gap-3
            ${responsive ? 'flex-col sm:flex-row order-1 lg:order-2' : 'flex-row'}
          `}>
            
            {/* Dropdown Filters */}
            {data.dropdownFilters?.map((filter) => (
              <div key={filter.id} className="relative w-full sm:w-auto min-w-[150px] dropdown-container">
                <button
                  onClick={() => handleDropdownToggle(filter.id)}
                  className="w-full rounded-2xl bg-white border border-gray-300 h-11 flex items-center justify-between px-4 gap-2 hover:bg-gray-50 transition-colors text-sm"
                >
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openDropdowns[filter.id] ? 'rotate-180' : ''}`} />
                  <span className="flex-1 text-center font-medium text-gray-700">
                    {getSelectedLabel(filter) || (rtl ? filter.label : filter.labelEn)}
                  </span>
                  {filter.icon && <div className="w-4 h-4 text-gray-400">{filter.icon}</div>}
                </button>
                
                {openDropdowns[filter.id] && (
                  <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-40 overflow-y-auto">
                    {filter.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleFilterSelect(filter, option.value)}
                        className="w-full px-3 py-2.5 text-sm text-start hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex-shrink-0"
                      >
                        {rtl ? option.label : option.labelEn}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Date Input */}
            {showDateInput && onDateChange && (
              <div className="relative w-full sm:w-auto min-w-[150px]">
                <input
                  type="date"
                  value={dateValue}
                  onChange={(e) => onDateChange(e.target.value)}
                  className="w-full rounded-2xl bg-white border border-gray-300 h-11 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm text-gray-700"
                  title={rtl ? dateLabel : dateLabelEn}
                />
              </div>
            )}

            {/* Action Buttons */}
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium w-full sm:w-auto
                  ${getActionVariantClass(action.variant)}
                  ${action.className || ''}
                `}
              >
                {action.icon}
                {rtl ? action.label : action.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 