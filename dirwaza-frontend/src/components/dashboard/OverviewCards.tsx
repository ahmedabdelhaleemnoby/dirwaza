import { getOverviewCards } from '@/__mocks__/dashboard.mock';
import { useTranslations } from "next-intl";

export default function OverviewCards() {
  const t = useTranslations("Dashboard");

  const cards = getOverviewCards(t);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm p-2 border border-gray-100"
        >
          <div className="flex  gap-2 flex-col justify-between">
            {/* Icon */}
            <div className="flex items-center gap-2 justify-between">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center bg-secondary flex-shrink-0`}
              >
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-gray-800 text-sm font-medium ">
                {card.title}
              </h3>
            </div>

            <span className="text-2xl font-bold text-gray-900">
              {card.value}
            </span>
            {/* Content */}
            <div className="flex-1 flex items-center justify-between">
              <p className={`text-xs font-medium ${card.statusColor}`}>
                {card.status}
              </p>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                {card.change}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
