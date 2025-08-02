"use client";
import { Check, Gift } from "lucide-react";
import Button from "@/components/ui/Button";
import { Message } from "iconoir-react";
import { Input } from "@/components/ui";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
const data = {
  products: [
    {
      plantId: "6869647883db4f542814541b",
      productName: "نبات الدفنباخية",
      price: 60,
      quantity: 1,
      totalPrice: 60,
    },
  ],
  deliveryDate: "",
  senderName: "Mohamed Hasan Ahmed Ibrahim",
  receiverName: "Wayne Sykes",
  phone: "01550003860",
  giftMessage: "",
};

type ProductDataProps = {
  plantId: string;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
};
type PaymentResultProps = {
  products: ProductDataProps[];
  deliveryDate: string;
  senderName: string;
  receiverName: string;
  phone: string;
  giftMessage: string;
};

export default function PaymentResultPage() {
  const t = useTranslations("PaymentPage.result");
  const [ProductData, setProductData] = useState<PaymentResultProps>(data);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    const paymentResult = localStorage.getItem("paymentResult-operator");
    const ProductData = JSON.parse(paymentResult || "{}");
    console.log(ProductData, "ProductData");
    setProductData(ProductData ?? data);
    setMessage(ProductData?.giftMessage ?? data.giftMessage);
  }, []);
  const handleSubmitNotify = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataMessage = {
      giftMessage: message,
      notify: true
    };
    localStorage.setItem("paymentResult-operator", JSON.stringify(dataMessage));
    router.push("/operator");
  }

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
              {ProductData?.products?.map((product: ProductDataProps) => (
                <>
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
                value={ProductData?.deliveryDate}
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
                value={ProductData?.senderName}
              />
              <DetailRow
                label={t("receiverName")}
                value={ProductData?.receiverName}
              />
              <DetailRow label={t("phone")} value={ProductData?.phone} />
            </div>
          </div>
          {/* رسالة الإهداء */}
          <form onSubmit={handleSubmitNotify}>
          <div className="bg-neutral p-4 rounded-lg   space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold  ">{t("giftMessage")}</h3>
              <Message className="w-6 h-6 text-primary" />
            </div>
            <Input
              name="giftMessage"
              value={message}
              className="w-full"
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* التنبيه */}
          <div className="bg-neutral p-4 rounded-lg   space-y-6 mt-6">
            <p className="mb-4 flex items-center r gap-2">
              {t("notifyQuestion")}
            </p>
            <div className="flex gap-4">
              <Button
                variant="primary"
                className="flex-1"
                type="submit"
             
              >
                {t("notifyYes")}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border !border-gray-300"
                onClick={() => {
                  localStorage.removeItem("paymentResult-operator");
                  router.push("/operator");
                }}
              >
                {t("notifyNo")}
              </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm text-gray-700">
      <div className="flex items-center gap-2">
        <span>{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
}
