export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: 'equestrian' | 'nursery' | 'rest' | 'event' | 'maintenance';
  date: string; // ISO date string
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  client?: string;
  status: 'active' | 'pending' | 'cancelled';
  location?: string;
  day: number; // 0 = Sunday, 1 = Monday, etc.
}

export interface CalendarWeekData {
  weekStart: Date;
  events: CalendarEvent[];
}

export interface CalendarFilters {
  search: string;
  type: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
} 