import { 
  Calendar as CalendarIcon,
  Home as HomeIcon,
  Truck as TruckIcon,
  ShoppingCart as ShoppingCartIcon,
  type LucideIcon
} from 'lucide-react';
import type { DashboardStats } from '@/lib/api/dashboardActions';

// Mapping للأيكونات
const iconMap: Record<string, LucideIcon> = {
  calendar: CalendarIcon,
  home: HomeIcon,
  truck: TruckIcon,
  'shopping-cart': ShoppingCartIcon,
};

// Mapping للألوان
const colorMap: Record<string, string> = {
  amber: 'text-amber-600',
  green: 'text-green-600',
  blue: 'text-blue-600',
  red: 'text-red-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
};

// Interface للكرت المحول
export interface DashboardCard {
  title: string;
  value: string | number;
  status: string;
  change: string;
  icon: LucideIcon;
  statusColor: string;
}

// تحويل البيانات من API إلى تنسيق الكروت
export function transformDashboardStats(
  stats: DashboardStats, 
  locale: string = 'ar'
): DashboardCard[] {
  const isArabic = locale === 'ar';
  
  const cards: DashboardCard[] = [
    {
      title: isArabic ? stats.equestrianBookings.label : stats.equestrianBookings.labelEn,
      value: stats.equestrianBookings.count,
      status: isArabic ? stats.equestrianBookings.status : stats.equestrianBookings.statusEn,
      change: formatChange(stats.equestrianBookings.change),
      icon: iconMap[stats.equestrianBookings.icon] || CalendarIcon,
      statusColor: colorMap[stats.equestrianBookings.color] || 'text-amber-600',
    },
    {
      title: isArabic ? stats.restBookings.label : stats.restBookings.labelEn,
      value: stats.restBookings.count,
      status: isArabic ? stats.restBookings.status : stats.restBookings.statusEn,
      change: formatChange(stats.restBookings.change),
      icon: iconMap[stats.restBookings.icon] || HomeIcon,
      statusColor: colorMap[stats.restBookings.color] || 'text-amber-600',
    },
    {
      title: isArabic ? stats.shipments.label : stats.shipments.labelEn,
      value: stats.shipments.count,
      status: isArabic ? stats.shipments.status : stats.shipments.statusEn,
      change: formatChange(stats.shipments.change),
      icon: iconMap[stats.shipments.icon] || TruckIcon,
      statusColor: colorMap[stats.shipments.color] || 'text-amber-600',
    },
    {
      title: isArabic ? stats.plantOrders.label : stats.plantOrders.labelEn,
      value: stats.plantOrders.count,
      status: isArabic ? stats.plantOrders.status : stats.plantOrders.statusEn,
      change: formatChange(stats.plantOrders.change),
      icon: iconMap[stats.plantOrders.icon] || ShoppingCartIcon,
      statusColor: colorMap[stats.plantOrders.color] || 'text-amber-600',
    },
  ];

  return cards;
}

// تنسيق التغيير بالنسبة المئوية
function formatChange(change: number): string {
  if (change === 0) return '0%';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change}%`;
}

// تنسيق الأرقام الكبيرة
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

// تنسيق العملة
export function formatCurrency(amount: number, currency = 'SAR'): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// حالة Loading للكروت
export function getLoadingCards(): DashboardCard[] {
  return [
    {
      title: '...',
      value: '...',
      status: '...',
      change: '...',
      icon: CalendarIcon,
      statusColor: 'text-gray-400',
    },
    {
      title: '...',
      value: '...',
      status: '...',
      change: '...',
      icon: HomeIcon,
      statusColor: 'text-gray-400',
    },
    {
      title: '...',
      value: '...',
      status: '...',
      change: '...',
      icon: TruckIcon,
      statusColor: 'text-gray-400',
    },
    {
      title: '...',
      value: '...',
      status: '...',
      change: '...',
      icon: ShoppingCartIcon,
      statusColor: 'text-gray-400',
    },
  ];
}

// حالة Error للكروت
export function getErrorCards(error: string): DashboardCard[] {
  return [
    {
      title: 'خطأ',
      value: '--',
      status: error,
      change: '0%',
      icon: CalendarIcon,
      statusColor: 'text-red-600',
    },
    {
      title: 'خطأ',
      value: '--',
      status: error,
      change: '0%',
      icon: HomeIcon,
      statusColor: 'text-red-600',
    },
    {
      title: 'خطأ',
      value: '--',
      status: error,
      change: '0%',
      icon: TruckIcon,
      statusColor: 'text-red-600',
    },
    {
      title: 'خطأ',
      value: '--',
      status: error,
      change: '0%',
      icon: ShoppingCartIcon,
      statusColor: 'text-red-600',
    },
  ];
} 