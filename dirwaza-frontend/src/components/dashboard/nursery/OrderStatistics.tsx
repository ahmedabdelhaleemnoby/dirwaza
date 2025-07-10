import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Package,
  Clock,
  ShoppingCart,
  BarChart3,
  Warehouse,
} from "lucide-react";
import StatisticsGrid, { StatData } from '@/components/ui/StatisticsGrid';

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

interface OrderStatisticsProps {
  data?: ApiStatData;
  loading?: boolean;
  error?: string | null;
}

const OrderStatistics: React.FC<OrderStatisticsProps> = ({
  data: propData,
  loading: propLoading,
  error: propError
}) => {
  const t = useTranslations("NurseryOrders");
  const [apiData, setApiData] = useState<ApiStatData | null>(null);
  const [loading, setLoading] = useState(!propData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propData) return; // Don't fetch if data is provided via props

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
  }, [propData]);

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

  const dataToUse = propData || apiData || fallbackData;
  const loadingState = propLoading !== undefined ? propLoading : loading;
  const errorState = propError !== undefined ? propError : error;

  const statsData: StatData[] = [
    {
      id: "inventoryLevel",
      title: t("inventoryLevel"),
      value: dataToUse.inventoryLevel.value,
      change: dataToUse.inventoryLevel.change,
      changeType: dataToUse.inventoryLevel.changeType,
      subtitle: t("ofTotalCapacity"),
      icon: <Warehouse className="w-5 h-5" />,
    },
    {
      id: "totalOrders",
      title: t("totalOrders"),
      value: dataToUse.totalOrders.value,
      change: dataToUse.totalOrders.change,
      changeType: dataToUse.totalOrders.changeType,
      subtitle: t("thisMonth"),
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: "newOrders",
      title: t("newOrders"),
      value: dataToUse.newOrders.value,
      change: dataToUse.newOrders.change,
      changeType: dataToUse.newOrders.changeType,
      subtitle: t("awaitingReview"),
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      id: "processing",
      title: t("processing"),
      value: dataToUse.processing.value,
      change: dataToUse.processing.change,
      changeType: dataToUse.processing.changeType,
      subtitle: t("inProgress"),
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: "completed",
      title: t("completed"),
      value: dataToUse.completed.value,
      change: dataToUse.completed.change,
      changeType: dataToUse.completed.changeType,
      subtitle: t("delivered"),
      icon: <Package className="w-5 h-5" />,
    },
  ];

  return (
    <StatisticsGrid
      data={statsData}
      loading={loadingState}
      error={errorState}
      loadingMessage="Loading statistics..."
      errorMessage="Error loading statistics"
      className=" "
    />
  );
};

export default OrderStatistics;
