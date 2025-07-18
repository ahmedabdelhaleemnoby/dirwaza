export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  profileImage?: string;
  email?: string;
}

export interface Booking {
  id: string;
  type: 'rest' | 'training' | 'operator';
  title: string;
  date: string;
  time?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  location?: string;
  price?: number;
  image?: string;
}

export interface ProfileData {
  name: string;
  phone: string;
  image?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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