import { ReactNode } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { getLocale } from 'next-intl/server';
import { ensureValidLocale } from '@/i18n/utils';
import { Locale } from '@/i18n/routing';
import CartProvider from '@/components/cart/CartProvider';

export default async function LocaleLayout({ 
  children,
}: { 
  children: ReactNode;
}) {
  const rawLocale = await getLocale();
  const locale: Locale = ensureValidLocale(rawLocale);
  
  return (
    <CartProvider>
        <PublicLayout locale={locale}>{children}</PublicLayout>
    </CartProvider>
  );
}