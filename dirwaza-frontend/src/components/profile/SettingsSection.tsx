"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Bell, Globe, CreditCard, LogOut, Plus, Languages, ChevronDown } from "lucide-react";
import { locales, Locale } from "@/i18n/routing";
import { ensureValidLocale } from "@/i18n/utils";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" }
];

export default function SettingsSection() {
  const t = useTranslations("ProfilePage.settings");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const changeLanguage = (newLocale: string) => {
    const validLocale: Locale = ensureValidLocale(newLocale);
    const segments = pathname.split("/");
    const isFirstSegmentLocale = locales.includes(segments[1] as Locale);

    if (isFirstSegmentLocale) {
      segments[1] = validLocale;
    } else {
      segments.splice(1, 0, validLocale);
    }

    const newPath = segments.join("/");
    router.push(newPath);
    setLanguageDropdownOpen(false);
  };

  const selectedLanguage = languages.find(lang => lang.code === currentLocale);

  return (
    <div className="w-full pb-6">
      <Card
        hasHover={false}
        className="flex flex-col w-full p-6 bg-white rounded-2xl shadow-lg"
      >
        {/* Section Title */}
        <div className="mb-6">
          <h2 className="font-bold text-gray-800 text-xl leading-7 text-right">
            {t("title")}
          </h2>
        </div>

        {/* Settings Items */}
        <div className="flex flex-col space-y-4">
          {/* Notifications Setting */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex w-10 h-10 items-center justify-center bg-gray-100 rounded-full">
                <Bell size={16} className="text-gray-600" />
              </div>
              <span className="font-medium text-base text-gray-800">
                {t("notifications")}
              </span>
            </div>
            
            {/* Toggle Switch */}
          
            <button
        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full
           transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#8781c5] focus:ring-offset-1 ${
          notificationsEnabled ? "bg-accent-dark" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
            notificationsEnabled ? "-translate-x-6" : "-translate-x-1"
          }`}
        />
      </button>
          </div>

          {/* Language Setting */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex w-10 h-10 items-center justify-center bg-gray-100 rounded-full">
                <Globe size={16} className="text-gray-600" />
              </div>
              <span className="font-medium text-base text-gray-800">
                {t("language")}
              </span>
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Languages size={16} className="text-gray-700" />
                <span className="text-gray-700 text-sm font-medium">
                  {selectedLanguage?.label}
                </span>
                <ChevronDown size={14} className="text-gray-700" />
              </Button>

              {languageDropdownOpen && (
                <div className="absolute right-0 z-10 mt-2 w-32 rounded-lg shadow-lg bg-white border border-gray-200">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                        currentLocale === lang.code
                          ? "bg-[#827db7] text-white font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Methods Setting */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex w-10 h-10 items-center justify-center bg-gray-100 rounded-full">
                <CreditCard size={16} className="text-gray-600" />
              </div>
              <span className="font-medium text-base text-gray-800">
                {t("paymentMethods")}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 transition-colors duration-200"
            >
              <span className="text-sm font-medium">{t("add")}</span>
              <Plus size={16} />
            </Button>
          </div>

          {/* Logout Setting */}
          <div className="flex items-center p-3">
            <div className="flex items-center gap-3 cursor-pointer hover:bg-red-50 rounded-lg p-2 -m-2 transition-colors duration-200 group">
              <div className="flex w-10 h-10 items-center justify-center bg-red-100 rounded-full group-hover:bg-red-200 transition-colors duration-200">
                <LogOut size={16} className="text-red-600" />
              </div>
              <span className="font-medium text-base text-gray-800 group-hover:text-red-600 transition-colors duration-200">
                {t("logout")}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 