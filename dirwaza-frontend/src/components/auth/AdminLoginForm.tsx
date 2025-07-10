"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Phone, Lock, Shield } from "lucide-react";
import Button from "@/components/ui/Button";
import { adminLoginAction } from "@/lib/api/authActions";
import { usePathname } from "next/navigation";

interface AdminLoginFormProps {
  error?: string;
  message?: string;
}

export default function AdminLoginForm({ error, message }: AdminLoginFormProps) {
  const router = useRouter();
  const t = useTranslations("AdminLoginPage");
  const pathname = usePathname();
  const isRTL = pathname.startsWith('/ar');
  
  const [formData, setFormData] = useState({
    phone: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [clientError, setClientError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validatePhone = (phone: string) => {
    if (!phone.trim()) {
      return t("validation.phoneRequired");
    }
    // Basic phone validation - can be enhanced
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
      return t("validation.invalidPhone");
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password.trim()) {
      return t("validation.passwordRequired");
    }
    return "";
  };

  const handleInputChange = (field: 'phone' | 'password') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (clientError) {
      setClientError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const phoneError = validatePhone(formData.phone);
    const passwordError = validatePassword(formData.password);
    
    if (phoneError || passwordError) {
      setClientError(phoneError || passwordError);
      return;
    }

    setClientError("");
    setIsLoading(true);

    try {
      const result = await adminLoginAction({
        phone: formData.phone.trim(),
        password: formData.password
      });
      
      if (result.success) {
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        setClientError(result.message || t("validation.invalidCredentials"));
      }
    } catch (error: unknown) {
      console.error('Admin login error:', error);
      setClientError(t("validation.networkError"));
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = error || clientError;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Success Message */}
      {message && (
        <div className="p-4 text-sm text-primary bg-primary-light/20 rounded-xl border border-primary-light">
          {message}
        </div>
      )}

      {/* Error Message */}
      {displayError && (
        <div className="p-4 text-sm text-secondary-dark bg-secondary-dark/10 rounded-xl border border-secondary-dark/20">
          {displayError}
        </div>
      )}
      
      {/* Phone Number Input */}
      <div className="space-y-2">
        <label 
          htmlFor="admin-phone" 
          className={`block text-sm font-semibold text-primary ${isRTL ? 'text-right font-ibm-plex-sans-arabic' : ''}`}
        >
          {t("phoneLabel")}
        </label>
        
        <div className="relative">
          <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
            <Phone className="w-5 h-5 text-primary/60" />
          </div>
          
          <input
            type="tel"
            id="admin-phone"
            value={formData.phone}
            onChange={handleInputChange('phone')}
            placeholder={t("phonePlaceholder")}
            className={`
              block w-full rounded-xl border-2 border-neutral-dark/30 
              ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'} py-3
              bg-white text-primary placeholder-primary/50
              focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20
              hover:border-primary/50 transition-colors
              ${isRTL ? 'font-ibm-plex-sans-arabic' : ''}
              disabled:bg-neutral-light disabled:cursor-not-allowed
            `}
            dir="ltr"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label 
          htmlFor="admin-password" 
          className={`block text-sm font-semibold text-primary ${isRTL ? 'text-right font-ibm-plex-sans-arabic' : ''}`}
        >
          {t("passwordLabel")}
        </label>
        
        <div className="relative">
          <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
            <Lock className="w-5 h-5 text-primary/60" />
          </div>
          
          <input
            type={showPassword ? "text" : "password"}
            id="admin-password"
            value={formData.password}
            onChange={handleInputChange('password')}
            placeholder={t("passwordPlaceholder")}
            className={`
              block w-full rounded-xl border-2 border-neutral-dark/30 
              ${isRTL ? 'pr-10 pl-12 text-right' : 'pl-10 pr-12'} py-3
              bg-white text-primary placeholder-primary/50
              focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20
              hover:border-primary/50 transition-colors
              ${isRTL ? 'font-ibm-plex-sans-arabic' : ''}
              disabled:bg-neutral-light disabled:cursor-not-allowed
            `}
            disabled={isLoading}
          />
          
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`
              absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} 
              flex items-center text-primary/60 hover:text-primary transition-colors
              disabled:cursor-not-allowed
            `}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Forgot Password Link */}
      <div className={`text-center ${isRTL ? 'font-ibm-plex-sans-arabic' : ''}`}>
        <button
          type="button"
          className="text-sm text-secondary hover:text-secondary-dark transition-colors font-medium"
          disabled={isLoading}
        >
          {t("forgotPassword")}
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className={`
          w-full py-4 text-lg font-semibold rounded-xl
          bg-gradient-to-r from-primary to-primary-dark
          hover:from-primary-dark hover:to-primary
          focus:ring-4 focus:ring-primary/30
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          ${isRTL ? 'flex-row-reverse font-ibm-plex-sans-arabic' : ''}
        `}
        disabled={isLoading}
      >
        <Shield className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
        {isLoading ? t("loggingIn") : t("login")}
      </Button>

      {/* Back to Client Login */}
      <div className={`text-center pt-4 border-t border-neutral-dark/20 ${isRTL ? 'font-ibm-plex-sans-arabic' : ''}`}>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-sm text-primary/70 hover:text-primary transition-colors font-medium"
          disabled={isLoading}
        >
          {t("backToClient")}
        </button>
      </div>
    </form>
  );
} 