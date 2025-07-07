import { LucideIcon } from 'lucide-react';
import { CalendarApiResponse } from '@/lib/api/restActions';

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

export interface CalendarData {
  basePrice: number;
  weekendPrice: number;
  disabledDates: string[]; // ISO date strings
}

// Helper function to transform API response to CalendarData
export function transformCalendarApiResponse(apiResponse: CalendarApiResponse): CalendarData {
  return {
    basePrice: apiResponse.basePrice,
    weekendPrice: apiResponse.weekendPrice,
    disabledDates: apiResponse.disabledDates.map(item => {
      // Convert the date to local date string format (YYYY-MM-DD)
      const date = new Date(item.date);
      return date.toISOString().split('T')[0];
    })
  };
} 