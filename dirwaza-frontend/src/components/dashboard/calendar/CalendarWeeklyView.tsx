"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarEvent } from "@/types/calendar";

interface CalendarWeeklyViewProps {
  events?: CalendarEvent[];
  loading?: boolean;
  onAddEvent?: () => void;
}

// Time slots from 8 AM to 12 PM as shown in design
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00"];

// Helper functions for week management
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = d.getDate() - day; // Calculate difference to Sunday
  return new Date(d.setDate(diff));
};

const isDateInWeek = (dateString: string, weekStart: Date): boolean => {
  const date = new Date(dateString);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return date >= weekStart && date <= weekEnd;
};

const formatWeekRange = (weekStart: Date, locale: string): string => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const startMonth = weekStart.getMonth();
  const endMonth = weekEnd.getMonth();

  const months =
    locale === "ar"
      ? [
          "يناير",
          "فبراير",
          "مارس",
          "أبريل",
          "مايو",
          "يونيو",
          "يوليو",
          "أغسطس",
          "سبتمبر",
          "أكتوبر",
          "نوفمبر",
          "ديسمبر",
        ]
      : [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${months[startMonth]}`;
  } else {
    return `${startDay} ${months[startMonth]} - ${endDay} ${months[endMonth]}`;
  }
};

export default function CalendarWeeklyView({
  events = [],
  loading = false,
}: // onAddEvent,
CalendarWeeklyViewProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Initialize with current week
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    return getWeekStart(new Date());
  });

  // Arabic day names (Sunday to Saturday)
  const dayNames = isRTL
    ? ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
    : [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

  const getEventColor = (type: string) => {
    switch (type) {
      case "equestrian":
        return "bg-secondary"; // Orange for equestrian sessions (matches design)
       case "rest":
        return "bg-accent-dark"; // Yellow/khaki for nursery requests
     case "nursery":
        return "bg-primary-light"; // Steelblue for rest reservations
      case "event":
        return "bg-brand-red"; // Orangered for general events
      case "maintenance":
        return "bg-gray-200"; // Gray for maintenance
      default:
        return "bg-gray-200";
    }
  };

  // Filter events for current week
  const currentWeekEvents = events.filter((event) =>
    isDateInWeek(event.date, currentWeekStart)
  );

  const getEventsByDayAndTime = (day: number, timeIndex: number) => {
    return currentWeekEvents.filter((event) => {
      const eventHour = parseInt(event.startTime.split(":")[0]);
      const slotHour = parseInt(timeSlots[timeIndex].split(":")[0]);
      return event.day === day && eventHour === slotHour;
    });
  };

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeekStart((prevWeek) => {
      const newWeek = new Date(prevWeek);
      const daysToMove = direction === "next" ? 7 : -7;
      newWeek.setDate(prevWeek.getDate() + daysToMove);
      return newWeek;
    });
  };

  // Dynamic icon selection based on RTL
  const NextIcon = isRTL ? ChevronRight : ChevronLeft;
  const PrevIcon = isRTL ? ChevronLeft : ChevronRight;

  const legendItems = [
    {
      color: "bg-secondary",
      label: isRTL ? "حصة فروسية" : "Equestrian Session",
    },
    {
      color: "bg-accent-dark",
      label: isRTL ? "حجوزات استراحة" : "Rest Reservations",
    },
    {
      color: "bg-primary-light",
      label: isRTL ? "طلبات المشتل" : "Nursery Requests",
    },
    {
      color: "bg-brand-red",
      label: isRTL ? "المناسبات او الفعاليات" : "Events",
    },
  ];

  if (loading) {
    return (
      <div className="w-full p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative flex flex-col items-start justify-start p-6 gap-4 mix-blend-normal">
      {/* Header */}
      {/* <div className="w-full shadow-sm rounded-2xl bg-white h-20 overflow-hidden shrink-0 flex flex-col items-start justify-start p-5 box-border">
        <div className="w-full h-10 flex flex-row items-center justify-between gap-0">
          <button 
            onClick={() => onAddEvent?.()}
            className="rounded-lg bg-orange h-10 flex flex-row items-center justify-start py-2 px-4 box-border text-white font-bold gap-2 hover:bg-orange/90 transition-colors"
          >
            <span className="leading-6 whitespace-pre-wrap">
              {isRTL ? "إضافة موعد جديد" : "Add New Appointment"}
            </span>
            <Plus className="w-6 h-5" />
          </button>
          <div className="h-7 flex flex-row items-center justify-start text-right text-lg text-darkslategray-200">
            <h1 className="leading-7 whitespace-pre-wrap font-bold">
              {isRTL ? "التقويم الاسبوعي" : "Weekly Calendar"}
            </h1>
          </div>
        </div>
      </div> */}

      {/* Calendar Container */}
      <div className="w-full rounded-2xl flex flex-col items-start justify-start text-right text-sm text-darkslategray-200">
        <div className="w-full shadow-md rounded-2xl bg-white overflow-hidden shrink-0 flex flex-col items-start justify-start">
          {/* Calendar Header with Navigation */}
          <div className="w-full border-gainsboro border-solid border-b-[1px] box-border h-[85px] flex flex-row items-center justify-between pt-6 px-6 pb-[25px] gap-0">
            <div className="flex flex-row items-start justify-between w-full">
              <div className="h-7 flex flex-row items-center justify-start text-xl">
                <h2 className="leading-7 whitespace-pre-wrap font-bold">
                  {isRTL ? "موعيد الاسبوعية" : "Weekly Schedule"}
                </h2>
              </div>
              <div className="flex flex-row items-center gap-4">
                <button
                  onClick={() => navigateWeek("prev")}
                  className="w-11 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <NextIcon className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex flex-row items-center justify-center">
                  <span className="font-bold leading-5 min-w-max">
                    {formatWeekRange(currentWeekStart, locale)}
                  </span>
                </div>
                <button
                  onClick={() => navigateWeek("next")}
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <PrevIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="w-full h-[544px] overflow-hidden shrink-0 flex flex-col items-start justify-start p-4 box-border text-xs text-darkslategray-100">
            <div className="w-full h-[512px] flex flex-row items-start justify-start flex-wrap content-start gap-0">
              {/* Days Header Row */}
              <div className="w-full h-8 flex flex-row justify-start border-b border-gainsboro">
                {/* Empty cell for time column */}
                <div className="w-[60px] h-8 flex flex-col items-start justify-start">
                  <div className="w-full border-gainsboro border-solid border-b-[1px] box-border h-8" />
                </div>

                {/* Day headers - rendered right to left for RTL */}
                {dayNames.map((day, index) => (
                  <div
                    key={index}
                    className="flex-1 border-gainsboro border-solid border-b-[1px] box-border h-8 flex flex-row items-center justify-center text-sm font-medium"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Time Rows */}
              {timeSlots.map((timeSlot, timeIndex) => (
                <div
                  key={timeSlot}
                  className="w-full h-20 flex flex-row justify-start"
                >
                  {/* Time Column */}
                  <div className="w-[60px] bg-neutral-light border-gainsboro border-solid border-b-[1px] box-border h-20 flex flex-row items-center justify-center text-primary font-bold">
                    {timeSlot}
                  </div>

                  {/* Day Columns */}
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const daySessions = getEventsByDayAndTime(
                      dayIndex,
                      timeIndex
                    );
                    return (
                      <div
                        key={dayIndex}
                        className="flex-1 border-gainsboro border-solid border-r-[1px] border-b-[1px] box-border h-20 flex flex-row items-start justify-start pt-0 pb-[1px] pl-0 pr-[1px] relative"
                      >
                        {daySessions.map((event) => (
                          <div
                            key={event.id}
                            className={`absolute inset-1 rounded-lg ${getEventColor(
                              event.type
                            )} h-[70px] overflow-hidden shrink-0 flex flex-col items-center justify-center py-1 px-2 box-border text-white`}
                          >
                            <div className="w-full rounded overflow-hidden shrink-0 flex flex-col items-start justify-start py-1 px-2 box-border gap-0.5">
                              <div className="h-[18px] flex flex-row items-center justify-start">
                                <span className="leading-[18px] font-medium text-xs">
                                  {event.title}
                                </span>
                              </div>
                              <div className="h-4 flex flex-row items-center justify-start">
                                <span className="leading-4 text-xs">
                                  {event.endTime} - {event.startTime}
                                </span>
                              </div>
                              <div className="h-4 flex flex-row items-center justify-start">
                                <span className="leading-4 text-xs">
                                  {isRTL ? "المتدرب: " : "Client: "}
                                  {event.client}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Footer with Legend */}
          <div className="w-full bg-neutral-light border-neutral-light border-solid border-t-[1px] box-border h-[53px] flex flex-row items-center justify-between pt-[17px] px-4 pb-4 gap-0 text-center">
            
            <div className="flex flex-row items-center justify-start text-right text-xs gap-4">
              {legendItems.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-start gap-2"
                >
                  <span className="leading-4">{item.label}</span>
                  <div className={`w-3 rounded-full ${item.color} h-3`} />
                </div>
              ))}
            </div>
            <div className="h-5 flex flex-row items-center justify-center">
              <span className="leading-5 font-bold text-sm">
                {isRTL ? "عرض الجدول الكامل" : "View Full Schedule"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
