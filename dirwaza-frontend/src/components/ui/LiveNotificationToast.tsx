'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { X, Bell, Calendar, Home, CreditCard, AlertTriangle, Clock, CheckCircle, XCircle, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from 'next-intl';

export interface NotificationToast {
  id: string;
  title: string;
  body: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'booking' | 'entry' | 'exit' | 'payment' | 'reminder';
  time?: string;
  autoClose?: boolean;
  duration?: number; // in milliseconds
}

export interface LiveNotificationToastProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
  showTestNotification?: boolean;
}

// Global function to show notifications from anywhere in the app
let globalShowNotification: ((notification: Omit<NotificationToast, 'id'>) => void) | null = null;

export const showNotification = (notification: Omit<NotificationToast, 'id'>) => {
  if (globalShowNotification) {
    globalShowNotification(notification);
  }
};

export default function LiveNotificationToast({
  position = 'top-right',
  maxNotifications = 5,
  showTestNotification = true
}: LiveNotificationToastProps) {
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Auto-adjust position for RTL
  const adjustedPosition = isRTL ? 
    position.replace('right', 'temp').replace('left', 'right').replace('temp', 'left') as typeof position
    : position;

  const addNotification = useCallback((notificationData: Omit<NotificationToast, 'id'>) => {
    const notification: NotificationToast = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      autoClose: true,
      duration: 6000,
      type: 'info',
      time: isRTL ? 'الآن' : 'Now',
      ...notificationData,
    };

    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      // Limit the number of notifications
      return newNotifications.slice(0, maxNotifications);
    });

    // Auto-remove after specified duration
    if (notification.autoClose) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);
    }
  }, [maxNotifications, isRTL]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Set up global function
  useEffect(() => {
    globalShowNotification = addNotification;
    return () => {
      globalShowNotification = null;
    };
  }, [addNotification]);

  // Show test notification after mount
  useEffect(() => {
    if (showTestNotification) {
      const timer = setTimeout(() => {
        addNotification({
          title: isRTL ? 'حجز جديد #3421' : 'New Booking #3421',
          body: isRTL 
            ? 'تم استلام حجز جديد من فهد العتيبي للاستراحة Tiny House'
            : 'New booking received from Fahad Al-Otaibi for Tiny House',
          type: 'booking',
          time: isRTL ? 'منذ ثواني' : 'Just now',
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [addNotification, showTestNotification, isRTL]);

  const getNotificationIcon = (type: NotificationToast['type']) => {
    const iconClass = "w-5 h-5";
    
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case 'error':
        return <XCircle className={`${iconClass} text-red-600`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-yellow-600`} />;
      case 'booking':
        return <Calendar className={`${iconClass} text-blue-600`} />;
      case 'entry':
        return <Home className={`${iconClass} text-green-600`} />;
      case 'exit':
        return <AlertTriangle className={`${iconClass} text-red-600`} />;
      case 'payment':
        return <CreditCard className={`${iconClass} text-purple-600`} />;
      case 'reminder':
        return <Clock className={`${iconClass} text-orange-600`} />;
      case 'info':
      default:
        return <Bell className={`${iconClass} text-blue-600`} />;
    }
  };

  const getNotificationStyles = (type: NotificationToast['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-l-green-500 bg-green-50';
      case 'error':
        return 'border-l-4 border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50';
      case 'booking':
        return 'border-l-4 border-l-blue-500 bg-blue-50';
      case 'entry':
        return 'border-l-4 border-l-green-500 bg-green-50';
      case 'exit':
        return 'border-l-4 border-l-red-500 bg-red-50';
      case 'payment':
        return 'border-l-4 border-l-purple-500 bg-purple-50';
      case 'reminder':
        return 'border-l-4 border-l-orange-500 bg-orange-50';
      case 'info':
      default:
        return 'border-l-4 border-l-blue-500 bg-blue-50';
    }
  };

  const getPositionClasses = () => {
    switch (adjustedPosition) {
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
      default:
        return 'top-4 right-4';
    }
  };

  const getAnimationProps = () => {
    const isTop = adjustedPosition.includes('top');
    const isRight = adjustedPosition.includes('right');
    
    return {
      initial: { 
        opacity: 0, 
        y: isTop ? -20 : 20,
        x: isRight ? 20 : -20,
        scale: 0.95
      },
      animate: { 
        opacity: 1, 
        y: 0,
        x: 0,
        scale: 1
      },
      exit: { 
        opacity: 0, 
        y: isTop ? -10 : 10,
        x: isRight ? 20 : -20,
        scale: 0.95,
        transition: { duration: 0.2 }
      },
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    };
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div 
      className={`fixed ${getPositionClasses()} z-[9999] space-y-2 w-[350px] max-w-[90vw]`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            {...getAnimationProps()}
            layout
            className={`
              ${getNotificationStyles(notification.type)}
              bg-white border border-gray-200 shadow-lg rounded-xl p-4 
              flex gap-3 items-start backdrop-blur-sm
              hover:shadow-xl transition-shadow duration-200
            `}
          >
            {/* Icon */}
            <div className="flex-shrink-0 pt-0.5">
              {getNotificationIcon(notification.type)}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-tight">
                {notification.title}
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {notification.body}
              </p>
              {notification.time && (
                <span className="text-xs text-gray-500 mt-2 block">
                  {notification.time}
                </span>
              )}
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 transition-colors duration-150 group"
              aria-label={isRTL ? 'إغلاق الإشعار' : 'Close notification'}
            >
              <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 