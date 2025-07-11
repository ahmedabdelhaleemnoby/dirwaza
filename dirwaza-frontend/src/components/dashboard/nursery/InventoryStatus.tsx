import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  Plus,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { 
  Plant,
  InventoryApiData,
  fetchInventoryData,
  mockInventoryData
} from '@/__mocks__/nursery.mock';

interface PlantItemProps {
  plant: Plant;
  locale: string;
}

interface InventorySectionProps {
  title: string;
  count: number;
  plants: Plant[];
  isAvailable: boolean;
  onViewAll: () => void;
  locale: string;
}

const PlantItem: React.FC<PlantItemProps> = ({ plant, locale }) => {
  const t = useTranslations("NurseryOrders");
  const isRTL = locale === "ar";

  return (
    <div className="w-full rounded-2xl bg-neutral-light h-16 sm:h-18 md:h-20 flex flex-row items-center justify-between p-3 sm:p-4 box-border border border-orange-100 hover:shadow-sm transition-shadow">
      {/* Left side - Action button or price */}

      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Image
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg object-cover flex-shrink-0"
          alt={isRTL ? plant.name : plant.nameEn}
          src={plant.image}
          width={64}
          height={64}
        />
        <div className="flex flex-col items-start justify-center min-w-0 flex-1">
          <div className="text-sm sm:text-base font-medium text-gray-800 truncate w-full text-right">
            {isRTL ? plant.name : plant.nameEn}
          </div>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 w-full justify-start">
            <span className="truncate">
              {isRTL ? plant.status : plant.statusEn}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center min-w-0">
        {plant.isAvailable ? (
          <div className="text-sm sm:text-base font-medium text-gray-800">
            {plant.price} {t("currency")}
          </div>
        ) : (
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary-light text-black text-xs sm:text-sm">
            {t("supplyRequest")}
          </button>
        )}
      </div>

      {/* Right side - Plant info and image */}
    </div>
  );
};

const InventorySection: React.FC<InventorySectionProps> = ({
  title,
  count,
  plants,
  isAvailable,
  onViewAll,
  locale,
}) => {
  const t = useTranslations("NurseryOrders");
  const statusColorClass = isAvailable ? "bg-[#827DB7]" : "bg-red-500";

  return (
    <div className="w-full max-w-2xl rounded-2xl bg-gray-50 min-h-[300px] sm:min-h-[350px] flex flex-col p-4 sm:p-5 box-border border border-gray-200">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 text-right">
          {title}
        </h3>
        <div
          className={`${statusColorClass} text-white px-2 py-1 rounded-sm text-xs sm:text-sm font-medium`}
        >
          {count} {t("type")}
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors text-sm"
        >
          {t("viewAll")}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Plants List */}
      <div className="flex flex-col gap-3 flex-1">
        {plants.map((plant) => (
          <PlantItem key={plant.id} plant={plant} locale={locale} />
        ))}
      </div>
    </div>
  );
};

const InventoryStatus: React.FC = () => {
  const t = useTranslations("NurseryOrders");
  const [inventoryData, setInventoryData] = useState<InventoryApiData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get locale from URL or context
  const locale =
    typeof window !== "undefined"
      ? window.location.pathname.includes("/ar")
        ? "ar"
        : "en"
      : "ar";

  useEffect(() => {
    const loadInventoryData = async () => {
      try {
        setLoading(true);
        const data = await fetchInventoryData();
        setInventoryData(data);
      } catch (err) {
        setError("Failed to load inventory data");
        console.error("Error loading inventory:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInventoryData();
  }, []);

  const dataToUse = inventoryData || mockInventoryData;

  const handleViewAll = (section: "available" | "unavailable") => {
    console.log(`View all ${section} plants`);
    // Implement navigation to full inventory page
  };

  const handleAddNewPlant = () => {
    console.log("Add new plant");
    // Implement add new plant functionality
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-40">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading inventory...</span>
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
            <p>Error loading inventory</p>
            <p className="text-sm text-gray-500 mt-1">Using fallback data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="shadow-sm rounded-2xl bg-white overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 text-center sm:text-right">
            {t("inventoryStatus")}
          </h2>
          <button
            onClick={handleAddNewPlant}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base font-medium"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            {t("addNewPlant")}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Available Plants */}
            <InventorySection
              title={t("availablePlants")}
              count={dataToUse.totalAvailable}
              plants={dataToUse.availablePlants}
              isAvailable={true}
              onViewAll={() => handleViewAll("available")}
              locale={locale}
            />
            {/* Unavailable Plants */}
            <InventorySection
              title={t("unavailablePlants")}
              count={dataToUse.totalUnavailable}
              plants={dataToUse.unavailablePlants}
              isAvailable={false}
              onViewAll={() => handleViewAll("unavailable")}
              locale={locale}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryStatus;
