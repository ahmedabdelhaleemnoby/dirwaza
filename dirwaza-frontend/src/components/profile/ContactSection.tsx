"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Mail, Instagram, MessageCircle, Phone, Globe, Loader2 } from "lucide-react";
import Card from "@/components/ui/Card";
import { ContactInfo, fetchContactInfo } from "@/__mocks__/contact.mock";

// Icon mapping
const iconMap = {
  Mail,
  Instagram,
  MessageCircle,
  Phone,
  Globe,
};

export default function ContactSection() {
  const t = useTranslations("ProfilePage.contact");
  const [contactData, setContactData] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContactData = async () => {
      try {
        setLoading(true);
        const data = await fetchContactInfo();
        setContactData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load contact data");
      } finally {
        setLoading(false);
      }
    };

    loadContactData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="inline-flex items-start pt-0 pb-6 px-0 relative flex-[0_0_auto] w-full">
        <Card
          hasHover={false}
          className="flex flex-col w-full items-start p-6 relative bg-white rounded-[20px] overflow-hidden shadow-[0px_4px_6px_-1px_#0000001a,0px_2px_4px_-2px_#0000001a]"
        >
          <div className="flex w-full items-center justify-center py-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading contact information...</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !contactData) {
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
            {contactData.links.map((link) => {
              const IconComponent = iconMap[link.icon as keyof typeof iconMap];
              const isExternal = link.url.startsWith('http') || link.url.startsWith('tel:');
              
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
                      className={`text-gray-800 transition-colors duration-300 group-${link.hoverColor}`} 
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
