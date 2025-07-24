import { ReactNode } from "react";

import BookingProvider from "@/components/booking/BookingProvider";

export default async function RestLayout({
  children,
}: {
  children: ReactNode;
}) {
  

  return <BookingProvider>{children}</BookingProvider>;
}
