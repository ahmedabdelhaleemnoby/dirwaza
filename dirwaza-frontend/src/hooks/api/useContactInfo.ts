"use client";

import { useState, useEffect } from 'react';
import { getContactInfoAction } from '@/lib/api/authActions';
import { ContactInfoResponse } from '@/__mocks__/contact.mock';

interface UseContactInfoReturn {
  contactInfo: ContactInfoResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useContactInfo(): UseContactInfoReturn {
  const [contactInfo, setContactInfo] = useState<ContactInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContactInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getContactInfoAction();
      
      if (result.success && result.data) {
        setContactInfo(result.data);
      } else {
        setError(result.message || 'Failed to load contact information');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactInfo();
  }, []);

  return {
    contactInfo,
    loading,
    error,
    refetch: fetchContactInfo,
  };
} 