import React from "react";
import Image from "next/image";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useTranslations } from "next-intl";

type Service = {
  icon: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

const services: Service[] = [
  {
    icon: "/images/service1.jpg",
    title: "استراحات دروازة",
    description: "استراحة مثالية للعائلات الصغيرة و متوسطة وكبيرة  ",
    href: "/rest",
    cta: "احجز الآن",
  },
  {
    icon: "/images/service2.png",
    title: "تدريب الفروسية",
    description: "تعلم فنون ركوب الخيل على يد مدربين محترفين",
    href: "/service-two",
    cta: "احجز الآن",
  },
  {
    icon: "/images/service3.png",
    title: "مشتل دروازة",
    description: "اكتشف مجموعتنا المميزة من النباتات ",
    href: "/service-three",
    cta: "اطلب الآن",
  },
];

export default function ServicesSection() {
  const t = useTranslations("HomePage");

  return (
    <section className="bg-neutral section-padding">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-16 flex items-center justify-center gap-2">
          <h2 className="text-3xl md:text-4xl font-bold  text-primary">
            {t("services.title") || "خدمات دروازة "}
          </h2>
          <Image
            src={"/images/services.svg"}
            alt="دروازة icon"
            width={60}
            height={60}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 lg:gap-8 ">
          {services.map((service, index) => (
            <Card
              key={index}
              className="hover:-translate-y-2  flex flex-col"
            >
              <div className="relative rounded-t-2xl w-full md:h-3/5">
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={390}
                  height={190}
                  className="object-cover w-full md:h-full"
                />
              </div>
              <div className="flex flex-col justify-between flex-grow py-3 lg:py-5 gap-y-3 container-padding md:px-2 lg:px-5">
                <div>
                  <h3 className="text-xl font-bold text-primary">
                    {service.title}
                  </h3>
                  <p className="text-primary-dark">{service.description}</p>
                </div>
                <Button
                  href={service.href}
                  variant="primary"
                  className="border-primary w-full font-bold mt-4"
                >
                  {service.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
