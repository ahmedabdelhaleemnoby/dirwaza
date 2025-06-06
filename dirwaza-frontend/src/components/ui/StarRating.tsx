"use client"
import React, { useState } from 'react';

interface StarRatingProps {
  rating?: number;
  onRatingChange?: (rating: number) => void;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  showValue?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  onRatingChange,
  maxRating = 5,
  size = 'md',
  readonly = false,
  showValue = true,
  className = ''
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [currentRating, setCurrentRating] = useState<number>(rating);

  // Size configurations
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const handleStarClick = (starValue: number) => {
    if (readonly) return;
    
    setCurrentRating(starValue);
    onRatingChange?.(starValue);
  };

  const handleStarHover = (starValue: number) => {
    if (readonly) return;
    setHoverRating(starValue);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverRating(0);
  };

  const displayRating = hoverRating || currentRating;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center" onMouseLeave={handleMouseLeave}>
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= displayRating;
          
          return (
            <button
              key={index}
              type="button"
              className={`
                ${sizeClasses[size]}
                ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                transition-all duration-150 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-sm
              `}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleStarHover(starValue)}
              disabled={readonly}
              aria-label={`Rate ${starValue} out of ${maxRating} stars`}
            >
              <svg
                className={`
                  w-full h-full
                  ${isFilled ? 'text-yellow-400' : 'text-gray-300'}
                  ${!readonly && 'hover:text-yellow-400'}
                  transition-colors duration-150
                `}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          );
        })}
      </div>
      
      {showValue && (
        <span className={`ml-2 font-medium text-gray-700 ${textSizes[size]}`}>
          {displayRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

// Example usage component with form integration
export const RatingExample: React.FC = () => {
  const [formData, setFormData] = useState({
    productRating: 0,
    serviceRating: 0,
    overallRating: 4.5
  });

  const handleSubmit = () => {
    console.log('Ratings submitted:', formData);
    alert(`Ratings submitted: Product: ${formData.productRating}, Service: ${formData.serviceRating}, Overall: ${formData.overallRating}`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Rating Examples</h2>
      
      {/* Form Example */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Rating
          </label>
          <StarRating
            rating={formData.productRating}
            onRatingChange={(rating) => 
              setFormData(prev => ({ ...prev, productRating: rating }))
            }
            size="md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Rating
          </label>
          <StarRating
            rating={formData.serviceRating}
            onRatingChange={(rating) => 
              setFormData(prev => ({ ...prev, serviceRating: rating }))
            }
            size="lg"
            showValue={false}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating (Read-only)
          </label>
          <StarRating
            rating={formData.overallRating}
            readonly={true}
            size="md"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          Submit Ratings
        </button>
      </div>

      {/* Different Sizes Demo */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Different Sizes</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-gray-600">Small:</span>
            <StarRating rating={4} readonly size="sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-gray-600">Medium:</span>
            <StarRating rating={3.5} readonly size="md" />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm text-gray-600">Large:</span>
            <StarRating rating={5} readonly size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarRating;