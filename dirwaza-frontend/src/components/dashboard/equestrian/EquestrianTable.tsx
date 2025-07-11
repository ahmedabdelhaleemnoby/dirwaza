'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Edit, Eye, Trash2 } from 'lucide-react';
import DynamicTable, { TableColumn, TableAction, TableData } from '@/components/ui/DynamicTable';
import Image from 'next/image';

interface EquestrianSession {
  id: string;
  sessionNumber: string;
  clientName: string;
  clientPhone: string;
  sessionType: string;
  sessionTypeDescription: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  date: string;
  time: string;
  amountPaid: number;
  currency: string;
  status: 'active' | 'scheduled' | 'cancelled';
  farmName: string;
}

type EquestrianTableData = TableData<EquestrianSession>;

interface EquestrianTableProps {
  data?: EquestrianTableData;
  loading?: boolean;
  error?: string | null;
}

// Mock API function - replace with actual API call
const fetchEquestrianSessions = async (): Promise<EquestrianTableData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const sessions: EquestrianSession[] = [
    {
      id: '1',
      sessionNumber: 'RES-1025',
      clientName: 'محمد العبدالله',
      clientPhone: '+966 55 123 4567',
      sessionType: 'حصة يومية',
      sessionTypeDescription: 'مزرعة الدروازة',
      level: 'intermediate',
      duration: 60,
      date: '25 يونيو 2025',
      time: '02:00 م',
      amountPaid: 160,
      currency: 'ريال',
      status: 'active',
      farmName: 'مزرعة الدروازة'
    },
    {
      id: '2',
      sessionNumber: 'RES-1024',
      clientName: 'سارة الأحمد',
      clientPhone: '+966 50 987 6543',
      sessionType: '۸ حصص تدريب',
      sessionTypeDescription: 'مزرعة الدروازة',
      level: 'advanced',
      duration: 60,
      date: '27 يونيو 2025',
      time: '10:00 ص',
      amountPaid: 260,
      currency: 'ريال',
      status: 'active',
      farmName: 'مزرعة الدروازة'
    },
    {
      id: '3',
      sessionNumber: 'RES-1023',
      clientName: 'فهد المطيري',
      clientPhone: '+966 54 321 9876',
      sessionType: '۱۲ حصة تدريبية فردية',
      sessionTypeDescription: 'مزرعة الدروازة',
      level: 'beginner',
      duration: 60,
      date: '30 يونيو 2025',
      time: '03:00 م',
      amountPaid: 160,
      currency: 'ريال',
      status: 'scheduled',
      farmName: 'مزرعة الدروازة'
    },
    {
      id: '4',
      sessionNumber: 'RES-1022',
      clientName: 'محمد العبدالله',
      clientPhone: '+966 55 123 4567',
      sessionType: 'حصة يومية',
      sessionTypeDescription: 'مزرعة الدروازة',
      level: 'advanced',
      duration: 60,
      date: '05 يوليو 2025',
      time: '12:00 م',
      amountPaid: 160,
      currency: 'ريال',
      status: 'active',
      farmName: 'مزرعة الدروازة'
    },
    {
      id: '5',
      sessionNumber: 'RES-1021',
      clientName: 'سارة الأحمد',
      clientPhone: '+966 50 987 6543',
      sessionType: '۱۲ حصة تدريبية',
      sessionTypeDescription: 'مزرعة الدروازة',
      level: 'advanced',
      duration: 60,
      date: '10 يوليو 2025',
      time: '02:00 م',
      amountPaid: 560,
      currency: 'ريال',
      status: 'cancelled',
      farmName: 'مزرعة الدروازة'
    }
  ];

  return {
    items: sessions,
    totalItems: sessions.length,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null
  };
};

export default function EquestrianTable({ data, loading: propLoading = false, error: propError = null }: EquestrianTableProps) {
  const t = useTranslations('EquestrianSessions.table');

  const [tableData, setTableData] = useState<EquestrianTableData>({
    items: [],
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    loading: propLoading,
    error: propError
  });

  useEffect(() => {
    if (data) {
      setTableData(data);
    } else {
      // Fetch data from API
      setTableData(prev => ({ ...prev, loading: true, error: null }));
      fetchEquestrianSessions()
        .then(result => {
          setTableData(result);
        })
        .catch(() => {
          setTableData(prev => ({ 
            ...prev, 
            loading: false, 
            error: 'Failed to load sessions' 
          }));
        });
    }
  }, [data]);

  // Define table columns
  const columns: TableColumn<EquestrianSession>[] = [
    {
      id: 'sessionClient',
      key: 'sessionClient',
      label: t('headers.sessionClient'),
      labelEn: 'Session Number / Client',
      sortable: true,
      responsive: { priority: 1 },
      render: (session) => (
        <div className="flex flex-col items-start">
          <div className="bg-whitesmoke-100 border border-khaki-200 rounded-lg px-2 py-1 mb-1">
            <span className="text-sm font-medium text-darkslategray-200">#{session.sessionNumber}</span>
          </div>
          <div className="text-sm text-darkslategray-200 font-medium">{session.clientName}</div>
          <div className="text-xs text-slategray " dir='ltr'>{session.clientPhone}</div>
        </div>
      )
    },
    {
      id: 'sessionType',
      key: 'sessionType',
      label: t('headers.sessionType'),
      labelEn: 'Session Type',
      sortable: true,
      responsive: { priority: 2 },
      render: (session) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center">
            <Image src="/icons/horse.svg" alt="Horse" width={20} height={20} />
          </div>
          <div className="flex flex-col items-start">
            <div className="text-sm font-medium text-darkslategray-200 truncate max-w-[120px]">
              {session.sessionType}
            </div>
            <div className="text-xs text-slategray text-start truncate max-w-[120px]">
              {session.sessionTypeDescription}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'dateTime',
      key: 'dateTime',
      label: t('headers.dateTime'),
      labelEn: 'Date/Time',
      sortable: true,
      responsive: { priority: 3 },
      render: (session) => (
        <div className="flex flex-col items-start">
          <div className="text-sm text-darkslategray-200">{session.date}</div>
          <div className="text-xs text-slategray">{session.time}</div>
        </div>
      )
    },
    {
      id: 'duration',
      key: 'duration',
      label: t('headers.duration'),
      labelEn: 'Duration',
      sortable: true,
      responsive: { priority: 4 },
      render: (session) => (
        <div className="text-center">
          <div className="text-lg font-bold text-darkgreen">{session.duration}</div>
        </div>
      )
    },
    {
      id: 'level',
      key: 'level',
      label: t('headers.level'),
      labelEn: 'Level',
      sortable: true,
      responsive: { priority: 5 },
      render: (session) => (
        <div className="text-center">
          <span className="text-sm font-medium text-darkslategray-200">
            {t(`levels.${session.level}`)}
          </span>
        </div>
      )
    },
    {
      id: 'sessionStatus',
      key: 'sessionStatus',
      label: t('headers.sessionStatus'),
      labelEn: 'Session Status',
      sortable: true,
      responsive: { priority: 6 },
      render: (session) => {
        const statusConfig = {
          active: 'bg-powderblue-100 text-darkslategray-200',
          scheduled: 'bg-steelblue text-white',
          cancelled: 'bg-linen text-darkslategray-200'
        };
        
        return (
          <div className="flex justify-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[session.status]}`}>
              {t(`statuses.${session.status}`)}
            </span>
          </div>
        );
      }
    },
    {
      id: 'amountPaid',
      key: 'amountPaid',
      label: t('headers.amountPaid'),
      labelEn: 'Amount Paid',
      sortable: true,
      responsive: { priority: 7 },
      render: (session) => (
        <div className="text-center">
          <div className="font-bold text-primary flex items-center justify-center">
            {session.amountPaid}{t('currency')}
          </div>
        </div>
      )
    },
    
  ];

  // Define table actions
  const actions: TableAction<EquestrianSession>[] = [
    {
      id: 'view',
      label: 'عرض',
      labelEn: 'View',
      icon: <Eye className="w-4 h-4" />,
      onClick: (session) => console.log('View session:', session.id),
      color: 'secondary'
    },
    {
      id: 'edit',
      label: 'تعديل',
      labelEn: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      onClick: (session) => console.log('Edit session:', session.id),
      color: 'warning'
    },
    {
      id: 'delete',
      label: 'حذف',
      labelEn: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (session) => console.log('Delete session:', session.id),
      color: 'danger'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-bold text-darkslategray-200 text-start">
          {t('upcomingSessions')}
        </h3>
      </div>

      {/* Table */}
      <DynamicTable
        data={tableData}
        columns={columns}
        actions={actions}
        emptyMessage="لا توجد حصص"
        className="border-0"
      />
    </div>
  );
} 