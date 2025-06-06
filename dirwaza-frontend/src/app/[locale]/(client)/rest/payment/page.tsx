"use client";

import React, { useState } from "react";
import Input from "@/components/ui/Input";
import PaymentMethodCard from "@/components/payment/PaymentMethodCard";
import CreditCardForm from "@/components/payment/CreditCardForm";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const PaymentPage = () => {
  const router = useRouter();
  const t = useTranslations("PaymentPage");
  const [selectedAmount, setSelectedAmount] = useState<"full" | "partial">(
    "full"
  );
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cardDetails: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardDetailsChange = (values: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails,
        ...values,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Payment data:", {
      ...formData,
      paymentAmount: selectedAmount,
    });
    router.push("/rest/payment/result");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">{t("title")}</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white rounded-2xl p-4 shadow"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("userInfo.title")}</h2>
          <Input
            name="fullName"
            label={t("userInfo.fullName")}
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
          <Input
            name="email"
            type="email"
            label={t("userInfo.email")}
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Input
            name="phone"
            type="tel"
            label={t("userInfo.phone")}
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("paymentAmount.title")}</h2>

          <div className="grid grid-cols-2 gap-4">
            <PaymentMethodCard
              label={t("paymentAmount.fullAmount")}
              selected={selectedAmount === "full"}
              onClick={() => setSelectedAmount("full")}
            />
            <PaymentMethodCard
              label={t("paymentAmount.partialAmount")}
              selected={selectedAmount === "partial"}
              onClick={() => setSelectedAmount("partial")}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("paymentMethod.title")}</h2>

          <CreditCardForm onChange={handleCardDetailsChange} />
          <PaymentMethodCard
            icon={"/icons/apple-pay.svg"}
            label={t("paymentMethod.applePay")}
            onClick={() => setSelectedAmount("partial")}
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{t("summary.totalAmount")}:</span>
            <span className="font-bold text-lg">
              {selectedAmount === "full" ? "1,299" : "649.50"} {t("summary.currency")}
            </span>
          </div>
          <Button variant="primary" size="lg" type="submit" className="w-full">
            {t("summary.completePayment")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentPage;
