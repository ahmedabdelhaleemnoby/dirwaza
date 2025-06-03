import { useTranslations } from 'next-intl';
// import StatsCard from '@/components/dashboard/StatsCard';

export default function Dashboard() {
  const t = useTranslations('Dashboard');
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* <StatsCard 
          title={t('stats.bookings')}
          value={12}
          icon="calendar"
        />
        <StatsCard 
          title={t('stats.products')}
          value={5}
          icon="box"
        />
        <StatsCard 
          title={t('stats.revenue')}
          value="$1,250"
          icon="dollar"
        /> */}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{t('recentBookings')}</h2>
        {/* Booking list would go here */}
      </div>
    </div>
  );
}