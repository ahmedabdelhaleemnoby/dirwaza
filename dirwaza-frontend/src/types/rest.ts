import { LucideIcon } from 'lucide-react';

export interface Amenity {
    icon: React.ElementType;
  label: string;
}

export interface RestData {
  id: string;
  name: string;
  description: string;
  rating: number;
  images: string[];
  amenities: Array<{
    icon: LucideIcon;
    label: string;
  }>;
  price: number;
  location: string;
  
  availability: {
    overnight: { checkIn: string; checkOut: string };
    withoutOvernight: { checkIn: string; checkOut: string };
  };
}

export interface DayPricing {
  date: string; // ISO date string
  price: number;
  isDisabled?: boolean;
  disabledReason?: string;
  available?:boolean;
  
}

export interface CalendarData {
  basePrice: number;
  weekendSurcharge: number;
  weekdayDiscount: number;
  customPricing: DayPricing[];
  disabledDates: string[]; // ISO date strings

} 