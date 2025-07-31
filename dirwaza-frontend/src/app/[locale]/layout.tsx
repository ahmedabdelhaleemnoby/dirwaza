import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Toaster } from "react-hot-toast";

import { ibmPlexSansArabic } from "../fonts"; // أو المسار الصحيح
import { Suspense } from "react";
import LoadingPage from "./loading";

export const metadata: Metadata = {
  title: "مزرعة دروازة",
  description: "تنتظرك تجربة متكاملة في دروازة",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      
      {process.env.NODE_ENV === "development" ? (
        <body
          className={ibmPlexSansArabic.className}
          data-new-gr-c-s-check-loaded="14.1243.0"
          data-gr-ext-installed=""
        >
          <Suspense fallback={<LoadingPage />}>
            <NextIntlClientProvider locale={locale}>
              {children}
            </NextIntlClientProvider>
          <Toaster position="top-center" />
          </Suspense>
        </body>
      ) : (
        <body className={ibmPlexSansArabic.className}>
          <Suspense fallback={<LoadingPage />}>
          <NextIntlClientProvider locale={locale}>
            {children}
          </NextIntlClientProvider>
          <Toaster position="top-center" /></Suspense>
        </body>
      )}
    </html>
  );
}
