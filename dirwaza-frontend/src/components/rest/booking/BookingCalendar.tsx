"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { CalendarData } from "@/types/rest";
import { getLocalDateString } from "@/utils/getLocalDateString";

interface DisabledDateInfo {
  disabled: boolean;
  reason?: string;
  dayOff?: boolean;
  unavailable?: boolean;
  available?: boolean;
}

interface BookingCalendarProps {
  currentMonth: Date;
  selectedDates: string[];
  onDateSelect: (date: Date) => void;
  onNavigateMonth: (direction: "prev" | "next") => void;
  calendarData: CalendarData;
}

export default function BookingCalendar({
  currentMonth,
  selectedDates,
  onDateSelect,
  onNavigateMonth,
  calendarData,
}: BookingCalendarProps) {
  const t = useTranslations("RestPage");
  const locale = useLocale();
  const arabicMonths = t.raw("months") as string[];
  const arabicDays = t.raw("days") as string[];

  const getDayPrice = (date: Date): number => {
    const dateStr =  getLocalDateString(date);

    // Check for custom pricing
    const customPrice = calendarData.customPricing.find(
      (p) => p.date === dateStr
    );
    if (customPrice) {
      return customPrice.price;
    }

    // Apply weekend surcharge or weekday discount
    const isWeekend = date.getDay() === 5 || date.getDay() === 6;
    if (isWeekend) {
      return calendarData.basePrice + calendarData.weekendSurcharge;
    }
    return calendarData.basePrice - calendarData.weekdayDiscount;
  };

  const isDateDisabled = (date: Date): DisabledDateInfo => {
    const dateStr = getLocalDateString(date);

    // Check if date is in the past
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      return { disabled: true, reason: t("pastDate"), dayOff: true };
    }

    // Check custom pricing for disabled dates
    const customPrice = calendarData.customPricing.find(
      (p) => p.date === dateStr
    );
    if (customPrice?.isDisabled) {
      return {
        disabled: true,
        reason: customPrice.disabledReason,
        unavailable: true,
      };
    }
    if (customPrice?.available) {
      return {
        disabled: false,
        reason: customPrice.disabledReason,
        available: true,
        unavailable: false,
      };
    }

    // Check general disabled dates
    if (calendarData.disabledDates.includes(dateStr)) {
      return {
        disabled: true,
        reason: t("dateUnavailable"),
        unavailable: true,
      };
    }

    return { disabled: false };
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);

      const { disabled, reason, unavailable, dayOff, available } =
        isDateDisabled(date);
      days.push({
        day,
        date,
        price: getDayPrice(date),
        isDisabled: disabled,
        disabledReason: reason,
        isWeekend: date.getDay() === 5 || date.getDay() === 6,
        unavailable,
        dayOff,
        available,
      });
    }

    return days;
  };

  const days = getDaysInMonth();

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-lg max-w-sm my-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">
          {arabicMonths[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateMonth("prev")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="الشهر السابق"
          >
            <ChevronRight
              size={20}
              className={locale == "en" ? "rotate-180" : ""}
            />
          </button>
          <button
            onClick={() => onNavigateMonth("next")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="الشهر التالي"
          >
            <ChevronLeft
              size={20}
              className={locale == "en" ? "rotate-180" : ""}
            />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {arabicDays.map((day: string) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 p-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((dayData, index) => (
          <div key={index} className="aspect-square">
            {dayData ? (
              <button
                onClick={() => {
                  console.log(dayData.date);
                  return !dayData.isDisabled && onDateSelect(dayData.date);
                }}
                disabled={dayData.isDisabled}
                className={`w-full h-full flex flex-col items-center justify-center text-xs rounded-lg transition-all duration-200 ${
                  dayData.isDisabled
                    ? dayData?.unavailable && !dayData.dayOff
                      ? "text-gray-300 cursor-not-allowed bg-red-500"
                      : "text-gray-300 cursor-not-allowed"
                    : selectedDates.includes(
                      getLocalDateString(dayData.date) 
                      )
                    ? "bg-primary text-white shadow-md transform scale-95"
                    : dayData.available
                    ? "bg-accent-dark text-white"
                    : dayData.isWeekend
                    ? "bg-yellow-500 text-orange-800 hover:bg-orange-200"
                    : "hover:bg-gray-100 hover:shadow-sm"
                }`}
              >
                <span className="font-medium">{dayData.day}</span>
                {!dayData?.unavailable && !dayData.dayOff && (
                  <span
                    className={`text-xs ${
                      selectedDates.includes(
                        getLocalDateString(dayData.date)
                      )
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {dayData.price}
                  </span>
                )}
              </button>
            ) : (
              <div />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-accent-dark rounded-full"></span>
          <span className="text-sm">{t("calendar.available")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-red-500"></span>
          <span className="text-sm">{t("calendar.booked")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-yellow-500"></span>
          <span className="text-sm">{t("calendar.weekend")}</span>
        </div>
      </div>
    </div>
  );
}
