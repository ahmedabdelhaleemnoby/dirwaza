'use client';

import { useEffect } from 'react';
import { useBookingStore } from '@/store/bookingStore';

const STORAGE_KEY = 'booking-data';

export default function BookingProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useBookingStore((state) => state.hydrate);

  useEffect(() => {
    const hydrateFromStorage = () => {
      try {
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          hydrate(parsedData);
        } else {
          // If no data in storage, hydrate with null to complete the hydration process
          hydrate(null);
        }
      } catch (error) {
        console.error('Failed to hydrate booking data:', error);
        // On error, complete hydration with null
        hydrate(null);
      }
    };

    // Use a small delay to ensure DOM is ready
    const timeoutId = setTimeout(hydrateFromStorage, 10);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [hydrate]);

  // Subscribe to changes and update localStorage
  useEffect(() => {
    const unsubscribe = useBookingStore.subscribe((state) => {
      try {
        if (state.bookingData) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bookingData));
        } else {
          // Remove from localStorage when data is cleared
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('Failed to save booking data:', error);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
} 