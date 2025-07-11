'use client';

import { useTranslations } from 'next-intl';
import { Users } from 'lucide-react';
import ComingSoon from '@/components/ui/ComingSoon';

export default function CustomerManagementPage() {
  const t = useTranslations('Dashboard.customerManagement');

  return (
    <div className="min-h-screen" dir="rtl">
      <ComingSoon
        title={t('title')}
        message={t('comingSoon')}
        description={t('description')}
        icon={<Users className="w-12 h-12 md:w-16 md:h-16 text-white" />}
        expectedLaunch={t('expectedLaunch')}
        backUrl="/dashboard"
        backLabel={t('backToDashboard')}
        className="rtl"
      />
    </div>
  );
}
