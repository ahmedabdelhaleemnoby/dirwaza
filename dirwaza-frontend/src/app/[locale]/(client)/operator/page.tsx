import { getTranslations } from "next-intl/server";
import PlantCard from "@/components/operator/PlantCard";
import { Metadata } from "next";
import Button from "@/components/ui/Button";
import { getPlantsAction } from "@/lib/api/plantActions";

// Generate dynamic metadata based on locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "OperatorPage.metadata",
  });

  const title = t("title");
  const description = t("description");
  const keywords = t("keywords");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dirwaza.com";
  const pageUrl = `${baseUrl}/${locale}/operator`;

  return {
    title,
    description,
    keywords,

    // OpenGraph metadata
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Dirwaza",
      images: [
        {
          url: `${baseUrl}/images/plants/og-plants.jpg`,
          width: 1200,
          height: 630,
          alt: title,
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
      images: [`${baseUrl}/images/plants/og-plants.jpg`],
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
        "ar-SA": `${baseUrl}/ar/operator`,
        "en-US": `${baseUrl}/en/operator`,
      },
    },

    // Additional metadata
    category: "business",
    authors: [{ name: "Dirwaza" }],
    creator: "Dirwaza",
    publisher: "Dirwaza",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

// Make page dynamic instead of static
export const dynamic = "force-dynamic";
export const revalidate = 300; // Revalidate every 5 minutes

// Error component
function PlantsError({ message }: { message: string }) {
  return (
    <section className="bg-neutral section-padding">
      <div className="container mx-auto container-padding">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-red-800 mb-2">
              خطأ في تحميل النباتات
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
      </div>
    </section>
  );
}

export default async function OperatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "OperatorPage" });

  try {
    // Fetch plants from API with SSR
    const plantsResult = await getPlantsAction({
      limit: 12, // Fetch more plants for better display
      page: 1,
      locale,
    });

    if (!plantsResult.success || !plantsResult.data) {
      throw new Error(plantsResult.error || "فشل في تحميل النباتات");
    }

    const plants = plantsResult.data.data;
    const pagination = plantsResult.data.pagination;

    return (
      <section className="bg-neutral section-padding">
        <div className="container mx-auto container-padding">
          <section className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">
              {t("title")}
            </h1>
            <p className="text-lg text-gray-600">{t("description")}</p>
          </section>

          {plants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">
                لا توجد نباتات متاحة حالياً
              </p>
              <p className="text-gray-500">يرجى المحاولة مرة أخرى لاحقاً</p>
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plants.map((plant) => (
                  <PlantCard key={plant._id} plant={plant} />
                ))}
              </section>

              {pagination.hasNext && (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-10">
                  <span className="lg:block hidden"></span>
                  <Button
                    size="lg"
                    className="bg-primary text-white w-full"
                    href={`/operator?page=${pagination.page + 1}`}
                  >
                    {t("more")}
                  </Button>
                  <span></span>
                </section>
              )}
            </>
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error("Plants page error:", error);
    return (
      <PlantsError
        message={error instanceof Error ? error.message : "حدث خطأ غير متوقع"}
      />
    );
  }
}
