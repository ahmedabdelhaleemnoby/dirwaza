import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Truck } from 'lucide-react';
import ComingSoon from '@/components/ui/ComingSoon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Dashboard.shipmentTracking' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function ShipmentTrackingPage() {
  const t = useTranslations('Dashboard.shipmentTracking');

  return (
    <div className="min-h-screen" dir="rtl">
      <ComingSoon
        title={t('title')}
        message={t('comingSoon')}
        description={t('description')}
        icon={<Truck className="w-12 h-12 md:w-16 md:h-16 text-white" />}
        expectedLaunch={t('expectedLaunch')}
        backUrl="/dashboard"
        backLabel={t('backToDashboard')}
        className="rtl"
      />
    </div>
  );
} 