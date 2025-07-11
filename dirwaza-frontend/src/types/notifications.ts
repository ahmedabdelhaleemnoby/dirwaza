export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'entry' | 'exit' | 'payment' | 'system' | 'reminder';
  status: 'unread' | 'read';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  relatedId?: string; // booking ID, order ID, etc.
  icon?: string;
  actionUrl?: string;
}

export interface NotificationFilters {
  type: string;
  status: string;
  priority: string;
  date: string;
  searchTerm: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  today: number;
  thisWeek: number;
}

export interface ApiNotificationResponse {
  notifications: Notification[];
  stats: NotificationStats;
  totalItems: number;
  currentPage: number;
  totalPages: number;
} 