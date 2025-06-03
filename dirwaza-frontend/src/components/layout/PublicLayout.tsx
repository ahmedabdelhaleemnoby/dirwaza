import { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ensureValidLocale } from '@/i18n/utils';
import { Locale } from '@/i18n/routing';

type Props = {
  children: ReactNode;
  locale: string;
};

export default function PublicLayout({ children, locale }: Props) {
  const validLocale: Locale = ensureValidLocale(locale);
  // container mx-auto px-4 py-8
  return (
    <div className={`flex flex-col min-h-screen ${validLocale === 'ar' ? 'rtl' : 'ltr'}`}>
      <Header />
      <main className={`flex-grow  bg-[#F9FAFB] `}>
        {children}
      </main>
      <Footer />
    </div>
  );
}