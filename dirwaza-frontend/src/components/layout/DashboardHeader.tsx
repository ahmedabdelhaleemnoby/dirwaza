"use client";

// import { useState } from 'react';
import { Menu, Search, User } from "lucide-react";
import { useTranslations } from "next-intl";
import NotificationDropdown from './NotificationDropdown';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const t = useTranslations("Dashboard");

  // const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notification Dropdown */}
          <NotificationDropdown />

          {/* User menu */}
          <div className="relative">
            <button
              // onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {t("user.name")}
                </p>
                {/* <p className="text-xs text-gray-500">مدير النظام</p> */}
              </div>{" "}
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </button>
            {/* 
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  الملف الشخصي
                </button>
                <button className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  إعدادات الحساب
                </button>
                <hr className="my-1" />
                <button className="block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  {t('sidebar.logout')}
                </button>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </header>
  );
}
