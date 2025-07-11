import { CalendarData } from "@/types/rest";
import { SessionCalendarTrainingBlock } from "@/types/training";

// Helper function to create a date string
const createDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const mockCalendarData: CalendarData = {
  basePrice: 450,
  weekendPrice: 600,
  
  // Disabled dates (e.g., already booked or maintenance)
  disabledDates: [
    createDate(25),
    createDate(26),
    createDate(27),
    createDate(30),
  ],
};
export const mockSessionCalendarTrainingBlock: SessionCalendarTrainingBlock[] = [
  {
      "id": "0-0-0",
      "trainee": "أحمد المالكي",
      "startTime": "08:00",
      "endTime": "9:30",
      "type": "daily",
      "date": "2025-06-22",
      "day": 0
  },
  {
      "id": "0-0-1",
      "trainee": "محمد العتيبي",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "group",
      "date": "2025-06-22",
      "day": 0
  },
  {
      "id": "0-1-0",
      "trainee": "محمد العتيبي",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "group",
      "date": "2025-06-23",
      "day": 1
  },
  {
      "id": "0-1-1",
      "trainee": "فهد العتيبي",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "individual",
      "date": "2025-06-23",
      "day": 1
  },
  {
      "id": "0-2-0",
      "trainee": "فهد العتيبي",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "individual",
      "date": "2025-06-24",
      "day": 2
  },
  {
      "id": "0-2-1",
      "trainee": "سارة الغامدي",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "advanced",
      "date": "2025-06-24",
      "day": 2
  },
  {
      "id": "0-3-0",
      "trainee": "سارة الغامدي",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "advanced",
      "date": "2025-06-25",
      "day": 3
  },
  {
      "id": "0-4-0",
      "trainee": "امير العتيبي",
      "startTime": "08:00",
      "endTime": "9:30",
      "type": "daily",
      "date": "2025-06-26",
      "day": 4
  },
  {
      "id": "0-5-0",
      "trainee": "سارة العتيبي",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "group",
      "date": "2025-06-27",
      "day": 5
  },
  {
      "id": "0-5-1",
      "trainee": "خالد الأحمد",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "individual",
      "date": "2025-06-27",
      "day": 5
  },
  {
      "id": "0-5-2",
      "trainee": "نورا السعيد",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "advanced",
      "date": "2025-06-27",
      "day": 5
  },
  {
      "id": "0-6-0",
      "trainee": "خالد الأحمد",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "individual",
      "date": "2025-06-28",
      "day": 6
  },
  {
      "id": "0-6-1",
      "trainee": "نورا السعيد",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "advanced",
      "date": "2025-06-28",
      "day": 6
  },
  {
      "id": "1-0-0",
      "trainee": "نورا السعيد",
      "startTime": "08:00",
      "endTime": "9:30",
      "type": "group",
      "date": "2025-06-29",
      "day": 0
  },
  {
      "id": "1-0-1",
      "trainee": "يوسف الحربي",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "individual",
      "date": "2025-06-29",
      "day": 0
  },
  {
      "id": "1-1-0",
      "trainee": "يوسف الحربي",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "individual",
      "date": "2025-06-30",
      "day": 1
  },
  {
      "id": "1-1-1",
      "trainee": "مريم القحطاني",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "advanced",
      "date": "2025-06-30",
      "day": 1
  },
  {
      "id": "1-1-2",
      "trainee": "عبدالله الزهراني",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "daily",
      "date": "2025-06-30",
      "day": 1
  },
  {
      "id": "1-2-0",
      "trainee": "مريم القحطاني",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "advanced",
      "date": "2025-07-01",
      "day": 2
  },
  {
      "id": "1-2-1",
      "trainee": "عبدالله الزهراني",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "daily",
      "date": "2025-07-01",
      "day": 2
  },
  {
      "id": "1-2-2",
      "trainee": "فاطمة العلي",
      "startTime": "08:00",
      "endTime": "9:30",
      "type": "group",
      "date": "2025-07-01",
      "day": 2
  },
  {
      "id": "1-3-0",
      "trainee": "عبدالله الزهراني",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "daily",
      "date": "2025-07-02",
      "day": 3
  },
  {
      "id": "1-4-0",
      "trainee": "فاطمة العلي",
      "startTime": "08:00",
      "endTime": "9:30",
      "type": "group",
      "date": "2025-07-03",
      "day": 4
  },
  {
      "id": "1-5-0",
      "trainee": "ماجد الدوسري",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "individual",
      "date": "2025-07-04",
      "day": 5
  },
  {
      "id": "1-5-1",
      "trainee": "رنا المطيري",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "advanced",
      "date": "2025-07-04",
      "day": 5
  },
  {
      "id": "1-5-2",
      "trainee": "طارق العثمان",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "daily",
      "date": "2025-07-04",
      "day": 5
  },
  {
      "id": "1-6-0",
      "trainee": "رنا المطيري",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "advanced",
      "date": "2025-07-05",
      "day": 6
  },
  {
      "id": "1-6-1",
      "trainee": "طارق العثمان",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "daily",
      "date": "2025-07-05",
      "day": 6
  },
  {
      "id": "2-0-0",
      "trainee": "طارق العثمان",
      "startTime": "08:00",
      "endTime": "9:30",
      "type": "individual",
      "date": "2025-07-06",
      "day": 0
  },
  {
      "id": "2-0-1",
      "trainee": "ليلى الشهري",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "advanced",
      "date": "2025-07-06",
      "day": 0
  },
  {
      "id": "2-1-0",
      "trainee": "ليلى الشهري",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "advanced",
      "date": "2025-07-07",
      "day": 1
  },
  {
      "id": "2-2-0",
      "trainee": "أحمد المالكي",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "daily",
      "date": "2025-07-08",
      "day": 2
  },
  {
      "id": "2-2-1",
      "trainee": "محمد العتيبي",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "group",
      "date": "2025-07-08",
      "day": 2
  },
  {
      "id": "2-3-0",
      "trainee": "محمد العتيبي",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "group",
      "date": "2025-07-09",
      "day": 3
  },
  {
      "id": "2-4-0",
      "trainee": "فهد العتيبي",
      "startTime": "08:00",
      "endTime": "9:30",
      "type": "individual",
      "date": "2025-07-10",
      "day": 4
  },
  {
      "id": "2-4-1",
      "trainee": "سارة الغامدي",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "advanced",
      "date": "2025-07-10",
      "day": 4
  },
  {
      "id": "2-4-2",
      "trainee": "امير العتيبي",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "daily",
      "date": "2025-07-10",
      "day": 4
  },
  {
      "id": "2-5-0",
      "trainee": "سارة الغامدي",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "advanced",
      "date": "2025-07-11",
      "day": 5
  },
  {
      "id": "2-5-1",
      "trainee": "امير العتيبي",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "daily",
      "date": "2025-07-11",
      "day": 5
  },
  {
      "id": "2-5-2",
      "trainee": "سارة العتيبي",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "group",
      "date": "2025-07-11",
      "day": 5
  },
  {
      "id": "3-0-0",
      "trainee": "سارة العتيبي",
      "startTime": "08:00",
      "endTime": "9:30",
      "type": "advanced",
      "date": "2025-07-13",
      "day": 0
  },
  {
      "id": "3-0-1",
      "trainee": "خالد الأحمد",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "daily",
      "date": "2025-07-13",
      "day": 0
  },
  {
      "id": "3-1-0",
      "trainee": "خالد الأحمد",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "daily",
      "date": "2025-07-14",
      "day": 1
  },
  {
      "id": "3-1-1",
      "trainee": "نورا السعيد",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "group",
      "date": "2025-07-14",
      "day": 1
  },
  {
      "id": "3-1-2",
      "trainee": "يوسف الحربي",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "individual",
      "date": "2025-07-14",
      "day": 1
  },
  {
      "id": "3-2-0",
      "trainee": "نورا السعيد",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "group",
      "date": "2025-07-15",
      "day": 2
  },
  {
      "id": "3-2-1",
      "trainee": "يوسف الحربي",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "individual",
      "date": "2025-07-15",
      "day": 2
  },
  {
      "id": "3-2-2",
      "trainee": "مريم القحطاني",
      "startTime": "08:00",
      "endTime": "9:30",
      "type": "advanced",
      "date": "2025-07-15",
      "day": 2
  },
  {
      "id": "3-3-0",
      "trainee": "يوسف الحربي",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "individual",
      "date": "2025-07-16",
      "day": 3
  },
  {
      "id": "3-3-1",
      "trainee": "مريم القحطاني",
      "startTime": "08:00",
      "endTime": "9:30",
      "type": "advanced",
      "date": "2025-07-16",
      "day": 3
  },
  {
      "id": "3-3-2",
      "trainee": "عبدالله الزهراني",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "daily",
      "date": "2025-07-16",
      "day": 3
  },
  {
      "id": "3-4-0",
      "trainee": "مريم القحطاني",
      "startTime": "08:00",
      "endTime": "9:30",
      "type": "advanced",
      "date": "2025-07-17",
      "day": 4
  },
  {
      "id": "3-4-1",
      "trainee": "عبدالله الزهراني",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "daily",
      "date": "2025-07-17",
      "day": 4
  },
  {
      "id": "3-5-0",
      "trainee": "عبدالله الزهراني",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "daily",
      "date": "2025-07-18",
      "day": 5
  },
  {
      "id": "3-5-1",
      "trainee": "فاطمة العلي",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "group",
      "date": "2025-07-18",
      "day": 5
  },
  {
      "id": "3-5-2",
      "trainee": "ماجد الدوسري",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "individual",
      "date": "2025-07-18",
      "day": 5
  },
  {
      "id": "4-0-0",
      "trainee": "ماجد الدوسري",
      "startTime": "08:00",
      "endTime": "9:30",
      "type": "daily",
      "date": "2025-07-20",
      "day": 0
  },
  {
      "id": "4-0-1",
      "trainee": "رنا المطيري",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "group",
      "date": "2025-07-20",
      "day": 0
  },
  {
      "id": "4-1-0",
      "trainee": "رنا المطيري",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "group",
      "date": "2025-07-21",
      "day": 1
  },
  {
      "id": "4-1-1",
      "trainee": "طارق العثمان",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "individual",
      "date": "2025-07-21",
      "day": 1
  },
  {
      "id": "4-1-2",
      "trainee": "ليلى الشهري",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "advanced",
      "date": "2025-07-21",
      "day": 1
  },
  {
      "id": "4-2-0",
      "trainee": "طارق العثمان",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "individual",
      "date": "2025-07-22",
      "day": 2
  },
  {
      "id": "4-2-1",
      "trainee": "ليلى الشهري",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "advanced",
      "date": "2025-07-22",
      "day": 2
  },
  {
      "id": "4-2-2",
      "trainee": "أحمد المالكي",
      "startTime": "08:00",
      "endTime": "9:30",
      "type": "daily",
      "date": "2025-07-22",
      "day": 2
  },
  {
      "id": "4-3-0",
      "trainee": "ليلى الشهري",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "advanced",
      "date": "2025-07-23",
      "day": 3
  },
  {
      "id": "4-4-0",
      "trainee": "أحمد المالكي",
      "startTime": "08:00",
      "endTime": "9:30",
      "type": "daily",
      "date": "2025-07-24",
      "day": 4
  },
  {
      "id": "4-4-1",
      "trainee": "محمد العتيبي",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "group",
      "date": "2025-07-24",
      "day": 4
  },
  {
      "id": "4-5-0",
      "trainee": "محمد العتيبي",
      "startTime": "09:00",
      "endTime": "10:30",
      "type": "group",
      "date": "2025-07-25",
      "day": 5
  },
  {
      "id": "4-5-1",
      "trainee": "فهد العتيبي",
      "startTime": "10:00",
      "endTime": "11:30",
      "type": "individual",
      "date": "2025-07-25",
      "day": 5
  },
  {
      "id": "4-5-2",
      "trainee": "سارة الغامدي",
      "startTime": "11:00",
      "endTime": "12:30",
      "type": "advanced",
      "date": "2025-07-25",
      "day": 5
  }
];