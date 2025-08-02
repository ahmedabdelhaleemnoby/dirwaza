"use client";

import React, { useEffect, useRef, useState } from "react";
import PaymentStatus from "@/components/payment/PaymentStatus";
import PaymentDetails from "@/components/payment/PaymentDetails";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { generateReceiptPDF } from "@/utils/pdfUtils";

// Loading component for the booking details

// Main content component that handles the booking data
function PaymentResultContent({
  translations,
}: {
  translations: (key: string) => string;
}) {
  const t = translations;
  const ref = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // const orderNumber = searchParams.orderNumber;
  // const paymentId = searchParams.paymentId;

  // if (!orderNumber && !paymentId) {
  //   redirect('/rest');
  // }

  // const bookingData = JSON.parse(result || "{}");
  const [bookingData, setBookingData] = useState<{
    propertyType: string;
    propertyLocation: string;
    namePerson: string;
    deliveryDate: string;
    completionDate: string;
    totalAmount: string;
    amountDetails: string;
    orderNumber: string;
  } | null>(null);
  // Fallback payment details (will be overridden by localStorage data)
  const fallbackPaymentDetails = {
    propertyType: "مع مبيت",
    propertyLocation: "استراحة",
    namePerson: "محمد عبد الله",
    deliveryDate: "٢٥ مايو ٢٠٢٥",
    completionDate: "٢١ مايو ٢٠٢٥",
    totalAmount: "٥٠٠ ريال سعودي",
    amountDetails: "تم الدفع بالكامل",
    orderNumber: "56796576",
  };

  useEffect(() => {
    const result = localStorage?.getItem("result-rest-booking");

    if (result) {
      const bookingData = JSON.parse(result);

      // Map the booking data to PaymentDetails format
      const mappedPaymentDetails = {
        propertyType:
          bookingData.experienceType === "overnight" ? "مع مبيت" : "بدون مبيت",
        propertyLocation:
          bookingData.bookingType === "rest"
            ? "استراحة"
            : bookingData.bookingType,
        namePerson: bookingData.userName || "غير محدد",
        deliveryDate:
          bookingData.checkInDates && bookingData.checkInDates[0]
            ? new Date(bookingData.checkInDates[0]).toLocaleDateString(
                "ar-EG",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )
            : "غير محدد",
        completionDate:
          bookingData.checkInDates && bookingData.checkInDates[1]
            ? new Date(bookingData.checkInDates[1]).toLocaleDateString(
                "ar-EG",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )
            : "غير محدد",
        totalAmount: `${bookingData.totalPrice || 0} ريال سعودي`,
        amountDetails:
          bookingData.paymentAmount === "full"
            ? "تم الدفع بالكامل"
            : "دفع جزئي",
        orderNumber:
          bookingData.paymentReference || bookingData._id || "غير محدد",
      };

      setBookingData(mappedPaymentDetails);
      console.warn("Mapped paymentDetails", mappedPaymentDetails);
    }
  }, []);
  const handleDownloadReceipt = async () => {
    if (!ref.current || isDownloading) return;

    const currentBookingData = bookingData ?? fallbackPaymentDetails;
    
    await generateReceiptPDF(
      ref,
      currentBookingData.orderNumber,
      () => setIsDownloading(true),  // onStart
      () => setIsDownloading(false), // onSuccess
      () => setIsDownloading(false)  // onError
    );
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-8 space-y-4">
      <BackButton label={t("returnToHome")} />
      <div className="space-y-6 bg-white rounded-xl shadow-sm">
        <div className="space-y-6 bg-white rounded-xl " ref={ref}>
          <PaymentStatus message={t("success")} subMessage={t("subMessage")} />
          <div className="p-6">
            <PaymentDetails {...(bookingData ?? fallbackPaymentDetails)} />
          </div>
        </div>
        <div className="p-6 bg-neutral flex flex-col gap-4 justify-center items-center ">
          <Button
            onClick={handleDownloadReceipt}
            variant="ghost"
            size="md"
            disabled={isDownloading}
            className={`mx-auto !text-accent-dark hover:text-accent-dark/80 text-center hover:!bg-transparent border-none ${
              isDownloading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isDownloading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                {t("downloading") || "جاري التحميل..."}
              </span>
            ) : (
              t("downloadReceipt") || "تحميل الإيصال"
            )}
          </Button>
          <div className="text-center text-sm text-gray-600">
            <p>{t("needHelp")}</p>
          </div>
        </div>
        <div className="text-center text-sm text-gray-600 pb-4">
          <a
            href="mailto:info@Dirwaza.com"
            className="text-primary hover:underline"
          >
            {t("contactEmail")}
          </a>
        </div>
      </div>
    </div>
  );
}

// Main page component
export default function PaymentResultPage() {
  const t = useTranslations("PaymentPage.result");

  return <PaymentResultContent translations={t} />;
}
