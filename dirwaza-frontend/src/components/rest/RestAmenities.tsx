import { Amenity } from "@/types/rest";
import { DynamicIcon } from "./IconMap";
import type { RestAmenity } from "@/lib/api/restActions";

interface RestAmenitiesProps {
  amenities: Amenity[] | RestAmenity[]; // Support both old and new structure
}

// Type guard to check if it's the new API structure
const isApiAmenity = (amenity: Amenity | RestAmenity): amenity is RestAmenity => {
  return typeof (amenity as RestAmenity).icon === 'string';
};

export default function RestAmenities({ amenities }: RestAmenitiesProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {amenities.map((amenity, index) => (
        <div
          key={isApiAmenity(amenity) ? amenity._id : index}
          className="flex items-center flex-col w-[clamp(5rem,30%,8rem)] sm:w-[clamp(8rem,15%,10rem)]  gap-2 p-3 rounded-lg bg-white border border-primary-light shadow-sm "
        >
          <span className="lg:text-2xl">
            {isApiAmenity(amenity) ? (
              <DynamicIcon name={amenity.icon} />
            ) : (
              amenity.icon && <amenity.icon />
            )}
          </span>
          <span className="text-gray-700 text-xs sm:text-base ">{amenity.label}</span>
        </div>
      ))}
    </div>
  );
}
