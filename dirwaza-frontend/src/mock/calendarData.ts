import { CalendarData } from "@/types/rest";

// Helper function to create a date string
const createDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const mockCalendarData: CalendarData = {
  basePrice: 500,
  weekendSurcharge: 100, // Additional amount for weekends
  weekdayDiscount: 50,   // Discount amount for weekdays
  
  // Custom pricing for specific dates
  customPricing: [
    // High demand dates (e.g., holidays)
    {
      date: createDate(7),
      price: 800,
      available:true,isDisabled:false,
    },
    {
      date: createDate(8),
      price: 800,
      available:true,isDisabled:false,

    },
    {
      date: createDate(9),
      price: 800,
      available:true,isDisabled:false,

    },
    
    // Special discount dates
    {
      date: createDate(15),
      available:true,isDisabled:false,
      price: 400,
    },
    {
      date: createDate(16),
      available:true,isDisabled:false,
      price: 400,
    },
    
    // Maintenance dates (disabled)
   
  ],
  
  // Additional disabled dates (e.g., already booked)
  disabledDates: [
    createDate(25),
    createDate(26),
    createDate(27),
    createDate(30),
  ],
}; 