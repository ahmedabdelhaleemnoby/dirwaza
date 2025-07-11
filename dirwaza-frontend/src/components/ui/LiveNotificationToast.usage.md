# LiveNotificationToast Usage Guide

## 🚀 Quick Start

The `LiveNotificationToast` component is already integrated into the `DashboardLayout` and ready to use!

### Basic Usage

```typescript
import { showNotification } from '@/components/ui';

// Simple notification
showNotification({
  title: 'Success!',
  body: 'Operation completed successfully.',
  type: 'success'
});
```

## 📋 Features

✅ **Auto-dismiss after 5-6 seconds** (configurable)  
✅ **Manual dismiss** with close button  
✅ **Multiple notification types** with colored icons  
✅ **Smooth Framer Motion animations**  
✅ **RTL support** (Auto-adjusts for Arabic)  
✅ **Position control** (top-right, top-left, etc.)  
✅ **Maximum notifications limit**  
✅ **Custom duration** per notification  
✅ **Easy WebSocket/API integration**  

## 🎯 Notification Types

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| `success` | ✅ CheckCircle | Green | Successful operations |
| `error` | ❌ XCircle | Red | Error messages |
| `warning` | ⚠️ AlertTriangle | Yellow | Warnings |
| `info` | 🔔 Bell | Blue | General information |
| `booking` | 📅 Calendar | Blue | Booking updates |
| `entry` | 🏠 Home | Green | Entry notifications |
| `exit` | ⚠️ AlertTriangle | Red | Exit notifications |
| `payment` | 💳 CreditCard | Purple | Payment updates |
| `reminder` | ⏰ Clock | Orange | Reminders |

## 🛠️ API Reference

### `showNotification(data)`

```typescript
interface NotificationToast {
  title: string;              // Required: Notification title
  body: string;               // Required: Notification message
  type?: 'success' | 'error' | 'warning' | 'info' | 'booking' | 'entry' | 'exit' | 'payment' | 'reminder';
  time?: string;              // Optional: Custom timestamp (e.g., "منذ 5 دقائق")
  autoClose?: boolean;        // Optional: Auto-dismiss (default: true)
  duration?: number;          // Optional: Duration in milliseconds (default: 6000)
}
```

### Component Props

```typescript
interface LiveNotificationToastProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';  // Default: 'top-right'
  maxNotifications?: number;        // Default: 5
  showTestNotification?: boolean;   // Default: true
}
```

## 📱 Usage Examples

### 1. Basic Success Notification
```typescript
showNotification({
  title: 'تم الحفظ بنجاح',
  body: 'تم حفظ التغييرات الخاصة بك.',
  type: 'success'
});
```

### 2. Error with Custom Duration
```typescript
showNotification({
  title: 'خطأ في الاتصال',
  body: 'فشل في الاتصال بالخادم. يرجى المحاولة مرة أخرى.',
  type: 'error',
  duration: 10000, // 10 seconds
  autoClose: false  // Requires manual close
});
```

### 3. Real-time Booking Notification
```typescript
showNotification({
  title: 'حجز جديد #3421',
  body: 'تم استلام حجز جديد من فهد العتيبي للاستراحة Tiny House',
  type: 'booking',
  time: 'منذ ثواني'
});
```

### 4. Payment Confirmation
```typescript
showNotification({
  title: 'تأكيد دفع',
  body: 'تم تأكيد دفع مبلغ 1,250 ريال للطلب #2857',
  type: 'payment',
  time: 'الآن'
});
```

## 🌐 WebSocket Integration

```typescript
// Real WebSocket example
useEffect(() => {
  const socket = new WebSocket('wss://your-api.com/notifications');
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    showNotification({
      title: data.title,
      body: data.message,
      type: data.type || 'info',
      time: 'الآن'
    });
  };
  
  return () => socket.close();
}, []);
```

## 🔧 Custom Configuration

### Change Position
```typescript
// In DashboardLayout.tsx
<LiveNotificationToast 
  position="top-left"          // Change position
  maxNotifications={3}         // Limit to 3 notifications
  showTestNotification={false} // Disable test notification
/>
```

### Multiple Notifications
```typescript
// Show multiple notifications at once
const showMultipleNotifications = () => {
  showNotification({ title: 'First', body: 'Message 1', type: 'info' });
  showNotification({ title: 'Second', body: 'Message 2', type: 'success' });
  showNotification({ title: 'Third', body: 'Message 3', type: 'warning' });
};
```

## 🎨 Styling

The component uses **TailwindCSS** classes and automatically adapts to:
- **RTL/LTR direction** based on locale
- **Color schemes** based on notification type  
- **Responsive design** for mobile/desktop
- **High z-index** (`z-[9999]`) to appear above all content

## 🚀 Integration in Different Pages

### In any React component:
```typescript
import { showNotification } from '@/components/ui';

const MyComponent = () => {
  const handleSaveData = async () => {
    try {
      await saveData();
      showNotification({
        title: 'نجح الحفظ',
        body: 'تم حفظ البيانات بنجاح',
        type: 'success'
      });
    } catch (error) {
      showNotification({
        title: 'خطأ في الحفظ',
        body: 'حدث خطأ أثناء حفظ البيانات',
        type: 'error'
      });
    }
  };

  return <button onClick={handleSaveData}>Save</button>;
};
```

### In API/Service functions:
```typescript
// services/api.ts
import { showNotification } from '@/components/ui';

export const createBooking = async (bookingData) => {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
    
    if (response.ok) {
      showNotification({
        title: 'تم إنشاء الحجز',
        body: `تم إنشاء الحجز رقم ${response.data.id} بنجاح`,
        type: 'booking'
      });
    }
  } catch (error) {
    showNotification({
      title: 'فشل في إنشاء الحجز',
      body: 'حدث خطأ أثناء إنشاء الحجز',
      type: 'error'
    });
  }
};
```

## 🔄 Production Ready Features

- ✅ **TypeScript support** with full type safety
- ✅ **Performance optimized** with `useCallback` and proper cleanup
- ✅ **Memory leak prevention** with timeout cleanup
- ✅ **Accessibility** with proper ARIA labels
- ✅ **Mobile responsive** design
- ✅ **Production build tested** and verified
- ✅ **Easy to extend** for future push notification systems

## 📦 Build Results

```
✓ Compiled successfully
├ ● /[locale]/dashboard (includes LiveNotificationToast) 1.61 kB
└ Total build size: ~3.2KB additional (including Framer Motion)
```

---

🎉 **Ready to use!** The component is now fully integrated and production-ready. You can start showing notifications immediately using `showNotification()` from anywhere in your app. 