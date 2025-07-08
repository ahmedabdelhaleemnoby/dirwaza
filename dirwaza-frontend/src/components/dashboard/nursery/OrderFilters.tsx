import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  Calendar,
  Filter,
  Plus,
  ChevronDown,
  Loader2,
} from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  labelEn: string;
  value: string;
}

interface OrderFiltersData {
  dateOptions: FilterOption[];
  statusOptions: FilterOption[];
}

interface FilterState {
  searchQuery: string;
  selectedDate: string;
  selectedStatus: string;
  isDateOpen: boolean;
  isStatusOpen: boolean;
}

// Mock API function - replace with actual API call
const fetchFilterOptions = async (): Promise<OrderFiltersData> => {
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
  const [filterData, setFilterData] = useState<OrderFiltersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: "",
    selectedDate: "all",
    selectedStatus: "all",
    isDateOpen: false,
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
      if (filterState.isDateOpen || filterState.isStatusOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setFilterState(prev => ({ 
            ...prev, 
            isDateOpen: false,
            isStatusOpen: false 
          }));
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterState.isDateOpen, filterState.isStatusOpen]);

  // Fallback data if API fails
  const fallbackData: OrderFiltersData = {
    dateOptions: [
      { id: "all", label: "جميع التواريخ", labelEn: "All Dates", value: "all" },
      { id: "today", label: "اليوم", labelEn: "Today", value: "today" },
    ],
    statusOptions: [
      { id: "all", label: "جميع الحالات", labelEn: "All Status", value: "all" },
      { id: "new", label: "جديد", labelEn: "New", value: "new" },
    ],
  };

  const dataToUse = filterData || fallbackData;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleDateSelect = (value: string) => {
    setFilterState(prev => ({ 
      ...prev, 
      selectedDate: value, 
      isDateOpen: false 
    }));
  };

  const handleStatusSelect = (value: string) => {
    setFilterState(prev => ({ 
      ...prev, 
      selectedStatus: value, 
      isStatusOpen: false 
    }));
  };

  const handleAddNewOrder = () => {
    console.log("Add new order");
    // Implement add new order functionality
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
       <div className=" overflow-visible">
         <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6 p-4 sm:p-5">
          
          {/* Search Bar */}
          <div className="w-full lg:flex-1 max-w-2xl order-2 lg:order-1">
            <div className="relative">
              <input
                type="text"
                value={filterState.searchQuery}
                onChange={handleSearchChange}
                placeholder={t("searchPlaceholder")}
                className={`w-full rounded-2xl bg-white border border-gray-300 h-11 py-3 pl-4 ${
                  isRTL ? "pr-12  text-start " : "pr-4 text-left"
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
                   isStatusOpen: !prev.isStatusOpen,
                   isDateOpen: false 
                 }))}
                 className="w-full rounded-2xl bg-white border border-gray-300 h-11 flex items-center justify-between px-4 gap-2 hover:bg-gray-50 transition-colors text-sm"
               >
                 <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${filterState.isStatusOpen ? 'rotate-180' : ''}`} />
                 <span className="flex-1 text-center font-medium text-gray-700">
                   {getSelectedLabel(dataToUse.statusOptions, filterState.selectedStatus) || t("orderStatus")}
                 </span>
                 <Filter className="w-4 h-4 text-gray-400" />
               </button>
               
               {filterState.isStatusOpen && (
                 <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-40 overflow-y-auto">
                   {dataToUse.statusOptions.map((option) => (
                     <button
                       key={option.id}
                       onClick={() => handleStatusSelect(option.value)}
                       className="w-full px-3 py-2.5 text-sm  text-start  hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex-shrink-0"
                     >
                       {isRTL ? option.label : option.labelEn}
                     </button>
                   ))}
                 </div>
               )}
             </div> 

                         {/* Date Filter */}
             <div className="relative w-full sm:w-auto min-w-[150px] dropdown-container">
               <button
                 onClick={() => setFilterState(prev => ({ 
                   ...prev, 
                   isDateOpen: !prev.isDateOpen,
                   isStatusOpen: false 
                 }))}
                 className="w-full rounded-2xl bg-white border border-gray-300 h-11 flex items-center justify-between px-4 gap-2 hover:bg-gray-50 transition-colors text-sm"
               >
                 <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${filterState.isDateOpen ? 'rotate-180' : ''}`} />
                 <span className="flex-1 text-center font-medium text-gray-700">
                   {getSelectedLabel(dataToUse.dateOptions, filterState.selectedDate) || t("orderDate")}
                 </span>
                 <Calendar className="w-4 h-4 text-gray-400" />
               </button>
               
               {filterState.isDateOpen && (
                 <div className="absolute top-12 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-40 overflow-y-auto">
                   {dataToUse.dateOptions.map((option) => (
                     <button
                       key={option.id}
                       onClick={() => handleDateSelect(option.value)}
                       className="w-full px-3 py-2.5 text-sm  text-start  hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex-shrink-0"
                     >
                       {isRTL ? option.label : option.labelEn}
                     </button>
                   ))}
                 </div>
               )}
             </div>

          
            {/* Add New Order Button */}
            <button
              onClick={handleAddNewOrder}
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-4 py-2.5 rounded-lg transition-colors text-sm font-medium w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              {t("addNewOrder")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters; 