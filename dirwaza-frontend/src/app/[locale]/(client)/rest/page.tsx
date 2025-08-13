import React, { Suspense } from 'react';
import { getLocale } from 'next-intl/server';
import { getRestsAction } from '@/lib/api/restActions';
import RestCard from '@/components/rest/RestCard';
import { ensureValidLocale } from '@/i18n/utils';
import Button from '@/components/ui/Button';
// Loading component
function RestsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 h-60 rounded-t-2xl"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Error component
function RestsError({ message }: { message: string }) {
  return (
    <div className="text-center py-16">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <h3 className="text-lg font-medium text-red-800 mb-2">
          خطأ في تحميل الاستراحات
        </h3>
        <p className="text-red-600 text-sm">{message}</p>
       
        <Button 
        variant="outline"
        href="/"
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
       
        >
       الذهاب للصفحة الرئيسية
        </Button>
      </div>
    </div>
  );
}

// Empty state component
function EmptyRests() {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">
          لا توجد استراحات متاحة حالياً
        </h3>
        <p className="text-gray-600">
          نعمل على إضافة المزيد من الاستراحات المميزة قريباً
        </p>
      </div>
    </div>
  );
}

// Main server component
export default async function RestPage() {
  // Get current locale
  const rawLocale = await getLocale();
  const locale = ensureValidLocale(rawLocale);

  // Fetch rests data with SSR
  const restsResult = await getRestsAction({ 
    locale,
    limit: 12 // Default limit
  });


  // Handle API errors
  //  throw new Error("خطأ في تحميل الاستراحات") 
  if (!restsResult.success || !restsResult.data) {
    return (
      <section className="bg-neutral section-padding">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16 flex flex-col items-center gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              استراحات دروازة
            </h2>
            <p className="text-primary-dark">
              اختر من بين استراحاتنا المميزة لقضاء أوقات لا تُنسى مع العائلة والأصدقاء
            </p>
          </div>
          <RestsError message={restsResult.message || 'حدث خطأ غير متوقع'} />
        </div>
      </section>
    );
  }

  const { rests, pagination } = restsResult.data;
console.log(rests,"rests");

  // Handle empty state
  if (!rests || rests.length === 0) {
    return (
      <section className="bg-neutral section-padding">
        <div className="container mx-auto container-padding">
          <div className="text-center mb-16 flex flex-col items-center gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              استراحات دروازة
            </h2>
            <p className="text-primary-dark">
              اختر من بين استراحاتنا المميزة لقضاء أوقات لا تُنسى مع العائلة والأصدقاء
            </p>
          </div>
          <EmptyRests />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-neutral section-padding">
      <div className="container mx-auto container-padding">
        {/* Header Section */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            استراحات دروازة
          </h2>
          <p className="text-primary-dark">
            اختر من بين استراحاتنا المميزة لقضاء أوقات لا تُنسى مع العائلة والأصدقاء
          </p>
          
         
          
        </div>

        {/* Rests Grid */}
        <Suspense fallback={<RestsSkeleton />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rests.map((rest, index) => (
              <RestCard 
                key={rest._id} 
                rest={rest} 
                priority={index < 3} // Prioritize loading first 3 images
              />
            ))}
          </div>
        </Suspense>

        {/* Pagination Info */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600">
                الصفحة {pagination.currentPage} من {pagination.totalPages}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Generate metadata for SEO
export async function generateMetadata() {
  const locale = await getLocale();
  
  return {
    title: locale === 'ar' ? 'استراحات دروازة | اختر استراحتك المثالية' : 'Dirwaza Rests | Choose Your Perfect Rest',
    description: locale === 'ar' 
      ? 'اكتشف أفضل الاستراحات في الرياض مع دروازة. استراحات مجهزة بالكامل للعائلات والأصدقاء'
      : 'Discover the best rests in Riyadh with Dirwaza. Fully equipped rests for families and friends',
    openGraph: {
      title: locale === 'ar' ? 'استراحات دروازة' : 'Dirwaza Rests',
      description: locale === 'ar' 
        ? 'اختر من بين استراحاتنا المميزة لقضاء أوقات لا تُنسى'
        : 'Choose from our premium rests for unforgettable moments',
      type: 'website',
    }
  };
}