"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import BookingModeToggle from "./booking/BookingModeToggle";
// import DateInputs from './booking/DateInputs';
import BookingCalendar from "./booking/BookingCalendar";
import BookingInfo from "./booking/BookingInfo";
import BookingSummary from "./booking/BookingSummary";
import { mockCalendarData } from "@/mock/calendarData";
import { CalendarData } from "@/types/rest";
import Button from "../ui/Button";
import { getLocalDateString } from "@/utils/getLocalDateString";

interface BookingFormProps {
  calendarData?: CalendarData;
}

export default function BookingForm({
  calendarData = mockCalendarData,
}: BookingFormProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [valToggle, setValToggle] = useState(true);
  // const [checkInDate, setCheckInDate] = useState<string>('');
  // const [checkOutDate, setCheckOutDate] = useState<string>('');

  const t = useTranslations("RestPage");

  const handleDateSelect = (date: Date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return;

    const dateStr = getLocalDateString(date);

    // if (isMultipleMode) {
    setSelectedDates((prev) => {
      if (prev.includes(dateStr)) {
        return prev.filter((d) => d !== dateStr);
      } else {
        return [...prev, dateStr].sort();
      }
    });
    // } else {
    //   setSelectedDates([dateStr]);
    // }
  };

  // const handleCheckInChange = (date: string) => {
  //   setCheckInDate(date);
  //   if (date) {
  //     const selectedDate = new Date(date);
  //     handleDateSelect(selectedDate);
  //   }
  // };

  // const handleCheckOutChange = (date: string) => {
  //   setCheckOutDate(date);
  //   if (date && checkInDate) {
  //     // Select range of dates
  //     const startDate = new Date(checkInDate);
  //     const endDate = new Date(date);
  //     const dateRange = [];

  //     for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
  //       dateRange.push(new Date(d).toISOString().split('T')[0]);
  //     }
  //     setSelectedDates(dateRange);
  //   }
  // };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(t("bookingSuccess"));
    } catch {
      alert(t("bookingError"));
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const toggleMode = () => {
    setValToggle(!valToggle);
    setSelectedDates([]);
    // setCheckInDate('');
    // setCheckOutDate('');
  };

  // Calculate total price for selected dates
  const calculateTotal = () => {
    return selectedDates.reduce((total, dateStr) => {
      const date = new Date(dateStr);
      // Check for custom pricing
      const customPrice = calendarData.customPricing.find(
        (p) => p.date === dateStr
      );
      if (customPrice) {
        return total + customPrice.price;
      }
      // Apply weekend surcharge or weekday discount
      const isWeekend = date.getDay() === 5 || date.getDay() === 6;
      if (isWeekend) {
        return total + calendarData.basePrice + calendarData.weekendSurcharge;
      }
      return total + calendarData.basePrice - calendarData.weekdayDiscount;
    }, 0);
  };

  return (
    <div className="flex flex-col gap-4 pb-10">
      {/* Header with Mode Switch */}
      <div className="">
        <div className="flex items-center justify-between mb-4"></div>

      
      </div>
      <div className="flex  flex-col  gap-4 lg:gap-8  bg-neutral-dark w-full py-5 px-4 rounded-2xl">
        <h3 className="text-3xl font-bold">{t("selectDate")}</h3>
        <BookingModeToggle valToggle={valToggle} onToggle={toggleMode} />
        <p className="text-[#4B5563] text-xl">{t("weekdayDiscountMessage")}</p>
      </div>

      <div className="flex items-center gap-2 text-black">
        <h3 className="text-3xl font-bold">{t("selectDate")}</h3>
      </div>
      <BookingCalendar
        currentMonth={currentMonth}
        selectedDates={selectedDates}
        onDateSelect={handleDateSelect}
        onNavigateMonth={navigateMonth}
        calendarData={calendarData}
      />


      <BookingInfo />

      <BookingSummary
        selectedDates={selectedDates}
        isMultipleMode={true}
        calculateTotal={calculateTotal}
        basePrice={calendarData.basePrice}
        withBreakfast={false}
        getDayPrice={(date) => {
          const dateStr = getLocalDateString(date);
          const customPrice = calendarData.customPricing.find(
            (p) => p.date === dateStr
          );
          if (customPrice) return customPrice.price;
          const isWeekend = date.getDay() === 5 || date.getDay() === 6;
          return isWeekend
            ? calendarData.basePrice + calendarData.weekendSurcharge
            : calendarData.basePrice - calendarData.weekdayDiscount;
        }}
        isWeekend={(date) => date.getDay() === 5 || date.getDay() ===6 }
        breakfastPrice={0}
      />

     

      {/* Booking button */}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="form-checkbox" />
        <span>
          {t('agreeToTerms').split(' ').map((word, index) => {
            if (word === 'شروط' || word === 'Terms') {
              return (
                <Link
                  key={index}
                  href="/terms"
                  className="text-green-600 hover:text-green-700 mx-1"
                >
                  {t('termsLink')}
                </Link>
              );
            }
            if (word === 'سياسة' || word === 'Privacy') {
              return (
                <Link
                  key={index}
                  href="/privacy"
                  className="text-green-600 hover:text-green-700 mx-1"
                >
                  {t('policyLink')}
                </Link>
              );
            }
            return ` ${word} `;
          })}
        </span>
      </label>
      <Button 
        onClick={handleSubmit}
        disabled={loading || selectedDates.length === 0}
        variant="primary"
        size="lg"
        rounded={false}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
          loading || selectedDates.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : " hover:shadow-md active:transform active:scale-98"
        }`}
      >
        {loading ? t("bookingInProgress") : t("confirmBooking")}
      </Button>
    </div>
  );
}
