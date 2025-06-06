import { RestData } from '@/types/rest';
import RestAmenities from './RestAmenities';

interface RestDetailsProps {
  data: RestData;
}

export default function RestDetails({ data }: RestDetailsProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
      <p className="text-gray-600 mb-4">{data.description}</p>
      <RestAmenities amenities={data.amenities} />

    </div>
  );
} 