import { useEffect, useState } from 'react';
import { getAuthStateAction } from '@/lib/api/authActions';

interface User {
  id: string;
  name?: string;
  phone: string;
  email?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  refresh: () => Promise<void>;
}

export const useAuthState = (): AuthState => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Fetch auth state from server-side cookies
  const fetchAuthState = async () => {
    try {
      const result = await getAuthStateAction();
      if (result.success) {
        setUser(result.data.user);
        setToken(result.data.token || null);
      }
    } catch (error) {
      console.error('Failed to fetch auth state:', error);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    fetchAuthState();
  }, []);

  // Periodically check for auth state changes
  useEffect(() => {
    const interval = setInterval(fetchAuthState, 10000); // Check every 10 seconds
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const isAuthenticated = !!(token && user);

  // Debug logging (only in development)
 

  return {
    user,
    isAuthenticated,
    isLoading,
    token,
    refresh: fetchAuthState
  };
}; 