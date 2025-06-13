"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
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
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  if (!category) {
    return null;
  }

  const handleQuantityChange = (courseId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [courseId]: Math.max(1, (prev[courseId] || 1) + change),
    }));
  };

  const handleCourseSelect = (course: Course) => {
    onUpdate(course);
  };

  const getQuantity = (courseId: string) => quantities[courseId] || 1;

  return (
    <div className="space-y-8">
      <div className="space-y-8 bg-white rounded-2xl shadow-lg p-4 max-w-md mx-auto">
        <div className="text-center flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h2>
          <span className="font-bold text-2xl text-red-500">
            {t("categoryLabel", { category: category.name })}
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
                  <h3 className="text-lg font-bold  mb-1">{course.name}</h3>
                  {/* <p className="text-sm text-gray-600">{course.duration}</p> */}

                  <div className=" font-bold text-[#065F46]">
                    {course.price}
                    {t("currency")}
                  </div>
                </div>{" "}
                {/* <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantityChange(course.id, -1);
                  }}
                  className="w-8 h-8 rounded-full border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors flex items-center justify-center"
                  disabled={getQuantity(course.id) <= 1}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>

                <span className="text-lg font-semibold text-gray-900 min-w-8 text-center">
                  {getQuantity(course.id)}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantityChange(course.id, 1);
                  }}
                  className="w-8 h-8 rounded-full border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div> */}
                <div className="flex items-center gap-1 border rounded-full border-primary-light px-2 py-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(course.id, -1);
                    }}
                    className="p-1 hover:text-primary transition-colors"
                    disabled={getQuantity(course.id) <= 1}
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
                    className="p-1 hover:text-primary transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {/* {selectedCourse?.id === course.id && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )} */}
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
