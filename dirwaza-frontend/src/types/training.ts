export interface PersonalInfo {
  fullName: string;
  firstNameOnId: string;
  age: string;
  mobileNumber: string;
  previousTraining: boolean | null;
  notes: string;
}

export interface Course {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  sessions: number;
  duration: string;
  durationEn: string;
}

export interface TrainingCategory {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  courses: Course[];
}

export interface AvailableDates {
  disabledDates: string[];
  timeSlots: {
    weekdays: string[];
    weekends: string[];
  };
}

export interface TrainingData {
  categories: TrainingCategory[];
  availableDates: AvailableDates;
}

export interface TrainingFormData {
  personalInfo: PersonalInfo;
  selectedCategory: TrainingCategory | null;
  selectedCourse: Course | null;
  selectedDates: string[];
  selectedTimes: Record<string, string[]>;
  agreedToTerms: boolean;
} 