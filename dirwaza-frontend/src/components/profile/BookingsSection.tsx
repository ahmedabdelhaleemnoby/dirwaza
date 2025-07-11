"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import BookingCard from "./BookingCard";
import { BookingTabType } from "@/types/profile";
import { mockProfileBookings } from "@/__mocks__/bookings.mock";

export default function BookingsSection() {
  const t = useTranslations("ProfilePage.bookingsAndOrders");
  const [activeTab, setActiveTab] = useState<BookingTabType>("rest");

  const activeBookings = mockProfileBookings.filter(
    (booking) =>
      booking.type === activeTab &&
      (booking.status === "confirmed" || booking.status === "pending") &&
      // Filter out past bookings - this is a simple mock filter
      booking.id !== "3" && booking.id !== "6" && booking.id !== "9"
  );

  const previousBookings = mockProfileBookings.filter(
    (booking) => 
      booking.type === activeTab && 
      // Mock previous bookings with specific IDs
      (booking.id === "3" || booking.id === "6" || booking.id === "9")
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
          {activeBookings.length > 0 ? (
            activeBookings.map((booking) => (
              <div
                key={booking.id}
                className="items-start pt-4 pb-0 px-0 flex-[0_0_auto] inline-flex relative w-full"
              >
                <BookingCard booking={booking} />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2 [direction:rtl]">
                  {t("emptyState.noActiveBookings")}
                </h3>
                <p className="text-gray-500 mb-4 [direction:rtl]">
                  {t("emptyState.noActiveBookingsMessage")}
                </p>
                <Button 
                  variant="primary" 
                  className="bg-primary text-white hover:bg-primary/90"
                >
                  {t("emptyState.startBooking")}
                </Button>
              </div>
            </div>
          )}

          {/* Previous Bookings Header - Only show if there are previous bookings */}
          {previousBookings.length > 0 && (
            <div className="items-start pt-4 pb-0 px-0 flex-[0_0_auto] inline-flex relative w-full">
              <div className="flex w-full items-start justify-start relative">
                <div className="w-[114.5px] flex items-center justify-start relative">
                  <div className="font-medium text-gray-800 text-base leading-6 relative w-fit mt-[-1.00px] tracking-[0] whitespace-nowrap [direction:rtl]">
                    {t("previousBookings")}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Previous Bookings List */}
          {previousBookings.length > 0 ? (
            previousBookings.map((booking) => (
              <div
                key={booking.id}
                className="items-start pt-4 pb-0 px-0 flex-[0_0_auto] mb-[-16.00px] inline-flex relative w-full"
              >
                <div className="opacity-70">
                  <BookingCard booking={booking} showActions={false} />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-base font-medium text-gray-700 mb-1 [direction:rtl]">
                  {t("emptyState.noPreviousBookings")}
                </h4>
                <p className="text-sm text-gray-500 [direction:rtl]">
                  {t("emptyState.noPreviousBookingsMessage")}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
