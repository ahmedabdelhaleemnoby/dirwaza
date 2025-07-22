import { 
  CreditCard as CreditCardIcon,
  Smartphone as ApplePayIcon,
  Building as BankIcon,
  Banknote as CashIcon,
  MoreHorizontal as OtherIcon,
  type LucideIcon
} from 'lucide-react';
import type { Payment } from '@/lib/api/paymentsActions';

// Essential payment utilities for reuse across the app

// Mapping للأيكونات حسب طريقة الدفع
export const paymentMethodIconMap: Record<string, LucideIcon> = {
  creditCard: CreditCardIcon,
  debitCard: CreditCardIcon,
  applePay: ApplePayIcon,
  bankTransfer: BankIcon,
  cash: CashIcon,
  other: OtherIcon,
};

// Mapping لألوان الحالة
export const statusColorMap: Record<string, string> = {
  pending: 'text-yellow-600 bg-yellow-50',
  completed: 'text-green-600 bg-green-50',
  failed: 'text-red-600 bg-red-50',
  cancelled: 'text-gray-600 bg-gray-50',
  refunded: 'text-blue-600 bg-blue-50',
};

// Interface للمدفوعة المحولة (for backward compatibility)
export interface TransformedPayment {
  id: string;
  type: string;
  amount: number;
  formattedAmount: string;
  time: string;
  date: string;
  transactionNumber: string;
  status: string;
  statusText: string;
  statusColor: string;
  method: string;
  methodText: string;
  icon: LucideIcon;
  customerName?: string;
  description?: string;
}

// Essential utility functions

// تنسيق العملة
export function formatCurrency(amount: number, currency = 'SAR'): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

// تنسيق الوقت
export function formatTime(dateString: string, isArabic = true): string {
  if (!dateString || dateString.trim() === '') {
    return isArabic ? 'غير محدد' : 'N/A';
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return isArabic ? 'غير محدد' : 'Invalid';
  }
  
  return new Intl.DateTimeFormat(isArabic ? 'ar-SA' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

// تنسيق التاريخ
export function formatDate(dateString: string, isArabic = true): string {
  if (!dateString || dateString.trim() === '') {
    return isArabic ? 'غير محدد' : 'N/A';
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return isArabic ? 'غير محدد' : 'Invalid';
  }
  
  return new Intl.DateTimeFormat(isArabic ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

// تصفية المدفوعات حسب الفترة الزمنية (for backward compatibility)
export function filterPaymentsByPeriod(payments: Payment[], period: 'today' | 'week' | 'month'): Payment[] {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay.getTime() - (startOfDay.getDay() * 24 * 60 * 60 * 1000));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return payments.filter(payment => {
    // تجاهل المدفوعات ذات التواريخ غير الصحيحة
    if (!payment.date) {
      return false;
    }
    
    const paymentDate = new Date(payment.date);
    if (isNaN(paymentDate.getTime())) {
      return false;
    }
    
    switch (period) {
      case 'today':
        return paymentDate >= startOfDay;
      case 'week':
        return paymentDate >= startOfWeek;
      case 'month':
        return paymentDate >= startOfMonth;
      default:
        return true;
    }
  });
}

// حساب إجمالي المدفوعات
export function calculatePaymentsTotal(payments: Payment[]): number {
  return payments.reduce((total, payment) => {
    if (payment.status === 'completed') {
      return total + payment.amount;
    }
    return total;
  }, 0);
}

// حساب إحصائيات المدفوعات
export function calculatePaymentsStats(payments: Payment[]) {
  const total = payments.length;
  const completed = payments.filter(p => p.status === 'completed').length;
  const pending = payments.filter(p => p.status === 'pending').length;
  const failed = payments.filter(p => p.status === 'failed').length;
  const totalAmount = calculatePaymentsTotal(payments);

  return {
    total,
    completed,
    pending,
    failed,
    totalAmount,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
} 