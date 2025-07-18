'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { toast } from 'react-hot-toast';
import { logoutAction } from '@/lib/api';
import { useAuthState } from './useAuthState';


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

 