'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Edit, Eye, Trash2 } from 'lucide-react';
import DynamicTable, { TableColumn, TableAction, TableData } from '@/components/ui/DynamicTable';

interface Reservation {
  id: string;
  clientName: string;
  clientPhone: string;
  restName: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  bookingType: 'withStay' | 'withoutStay';
  reservationStatus: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'halfAmount' | 'fullAmount';
}

const StatusBadge: React.FC<{ status: string; type: 'reservation' | 'payment' }> = ({ status, type }) => {
  const getStatusStyles = () => {
    if (type === 'reservation') {
      switch (status) {
        case 'مؤكد':
        case 'Confirmed':
          return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        case 'قيد التأكيد':
        case 'Pending Confirmation':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'ملغي':
        case 'Cancelled':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    } else {
      switch (status) {
        case 'نصف المبلغ':
        case 'Half Amount':
          return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'كامل المبلغ':
        case 'Full Amount':
          return 'bg-green-100 text-green-800 border-green-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

// Mock API function
const fetchReservations = async (): Promise<TableData<Reservation>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockReservations: Reservation[] = [
    {
      id: 'RES-1025',
      clientName: 'سارة الأحمد',
      clientPhone: '+966 50 987 6543',
      restName: 'The Long',
      checkInDate: '27 يونيو 2025',
      checkInTime: '10:00 ص',
      checkOutDate: '27 يونيو 2025',
      checkOutTime: '10:00 م',
      bookingType: 'withoutStay',
      reservationStatus: 'confirmed',
      paymentStatus: 'halfAmount'
    },
    {
      id: 'RES-1024',
      clientName: 'سارة الأحمد',
      clientPhone: '+966 50 987 6543',
      restName: 'The Long',
      checkInDate: '27 يونيو 2025',
      checkInTime: '10:00 ص',
      checkOutDate: '27 يونيو 2025',
      checkOutTime: '10:00 م',
      bookingType: 'withoutStay',
      reservationStatus: 'confirmed',
      paymentStatus: 'halfAmount'
    },
    {
      id: 'RES-1023',
      clientName: 'فهد المطيري',
      clientPhone: '+966 54 321 9876',
      restName: 'The Green House',
      checkInDate: '30 يونيو 2025',
      checkInTime: '03:00 م',
      checkOutDate: '02 يوليو 2025',
      checkOutTime: '12:00 م',
      bookingType: 'withStay',
      reservationStatus: 'pending',
      paymentStatus: 'halfAmount'
    },
    {
      id: 'RES-1022',
      clientName: 'محمد العبدالله',
      clientPhone: '+966 55 123 4567',
      restName: 'The Long',
      checkInDate: '05 يوليو 2025',
      checkInTime: '12:00 م',
      checkOutDate: '05 يوليو 2025',
      checkOutTime: '11:00 م',
      bookingType: 'withoutStay',
      reservationStatus: 'confirmed',
      paymentStatus: 'fullAmount'
    },
    {
      id: 'RES-1021',
      clientName: 'سارة الأحمد',
      clientPhone: '+966 50 987 6543',
      restName: 'The Green House',
      checkInDate: '10 يوليو 2025',
      checkInTime: '02:00 م',
      checkOutDate: '12 يوليو 2025',
      checkOutTime: '12:00 م',
      bookingType: 'withStay',
      reservationStatus: 'cancelled',
      paymentStatus: 'halfAmount'
    }
  ];

  return {
    items: mockReservations,
    totalItems: 45,
    currentPage: 1,
    totalPages: 9,
    loading: false,
    error: null
  };
};

export default function ReservationsTable() {
  const t = useTranslations('RestReservations.table');
  const [tableData, setTableData] = useState<TableData<Reservation>>({
    items: [],
    totalItems: 0,
    currentPage: 1,
    totalPages: 0,
    loading: true,
    error: null
  });

  // Get locale for RTL support
  const locale = typeof window !== "undefined" 
    ? window.location.pathname.includes("/ar") ? "ar" : "en" 
    : "ar";
  const isRTL = locale === "ar";

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setTableData(prev => ({ ...prev, loading: true, error: null }));
        const data = await fetchReservations();
        setTableData(data);
      } catch {
        setTableData(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Failed to load reservations' 
        }));
      }
    };

    loadData();
  }, []);

  // Define table columns
  const columns: TableColumn<Reservation>[] = [
    {
      id: 'reservationClient',
      label: t('headers.reservationClient'),
      labelEn: 'Reservation ID / Client',
      key: 'id',
      width: '200px',
      align: 'right',
      responsive: { priority: 1 },
      render: (item) => (
        <div className="flex flex-col items-end space-y-1">
          <div className="inline-flex items-center px-2 py-1 bg-gray-100 border border-gray-300 rounded-lg">
            <span className="text-sm font-medium">#{item.id}</span>
          </div>
          <div className="text-sm font-medium text-gray-900">{item.clientName}</div>
          <div className="text-xs text-gray-500">{item.clientPhone}</div>
        </div>
      )
    },
    {
      id: 'restName',
      label: t('headers.restName'),
      labelEn: 'Rest Name',
      key: 'restName',
      width: '180px',
      align: 'right',
      responsive: { priority: 2 },
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div className="text-sm font-medium text-gray-900">{item.restName}</div>
            <div className="text-xs text-gray-500">{t('farmName')}</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-secondary/20 flex items-center justify-center">
            <div className="w-5 h-5 bg-secondary rounded"></div>
          </div>
        </div>
      )
    },
    {
      id: 'checkInTime',
      label: t('headers.checkInTime'),
      labelEn: 'Check-in Time',
      key: 'checkInDate',
      width: '140px',
      align: 'right',
      responsive: { hidden: ['sm'], priority: 4 },
      render: (item) => (
        <div className="flex flex-col items-end">
          <div className="text-sm text-gray-900">{item.checkInDate}</div>
          <div className="text-xs text-gray-500">{item.checkInTime}</div>
        </div>
      )
    },
    {
      id: 'checkOutTime',
      label: t('headers.checkOutTime'),
      labelEn: 'Check-out Time',
      key: 'checkOutDate',
      width: '140px',
      align: 'right',
      responsive: { hidden: ['sm'], priority: 5 },
      render: (item) => (
        <div className="flex flex-col items-end">
          <div className="text-sm text-gray-900">{item.checkOutDate}</div>
          <div className="text-xs text-gray-500">{item.checkOutTime}</div>
        </div>
      )
    },
    {
      id: 'bookingType',
      label: t('headers.bookingType'),
      labelEn: 'Booking Type',
      key: 'bookingType',
      width: '120px',
      align: 'center',
      responsive: { hidden: ['sm', 'md'], priority: 6 },
      render: (item) => (
        <span className="text-sm text-gray-900">
          {t(`bookingTypes.${item.bookingType}`)}
        </span>
      )
    },
    {
      id: 'reservationStatus',
      label: t('headers.reservationStatus'),
      labelEn: 'Reservation Status',
      key: 'reservationStatus',
      width: '140px',
      align: 'center',
      responsive: { priority: 3 },
      render: (item) => (
        <StatusBadge 
          status={t(`reservationStatuses.${item.reservationStatus}`)} 
          type="reservation" 
        />
      )
    },
    {
      id: 'paymentStatus',
      label: t('headers.paymentStatus'),
      labelEn: 'Payment Status',
      key: 'paymentStatus',
      width: '120px',
      align: 'center',
      responsive: { hidden: ['sm'], priority: 7 },
      render: (item) => (
        <StatusBadge 
          status={t(`paymentStatuses.${item.paymentStatus}`)} 
          type="payment" 
        />
      )
    }
  ];

  // Define table actions
  const actions: TableAction<Reservation>[] = [
    {
      id: 'view',
      label: 'عرض',
      labelEn: 'View',
      icon: <Eye className="w-4 h-4" />,
      onClick: (item) => {
        console.log('View reservation:', item.id);
        // Implement view logic
      },
      color: 'primary'
    },
    {
      id: 'edit',
      label: 'تعديل',
      labelEn: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      onClick: (item) => {
        console.log('Edit reservation:', item.id);
        // Implement edit logic
      },
      color: 'secondary'
    },
    {
      id: 'delete',
      label: 'حذف',
      labelEn: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item) => {
        console.log('Delete reservation:', item.id);
        // Implement delete logic
      },
      color: 'danger',
      show: (item) => item.reservationStatus !== 'confirmed' // Only show for non-confirmed reservations
    }
  ];

  // Handle pagination
  const handlePageChange = (page: number) => {
    console.log('Page changed to:', page);
    // Implement pagination logic
  };

  // Handle refresh
  const handleRefresh = () => {
    const loadData = async () => {
      try {
        setTableData(prev => ({ ...prev, loading: true, error: null }));
        const data = await fetchReservations();
        setTableData(data);
             } catch {
         setTableData(prev => ({ 
           ...prev, 
           loading: false, 
           error: 'Failed to load reservations' 
         }));
       }
    };

    loadData();
  };

  return (
    <div className="w-full">
      <DynamicTable<Reservation>
        data={tableData}
        columns={columns}
        actions={actions}
        onPageChange={handlePageChange}
        onRefresh={handleRefresh}
        emptyMessage="لا توجد حجوزات للعرض"
        rtl={isRTL}
        responsive={true}
        showPagination={true}
        showItemsCount={true}
        variant="default"
        className="shadow-sm"
      />
    </div>
  );
} 