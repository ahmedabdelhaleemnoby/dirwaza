// Training data types (updated to match API response)
export interface TrainingCourse {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  sessions: number;
  duration: string;
  durationEn: string;
  _id?: string;
}

export interface DisabledDate {
  date: string;
  reason: string;
  description: string;
  _id?: string;
}

export interface TrainingCategory {
  _id?: string;
  id?: string;
  category: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  courses: TrainingCourse[];
  timeSlots: {
    weekdays: string[];
    weekends: string[];
  };
  disabledDates: DisabledDate[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrainingAvailability {
  disabledDates: string[];
  timeSlots: {
    weekdays: string[];
    weekends: string[];
  };
}

export interface TrainingData {
  categories: TrainingCategory[];
  availableDates: TrainingAvailability;
}

// Training categories and courses mock data (updated to match API structure)
export const mockTrainingData: TrainingData = {
  categories: [
    {
      _id: "686de9b44b86032032788614",
      category: "children",
      id: "children",
      name: "الأطفال",
      nameEn: "Children",
      description: "برامج تدريبية مخصصة للأطفال من عمر 6 إلى 14 سنة",
      descriptionEn: "Training programs for children aged 6 to 14 years",
      icon: '/icons/children.svg',
            timeSlots: {
        weekdays: ["17:00", "18:00", "19:00", "20:00"],
        weekends: ["16:00", "17:00", "18:00", "19:00", "20:00"]
      },
      disabledDates: [
        {
          date: "2025-06-25",
          reason: "maintenance",
          description: "صيانة دورية",
          _id: "686de9b44b86032032788619"
        },
        {
          date: "2025-06-26",
          reason: "maintenance",
          description: "صيانة دورية",
          _id: "686de9b44b8603203278861a"
        },
        {
          date: "2025-06-30",
          reason: "maintenance",
          description: "صيانة دورية",
          _id: "686de9b44b8603203278861b"
        },
        {
          date: "2025-06-09",
          reason: "maintenance",
          description: "صيانة دورية",
          _id: "686de9b44b8603203278861c"
        }
      ],
      isActive: true,
      createdAt: "2025-07-09T04:01:56.777Z",
      updatedAt: "2025-07-09T04:01:56.777Z",
      courses: [
        {
          id: "children-daily",
          name: "حصة يومية",
          nameEn: "Daily Session",
          price: 180,
          sessions: 1,
          duration: "1 ساعة",
          durationEn: "1 hour",
          _id: "686de9b44b86032032788615"
        },
        {
          id: "children-8-sessions",
          name: "8 حصص تدريبية",
          nameEn: "8 Training Sessions",
          price: 1300,
          sessions: 8,
          duration: "8 ساعات",
          durationEn: "8 hours",
          _id: "686de9b44b86032032788616"
        },
        {
          id: "children-12-sessions",
          name: "12 حصة تدريبية",
          nameEn: "12 Training Sessions",
          price: 1800,
          sessions: 12,
          duration: "12 ساعة",
          durationEn: "12 hours",
          _id: "686de9b44b86032032788617"
        },
        {
          id: "children-12-individual",
          name: "12 حصة تدريبية فردية",
          nameEn: "12 Individual Training Sessions",
          price: 2300,
          sessions: 12,
          duration: "12 ساعة فردية",
          durationEn: "12 individual hours",
          _id: "686de9b44b86032032788618"
        }
      ]
    },
    {
      _id: "686de9b44b86032032788622",
      category: "women",
      id: "women",
      name: "النساء",
      nameEn: "Women",
      description: "برامج تدريبية للنساء من جميع الأعمار",
      descriptionEn: "Training programs for women of all ages",
      icon: '/icons/women.svg',
            timeSlots: {
        weekdays: ["17:00", "18:00", "19:00", "20:00"],
        weekends: ["16:00", "17:00", "18:00", "19:00", "20:00"]
      },
      disabledDates: [
        {
          date: "2025-06-25",
          reason: "maintenance",
          description: "صيانة دورية",
          _id: "686de9b44b86032032788625"
        }
      ],
      isActive: true,
      createdAt: "2025-07-09T04:01:56.779Z",
      updatedAt: "2025-07-09T04:01:56.779Z",
      courses: [
        {
          id: "women-daily",
          name: "حصة يومية",
          nameEn: "Daily Session",
          price: 190,
          sessions: 1,
          duration: "1 ساعة",
          durationEn: "1 hour",
          _id: "686de9b44b86032032788623"
        },
        {
          id: "women-group",
          name: "حصص جماعية",
          nameEn: "Group Sessions",
          price: 1500,
          sessions: 8,
          duration: "8 ساعات جماعية",
          durationEn: "8 group hours",
          _id: "686de9b44b86032032788624"
        }
      ]
    },
    {
      _id: "686de9b44b8603203278861d",
      category: "youth",
      id: "youth",
      name: "الشباب",
      nameEn: "Youth",
      description: "برامج تدريبية للشباب من عمر 15 إلى ما فوق",
      descriptionEn: "Training programs for youth aged 15 and above",
      icon: '/icons/youth.svg',
            timeSlots: {
        weekdays: ["17:00", "18:00", "19:00", "20:00"],
        weekends: ["16:00", "17:00", "18:00", "19:00", "20:00"]
      },
      disabledDates: [
        {
          date: "2025-06-25",
          reason: "maintenance",
          description: "صيانة دورية",
          _id: "686de9b44b86032032788620"
        },
        {
          date: "2025-06-26",
          reason: "maintenance",
          description: "صيانة دورية",
          _id: "686de9b44b86032032788621"
        }
      ],
      isActive: true,
      createdAt: "2025-07-09T04:01:56.778Z",
      updatedAt: "2025-07-09T04:01:56.778Z",
      courses: [
        {
          id: "youth-daily",
          name: "حصة يومية",
          nameEn: "Daily Session",
          price: 200,
          sessions: 1,
          duration: "1.5 ساعة",
          durationEn: "1.5 hours",
          _id: "686de9b44b8603203278861e"
        },
        {
          id: "youth-10-sessions",
          name: "10 حصص تدريبية",
          nameEn: "10 Training Sessions",
          price: 1800,
          sessions: 10,
          duration: "15 ساعة",
          durationEn: "15 hours",
          _id: "686de9b44b8603203278861f"
        }
      ]
    }
  ],
  availableDates: {
    disabledDates: ["2025-06-25", "2025-06-26", "2025-06-30", "2025-06-09"],
    timeSlots: {
      weekdays: ["17:00", "18:00", "19:00", "20:00"],
      weekends: ["16:00", "17:00", "18:00", "19:00", "20:00"]
    }
  }
};

// Mock API function for fallback
export const getTrainingData = async (): Promise<TrainingData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return mockTrainingData;
}; 