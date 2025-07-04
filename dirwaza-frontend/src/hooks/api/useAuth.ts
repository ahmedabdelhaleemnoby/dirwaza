'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'react-hot-toast';
import { logoutAction, OtpRequest, OtpVerification, registerAction, RegisterData, sendOtpAction, verifyOtpAction } from '@/lib/api';
import { useAuthState } from './useAuthState';
  
// Custom hook for sending OTP
export const useSendOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendOtp = async (data: OtpRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await sendOtpAction(data);
      if (result.success) {
        toast.success(result.message || 'تم إرسال رمز التحقق بنجاح');
      } else {
        setError(result.error || 'فشل في إرسال رمز التحقق');
        toast.error(result.message || 'فشل في إرسال رمز التحقق');
      }
      return result;
    } catch {
      const errorMessage = 'فشل في إرسال رمز التحقق';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendOtp,
    loading,
    error,
  };
};

// Custom hook for verifying OTP
export const useVerifyOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refresh } = useAuthState();

  const verifyOtp = async (data: OtpVerification) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await verifyOtpAction(data);
      if (result.success) {
        toast.success(result.message || 'تم تسجيل الدخول بنجاح');
        // Immediately refresh auth state to show user data
        await refresh();
        router.refresh();
      } else {
        setError(result.error || 'رمز التحقق غير صحيح');
        toast.error(result.message || 'رمز التحقق غير صحيح');
      }
      return result;
    } catch {
      const errorMessage = 'رمز التحقق غير صحيح';
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyOtp,
    loading,
    error,
  };
};


// Custom hook for registration
export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    
    startTransition(() => {
      (async () => {
        try {
          const result = await registerAction(data);
          if (result.success) {
            toast.success(result.message || 'تم إرسال رمز التحقق بنجاح');
            return result;
          } else {
            setError(result.error || 'فشل في إنشاء الحساب');
            toast.error(result.message || 'فشل في إنشاء الحساب');
            return result;
          }
        } catch {
          const errorMessage = 'فشل في إنشاء الحساب';
          setError(errorMessage);
          toast.error(errorMessage);
          return { success: false, error: errorMessage };
        } finally {
          setLoading(false);
        }
      })();
    });
  };

  return {
    register,
    loading: loading || isPending,
    error,
  };
};

// Custom hook for logout
export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { refresh } = useAuthState();

  const logout = async () => {
    setLoading(true);
    setError(null);
    
    startTransition(() => {
      (async () => {
        try {
          const result = await logoutAction();
          if (result.success) {
            toast.success(result.message || 'تم تسجيل الخروج بنجاح');
            // Immediately refresh auth state to clear user data
            await refresh();
            router.push('/');
            router.refresh();
            return result;
        } else {
          setError(result.error || 'فشل في تسجيل الخروج');
          toast.error(result.message || 'فشل في تسجيل الخروج');
          return result;
        }
      } catch {
        const errorMessage = 'فشل في تسجيل الخروج';
        setError(errorMessage);
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    })();
  });
  };

  return {
    logout,
    loading: loading || isPending,
    error,
  };
};


// Convenience hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const { user, isLoading } = useAuthState();
  
  return {
    isAuthenticated: !!user,
    user,
    isLoading,
  };
};

 