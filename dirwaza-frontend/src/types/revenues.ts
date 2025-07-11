export interface RevenueStatistics {
  equestrianRevenues: {
    value: number;
    currency: string;
    change: string;
    changeType: 'positive' | 'negative';
  };
  nurseryRevenues: {
    value: number;
    currency: string;
    change: string;
    changeType: 'positive' | 'negative';
  };
  restRevenues: {
    value: number;
    currency: string;
    change: string;
    changeType: 'positive' | 'negative';
  };
  totalRevenues: {
    value: number;
    currency: string;
    change: string;
    changeType: 'positive' | 'negative';
  };
}

export interface RevenueDistribution {
  name: string;
  value: number;
  color: string;
}

export interface RevenueTrend {
  month: string;
  equestrian: number;
  nursery: number;
  rest: number;
  total: number;
}

export interface FinancialTransaction {
  id: string;
  transactionNumber: string;
  date: string;
  service: string;
  client: string;
  amount: number;
  currency: string;
  paymentStatus: 'paid' | 'pending' | 'cancelled';
  paymentMethod: 'credit_card' | 'apple_pay' | 'cash_deposit' | 'transfer';
}

export interface MonthlyComparison {
  month: string;
  currentYear: number;
  previousYear: number;
}

export interface RevenueFilters {
  service: string;
  dateFrom: string;
  dateTo: string;
  searchTerm: string;
}

export interface ApiRevenueResponse {
  statistics: RevenueStatistics;
  distribution: RevenueDistribution[];
  trends: RevenueTrend[];
  transactions: FinancialTransaction[];
  monthlyComparison: MonthlyComparison[];
} 