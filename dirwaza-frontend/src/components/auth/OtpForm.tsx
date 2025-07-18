"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/Button";
import { verifyOtpAction, sendOtpAction } from "@/lib/api/authActions";
import { useRouter } from "next/navigation";

interface OtpFormProps {
  error?: string;
  message?: string;
}

export default function OtpForm({ error, message }: OtpFormProps) {
  const router = useRouter();
  const t = useTranslations("OTPPage");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [clientError, setClientError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get phone number from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPhone = sessionStorage.getItem('verificationPhone');
      if (storedPhone) {
        setPhone(storedPhone);
      } else {
        // If no phone found, redirect to login
        router.push('/login');
      }
    }
  }, [router]);

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
    if (clientError) setClientError("");

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
      setClientError(validationError);
      return;
    }

    if (!phone) {
      setClientError('رقم الهاتف غير موجود');
      return;
    }

    setClientError("");
    setIsLoading(true);

    try {
      const otpCode = otp.join("");
      
      const result = await verifyOtpAction({
        phone: phone,
        code: otpCode
      });
      
      if (result.success) {
        // Clear stored phone number
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('verificationPhone');
        }
        
        // Show success message
        toast.success(result.message || 'تم تسجيل الدخول بنجاح');
        
        router.push("/");
      } else {
        setClientError(result.message);
      }
      
    } catch (error: unknown) {
      console.error('OTP verification error:', error);
      setClientError("حدث خطأ أثناء التحقق من الرمز");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    if (!phone) {
      setClientError('رقم الهاتف غير موجود');
      return;
    }

    setClientError("");
    setIsResending(true);

    try {
      const result = await sendOtpAction({ phone });
      
      if (result.success) {
        // Show success message for resent OTP
        toast.success(result.message || 'تم إرسال رمز التحقق مرة أخرى');
        setResendTimer(60); // 60 seconds countdown
        
        // Clear current OTP
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setClientError(result.message);
      }
    } catch (error: unknown) {
      console.error('Resend OTP error:', error);
      setClientError("حدث خطأ أثناء إرسال الرمز");
    } finally {
      setIsResending(false);
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

      {/* Phone Display */}
      {phone && (
        <p className="text-gray-600 text-center text-sm">
          {t("subtitle")}
          <span className="block mt-1 font-medium">{phone}</span>
        </p>
      )}

      {/* OTP Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
          {t("otpLabel")}
        </label>
        
        <div className="flex justify-center gap-3 mb-4" dir="ltr">
          {otp.map((digit, index) => (
                         <input
               key={index}
               ref={(el) => { inputRefs.current[index] = el; }}
               type="text"
               inputMode="numeric"
               maxLength={1}
               value={digit}
               onChange={(e) => handleOtpChange(index, e.target.value)}
               onKeyDown={(e) => handleKeyDown(index, e)}
               onPaste={handlePaste}
               className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50"
               autoComplete="one-time-code"
             />
          ))}
        </div>
        
        {displayError && (
          <p className="mt-2 text-sm text-red-600 text-center">{displayError}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        className="w-full py-4 text-lg font-semibold rounded-2xl"
        disabled={isLoading}
      >
        {isLoading ? t("verifying") : t("verify")}
      </Button>

             {/* Resend Code */}
       <div className="text-center">
         <p className="text-sm text-gray-600 mb-2">
           {t("didNotReceive")}
         </p>
         
         <button
           type="button"
           onClick={handleResendCode}
           disabled={resendTimer > 0 || isResending}
           className="text-sm font-medium text-primary hover:text-primary/80 disabled:text-gray-400 disabled:cursor-not-allowed"
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
  );
} 