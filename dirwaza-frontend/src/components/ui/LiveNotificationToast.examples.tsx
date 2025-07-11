'use client';

import React, { useEffect } from 'react';
import { showNotification } from './LiveNotificationToast';

// Example 1: Basic usage
export const BasicExample = () => {
  const handleBasicNotification = () => {
    showNotification({
      title: 'Basic Notification',
      body: 'This is a simple notification message.',
      type: 'info',
    });
  };

  return (
    <button 
      onClick={handleBasicNotification}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      Show Basic Notification
    </button>
  );
};

// Example 2: Different notification types
export const TypeExamples = () => {
  const notificationTypes = [
    { type: 'success', title: 'Success!', body: 'Operation completed successfully.' },
    { type: 'error', title: 'Error', body: 'Something went wrong. Please try again.' },
    { type: 'warning', title: 'Warning', body: 'Please check your input data.' },
    { type: 'booking', title: 'New Booking', body: 'Booking #1234 has been confirmed.' },
    { type: 'payment', title: 'Payment Received', body: 'Payment of $100 has been processed.' },
    { type: 'reminder', title: 'Reminder', body: 'Your appointment is in 30 minutes.' },
  ] as const;

  return (
    <div className="space-y-2">
      {notificationTypes.map(({ type, title, body }) => (
        <button
          key={type}
          onClick={() => showNotification({ title, body, type })}
          className={`px-4 py-2 text-white rounded-lg mr-2 ${
            type === 'success' ? 'bg-green-500 hover:bg-green-600' :
            type === 'error' ? 'bg-red-500 hover:bg-red-600' :
            type === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600' :
            type === 'booking' ? 'bg-blue-500 hover:bg-blue-600' :
            type === 'payment' ? 'bg-purple-500 hover:bg-purple-600' :
            'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)} Notification
        </button>
      ))}
    </div>
  );
};

// Example 3: Custom duration and no auto-close
export const CustomDurationExample = () => {
  const handleCustomDuration = () => {
    showNotification({
      title: 'Custom Duration',
      body: 'This notification will stay for 10 seconds.',
      type: 'info',
      duration: 10000, // 10 seconds
    });
  };

  const handleNoAutoClose = () => {
    showNotification({
      title: 'Manual Close Required',
      body: 'This notification will not auto-close. Click X to dismiss.',
      type: 'warning',
      autoClose: false,
    });
  };

  return (
    <div className="space-x-2">
      <button 
        onClick={handleCustomDuration}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        10 Second Duration
      </button>
      <button 
        onClick={handleNoAutoClose}
        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
      >
        Manual Close
      </button>
    </div>
  );
};

// Example 4: Real-world booking system integration
export const BookingSystemExample = () => {
  useEffect(() => {
    // Simulate real-time booking updates
    const simulateBookingEvents = () => {
      const events = [
        {
          title: 'حجز جديد #3421',
          body: 'تم استلام حجز جديد من فهد العتيبي للاستراحة Tiny House',
          type: 'booking' as const,
          time: 'منذ ثواني',
        },
        {
          title: 'تأكيد دفع',
          body: 'تم تأكيد دفع مبلغ 1,250 ريال للطلب #2857',
          type: 'payment' as const,
          time: 'منذ دقيقة',
        },
        {
          title: 'تنبيه موعد دخول',
          body: 'موعد دخول الحجز #3419 بعد ساعة واحدة',
          type: 'reminder' as const,
          time: 'منذ 3 دقائق',
        },
      ];

      events.forEach((event, index) => {
        setTimeout(() => {
          showNotification(event);
        }, (index + 1) * 3000); // 3 seconds apart
      });
    };

    simulateBookingEvents();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Booking System Integration</h3>
      <p className="text-gray-600">
        This example shows how notifications might appear in a real booking system.
        Real-time notifications will appear automatically.
      </p>
    </div>
  );
};

// Example 5: WebSocket integration example (UI only)
export const WebSocketExample = () => {
  const simulateWebSocketConnection = () => {
    // This simulates what you would do with a real WebSocket
    const mockWebSocketEvents = [
      { type: 'user_joined', user: 'أحمد محمد' },
      { type: 'booking_cancelled', bookingId: '3420' },
      { type: 'payment_failed', orderId: '2856' },
    ];

    mockWebSocketEvents.forEach((event, index) => {
      setTimeout(() => {
        switch (event.type) {
          case 'user_joined':
            showNotification({
              title: 'مستخدم جديد',
              body: `${event.user} انضم إلى النظام`,
              type: 'info',
              time: 'الآن',
            });
            break;
          case 'booking_cancelled':
            showNotification({
              title: 'إلغاء حجز',
              body: `تم إلغاء الحجز #${event.bookingId}`,
              type: 'warning',
              time: 'الآن',
            });
            break;
          case 'payment_failed':
            showNotification({
              title: 'فشل في الدفع',
              body: `فشل في معالجة الدفع للطلب #${event.orderId}`,
              type: 'error',
              time: 'الآن',
            });
            break;
        }
      }, index * 2000);
    });
  };

  return (
    <div className="space-y-4">
      <button 
        onClick={simulateWebSocketConnection}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Simulate WebSocket Events
      </button>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Real WebSocket Integration:</h4>
        <pre className="text-sm bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
          {`useEffect(() => {
  const socket = new WebSocket('wss://your-api.com/notifications');
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    showNotification({
      title: data.title,
      body: data.message,
      type: data.type,
      time: 'الآن',
    });
  };
  
  return () => socket.close();
}, []);`}
        </pre>
      </div>
    </div>
  );
};

// Example 6: Multiple notifications stress test
export const StressTestExample = () => {
  const createMultipleNotifications = () => {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        showNotification({
          title: `إشعار رقم ${i + 1}`,
          body: `هذا هو الإشعار رقم ${i + 1} لاختبار النظام`,
          type: ['info', 'success', 'warning', 'booking', 'payment'][i % 5] as any,
          time: 'الآن',
        });
      }, i * 500); // 0.5 seconds apart
    }
  };

  return (
    <button 
      onClick={createMultipleNotifications}
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
    >
      Stress Test (8 Notifications)
    </button>
  );
};

// Complete demo component
export default function LiveNotificationToastExamples() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-6">Live Notification Toast Examples</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-3">1. Basic Usage</h2>
            <BasicExample />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">2. Different Types</h2>
            <TypeExamples />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">3. Custom Duration & Manual Close</h2>
            <CustomDurationExample />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">4. Booking System Integration</h2>
            <BookingSystemExample />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">5. WebSocket Integration</h2>
            <WebSocketExample />
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">6. Stress Test</h2>
            <StressTestExample />
          </section>
        </div>
      </div>
    </div>
  );
} 