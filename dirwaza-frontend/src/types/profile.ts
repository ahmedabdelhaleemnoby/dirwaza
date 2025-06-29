export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  profileImage?: string;
  email?: string;
}

export interface Booking {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  image: string;
  type: 'rest' | 'operator' | 'training';
  price?: number;
  currency?: string;
}

export interface ProfileSettings {
  notifications: boolean;
  language: 'ar' | 'en';
  paymentMethods: PaymentMethod[];
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'apple_pay' | 'paypal';
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export type BookingTabType = 'rest' | 'operator' | 'training'; 