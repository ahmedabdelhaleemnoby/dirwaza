"use client";

import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";

interface DownloadReceiptProps {
  onDownload?: () => void;
  className?: string;
  bookingId?: string;
}

export default function DownloadReceipt({ 
  onDownload=()=>{}, 
  className = "", 
  bookingId 
}: DownloadReceiptProps) {
  const t = useTranslations("TrainingBookingPage.result");

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default download logic - you can implement PDF generation here
      console.log("Downloading receipt for booking:", bookingId);
      // Example: generatePDF(bookingId) or downloadReceiptPDF(bookingId)
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      variant="ghost" 
      className={`bg-neutral p-4 w-full rounded-none text-accent-dark ${className}`}
    >
      {t("downloadReceipt")}
    </Button>
  );
}
