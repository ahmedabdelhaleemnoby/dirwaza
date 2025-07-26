import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import RestDetails from '@/components/rest/RestDetails';
import StarRating from '@/components/ui/StarRating';
import BookingForm from '@/components/rest/BookingForm';
import { getRestByHrefAction } from '@/lib/api/restActions';
import { getImageUrl } from '@/lib/api/config';
import { ensureValidLocale } from '@/i18n/utils';
import RestPageClient from '@/components/rest/RestPageClient';

interface RestPageProps {
  params: Promise<{ restHref: string; locale: string }>;
}

// Generate dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ restHref: string; locale: string }>;
}): Promise<Metadata> {
  const { restHref, locale: rawLocale } = await params;
  const locale = ensureValidLocale(rawLocale);
  
  // Fetch rest data for metadata
  const restResult = await getRestByHrefAction(restHref, locale);
  
  if (!restResult.success || !restResult.data) {
    return {
      title: 'الاستراحة غير موجودة - دروازة',
      description: 'الاستراحة المطلوبة غير متوفرة حالياً',
    };
  }

  const rest = restResult.data;
  const t = await getTranslations({
    locale,
    namespace: "RestPage.metadata",
  });

  const title = `${rest.title || rest.name} - ${t("siteName")}`;
  const description = rest.description || t("defaultDescription");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dirwaza.com";
  const pageUrl = `${baseUrl}/${locale}/rest/${restHref}`;
  const mainImage = getImageUrl(rest.images?.[0] || '');

  return {
    title,
    description,
    keywords: `${rest.name}, استراحة, دروازة, ${rest.location}, الرياض`,

    // OpenGraph metadata
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Dirwaza",
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 630,
          alt: rest.title || rest.name,
        },
      ],
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },

    // Twitter Card metadata
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [mainImage],
      creator: "@dirwaza",
      site: "@dirwaza",
    },

    // Additional SEO metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    // Language alternates
    alternates: {
      canonical: pageUrl,
      languages: {
        "ar-SA": `${baseUrl}/ar/rest/${restHref}`,
        "en-US": `${baseUrl}/en/rest/${restHref}`,
      },
    },

    // Additional metadata
    category: "travel",
    authors: [{ name: "Dirwaza" }],
    creator: "Dirwaza",
    publisher: "Dirwaza",
    
    // JSON-LD structured data
    other: {
      'application/ld+json': JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        "name": rest.title || rest.name,
        "description": rest.description,
        "image": mainImage,
        "url": pageUrl,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": rest.location,
          "addressCountry": "SA"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": rest.rating,
          "ratingCount": "1"
        },
        "offers": {
          "@type": "Offer",
          "price": rest.price,
          "priceCurrency": "SAR"
        }
      })
    }
  };
}

export default async function RestPage({ params }: RestPageProps) {
  const { restHref, locale: rawLocale } = await params;
  const locale = ensureValidLocale(rawLocale || await getLocale());
  const t = await getTranslations("RestPage");
  
  // Fetch rest data on server
  const restResult = await getRestByHrefAction(restHref, locale);
  
  if (!restResult.success || !restResult.data) {
    if (restResult.error?.includes('غير موجودة') || restResult.error?.includes('404')) {
      notFound();
    }
    // For other errors, we could create an error page or notFound
    notFound();
  }

  const restData = restResult.data;
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
          <RestPageClient
            images={restData.images || []}
            restTitle={restData.title || restData.name}
            imageCount={imageCount}
            imageText={t('image')}
          />
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
          <BookingForm 
            data={restData.availability} 
            calendarId={restData._id}
            restName={restData.title || restData.name}
            restHref={restData.href}
          />
        </div>
      </div>
    </div>
  );
}
