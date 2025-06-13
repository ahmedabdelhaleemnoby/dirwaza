import type { Metadata } from 'next';
import '../globals.css';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { Toaster } from 'react-hot-toast';

import { ibmPlexSansArabic } from '../fonts'; // أو المسار الصحيح


export const metadata: Metadata = {
  title: 'مزرعة دروازة',
  description: 'تنتظرك تجربة متكاملة في دروازة',
  icons:"/logo.svg"
};

 
export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}
export default async function  LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
 
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={ibmPlexSansArabic.className}>
        <NextIntlClientProvider locale={locale} >
          {children}
        </NextIntlClientProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}