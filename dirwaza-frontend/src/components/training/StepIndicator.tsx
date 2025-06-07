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
      t('personalInfo'),
  ];

  const getStepStatus = (step: number) => {
    if (step < currentStep && isStepComplete(step)) {
      return 'completed';
    } else if (step === currentStep) {
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
        return `${baseClasses} bg-secondary text-white  border border-primary hover:bg-primary hover:text-white`;
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
      <div className="hidden md:flex items-center justify-center mb-8">
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
                  {status === 'completed' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium text-center max-w-20 ${
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

      {/* Mobile Step Indicator */}
      <div className="md:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[gray-600]">
            {t('stepOf', { current: currentStep, total: totalSteps })}
          </span>
          <span className="text-sm font-medium text-secondary">
            {stepTitles[currentStep - 1]}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-secondary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StepIndicator; 