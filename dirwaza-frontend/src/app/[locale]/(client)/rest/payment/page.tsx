"use client";

import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import PaymentMethodCard from "@/components/payment/PaymentMethodCard";
import CreditCardForm from "@/components/payment/CreditCardForm";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/bookingStore";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { createRestBookingAction } from "@/lib/api/paymentActions";

const RestPaymentPage = () => {
  const router = useRouter();
  const t = useTranslations("PaymentPage");
  const { bookingData, isHydrated, clearBookingData } = useBookingStore();
  const [isLoading, setIsLoading] = useState(false);

  
  const [selectedAmount, setSelectedAmount] = useState<"full" | "partial">(
    "full"
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"card" | "applePay">("card");
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

  // التحقق من وجود بيانات الحجز بعد اكتمال الترطيب
  useEffect(() => {
    if (isHydrated && !bookingData) {
      // إعادة توجيه إلى الصفحة الرئيسية إذا لم توجد بيانات بعد اكتمال الترطيب
      toast.error("لا توجد بيانات حجز. سيتم إعادة توجيهك.");
      router.push("/rest");
    }
  }, [isHydrated, bookingData, router]);

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">جارٍ تحميل بيانات الدفع...</p>
        </div>
      </div>
    );
  }

  // Show loading state if booking data is still being loaded
  if (!bookingData) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">جارٍ التحقق من بيانات الحجز...</p>
        </div>
      </div>
    );
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const totalPaid = selectedAmount === "full" 
        ? bookingData.totalPrice 
        : Math.round(bookingData.totalPrice / 2);

      // Prepare order data in the exact format expected by the API
      const orderData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        cardDetails: {
          cardNumber: formData.cardDetails.cardNumber,
          expiryDate: formData.cardDetails.expiryDate,
          cvv: formData.cardDetails.cvv,
        },
        paymentAmount: selectedAmount,
        paymentMethod: selectedPaymentMethod,
        totalPrice: bookingData.totalPrice,
        totalPaid: totalPaid,
        overnight: bookingData.isMultipleMode || bookingData.selectedDates.length > 1,
        checkIn: bookingData.selectedDates,
        restId: bookingData.restId,
      };

      console.log("Sending REST booking data:", orderData);
      const result = await createRestBookingAction(orderData);
      console.warn("result rest booking", result,"booking:",result.data?.booking);
      if (result.success && result.data) {
        localStorage.setItem("result-rest-booking", JSON.stringify(result.data?.booking));
        toast.success(result.message || "تم إنشاء حجز الاستراحة بنجاح");
        router.push("/rest/receipt");
        setTimeout(() => {
          clearBookingData();
        }, 1000);
        // clearBookingData();
      } else {
        toast.error(result.message || "فشل في إنشاء حجز الاستراحة");
      }
    } catch (error) {
      console.error("REST booking submission error:", error);
      toast.error("حدث خطأ أثناء معالجة الحجز");
    } finally {
      setIsLoading(false);
    }
  };

  //   result: "success" | "failed" | "cancelled"
  // ) => {
  //   setPaymentModal({ isOpen: false, paymentUrl: "", paymentId: "" });

  //   if (result === "success") {
  //     // Clear booking data on successful payment
  //     clearBookingData();
  //     toast.success("تم الدفع بنجاح! تم تأكيد حجز الاستراحة.");
  //     router.push("/rest/receipt");
  //   } else if (result === "failed") {
  //     toast.error("فشل في عملية الدفع. يرجى المحاولة مرة أخرى.");
  //   } else {
  //     toast.error("تم إلغاء عملية الدفع.");
  //   }
  // };

  // const handlePaymentError = (error: string) => {
  //   toast.error(`خطأ في الدفع: ${error}`);
  //   setPaymentModal({ isOpen: false, paymentUrl: "", paymentId: "" });
  // };

  // const closePaymentModal = () => {
  //   setPaymentModal({ isOpen: false, paymentUrl: "", paymentId: "" });
  // };

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

          <CreditCardForm onChange={handleCardDetailsChange} selectedPaymentMethod={selectedPaymentMethod} />
          <PaymentMethodCard
            icon={"/icons/apple-pay.svg"}
            label={t("paymentMethod.applePay")}
            selected={selectedPaymentMethod === "applePay"}
            disabled={true}
            onClick={() => setSelectedPaymentMethod((prev) => prev === "applePay" ? "card" : "applePay")}
          />
        </div>
        <div className="space-y-4">
          {bookingData && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">تفاصيل الحجز</h3>
              <p><strong>الاستراحة:</strong> {bookingData.restName}</p>
              <p><strong>التواريخ:</strong> {bookingData.selectedDates.join(", ")}</p>
              <p><strong>عدد الأيام:</strong> {bookingData.selectedDates.length}</p>
              <p><strong>رقم الاستراحة:</strong> {bookingData.restId}</p>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="font-semibold">{t("summary.totalAmount")}:</span>
            <span className="font-bold text-lg">
              {selectedAmount === "full" 
                ? bookingData?.totalPrice || 0 
                : Math.round((bookingData?.totalPrice || 0) / 2)} {t("summary.currency")}
            </span>
          </div>
          <Button 
            variant="primary" 
            size="lg" 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                {t("processing") || "جاري المعالجة..."}
              </>
            ) : (
              t("summary.completePayment")
            )}
          </Button>
        </div>
      </form>

      {/* Payment Modal */}
  
    </div>
  );
};

export default RestPaymentPage;
