import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Image from 'next/image';
import React from 'react';
type Resort = {
  image: string;
  title: string;
  description: string;
  features: string[];
  href: string;
};

const resorts: Resort[] = [
  {
    image: "/images/resort1.jpg",
    title: "The Green House",
    description: "استراحة مميزة مناسبة للعائلات الكبيرة",
    features: ["غرفة سائق", "ألعاب مائية", "اربع غرف نوم"],
    href: "/resort/green-house",
  },
  {
    image: "/images/resort2.jpg",
    title: "The Long",
    description: "استراحة واسعة مناسبة للعائلات المتوسطة",
    features: ["ثلاث غرف نوم", "مسبح مفتوح", "مكان للشواء"],
    href: "/resort/the-long",
  },
  {
    image: "/images/resort3.jpg",
    title: "Tiny House",
    description: "استراحة مثالية للعائلات الصغيرة",
    features: ["غرفتين نوم", "ألعاب أطفال", "مطبخ تحضيري"],
    href: "/resort/tiny-house",
  },
];
export default function RestPage() {
    return (
     <section className="bg-neutral section-padding">
      <div className="container mx-auto container-padding">
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">
            استراحات دروازة
          </h2>
          <p className="text-primary-dark">
            اختر من بين استراحاتنا المميزة لقضاء أوقات لا تُنسى مع العائلة والأصدقاء
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resorts.map((resort, index) => (
            <Card key={index} className="flex flex-col hover:-translate-y-2">
              <div className="relative rounded-t-2xl w-full h-60">
                <Image
                  src={resort.image}
                  alt={resort.title}
                
                  fill
                  className="object-cover rounded-t-2xl"
                />
              </div>
              <div className="flex flex-col justify-between py-4 px-5 flex-grow gap-3">
                <div className="text-start">
                  <h3 className="text-lg font-bold text-primary">{resort.title}</h3>
                  <p className="text-sm text-primary-dark">{resort.description}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {resort.features.map((feature, i) => (
                    <span
                      key={i}
                      className="text-xs border border-gray-300 rounded-full px-3 py-1 bg-white text-gray-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <Button
                  href={resort.href}
                  variant="primary"
                  className="w-full font-bold mt-2"
                >
                  عرض استراحة
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
    );
}