"use client"
import { Check } from "lucide-react";

import { useTranslations } from "next-intl";
import DownloadReceipt from "@/components/training/DownloadReceipt";
import { useEffect, useRef, useState } from "react";
import { ReceiptTraining } from "@/lib/api/paymentActions";
import { generateReceiptPDF } from "@/utils/pdfUtils";


export default function TrainingBookingReceiptPage() {
  const t = useTranslations("TrainingBookingPage.result");
  const [bookingData, setBookingData] = useState<ReceiptTraining | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const result = localStorage?.getItem("result-training-booking");

    if (result) {
      const bookingData = JSON.parse(result);
      console.log("bookingData", bookingData);
      // Map the booking data to PaymentDetails format

      setBookingData(bookingData  );
      console.warn("Mapped paymentDetails", bookingData);
      
    }
  }, []);
  const handleDownloadReceipt = async () => {
    if (!ref.current || isDownloading) return;

      const currentBookingData =  bookingData ?? null;

    await generateReceiptPDF(
      ref,
      currentBookingData?.time || "",
      () => setIsDownloading(true),
      () => setIsDownloading(false),
      () => setIsDownloading(false)
    );
  };



  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div ref={ref} className="w-full h-full  pdf-compatible">
          {/* Success Header */}
          <div className="bg-neutral-light py-16 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-2 text-center">
              {t("successTitle")}
            </h1>
            <p className="text-gray-600 text-sm text-center">
              {t("subMessage")}
            </p>
          </div>
          <div className="p-8 space-y-8">
            {/* Registration Summary */}
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-6 text-center">
                {t("registrationSummary")}
              </h2>

              <div className="space-y-6">
                <DetailRow
                  label={t("trainerName")}
                  value={bookingData?.trainerName || ""}
                />
                <DetailRow
                  label={t("sessionType")}
                  value={bookingData?.sessionType || ""}
                />
                <DetailRow label={t("time")} value={bookingData?.time || ""} />
                <DetailRow
                  label={t("sessionDate")}
                  value={bookingData?.sessionDate || ""}
                />
              </div>
            </div>

            {/* Price Section */}
            <div className="flex justify-between  pt-6 border-t border-gray-200 ">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                  {t("totalSales")}
                </h3>
                <p className="text-gray-600 text-sm text-center mb-6">
                  {t("orderSent")}
                </p>
              </div>
              <div className="text-xl font-bold text-green-800">
                {bookingData?.price || "0" } {t("currency")}
              </div>
            </div>
          </div>
          </div>
          <DownloadReceipt
            bookingId="TRAIN-001"
            onDownload={handleDownloadReceipt}
          />
          <div className="bg-neutral-light p-4 ">
            <p className="text-gray-700 text-center ">{t("contactQuestion")}</p>
          </div>
          <div className="text-center pb-6">
            <p className="text-primary font-medium">{t("contactEmail")}</p>
          </div>
          {/* Download Receipt Button */}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm text-gray-700">
      <div className="flex items-center gap-2">
        <span>{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
}
