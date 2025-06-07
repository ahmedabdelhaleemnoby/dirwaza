'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
  canProceedToStep: (step: number) => boolean;
  isStepComplete: (step: number) => boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  onStepClick,
  canProceedToStep,
  isStepComplete
}) => {
  const t = useTranslations('TrainingBookingPage.steps');

  const stepTitles = [
      t('category'),
      t('course'),
      t('dateTime'),
      t('confirmBooking'),
  ];

  const getStepStatus = (step: number) => {
    if (step < currentStep && isStepComplete(step)) {
      return 'completed';
    } else if (step == currentStep) {
      return 'current';
    } else if (canProceedToStep(step)) {
      return 'available';
    } else {
      return 'disabled';
    }
  };

  const getStepClasses = (step: number) => {
    const status = getStepStatus(step);
    const baseClasses = 'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 cursor-pointer';
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-secondary text-white hover:bg-primary-dark`;
      case 'current':
        return `${baseClasses} bg-secondary text-white shadow-lg`;
      case 'available':
        return `${baseClasses} !bg-[#C3EEF5] text-primary border border-primary hover:bg-primary hover:text-white`;
      case 'disabled':
        return `${baseClasses} !bg-[#C3EEF5] text-primary border border-primary cursor-not-allowed`;
      default:
        return baseClasses;
    }
  };

  const getConnectorClasses = () => {
    return `flex-1 h-1 mx-2 transition-all duration-300 bg-[#C3EEF5] `;
  };

  return (
    <div className="w-full">
      {/* Desktop Step Indicator */}
      <div className="flex items-center justify-center mb-8">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const status = getStepStatus(step);
          
          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div
                  className={getStepClasses(step)}
                  onClick={() => status !== 'disabled' && onStepClick(step)}
                >
                  {step}
                </div>
                <span className={`mt-2 text-xs font-medium text-center max-w-20 md:text-nowrap ${
                  status === 'current' ? 'text-secondary' : 
                  status === 'completed' ? 'text-primary' : 'text-gray-500'
                }`}>
                  {stepTitles[index]}
                </span>
              </div>
              {step < totalSteps && (
                <div className={getConnectorClasses()} />
              )}
            </React.Fragment>
          );
        })}
      </div>

    
    </div>
  );
};

export default StepIndicator; 