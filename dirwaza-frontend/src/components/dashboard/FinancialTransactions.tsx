
"use client";

import { useTranslations } from "next-intl";
import { CreditCard, Smartphone, Building, Banknote, MoreHorizontal } from "lucide-react";
import { usePayments } from "@/hooks/api/usePayments";
import { formatCurrency } from "@/utils/paymentsUtils";
import type { Payment } from "@/lib/api/paymentsActions";

// Payment method configuration
const PAYMENT_CONFIG = {
  creditCard: {
    icon: CreditCard,
    label: "Credit Card",
    labelAr: "بطاقة ائتمانية"
  },
  debitCard: {
    icon: CreditCard,
    label: "Debit Card", 
    labelAr: "بطاقة خصم"
  },
  applePay: {
    icon: Smartphone,
    label: "Apple Pay",
    labelAr: "Apple Pay"
  },
  bankTransfer: {
    icon: Building,
    label: "Bank Transfer",
    labelAr: "تحويل بنكي"
  },
  cash: {
    icon: Banknote,
    label: "Cash",
    labelAr: "نقدي"
  }
} as const;

// Get payment method configuration
function getPaymentConfig(method: string) {
  return PAYMENT_CONFIG[method as keyof typeof PAYMENT_CONFIG] || {
    icon: MoreHorizontal,
    label: method,
    labelAr: method
  };
}

// Utility functions now imported from shared utils

// Format date/time
function formatDateTime(dateString: string): string {
  if (!dateString) return 'غير محدد';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'غير محدد';
  
  return new Intl.DateTimeFormat('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

// Transaction Card Component
interface TransactionCardProps {
  payment: Payment;
}

function TransactionCard({ payment }: TransactionCardProps) {
  const config = getPaymentConfig(payment.paymentMethod);
  const IconComponent = config.icon;
  const shortInvoice = payment.invoice.slice(-5);

  return (
    <div className="bg-[#D7F9FF] rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#D3DE76]">
            <IconComponent className="h-5 w-5 text-gray-700" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{config.label}</h3>
            <p className="text-xs text-gray-500">#{shortInvoice}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">
            {formatCurrency(payment.amount, payment.currency)}
          </p>
          <p className="text-sm text-gray-500">{formatDateTime(payment.date)}</p>
        </div>
      </div>
    </div>
  );
}

// Loading Card Component
function LoadingCard() {
  return (
    <div className="bg-[#D7F9FF] rounded-lg p-4 border border-gray-100 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div className="text-right">
          <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function FinancialTransactions() {
  const t = useTranslations('Dashboard');
  const { data, loading, error } = usePayments();
  
  // Get latest 3 transactions
  const recentPayments = data?.payments?.slice(0, 3) || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("financialTransactions.title") || "المعاملات المالية"}
        </h2>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          // Loading State
          Array.from({ length: 3 }, (_, index) => (
            <LoadingCard key={`loading-${index}`} />
          ))
        ) : error ? (
          // Error State
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">خطأ في تحميل البيانات</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        ) : recentPayments.length > 0 ? (
          // Success State
          recentPayments.map((payment) => (
            <TransactionCard key={payment.id} payment={payment} />
          ))
        ) : (
          // Empty State
          <div className="text-center py-8 text-gray-500">
            <p>لا توجد معاملات مالية</p>
          </div>
        )}
      </div>

      {/* Footer - Optional pagination info */}
      {data?.pagination && !loading && !error && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm text-gray-600">
            <span>إجمالي المعاملات: {data.pagination.total}</span>
            <span>الصفحة: {data.pagination.page} من {data.pagination.pages}</span>
          </div>
        </div>
      )}
    </div>
  );
}
