// Translation function type
type TranslationFunction = (key: string) => string;

// Contact information types (API Response)
export interface ContactInfoResponse {
  _id: string;
  id: string;
  title: string;
  titleAr: string;
  links: SocialMediaLink[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  localizedTitle: string;
}

// Legacy type for backward compatibility
export interface ContactInfo {
  id: string;
  title: string;
  links: SocialMediaLink[];
}

export interface SocialMediaLink {
  id: string;
  type: 'email' | 'instagram' | 'whatsapp' | 'phone' | 'website';
  label: string;
  labelAr: string;
  url: string;
  icon: string;
  hoverColor: string;
  hoverEffect?: string;
  ariaLabel: string;
  ariaLabelAr: string;
}

// Contact mock data
export const mockContactData: ContactInfo = {
  id: 'contact-info',
  title: 'Contact Us',
  links: [
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      labelAr: 'البريد الإلكتروني',
      url: 'mailto:info@dirwaza.com',
      icon: 'Mail',
      hoverColor: 'hover:text-blue-600',
      ariaLabel: 'Send Email',
      ariaLabelAr: 'إرسال بريد إلكتروني'
    },
    {
      id: 'instagram',
      type: 'instagram',
      label: 'Instagram',
      labelAr: 'إنستغرام',
      url: 'https://instagram.com/dirwaza',
      icon: 'Instagram',
      hoverColor: 'hover:text-pink-600',
      hoverEffect: 'hover:rotate-12',
      ariaLabel: 'Follow on Instagram',
      ariaLabelAr: 'تابعنا على إنستغرام'
    },
    {
      id: 'whatsapp',
      type: 'whatsapp',
      label: 'WhatsApp',
      labelAr: 'واتساب',
      url: 'https://wa.me/966501234567',
      icon: 'MessageCircle',
      hoverColor: 'hover:text-green-600',
      hoverEffect: 'hover:rotate-[-12deg]',
      ariaLabel: 'Contact on WhatsApp',
      ariaLabelAr: 'تواصل عبر واتساب'
    }
  ]
};

// Extended contact data with more options
export const mockExtendedContactData: ContactInfo = {
  id: 'extended-contact-info',
  title: 'Contact Us',
  links: [
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      labelAr: 'البريد الإلكتروني',
      url: 'mailto:info@dirwaza.com',
      icon: 'Mail',
      hoverColor: 'hover:text-blue-600',
      ariaLabel: 'Send Email',
      ariaLabelAr: 'إرسال بريد إلكتروني'
    },
    {
      id: 'phone',
      type: 'phone',
      label: 'Phone',
      labelAr: 'الهاتف',
      url: 'tel:+966501234567',
      icon: 'Phone',
      hoverColor: 'hover:text-blue-500',
      ariaLabel: 'Call Us',
      ariaLabelAr: 'اتصل بنا'
    },
    {
      id: 'instagram',
      type: 'instagram',
      label: 'Instagram',
      labelAr: 'إنستغرام',
      url: 'https://instagram.com/dirwaza',
      icon: 'Instagram',
      hoverColor: 'hover:text-pink-600',
      hoverEffect: 'hover:rotate-12',
      ariaLabel: 'Follow on Instagram',
      ariaLabelAr: 'تابعنا على إنستغرام'
    },
    {
      id: 'whatsapp',
      type: 'whatsapp',
      label: 'WhatsApp',
      labelAr: 'واتساب',
      url: 'https://wa.me/966501234567',
      icon: 'MessageCircle',
      hoverColor: 'hover:text-green-600',
      hoverEffect: 'hover:rotate-[-12deg]',
      ariaLabel: 'Contact on WhatsApp',
      ariaLabelAr: 'تواصل عبر واتساب'
    },
    {
      id: 'website',
      type: 'website',
      label: 'Website',
      labelAr: 'الموقع الإلكتروني',
      url: 'https://dirwaza.com',
      icon: 'Globe',
      hoverColor: 'hover:text-purple-600',
      ariaLabel: 'Visit Website',
      ariaLabelAr: 'زيارة الموقع'
    }
  ]
};

// Contact settings data
export interface ContactSettings {
  showTitle: boolean;
  maxLinksToShow: number;
  iconSize: number;
  enableHoverEffects: boolean;
  openExternalLinksInNewTab: boolean;
}

export const mockContactSettings: ContactSettings = {
  showTitle: true,
  maxLinksToShow: 5,
  iconSize: 24,
  enableHoverEffects: true,
  openExternalLinksInNewTab: true
};

// Mock API functions
export const fetchContactInfo = async (): Promise<ContactInfo> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockContactData;
};

export const fetchExtendedContactInfo = async (): Promise<ContactInfo> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockExtendedContactData;
};

export const fetchContactSettings = async (): Promise<ContactSettings> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockContactSettings;
};

// Function to get translated contact data
export const getContactData = (t: TranslationFunction, extended: boolean = false): ContactInfo => {
  const baseData = extended ? mockExtendedContactData : mockContactData;
  
  return {
    ...baseData,
    title: t('title'),
    links: baseData.links.map(link => ({
      ...link,
      ariaLabel: t(`links.${link.id}.ariaLabel`) || link.ariaLabel,
      label: t(`links.${link.id}.label`) || link.label
    }))
  };
};

// Contact form data (for future use)
export interface ContactForm {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  type: 'inquiry' | 'support' | 'booking' | 'feedback';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'responded' | 'resolved' | 'closed';
  createdAt: string;
  respondedAt?: string;
}

export const mockContactForms: ContactForm[] = [
  {
    id: 'cf-001',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    subject: 'استفسار عن الحجز',
    message: 'أريد حجز استراحة لهذا الأسبوع',
    type: 'booking',
    priority: 'medium',
    status: 'pending',
    createdAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'cf-002',
    name: 'سارة أحمد',
    email: 'sara@example.com',
    subject: 'استفسار عن تدريب الفروسية',
    message: 'ما هي أوقات تدريب الأطفال؟',
    type: 'inquiry',
    priority: 'low',
    status: 'responded',
    createdAt: '2025-01-14T14:15:00Z',
    respondedAt: '2025-01-14T16:00:00Z'
  }
];

export const fetchContactForms = async (): Promise<ContactForm[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return mockContactForms;
}; 