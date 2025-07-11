// Training data types
export interface TrainingCategory {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  courses: TrainingCourse[];
}

export interface TrainingCourse {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  sessions: number;
  duration: string;
  durationEn: string;
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

// Training categories and courses mock data
export const mockTrainingData: TrainingData = {
  categories: [
    {
      id: 'children',
      name: 'الأطفال',
      nameEn: 'Children',
      description: 'برامج تدريبية مخصصة للأطفال من عمر 6 إلى 14 سنة',
      descriptionEn: 'Training programs for children aged 6 to 14 years',
      icon: '/icons/children.svg',
      courses: [
        {
          id: 'children-daily',
          name: 'حصة يومية',
          nameEn: 'Daily Session',
          price: 180,
          sessions: 1,
          duration: '1 ساعة',
          durationEn: '1 hour'
        },
        {
          id: 'children-8-sessions',
          name: '8 حصص تدريبية',
          nameEn: '8 Training Sessions',
          price: 1300,
          sessions: 8,
          duration: '8 ساعات',
          durationEn: '8 hours'
        },
        {
          id: 'children-12-sessions',
          name: '12 حصة تدريبية',
          nameEn: '12 Training Sessions',
          price: 1800,
          sessions: 12,
          duration: '12 ساعة',
          durationEn: '12 hours'
        },
        {
          id: 'children-12-individual',
          name: '12 حصة تدريبية فردية',
          nameEn: '12 Individual Training Sessions',
          price: 2300,
          sessions: 12,
          duration: '12 ساعة فردية',
          durationEn: '12 individual hours'
        }
      ]
    },
    {
      id: 'women',
      name: 'السيدات',
      nameEn: 'Women',
      description: 'برامج تدريبية مخصصة للسيدات مع بيئة مريحة وآمنة',
      descriptionEn: 'Training programs designed for women in a comfortable and safe environment',
      icon: '/icons/women.svg',
      courses: [
        {
          id: 'women-daily',
          name: 'حصة يومية',
          nameEn: 'Daily Session',
          price: 200,
          sessions: 1,
          duration: '1 ساعة',
          durationEn: '1 hour'
        },
        {
          id: 'women-8-sessions',
          name: '8 حصص تدريبية',
          nameEn: '8 Training Sessions',
          price: 1400,
          sessions: 8,
          duration: '8 ساعات',
          durationEn: '8 hours'
        },
        {
          id: 'women-12-sessions',
          name: '12 حصة تدريبية',
          nameEn: '12 Training Sessions',
          price: 1950,
          sessions: 12,
          duration: '12 ساعة',
          durationEn: '12 hours'
        },
        {
          id: 'women-12-individual',
          name: '12 حصة تدريبية فردية',
          nameEn: '12 Individual Training Sessions',
          price: 2500,
          sessions: 12,
          duration: '12 ساعة فردية',
          durationEn: '12 individual hours'
        }
      ]
    },
    {
      id: 'youth',
      name: 'الشباب',
      nameEn: 'Youth',
      description: 'برامج تدريبية للشباب من عمر 15 إلى 25 سنة',
      descriptionEn: 'Training programs for youth aged 15 to 25 years',
      icon: '/icons/youth.svg',
      courses: [
        {
          id: 'youth-daily',
          name: 'حصة يومية',
          nameEn: 'Daily Session',
          price: 220,
          sessions: 1,
          duration: '1 ساعة',
          durationEn: '1 hour'
        },
        {
          id: 'youth-8-sessions',
          name: '8 حصص تدريبية',
          nameEn: '8 Training Sessions',
          price: 1500,
          sessions: 8,
          duration: '8 ساعات',
          durationEn: '8 hours'
        },
        {
          id: 'youth-12-sessions',
          name: '12 حصة تدريبية',
          nameEn: '12 Training Sessions',
          price: 2100,
          sessions: 12,
          duration: '12 ساعة',
          durationEn: '12 hours'
        },
        {
          id: 'youth-12-individual',
          name: '12 حصة تدريبية فردية',
          nameEn: '12 Individual Training Sessions',
          price: 2700,
          sessions: 12,
          duration: '12 ساعة فردية',
          durationEn: '12 individual hours'
        }
      ]
    },
    {
      id: 'advanced',
      name: 'متقدم',
      nameEn: 'Advanced',
      description: 'برامج تدريبية متقدمة للمدربين المحترفين',
      descriptionEn: 'Advanced training programs for professional riders',
      icon: '/icons/horse.svg',
      courses: [
        {
          id: 'advanced-daily',
          name: 'حصة يومية متقدمة',
          nameEn: 'Advanced Daily Session',
          price: 300,
          sessions: 1,
          duration: '1.5 ساعة',
          durationEn: '1.5 hours'
        },
        {
          id: 'advanced-8-sessions',
          name: '8 حصص متقدمة',
          nameEn: '8 Advanced Sessions',
          price: 2200,
          sessions: 8,
          duration: '12 ساعة',
          durationEn: '12 hours'
        },
        {
          id: 'advanced-12-sessions',
          name: '12 حصة متقدمة',
          nameEn: '12 Advanced Sessions',
          price: 3000,
          sessions: 12,
          duration: '18 ساعة',
          durationEn: '18 hours'
        },
        {
          id: 'advanced-12-individual',
          name: '12 حصة متقدمة فردية',
          nameEn: '12 Individual Advanced Sessions',
          price: 3800,
          sessions: 12,
          duration: '18 ساعة فردية',
          durationEn: '18 individual hours'
        }
      ]
    }
  ],
  availableDates: {
    // Mock disabled dates (already booked)
    disabledDates: ['2025-06-25', '2025-06-26', '2025-06-30', '2025-06-09'],
    // Available time slots for each day
    timeSlots: {
      weekdays: ['17:00', '18:00', '19:00', '20:00'],
      weekends: ['16:00', '17:00', '18:00', '19:00', '20:00']
    }
  }
};

// Mock API function
export const getTrainingData = async (): Promise<TrainingData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return mockTrainingData;
}; 