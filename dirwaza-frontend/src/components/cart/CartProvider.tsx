'use client';

import { useEffect } from 'react';
import { useCartStore,  } from '@/store/cartStore';

const STORAGE_KEY = 'cart-items';

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useCartStore((state) => state.hydrate);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(STORAGE_KEY);
      if (storedItems) {
        hydrate(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error('Failed to hydrate cart:', error);
    }
  }, [hydrate]);

  // Subscribe to changes and update localStorage
  useEffect(() => {
    const unsubscribe = useCartStore.subscribe((state) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
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