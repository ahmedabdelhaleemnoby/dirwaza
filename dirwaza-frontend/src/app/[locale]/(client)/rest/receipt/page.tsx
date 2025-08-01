"use client";

import React, { useEffect, useRef, useState } from "react";
import PaymentStatus from "@/components/payment/PaymentStatus";
import PaymentDetails from "@/components/payment/PaymentDetails";
import BackButton from "@/components/ui/BackButton";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import toast from "react-hot-toast";

// Loading component for the booking details

// Main content component that handles the booking data
function PaymentResultContent({
  translations
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
  const [bookingData, setBookingData] = useState<any>(null);
  const paymentDetails = {
    propertyType: "Tiny house",
    propertyLocation: "مع مبيت",
    namePerson: "محمد عبد الله",
    deliveryDate: "٢٥ مايو ٢٠٢٥",
    completionDate: "٢١ مايو ٢٠٢٥",
    totalAmount: "٥٠٠ ريال قطري",
    amountDetails: "تم الدفع بكامل",
    orderNumber:  "56796576",
  };

  useEffect(() => {
    const result = localStorage?.getItem("result-rest-booking");

    if (result) {
      const bookingData = JSON.parse(result);
      setBookingData(bookingData);
      console.warn("bookingData", bookingData);
    }
  }, []);
  // const handleDownloadReceipt = async () => {
  //   if (!ref.current || isDownloading) return;

  //   setIsDownloading(true);

  //   try {
  //     // Create canvas from the receipt div
  //     const canvas = await html2canvas(ref.current, {
  //       scale: 2,
  //       useCORS: true,
  //       allowTaint: true,
  //       backgroundColor: '#ffffff',
  //       logging: false,
  //       width: ref.current.offsetWidth,
  //       height: ref.current.offsetHeight
  //     });

  //     // Create PDF
  //     const pdf = new jsPDF('p', 'pt', 'a4');
  //     const imgWidth = 595.28; // A4 width in points
  //     const pageHeight = 841.89; // A4 height in points
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     let heightLeft = imgHeight;

  //     let position = 0;

  //     // Add first page
  //     pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;

  //     // Add additional pages if needed
  //     while (heightLeft >= 0) {
  //       position = heightLeft - imgHeight;
  //       pdf.addPage();
  //       pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
  //     }

  //     // Download the PDF
  //     const fileName = `receipt-${paymentDetails.orderNumber}-${Date.now()}.pdf`;
  //     pdf.save(fileName);

  //     toast.success("تم تحميل الإيصال بنجاح");
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //     toast.error( "فشل في تحميل الإيصال");
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };



  return (
    <div className="container mx-auto max-w-lg px-4 py-8 space-y-4" >
      <BackButton label={t("returnToHome")} />
      <div className="space-y-6 bg-white rounded-xl shadow-sm" ref={ref}>
        <PaymentStatus
          message={t("success")}
          subMessage={t("subMessage")}
        />
        <div className="p-6">
          <PaymentDetails {...paymentDetails} />
        </div>
        <div className="p-6 bg-neutral flex flex-col gap-4 justify-center items-center">
          <Button
            // onClick={handleDownloadReceipt}
            variant="ghost"
            size="md"
            disabled={isDownloading}
            className={`mx-auto !text-accent-dark hover:text-accent-dark/80 text-center hover:!bg-transparent border-none ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
  
  return (
      <PaymentResultContent translations={t} />
  );
}