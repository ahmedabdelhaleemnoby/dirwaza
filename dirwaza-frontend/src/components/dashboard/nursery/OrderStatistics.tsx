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
import { 
  ApiStatData,
  fetchOrderStatistics,
  mockOrderStatistics
} from '@/__mocks__/nursery.mock';

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
  const dataToUse = propData || apiData || mockOrderStatistics;
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
      icon: Warehouse,
      isNotReady: true,
    },
    {
      id: "totalOrders",
      title: t("totalOrders"),
      value: dataToUse.totalOrders.value,
      change: dataToUse.totalOrders.change,
      changeType: dataToUse.totalOrders.changeType,
      subtitle: t("thisMonth"),
      icon: BarChart3,
      isNotReady: false,
    },
    {
      id: "newOrders",
      title: t("newOrders"),
      value: dataToUse.newOrders.value,
      change: dataToUse.newOrders.change,
      changeType: dataToUse.newOrders.changeType,
      subtitle: t("awaitingReview"),
      icon: ShoppingCart,
      isNotReady: false,
    },
    {
      id: "processing",
      title: t("processing"),
      value: dataToUse.processing.value,
      change: dataToUse.processing.change,
      changeType: dataToUse.processing.changeType,
      subtitle: t("inProgress"),
      icon: Clock,
      isNotReady: true,
    },
    {
      id: "completed",
      title: t("completed"),
      value: dataToUse.completed.value,
      change: dataToUse.completed.change,
      changeType: dataToUse.completed.changeType,
      subtitle: t("delivered"),
      icon: Package,
      isNotReady: true,  
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
