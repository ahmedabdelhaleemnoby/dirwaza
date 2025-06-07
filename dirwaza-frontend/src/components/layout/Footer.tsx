"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import clsx from "clsx";

export default function Footer() {
  const t = useTranslations("Footer");
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "tiktok", icon: "/icons/tiktok.svg", url: "#" },
    { name: "instagram", icon: "/icons/instagram.svg", url: "#" },
    { name: "mail", icon: "/icons/mail.svg", url: "#" },
    { name: "whatsapp", icon: "/icons/whatsapp.svg", url: "#" },
    
  ];

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
              src={"/logo.svg"}
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
              {t("contact.title")}
            </p>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:animate-bounce transform-3d h-auto"
                  aria-label={social.name}
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    height={40}
                    width={40}
                  />
                </a>
              ))}
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
