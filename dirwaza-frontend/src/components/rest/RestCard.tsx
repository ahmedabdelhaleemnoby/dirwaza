import React from 'react';
import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getImageUrl } from '@/lib/api/config';
import type { Rest } from '@/lib/api/restActions';

interface RestCardProps {
  rest: Rest;
  priority?: boolean; // For image loading optimization
}

const RestCard: React.FC<RestCardProps> = ({ rest, priority = false }) => {
  const mainImage = getImageUrl(rest.images?.[0] || '');
  
  return (
    <Card className="flex flex-col hover:-translate-y-2 transition-transform duration-300 p-0 overflow-hidden group">
      {/* Image Section */}
      <div className="relative w-full h-60 overflow-hidden">
        <Image
          src={mainImage}
          alt={rest.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium text-gray-700">{rest.rating}</span>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-primary text-white rounded-lg px-3 py-1 font-bold shadow-sm">
          {rest.price.toLocaleString('ar-SA')} ر.س
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col justify-between p-4 flex-grow gap-3">
        {/* Title and Description */}
        <div className="text-start">
          <h3 className="text-lg font-bold text-primary line-clamp-1">{rest.title}</h3>
          <p className="text-sm text-primary-dark line-clamp-2 mb-2">{rest.description}</p>
          
          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{rest.location}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-start gap-2 mb-3">
          {rest.features?.slice(0, 3).map((feature, i) => (
            <span
              key={i}
              className="text-xs border border-primary-light rounded-full px-3 py-1 bg-white text-gray-700 transition-colors hover:bg-primary-light/20"
            >
              {feature}
            </span>
          ))}
          {rest.features && rest.features.length > 3 && (
            <span className="text-xs text-gray-500 px-3 py-1">
              +{rest.features.length - 3} أخرى
            </span>
          )}
        </div>

        {/* Action Button */}
        <Button
          href={rest.href}
          variant="primary"
          className="w-full font-bold transition-all duration-200 hover:shadow-lg"
        >
          عرض الاستراحة
        </Button>
      </div>
    </Card>
  );
};

export default RestCard; 