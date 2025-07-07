import { CalendarData } from "@/types/rest";

// Helper function to create a date string
const createDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const mockCalendarData: CalendarData = {
  basePrice: 450,
  weekendPrice: 600,
  
  // Disabled dates (e.g., already booked or maintenance)
  disabledDates: [
    createDate(25),
    createDate(26),
    createDate(27),
    createDate(30),
  ],
}; 