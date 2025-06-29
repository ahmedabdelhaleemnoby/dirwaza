"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import { Booking } from "@/types/profile";
import Image from "next/image";
import { CalendarIcon,  TimerIcon, X } from "lucide-react";

interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
}

export default function BookingCard({
  booking,
  showActions = true,
}: BookingCardProps) {
  const t = useTranslations("ProfilePage.bookingsAndOrders");

  const getStatusBadge = (status: "confirmed" | "pending"|"cancelled"|"completed") => {
    if (status === "confirmed") {
      return (
        <div className="w-[39.3px] h-6 justify-start px-2 py-1 bg-[#d7f9ff] rounded-full flex items-center relative">
          <div className="ml-[-0.70px] font-normal text-[#113218] text-xs leading-4 relative w-fit mt-[-1.00px] tracking-[0] whitespace-nowrap [direction:rtl]">
            {t("confirmed")}
          </div>
        </div>
      );
    } else if (status === "pending") {
      return (
        <div className="w-[69.16px] h-6 justify-start px-2 py-1 bg-[#827db7] rounded-full flex items-center relative">
          <div className="ml-[-0.84px] font-normal text-white text-xs leading-4 relative w-fit mt-[-1.00px] tracking-[0] whitespace-nowrap [direction:rtl]">
            {t("pending")}
          </div>
        </div>
      );
    } else if (status === "cancelled") {
      return (
          <div className="w-[69.16px] h-6 justify-start px-2 py-1 bg-[#db2525] rounded-full flex items-center relative">
          <div className="ml-[-0.84px] font-normal text-white text-xs leading-4 relative w-fit mt-[-1.00px] tracking-[0] whitespace-nowrap [direction:rtl]">
            {t("cancelled")}
          </div>
        </div>
      );
    } else if (status === "completed") {
      return (
        <div className="w-[69.16px] h-6 justify-start px-2 p  y-1 bg-[#113218] rounded-full flex items-center relative">
          <div className="ml-[-0.84px] font-normal text-white text-xs leading-4 relative w-fit mt-[-1.00px] tracking-[0] whitespace-nowrap [direction:rtl]">
            {t("completed")}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex w-full h-[130px] items-start justify-start gap-4 p-[17px] relative rounded-2xl border border-solid border-[#e4e7eb]">
      <Image
        className="max-w-full w-32 h-24 relative object-cover object-center border-4 border-white rounded-lg"
        alt={booking.title}
        src={booking.image}
        width={128}
        height={96}
      />
      <div className="flex flex-col w-[510px] h-24 items-start relative">
        <div className="relative w-full flex  justify-between">
          {/* Status and Cancel Button */}
          <div className="flex flex-col w-auto  items-start gap-2">
            <div className="w-auto flex  items-center justify-start relative">
              <div className="relative w-fit mt-[-1.00px] font-bold text-gray-800 text-base text-right tracking-[0] leading-6 whitespace-nowrap">
                {booking.title}
              </div>
            </div>
            <div className="w-auto flex items-center justify-start relative">
              <div className="ml-[-0.52px] font-normal text-[#4a5462] text-sm leading-5 relative w-fit mt-[-1.00px] tracking-[0] whitespace-nowrap [direction:rtl]">
                {booking.location}
              </div>
            </div>
          </div>
          {showActions && (
            <div className="flex w-auto h-6 items-center justify-start gap-2 ms-auto">
              <Button
                variant="ghost"
                size="sm"
                className=" items-center justify-start gap-1 flex relative"
              >
                <div className=" justify-center text-[#db2525]  gap-2 flex items-center relative">
                  <X className="w-4 h-4 " />
                  <div className="font-medium  text-sm text-center leading-5 relative w-fit tracking-[0] whitespace-nowrap ">
                    {t("cancel")}
                  </div>
                </div>
              </Button>
              {getStatusBadge(booking.status)}
            </div>
          )}

          {/* Title and Location */}
        </div>

        {/* Date and Time */}
        <div className="items-start pt-3 pb-0 px-0 flex-[0_0_auto] inline-flex ">
          <div className="flex-wrap w-[510px] items-start gap-[16px_16px] flex h-5 justify-start relative">
          

            {/* Date */}
            <div className="w-auto items-center gap-1 flex h-5 justify-start relative">
                <CalendarIcon className='w-4 h-4 text-[#374050]   ' />
                <div className=" relative w-fit mt-[-1.00px] font-normal text-[#374050] text-sm tracking-[0] leading-5 whitespace-nowrap [direction:rtl]">
                  {booking.date}
                </div>
             
            </div>
              {/* Time */}
          
              <div className="w-auto text-[#374050] justify-start gap-2 flex items-center relative">
            <TimerIcon className='w-4 h-4 text-[#374050]   ' />
                <p className=" font-normal text-[#374050] text-sm leading-5 relative w-fit tracking-[0] whitespace-nowrap ">
                  {booking.time}
                </p>
              </div>
          </div>
        </div>
      </div>

    </div>
  );
}
