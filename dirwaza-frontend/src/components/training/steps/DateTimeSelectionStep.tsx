"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { AvailableDates } from "@/types/training";
import { getLocalDateString } from "@/utils/getLocalDateString";

interface DateTimeSelectionStepProps {
  availableDates: AvailableDates;
  selectedDates: string[];
  selectedTimes: Record<string, string[]>;
  selectedCourse: { sessions: number } | null;
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
  selectedCourse,
  onUpdate,
  onPrevious,
  onNext,
}) => {
  const t = useTranslations("TrainingBookingPage.dateTimeSelection");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [autoApplyTime, setAutoApplyTime] = useState(false);
  const [selectedAutoTime, setSelectedAutoTime] = useState<string>("");
  const [autoSelectDays, setAutoSelectDays] = useState(false);

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
    const isPastDate = date < new Date();
    const isInDisabledList = availableDates.disabledDates.includes(dateString);
    
    // Check if we've reached the maximum number of sessions
    const maxSessions = selectedCourse?.sessions || 1;
    const canSelectMore = selectedDates.length < maxSessions;
    const isAlreadySelected = selectedDates.includes(dateString);
    
    return isPastDate || isInDisabledList || (!canSelectMore && !isAlreadySelected);
  };

  const getConsecutiveDates = (startDate: Date, count: number): string[] => {
    const dates: string[] = [];
    const currentDate = new Date(startDate);
    let addedCount = 0;

    while (addedCount < count) {
      const dateString = getLocalDateString(currentDate);
      
      // Check if this date is available (not disabled and not in the past)
      const isPastDate = currentDate < new Date();
      const isInDisabledList = availableDates.disabledDates.includes(dateString);
      
      if (!isPastDate && !isInDisabledList) {
        dates.push(dateString);
        addedCount++;
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
      
      // Prevent infinite loop - if we've checked too many days ahead
      if (dates.length === 0 && currentDate.getTime() - startDate.getTime() > 90 * 24 * 60 * 60 * 1000) {
        break;
      }
    }

    return dates;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    const dateString = getLocalDateString(date);
    
    if (autoSelectDays) {
      // Auto-select consecutive days
      const requiredSessions = selectedCourse?.sessions || 1;
      const consecutiveDates = getConsecutiveDates(date, requiredSessions);
      
      const newSelectedTimes = { ...selectedTimes };
      
      // If auto-apply time is enabled, apply the selected time to all new dates
      if (autoApplyTime && selectedAutoTime) {
        consecutiveDates.forEach(dateStr => {
          newSelectedTimes[dateStr] = [selectedAutoTime];
        });
      }
      
      onUpdate({
        selectedDates: consecutiveDates,
        selectedTimes: newSelectedTimes,
      });
    } else {
      // Manual selection (original behavior)
      const newSelectedDates = selectedDates.includes(dateString)
        ? selectedDates.filter((d) => d !== dateString)
        : [...selectedDates, dateString];

      // Remove times for unselected dates
      const newSelectedTimes = { ...selectedTimes };
      if (!newSelectedDates.includes(dateString)) {
        delete newSelectedTimes[dateString];
      } else if (autoApplyTime && selectedAutoTime) {
        // Auto-apply the selected time to the new date
        newSelectedTimes[dateString] = [selectedAutoTime];
      }

      onUpdate({
        selectedDates: newSelectedDates,
        selectedTimes: newSelectedTimes,
      });
    }
  };

  const handleTimeClick = (date: string, time: string) => {
    // Allow only one time selection per date
    const newSelectedTimes = {
      ...selectedTimes,
      [date]: [time], // Always replace with single time selection
    };

    onUpdate({
      selectedTimes: newSelectedTimes,
    });
  };

  const handleAutoApplyToggle = (enabled: boolean) => {
    setAutoApplyTime(enabled);
    if (!enabled) {
      setSelectedAutoTime("");
    }
  };

  const handleAutoSelectDaysToggle = (enabled: boolean) => {
    setAutoSelectDays(enabled);
    if (!enabled) {
      // Reset to manual selection mode
      onUpdate({
        selectedDates: [],
        selectedTimes: {},
      });
    }
  };

  const handleAutoTimeSelect = (time: string) => {
    setSelectedAutoTime(time);
    
    if (autoApplyTime) {
      // Apply this time to all selected dates that don't have a time yet
      const newSelectedTimes = { ...selectedTimes };
      selectedDates.forEach(date => {
        if (!selectedTimes[date] || selectedTimes[date].length === 0) {
          newSelectedTimes[date] = [time];
        }
      });
      
      onUpdate({
        selectedTimes: newSelectedTimes,
      });
    }
  };

  const applyTimeToAllDates = () => {
    if (!selectedAutoTime) return;
    
    const newSelectedTimes = { ...selectedTimes };
    selectedDates.forEach(date => {
      newSelectedTimes[date] = [selectedAutoTime];
    });
    
    onUpdate({
      selectedTimes: newSelectedTimes,
    });
  };

  const getAvailableTimesForDate = (date: string) => {
    const dateObj = new Date(date);
    return isWeekend(dateObj)
      ? availableDates.timeSlots.weekends
      : availableDates.timeSlots.weekdays;
  };

  // Get common available times for all selected dates
  const getCommonAvailableTimes = () => {
    if (selectedDates.length === 0) return [];
    
    let commonTimes = getAvailableTimesForDate(selectedDates[0]);
    
    selectedDates.forEach(date => {
      const dateTimes = getAvailableTimesForDate(date);
      commonTimes = commonTimes.filter(time => dateTimes.includes(time));
    });
    
    return commonTimes;
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
    const requiredSessions = selectedCourse?.sessions || 1;
    return (
      selectedDates.length === requiredSessions &&
      selectedDates.every((date) => selectedTimes[date]?.length === 1) // Exactly one time per date
    );
  };

  const getSessionsInfo = () => {
    const requiredSessions = selectedCourse?.sessions || 1;
    const selectedCount = selectedDates.length;
    
    if (selectedCount === 0) {
      return `يرجى اختيار ${requiredSessions} ${requiredSessions === 1 ? 'يوم' : 'أيام'} للتدريب`;
    } else if (selectedCount < requiredSessions) {
      return `تم اختيار ${selectedCount} من ${requiredSessions} ${requiredSessions === 1 ? 'يوم' : 'أيام'} مطلوبة`;
    } else if (selectedCount === requiredSessions) {
      return `تم اختيار جميع الأيام المطلوبة (${requiredSessions} ${requiredSessions === 1 ? 'يوم' : 'أيام'})`;
    }
    return '';
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg p-4 max-w-md mx-auto">
        <div className="">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("title")}</h2>
          <p className="text-gray-600">{t("subtitle")}</p>
          
          {/* Sessions Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              {getSessionsInfo()}
            </p>
          </div>

          {/* Auto Select Days Toggle */}
          {(selectedCourse?.sessions || 1) > 1 && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <ToggleSwitch
                id="auto-select-days"
                checked={autoSelectDays}
                onChange={handleAutoSelectDaysToggle}
                label="اختيار الأيام المتتالية تلقائياً"
                description={`اختر يوماً واحداً وسيتم اختيار ${selectedCourse?.sessions || 1} أيام متتالية تلقائياً`}
                color="primary"
              />
            </div>
          )}
        </div>

        {/* Calendar Section */}
        <div className="p-6">
          <h3 className=" text-base font-medium text-gray-900 mb-4">
            {t("dateLabel")} {autoSelectDays && "(اختر اليوم الأول)"}
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

          {/* Auto Apply Time Toggle */}
          {selectedDates.length > 1 && (
            <div className="border-t border-gray-200 pt-6 mb-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <ToggleSwitch
                  id="auto-apply-time"
                  checked={autoApplyTime}
                  onChange={handleAutoApplyToggle}
                  label="تطبيق وقت واحد على جميع الأيام"
                  description="اختر وقتاً واحداً ليتم تطبيقه تلقائياً على جميع الأيام المختارة"
                  color="success"
                />
                
                {autoApplyTime && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      اختر الوقت للتطبيق على جميع الأيام:
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {getCommonAvailableTimes().map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => handleAutoTimeSelect(time)}
                          className={`
                            px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${
                              selectedAutoTime === time
                                ? "bg-green-500 text-white shadow-md"
                                : "bg-white text-gray-700 hover:bg-green-50 border border-green-200"
                            }
                          `}
                        >
                          {time} مساءً
                        </button>
                      ))}
                    </div>
                    
                    {selectedAutoTime && (
                      <button
                        type="button"
                        onClick={applyTimeToAllDates}
                        className="mt-3 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        تطبيق الوقت {selectedAutoTime} على جميع الأيام
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Time Selection */}
          {selectedDates.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-center text-base font-medium text-gray-900 mb-4">
                {t("timeLabel")} {!autoApplyTime && "(وقت واحد لكل يوم)"}
              </h3>

              <div className="space-y-6">
                {selectedDates.map((date) => (
                  <div
                    key={date}
                    className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                  >
                    <h4 className="font-medium text-gray-900 mb-3">
                      {new Date(date + "T00:00:00").toLocaleDateString("ar-SA", {
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
                          disabled={autoApplyTime}
                          className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${
                              selectedTimes[date]?.includes(time)
                                ? "bg-primary text-white shadow-md"
                                : autoApplyTime
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
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
          )}
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
