import React from 'react';
import { useTranslations } from "next-intl";

interface PaymentDetailItemProps {
  label: string;
  value: string;
}

const PaymentDetailItem = ({ label, value }: PaymentDetailItemProps) => (
  <div className="flex justify-between py-2">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

interface PaymentDetailsProps {
  orderNumber: string;
  propertyType: string;
  propertyLocation: string;
  deliveryDate: string;
  completionDate: string;
  totalAmount: string;
}

const PaymentDetails = ({
  orderNumber,
  propertyType,
  propertyLocation,
  deliveryDate,
  completionDate,
  totalAmount,
}: PaymentDetailsProps) => {
  const t = useTranslations("PaymentPage.result");

  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-4">{t("bookingSummary")}</h3>
      <PaymentDetailItem label={t("bookingNumber")} value={orderNumber} />
      <PaymentDetailItem label={t("propertyType")} value={propertyType} />
      <PaymentDetailItem label={t("bookingType")} value={propertyLocation} />
      <PaymentDetailItem label={t("deliveryDate")} value={deliveryDate} />
      <PaymentDetailItem label={t("completionDate")} value={completionDate} />
      <div className="border-t mt-4 pt-4">
        <PaymentDetailItem label={t("totalAmount")} value={totalAmount} />
      </div>
    </div>
  );
};

export default PaymentDetails; 