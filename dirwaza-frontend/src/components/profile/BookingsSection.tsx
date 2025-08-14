"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import BookingCard from "./BookingCard";
import { BookingTabType, Booking } from "@/types/profile";

interface BookingsSectionProps {
  bookings?: Booking[];
}

interface EmptyStateContent {
  icon: React.ReactNode;
  title: string;
  message: string;
  buttonText: string;
  gradient: string;
  buttonGradient: string;
}

interface ActiveBookingsEmptyStateProps {
  content: EmptyStateContent;
  onNavigate: () => void;
}

function ActiveBookingsEmptyState({ content, onNavigate }: ActiveBookingsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 mx-auto">
      <div className={`w-full max-w-md mx-auto text-center bg-gradient-to-br ${content.gradient} rounded-3xl p-8 shadow-lg border border-white/20`}>
        {/* Icon Container */}
        <div className="w-24 h-24 mx-auto mb-6 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-sm">
          {content.icon}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 [direction:rtl]">
          {content.title}
        </h3>
        
        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed [direction:rtl]">
          {content.message}
        </p>
        
        {/* Action Button */}
        <Button 
          onClick={onNavigate}
          className={`bg-gradient-to-r ${content.buttonGradient} text-white hover:opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg px-8 py-3 rounded-xl font-medium`}
        >
          {content.buttonText}
        </Button>
      </div>
    </div>
  );
}

export default function BookingsSection({ bookings = [] }: BookingsSectionProps) {
  const t = useTranslations("ProfilePage.bookingsAndOrders");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookingTabType>("rest");

  // Helper function to determine if a booking is active (future) or previous (past)
  const isActiveBooking = (booking: Booking) => {
    // Check if booking is confirmed or pending
    // if (booking.status !== "confirmed" && booking.status !== "pending") {
    //   return false;
    // }
    
    // Parse the Arabic date format and check if it's in the future
    try {
      const bookingDate = new Date(booking.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      console.log('====================================');
      console.log(booking,'Booking Date:', bookingDate, 'Today:', today);
      console.log('====================================');
      return bookingDate >= today;
    } catch {
      // If date parsing fails, consider it active if status is confirmed or pending
      return booking.status === "confirmed" || booking.status === "pending";
    }
  };

  const activeBookings = bookings.filter(
    (booking) =>
      booking.type === activeTab &&
      isActiveBooking(booking)
  );

  const previousBookings = bookings.filter(
    (booking) => 
      booking.type === activeTab && 
      !isActiveBooking(booking)
  );

  // Navigation function based on active tab
  const navigateToBooking = () => {
    const routes = {
      rest: '/rest',
      operator: '/operator',
      training: '/training-booking'
    };
    router.push(routes[activeTab]);
  };

  // Get dynamic content based on active tab
  const getEmptyStateContent = () => {
    const content = {
      rest: {
        icon: (
          <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
        title: t("emptyState.rest.title"),
        message: t("emptyState.rest.message"),
        buttonText: t("emptyState.rest.button"),
        gradient: "from-blue-50 to-indigo-50",
        buttonGradient: "from-blue-500 to-indigo-600"
      },
      operator: {
        icon: (
          <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8m11 7a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        title: t("emptyState.operator.title"),
        message: t("emptyState.operator.message"),
        buttonText: t("emptyState.operator.button"),
        gradient: "from-green-50 to-emerald-50",
        buttonGradient: "from-green-500 to-emerald-600"
      },
      training: {
        icon: (
          <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
        title: t("emptyState.training.title"),
        message: t("emptyState.training.message"),
        buttonText: t("emptyState.training.button"),
        gradient: "from-orange-50 to-amber-50",
        buttonGradient: "from-orange-500 to-amber-600"
      }
    };
    return content[activeTab];
  };

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
            <ActiveBookingsEmptyState 
              content={getEmptyStateContent()} 
              onNavigate={navigateToBooking}
            />
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
            activeBookings.length > 0 && (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <div className="text-center bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            )
          )}
        </div>
      </Card>
    </div>
  );
}
