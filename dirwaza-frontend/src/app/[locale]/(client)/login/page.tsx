"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("LoginPage");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePhoneNumber = (phone: string) => {
    // Remove any non-digit characters except + at the start
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    
    // Check if it's a valid Saudi phone number (starts with +966 or 966 or 05)
    const saudiPhoneRegex = /^(\+966|966|05)[0-9]{8}$/;
    const phoneWithoutSpaces = cleanPhone.replace(/\s/g, "");
    
    if (!phoneWithoutSpaces) {
      return t("validation.required");
    }
    
    if (!saudiPhoneRegex.test(phoneWithoutSpaces)) {
      return t("validation.invalidPhone");
    }
    
    return "";
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validatePhoneNumber(phoneNumber);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Phone number submitted:", phoneNumber);
      // Here you would typically send the phone number to your backend
      // and handle the response (e.g., send OTP, redirect, etc.)
      router.push("/otp");
    } catch {
      setError(t("validation.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
           <Image src="/logo.svg" alt="Logo" width={100} height={30} className="w-16 h-16  rounded-xl" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-center mb-8 text-sm">
            {t("subtitle")}
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number Input */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                {t("phoneLabel")}
              </label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <select className="h-full rounded-l-2xl border-0 bg-transparent py-0 pl-3 pr-2 text-gray-500 focus:ring-2 focus:ring-primary sm:text-sm">
                    <option>+966</option>
                  </select>
                </div>
                
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder={t("phonePlaceholder")}
                  className="block w-full rounded-2xl border border-gray-300 py-4 pl-20 pr-4 bg-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm"
                  dir="ltr"
                />
              </div>
              
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-lg font-semibold rounded-2xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("submitting") : t("continue")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 