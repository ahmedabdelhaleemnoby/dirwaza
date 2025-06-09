import { 
  User as UserIcon
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TaskItemProps {
  title: string;
  priority: string;
  priorityColor: string;
  date: string;
}

function TaskItem({ title, priority, priorityColor, date }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-3">
        <input type="checkbox" className="h-4 w-4 text-green-600 rounded border-gray-300" />
        <div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityColor}`}>
        {priority}
      </span>
    </div>
  );
}

interface OrderRowProps {
  client: string;
  service: string;
  date: string;
  status: string;
  statusColor: string;
  avatar?: string;
}

function OrderRow({ client, service, date, status, statusColor, avatar }: OrderRowProps) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            {avatar ? (
              <img className="h-8 w-8 rounded-full" src={avatar} alt={client} />
            ) : (
              <UserIcon className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">{client}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{service}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}

export default function TasksAndOrders() {
  const t = useTranslations('Dashboard');

  const tasks = [
    {
      title: t('tasks.confirmReservationBooking'),
      priority: t('tasks.urgent'),
      priorityColor: 'bg-red-100 text-red-800',
      date: t('tasks.today')
    },
    {
      title: t('tasks.processNewPropertyDocs'),
      priority: t('tasks.today'),
      priorityColor: 'bg-yellow-100 text-yellow-800',
      date: t('tasks.today')
    },
    {
      title: t('tasks.updateWebsiteForNewBatch'),
      priority: t('tasks.tomorrow'),
      priorityColor: 'bg-blue-100 text-blue-800',
      date: t('tasks.tomorrow')
    },
    {
      title: t('tasks.updateMaintenanceSchedule'),
      priority: t('tasks.tomorrow'),
      priorityColor: 'bg-blue-100 text-blue-800',
      date: t('tasks.tomorrow')
    }
  ];

  const recentOrders = [
    {
      client: 'Sarah Ahmed',
      service: 'The Long',
      date: 'Jul 23, 2025',
      status: t('recentOrders.confirmed'),
      statusColor: 'bg-green-100 text-green-800'
    },
    {
      client: 'Mohammad Khalid',
      service: 'Property Consultation',
      date: 'Jul 23, 2025',
      status: t('recentOrders.pending'),
      statusColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      client: 'Nora Ahmed',
      service: 'Garden Planning',
      date: 'Jul 23, 2025',
      status: t('recentOrders.delivered'),
      statusColor: 'bg-green-100 text-green-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tasks Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{t('tasks.title')}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {t('tasks.urgent')}
          </span>
        </div>
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <TaskItem key={index} {...task} />
          ))}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('recentOrders.title')}</h3>
        <div className="overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('recentOrders.client')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('recentOrders.service')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('recentOrders.date')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('recentOrders.status')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order, index) => (
                <OrderRow key={index} {...order} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 