'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Filter } from 'lucide-react';
import FilterBar, { FilterBarAction } from '@/components/ui/FilterBar';
import { useFilterBar } from '@/components/ui/useFilterBar';

// Mock API function - replace with actual API call
const fetchEquestrianFilters = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    typeOptions: [
      { id: "all", value: "all" },
      { id: "daily", value: "daily" },
      { id: "group", value: "group" },
      { id: "individual", value: "individual" },
      { id: "advanced", value: "advanced" },
    ],
  };
};

export default function EquestrianFilters() {
  const t = useTranslations('EquestrianSessions.filters');
  const tTypes = useTranslations('EquestrianSessions.table.types');
  
  const {
    state,
    updateSearchQuery,
    updateDateValue,
    updateDropdownValue,
            // resetFilters,
    loading,
    error,
    data
  } = useFilterBar({
    apiFunction: fetchEquestrianFilters,
    initialDropdownValues: { type: 'all' }
  });

  // Handle actions
  const handleAddSession = () => {
    console.log('Add new session clicked');
    // TODO: Implement add session functionality
  };

  // Define actions
  const actions: FilterBarAction[] = [
    {
      id: 'add-session',
      label: t('addNewSession'),
      labelEn: 'Add New Session',
      icon: <Plus className="w-5 h-5" />,
      onClick: handleAddSession,
      variant: 'secondary'
    }
  ];

  // Create translated type options
  const getTranslatedTypeOptions = (typeOptions: { id: string; value: string }[]) => {
    return typeOptions.map(option => ({
      ...option,
      label: option.value === 'all' ? t('allTypes') : tTypes(option.value),
      labelEn: option.value === 'all' ? 'All Types' : 
        option.value === 'daily' ? 'Daily Session' :
        option.value === 'group' ? 'Group Session' :
        option.value === 'individual' ? 'Individual Session' :
        option.value === 'advanced' ? 'Advanced Session' : option.value
    }));
  };

  // Define dropdown filters
  const dropdownFilters = data ? [
    {
      id: 'type',
      label: t('allTypes'),
      labelEn: 'All Types',
      icon: <Filter className="w-4 h-4" />,
      options: getTranslatedTypeOptions(data.typeOptions),
      selectedValue: state.dropdownValues.type,
      onSelect: (value: string) => updateDropdownValue('type', value)
    }
  ] : [];

  return (
    <FilterBar
      // Search configuration
      searchValue={state.searchQuery}
      searchPlaceholder={t('searchPlaceholder')}
      onSearchChange={updateSearchQuery}
      showSearch={true}
      
      // Date configuration
      dateValue={state.dateValue}
      dateLabel={t('sessionDate')}
      dateLabelEn="Session Date"
      onDateChange={updateDateValue}
      showDateInput={true}
      
      // Data with dropdown filters
      data={{
        dropdownFilters: dropdownFilters,
        loading: loading,
        error: error
      }}
      
      // Actions
      actions={actions}
      
      // Layout
      className="mb-8"
    />
  );
} 