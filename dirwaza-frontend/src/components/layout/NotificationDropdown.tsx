'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Bell, Calendar, Home, CreditCard, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Notification } from '@/types/notifications';
import { fetchRecentNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/mock/notificationsMockData';

interface NotificationDropdownProps {
  className?: string;
}

export default function NotificationDropdown({ className = '' }: NotificationDropdownProps) {
  const t = useTranslations('Dashboard.notifications');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent notifications
  useEffect(() => {
    loadNotifications();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const recent = await fetchRecentNotifications(5);
      setNotifications(recent);
      setUnreadCount(recent.length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === 'unread') {
      await markNotificationAsRead(notification.id);
      setUnreadCount(prev => Math.max(0, prev - 1));
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, status: 'read' as const } : n
        )
      );
    }
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, status: 'read' as const })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type: Notification['type'], priority: Notification['priority']) => {
    const iconClass = `w-4 h-4 ${priority === 'urgent' ? 'text-red-500' : priority === 'high' ? 'text-orange-500' : priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'}`;
    
    switch (type) {
      case 'booking':
        return <Calendar className={iconClass} />;
      case 'entry':
        return <Home className={iconClass} />;
      case 'exit':
        return <AlertTriangle className={iconClass} />;
      case 'payment':
        return <CreditCard className={iconClass} />;
      case 'reminder':
        return <Clock className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return t('timeAgo.now');
    if (diffInMinutes < 60) return `${t('timeAgo.ago')} ${diffInMinutes} ${diffInMinutes === 1 ? t('timeAgo.minute') : t('timeAgo.minutes')}`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${t('timeAgo.ago')} ${diffInHours} ${diffInHours === 1 ? t('timeAgo.hour') : t('timeAgo.hours')}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${t('timeAgo.ago')} ${diffInDays} ${diffInDays === 1 ? t('timeAgo.day') : t('timeAgo.days')}`;
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-r-red-500';
      case 'high':
        return 'border-r-orange-500';
      case 'medium':
        return 'border-r-yellow-500';
      default:
        return 'border-r-blue-500';
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={t('dropdown.title')}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-[999] ${!isRTL ? 'right-0' : 'left-0'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">{t('dropdown.title')}</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {t('dropdown.markAllRead')}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">{t('dropdown.noNotifications')}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-r-4 ${getPriorityColor(notification.priority)} ${
                      notification.status === 'unread' ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.priority)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <p className={`text-sm font-medium text-gray-900 line-clamp-1 ${
                            notification.status === 'unread' ? 'font-semibold' : ''
                          }`}>
                            {notification.title}
                          </p>
                          {notification.status === 'unread' && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <Link
                href="/dashboard/notifications"
                className="block w-full text-center py-2 px-4 bg-gray-50 hover:bg-gray-100 text-sm text-gray-700 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('dropdown.viewAll')}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 