"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Button from "@/components/ui/Button";
import { TrainingCategory, Course } from "@/types/training";
import { Minus, Plus } from "lucide-react";

interface SessionSelectionStepProps {
  category: TrainingCategory | null;
  selectedCourse: Course | null;
  onUpdate: (course: Course) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const SessionSelectionStep: React.FC<SessionSelectionStepProps> = ({
  category,
  selectedCourse,
  onUpdate,
  onNext,
  onPrevious,
}) => {
  const t = useTranslations("TrainingBookingPage.sessionSelection");
  const locale = useLocale();
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  if (!category) {
    return null;
  }

  const handleQuantityChange = (courseId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [courseId]: Math.max(0, (prev[courseId] || 0) + change),
    }));
  };

  const handleCourseSelect = (course: Course) => {
    onUpdate(course);
  };

  const getQuantity = (courseId: string) => quantities[courseId] || 0;

  // Helper function to get localized category name
  const getLocalizedCategoryName = (category: TrainingCategory) => {
    return locale === 'ar' ? category.name : category.nameEn;
  };

  // Helper function to get localized course name
  const getLocalizedCourseName = (course: Course) => {
    return locale === 'ar' ? course.name : course.nameEn;
  };

  // Helper function to get localized course duration
  const getLocalizedCourseDuration = (course: Course) => {
    return locale === 'ar' ? course.duration : course.durationEn;
  };

  return (
    <div className="space-y-8">
      <div className="space-y-8 bg-white rounded-2xl shadow-lg p-4 max-w-md mx-auto">
        <div className="text-center flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h2>
          <span className="font-bold text-2xl text-red-500">
            {t("categoryLabel", { category: getLocalizedCategoryName(category) })}
          </span>
        </div>

        <div className="grid gap-6">
          {category.courses.map((course) => (
            <div
              key={course.id}
              className={`border-1 rounded-xl p-3 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                selectedCourse?.id === course.id
                  ? "border-secondary border-2 bg-primary/5 shadow-md"
                  : "border-gray-200 hover:border-primary/50"
              }`}
              onClick={() => handleCourseSelect(course)}
            >
              <div className="flex justify-between items-center ">
                <div>
                  <h3 className="text-lg font-bold  mb-1">{getLocalizedCourseName(course)}</h3>
                  <p className="text-sm text-gray-600 mb-1">{getLocalizedCourseDuration(course)}</p>

                  <div className=" font-bold text-[#065F46]">
                    {course.price}
                    {t("currency")}
                  </div>
                </div>{" "}
                <div className="flex items-center gap-1 border rounded-full border-primary-light px-2 py-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(course.id, -1);
                    }}
                    className="p-1 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    disabled={getQuantity(course.id) <= 0}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center">
                    {getQuantity(course.id)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(course.id, 1);
                    }}
                    className="p-1 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious} className="min-w-32">
          {t("previous")}
        </Button>

        <Button
          onClick={onNext}
          disabled={!selectedCourse}
          className="min-w-32"
        >
          {t("next")}
        </Button>
      </div>
    </div>
  );
};

export default SessionSelectionStep;
