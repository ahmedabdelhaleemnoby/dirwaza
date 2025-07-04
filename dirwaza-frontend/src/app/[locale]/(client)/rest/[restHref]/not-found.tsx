import Button from '@/components/ui/Button';

export default async function NotFound() {

  return (
    <div className="container mx-auto container-padding py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="text-6xl mb-6">🏠</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          الاستراحة غير موجودة
        </h1>
        <p className="text-gray-600 mb-8">
          عذراً، الاستراحة التي تبحث عنها غير متاحة أو قد تكون قد تم حذفها.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/rest" variant="primary">
            تصفح جميع الاستراحات
          </Button>
          <Button href="/" variant="outline">
            العودة للرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
} 