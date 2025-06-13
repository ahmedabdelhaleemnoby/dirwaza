'use client';

import { useTranslations } from 'next-intl';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Link } from '@/i18n/navigation';
import { useEffect, useState } from 'react';

interface CartCountProps {
  isMobile?: boolean;
}

export default function CartCount({ isMobile = false }: CartCountProps) {
  const t = useTranslations('Header');
  const [mounted, setMounted] = useState(false);
  const cartItemCount = useCartStore((state) => state.getTotalItems());

  // Only show cart count after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Link href="/cart" className="relative text-primary hover:text-secondary">
        <ShoppingCart size={isMobile ? 20 : 24} />
      </Link>
    );
  }

  if (isMobile) {
    return (
      <Link
        href="/cart"
        className="text-lg font-medium text-primary hover:text-secondary flex items-center gap-2"
      >
        <ShoppingCart size={20} />
        {t('cart')} ({cartItemCount} {t('items')})
      </Link>
    );
  }

  return (
    <Link href="/cart" className="relative text-primary hover:text-secondary">
      <ShoppingCart size={24} />
      {cartItemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {cartItemCount}
        </span>
      )}
    </Link>
  );
} 