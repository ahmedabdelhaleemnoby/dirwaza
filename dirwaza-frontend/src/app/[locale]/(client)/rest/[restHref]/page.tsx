'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import RestDetails from '@/components/rest/RestDetails';
import StarRating from '@/components/ui/StarRating';
import { Image as ImageIcon } from 'lucide-react';
import BookingForm from '@/components/rest/BookingForm';
import ImageGalleryModal from '@/components/rest/ImageGalleryModal';
import { getRestByHrefAction, type Rest } from '@/lib/api/restActions';
import { getImageUrl } from '@/lib/api/config';
import { ensureValidLocale } from '@/i18n/utils';

interface RestPageProps {
  params: Promise<{ restHref: string; locale: string }>;
}

// Loading component
function RestPageSkeleton() {
  return (
    <div className="container mx-auto container-padding py-8">
      <div className="animate-pulse">
        <div className="bg-gray-200 h-[500px] rounded-lg mb-8"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
}

// Error component
function RestError({ message }: { message: string }) {
  return (
    <div className="container mx-auto container-padding py-16">
      <div className="text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            خطأ في تحميل بيانات الاستراحة
          </h3>
          <p className="text-red-600 text-sm">{message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RestPage({ params }: RestPageProps) {
  const [restData, setRestData] = useState<Rest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  const locale = useLocale();
  const t = useTranslations('RestPage');

  useEffect(() => {
    async function fetchRestData() {
      try {
        setLoading(true);
        setError(null);
        
        // Await the params
        const { restHref, locale: rawLocale } = await params;
        const validLocale = ensureValidLocale(rawLocale || locale);
        
        // Fetch rest data
        const restResult = await getRestByHrefAction(restHref, validLocale);
        
        if (!restResult.success || !restResult.data) {
          if (restResult.error?.includes('غير موجودة') || restResult.error?.includes('404')) {
            notFound();
          }
          throw new Error(restResult.message || 'حدث خطأ غير متوقع');
        }
        
        setRestData(restResult.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    }

    fetchRestData();
  }, [params, locale]);

  const openGallery = () => {
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  if (loading) {
    return <RestPageSkeleton />;
  }

  if (error) {
    return <RestError message={error} />;
  }

  if (!restData) {
    return notFound();
  }

  const mainImage = getImageUrl(restData.images?.[0] || '');
  const imageCount = restData.images?.length || 0;

  return (
    <div className="">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden mb-8">
        <Image
          src={mainImage}
          alt={restData.title || restData.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-4 container-padding flex justify-between items-center w-full">
          <button
            onClick={openGallery}
            className="bg-white px-3 py-1 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1">
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm">
                {imageCount} {t('image')}
              </span>
            </span>
          </button>
          <div className="bg-white px-3 py-1 rounded-lg">
            <span className="flex items-center gap-1">
              <StarRating
                rating={restData.rating}
                readonly={true}
                size="md"
              />
            </span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto container-padding">
        <div className="grid gap-8">
          {/* Left Column - Details */}
          <div className="space-y-8">
            <RestDetails data={restData} />
          </div>

          {/* Right Column - Booking Form */}
          <BookingForm data={restData.availability} />
        </div>
      </div>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={closeGallery}
        images={restData.images || []}
        restTitle={restData.title || restData.name}
        initialIndex={0}
      />
    </div>
  );
}
