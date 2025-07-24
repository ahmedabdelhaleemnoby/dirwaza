export interface PersonalInfo {
  fullName: string;
  parentName: string;
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
  _id?: string; // Added to match API response
}

export interface DisabledDate {
  date: string;
  reason: string;
  description: string;
  _id?: string;
}

export interface TrainingCategory {
  _id?: string; // Added to match API response
  id?: string; // Keep for backward compatibility
  category: string; // Added to match API response
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  courses: Course[];
  timeSlots: {
    weekdays: string[];
    weekends: string[];
  };
  disabledDates: DisabledDate[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
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

// API Response type
export interface TrainingApiResponse {
  success: boolean;
  message: string;
  data: TrainingCategory[];
}

export interface TrainingFormData {
  personalInfo: PersonalInfo;
  selectedCategory: TrainingCategory | null;
  selectedCourse: Course | null;
  selectedDates: string[];
  selectedTimes: { date: string; time: string }[];
  agreedToTerms: boolean;
} 

export interface SessionCalendarTrainingBlock {
  id: string;
  trainee: string;
  startTime: string;
  endTime: string;
  type: "daily" | "group" | "individual" | "advanced";
  date: string; // Date in YYYY-MM-DD format
  day: number; // 0-6 (Sunday to Saturday) - calculated from date
}