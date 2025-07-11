export interface UserInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
}

export interface WorkingHours {
  from: string;
  to: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  enabled: boolean;
  price: number;
  duration: string;
}

export interface EquestrianSession {
  id: string;
  name: string;
  enabled: boolean;
  price: number;
  sessions: number;
}

export interface PlantCategory {
  id: string;
  name: string;
  enabled: boolean;
  price: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
}

export interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  type: 'email' | 'sms' | 'push';
}

export interface CalendarSetting {
  id: string;
  title: string;
  enabled: boolean;
}

export interface DeliverySetting {
  id: string;
  title: string;
  enabled: boolean;
}

export interface SettingsData {
  userInfo: UserInfo;
  workingHours: WorkingHours;
  servicePackages: ServicePackage[];
  equestrianSessions: EquestrianSession[];
  plantCategories: PlantCategory[];
  paymentMethods: PaymentMethod[];
  notificationSettings: NotificationSetting[];
  calendarSettings: CalendarSetting[];
  deliverySettings: DeliverySetting[];
}

// Mock data that simulates API response
export const mockSettingsData: SettingsData = {
  userInfo: {
    fullName: 'أحمد محمد',
    phoneNumber: '+966555123456',
    email: 'ahmed@dirwaza.com'
  },
  
  workingHours: {
    from: '08:00',
    to: '18:00'
  },
  
  servicePackages: [
    {
      id: 'tiny-house',
      name: 'Tiny house',
      enabled: true,
      price: 250,
      duration: '15'
    },
    {
      id: 'the-long',
      name: 'The Long',
      enabled: true,
      price: 200,
      duration: '10'
    },
    {
      id: 'green-house',
      name: 'Green house',
      enabled: true,
      price: 200,
      duration: '15'
    }
  ],
  
  equestrianSessions: [
    {
      id: 'individual-session',
      name: 'حصة فردية',
      enabled: true,
      price: 100,
      sessions: 1
    },
    {
      id: '12-sessions',
      name: '12حصة تدريبية',
      enabled: true,
      price: 1200,
      sessions: 12
    },
    {
      id: '8-sessions',
      name: '8 حصص تدريب',
      enabled: true,
      price: 800,
      sessions: 8
    },
    {
      id: 'daily-session',
      name: 'حصة يومية',
      enabled: true,
      price: 80,
      sessions: 1
    }
  ],
  
  plantCategories: [
    {
      id: 'indoor-plants',
      name: 'نباتات الظل',
      enabled: true,
      price: 45
    },
    {
      id: 'outdoor-plants',
      name: 'نباتات الشمس',
      enabled: true,
      price: 35
    },
    {
      id: 'seedlings',
      name: 'بذور النباتات',
      enabled: true,
      price: 25
    }
  ],
  
  paymentMethods: [
    {
      id: 'credit-card',
      name: 'Credit Card',
      enabled: true
    },
    {
      id: 'apple-pay',
      name: 'Apple pay',
      enabled: true
    },
    {
      id: 'bank-transfer',
      name: 'التحويل المصرفي',
      enabled: false
    }
  ],
  
  notificationSettings: [
    {
      id: 'new-booking',
      title: 'الحجوزات الجديدة',
      description: 'تلقي إشعارات عند وصول حجز جديد',
      enabled: true,
      type: 'push'
    },
    {
      id: 'payment-received',
      title: 'تأكيد الدفع',
      description: 'تلقي إشعارات عند استلام الدفعات',
      enabled: true,
      type: 'push'
    },
    {
      id: 'sms-notifications',
      title: 'رسائل نصية',
      description: 'تلقي إشعارات عبر الرسائل النصية',
      enabled: false,
      type: 'sms'
    },
    {
      id: 'email-notifications',
      title: 'البريد الإلكتروني',
      description: 'تلقي إشعارات عبر البريد الإلكتروني',
      enabled: true,
      type: 'email'
    }
  ],
  
  calendarSettings: [
    {
      id: 'sync-calendar',
      title: 'مزامنة التقويم',
      enabled: true
    },
    {
      id: 'show-availability',
      title: 'إظهار الأوقات المتاحة',
      enabled: true
    },
    {
      id: 'auto-block',
      title: 'حظر تلقائي للأوقات المحجوزة',
      enabled: true
    }
  ],
  
  deliverySettings: [
    {
      id: 'same-day-delivery',
      title: 'التوصيل في نفس اليوم',
      enabled: false
    },
    {
      id: 'delivery-notifications',
      title: 'إشعارات التوصيل',
      enabled: true
    },
    {
      id: 'delivery-tracking',
      title: 'تتبع عمليات التوصيل',
      enabled: true
    }
  ]
};

// Simulate API call with delay
export const fetchSettingsData = async (): Promise<SettingsData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockSettingsData;
};

// Simulate API update call
export const updateSettingsData = async (data: Partial<SettingsData>): Promise<SettingsData> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would make an API call to update the settings
  console.log('Updating settings:', data);
  
  // Return updated data (merge with existing mock data)
  return {
    ...mockSettingsData,
    ...data
  };
}; 