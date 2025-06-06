import { getTranslations } from "next-intl/server";
import PlantCard from "@/components/operator/PlantCard";
import { Metadata } from "next";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Dirwaza Nursery",
  description: "Discover our unique collection of plants",
};

// This will be replaced with actual API call later
const getPlants = () => {
  return [
    {
      id: 1,
      name: "نبات مونستيرا",
      nameEn: "Monstera Plant",
      price: 120,
      image: "/images/plants/monstera.jpg",
      description: "نبات داخلي جميل بأوراق فريدة",
      descriptionEn: "Beautiful indoor plant with unique leaf patterns",
      isAvailable: true,
    },
    {
      id: 2,
      name: "نبات الثعبان",
      nameEn: "Snake Plant",
      price: 120,
      image: "/images/plants/snake-plant.jpg",
      description: "نبات داخلي سهل العناية مع خصائص تنقية الهواء",
      descriptionEn:
        "Low maintenance indoor plant with air purifying qualities",
      isAvailable: true,
    },
    {
      id: 3,
      name: "نبات الدفنباخية",
      nameEn: "Dieffenbachia Plant",
      price: 60,
      image: "/images/plants/dieffenbachia.jpg",
      description: "نبات استوائي بأوراق مبرقشة جميلة",
      descriptionEn: "Tropical plant with beautiful variegated leaves",
      isAvailable: true,
      isOnSale: true,
      originalPrice: 90,
    },
  ];
};

export default async function OperatorPage() {
  const t = await getTranslations("OperatorPage");
  const plants = getPlants();

  return (
    <section className="bg-neutral section-padding">
      <div className="container mx-auto container-padding">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">{t("title")}</h1>
          <p className="text-lg text-gray-600">{t("description")}</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8  my-10">
          <span className="lg:block hidden "></span>
          <Button
            size="lg"
            className="bg-primary text-white  w-full "
          >
            {t("more")}
          </Button>
          <span></span>
        </section>
      </div>
    </section>
  );
}
