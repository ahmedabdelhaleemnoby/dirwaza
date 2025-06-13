import { Amenity } from "@/types/rest";

interface RestAmenitiesProps {
  amenities: Amenity[];
}

export default function RestAmenities({ amenities }: RestAmenitiesProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {amenities.map((amenity, index) => (
        <div
          key={index}
          className="flex items-center flex-col w-[clamp(5rem,30%,8rem)] sm:w-[clamp(8rem,15%,10rem)]  gap-2 p-3 rounded-lg bg-white border border-primary-light shadow-sm "
        >
          <span className="lg:text-2xl">
            {amenity.icon && <amenity.icon />}
          </span>
          <span className="text-gray-700 text-xs sm:text-base ">{amenity.label}</span>
        </div>
      ))}
    </div>
  );
}
