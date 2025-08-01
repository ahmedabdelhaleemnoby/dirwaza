"use client";
import { useTranslations } from "next-intl";
import { getLocalDateString } from "@/utils/getLocalDateString";

interface BookingSummaryProps {
  selectedDates: string[];
  isMultipleMode: boolean;
  calculateTotal: () => number;
  basePrice: number;
  withBreakfast?: boolean;
  breakfastPrice?: number;
  getDayPrice: (date: Date) => number;
  isWeekend: (date: Date) => boolean;
}

export default function BookingSummary({
  selectedDates,
  isMultipleMode,
  calculateTotal,
  basePrice,
  withBreakfast = false,
  breakfastPrice = 0,
  getDayPrice,
  isWeekend,
}: BookingSummaryProps) {
  const t = useTranslations("RestPage");

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate number of weekdays and weekend days
  // const { weekdayCount } = selectedDates.reduce(
  //   (acc, dateStr) => {
  //     const date = new Date(dateStr);
  //     if (isWeekend(date)) {
  //       acc.weekendCount++;
  //     } else {
  //       acc.weekdayCount++;
  //     }
  //     return acc;
  //   },
  //   { weekdayCount: 0, weekendCount: 0 }
  // );

  // Calculate total discount
  // const weekdayDiscount = (basePrice * 0.1) * weekdayCount; // 10% discount per weekday

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold text-right mb-6">
        {t("bookingSummary")}
      </h2>
      <div className="space-y-4">
        {selectedDates.length > 0 ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {isMultipleMode ? t("numberOfDays") : t("selectedDate")}
              </span>
              <span className="font-medium">
                {isMultipleMode
                  ? `${selectedDates.length} ${
                      selectedDates.length === 1 ? t("day") : t("daysPlural")
                    }`
                  : formatDate(selectedDates[0])}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("bookingType")}</span>
              <span>{t("withBreakfast")}</span>
            </div>
            
            {/* {weekdayCount > 0 && (
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-gray-600">{t("weeklyDiscount")}</span>
                  <div className="text-xs text-gray-500">
                    ({weekdayCount} {t("weekdayDiscountDays")})
                  </div>
                </div>
                <span className="text-green-600">
                  - {weekdayDiscount} {t("currency")}
                </span>
              </div>
            )} */}

            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("basePrice")}</span>
              <div className="text-right">
                <div>
                  {basePrice} {t("currency")}
                </div>
                {withBreakfast && (
                  <div className="text-sm text-gray-500">
                    {breakfastPrice} {t("currency")}
                  </div>
                )}
              </div>
            </div>
            {/* {selectedDates.length > 1 && (
              <>
                <div className="flex justify-between items-center text-gray-600">
                  <span>{t('from')}</span>
                  <span>{formatDate(selectedDates[0])}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                  <span>{t('to')}</span>
                  <span>{formatDate(selectedDates[selectedDates.length - 1])}</span>
                </div>
              </>
            )} */}

            {/* Display all selected dates */}
            <div className="mt-4 space-y-2">
              <h3 className="font-medium text-gray-700">
                {t("selectedDates")}:
              </h3>
              {selectedDates.map((dateStr) => {
                const date = new Date(dateStr);
                
                const price = getDayPrice(date);
                const isDateWeekend = isWeekend(date);
                
                return (
                  <div key={dateStr} className="flex justify-between">
                    <span className="text-xs">
                      {getLocalDateString(date)}
                      {isDateWeekend && (
                        <span className="text-orange-600 mr-1">
                          {t('weekendLabel')}
                        </span>
                      )}
                    </span>
                    <span className="text-xs">
                      {price} {t('currency')}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center font-bold">
                <span>{t("total")}</span>
                <span className="text-green-600">
                  {calculateTotal()} {t("currency")}
                </span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">
            {isMultipleMode ? t("selectDatesPlease") : t("selectDatePlease")}
          </p>
        )}
      </div>
    </div>
  );
}
