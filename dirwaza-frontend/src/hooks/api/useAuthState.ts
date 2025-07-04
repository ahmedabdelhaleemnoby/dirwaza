import { useEffect, useState } from 'react';

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
}

// Simple token management utilities
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('user_data');
  try {
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

export const useAuthState = (): AuthState => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Initialize from localStorage (persisted storage)
  useEffect(() => {
    const cachedUserData = getStoredUser();
    const storedToken = getStoredToken();
    
    setUser(cachedUserData);
    setToken(storedToken);
    setIsLoading(false);
    
    console.log('Auth State Initialized:', {
      currentUser: cachedUserData,
      token: storedToken ? 'Present' : 'Missing',
      hasToken: !!storedToken
    });
  }, []);

  // Listen for storage changes (in case auth state changes in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUserData = getStoredUser();
      const updatedToken = getStoredToken();
      
      setUser(updatedUserData);
      setToken(updatedToken);
      
      console.log('Auth State Updated from Storage:', {
        user: updatedUserData,
        token: updatedToken ? 'Present' : 'Missing'
      });
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const isAuthenticated = !!(token && user);

  console.log('Current Auth State:', {
    user,
    isAuthenticated,
    isLoading,
    token: token ? 'Present' : 'Missing',
    hasToken: !!token
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    token
  };
}; 