import { Home as HomeIcon } from 'lucide-react';
import NotFound from '@/components/ui/NotFound';

export default async function RestNotFound() {
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