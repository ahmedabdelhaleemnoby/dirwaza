import PaymentStatus from "@/components/payment/PaymentStatus";
import BackButton from "@/components/ui/BackButton";
import { useTranslations } from "next-intl";

export default function BookingDetailsLoading() {
    const t = useTranslations("PaymentPage.result");
    
    return (
      <div className="container mx-auto max-w-lg px-4 py-8 space-y-4">
        <BackButton label={t("returnToHome")} />
        <div className="space-y-6 bg-white rounded-xl shadow-sm">
          <PaymentStatus
            message={t("loading") || "جاري التحميل..."}
            subMessage={t("loadingSubMessage") || "يرجى الانتظار"}
          />
          <div className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  