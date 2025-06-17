import { Metadata } from "next";
import Image from "next/image";
import RestDetails from "@/components/rest/RestDetails";
import { RestData } from "@/types/rest";
import StarRating from "@/components/ui/StarRating";
import { useTranslations } from "next-intl";
import { Bath, Image as ImageIcon,BedDouble, Dumbbell, Users, Flame, CookingPot } from "lucide-react"; // icons
import BookingForm from "@/components/rest/BookingForm";
// Bed, Bathroom, cutlery

// This would normally come from an API, but for now we'll use static data
const mockRestData: RestData = {
  id: "1",
  name: "Tiny House",
  description: "استراحة هادئة وحديثة للعائلات في موقع مميز",
  rating: 4.5,
  images: ["/images/rest-images/main.jpg"],
      amenities: [
    { icon: BedDouble, label: "غرفتين نوم" },
    { icon: Bath, label: "3 دورات مياه" },
    { icon: Dumbbell, label: "صالة طعام" },
    { icon: CookingPot, label: "مطبخين" },
    { icon: Users, label: "جلستين خارجين" },
    { icon: Flame, label: "منطقة شواء" },
  ],
  price: 1800,
  location: "الرياض، حي النرجس",
  availability: {
    overnight: { checkIn: "03", checkOut: "12" },
    withoutOvernight: { checkIn: "12", checkOut: "12" }
  },
}

export const metadata: Metadata = {
  title: "Tiny House - Dirwaza",
  description: "Book your perfect stay at Tiny House through Dirwaza",
};

export default function RestPage() {
  const t = useTranslations("RestPage");
  return (
    <div className="">
      {/* Hero Section */}
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden mb-8">
        <Image
          src={mockRestData.images[0]}
          alt={mockRestData.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-4 container-padding flex justify-between items-center w-full">
          <div className=" bg-white px-3 py-1 rounded-full">
            <span className="flex items-center gap-1">
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm ">
                {"15"} {t("image")}
              </span>
            </span>
          </div>
          <div className=" bg-white px-3 py-1 rounded-lg">
            <span className="flex items-center gap-1">
              <StarRating
                rating={mockRestData.rating}
                readonly={true}
                size="md"
              />
            </span>
          </div>
        </div>
      </div>
      <div className="container mx-auto container-padding">
        <div className="grid  gap-8">
          {/* Left Column - Details */}
          <div className=" space-y-8">
            <RestDetails data={mockRestData} />
           
          </div>

          {/* Right Column - Booking Form */}
          
              <BookingForm  data={mockRestData.availability} />
          
          
        </div>
      </div>
    </div>
  );
}
