import { 
  CheckCircle as CheckCircleIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getNewRequestsItems, getReservationsItems } from '@/__mocks__/dashboard.mock';
import PeriodButton from './PeriodButton';

interface ActivityItemProps {
  title: string;
  subtitle: string;
  time: string;
  status: string;
  statusColor: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

function ActivityItem({ title, subtitle, time, status, statusColor, icon: Icon }: ActivityItemProps) {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-light transition-colors">
      <div className="w-10 h-10 bg-[#DED8C2] rounded-lg flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{title}</h4>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className="text-right">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {status}
        </span>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}

interface ActivitySectionProps {
  title: string;
  badge: string;
  badgeColor: string;
  items: Array<{
    title: string;
    subtitle: string;
    time: string;
    status: string;
    statusColor: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }>;
}

function ActivitySection({ title, items }: ActivitySectionProps) {
  const t = useTranslations('Dashboard');

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
       <div className="flex items-center gap-2">
      
        <PeriodButton periodKey="today" isSelected={true}>
            {t("financialTransactions.today")}
          </PeriodButton>
          <PeriodButton periodKey="week" isSelected={false}>
            {t("financialTransactions.week")}
          </PeriodButton>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <ActivityItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function ActivitySections() {
  const t = useTranslations('Dashboard');

  const newRequestsItems = getNewRequestsItems(t);
  const reservationsItems = getReservationsItems(t);

  const operatorRequestsItems = [
    {
      title: t('operatorRequestsSection.flowers'),
      subtitle: '12345# ' + t('recentOrders.client'),
      time: t('operatorRequestsSection.today'),
      status: t('reservationsSection.pending'),
      statusColor: 'bg-purple-100 text-purple-800',
      icon: CheckCircleIcon
    },
    {
      title: t('operatorRequestsSection.plants'),
      subtitle: '12346# ' + t('recentOrders.client'),
      time: t('operatorRequestsSection.today'),
      status: t('recentOrders.delivered'),
      statusColor: 'bg-green-100 text-green-800',
      icon: CheckCircleIcon
    },
    {
      title: t('operatorRequestsSection.architecturalPlants'),
      subtitle: '12347# ' + t('recentOrders.client'),
      time: t('operatorRequestsSection.today'),
      status: t('recentOrders.delivered'),
      statusColor: 'bg-green-100 text-green-800',
      icon: CheckCircleIcon
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <ActivitySection
        title={t('newRequestsSection.title')}
        badge={t('newRequestsSection.today')}
        badgeColor="bg-red-100 text-red-800"
        items={newRequestsItems}
      />
      <ActivitySection
        title={t('reservationsSection.title')}
        badge={t('reservationsSection.today')}
        badgeColor="bg-red-100 text-red-800"
        items={reservationsItems}
      />
      <ActivitySection
        title={t('operatorRequestsSection.title')}
        badge={t('operatorRequestsSection.today')}
        badgeColor="bg-red-100 text-red-800"
        items={operatorRequestsItems}
      />
    </div>
  );
} 