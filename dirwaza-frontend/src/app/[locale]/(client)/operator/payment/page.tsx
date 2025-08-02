"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import PaymentMethodCard from "@/components/payment/PaymentMethodCard";
import CreditCardForm from "@/components/payment/CreditCardForm";
import Button from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";
import { createPlantBookingAction } from "@/lib/api/paymentActions";

const OperatorPaymentPage = () => {
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

  const [cardValidation, setCardValidation] = useState({
    isValid: false,
    hasErrors: false,
    errors: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
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

  const isFormValid = useMemo(() => {
    if (!isHydrated) return false;
    const hasRequiredFields = !!(
      formData.fullName.trim() &&
      formData.email.trim() &&
      formData.phone.trim()
    );

    // Only validate email format if email is provided
    const isEmailValid =
      !formData.email.trim() ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());

    // Only validate phone format if phone is provided
    const isPhoneValid =
      !formData.phone.trim() || /^[\d\s\-\+\(\)]+$/.test(formData.phone.trim());

    const areFieldsValid = hasRequiredFields && isEmailValid && isPhoneValid;

    // For card payment, check card validation
    if (selectedPaymentMethod === "card") {
      return (
        areFieldsValid && cardValidation.isValid && !cardValidation.hasErrors
      );
    }

    // For Apple Pay, only check basic form fields
    return areFieldsValid;
  }, [
    formData.fullName,
    formData.email,
    formData.phone,
    selectedPaymentMethod,
    cardValidation.isValid,
    cardValidation.hasErrors,
  ]);
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
    isValid: boolean;
    hasErrors: boolean;
    errors: {
      cardNumber: string;
      expiryDate: string;
      cvv: string;
    };
  }) => {
    setFormData((prev) => ({
      ...prev,
      cardDetails: {
        cardNumber: values.cardNumber,
        expiryDate: values.expiryDate,
        cvv: values.cvv,
      },
    }));

    setCardValidation({
      isValid: values.isValid,
      hasErrors: values.hasErrors,
      errors: values.errors,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error("يرجى إكمال المعلومات المطلوبة");
      return;
    }
    setIsLoading(true);

    try {
      // Calculate total amount including delivery fee
      // const deliveryFee = 15;
      const cartTotal = getTotalPrice();
      const totalAmount = cartTotal;

      // Prepare order data in the exact format expected by the API
      const orderData = {
        totalAmount: totalAmount,
        agreedToTerms: true,

        personalInfo: {
          fullName: formData.fullName,
          mobileNumber: formData.phone,
          email: formData.email,
          notes: recipientPerson?.message || "",
        },
        orderType: "plants" as const,
        paymentMethod: selectedPaymentMethod,
        recipientPerson: recipientPerson
          ? {
              fullName: recipientPerson.recipientName,
              mobileNumber: recipientPerson.phoneNumber,
              message: recipientPerson.message,
              deliveryDate: recipientPerson.deliveryDate,
              notes: recipientPerson.message || "",
            }
          : {
              fullName: formData.fullName,
              mobileNumber: formData.phone,
            },
        deliveryAddress: {
          district: formData.address.district,
          city: formData.address.city,
          streetName: formData.address.streetName,
          addressDetails: formData.address.addressDetails,
        },
        deliveryDate:
          formData.delivery.date || recipientPerson?.deliveryDate || "",
        deliveryTime: formData.delivery.time,
        cardDetails: {
          cardNumber: formData.cardDetails.cardNumber?.replace(/\s/g, ""),
          expiryDate: formData.cardDetails.expiryDate,
          cvv: formData.cardDetails.cvv,
        },
        orderData: cartItems.map((item) => ({
          plantId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      console.log("Sending order data:", orderData);
      const result = await createPlantBookingAction(orderData);
      console.log(result, "result5465654 ");
      if (result.success && result.data) {
        localStorage.setItem(
          "paymentResult-operator",
          JSON.stringify(result.data.paymentDetails)
        );
        toast.success(result.message);
        router.push("/operator/receipt");
        setTimeout(() => {
          clearCart();
        }, 1000);
      } else {
        toast.error(result.message || "فشل في إنشاء طلب الدفع");
      }
    } catch (error) {
      console.error("Payment submission error:", error);
      toast.error("حدث خطأ أثناء معالجة الطلب");
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized form validation
  // Memoized form validation

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
              <label className="text-gray-700 text-sm font-medium flex items-center gap-2">
                {t("deliverySchedule.date")}{" "}
                <span className="text-red-500">*</span>
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

          <CreditCardForm
            onChange={handleCardDetailsChange}
            selectedPaymentMethod={selectedPaymentMethod}
          />
          <PaymentMethodCard
            icon={"/icons/apple-pay.svg"}
            label={t("paymentMethod.applePay")}
            selected={selectedPaymentMethod === "applePay"}
            disabled={true}
            onClick={() =>
              setSelectedPaymentMethod((prev) =>
                prev === "applePay" ? "card" : "applePay"
              )
            }
          />
        </div>
        {/* Validation Status */}
        {!isFormValid && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600 mb-2">
              <strong>يرجى إكمال المعلومات المطلوبة:</strong>
            </p>
            <ul className="text-xs text-red-500 space-y-1">
              {!formData.fullName.trim() && <li>• الاسم الكامل مطلوب</li>}
              {!formData.email.trim() && <li>• البريد الإلكتروني مطلوب</li>}
              {formData.email.trim() &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                  <li>• البريد الإلكتروني غير صحيح</li>
                )}
              {!formData.phone.trim() && <li>• رقم الهاتف مطلوب</li>}
              {formData.phone.trim() &&
                !/^[\d\s\-\+\(\)]+$/.test(formData.phone) && (
                  <li>• رقم الهاتف غير صحيح</li>
                )}
              {selectedPaymentMethod === "card" && cardValidation.hasErrors && (
                <>
                  {cardValidation.errors.cardNumber && (
                    <li>• {cardValidation.errors.cardNumber}</li>
                  )}
                  {cardValidation.errors.expiryDate && (
                    <li>• {cardValidation.errors.expiryDate}</li>
                  )}
                  {cardValidation.errors.cvv && (
                    <li>• {cardValidation.errors.cvv}</li>
                  )}
                </>
              )}
            </ul>
          </div>
        )}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{t("summary.totalAmount")}:</span>
            <span className="font-bold text-lg">
              {getTotalPrice()}
              {t("summary.currency")}
            </span>
          </div>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            className="w-full"
            disabled={isLoading || !isFormValid}
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
    </div>
  );
};

export default OperatorPaymentPage;
