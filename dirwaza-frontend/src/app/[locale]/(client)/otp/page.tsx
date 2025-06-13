"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OTPPage() {
  const router = useRouter();
  const t = useTranslations("OTPPage");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer for resend functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;
    
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear error when user starts typing
    if (error) setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const digits = pasteData.replace(/\D/g, "").slice(0, 6);
    
    if (digits.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < digits.length && i < 6; i++) {
        newOtp[i] = digits[i];
      }
      setOtp(newOtp);
      
      // Focus the next empty input or last input
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const validateOtp = () => {
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      return t("validation.required");
    }
    
    if (!/^\d{6}$/.test(otpString)) {
      return t("validation.invalidOtp");
    }
    
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateOtp();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const otpCode = otp.join("");
      console.log("OTP submitted:", otpCode);
      router.push("/"); 

      // Here you would verify the OTP with your backend
      // and handle the response (e.g., redirect to dashboard)
      
    } catch {
      setError(t("validation.submitError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    setIsResending(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Resending OTP code");
      setResendTimer(60); // 60 seconds countdown
      
      // Clear current OTP
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch {
      setError(t("validation.resendError"));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image 
              src="/logo.svg" 
              alt="Logo" 
              width={100} 
              height={100} 
              className="w-16 h-16 rounded-xl" 
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 text-center mb-8 text-sm">
            {t("subtitle")}
          </p>

          {/* OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                {t("otpLabel")}
              </label>
              
              <div className="flex justify-center gap-3 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={e => handleOtpChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-xl bg-gray-100 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
                    maxLength={1}
                  />
                ))}
              </div>
              
              {error && (
                <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-4 text-lg font-semibold rounded-2xl"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("verifying") : t("verify")}
            </Button>

            {/* Resend Section */}
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                {t("didNotReceive")}
              </p>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendTimer > 0 || isResending}
                className="text-sm text-primary font-medium hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                {isResending 
                  ? t("resending") 
                  : resendTimer > 0 
                    ? `${t("resendIn")} ${resendTimer}s`
                    : t("resendCode")
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 