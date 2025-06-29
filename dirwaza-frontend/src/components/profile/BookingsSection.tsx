"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import BookingCard from "./BookingCard";
import { Booking, BookingTabType } from "@/types/profile";

const mockBookings: Booking[] = [
  {
    id: "1",
    title: "The Green",
    location: "اللؤلؤة، الدوحة",
    date: "21 يونيو 2025",
    time: "من 4:00 م إلى 12:00 ص",
    status: "confirmed",
    image: "/images/resort1.jpg",
    type: "rest",
  },
  {
    id: "2",
    title: "The Long",
    location: "اللؤلؤة، الدوحة",
    date: "28 يونيو 2025",
    time: "من 2:00 م إلى 10:00 م",
    status: "pending",
    image: "/images/resort2.jpg",
    type: "rest",
  },
  {
    id: "3",
    title: "Tiny House",
    location: "اللؤلؤة، الدوحة",
    date: "15 مايو 2025",
    time: "من 6:00 م إلى 2:00 ص",
    status: "confirmed",
    image: "/images/resort3.jpg",
    type: "rest",
  },
];

export default function BookingsSection() {
  const t = useTranslations("ProfilePage.bookingsAndOrders");
  const [activeTab, setActiveTab] = useState<BookingTabType>("rest");

  const activeBookings = mockBookings.filter(
    (booking) =>
      booking.type === activeTab &&
      (booking.status === "confirmed" || booking.status === "pending")
  );

  const previousBookings = mockBookings.filter(
    (booking) => booking.type === activeTab && booking.id === "3" // Mock previous booking
  );

  return (
    <div className="inline-flex items-start pt-0 pb-6 px-0 relative flex-[0_0_auto] w-full">
      <Card hasHover={false} className="flex flex-col w-full h-auto items-start p-6 relative bg-white rounded-2xl shadow-[0px_4px_4px_#00000040]">
        {/* Section Title */}
        <div className="inline-flex items-start pt-0 pb-6 px-0 relative flex-[0_0_auto]">
          <div className="w-full flex h-7 items-center justify-start relative">
            <div className="relative w-fit mt-[-1.00px] font-bold text-gray-800 text-2xl tracking-[0] leading-7 whitespace-nowrap [direction:rtl]">
              {t("title")}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="inline-flex items-start pt-0 pb-6 px-0 relative flex-[0_0_auto]">
          <div className="flex w-full h-11 items-start justify-start p-1 relative bg-[#f2f4f5] rounded-full">
            <Button
              variant={activeTab === "rest" ? "primary" : "ghost"}
              className={`flex w-[226.67px] h-9 items-center justify-center px-4 py-2 relative !rounded-full ${
                activeTab === "rest"
                  ? "!bg-[#febd01] text-white"
                  : "text-[#374050]"
              }`}
              onClick={() => setActiveTab("rest")}
            >
              {t("tabs.rest")}
            </Button>{" "}
            <Button
              variant={activeTab === "operator" ? "primary" : "ghost"}
              className={`flex w-[226.67px] h-9 items-center justify-center px-4 py-2 relative !rounded-full ${
                activeTab === "operator"
                  ? "!bg-[#febd01] text-white"
                  : "text-[#374050]"
              }`}
              onClick={() => setActiveTab("operator")}
            >
              {t("tabs.operator")}
            </Button>{" "}
            <Button
              variant={activeTab === "training" ? "primary" : "ghost"}
              className={`flex w-[226.67px] h-9 items-center justify-center px-4 py-2 relative ml-[-0.02px] !rounded-full ${
                activeTab === "training"
                  ? "!bg-[#febd01] text-white"
                  : "text-[#374050]"
              }`}
              onClick={() => setActiveTab("training")}
            >
              {t("tabs.training")}
            </Button>
          </div>
        </div>

        {/* Bookings Content */}
        <div className="flex flex-col w-full h-auto items-start relative">
          {/* Active Bookings Header */}
          <div className="items-start pt-0 pb-4 px-0 flex-[0_0_auto] inline-flex relative w-full">
            <div className="flex w-full items-start justify-between relative">
              <div className=" flex items-center justify-start relative">
                <div className="font-medium text-gray-800 text-base leading-6 relative w-fit mt-[-1.00px] tracking-[0] whitespace-nowrap [direction:rtl]">
                  {t("activeBookings")}
                </div>
              </div>{" "}
              <Button
                variant="ghost"
                size="sm"
                className=" items-start justify-center flex relative text-[#113218] text-sm text-center"
              >
                {t("viewAll")}
              </Button>
            </div>
          </div>

          {/* Active Bookings List */}
          {activeBookings.map((booking) => (
            <div
              key={booking.id}
              className="items-start pt-4 pb-0 px-0 flex-[0_0_auto] inline-flex relative w-full"
            >
              <BookingCard booking={booking} />
            </div>
          ))}

          {/* Previous Bookings Header */}
          <div className="items-start pt-4 pb-0 px-0 flex-[0_0_auto] inline-flex relative w-full">
            <div className="flex w-full items-start justify-start relative">
              <div className="w-[114.5px] flex items-center justify-start relative">
                <div className="font-medium text-gray-800 text-base leading-6 relative w-fit mt-[-1.00px] tracking-[0] whitespace-nowrap [direction:rtl]">
                  {t("previousBookings")}
                </div>
              </div>
            </div>
          </div>

          {/* Previous Bookings List */}
          {previousBookings.map((booking) => (
            <div
              key={booking.id}
              className="items-start pt-4 pb-0 px-0 flex-[0_0_auto] mb-[-16.00px] inline-flex relative w-full"
            >
              <div className="opacity-70">
                <BookingCard booking={booking} showActions={false} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
