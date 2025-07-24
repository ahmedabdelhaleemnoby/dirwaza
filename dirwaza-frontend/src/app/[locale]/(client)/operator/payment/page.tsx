"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import PaymentMethodCard from "@/components/payment/PaymentMethodCard";
import CreditCardForm from "@/components/payment/CreditCardForm";
import Button from "@/components/ui/Button";
import PaymentModal from "@/components/payment/PaymentModal";
import { useCartStore } from "@/store/cartStore";
// import { createPaymentOrderAction } from "@/lib/api/paymentActions";

const PaymentPage = () => {
  const router = useRouter();
  const t = useTranslations("PaymentPage");
  const {
    items: cartItems,
    isHydrated,
    getTotalPrice,
    clearCart,
    recipientPerson,
  } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    paymentUrl: "",
    paymentId: "",
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "card" | "applePay"
  >("card");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: {
      district: "",
      city: "",
      streetName: "",
      addressDetails: "",
    },
    delivery: {
      time: "",
      date: "",
    },
    cardDetails: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  // Check if cart has items after hydration is complete
  useEffect(() => {
    if (isHydrated && cartItems.length === 0) {
      toast.error("السلة فارغة. سيتم إعادة توجيهك إلى المتجر.");
      router.push("/operator");
    }
  }, [isHydrated, cartItems.length, router]);

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">جارٍ تحميل بيانات السلة...</p>
        </div>
      </div>
    );
  }

  // Show loading state if cart is empty after hydration
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">جارٍ التحقق من بيانات السلة...</p>
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

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleDeliveryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        [name]: value,
      },
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
      // Calculate total amount including delivery fee
      const deliveryFee = 15;
      const cartTotal = getTotalPrice();
      const totalAmount = cartTotal + deliveryFee;
      // const paymentAmount =
      //   selectedAmount === "full" ? totalAmount : totalAmount / 2;

      // Prepare order data for API
      // const fullDeliveryAddress = `${formData.address.streetName}, ${formData.address.district}, ${formData.address.city}. ${formData.address.addressDetails}`;

      const orderData = {
        totalAmount: totalAmount,
        // description: `طلب من المشتل - ${cartItems.length} منتج`,
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        orderType: "plants" as const,
        paymentMethod: selectedPaymentMethod,
        recipientPerson: recipientPerson,
        deliveryAddress: formData.address,
        deliveryDate: formData.delivery.date,
        deliveryTime: formData.delivery.time,
        cardDetails: formData.cardDetails,
        orderData:  cartItems.map((item) => ({
            plantId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        
      };

      console.log(orderData, "orderData");
      // const result = await createPaymentOrderAction(orderData);

      // if (result.success && result.data) {
      //   // Open payment modal with the payment URL
      //   setPaymentModal({
      //     isOpen: true,
      //     paymentUrl: result.data.paymentUrl,
      //     paymentId: result.data.paymentId,
      //   });
      //   toast.success(result.message);
      // } else {
      //   toast.error(result.message || "فشل في إنشاء طلب الدفع");
      // }
    } catch (error) {
      console.error("Payment submission error:", error);
      toast.error("حدث خطأ أثناء معالجة الطلب");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentComplete = (
    result: "success" | "failed" | "cancelled"
  ) => {
    setPaymentModal({ isOpen: false, paymentUrl: "", paymentId: "" });

    if (result === "success") {
      // Clear cart on successful payment
      clearCart();
      toast.success("تم الدفع بنجاح! سيتم توصيل طلبك في الموعد المحدد.");
      router.push("/operator/payment/result?status=success");
    } else if (result === "failed") {
      toast.error("فشل في عملية الدفع. يرجى المحاولة مرة أخرى.");
    } else {
      toast.error("تم إلغاء عملية الدفع.");
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(`خطأ في الدفع: ${error}`);
    setPaymentModal({ isOpen: false, paymentUrl: "", paymentId: "" });
  };

  const closePaymentModal = () => {
    setPaymentModal({ isOpen: false, paymentUrl: "", paymentId: "" });
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
          <h2 className="text-lg font-semibold">
            {t("deliveryAddress.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="city"
              label={t("deliveryAddress.city")}
              value={formData.address.city}
              onChange={handleAddressChange}
              required
            />
            <Input
              name="district"
              label={t("deliveryAddress.district")}
              value={formData.address.district}
              onChange={handleAddressChange}
              required
            />
          </div>

          <Input
            name="streetName"
            label={t("deliveryAddress.streetName")}
            value={formData.address.streetName}
            onChange={handleAddressChange}
            required
          />

          <TextArea
            name="addressDetails"
            label={t("deliveryAddress.addressDetails")}
            placeholder={t("deliveryAddress.addressPlaceholder")}
            value={formData.address.addressDetails}
            onChange={handleAddressChange}
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            {t("deliverySchedule.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-medium">
                {t("deliverySchedule.date")}
              </label>
              <input
                type="date"
                name="date"
                value={formData.delivery.date || recipientPerson?.deliveryDate}
                onChange={handleDeliveryChange}
                className="w-full px-4 py-3 border border-lime-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime-300"
                required
                min={
                  new Date(Date.now() + 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-medium">
                {t("deliverySchedule.time")}
              </label>
              <select
                name="time"
                value={formData.delivery.time}
                onChange={handleDeliveryChange}
                className="w-full px-4 py-3 border border-lime-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lime-300 text-right"
                required
              >
                <option value="">{t("deliverySchedule.selectTime")}</option>
                <option value="morning">
                  {t("deliverySchedule.timeSlots.morning")}
                </option>
                <option value="afternoon">
                  {t("deliverySchedule.timeSlots.afternoon")}
                </option>
                <option value="evening">
                  {t("deliverySchedule.timeSlots.evening")}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("paymentMethod.title")}</h2>

          <CreditCardForm onChange={handleCardDetailsChange} />
          <PaymentMethodCard
            icon={"/icons/apple-pay.svg"}
            label={t("paymentMethod.applePay")}
            selected={selectedPaymentMethod === "applePay"}
            onClick={() =>
              setSelectedPaymentMethod((prev) =>
                prev === "applePay" ? "card" : "applePay"
              )
            }
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{t("summary.totalAmount")}:</span>
            <span className="font-bold text-lg">
              {getTotalPrice() + 15}
              {t("summary.currency")}
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
      <PaymentModal
        isOpen={paymentModal.isOpen}
        paymentUrl={paymentModal.paymentUrl}
        onClose={closePaymentModal}
        onPaymentComplete={handlePaymentComplete}
        onPaymentError={handlePaymentError}
      />
    </div>
  );
};

export default PaymentPage;
