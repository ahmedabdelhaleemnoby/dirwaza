import { 
  Home ,
  Package ,
  BarChart3,
  ShoppingCart
} from 'lucide-react';
import { useTranslations } from 'next-intl';



export default function OverviewCards() {
  const t = useTranslations('Dashboard');

  const cards = [
    {
      title: t('stats.newRequests'),
      value: 15,
      change: '+20%',
      status: t('stats.limited'),
      icon: Home,
      color: 'bg-orange-500'
    },
    {
      title: t('stats.reservations'),
      value: 8,
      change: '+20%',
      status: t('stats.todayBooking'),
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: t('stats.shipments'),
      value: 18,
      change: '+12%',
      status: t('stats.inDelivery'),
      icon: BarChart3,
      color: 'bg-yellow-500'
    },
    {
      title: t('stats.operatorRequests'),
      value: 24,
      change: '+12%',
      status: t('stats.newOrder'),
      icon: ShoppingCart,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-right">
              <h3 className="text-gray-600 text-sm font-medium mb-2">{card.title}</h3>
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="text-2xl font-bold text-gray-900">{card.value}</span>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  {card.change}
                </span>
              </div>
              <p className="text-xs text-gray-500">{card.status}</p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.color} ml-4`}>
              <card.icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};