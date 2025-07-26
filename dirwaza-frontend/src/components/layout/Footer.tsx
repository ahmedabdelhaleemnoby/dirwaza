"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import clsx from "clsx";
import { useContactInfo } from "@/hooks/api/useContactInfo";

export default function Footer() {
  const t = useTranslations("Footer");
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const { contactInfo, loading } = useContactInfo();

  // Mapping from contact info types to existing icon files
  const iconMapping: { [key: string]: string } = {
    email: "/icons/mail.svg",
    instagram: "/icons/instagram.svg",
    whatsapp: "/icons/whatsapp.svg",
    tiktok: "/icons/tiktok.svg",
    // Add more mappings as needed
  };

  // Fallback social links if contact info is not available
  const fallbackSocialLinks = [
    { name: "tiktok", icon: "/icons/tiktok.svg", url: "#", ariaLabel: "TikTok" },
    { name: "instagram", icon: "/icons/instagram.svg", url: "#", ariaLabel: "Instagram" },
    { name: "mail", icon: "/icons/mail.svg", url: "#", ariaLabel: "Email" },
    { name: "whatsapp", icon: "/icons/whatsapp.svg", url: "#", ariaLabel: "WhatsApp" },
  ];

  // Use dynamic contact info if available, otherwise fallback
  const socialLinks = contactInfo?.links
    ? contactInfo.links
        .filter(link => iconMapping[link.type]) // Only show links we have icons for
        .map(link => ({
          name: link.type,
          icon: iconMapping[link.type],
          url: link.url,
          ariaLabel: link.ariaLabel,
        }))
    : fallbackSocialLinks;

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/rest", label: t("rest") },
    { href: "/training-booking", label: t("training") },
    { href: "/operator", label: t("operator") },
    // { href: '/services', label: t('services') },
    // { href: '/faq', label: t('faq') },
  ];

  return (
    <footer className="bg-primary text-white pt-16 pb-8 ">
      <div className="container container-padding mx-auto px-4 ">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-white/60 ">
          {/* Brand Column */}
          <div className=" col-span-2 space-y-10">
            <Image
              src={"/logo.webp"}
              alt="logo Dirwazh "
              height={60}
              width={60}
              className="border border-primary-dark/80 rounded-lg  lg:border-0 "
            />

            <p className="mb-6 max-w-64">{t("description")}</p>
          </div>

          <ul className="space-y-3">
            {navLinks.map((link, linkIndex) => {
              const isActive = pathname === link.href;
              return (
                <li key={linkIndex}>
                  <Link
                    href={link.href}
                    className={clsx(
                      "  hover:font-bold",
                      isActive ? "font-bold" : ""
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex space-y-4 mb-6 flex-col ">
            <p className="">
              { t("contact.title")}
            </p>
            <div className="flex space-x-4 mb-6">
              {loading ? (
                <div className="text-white/50 text-sm">Loading...</div>
              ) : (
                socialLinks.map((social, index) => {
                  const isExternal = social.url.startsWith('http') || 
                                   social.url.startsWith('tel:') || 
                                   social.url.startsWith('mailto:');
                  
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="hover:animate-bounce transform-3d h-auto"
                      aria-label={social.ariaLabel || social.name}
                    >
                      <Image
                        src={social.icon}
                        alt={social.name}
                        height={40}
                        width={40}
                      />
                    </a>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white  flex  justify-center items-center">
          <p className="text-white text-sm">
            &copy; {currentYear} Dirwazh. {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
