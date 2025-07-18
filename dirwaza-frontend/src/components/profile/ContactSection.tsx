"use client";

import { useTranslations } from "next-intl";
import { Mail, Instagram, MessageCircle, Phone, Globe } from "lucide-react";
import Card from "@/components/ui/Card";
import { ContactInfoResponse, SocialMediaLink } from "@/__mocks__/contact.mock";

// Icon mapping
const iconMap = {
  Mail,
  Instagram,
  MessageCircle,
  Phone,
  Globe,
};

interface ContactSectionProps {
  contactData?: ContactInfoResponse | null;
}

export default function ContactSection({ contactData }: ContactSectionProps) {
  const t = useTranslations("ProfilePage.contact");

  // Error state or no data
  if (!contactData) {
    return (
      <div className="inline-flex items-start pt-0 pb-6 px-0 relative flex-[0_0_auto] w-full">
        <Card
          hasHover={false}
          className="flex flex-col w-full items-start p-6 relative bg-white rounded-[20px] overflow-hidden shadow-[0px_4px_6px_-1px_#0000001a,0px_2px_4px_-2px_#0000001a]"
        >
          <div className="flex w-full items-center justify-between relative">
            <div className="font-bold text-gray-800 text-xl leading-7 [direction:rtl]">
              {t("title")}
            </div>
            <div className="text-red-500 text-sm">
              Failed to load contact information
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="inline-flex items-start pt-0 pb-6 px-0 relative flex-[0_0_auto] w-full">
      <Card
        hasHover={false}
        className="flex flex-col w-full items-start p-6 relative bg-white rounded-[20px] overflow-hidden shadow-[0px_4px_6px_-1px_#0000001a,0px_2px_4px_-2px_#0000001a]"
      >
        <div className="flex w-full items-center justify-between relative">
          {/* Contact Us Title */}
          <div className="flex h-7 items-center justify-start relative">
            <div className="font-bold text-gray-800 text-xl leading-7 relative w-fit mt-[-1.00px] tracking-[0] whitespace-nowrap [direction:rtl]">
              {t("title")}
            </div>
          </div>

          {/* Social Media Icons - Dynamic from API */}
          <div className="flex items-start justify-start gap-4 relative">
            {contactData.links.map((link: SocialMediaLink) => {
              const IconComponent = iconMap[link.icon as keyof typeof iconMap];
              const isExternal = link.url.startsWith('http') || link.url.startsWith('tel:') || link.url.startsWith('mailto:');
              
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className={`flex w-[19.44px] h-[21px] items-center justify-start relative group transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${link.hoverEffect || ''}`}
                  aria-label={link.ariaLabel}
                >
                  {IconComponent && (
                    <IconComponent 
                      size={24} 
                      className={`text-gray-800 transition-colors duration-300 ${link.hoverColor}`} 
                    />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
