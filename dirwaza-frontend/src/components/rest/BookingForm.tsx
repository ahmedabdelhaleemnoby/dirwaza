"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import BookingModeToggle from "./booking/BookingModeToggle";
// import DateInputs from './booking/DateInputs';
import BookingCalendar from "./booking/BookingCalendar";
import BookingInfo from "./booking/BookingInfo";
import BookingSummary from "./booking/BookingSummary";
import { mockCalendarData } from "@/mock/calendarData";
import { CalendarData, transformCalendarApiResponse } from "@/types/rest";
import Button from "../ui/Button";
import { getLocalDateString } from "@/utils/getLocalDateString";

import { RestData } from "@/types/rest";
import { getCalendarByIdAction } from "@/lib/api/restActions";
import { useBooking } from "@/hooks/useBooking";
import { toast } from "react-hot-toast";

interface BookingFormProps {
  calendarData?: CalendarData;
  data?: RestData["availability"];
  calendarId?: string;
  restName?: string;
  restHref?: string;
}

export default function BookingForm({
  calendarData: initialCalendarData,
  data,
  calendarId,
  restName = "",
  restHref = "",
}: BookingFormProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [valToggle, setValToggle] = useState(true);
  const [calendarData, setCalendarData] = useState<CalendarData>(
    initialCalendarData || mockCalendarData
  );
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  const t = useTranslations("RestPage");
  const { saveBookingAndNavigateToPayment } = useBooking();

  // Fetch calendar data when calendarId is provided
  useEffect(() => {
    async function fetchCalendarData() {
      if (!calendarId || initialCalendarData) return;

      try {
        setCalendarLoading(true);
        setCalendarError(null);
        
        const result = await getCalendarByIdAction(calendarId);
        
        if (result.success && result.data) {
          const transformedData = transformCalendarApiResponse(result.data);
          setCalendarData(transformedData);
        } else {
          throw new Error(result.error || 'فشل في تحميل بيانات التقويم');
        }
      } catch (error) {
        console.error('Calendar fetch error:', error);
        setCalendarError(error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
        // Fallback to mock data on error
        setCalendarData(mockCalendarData);
      } finally {
        setCalendarLoading(false);
      }
    }

    fetchCalendarData();
  }, [calendarId, initialCalendarData]);

  const handleDateSelect = (date: Date) => {
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) return;

    const dateStr = getLocalDateString(date);

    if (valToggle) {
      setSelectedDates((prev) => {
        if (prev.includes(dateStr)) {
          return prev.filter((d) => d !== dateStr);
        } else {
          if (prev.length > 1) {
            return [...prev.slice(1), dateStr].sort();
          }
          return [...prev, dateStr].sort();
        }
      });
    } else {
      setSelectedDates([dateStr]);
    }
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
    if (!agreeToTerms) {
      toast.error( "يجب الموافقة على الشروط والأحكام");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // حفظ بيانات الحجز والانتقال للدفع
      const bookingData = {
        restId: calendarId || "",
        restName,
        restHref,
        selectedDates,
        isMultipleMode: valToggle,
        basePrice: calendarData.basePrice,
        weekendPrice: calendarData.weekendPrice,
        totalPrice: calculateTotal(),
        withBreakfast: false,
        breakfastPrice: 0,
        availability: data,
        agreeToTerms,
      };
      
      saveBookingAndNavigateToPayment(bookingData);
      toast.success(t("bookingSuccess"));
    } catch {
      toast.error(t("bookingError"));
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
      // Apply weekend or weekday pricing
      const isWeekend = date.getDay() === 5 || date.getDay() === 6;
      if (isWeekend) {
        return total + calendarData.weekendPrice;
      }
      return total + calendarData.basePrice;
    }, 0);
  };
  const defaultData = valToggle
    ? data?.overnight
    : data?.withoutOvernight || { checkIn: "", checkOut: "" };

  // Show loading state
  if (calendarLoading) {
    return (
      <div className="flex flex-col gap-4 pb-10">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">{t("loadingCalendar") || "جارٍ تحميل التقويم..."}</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (calendarError) {
    return (
      <div className="flex flex-col gap-4 pb-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{calendarError}</p>
          <p className="text-sm text-red-500 mt-2">سيتم استخدام بيانات افتراضية</p>
        </div>
      </div>
    );
  }

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

      <BookingInfo data={defaultData} valToggle={valToggle} />

      <BookingSummary
        selectedDates={selectedDates}
        isMultipleMode={true}
        calculateTotal={calculateTotal}
        basePrice={calendarData.basePrice}
        withBreakfast={false}
        getDayPrice={(date) => {
          const isWeekend = date.getDay() === 5 || date.getDay() === 6;
          return isWeekend ? calendarData.weekendPrice : calendarData.basePrice;
        }}
        isWeekend={(date) => date.getDay() === 5 || date.getDay() === 6}
        breakfastPrice={0}
      />

      {/* Booking button */}
      <label className="flex items-center gap-2 text-sm">
        <input 
          type="checkbox" 
          className="form-checkbox" 
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
        />
        <span>
          {t("agreeToTerms")
            .split(" ")
            .map((word, index) => {
              if (word === "شروط" || word === "Terms") {
                return (
                  <Link
                    key={index}
                    href="/terms"
                    className="text-green-600 hover:text-green-700 mx-1"
                  >
                    {t("termsLink")}
                  </Link>
                );
              }
              if (word === "سياسة" || word === "Privacy") {
                return (
                  <Link
                    key={index}
                    href="/privacy"
                    className="text-green-600 hover:text-green-700 mx-1"
                  >
                    {t("policyLink")}
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
