"use client";

import {
  Home as HomeIcon,
  ClipboardList as ClipboardDocumentListIcon,
  BarChart3 as ChartBarIcon,
  Calendar as CalendarIcon,
  DollarSign as CurrencyDollarIcon,
  Settings as Cog6ToothIcon,
  LogOut as ArrowRightOnRectangleIcon,
  AlertTriangle as ExclamationTriangleIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const navigationItems = [
  {
    name: "sidebar.controlPanel",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "sidebar.operatorRequests",
    href: "/dashboard/operator-requests",
    icon: ClipboardDocumentListIcon,
  },
  {
    name: "sidebar.reservationTracking",
    href: "/dashboard/reservations",
    icon: ChartBarIcon,
  },
  {
    name: "sidebar.newRequests",
    href: "/dashboard/new-requests",
    icon: ExclamationTriangleIcon,
  },
  {
    name: "sidebar.reservations",
    href: "/dashboard/bookings",
    icon: CalendarIcon,
  },
  {
    name: "sidebar.revenues",
    href: "/dashboard/revenues",
    icon: CurrencyDollarIcon,
  },
  {
    name: "sidebar.settings",
    href: "/dashboard/settings",
    icon: Cog6ToothIcon,
  },
];

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const t = useTranslations("Dashboard");

  return (
    <div className={`bg-primary text-white w-64 min-h-screen py-6 fixed right-0 top-0 z-40 shadow-lg rounded-e-3xl transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      {/* Logo/Brand */}
      <div className="pb-4 mb-8 flex items-center gap-x-3 px-6 border-b border-neutral ">
        <Image
          src={"/logo.svg"}
          alt="logo Dirwazh "
          height={40}
          width={40}
          className="border border-primary-dark/80 rounded-lg  "
        />
        <h1 className="text-xl font-bold "> درواز</h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 px-6">
        {navigationItems.map((item) => {
          return (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center gap-x-3  px-4 py-3 rounded-lg transition-colors text-green-100 hover:bg-green-700 hover:text-white"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{t(item.name)}</span>
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-6 right-6">
        <button className="flex items-center gap-x-3  px-4 py-3 w-full text-green-100 hover:bg-green-700 hover:text-white rounded-lg transition-colors">
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span className="text-sm font-medium">{t("sidebar.logout")}</span>
        </button>
      </div>
    </div>
  );
}
