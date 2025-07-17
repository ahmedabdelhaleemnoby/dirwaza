"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import Button from "@/components/ui/Button";
import clsx from "clsx";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // icons
import { Link,usePathname } from "@/i18n/navigation";
import CartCount from "@/components/cart/CartCount";
import ProfileDropdown from "./ProfileDropdown";
import { useLogout } from "@/hooks/api/useAuth";
import { useAuthState } from "@/hooks/api/useAuthState";
import { User, LogOut } from "lucide-react";

export default function Header() {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuthState();
  const logoutMutation = useLogout();

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/rest", label: t("rest") },
    { href: "/training-booking", label: t("training") },
    { href: "/operator", label: t("operator") },
    { href: "/#faq", label: t("faq") },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-padding mx-auto py-3 flex justify-between items-center">
        {/* الشعار */}
        <div className="flex items-center flex-1">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.webp"
              alt="Drooza Logo"
              width={140}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Navigation Links - فقط على الشاشات الكبيرة */}
          <nav className="hidden lg:flex ms-10 gap-x-8  justify-center mx-auto flex-1 px-10 ">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={index}
                  href={link.href}
                  className={clsx(
                    "font-medium transition-colors",
                    isActive
                      ? "text-secondary pointer-events-none"
                      : "text-primary hover:text-secondary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* الزرار بتاع المينيو - ظاهر فقط في الشاشات الصغيرة */}

        <div className="lg:hidden flex items-center space-x-4">
          <CartCount />

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-primary border border-secondary rounded-full p-2"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Auth Section + Language */}
        <div className="hidden lg:flex items-center space-x-4">
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <ProfileDropdown />
              ) : (
                <Button
                  variant="secondary"
                  size="md"
                  href="/login"
                  className="rounded-lg py-1"
                >
                  {t("login")}
                </Button>
              )}
            </>
          )}
          <LanguageSwitcher />
          <CartCount />
        </div>
      </div>

      {/* سايد بار في الموبايل */}
      <div
        className={clsx(
          "fixed top-0 bottom-0 w-64 bg-white z-50 shadow-lg p-4 transition-transform duration-300",
          "lg:hidden",
          pathname.startsWith("/ar") ? "right-0" : "left-0",
          sidebarOpen
            ? "translate-x-0"
            : pathname.startsWith("/ar")
            ? "translate-x-full"
            : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <Image src="/logo.webp" alt="Logo" width={100} height={30} />
          <button onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col space-y-4">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={index}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                  "text-lg font-medium transition-colors",
                  isActive
                    ? "text-secondary"
                    : "text-primary hover:text-secondary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <CartCount isMobile />
        </nav>

        {/* Mobile Auth Section */}
        <div className="mt-6 space-y-4">
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <div className="space-y-2">
                  {/* Mobile Profile Link */}
                  <Link
                    href="/profile"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center justify-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <User size={20} className="text-gray-500" />
                    <span className="text-gray-700 font-medium">
                      الملف الشخصي
                    </span>
                  </Link>

                  {/* Mobile Logout Button */}
                  <button
                    onClick={async () => {
                      await logoutMutation.logout();
                      setSidebarOpen(false);
                    }}
                    disabled={logoutMutation.loading}
                    className="w-full flex items-center justify-start gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <LogOut size={20} className="text-red-500" />
                    <span className="font-medium">
                      {logoutMutation.loading
                        ? "جاري تسجيل الخروج..."
                        : "تسجيل خروج"}
                    </span>
                  </button>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="md"
                  href="/login"
                  className="w-full py-2 rounded-lg"
                >
                  {t("login")}
                </Button>
              )}
            </>
          )}
        </div>

        <div className="mt-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
