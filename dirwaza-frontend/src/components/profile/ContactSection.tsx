"use client";

import { useTranslations } from "next-intl";
import { Mail, Instagram, MessageCircle } from "lucide-react";
import Card from "@/components/ui/Card";

export default function ContactSection() {
  const t = useTranslations("ProfilePage.contact");

  return (
    <div className="inline-flex items-start pt-0 pb-6 px-0 relative flex-[0_0_auto] w-full">
      <Card
        hasHover={false}
        className="flex flex-col w-full  items-start p-6 relative bg-white rounded-[20px] overflow-hidden shadow-[0px_4px_6px_-1px_#0000001a,0px_2px_4px_-2px_#0000001a]"
      >
        <div className="flex w-full  items-center justify-between relative">
          {/* Contact Us Title */}
          <div className="w-[100.12px] flex h-7 items-center justify-start relative">
            <div className=" font-bold text-gray-800 text-xl leading-7 relative w-fit mt-[-1.00px] tracking-[0] whitespace-nowrap [direction:rtl]">
              {t("title")}
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex w-[90.31px] h-[21px] items-start justify-start gap-4 relative">
            {/* Email Link */}
            <a
              href="mailto:info@dirwaza.com"
              className="flex w-[19.44px] h-[21px] items-center justify-start relative group transition-all duration-300 hover:scale-110 hover:-translate-y-1"
              aria-label="Send Email"
            >
              <Mail size={24} className="text-gray-800 transition-colors duration-300 group-hover:text-blue-600" />
            </a>

            {/* Instagram Link */}
            <a
              href="https://instagram.com/dirwaza"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-[19.44px] h-[21px] items-center justify-start relative group transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:rotate-12"
              aria-label="Follow on Instagram"
            >
              <Instagram size={24} className="text-gray-800 transition-colors duration-300 group-hover:text-pink-600" />
            </a>

            {/* WhatsApp Link */}
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-[19.44px] h-[21px] items-center justify-start relative group transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:rotate-[-12deg]"
              aria-label="Contact on WhatsApp"
            >
              <MessageCircle size={24} className="text-gray-800 transition-colors duration-300 group-hover:text-green-600" />
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
