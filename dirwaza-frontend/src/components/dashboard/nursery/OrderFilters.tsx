import React from "react";
import { useTranslations } from "next-intl";
import { Calendar, Filter, Plus } from "lucide-react";
import FilterBar, { FilterBarAction } from '@/components/ui/FilterBar';
import { useFilterBar } from '@/components/ui/useFilterBar';

// Mock API function - replace with actual API call
const fetchOrderFilters = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    dateOptions: [
      { id: "all", label: "جميع التواريخ", labelEn: "All Dates", value: "all" },
      { id: "today", label: "اليوم", labelEn: "Today", value: "today" },
      { id: "week", label: "هذا الأسبوع", labelEn: "This Week", value: "week" },
      { id: "month", label: "هذا الشهر", labelEn: "This Month", value: "month" },
    ],
    statusOptions: [
      { id: "all", label: "جميع الحالات", labelEn: "All Status", value: "all" },
      { id: "new", label: "جديد", labelEn: "New", value: "new" },
      { id: "processing", label: "قيد المعالجة", labelEn: "Processing", value: "processing" },
      { id: "completed", label: "مكتمل", labelEn: "Completed", value: "completed" },
      { id: "cancelled", label: "ملغي", labelEn: "Cancelled", value: "cancelled" },
    ],
  };
};

const OrderFilters: React.FC = () => {
  const t = useTranslations("NurseryOrders");

  // Get locale for RTL support
  const locale = typeof window !== "undefined"
    ? window.location.pathname.includes("/ar") ? "ar" : "en"
    : "ar";
  const isRTL = locale === "ar";

  // Use the custom hook for filter state management
  const filterBar = useFilterBar({
    initialDropdownValues: { date: 'all', status: 'all' },
    apiFunction: fetchOrderFilters,
    onStateChange: (state) => {
      // Handle filter state changes here
      console.log('Order filter state changed:', state);
      // You can trigger API calls, update URL params, etc.
    }
  });

  // Create dropdown filters configuration
  const dropdownFilters = filterBar.data ? filterBar.createDropdownFilters([
    {
      id: 'status',
      label: 'حالة الطلب',
      labelEn: 'Order Status',
      icon: <Filter className="w-4 h-4" />,
      options: filterBar.data.statusOptions,
      placeholder: t('orderStatus'),
    },
    {
      id: 'date',
      label: 'تاريخ الطلب',
      labelEn: 'Order Date',
      icon: <Calendar className="w-4 h-4" />,
      options: filterBar.data.dateOptions,
      placeholder: t('orderDate'),
    }
  ]) : [];

  // Define actions
  const actions: FilterBarAction[] = [
    {
      id: 'addOrder',
      label: 'إضافة طلب جديد',
      labelEn: 'Add New Order',
      icon: <Plus className="w-4 h-4" />,
      onClick: () => {
        console.log("Add new order");
        // Implement add new order functionality
      },
      variant: 'secondary',
    }
  ];

  return (
    <FilterBar
      // Search configuration
      searchValue={filterBar.searchQuery}
      onSearchChange={filterBar.updateSearchQuery}
      searchPlaceholder={t("searchPlaceholder")}
      showSearch={true}

      // Date input - disabled for orders as they use dropdown
      showDateInput={false}

      // Dropdown filters
      data={{
        dropdownFilters: dropdownFilters,
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
};

export default OrderFilters; 