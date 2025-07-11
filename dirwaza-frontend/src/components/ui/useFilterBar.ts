"use client";
import { useState, useEffect } from 'react';
import { FilterOption, DropdownFilter } from './FilterBar';

export interface UseFilterBarConfig {
  initialSearchQuery?: string;
  initialDateValue?: string;
  initialDropdownValues?: Record<string, string>;
  apiFunction?: () => Promise<any>;
  onStateChange?: (state: FilterBarState) => void;
}

export interface FilterBarState {
  searchQuery: string;
  dateValue: string;
  dropdownValues: Record<string, string>;
  loading: boolean;
  error: string | null;
  data: any;
}

export function useFilterBar(config: UseFilterBarConfig = {}) {
  const {
    initialSearchQuery = '',
    initialDateValue = '',
    initialDropdownValues = {},
    apiFunction,
    onStateChange,
  } = config;

  const [state, setState] = useState<FilterBarState>({
    searchQuery: initialSearchQuery,
    dateValue: initialDateValue,
    dropdownValues: initialDropdownValues,
    loading: false,
    error: null,
    data: null,
  });

  // Load initial data
  useEffect(() => {
    if (apiFunction) {
      loadData();
    }
  }, []);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange(state);
    }
  }, [state, onStateChange]);

  const loadData = async () => {
    if (!apiFunction) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await apiFunction();
      setState(prev => ({ ...prev, data, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  };

  const updateSearchQuery = (searchQuery: string) => {
    setState(prev => ({ ...prev, searchQuery }));
  };

  const updateDateValue = (dateValue: string) => {
    setState(prev => ({ ...prev, dateValue }));
  };

  const updateDropdownValue = (filterId: string, value: string) => {
    setState(prev => ({
      ...prev,
      dropdownValues: { ...prev.dropdownValues, [filterId]: value }
    }));
  };

  const resetFilters = () => {
    setState(prev => ({
      ...prev,
      searchQuery: initialSearchQuery,
      dateValue: initialDateValue,
      dropdownValues: initialDropdownValues,
    }));
  };

  const refresh = () => {
    loadData();
  };

  // Helper function to create dropdown filters from data
  const createDropdownFilters = (
    filterConfigs: Array<{
      id: string;
      label: string;
      labelEn: string;
      icon?: React.ReactNode;
      options: FilterOption[];
      placeholder?: string;
    }>
  ): DropdownFilter[] => {
    return filterConfigs.map(config => ({
      ...config,
      selectedValue: state.dropdownValues[config.id] || '',
      onSelect: (value: string) => updateDropdownValue(config.id, value),
    }));
  };

  return {
    // State
    state,
    searchQuery: state.searchQuery,
    dateValue: state.dateValue,
    dropdownValues: state.dropdownValues,
    loading: state.loading,
    error: state.error,
    data: state.data,

    // Actions
    updateSearchQuery,
    updateDateValue,
    updateDropdownValue,
    resetFilters,
    refresh,
    loadData,

    // Helpers
    createDropdownFilters,

    // For FilterBar component
    filterBarData: {
      loading: state.loading,
      error: state.error,
    },
  };
} 