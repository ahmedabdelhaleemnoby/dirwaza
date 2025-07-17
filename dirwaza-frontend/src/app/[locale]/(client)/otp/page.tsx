import { getTranslations } from "next-intl/server";
import Image from "next/image";
import OtpForm from "@/components/auth/OtpForm";

export default async function OTPPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const t = await getTranslations("OTPPage");
  const params = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image 
              src="/logo.webp" 
              alt="Logo" 
              width={100} 
              height={100} 
              className="w-16 h-16 rounded-xl" 
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            {t("title")}
          </h1>

          {/* OTP Form */}
          <OtpForm 
            error={params.error} 
            message={params.message} 
          />
        </div>
      </div>
    </div>
  );
} 