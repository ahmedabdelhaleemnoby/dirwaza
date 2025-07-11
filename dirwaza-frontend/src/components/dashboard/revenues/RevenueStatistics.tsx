"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { DollarSign, Building, Activity } from "lucide-react";
import StatisticsGrid from "@/components/ui/StatisticsGrid";
import { RevenueStatistics as RevenueStatisticsType } from "@/types/revenues";
import { fetchRevenueStatistics } from "@/mock/revenuesMockData";

interface RevenueStatisticsProps {
  data?: RevenueStatisticsType;
  loading?: boolean;
  error?: string | null;
}

export default function RevenueStatistics({
  data: propData,
  loading: propLoading,
  error: propError,
}: RevenueStatisticsProps) {
  const t = useTranslations("Revenues.statistics");
  const [apiData, setApiData] = useState<RevenueStatisticsType | null>(null);
  const [loading, setLoading] = useState(!propData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propData) return; // Don't fetch if data is provided via props

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchRevenueStatistics();
        setApiData(data);
      } catch (err) {
        setError("Failed to load revenue statistics");
        console.error("Error loading revenue statistics:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [propData]);

  const dataToUse = propData || apiData;
  const loadingState = propLoading !== undefined ? propLoading : loading;
  const errorState = propError !== undefined ? propError : error;

  // Format statistics for StatisticsGrid
  const statistics = React.useMemo(() => {
    if (!dataToUse) return [];

    return [
      {
        id: "total",
        title: t("totalRevenues"),
        value: `${dataToUse.totalRevenues.value.toLocaleString()} ${t(
          "currency"
        )}`,
        change: dataToUse.totalRevenues.change,
        changeType: dataToUse.totalRevenues.changeType,
        subtitle: t("comparedToLastMonth"),
        icon: <DollarSign className="w-5 h-5" />,
      },
      {
        id: "rest",
        title: t("restRevenues"),
        value: `${dataToUse.restRevenues.value.toLocaleString()} ${t(
          "currency"
        )}`,
        change: dataToUse.restRevenues.change,
        changeType: dataToUse.restRevenues.changeType,
        subtitle: t("comparedToLastMonth"),
        icon: <Building className="w-5 h-5" />,
      },

      {
        id: "nursery",
        title: t("nurseryRevenues"),
        value: `${dataToUse.nurseryRevenues.value.toLocaleString()} ${t(
          "currency"
        )}`,
        change: dataToUse.nurseryRevenues.change,
        changeType: dataToUse.nurseryRevenues.changeType,
        subtitle: t("comparedToLastMonth"),
        icon: <Building className="w-5 h-5" />,
      },

      {
        id: "equestrian",
        title: t("equestrianRevenues"),
        value: `${dataToUse.equestrianRevenues.value.toLocaleString()} ${t(
          "currency"
        )}`,
        change: dataToUse.equestrianRevenues.change,
        changeType: dataToUse.equestrianRevenues.changeType,
        subtitle: t("comparedToLastMonth"),
        icon: <Activity className="w-5 h-5" />,
      },
    ];
  }, [dataToUse, t]);

  if (errorState) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="text-center py-8">
          <p className="text-red-600">Error loading revenue statistics</p>
        </div>
      </div>
    );
  }

  return (
    <StatisticsGrid
      data={statistics}
      loading={loadingState}
      isTrend={false}
      // className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    />
  );
}
