import React, { ReactNode } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
    // ArrowUpDown,
    // ArrowUp,
    // ArrowDown,
} from 'lucide-react';

// Types for table configuration
interface TableColumn<T = Record<string, unknown>> {
  id: string;
  label: string;
  labelEn: string;
  key: keyof T | string;
  width?: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (item: T, value: unknown) => ReactNode;
  align?: 'left' | 'center' | 'right';
  responsive?: {
    hidden?: ('sm' | 'md' | 'lg' | 'xl')[];
    priority?: number; // 1 = highest priority, show first on mobile
  };
}

interface TableAction<T = Record<string, unknown>> {
  id: string;
  label: string;
  labelEn: string;
  icon?: ReactNode;
  onClick: (item: T) => void;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  show?: (item: T) => boolean;
}

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface TableData<T = Record<string, unknown>> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  loading?: boolean;
  error?: string | null;
}

interface DynamicTableProps<T = Record<string, unknown>> {
  data: TableData<T>;
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  onPageChange?: (page: number) => void;
  onSort?: (sortConfig: SortConfig) => void;
  onSearch?: (query: string) => void;
  onRefresh?: () => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  itemsPerPage?: number;
  className?: string;
  rtl?: boolean;
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  responsive?: boolean;
  stickyHeader?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  showItemsCount?: boolean;
  variant?: 'default' | 'minimal' | 'bordered';
}

function DynamicTable<T = Record<string, unknown>>({
  data,
  columns,
  actions = [],
  onPageChange,
  // onSort,
  
  onRefresh,
  emptyMessage = "لا توجد بيانات للعرض",
  itemsPerPage = 10,
  className = "",
  rtl = true,
  striped = false,
  bordered = true,
  hoverable = true,
  responsive = true,
  stickyHeader = false,
  showPagination = true,
  showItemsCount = true,
  variant = 'default',
}: DynamicTableProps<T>) {
  // const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Handle sorting
  // const handleSort = (key: string) => {
  //   if (!onSort) return;
    
  //   let direction: 'asc' | 'desc' = 'asc';
  //   if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
  //     direction = 'desc';
  //   }
    
  //   const newSortConfig = { key, direction };
  //   setSortConfig(newSortConfig);
  //   onSort(newSortConfig);
  // };

  // // Get sort icon
  // const getSortIcon = (columnKey: string) => {
  //   if (!sortConfig || sortConfig.key !== columnKey) {
  //     return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
  //   }
  //   return sortConfig.direction === 'asc' 
  //     ? <ArrowUp className="w-4 h-4 text-primary" />
  //     : <ArrowDown className="w-4 h-4 text-primary" />;
  // };

  // Render cell content
  const renderCell = (column: TableColumn<T>, item: T): ReactNode => {
    const value = typeof column.key === 'string' 
      ? (item as Record<string, unknown>)[column.key] 
      : undefined;
    
    if (column.render) {
      return column.render(item, value);
    }
    
    return String(value || '');
  };

  // Get responsive classes - Fixed to use proper Tailwind classes
  const getResponsiveClasses = (column: TableColumn<T>) => {
    if (!column.responsive?.hidden) return '';
    
    const classes: string[] = [];
    column.responsive.hidden.forEach(breakpoint => {
      switch (breakpoint) {
        case 'sm':
          classes.push('hidden', 'sm:table-cell');
          break;
        case 'md':
          classes.push('hidden', 'md:table-cell');
          break;
        case 'lg':
          classes.push('hidden', 'lg:table-cell');
          break;
        case 'xl':
          classes.push('hidden', 'xl:table-cell');
          break;
      }
    });
    return classes.join(' ');
  };

  // Mobile card component
  const MobileCard: React.FC<{ item: T; index: number }> = ({ item,  }) => {
    const priorityColumns = columns
      .filter(col => col.responsive?.priority)
      .sort((a, b) => (a.responsive?.priority || 0) - (b.responsive?.priority || 0))
      .slice(0, 3); // Show top 3 priority columns

    return (
      <div className="bg-neutral-light border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
        {priorityColumns.map((column) => (
          <div key={column.id} className="mb-2 last:mb-0">
            <div className="text-xs text-gray-500 mb-1 text-start">
              {rtl ? column.label : column.labelEn}
            </div>
            <div className="text-sm text-gray-800 text-start">
              {renderCell(column, item)}
            </div>
          </div>
        ))}
        
        {actions.length > 0 && (
          <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-gray-100">
            {actions.map((action) => {
              if (action.show && !action.show(item)) return null;
              
              return (
                <button
                  key={action.id}
                  onClick={() => action.onClick(item)}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                    action.color === 'danger' 
                      ? 'text-red-600 hover:bg-red-50'
                      : action.color === 'warning'
                      ? 'text-yellow-600 hover:bg-yellow-50'
                      : action.color === 'success'
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                  title={rtl ? action.label : action.labelEn}
                >
                  {action.icon}
                  <span className="hidden sm:inline">
                    {rtl ? action.label : action.labelEn}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Pagination component
  const Pagination: React.FC = () => {
    if (!showPagination || data.totalPages <= 1) return null;

    const renderPageNumbers = () => {
      const pages = [];
      const showPages = 5;
      let startPage = Math.max(1, data.currentPage - Math.floor(showPages / 2));
      const endPage = Math.min(data.totalPages, startPage + showPages - 1);

      if (endPage - startPage + 1 < showPages) {
        startPage = Math.max(1, endPage - showPages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => onPageChange?.(i)}
            className={`w-10 h-10 flex items-center justify-center border text-sm font-medium transition-colors ${
              data.currentPage === i
                ? 'bg-secondary text-white border-secondary'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {i}
          </button>
        );
      }

      return pages;
    };

    const startItem = (data.currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(data.currentPage * itemsPerPage, data.totalItems);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200">
        {showItemsCount && (
          <div className="text-sm text-gray-600 text-center sm:text-start">
            <span>عرض </span>
            <span className="font-medium">{startItem}</span>
            <span> إلى </span>
            <span className="font-medium">{endItem}</span>
            <span> من </span>
            <span className="font-medium">{data.totalItems}</span>
            <span> عنصر</span>
          </div>
        )}

        <div className="flex items-center gap-1 rounded-lg overflow-hidden border border-gray-300">
          <button
            onClick={() => onPageChange?.(Math.max(1, data.currentPage - 1))}
            disabled={data.currentPage === 1}
            className="w-10 h-10 flex items-center justify-center bg-white border-r border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          {renderPageNumbers()}
          
          <button
            onClick={() => onPageChange?.(Math.min(data.totalPages, data.currentPage + 1))}
            disabled={data.currentPage === data.totalPages}
            className="w-10 h-10 flex items-center justify-center bg-white border-l border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Loading state
  if (data.loading) {
    return (
      <div className={`w-full bg-white rounded-lg border ${bordered ? 'border-gray-200' : 'border-transparent'} ${className}`}>
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>جاري التحميل...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (data.error) {
    return (
      <div className={`w-full bg-white rounded-lg border ${bordered ? 'border-gray-200' : 'border-transparent'} ${className}`}>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-red-500 text-center">
            <p className="font-medium">خطأ في تحميل البيانات</p>
            <p className="text-sm text-gray-500 mt-1">{data.error}</p>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                إعادة المحاولة
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (data.items.length === 0) {
    return (
      <div className={`w-full bg-white rounded-lg border ${bordered ? 'border-gray-200' : 'border-transparent'} ${className}`}>
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500 text-center">
            <p className="text-lg font-medium">{emptyMessage}</p>
            <p className="text-sm mt-1">لا توجد بيانات لعرضها حالياً</p>
          </div>
        </div>
      </div>
    );
  }

  const tableClasses = `
    w-full bg-white rounded-lg overflow-hidden
    ${bordered ? 'border border-gray-200' : ''}
    ${variant === 'bordered' ? 'border-2' : ''}
    ${variant === 'minimal' ? 'shadow-none' : 'shadow-sm'}
    ${className}
  `.trim();

  return (
    <div className={tableClasses} dir={rtl ? "rtl" : "ltr"}>
      {/* Mobile Layout */}
      {responsive && (
        <div className="lg:hidden p-4">
          {data.items.map((item, index) => (
            <MobileCard key={index} item={item} index={index} />
          ))}
        </div>
      )}

      {/* Desktop Table Layout */}
      <div className={`${responsive ? 'hidden lg:block' : ''} overflow-x-auto`}>
        <table className="w-full">
          {/* Table Header */}
          <thead className={`bg-neutral-light ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  className={`
                    px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200
                    ${column.align === 'center' ? 'text-center' : column.align === 'left' ? 'text-left' : 'text-start'}
                    ${getResponsiveClasses(column)}
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                  `}
                  // onClick={() => column.sortable && handleSort(column.key as string)}
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2 ">
                    <span>{rtl ? column.label : column.labelEn}</span>
                    {/* {column.sortable && getSortIcon(column.key as string)} */}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider text-center border-b border-gray-200">
                  إجراءات
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className={`bg-white divide-y divide-gray-200`}>
            {data.items.map((item, index) => (
              <tr
                key={index}
                className={`
                  ${hoverable ? 'hover:bg-gray-50' : ''}
                  ${striped && index % 2 === 1 ? 'bg-gray-50' : ''}
                  transition-colors
                `}
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={`
                      px-6 py-4 whitespace-nowrap text-sm text-gray-900
                      ${column.align === 'center' ? 'text-center' : column.align === 'left' ? 'text-left' : 'text-start'}
                      ${getResponsiveClasses(column)}
                    `}
                  >
                    {renderCell(column, item)}
                  </td>
                ))}
                {actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-2">
                      {actions.map((action) => {
                        if (action.show && !action.show(item)) return null;
                        
                        return (
                          <button
                            key={action.id}
                            onClick={() => action.onClick(item)}
                            className={`p-2 rounded-lg transition-colors ${
                              action.color === 'danger' 
                                ? 'text-red-600 hover:bg-red-50'
                                : action.color === 'warning'
                                ? 'text-yellow-600 hover:bg-yellow-50'
                                : action.color === 'success'
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                            title={rtl ? action.label : action.labelEn}
                          >
                            {action.icon}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination />
    </div>
  );
}

export default DynamicTable;
export type { TableColumn, TableAction, SortConfig, TableData, DynamicTableProps }; 