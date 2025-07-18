"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { registerAction } from "@/lib/api/authActions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const normalizePhoneNumber = (phone: string) => {
  // Remove any non-digit characters except + at the start
  let cleanPhone = phone.replace(/[^\d+]/g, "");

  // Convert to international format
  if (cleanPhone.startsWith("974") && !cleanPhone.startsWith("+974")) {
    // Qatar without + -> +974
    cleanPhone = "+" + cleanPhone;
  } else if (cleanPhone.startsWith("20") && !cleanPhone.startsWith("+20")) {
    // Egypt without + -> +20
    cleanPhone = "+" + cleanPhone;
  } else if (cleanPhone.startsWith("01") && cleanPhone.length === 11) {
    // Egypt local format (01xxxxxxxxx) -> +201xxxxxxxxx
    cleanPhone = "+20" + cleanPhone.substring(1);
  } else if (!cleanPhone.startsWith("+974") && !cleanPhone.startsWith("+20")) {
    // If no country code detected and 8 digits, assume Qatar
    if (cleanPhone.length === 8) {
      cleanPhone = "+974" + cleanPhone;
    } 
    // If no country code detected and 10-11 digits, assume Egypt
    else if (cleanPhone.length === 10 || cleanPhone.length === 11) {
      cleanPhone = "+20" + cleanPhone;
    }
  }
  
  return cleanPhone;
};

const validatePhoneNumber = (phone: string, t: (key: string) => string) => {
  // Remove any non-digit characters except + at the start
  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const normalizedPhone = normalizePhoneNumber(cleanPhone);
  const phoneWithoutSpaces = normalizedPhone.replace(/\s/g, "");
  
  if (!phoneWithoutSpaces) {
    return t("validation.required");
  }
  
  // Check if it's a valid Qatar phone number (starts with +974 or 974)
  const qatarPhoneRegex = /^(\+974|974)[0-9]{8}$/;
  
  // Check if it's a valid Egypt phone number (starts with +20 or 20, followed by 10 digits)
  const egyptPhoneRegex = /^(\+20|20)[0-9]{10}$/;
  if (!qatarPhoneRegex.test(phoneWithoutSpaces) && !egyptPhoneRegex.test(phoneWithoutSpaces)) {
    return t("validation.invalidPhone");
  }
  
  return "";
};

interface LoginFormProps {
  error?: string;
  message?: string;
}

export default function LoginForm({ error, message }: LoginFormProps) {
  const router = useRouter();
  const t = useTranslations("LoginPage");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [clientError, setClientError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    
    // Clear error when user starts typing
    if (clientError) {
      setClientError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validatePhoneNumber(phoneNumber, t);
    if (validationError) {
      setClientError(validationError);
      return;
    }

    setClientError("");
    setIsLoading(true);

    try {
      const normalizedPhone = normalizePhoneNumber(phoneNumber);
      
      const result = await registerAction({
        phone: normalizedPhone
      });
      
      if (result.success) {
        // Store phone number in sessionStorage for OTP verification
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('verificationPhone', normalizedPhone);
        }
          toast.success(result.message||'تم إرسال رمز التحقق بنجاح');
        router.push("/otp");
      } else {
        setClientError(result.message);
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      setClientError("حدث خطأ أثناء المعالجة");
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = error || clientError;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className="p-3 text-sm text-green-600 bg-green-50 rounded-lg">
          {message}
        </div>
      )}
      
      {/* Phone Number Input */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          {t("phoneLabel")}
        </label>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center">
            <select className="h-full rounded-l-2xl border-0 bg-transparent py-0 pl-3 pr-2 text-gray-500 focus:ring-2 focus:ring-primary sm:text-sm">
              <option>+974</option>
              <option>+20</option>
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
        
        {displayError && (
          <p className="mt-2 text-sm text-red-600">{displayError}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full py-4 text-lg font-semibold rounded-2xl"
        disabled={isLoading}
      >
        {isLoading ? t("submitting") : t("continue")}
      </Button>
    </form>
  );
} 