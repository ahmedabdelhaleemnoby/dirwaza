import { ReactNode } from 'react';
import PublicLayout from '@/components/layout/PublicLayout';
import { getLocale } from 'next-intl/server';
import { ensureValidLocale } from '@/i18n/utils';
import { Locale } from '@/i18n/routing';

export default async function LocaleLayout({ 
  children,
}: { 
  children: ReactNode;
}) {
  const rawLocale = await getLocale();
  const locale: Locale = ensureValidLocale(rawLocale);
  
  return <PublicLayout locale={locale}>{children}</PublicLayout>;
}