import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Card from "../ui/Card";
import PlantCardActions from "./PlantCardActions";
import { Plant } from "@/lib/api/plantActions";
import { getImageUrl } from "@/lib/api/config";

interface PlantCardProps {
  plant: Plant;
}

export default function PlantCard({ plant }: PlantCardProps) {
  const t = useTranslations("OperatorPage.plants");

  // Calculate discount percentage if on sale
  const discountPercentage = plant.isOnSale && plant.originalPrice 
    ? Math.round(((plant.originalPrice - plant.price) / plant.originalPrice) * 100)
    : plant.discountPercent || 0;

  return (
    <Card className="flex flex-col h-full border-primary-light border-2 disabled:opacity-50 " disabled={!plant.isAvailable}>
      <div className="relative h-64 w-full">
        <Image
          src={getImageUrl(plant.image)||"/images/service3.svg"}
          alt={plant.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {!plant.isAvailable && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {t("notAvailable")}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow relative">
        {plant.isOnSale && (
          <div className="absolute top-4 end-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            {t("sale", { value: discountPercentage })}
          </div>
        )}
        <h3 className="text-xl font-semibold mb-2">{plant.name}</h3>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            {plant.isOnSale && plant.originalPrice && (
              <span className="text-gray-400 line-through">
                {plant.originalPrice} {t("currency")}
              </span>
            )}
            <span className="text-xl font-bold text-red-500">
              {plant.price} {t("currency")}
            </span>
          </div>
        </div>
        <p className="text-gray-600 mb-4 flex-grow">{plant.description}</p>
        
        <PlantCardActions plant={plant} />
      </div>
    </Card>
  );
}
