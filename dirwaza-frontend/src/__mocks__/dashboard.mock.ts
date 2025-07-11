import { 
  Home, 
  Package, 
  BarChart3, 
  ShoppingCart, 
  Phone as PhoneIcon, 
  Percent as PercentIcon,
  CreditCard as CreditCardIcon,
  Home as HomeIcon,
  LucideIcon
} from "lucide-react";

// Translation function type
type TranslationFunction = (key: string) => string;

// Chart data types
export interface ChartDataPoint {
  name: string;
  operator: number;
  training: number;
  rest: number;
}

// Revenue chart mock data
export const mockRevenueChartData: ChartDataPoint[] = [
  { name: 'يناير', operator: 6000, training: 4200, rest: 2000 },
  { name: 'فبراير', operator: 7200, training: 4000, rest: 2200 },
  { name: 'مارس', operator: 5500, training: 3000, rest: 2100 },
  { name: 'أبريل', operator: 7500, training: 3500, rest: 2300 },
  { name: 'مايو', operator: 4000, training: 3200, rest: 2000 },
];

// Overview cards data types
export interface OverviewCard {
  title: string;
  value: number;
  change: string;
  status: string;
  icon: LucideIcon;
  color: string;
  statusColor: string;
}

// Overview cards mock data - Function to get translated data
export const getOverviewCards = (t: TranslationFunction): OverviewCard[] => [
  {
    title: t("stats.operatorRequests"),
    value: 24,
    change: "+12%",
    status: t("stats.newOrder"),
    icon: ShoppingCart,
    color: "bg-orange-500",
    statusColor: "text-orange-500",
  },
  {
    title: t("stats.shipments"),
    value: 18,
    change: "+12%",
    status: t("stats.inDelivery"),
    icon: BarChart3,
    color: "bg-yellow-500",
    statusColor: "text-yellow-600",
  },
  {
    title: t("stats.reservations"),
    value: 8,
    change: "+20%",
    status: t("stats.todayBooking"),
    icon: Package,
    color: "bg-blue-500",
    statusColor: "text-blue-500",
  },
  {
    title: t("stats.newRequests"),
    value: 15,
    change: "+20%",
    status: t("stats.limited"),
    icon: Home,
    color: "bg-orange-500",
    statusColor: "text-red-500",
  },
];

// Financial transactions data types
export interface FinancialTransaction {
  type: string;
  amount: number;
  time: string;
  transactionNumber: string;
  icon: LucideIcon;
  iconBgColor: string;
}

// Financial transactions mock data - Function to get translated data
export const getFinancialTransactions = (t: TranslationFunction): FinancialTransaction[] => [
  {
    type: t("financialTransactions.creditCard"),
    amount: 850,
    time: "10:30",
    transactionNumber: "12345#",
    icon: CreditCardIcon,
    iconBgColor: "bg-yellow-500",
  },
  {
    type: t("financialTransactions.applePay"),
    amount: 420,
    time: "10:30",
    transactionNumber: "12346#",
    icon: PhoneIcon,
    iconBgColor: "bg-gray-800",
  },
  {
    type: t("financialTransactions.offers"),
    amount: 650,
    time: "10:30",
    transactionNumber: "12347#",
    icon: PercentIcon,
    iconBgColor: "bg-yellow-500",
  },
];

// Tasks and orders data types
export interface Task {
  title: string;
  priority: string;
  priorityColor: string;
  date: string;
}

export interface RecentOrder {
  client: string;
  service: string;
  date: string;
  status: string;
  statusColor: string;
}

// Tasks mock data - Function to get translated data
export const getTasks = (t: TranslationFunction): Task[] => [
  {
    title: t('tasks.confirmReservationBooking'),
    priority: t('tasks.urgent'),
    priorityColor: 'bg-red-100 text-red-800',
    date: t('tasks.today')
  },
  {
    title: t('tasks.processNewPropertyDocs'),
    priority: t('tasks.today'),
    priorityColor: 'bg-yellow-100 text-yellow-800',
    date: t('tasks.today')
  },
  {
    title: t('tasks.updateWebsiteForNewBatch'),
    priority: t('tasks.tomorrow'),
    priorityColor: 'bg-blue-100 text-blue-800',
    date: t('tasks.tomorrow')
  },
  {
    title: t('tasks.updateMaintenanceSchedule'),
    priority: t('tasks.tomorrow'),
    priorityColor: 'bg-blue-100 text-blue-800',
    date: t('tasks.tomorrow')
  }
];

// Recent orders mock data - Function to get translated data
export const getRecentOrders = (t: TranslationFunction): RecentOrder[] => [
  {
    client: 'Sarah Ahmed',
    service: 'The Long',
    date: 'Jul 23, 2025',
    status: t('recentOrders.confirmed'),
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    client: 'Mohammad Khalid',
    service: 'Property Consultation',
    date: 'Jul 23, 2025',
    status: t('recentOrders.pending'),
    statusColor: 'bg-yellow-100 text-yellow-800'
  },
  {
    client: 'Nora Ahmed',
    service: 'Garden Planning',
    date: 'Jul 23, 2025',
    status: t('recentOrders.delivered'),
    statusColor: 'bg-green-100 text-green-800'
  }
];

// Activity sections data types
export interface ActivityItem {
  title: string;
  subtitle: string;
  time: string;
  status: string;
  statusColor: string;
  icon: LucideIcon;
}

// New requests mock data - Function to get translated data
export const getNewRequestsItems = (t: TranslationFunction): ActivityItem[] => [
  {
    title: t('newRequestsSection.processProperty'),
    subtitle: '12 ' + t('newRequestsSection.newPropertyRequest'),
    time: '10:00 ' + t('newRequestsSection.today'),
    status: t('newRequestsSection.ongoing'),
    statusColor: 'bg-blue-100 text-blue-800',
    icon: HomeIcon
  },
  {
    title: t('newRequestsSection.singleProperty'),
    subtitle: '1:00 ' + t('newRequestsSection.today'),
    time: t('newRequestsSection.today'),
    status: t('newRequestsSection.ongoing'),
    statusColor: 'bg-yellow-100 text-yellow-800',
    icon: HomeIcon
  },
  {
    title: t('newRequestsSection.emergencyProperty'),
    subtitle: '3:00 ' + t('newRequestsSection.today'),
    time: t('newRequestsSection.today'),
    status: t('newRequestsSection.ongoing'),
    statusColor: 'bg-yellow-100 text-yellow-800',
    icon: HomeIcon
  }
];

// Reservations mock data - Function to get translated data
export const getReservationsItems = (t: TranslationFunction): ActivityItem[] => [
  {
    title: t('reservationsSection.theLong'),
    subtitle: '9:00 AM - 5:00 PM',
    time: t('reservationsSection.today'),
    status: t('reservationsSection.confirmed'),
    statusColor: 'bg-green-100 text-green-800',
    icon: HomeIcon
  },
  {
    title: t('reservationsSection.tinyHouse'),
    subtitle: '2:00 PM - 8:00 PM',
    time: t('reservationsSection.today'),
    status: t('reservationsSection.confirmed'),
    statusColor: 'bg-green-100 text-green-800',
    icon: HomeIcon
  },
  {
    title: t('reservationsSection.theGreenHouse'),
    subtitle: '4:00 PM - 10:00 PM',
    time: t('reservationsSection.today'),
    status: t('reservationsSection.confirmed'),
    statusColor: 'bg-green-100 text-green-800',
    icon: HomeIcon
  }
]; 