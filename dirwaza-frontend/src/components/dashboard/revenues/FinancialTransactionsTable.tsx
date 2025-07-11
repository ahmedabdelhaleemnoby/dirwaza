'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Eye, Edit, Trash2, CreditCard, Smartphone } from 'lucide-react';
import DynamicTable, { TableColumn, TableData } from '@/components/ui/DynamicTable';
import { FinancialTransaction } from '@/types/revenues';
import { fetchFinancialTransactions } from '@/mock/revenuesMockData';

interface FinancialTransactionsTableProps {
  data?: FinancialTransaction[];
  loading?: boolean;
  error?: string | null;
  searchTerm?: string;
  onSearchChange?: (searchTerm: string) => void;
}

export default function FinancialTransactionsTable({
  data: propData,
  loading: propLoading,
  error: propError,
  searchTerm = '',
  onSearchChange
}: FinancialTransactionsTableProps) {
  const t = useTranslations('Revenues.transactions');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const [tableData, setTableData] = useState<TableData<FinancialTransaction>>({
    items: [],
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    loading: true,
    error: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 6;

  useEffect(() => {
    if (propData) {
      // If data is provided via props, use it
      const filteredData = propData.filter(transaction =>
        transaction.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const totalPages = Math.ceil(filteredData.length / transactionsPerPage);
      const startIndex = (currentPage - 1) * transactionsPerPage;
      const endIndex = startIndex + transactionsPerPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      setTableData({
        items: paginatedData,
        totalItems: filteredData.length,
        currentPage,
        totalPages,
        loading: propLoading || false,
        error: propError || null
      });
      return;
    }

    const loadData = async () => {
      try {
        setTableData(prev => ({ ...prev, loading: true, error: null }));
        const data = await fetchFinancialTransactions();
        
        const filteredData = data.filter(transaction =>
          transaction.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const totalPages = Math.ceil(filteredData.length / transactionsPerPage);
        const startIndex = (currentPage - 1) * transactionsPerPage;
        const endIndex = startIndex + transactionsPerPage;
        const paginatedData = filteredData.slice(startIndex, endIndex);

        setTableData({
          items: paginatedData,
          totalItems: filteredData.length,
          currentPage,
          totalPages,
          loading: false,
          error: null
        });
      } catch (err) {
        setTableData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load financial transactions'
        }));
        console.error('Error loading financial transactions:', err);
      }
    };

    loadData();
  }, [propData, propLoading, propError, searchTerm, currentPage, transactionsPerPage]);

  // Payment method icons
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="w-4 h-4" />;
      case 'apple_pay':
        return <Smartphone className="w-4 h-4" />;
      case 'cash_deposit':
        return <span className="w-4 h-4 text-xs">💰</span>;
      case 'transfer':
        return <span className="w-4 h-4 text-xs">🏦</span>;
      default:
        return null;
    }
  };

  // Status badge styles
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Table columns configuration
  const columns: TableColumn<FinancialTransaction>[] = [
    {
      id: 'transactionNumber',
      label: t('headers.transactionNumber'),
      labelEn: 'Transaction Number',
      key: 'transactionNumber',
      sortable: true,
      align: 'right',
      responsive: {
        priority: 1
      },
      render: (transaction: FinancialTransaction) => (
        <span className="font-medium text-gray-900">
          {transaction.transactionNumber}
        </span>
      )
    },
    {
      id: 'date',
      label: t('headers.date'),
      labelEn: 'Date',
      key: 'date',
      sortable: true,
      align: 'right',
      responsive: {
        priority: 2
      },
      render: (transaction: FinancialTransaction) => (
        <span className="text-gray-700">
          {transaction.date}
        </span>
      )
    },
    {
      id: 'service',
      label: t('headers.service'),
      labelEn: 'Service',
      key: 'service',
      searchable: true,
      align: 'right',
      responsive: {
        priority: 3
      },
      render: (transaction: FinancialTransaction) => (
        <span className="text-gray-700">
          {transaction.service}
        </span>
      )
    },
    {
      id: 'client',
      label: t('headers.client'),
      labelEn: 'Client',
      key: 'client',
      searchable: true,
      align: 'right',
      responsive: {
        priority: 4
      },
      render: (transaction: FinancialTransaction) => (
        <span className="text-gray-700">
          {transaction.client}
        </span>
      )
    },
    {
      id: 'amount',
      label: t('headers.amount'),
      labelEn: 'Amount',
      key: 'amount',
      sortable: true,
      align: 'right',
      responsive: {
        priority: 5
      },
      render: (transaction: FinancialTransaction) => (
        <span className="font-medium text-gray-900">
          {transaction.amount.toLocaleString()} {transaction.currency}
        </span>
      )
    },
    {
      id: 'paymentStatus',
      label: t('headers.paymentStatus'),
      labelEn: 'Payment Status',
      key: 'paymentStatus',
      sortable: true,
      align: 'center',
      responsive: {
        priority: 6
      },
      render: (transaction: FinancialTransaction) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${getStatusBadgeStyle(transaction.paymentStatus)}`}>
          {t(`paymentStatuses.${transaction.paymentStatus}`)}
        </span>
      )
    },
    {
      id: 'paymentMethod',
      label: t('headers.paymentMethod'),
      labelEn: 'Payment Method',
      key: 'paymentMethod',
      align: 'center',
      responsive: {
        hidden: ['sm'],
        priority: 7
      },
      render: (transaction: FinancialTransaction) => (
        <div className="flex items-center gap-2">
          {getPaymentMethodIcon(transaction.paymentMethod)}
          <span className="text-gray-700">
            {t(`paymentMethods.${transaction.paymentMethod}`)}
          </span>
        </div>
      )
    }
  ];

  // Table actions configuration
  const actions = [
    {
      id: 'view',
      label: 'عرض',
      labelEn: 'View',
      icon: <Eye className="w-4 h-4" />,
      onClick: (transaction: FinancialTransaction) => {
        console.log('View transaction:', transaction.transactionNumber);
      },
      color: 'primary' as const
    },
    {
      id: 'edit',
      label: 'تعديل',
      labelEn: 'Edit',
      icon: <Edit className="w-4 h-4" />,
      onClick: (transaction: FinancialTransaction) => {
        console.log('Edit transaction:', transaction.transactionNumber);
      },
      color: 'secondary' as const
    },
    {
      id: 'delete',
      label: 'حذف',
      labelEn: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (transaction: FinancialTransaction) => {
        console.log('Delete transaction:', transaction.transactionNumber);
      },
      color: 'danger' as const
    }
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    // Reload data
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      {/* Header with Search */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          {t('title')}
        </h3>
        
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="بحث..."
            className="w-64 h-10 rounded-lg bg-gray-50 border border-gray-200 px-10 text-sm placeholder:text-gray-400"
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          />
          <svg className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Table */}
      <DynamicTable
        data={tableData}
        columns={columns}
        onPageChange={handlePageChange}
        onRefresh={handleRefresh}
        rtl={isRTL}
        actions={actions}
        emptyMessage="لا توجد معاملات مالية"
        showPagination={true}
        showItemsCount={true}
        itemsPerPage={transactionsPerPage}
      />
    </div>
  );
} 