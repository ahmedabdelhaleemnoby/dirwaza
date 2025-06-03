'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, Locale } from '@/i18n/routing';
import { ensureValidLocale } from '@/i18n/utils';
import { useState } from 'react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' }
];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [open, setOpen] = useState(false);

  const changeLanguage = (newLocale: string) => {
    const validLocale: Locale = ensureValidLocale(newLocale);
    const segments = pathname.split('/');
    const isFirstSegmentLocale = locales.includes(segments[1] as Locale);

    if (isFirstSegmentLocale) {
      segments[1] = validLocale;
    } else {
      segments.splice(1, 0, validLocale);
    }

    const newPath = segments.join('/');
    router.push(newPath);
    setOpen(false);
  };

  const selected = languages.find(lang => lang.code === currentLocale);

  return (
    <div className="relative inline-block text-left min-w-[100px]">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-primary font-medium text-sm cursor-pointer bg-transparent border-none outline-none focus:outline-none"
      >
      <Globe size={20} />  <span>{selected?.label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          className="
            absolute z-10 mt-2 w-[120px]
            rounded-xl shadow-2xl bg-white py-1
            border-2 border-gray-400/20 focus:outline-none
          "
        >
          {languages.map((lang) => (
            <li
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`
                block px-4 py-2 text-sm cursor-pointer transition
                ${
                  currentLocale === lang.code
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-neutral-700 hover:bg-neutral-100'
                }
              `}
            >
              {lang.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
