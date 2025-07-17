"use client";

import {
  Home as HomeIcon,
  Calendar as CalendarIcon,
  DollarSign as CurrencyDollarIcon,
  Settings as Cog6ToothIcon,
  LogOut as ArrowRightOnRectangleIcon,
  Truck as TruckIcon,
  Building2 as RestIcon,
  Trophy as HorseIcon,
  Users as UsersIcon,
  Sprout as SproutIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { usePathname, Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminLogoutAction } from "@/lib/api/authActions";

const navigationItems = [
  {
    name: "sidebar.controlPanel",
    href: "/dashboard",
    icon: HomeIcon,
    label: "لوحة التحكم"
  },
  {
    name: "sidebar.nurseryOrders",
    href: "/dashboard/nursery-orders",
    icon: SproutIcon,
    label: "طلبات المشتل"
  },
  {
    name: "sidebar.shipmentTracking",
    href: "/dashboard/shipment-tracking",
    icon: TruckIcon,
    label: "تتبع الشحنات"
  },
  {
    name: "sidebar.restReservations",
    href: "/dashboard/rest-reservations",
    icon: RestIcon,
    label: "حجوزات استراحات"
  },
  {
    name: "sidebar.equestrianSessions",
    href: "/dashboard/equestrian-sessions",
    icon: HorseIcon,
    label: "حصص الفروسية"
  },
  {
    name: "sidebar.revenues",
    href: "/dashboard/revenues",
    icon: CurrencyDollarIcon,
    label: "الإيرادات"
  },
  {
    name: "sidebar.customerManagement",
    href: "/dashboard/customer-management",
    icon: UsersIcon,
    label: "إدارة العملاء"
  },
  {
    name: "sidebar.calendar",
    href: "/dashboard/calendar",
    icon: CalendarIcon,
    label: "التقويم"
  },
  {
    name: "sidebar.settings",
    href: "/dashboard/settings",
    icon: Cog6ToothIcon,
    label: "الإعدادات"
  },
];

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const t = useTranslations("Dashboard");
  const lang = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActiveLink = (href: string) => {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  };

  const handleAdminLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await adminLogoutAction();
      if (result.success) {
        router.push('/admin/login');
      } else {
        console.error('Logout failed:', result.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className={`bg-primary text-white w-64 min-h-screen py-8 fixed start-0 top-0 z-40 shadow-lg rounded-e-3xl transition-transform duration-300 ease-in-out ${
     lang === 'ar' ? isOpen ? 'translate-x-0' : 'translate-x-full' : isOpen ?   'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Logo/Brand */}
      <Link href="/dashboard" className="pb-4 mb-8 flex items-center gap-x-3 px-6 border-b border-neutral">
        <Image
          src={"/logo.webp"}
          alt="logo Dirwazh"
          height={40}
          width={40}
          className="border border-primary-dark/80 rounded-lg"
        />  
        <h1 className="text-xl font-bold">درواز</h1>
        </Link>

      {/* Navigation */}
      <nav className="flex flex-col items-center justify-center py-8 px-4 space-y-2">
        <div className="w-56 flex flex-col items-start justify-start gap-2">
          {navigationItems.map((item) => {
            const isActive = isActiveLink(item.href);
            const IconComponent = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`w-full rounded-2xl h-10 flex flex-row items-center  py-2 px-4 box-border transition-all duration-200 ${
                  isActive
                    ? "bg-white text-primary shadow-sm"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <div className="w-full h-6 flex flex-row items-center  gap-3">
                  

                  <IconComponent className="w-7 h-6 flex-shrink-0" />
                  <span className="text-lg font-medium">{t(item.name)}</span>

                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-6 right-6">
        <button 
          onClick={handleAdminLogout}
          disabled={isLoggingOut}
          className={`
            flex items-center gap-x-3 px-4 py-3 w-full rounded-lg transition-colors bg-white text-primary
            ${isLoggingOut 
              ? 'text-neutral/50 cursor-not-allowed' 
              : 'text-green-100 hover:bg-green-700 hover:text-white'
            }
          `}
        >
          <ArrowRightOnRectangleIcon className={`h-5 w-5 ${isLoggingOut ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">
            {isLoggingOut ? 'جاري تسجيل الخروج...' : t("sidebar.logout")}
          </span>
        </button>
      </div>
    </div>
  );
}
