'use client';

import { useTranslations } from "next-intl";
import Button from "../ui/Button";
import { useCartStore } from "@/store/cartStore";
import { toast } from "react-hot-toast";
import { Plant } from "@/lib/api/plantActions";
import { useRouter } from "@/i18n/navigation";

interface PlantCardActionsProps {
  plant: Plant;
}

export default function PlantCardActions({ plant }: PlantCardActionsProps) {
  const t = useTranslations("OperatorPage.plants");
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const addOneItem = useCartStore((state) => state.addOneItem);
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

  const handleAddToCartOne = () => {
    addOneItem({
      id: plant._id,
      name: plant.name,
      nameEn: plant.nameEn,
      price: plant.price,
      image: plant.image,
      isOnSale: plant.isOnSale,
      originalPrice: plant.originalPrice,
    });
    toast.success(t('addedToCart'));
    router.push('/operator/gift-form');
  };
  return (
    <div className="flex gap-2">
      <Button size="md" className="flex-1" onClick={handleAddToCart}  disabled={!plant.isAvailable}>
        {t("addToCart")}
      </Button>
      <Button
        variant="outline"
        size="md"
        className="flex-1 border-primary-light"
        disabled={!plant.isAvailable}
        onClick={handleAddToCartOne}
      >
        {t("sendAsGift")}
      </Button>
    </div>
  );
} 