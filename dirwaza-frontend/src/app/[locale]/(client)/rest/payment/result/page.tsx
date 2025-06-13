import React from "react";
import PaymentStatus from "@/components/payment/PaymentStatus";
import PaymentDetails from "@/components/payment/PaymentDetails";
import Button from "@/components/ui/Button";
import BackButton from "@/components/ui/BackButton";
import { useTranslations } from "next-intl";

export default function PaymentResultPage() {
  const t = useTranslations("PaymentPage.result");

  // In a real application, these values would come from your API or state management
  const paymentDetails = {
    orderNumber: t("bookingNumber"),
    propertyType: "Tiny house",
    propertyLocation: t("bookingType"),
    deliveryDate: "٢٥ مايو ٢٠٢٥",
    completionDate: "٢١ مايو ٢٠٢٥",
    totalAmount: "٥٠٠ ريال قطري",
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-8 space-y-4 ">
      <BackButton label={t("returnToHome")} />
      <div className="space-y-6 bg-white rounded-xl shadow-sm">
        <PaymentStatus
          message={t("success")}
          subMessage={t("subMessage")}
        />
        <div className="p-6">
          <PaymentDetails {...paymentDetails} />
        </div>
        <div className=" p-6 bg-neutral flex flex-col gap-4 justify-center items-center ">
          <Button variant="primary" size="lg" className="w-full">
            {t("viewFullDetails")}
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="mx-auto !text-accent-dark hover:text-accent-dark/80 text-center hover:!bg-transparent border-none"
          >
            {t("downloadReceipt")}
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
