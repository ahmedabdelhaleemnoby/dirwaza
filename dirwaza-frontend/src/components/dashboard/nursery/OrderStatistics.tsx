import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Package,
  Clock,
  ShoppingCart,
  BarChart3,
  Warehouse,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";

interface StatData {
  id: string;
  titleKey: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative";
  subtitleKey: string;
  icon: React.ReactNode;
}

interface StatCardProps {
  stat: StatData;
  title: string;
  subtitle: string;
}

interface ApiStatData {
  completed: {
    value: number;
    change: string;
    changeType: "positive" | "negative";
  };
  processing: {
    value: number;
    change: string;
    changeType: "positive" | "negative";
  };
  newOrders: {
    value: number;
    change: string;
    changeType: "positive" | "negative";
  };
  totalOrders: {
    value: number;
    change: string;
    changeType: "positive" | "negative";
  };
  inventoryLevel: {
    value: string;
    change: string;
    changeType: "positive" | "negative";
  };
}

// Mock API function - replace with actual API call
const fetchOrderStatistics = async (): Promise<ApiStatData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock data that would come from your API
  return {
    inventoryLevel: {
      value: "85%",
      change: "-5%",
      changeType: "negative",
    },
    totalOrders: {
      value: 86,
      change: "+12%",
      changeType: "positive",
    },
    newOrders: {
      value: 24,
      change: "+8%",
      changeType: "positive",
    },
    processing: {
      value: 32,
      change: "+15%",
      changeType: "positive",
    },
    completed: {
      value: 30,
      change: "+5%",
      changeType: "positive",
    },
  };
};

export const StatCard: React.FC<StatCardProps> = ({ stat, title, subtitle }) => {
  const changeColorClass =
    stat.changeType === "positive" ? "text-emerald-600" : "text-red-500";
  const TrendIcon = stat.changeType === "positive" ? TrendingUp : TrendingDown;

  return (
    <div className="w-full min-w-[200px] max-w-[220px] shadow-sm rounded-xl bg-white h-28 sm:h-32 md:h-36 overflow-hidden shrink-0 flex flex-row items-start justify-between p-3 sm:p-4 md:p-5 box-border border border-gray-100 hover:shadow-md transition-shadow">
      {/* Icon */}
      <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12  bg-secondary rounded-lg text-white">
        {stat.icon}
      </div>
      <div className="h-full flex flex-col items-start justify-between">
        {/* Title */}
        <div className="flex flex-row items-start justify-start">
          <div className="text-gray-700 font-medium text-xs sm:text-sm md:text-base line-clamp-2">
            {title}
          </div>
        </div>

        {/* Value and Change */}
        <div className="flex flex-col items-start justify-center gap-1">
          <div className="flex flex-row items-center justify-start gap-2">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 font-mono">
              {stat.value}
            </div>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 ${changeColorClass}`}
            >
              <TrendIcon className="w-3 h-3" />
              <span className="text-xs font-medium">{stat.change}</span>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div className="flex flex-row items-start justify-start">
          <div className="text-gray-500 text-xs sm:text-sm line-clamp-1">
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderStatistics: React.FC = () => {
  const t = useTranslations("NurseryOrders");
  const [apiData, setApiData] = useState<ApiStatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchOrderStatistics();
        setApiData(data);
      } catch (err) {
        setError("Failed to load statistics");
        console.error("Error loading statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Fallback mock data if API fails
  const fallbackData: ApiStatData = {
    completed: {
      value: 30,
      change: "+5%",
      changeType: "positive",
    },
    processing: {
      value: 32,
      change: "+15%",
      changeType: "positive",
    },
    newOrders: {
      value: 24,
      change: "+8%",
      changeType: "positive",
    },
    totalOrders: {
      value: 86,
      change: "+12%",
      changeType: "positive",
    },
    inventoryLevel: {
      value: "85%",
      change: "-5%",
      changeType: "negative",
    },
  };

  const dataToUse = apiData || fallbackData;

  const statsData: StatData[] = [
    {
      id: "inventoryLevel",
      titleKey: "inventoryLevel",
      value: dataToUse.inventoryLevel.value,
      change: dataToUse.inventoryLevel.change,
      changeType: dataToUse.inventoryLevel.changeType,
      subtitleKey: "ofTotalCapacity",
      icon: <Warehouse className="w-5 h-5" />,
    },
    {
      id: "totalOrders",
      titleKey: "totalOrders",
      value: dataToUse.totalOrders.value,
      change: dataToUse.totalOrders.change,
      changeType: dataToUse.totalOrders.changeType,
      subtitleKey: "thisMonth",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: "newOrders",
      titleKey: "newOrders",
      value: dataToUse.newOrders.value,
      change: dataToUse.newOrders.change,
      changeType: dataToUse.newOrders.changeType,
      subtitleKey: "awaitingReview",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      id: "processing",
      titleKey: "processing",
      value: dataToUse.processing.value,
      change: dataToUse.processing.change,
      changeType: dataToUse.processing.changeType,
      subtitleKey: "inProgress",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: "completed",
      titleKey: "completed",
      value: dataToUse.completed.value,
      change: dataToUse.completed.change,
      changeType: dataToUse.completed.changeType,
      subtitleKey: "delivered",
      icon: <Package className="w-5 h-5" />,
    },
  ];

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-40">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading statistics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-40">
          <div className="text-red-500 text-center">
            <p>Error loading statistics</p>
            <p className="text-sm text-gray-500 mt-1">Using fallback data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
        {statsData.map((stat) => (
          <StatCard
            key={stat.id}
            stat={stat}
            title={t(stat.titleKey)}
            subtitle={t(stat.subtitleKey)}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderStatistics;
