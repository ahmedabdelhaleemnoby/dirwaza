'use client';

import { useTranslations } from "next-intl";
import Button from "../ui/Button";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-hot-toast";
import { Plant } from "@/lib/api/plantActions";

interface PlantCardActionsProps {
  plant: Plant;
}

export default function PlantCardActions({ plant }: PlantCardActionsProps) {
  const t = useTranslations("OperatorPage.plants");
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: plant._id,
      name: plant.name,
      nameEn: plant.nameEn,
      price: plant.price,
      image: plant.image,
      isOnSale: plant.isOnSale,
      originalPrice: plant.originalPrice,
    });
    toast.success(t('addedToCart'));
  };

  return (
    <div className="flex gap-2">
      <Button size="md" className="flex-1" onClick={handleAddToCart}  disabled={!plant.isAvailable}>
        {t("addToCart")}
      </Button>
      <Button
        variant="outline"
        size="md"
        href="/operator/gift-form"
        className="flex-1 border-primary-light"
        disabled={!plant.isAvailable}
      >
        {t("sendAsGift")}
      </Button>
    </div>
  );
} 