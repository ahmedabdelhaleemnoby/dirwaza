import { Notification, NotificationStats, ApiNotificationResponse } from '@/types/notifications';

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'حجز جديد #2859',
    message: 'تم استلام حجز جديد من فيرة الحازمي',
    type: 'booking',
    status: 'unread',
    priority: 'high',
    timestamp: '2025-01-26T14:30:00Z',
    relatedId: '2859',
    actionUrl: '/dashboard/rest-reservations'
  },
  {
    id: '2',
    title: 'تنبيه موعد دخول',
    message: 'موعد دخول الحجز #3419 بعد ساعة واحدة',
    type: 'entry',
    status: 'unread',
    priority: 'medium',
    timestamp: '2025-01-26T13:15:00Z',
    relatedId: '3419',
    actionUrl: '/dashboard/rest-reservations'
  },
  {
    id: '3',
    title: 'تنبيه موعد خروج متأخر',
    message: 'تجاوز موعد خروج الحجز #3418 و 30 دقيقة الغضب',
    type: 'exit',
    status: 'unread',
    priority: 'urgent',
    timestamp: '2025-01-26T12:45:00Z',
    relatedId: '3418',
    actionUrl: '/dashboard/rest-reservations'
  },
  {
    id: '4',
    title: 'شحنة جديدة',
    message: 'تم استلام شحنة جديدة من الموردين تحتوي على نباتات داخلية وباقات عطرية',
    type: 'system',
    status: 'read',
    priority: 'low',
    timestamp: '2025-01-26T11:20:00Z',
    actionUrl: '/dashboard/nursery-orders'
  },
  {
    id: '5',
    title: 'تأكيد دفع',
    message: 'تم تأكيد دفع مبلغ 1,250 ريال للطلب #2857 من العميل سارة الاقطصادي',
    type: 'payment',
    status: 'read',
    priority: 'medium',
    timestamp: '2025-01-26T10:30:00Z',
    relatedId: '2857',
    actionUrl: '/dashboard/revenues'
  },
  {
    id: '6',
    title: 'حجز جديد #2858',
    message: 'تم استلام حجز جديد للاستراحة tiny house',
    type: 'booking',
    status: 'read',
    priority: 'high',
    timestamp: '2025-01-26T09:15:00Z',
    relatedId: '2858',
    actionUrl: '/dashboard/rest-reservations'
  },
  {
    id: '7',
    title: 'تذكير جلسة تدريب',
    message: 'جلسة تدريب فروسية مجدولة خلال ساعتين للعميل أحمد المالكي',
    type: 'reminder',
    status: 'read',
    priority: 'medium',
    timestamp: '2025-01-26T08:00:00Z',
    actionUrl: '/dashboard/equestrian-sessions'
  },
  {
    id: '8',
    title: 'طلب جديد من المشتل',
    message: 'طلب جديد بقيمة 850 ريال يحتوي على نباتات معمارية',
    type: 'booking',
    status: 'read',
    priority: 'medium',
    timestamp: '2025-01-25T16:45:00Z',
    actionUrl: '/dashboard/nursery-orders'
  },
  {
    id: '9',
    title: 'تنبيه موعد دخول',
    message: 'موعد دخول الحجز #3417 خلال 15 دقيقة',
    type: 'entry',
    status: 'read',
    priority: 'high',
    timestamp: '2025-01-25T15:30:00Z',
    relatedId: '3417',
    actionUrl: '/dashboard/rest-reservations'
  },
  {
    id: '10',
    title: 'إلغاء حجز',
    message: 'تم إلغاء الحجز #3416 من قبل العميل وتم استرداد المبلغ',
    type: 'system',
    status: 'read',
    priority: 'low',
    timestamp: '2025-01-25T14:20:00Z',
    relatedId: '3416',
    actionUrl: '/dashboard/rest-reservations'
  }
];

// Mock notification statistics
export const mockNotificationStats: NotificationStats = {
  total: 25,
  unread: 3,
  today: 7,
  thisWeek: 15
};

// Simulate API response with pagination
export const fetchNotifications = async (
  page: number = 1,
  limit: number = 10,
  filters?: Partial<{ type: string; status: string; priority: string; searchTerm: string }>
): Promise<ApiNotificationResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredNotifications = [...mockNotifications];

  // Apply filters
  if (filters?.type && filters.type !== 'all') {
    filteredNotifications = filteredNotifications.filter(n => n.type === filters.type);
  }

  if (filters?.status && filters.status !== 'all') {
    filteredNotifications = filteredNotifications.filter(n => n.status === filters.status);
  }

  if (filters?.priority && filters.priority !== 'all') {
    filteredNotifications = filteredNotifications.filter(n => n.priority === filters.priority);
  }

  if (filters?.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase();
    filteredNotifications = filteredNotifications.filter(n => 
      n.title.toLowerCase().includes(searchLower) || 
      n.message.toLowerCase().includes(searchLower)
    );
  }

  // Calculate pagination
  const totalItems = filteredNotifications.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);

  return {
    notifications: paginatedNotifications,
    stats: mockNotificationStats,
    totalItems,
    currentPage: page,
    totalPages
  };
};

// Get recent notifications for header dropdown
export const fetchRecentNotifications = async (limit: number = 5): Promise<Notification[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockNotifications
    .filter(n => n.status === 'unread')
    .slice(0, limit);
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.status = 'read';
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  mockNotifications.forEach(n => n.status = 'read');
}; 