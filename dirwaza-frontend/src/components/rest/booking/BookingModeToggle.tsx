"use client";
import { useTranslations } from "next-intl";

interface BookingModeToggleProps {
  valToggle: boolean;
  onToggle: () => void;
}

export default function BookingModeToggle({
  valToggle,
  onToggle,
}: BookingModeToggleProps) {
  const t = useTranslations("RestPage");

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full
           transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#8781c5] focus:ring-offset-1 ${
          valToggle ? "bg-accent-dark" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out ${
            valToggle ? "-translate-x-6" : "-translate-x-1"
          }`}
        />
      </button>
      <span>{t("calendar.dayUse")}</span>
    </div>
  );
}
