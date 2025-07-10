import { getTranslations } from "next-intl/server";
import Image from "next/image";
import AdminLoginForm from "@/components/auth/AdminLoginForm";
import { Shield, Lock } from "lucide-react";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>
}) {
  const t = await getTranslations("AdminLoginPage");
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-neutral to-primary-light/50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Admin Lock Icon with Logo */}
          <div className="flex justify-center mb-6 relative">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg">
                <Image 
                  src="/logo.svg" 
                  alt="Admin Logo" 
                  width={40} 
                  height={40} 
                  className="w-10 h-10 filter brightness-0 invert" 
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-md">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-center text-primary mb-2 font-ibm-plex-sans-arabic">
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p className="text-primary/70 text-center mb-8 text-sm md:text-base font-ibm-plex-sans-arabic">
            {t("subtitle")}
          </p>

          {/* Admin Login Form */}
          <AdminLoginForm 
            error={params.error} 
            message={params.message} 
          />
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary/80 text-xs">
            <Lock className="w-3 h-3" />
            <span className="font-ibm-plex-sans-arabic">
              محمي بتشفير SSL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 