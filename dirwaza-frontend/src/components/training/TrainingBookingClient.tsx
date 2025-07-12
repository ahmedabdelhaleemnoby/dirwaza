"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import PersonalInfoStep from "./steps/PersonalInfoStep";

import {
  TrainingFormData,
  TrainingData,
  TrainingCategory,
  Course,
} from "@/types/training";
import CategorySelectionStep from "./steps/CategorySelectionStep";
import SessionSelectionStep from "./steps/SessionSelectionStep";
import DateTimeSelectionStep from "./steps/DateTimeSelectionStep";
import StepIndicator from "./StepIndicator";

interface TrainingBookingClientProps {
  initialData: TrainingData;
  initialStep: number;
}

const TOTAL_STEPS = 4;
const STORAGE_KEY = "training-booking-form";

export default function TrainingBookingClient({
  initialData,
  initialStep,
}: TrainingBookingClientProps) {
  const t = useTranslations("TrainingBookingPage");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState<TrainingFormData>({
    personalInfo: {
      fullName: "",
      firstNameOnId: "",
      age: "",
      mobileNumber: "",
      previousTraining: null,
      notes: "",
    },
    selectedCategory: null,
    selectedCourse: null,
    selectedDates: [],
    selectedTimes: {},
    agreedToTerms: false,
  });

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Failed to parse saved form data:", error);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Update URL when step changes
  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("step", currentStep.toString());
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`/training-booking${query}`, { scroll: false });
  }, [currentStep, router, searchParams]);

  const updateFormData = (stepData: Partial<TrainingFormData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setCurrentStep(step);
    }
  };

  const goToNextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.selectedCategory;

      case 2:
        return !!formData.selectedCourse;

      case 3:
        return !!(
          formData.selectedDates.length &&
          formData.selectedTimes &&
          formData.agreedToTerms
        );

      case 4:
        return !!(
          formData.personalInfo.fullName &&
          formData.personalInfo.firstNameOnId &&
          formData.personalInfo.age &&
          formData.personalInfo.mobileNumber &&
          formData.personalInfo.previousTraining !== null
        );
      default:
        return false;
    }
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return canProceedToStep(2);
      case 2:
        return !!formData.selectedCategory;
      case 3:
        return !!formData.selectedCourse;
      case 4:
        return formData.selectedDates.length > 0 && formData.agreedToTerms;
      default:
        return false;
    }
  };

  const handleFinalSubmit = async () => {
    try {
      // Here you would submit to your API
      console.log("Final form data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear form data after successful submission
      localStorage.removeItem(STORAGE_KEY);

      // Redirect to success page or show success message
      alert(t("bookingSuccess"));
      router.push("/training-booking/result"); 
    } catch (error) {
      console.error("Booking submission failed:", error);
      alert(t("bookingError"));
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CategorySelectionStep
            categories={initialData.categories}
            selectedCategory={formData.selectedCategory}
            onUpdate={(selectedCategory: TrainingCategory) =>
              updateFormData({ selectedCategory })
            }
            onNext={goToNextStep}
          />
        );
      case 2:
        return (
          <SessionSelectionStep
            category={formData.selectedCategory}
            selectedCourse={formData.selectedCourse}
            onUpdate={(selectedCourse: Course) =>
              updateFormData({ selectedCourse })
            }
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 3:
        return (
          <DateTimeSelectionStep
            availableDates={initialData.availableDates}
            selectedDates={formData.selectedDates}
            selectedTimes={formData.selectedTimes}
            selectedCourse={formData.selectedCourse}
            onUpdate={(
              data: Partial<
                Pick<
                  TrainingFormData,
                  "selectedDates" | "selectedTimes" 
                >
              >
            ) => updateFormData(data)}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        ); 
      case 4:
        return (
          <PersonalInfoStep
            data={formData.personalInfo}
            onUpdate={
            (
              data: Partial<
                Pick<
                  TrainingFormData,
                   "personalInfo" | "agreedToTerms"
                >
              >
            ) => updateFormData(data)
          }
            onPrevious={goToPreviousStep}
            onSubmit={handleFinalSubmit}
            agreedToTerms={formData.agreedToTerms}

          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-padding section-padding max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          {t("title")}
        </h1>
        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onStepClick={goToStep}
          canProceedToStep={canProceedToStep}
          isStepComplete={isStepComplete}
        />
      </div>

      <div className="">
        {renderCurrentStep()}
      </div>
    </div>
  );
}
