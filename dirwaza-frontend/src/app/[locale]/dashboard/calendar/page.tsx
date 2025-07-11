import { Suspense } from "react";
import CalendarWeeklyView from "@/components/dashboard/calendar/CalendarWeeklyView";
import { mockCalendarEvents } from "@/mock/calendarMockData";

// Simulate SSR data fetching
async function getCalendarData() {
  // Simulate API delay for SSR
  // await new Promise(resolve => setTimeout(resolve, 100));
  return mockCalendarEvents;
}

// Loading component for the calendar
function CalendarLoading() {
  return (
    <div className="min-h-screen bg-neutral p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="bg-white rounded-2xl p-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Calendar page component
async function CalendarPage() {
  const events = await getCalendarData();

  return (
    <div className="min-h-screen bg-neutral">
      <div className="container mx-auto">
        <CalendarWeeklyView 
          events={events}
        />
      </div>
    </div>
  );
}

// Main page export with Suspense
export default function Calendar() {
  return (
    <Suspense fallback={<CalendarLoading />}>
      <CalendarPage />
    </Suspense>
  );
} 