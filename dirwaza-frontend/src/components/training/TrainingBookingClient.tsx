"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
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
import { createHorseBookingAction, HorseAppointment } from "@/lib/api/paymentActions";

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
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<TrainingFormData>({
    personalInfo: {
      fullName: "",
      parentName: "",
      age: "",
      mobileNumber: "",
      previousTraining: null,
      notes: "",
    },
    selectedCategory: null,
    selectedCourse: null,
    selectedDates: [],
    selectedTimes: [],
    agreedToTerms: false,
  });
  
  const [numberPersons, setNumberPersons] = useState<number>(1);

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
          formData.personalInfo.parentName &&
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

  // Function to convert time format from "17:00" to "5:00 PM - 7:00 PM"
  const convertTimeToTimeSlot = (time: string): string => {
    const hour = parseInt(time.split(':')[0]);
    
    // Helper function to convert 24-hour to 12-hour format
    const formatHour = (h: number) => {
      if (h === 0) return { hour: 12, period: 'AM' };
      if (h < 12) return { hour: h, period: 'AM' };
      if (h === 12) return { hour: 12, period: 'PM' };
      return { hour: h - 12, period: 'PM' };
    };
    
    // Start time
    const startTime = formatHour(hour);
    
    // End time (2 hours later)
    const endHour24 = hour + 1;
    const endTime = formatHour(endHour24 >= 24 ? endHour24 - 24 : endHour24);
    
    return `${startTime.hour}:00 ${startTime.period} - ${endTime.hour}:00 ${endTime.period}`;
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Transform selectedTimes to the expected format for the API
      const selectedAppointments = formData.selectedTimes.map(timeSlot => {
          if(!timeSlot.time)return null;
        const convertedTimeSlot = convertTimeToTimeSlot(timeSlot.time);
        console.log(`Converting time: ${timeSlot.time} → ${convertedTimeSlot}`);
        return {
          date: timeSlot.date,
          timeSlot: convertedTimeSlot,
        };
      }).filter(Boolean) as HorseAppointment[];

      // Prepare booking data in the exact format expected by the API
      // TODO: get the category and course id from the form data
      // BUG: the category and course id are not being passed to the API 
      const bookingData = {
        agreedToTerms: formData.agreedToTerms,
        personalInfo: {
          fullName: formData.personalInfo.fullName,
          parentName: formData.personalInfo.parentName,
          age: formData.personalInfo.age,
          mobileNumber: formData.personalInfo.mobileNumber,
          previousTraining: formData.personalInfo.previousTraining || false,
          notes: formData.personalInfo.notes,
        },
        numberPersons: numberPersons,
        selectedCategoryId: formData.selectedCategory?.id|| "",
        selectedCourseId: formData.selectedCourse?.id || "",
        selectedAppointments: selectedAppointments,
      };

      console.log("Sending horse booking data:", bookingData);
      const result = await createHorseBookingAction(bookingData);

      console.log("result", result);
      if (result.success && result.data) {
        // Open payment modal with the payment URL
      localStorage.setItem("result-training-booking", JSON.stringify(result.data?.bookingData?.[0]));
        toast.success(result.message);
        router.push("/training-booking/receipt");
        setTimeout(() => {
  localStorage.removeItem(STORAGE_KEY)  
        }, 1000);
      } else {
        toast.error(result.message || "فشل في إنشاء حجز الفروسية");
      }
    } catch (error) {
      console.error("Horse booking submission error:", error);
      toast.error("حدث خطأ أثناء معالجة الحجز");
    } finally {
      setIsLoading(false);
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
            onUpdate={(selectedCourse: Course, numberPersons: number) => {
              updateFormData({ selectedCourse });
              setNumberPersons(numberPersons);
            }}
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
                Pick<TrainingFormData, "selectedDates" | "selectedTimes">
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
            onUpdate={(
              data: Partial<
                Pick<TrainingFormData, "personalInfo" | "agreedToTerms">
              >
            ) => updateFormData(data)}
            onPrevious={goToPreviousStep}
            category={formData.selectedCategory}
            onSubmit={handleFinalSubmit}
            agreedToTerms={formData.agreedToTerms}
            isLoading={isLoading}
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

      <div className="">{renderCurrentStep()}</div>

     
    </div>
  );
}
