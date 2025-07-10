/**
 * NotFound Component Usage Examples
 * 
 * This file demonstrates different ways to use the reusable NotFound component
 * across various contexts in the application.
 */

import { 
  FileX, 
  Settings, 
  Home as HomeIcon, 
  ShoppingCart,
  User,
  Calendar,
  Package,
  Truck
} from 'lucide-react';
import NotFound from './NotFound';

// ===========================================
// EXAMPLE 1: Basic Dashboard Not Found
// ===========================================
export function DashboardNotFound() {
  return (
    <NotFound
      context="dashboard"
      icon={<Settings className="w-12 h-12 md:w-16 md:h-16 text-white" />}
    />
  );
}

// ===========================================
// EXAMPLE 2: General Page Not Found
// ===========================================
export function GeneralNotFound() {
  return (
    <NotFound
      context="general"
      icon={<FileX className="w-12 h-12 md:w-16 md:h-16 text-white" />}
    />
  );
}

// ===========================================
// EXAMPLE 3: Custom Rest/Accommodation Not Found
// ===========================================
export function RestNotFound() {
  return (
    <NotFound
      context="general"
      title="الاستراحة غير موجودة"
      message="عذراً، الاستراحة التي تبحث عنها غير متاحة"
      description="الاستراحة التي تبحث عنها غير متاحة أو قد تكون قد تم حذفها."
      icon={<HomeIcon className="w-12 h-12 md:w-16 md:h-16 text-white" />}
      primaryAction={{
        label: "تصفح جميع الاستراحات",
        href: "/rest"
      }}
      secondaryAction={{
        label: "العودة للرئيسية",
        href: "/"
      }}
      suggestions={[
        "تحقق من رابط الاستراحة",
        "تصفح الاستراحات المتاحة",
        "تواصل معنا للمساعدة",
        "العودة للصفحة الرئيسية"
      ]}
    />
  );
}

// ===========================================
// EXAMPLE 4: E-commerce Product Not Found
// ===========================================
export function ProductNotFound() {
  return (
    <NotFound
      context="general"
      title="المنتج غير موجود"
      message="المنتج الذي تبحث عنه غير متاح"
      description="قد يكون المنتج قد نفذ من المخزون أو تم إيقافه مؤقتاً."
      icon={<Package className="w-12 h-12 md:w-16 md:h-16 text-white" />}
      primaryAction={{
        label: "تصفح المنتجات",
        href: "/operator"
      }}
      secondaryAction={{
        label: "سلة التسوق",
        href: "/cart"
      }}
      suggestions={[
        "تصفح منتجات مشابهة",
        "تحقق من سلة التسوق",
        "البحث عن منتجات أخرى",
        "تواصل مع الدعم"
      ]}
    />
  );
}

// ===========================================
// EXAMPLE 5: User Profile Not Found
// ===========================================
export function UserNotFound() {
  return (
    <NotFound
      context="general"
      title="المستخدم غير موجود"
      message="لم نتمكن من العثور على هذا المستخدم"
      description="المستخدم قد يكون قام بحذف حسابه أو أن الرابط غير صحيح."
      icon={<User className="w-12 h-12 md:w-16 md:h-16 text-white" />}
      primaryAction={{
        label: "البحث عن مستخدمين",
        href: "/users"
      }}
      secondaryAction={{
        label: "ملفي الشخصي",
        href: "/profile"
      }}
      showSuggestions={false}
    />
  );
}

// ===========================================
// EXAMPLE 6: Coming Soon Feature (Dashboard)
// ===========================================
export function FeatureComingSoon() {
  return (
    <NotFound
      context="dashboard"
      title="الميزة قيد التطوير"
      message="هذه الميزة ستكون متاحة قريباً في النسخة 2.0"
      description="نحن نعمل بجد لتطوير هذه الميزة وتقديم أفضل تجربة لك."
      icon={<Calendar className="w-12 h-12 md:w-16 md:h-16 text-white" />}
      primaryAction={{
        label: "العودة إلى لوحة التحكم",
        href: "/dashboard"
      }}
      suggestions={[
        "قيد التطوير",
        "قادمة قريباً",
        "النسخة القادمة",
        "ترقبوا التحديثات"
      ]}
    />
  );
}

// ===========================================
// EXAMPLE 7: Order/Shipment Not Found
// ===========================================
export function OrderNotFound() {
  return (
    <NotFound
      context="general"
      title="الطلب غير موجود"
      message="لم نتمكن من العثور على رقم الطلب المطلوب"
      description="رقم الطلب قد يكون غير صحيح أو أن الطلب قد تم إلغاؤه."
      icon={<Truck className="w-12 h-12 md:w-16 md:h-16 text-white" />}
      primaryAction={{
        label: "طلباتي",
        href: "/profile"
      }}
      secondaryAction={{
        label: "طلب جديد",
        href: "/operator"
      }}
      suggestions={[
        "تحقق من رقم الطلب",
        "راجع طلباتك السابقة",
        "تواصل مع خدمة العملاء",
        "ابدأ طلب جديد"
      ]}
    />
  );
}

// ===========================================
// USAGE GUIDELINES
// ===========================================

/**
 * BASIC USAGE:
 * 
 * 1. Dashboard Context:
 *    <NotFound context="dashboard" />
 * 
 * 2. General Context:
 *    <NotFound context="general" />
 * 
 * CUSTOMIZATION OPTIONS:
 * 
 * - title: Custom page title
 * - message: Main message to display
 * - description: Detailed description
 * - icon: Custom icon component
 * - primaryAction: { label, href } for main action button
 * - secondaryAction: { label, href } for secondary action button
 * - suggestions: Array of suggestion strings
 * - showSuggestions: Boolean to show/hide suggestions
 * - className: Additional CSS classes
 * 
 * RESPONSIVE DESIGN:
 * - Automatically adapts to mobile, tablet, and desktop
 * - RTL support for Arabic language
 * - Proper font handling for Arabic text
 * 
 * ANIMATIONS:
 * - Smooth fade-in animations
 * - Interactive hover effects
 * - Staggered suggestion animations
 * 
 * ACCESSIBILITY:
 * - Proper semantic HTML
 * - ARIA labels where needed
 * - Keyboard navigation support
 */

export default {
  DashboardNotFound,
  GeneralNotFound,
  RestNotFound,
  ProductNotFound,
  UserNotFound,
  FeatureComingSoon,
  OrderNotFound
}; 