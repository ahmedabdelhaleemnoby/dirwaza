import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Card from "../ui/Card";
import Button from "../ui/Button";

interface PlantCardProps {
  plant: {
    id: number;
    name: string;
    nameEn: string;
    price: number;
    image: string;
    description: string;
    descriptionEn: string;
    isAvailable: boolean;
    isOnSale?: boolean;
    originalPrice?: number;
  };
}

const PlantCard: React.FC<PlantCardProps> = ({ plant }) => {
  const t = useTranslations("OperatorPage.plants");

  return (
    <Card className="flex flex-col h-full  border-primary-light border-2 ">
      <div className="relative h-64 w-full">
        <Image
          src={plant.image}
          alt={plant.name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow relative">
        {plant.isOnSale && (
          <div className="absolute top-4 end-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
            {t("sale", { value: 15 })}
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
        <div className="flex gap-2">
          <Button size="md" className="flex-1  ">
            {t("addToCart")}
          </Button>
          <Button
            variant="outline"
            size="md"
            href="/operator/gift-form"
            className="flex-1 border-primary-light "
          >
            {t("sendAsGift")}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PlantCard;
