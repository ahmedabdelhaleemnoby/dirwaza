import { 
  RevenueStatistics, 
  RevenueDistribution, 
  RevenueTrend, 
  FinancialTransaction, 
  MonthlyComparison,
  ApiRevenueResponse 
} from '@/types/revenues';

// Mock revenue statistics matching the design
export const mockRevenueStatistics: RevenueStatistics = {
  equestrianRevenues: {
    value: 30000,
    currency: 'ريال',
    change: '6.7%',
    changeType: 'positive'
  },
  nurseryRevenues: {
    value: 42870,
    currency: 'ريال',
    change: '15.2%',
    changeType: 'positive'
  },
  restRevenues: {
    value: 72450,
    currency: 'ريال',
    change: '8.5%',
    changeType: 'positive'
  },
  totalRevenues: {
    value: 145320,
    currency: 'ريال',
    change: '12.8%',
    changeType: 'positive'
  }
};

// Mock revenue distribution for pie chart
export const mockRevenueDistribution: RevenueDistribution[] = [
  { name: 'الاستراحات', value: 72450, color: '#113218' }, // dark green for rest
  { name: 'المشتل', value: 42870, color: '#F03500' }, // red-orange for nursery
  { name: 'الفروسية', value: 30000, color: '#FEBD01' }, // yellow for equestrian
];

// Mock revenue trends for line chart
export const mockRevenueTrends: RevenueTrend[] = [
  { month: 'يناير', equestrian: 25000, nursery: 35000, rest: 65000, total: 125000 },
  { month: 'فبراير', equestrian: 28000, nursery: 38000, rest: 68000, total: 134000 },
  { month: 'مارس', equestrian: 26000, nursery: 40000, rest: 70000, total: 136000 },
  { month: 'أبريل', equestrian: 32000, nursery: 39000, rest: 69000, total: 140000 },
  { month: 'مايو', equestrian: 29000, nursery: 41000, rest: 71000, total: 141000 },
  { month: 'يونيو', equestrian: 30000, nursery: 42870, rest: 72450, total: 145320 },
];

// Mock financial transactions for the table
export const mockFinancialTransactions: FinancialTransaction[] = [
  {
    id: '1',
    transactionNumber: '#INV-7845',
    date: '24 يونيو 2025',
    service: 'استراحة The Green House',
    client: 'أحمد الغامدي',
    amount: 1500,
    currency: 'ريال',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card'
  },
  {
    id: '2',
    transactionNumber: '#INV-7844',
    date: '23 يونيو 2025',
    service: 'حصة فروسية فردية',
    client: 'سارة الأحمد',
    amount: 350,
    currency: 'ريال',
    paymentStatus: 'paid',
    paymentMethod: 'apple_pay'
  },
  {
    id: '3',
    transactionNumber: '#INV-7843',
    date: '22 يونيو 2025',
    service: 'طلب مشتل - نباتات داخلية',
    client: 'محمد العتيبي',
    amount: 480,
    currency: 'ريال',
    paymentStatus: 'pending',
    paymentMethod: 'credit_card'
  },
  {
    id: '4',
    transactionNumber: '#INV-7842',
    date: '21 يونيو 2025',
    service: 'استراحة Tiny House',
    client: 'فهد الدوسري',
    amount: 850,
    currency: 'ريال',
    paymentStatus: 'paid',
    paymentMethod: 'cash_deposit'
  },
  {
    id: '5',
    transactionNumber: '#INV-7841',
    date: '20 يونيو 2025',
    service: 'حصة فروسية فردية',
    client: 'نورة السليم',
    amount: 500,
    currency: 'ريال',
    paymentStatus: 'paid',
    paymentMethod: 'apple_pay'
  },
  {
    id: '6',
    transactionNumber: '#INV-7840',
    date: '19 يونيو 2025',
    service: 'طلب مشتل - أشجار زينة',
    client: 'عبير المالكي',
    amount: 720,
    currency: 'ريال',
    paymentStatus: 'cancelled',
    paymentMethod: 'transfer'
  },
  {
    id: '7',
    transactionNumber: '#INV-7839',
    date: '18 يونيو 2025',
    service: 'استراحة The Green House',
    client: 'خالد النمري',
    amount: 1200,
    currency: 'ريال',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card'
  },
  {
    id: '8',
    transactionNumber: '#INV-7838',
    date: '17 يونيو 2025',
    service: 'حصة فروسية جماعية',
    client: 'ريم الشهراني',
    amount: 280,
    currency: 'ريال',
    paymentStatus: 'paid',
    paymentMethod: 'apple_pay'
  }
];

// Mock monthly comparison data for the bottom chart
export const mockMonthlyComparison: MonthlyComparison[] = [
  { month: 'يناير', currentYear: 125000, previousYear: 110000 },
  { month: 'فبراير', currentYear: 134000, previousYear: 118000 },
  { month: 'مارس', currentYear: 136000, previousYear: 125000 },
  { month: 'أبريل', currentYear: 140000, previousYear: 128000 },
  { month: 'مايو', currentYear: 141000, previousYear: 132000 },
  { month: 'يونيو', currentYear: 145320, previousYear: 135000 },
];

// Simulate API response with delay for SSR
export const fetchRevenuesData = async (): Promise<ApiRevenueResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    statistics: mockRevenueStatistics,
    distribution: mockRevenueDistribution,
    trends: mockRevenueTrends,
    transactions: mockFinancialTransactions,
    monthlyComparison: mockMonthlyComparison
  };
};

// Individual fetch functions for different sections
export const fetchRevenueStatistics = async (): Promise<RevenueStatistics> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockRevenueStatistics;
};

export const fetchRevenueDistribution = async (): Promise<RevenueDistribution[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockRevenueDistribution;
};

export const fetchRevenueTrends = async (): Promise<RevenueTrend[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockRevenueTrends;
};

export const fetchFinancialTransactions = async (): Promise<FinancialTransaction[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockFinancialTransactions;
};

export const fetchMonthlyComparison = async (): Promise<MonthlyComparison[]> => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockMonthlyComparison;
}; 