'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { TrainingCategory } from '@/types/training';

interface CategorySelectionStepProps {
  categories: TrainingCategory[];
  selectedCategory: TrainingCategory | null;
  onUpdate: (category: TrainingCategory) => void;
  onNext: () => void;
}

const CategorySelectionStep: React.FC<CategorySelectionStepProps> = ({
  categories,
  selectedCategory,
  onUpdate,
  onNext,
  
}) => {
  const t = useTranslations('TrainingBookingPage.categorySelection');

  const handleCategorySelect = (category: TrainingCategory) => {
    onUpdate(category);
  };

  const handleNext = () => {
    if (selectedCategory) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg ${
              selectedCategory?.id === category.id
                ? 'border-secondary border-4 bg-primary/5 shadow-md'
                : 'border-primary-light hover:border-primary/50'
            }`}
            onClick={() => handleCategorySelect(category)}
          >
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-neutral-light rounded-full flex items-center justify-center text-2xl">
                {category.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {category.description}
              </p>
              {selectedCategory?.id === category.id && (
                <div className="mt-4">
                  <div className="w-6 h-6 mx-auto bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-6">
      
        
        <Button
          onClick={handleNext}
          disabled={!selectedCategory}
          className="min-w-32"
        >
          {t('next')}
        </Button>
      </div>
    </div>
  );
};

export default CategorySelectionStep; 