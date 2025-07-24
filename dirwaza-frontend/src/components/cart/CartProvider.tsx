'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

const STORAGE_KEY = 'cart-items';

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useCartStore((state) => state.hydrate);

  useEffect(() => {
    const hydrateFromStorage = () => {
      try {
        const storedItems = localStorage.getItem(STORAGE_KEY);
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          hydrate(parsedItems);
        } else {
          // If no data in storage, hydrate with empty array to complete the hydration process
          hydrate({ items: [], recipientPerson: null });
        }
      } catch (error) {
        console.error('Failed to hydrate cart:', error);
        // On error, complete hydration with empty array
        hydrate({ items: [], recipientPerson: null });
      }
    };

    // Use a small delay to ensure DOM is ready
    const timeoutId = setTimeout(hydrateFromStorage, 10);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [hydrate]);

  // Subscribe to changes and update localStorage
  useEffect(() => {
    const unsubscribe = useCartStore.subscribe((state) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({items: state.items, recipientPerson: state.recipientPerson}));
      } catch (error) {
        console.error('Failed to save cart:', error);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
} 