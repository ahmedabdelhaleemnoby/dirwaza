import { RestData } from '@/types/rest';
import { Rest } from '@/lib/api/restActions';
import RestAmenities from './RestAmenities';

interface RestDetailsProps {
  data: RestData | Rest; // Support both old and new structure
}

export default function RestDetails({ data }: RestDetailsProps) {
  // Handle both data structures
  const title = 'title' in data ? data.title : data.name;
  const location = data.location;
  
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 mb-4">{data.description}</p>
      
      {/* Location */}
      {location && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>📍</span>
          <span>{location}</span>
        </div>
      )}
      
      {/* Features (if available from API) */}
      {'features' in data && data.features && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">المميزات</h3>
          <div className="flex flex-wrap gap-2">
            {data.features.map((feature, index) => (
              <span
                key={index}
                className="text-xs border border-primary-light rounded-full px-3 py-1 bg-white text-gray-700"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Amenities */}
      <div>
        <h3 className="text-lg font-semibold mb-3">المرافق</h3>
        <RestAmenities amenities={data.amenities} />
      </div>
    </div>
  );
} 