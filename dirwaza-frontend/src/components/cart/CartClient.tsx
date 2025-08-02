"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/api/config";

interface CheckoutForm {
  deliveryFee: number;
}

export default function CartClient() {
  const router = useRouter();
  const t = useTranslations("Cart");
  const { items, updateQuantity, getTotalPrice, removeItem, clearRecipientPerson } = useCartStore();
  const [form] = useState<CheckoutForm>({
    deliveryFee: 15,
  });

  const handleSubmit = () => {
    // TODO: Replace with actual API call
    clearRecipientPerson();
    router.push("/operator/payment");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">{t("empty")}</h1>
        <Button href="/operator" variant="secondary">
          {t("continueShopping")}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">{t("title")}</h1>
      <Card hasHover={false} className="p-6">
        {" "}
        <div className="space-y-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 ${
                index > 0 ? "border-t border-gray-200 pt-4" : ""
              }`}
            >
              <div className="flex-grow flex  flex-col gap-4">
                <div className="flex-grow flex-1 ">
                  <h3 className="font-medium text-lg">{item.name}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 border rounded-full border-primary-light px-2 py-1">
                    <button
                      onClick={() =>
                        item.quantity == 1
                          ? removeItem(item.id)
                          : updateQuantity(item.id, item.quantity - 1)
                      }
                      className="p-1 hover:text-primary transition-colors"
                      aria-label={t("decreaseQuantity")}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:text-primary transition-colors"
                      aria-label={t("increaseQuantity")}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-primary ml-2">
                      {item.price} {t("currency")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative h-20 w-20 flex-shrink-0">
                <Image
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          ))}

          <div className="bg-neutral p-6 rounded-2xl mt-6 space-y-2">
            <h2 className="text-xl font-bold mb-4">{t("orderSummary")}</h2>
            <div className="flex justify-between ">
              <span className="text-gray-600">{t("subtotal")}</span>
              <span className="text-primary font-semibold">
                {getTotalPrice()} {t("currency")}
              </span>
            </div>
            <div className="flex justify-between ">
              <span className="text-gray-600">{t("deliveryFee")}</span>
              <span className="text-primary font-semibold">
                {form.deliveryFee} {t("currency")}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-4 mt-4">
              <span>{t("total")}</span>
              <span className="text-primary">
                {getTotalPrice() + form.deliveryFee} {t("currency")}
              </span>
            </div>
          </div>
        </div>
      </Card>{" "}
      <Button
        onClick={handleSubmit}
        className="w-full mt-6 bg-primary text-white hover:bg-primary-dark"
      >
        {t("proceedToCheckout")}
      </Button>
    </div>
  );
}
