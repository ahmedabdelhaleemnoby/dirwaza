// app/payment-result/page.tsx
import { Check, Gift } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import Button from "@/components/ui/Button";
import { Message } from "iconoir-react";

export const metadata: Metadata = {
  title: "Payment Result",
};

export default async function PaymentResultPage() {
  const t = await getTranslations("PaymentPage.result");

  const ProductData = {
    products: [
      {
        productName: "بيت تعمان",
        price: "60",
       
      },
    ],
   
    deliveryDate: "23 مايو 2025",
    senderName: "هدى",
    receiverName: "المهدي",
    phone: "05xxxxxxxx",
    giftMessage: "إلى شخص عزيز على قلبي، شكراً لك",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        {/* حالة النجاح */}
        <div className="bg-neutral-light py-12 flex flex-col items-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-md">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-primary mb-2">
            {t("successOrder")}
          </h1>
          <p className="text-gray-600 text-sm">{t("subMessage")}</p>
        </div>

        {/* تفاصيل الحجز */}
        <div className="p-6 space-y-6">
          <div className="bg-neutral p-4 space-y-4 rounded-xl">
            <h2 className="text-lg font-bold text-center ">
              {t("productDetails")}
            </h2>

            <div className="space-y-4">
         {ProductData.products.map((product) => (<>
              <DetailRow
                label={t("productName")}
                value={product.productName}
              />
              <DetailRow
                label={t("price")}
                  value={`${product.price} ${t("currency")}`}
              />
              </>
              ))}
              <DetailRow
                label={t("deliveryDate")}
                value={ProductData.deliveryDate}
              />
            </div>
          </div>
          {/* معلومات الإهداء */}
          <div className="bg-neutral p-4 space-y-4 rounded-xl">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold  ">{t("giftInfo")}</h3>
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-4">
              <DetailRow
                label={t("senderName")}
                value={ProductData.senderName}
              />
              <DetailRow
                label={t("receiverName")}
                value={ProductData.receiverName}
              />
              <DetailRow
                label={t("phone")}
                value={ProductData.phone}
              />
            </div>
          </div>
          {/* رسالة الإهداء */}
          <div className="bg-neutral p-4 rounded-lg   space-y-6">
          <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold  ">{t("giftMessage")}</h3>
              <Message className="w-6 h-6 text-primary" />
            </div>
              <p className="p-4 bg-white border border-[#E5E7EB] rounded-2xl">
            {ProductData.giftMessage}</p>
          </div>

          {/* التنبيه */}
          <div className="bg-neutral p-4 rounded-lg   space-y-6 mt-6">
            <p className="mb-4 flex items-center r gap-2">
              {t("notifyQuestion")}
            </p>
            <div className="flex gap-4">
              <Button variant="primary" className="flex-1">
                {t("notifyYes")}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border !border-gray-300"
              >
                {t("notifyNo")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between items-center text-sm text-gray-700">
      <div className="flex items-center gap-2">
        <span>{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
}
