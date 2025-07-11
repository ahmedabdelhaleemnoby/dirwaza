import { BarChart3, Activity, X, Calendar, LucideIcon } from 'lucide-react';

// Equestrian session data types
export interface EquestrianSession {
  id: string;
  sessionNumber: string;
  clientName: string;
  clientPhone: string;
  sessionType: string;
  sessionTypeDescription: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  date: string;
  time: string;
  amountPaid: number;
  currency: string;
  status: 'active' | 'scheduled' | 'cancelled' | 'completed';
  farmName: string;
}

export interface EquestrianTableData {
  items: EquestrianSession[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

// Equestrian sessions mock data
export const mockEquestrianSessions: EquestrianSession[] = [
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

// Equestrian statistics data types
export interface StatData {
  id: string;
  title: string;
  value: number;
  change: string;
  changeType: 'positive' | 'negative';
  subtitle: string;
  icon: LucideIcon;
}

// Equestrian statistics mock data
export const mockEquestrianStatistics: StatData[] = [
  {
    id: 'total',
    title: 'إجمالي الحصص',
    value: 60,
    change: '+12%',
    changeType: 'positive',
    subtitle: 'جميع الحصص',
    icon: BarChart3
  },
  {
    id: 'active',
    title: 'الحصص النشطة',
    value: 39,
    change: '+25%',
    changeType: 'positive',
    subtitle: 'إجمالي الحصص النشطة',
    icon: Activity
  },
  {
    id: 'cancelled',
    title: 'الحصص الملغاة', 
    value: 8,
    change: '-5%',
    changeType: 'negative',
    subtitle: 'إلغاؤها',
    icon: X
  },
  {
    id: 'scheduled',
    title: 'الحصص المجدولة',
    value: 13,
    change: '+15%',
    changeType: 'positive',
    subtitle: 'متوسط شهري',
      icon: Calendar
  },
];

// Equestrian filter options
export const mockEquestrianFilterOptions = {
  typeOptions: [
    { id: "all", value: "all" },
    { id: "daily", value: "daily" },
    { id: "group", value: "group" },
    { id: "individual", value: "individual" },
    { id: "advanced", value: "advanced" },
  ],
};

// Mock API functions
export const fetchEquestrianSessions = async (): Promise<EquestrianTableData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    items: mockEquestrianSessions,
    totalItems: mockEquestrianSessions.length,
    currentPage: 1,
    totalPages: 1,
    loading: false,
    error: null
  };
};

export const fetchEquestrianStatistics = async (): Promise<StatData[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return mockEquestrianStatistics;
};

export const fetchEquestrianFilters = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockEquestrianFilterOptions;
}; 