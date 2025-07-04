"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import TextArea from "@/components/ui/TextArea";
import { PersonalInfo, TrainingFormData } from "@/types/training";

interface PersonalInfoStepProps {
  data: PersonalInfo;
  onUpdate: (
    data: Partial<Pick<TrainingFormData, "personalInfo" | "agreedToTerms">>
  ) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  agreedToTerms: boolean;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  data,
  onUpdate,
  onPrevious,
  onSubmit,
  agreedToTerms,
}) => {
  const t = useTranslations("TrainingBookingPage.personalInfo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof PersonalInfo,
    value: string | boolean | null
  ) => {
    onUpdate({
      personalInfo: {
        ...data,
        [field]: value,
      },
    });
  };

  const isFormValid = () => {
    return (
      data.fullName.trim() !== "" &&
      data.firstNameOnId.trim() !== "" &&
      data.age.trim() !== "" &&
      data.mobileNumber.trim() !== "" &&
      data.previousTraining !== null
    );
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("title")}</h2>

      <div className="bg-white rounded-2xl shadow-lg p-6 ">
        <form onSubmit={handleFinalSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Input
              label={t("fullName")}
              type="text"
              placeholder={t("fullNamePlaceholder")}
              value={data.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              required
              className="w-full"
            />

            <Input
              label={t("firstNameOnId")}
              type="text"
              placeholder={t("firstNameOnIdPlaceholder")}
              value={data.firstNameOnId}
              onChange={(e) =>
                handleInputChange("firstNameOnId", e.target.value)
              }
              required
              className="w-full"
            />

            <Input
              label={t("age")}
              type="number"
              placeholder={t("agePlaceholder")}
              value={data.age}
              onChange={(e) => handleInputChange("age", e.target.value)}
              required
              min="6"
              max="100"
              className="w-full"
            />

            <Input
              label={t("mobileNumber")}
              type="tel"
              placeholder={t("mobileNumberPlaceholder")}
              value={data.mobileNumber}
              onChange={(e) =>
                handleInputChange("mobileNumber", e.target.value)
              }
              required
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              {t("previousTraining")}
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-x-2  cursor-pointer">
                <input
                  type="radio"
                  name="previousTraining"
                  checked={data.previousTraining === true}
                  onChange={() => handleInputChange("previousTraining", true)}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{t("yes")}</span>
              </label>
              <label className="flex items-center gap-x-2  cursor-pointer">
                <input
                  type="radio"
                  name="previousTraining"
                  checked={data.previousTraining === false}
                  onChange={() => handleInputChange("previousTraining", false)}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{t("no")}</span>
              </label>
            </div>
          </div>

          <TextArea
            label={t("notes")}
            placeholder={t("notesPlaceholder")}
            value={data.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={4}
            className="w-full  p-4 rounded-2xl"
          />

          <div className="">
            <label className="flex items-start space-x-3 gap-3    cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => onUpdate({ agreedToTerms: e.target.checked })}
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                {t("agreeToTerms")}
              </span>
            </label>
          </div>
          <Button
            disabled={!isFormValid() || !agreedToTerms || isSubmitting}
            type="submit"
            className="min-w-32 w-full"
          >
            {isSubmitting ? t("submitting") : t("confirmBooking")}
          </Button>
        </form>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious} className="min-w-32">
          {t("previous")}
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
