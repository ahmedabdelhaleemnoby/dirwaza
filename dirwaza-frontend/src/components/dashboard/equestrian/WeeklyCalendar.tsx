"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SessionCalendarTrainingBlock } from "@/types/training";
import { mockSessionCalendarTrainingBlock } from "@/mock/calendarData";

interface WeeklyCalendarProps {
  sessions?: SessionCalendarTrainingBlock[];
  loading?: boolean;
}

// Time slots from 8 AM to 12 PM
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

const formatWeekRange = (weekStart: Date): string => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const startMonth = weekStart.getMonth();
  const endMonth = weekEnd.getMonth();
  
  const months = [
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
  ];

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${months[startMonth]}`;
  } else {
    return `${startDay} ${months[startMonth]} - ${endDay} ${months[endMonth]}`;
  }
};

export default function WeeklyCalendar({
  sessions = mockSessionCalendarTrainingBlock,
  loading = false,
}: WeeklyCalendarProps) {
  const t = useTranslations("EquestrianSessions.calendar");
  const locale = useLocale();
  
  // Detect if we're in LTR mode
  const isRTL = locale === "en";

  // Initialize with current week (the week containing today)
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    return getWeekStart(new Date()); // Use current date instead of hardcoded date
  });

  const days = [
    t("days.sunday"),
    t("days.monday"),
    t("days.tuesday"),
    t("days.wednesday"),
    t("days.thursday"),
    t("days.friday"),
    t("days.saturday"),
  ];

  const getSessionColor = (type: string) => {
    switch (type) {
      case "daily":
        return "bg-secondary";
      case "group":
        return "bg-accent-dark";
      case "individual":
        return "bg-primary-light";
      case "advanced":
        return "bg-brand-red";
      default:
        return "bg-gray-200";
    }
  };

  // Filter sessions for current week
  const currentWeekSessions = sessions.filter((session) =>
    isDateInWeek(session.date, currentWeekStart)
  );

  const getSessionsByDayAndTime = (day: number, timeIndex: number) => {
    return currentWeekSessions.filter((session) => {
      const sessionHour = parseInt(session.startTime.split(":")[0]);
      const slotHour = parseInt(timeSlots[timeIndex].split(":")[0]);
      return session.day === day && sessionHour === slotHour;
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
  const PrevIcon = isRTL ? ChevronLeft : ChevronRight;
  const NextIcon = isRTL ? ChevronRight : ChevronLeft;

  const legendItems = [
    {
      color: "bg-secondary",
      label: t("legend.dailySession"),
    },
    {
      color: "bg-accent-dark",
      label: t("legend.eightSessions"),
    },
    {
      color: "bg-primary-light",
      label: t("legend.twelveSessions"),
    },
    {
      color: "bg-brand-red",
      label: t("legend.individualSessions"),
    },
  ];

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-darkslategray-200">
          {t("weeklySchedule")}
        </h3>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateWeek("prev")}
            className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <PrevIcon className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm font-medium text-darkslategray-100 min-w-max">
            {formatWeekRange(currentWeekStart)}
          </span>
          <button
            onClick={() => navigateWeek("next")}
            className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <NextIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <div className="grid grid-cols-8 min-h-[400px]">
          {/* Header Row */}
          <div className="border-b border-gray-200 bg-gray-50 p-3 text-center">
            <span className="text-sm font-medium text-darkslategray-200">
              {t("time")}
            </span>
          </div>
          {days.map((day, index) => (
            <div
              key={index}
              className="border-b border-gray-200 bg-gray-50 p-3 text-center border-r"
            >
              <span className="text-sm font-medium text-darkslategray-200">
                {day}
              </span>
            </div>
          ))}

          {/* Time Rows */}
          {timeSlots.map((timeSlot, timeIndex) => (
            <React.Fragment key={timeSlot}>
              {/* Time Column */}
              <div className="border-b border-gray-200 p-3 bg-gray-50 flex items-center justify-center">
                <span className="text-sm font-medium text-darkslategray-200">
                  {timeSlot}
                </span>
              </div>

              {/* Day Columns */}
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const daySessions = getSessionsByDayAndTime(
                  dayIndex,
                  timeIndex
                );
                return (
                  <div
                    key={dayIndex}
                    className="border-b border-r border-gray-200 p-1 h-20 relative"
                  >
                    {daySessions.map((session) => (
                      <div
                        key={session.id}
                        className={`absolute inset-1 rounded-lg ${getSessionColor(
                          session.type
                        )} p-2 flex flex-col justify-center`}
                      >
                        <div className="text-xs font-medium text-darkslategray-200 leading-tight">
                          <p className="mb-1">
                            <span className="text-black">{t("trainee")}:</span>
                          </p>
                          <p className="truncate">{session.trainee}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-xs text-darkslategray-200">
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <button className="text-sm font-bold text-darkslategray-200 hover:underline">
          {t("viewFullSchedule")}
        </button>
      </div>
    </div>
  );
}
