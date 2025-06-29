"use client";

import { useTranslations } from "next-intl";
import Card from "@/components/ui/Card";

import Image from "next/image";
import { User } from "@/lib/auth";
import { Lock } from "lucide-react";

interface ProfileHeaderProps {
  user?: Partial<User>;
}

export default function ProfileHeader({
  user = {
    name: "User-111",
    phone: "+966 50 123 4567",
    image: "/icons/profile.svg",
  },
}: ProfileHeaderProps) {
  const t = useTranslations("ProfilePage");

  return (
    <div className="inline-flex items-start pt-0 pb-6 px-0 relative flex-[0_0_auto] w-full">
      <Card hasHover={false} className="flex flex-col w-full h-auto items-start p-6 relative bg-white rounded-[20px] overflow-hidden shadow-[0px_4px_4px_#00000040]">
        {/* Edit Button */}

        {/* Welcome Text */}
        <div className="inline-flex items-start pt-0 pb-6 px-0 relative flex-[0_0_auto]">
          <div className="flex flex-col w-full h-12 items-start relative">
            <div className="w-full h-7 flex items-center justify-start relative">
              <div className="relative w-fit mt-[-1.00px] font-medium text-[#113218] text-lg tracking-[0] leading-7 whitespace-nowrap [direction:rtl]">
                {t("welcome")}
              </div>
            </div>
            <div className="w-full h-5 flex items-center justify-start relative">
              <p className="relative w-fit mt-[-1.00px] font-normal text-[#113218] text-sm tracking-[0] leading-5 whitespace-nowrap [direction:rtl]">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col w-full h-[200px] items-center relative mb-[-7.00px]">
          {/* Profile Picture */}
          <div className="items-start pt-0 pb-4 px-0 flex-[0_0_auto] inline-flex relative">
              <div className="flex flex-col w-24 h-24 items-center justify-center p-1 relative ">
                <Image
                className=" w-[88px] h-[88px] relative object-cover object-center border-4 border-white rounded-full shadow-[0px_4px_6px_-1px_#0000001a,0px_2px_4px_-2px_#0000001a]"
                alt="Profile"
                src={user.image || "/icons/profile.svg"}
                width={88}
                height={88}
              />
            </div>
          </div>

          {/* User Name */}
          <div className="h-[35px] items-center justify-center pt-0 pb-1 px-0 inline-flex relative">
            <div className="flex w-[149.45px] h-8 items-center justify-around relative mt-[-0.50px] mb-[-0.50px]">
              <div className="relative w-fit mt-[-1.00px] font-bold text-gray-800 text-2xl text-right tracking-[0] leading-8 whitespace-nowrap">
                {user.name || "User-111"}
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div className="items-start pt-1 pb-0 px-0 flex-[0_0_auto] inline-flex relative">
            <div className="flex w-[152.8px] h-6 items-center justify-center gap-2 relative">
              <div className="w-[128.8px] h-6 justify-center flex items-center relative">
                <div className="flex w-4 h-4 items-center justify-center relative">
                  <Lock className="w-4 h-4" />
                </div>{" "}
                <div
                  dir="ltr"
                  className="relative w-fit mt-[-1.00px]  font-normal text-[#4a5462] text-base text-right tracking-[0] leading-6 whitespace-nowrap"
                >
                  {user.phone || "+966 50 123 4567"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
