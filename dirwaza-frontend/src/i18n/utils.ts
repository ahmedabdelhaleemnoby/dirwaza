import { locales, defaultLocale, Locale } from './routing';

// Proper type guard with correct typing
export function isValidLocale(locale: string | null | undefined): locale is Locale {
  return !!locale && locales.includes(locale as Locale);
}

// Ensure we always return a valid Locale type
export function ensureValidLocale(locale: string): Locale {
  return isValidLocale(locale) ? locale : defaultLocale;
}