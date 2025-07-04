'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useLogout } from '@/hooks/api/useAuth';
import { useAuthState } from '@/hooks/api/useAuthState';
import { ChevronDown, User, LogOut } from 'lucide-react';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { user, isLoading } = useAuthState();
  const logoutMutation = useLogout();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-1">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        <div className="hidden md:block w-16 h-4 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logoutMutation.logout();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 transition-colors"
      >
        {/* Profile Image */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name || 'User'}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={20} className="text-gray-400" />
          )}
        </div>

        {/* User Name - Hidden on mobile */}
        <div className="hidden md:block text-right ltr:text-left">
          <div className="text-sm font-medium text-gray-900 leading-tight max-w-24 truncate">
            {user.name}
          </div>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown 
          size={16} 
          className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 ltr:right-auto ltr:left-0 mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user?.phone}
              </div>
            </div>

            {/* Profile Option */}
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium order-2 ltr:order-1">الملف الشخصي</span>
              <User size={16} className="text-gray-500 order-1 ltr:order-2" />
            </Link>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Logout Option */}
            <button
              onClick={handleLogout}
              disabled={logoutMutation.loading}
              className="w-full flex items-center justify-start ltr:justify-start gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <span className="text-sm font-medium order-2 ltr:order-1">
                {logoutMutation.loading ? 'جاري تسجيل الخروج...' : 'تسجيل خروج'}
              </span>
              <LogOut size={16} className="text-red-500 order-1 ltr:order-2" />
            </button>
          </div>
        </>
      )}
    </div>
  );
} 