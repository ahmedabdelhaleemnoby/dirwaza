"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { AvailableDates } from "@/types/training";
import { getLocalDateString } from "@/utils/getLocalDateString";

interface DateTimeSelectionStepProps {
  availableDates: AvailableDates;
  selectedDates: string[];
  selectedTimes: Record<string, string[]>;
  onUpdate: (data: {
    selectedDates?: string[];
    selectedTimes?: Record<string, string[]>;
  }) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const DateTimeSelectionStep: React.FC<DateTimeSelectionStepProps> = ({
  availableDates,
  selectedDates,
  selectedTimes,
  onUpdate,
  onPrevious,
  onNext,
}) => {
  const t = useTranslations("TrainingBookingPage.dateTimeSelection");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 5 || day === 6; // Friday and Saturday in Arabic calendar
  };

  const isDateDisabled = (date: Date) => {
    const dateString = getLocalDateString(date);
    return (
      availableDates.disabledDates.includes(dateString) || date < new Date()
    );
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    const dateString = getLocalDateString(date);
    const newSelectedDates = selectedDates.includes(dateString)
      ? selectedDates.filter((d) => d !== dateString)
      : [...selectedDates, dateString];

    // Remove times for unselected dates
    const newSelectedTimes = { ...selectedTimes };
    if (!newSelectedDates.includes(dateString)) {
      delete newSelectedTimes[dateString];
    }

    onUpdate({
      selectedDates: newSelectedDates,
      selectedTimes: newSelectedTimes,
    });
  };

  const handleTimeClick = (date: string, time: string) => {
    const currentTimes = selectedTimes[date] || [];
    const newTimes = currentTimes.includes(time)
      ? currentTimes.filter((t) => t !== time)
      : [...currentTimes, time];

    onUpdate({
      selectedTimes: {
        ...selectedTimes,
        [date]: newTimes,
      },
    });
  };

  const getAvailableTimesForDate = (date: string) => {
    const dateObj = new Date(date);
    return isWeekend(dateObj)
      ? availableDates.timeSlots.weekends
      : availableDates.timeSlots.weekdays;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const dateString = getLocalDateString(date);
      const isSelected = selectedDates.includes(dateString);
      const isDisabled = isDateDisabled(date);
      const isToday = dateString === getLocalDateString(new Date());

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(date)}
          disabled={isDisabled}
          className={`
            h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200 border
            ${
              isSelected
                ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                : isToday
                ? "bg-gray-100 border-gray-300 text-gray-900"
                : isDisabled
                ? "text-gray-300 cursor-not-allowed border-gray-100"
                : "text-gray-700 hover:bg-gray-50 border-gray-200"
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const monthNames = [
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

  const weekDays = [
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const canSubmit = () => {
    return (
      selectedDates.length > 0 &&
      selectedDates.every((date) => selectedTimes[date]?.length > 0)  
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-4 max-w-md mx-auto">
        <div className="">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("title")}</h2>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Calendar Section */}
        <div className="p-6">
          <h3 className=" text-base font-medium text-gray-900 mb-4">
            {t("dateLabel")}{" "}
          </h3>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePreviousMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <h4 className="text-sm font-medium text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="h-8 flex items-center  justify-center text-xs text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 mb-6">{renderCalendar()}</div>

          {/* Time Selection */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-center text-base font-medium text-gray-900 mb-4">
              {t("timeLabel")}{" "}
            </h3>

            <div className="space-y-6">
              {selectedDates.map((date) => (
                <div
                  key={date}
                  className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <h4 className="font-medium text-gray-900 mb-3">
                    {getLocalDateString(new Date(date))}  {new Date(date + "T00:00:00").toLocaleDateString("ar-SA", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {getAvailableTimesForDate(date).map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeClick(date, time)}
                        className={`
                          px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                          ${
                            selectedTimes[date]?.includes(time)
                              ? "bg-primary text-white shadow-md"
                              : "bg-gray-50 text-gray-700 hover:bg-primary-light hover:text-primary border border-gray-200"
                          }
                        `}
                      >
                        {time} {t("evening")}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms Agreement */}
         
        </div>
      </div>
      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious} className="min-w-32">
          {t("previous")}
        </Button>

        <Button onClick={onNext} disabled={!canSubmit()} className="min-w-32">
          {t("next")}
        </Button>
      </div>
    </div>
  );
};

export default DateTimeSelectionStep;
