import { CalendarEvent } from "@/types/calendar";

export const mockCalendarEvents: CalendarEvent[] = [
  // Sunday (day 0) - July 6, 2025
  {
    id: "eq-001",
    title: "حصة فروسية",
    description: "تدريب فروسية للأطفال",
    type: "equestrian",
    date: "2025-07-06",
    startTime: "08:00",
    endTime: "09:00",
    client: "سعيد احمد",
    status: "active",
    location: "مدرسة الفروسية",
    day: 0
  },
  {
    id: "rest-001",
    title: "استراحة الصغيرة",
    description: "حجز عائلي",
    type: "rest",
    date: "2025-07-06",
    startTime: "10:00",
    endTime: "11:00",
    client: "عائلة الزهراني",
    status: "active",
    location: "الاستراحة الصغيرة",
    day: 0
  },
  
  // Monday (day 1) - July 7, 2025
  {
    id: "eq-002", 
    title: "حصة فروسية",
    description: "تدريب فروسية متقدم",
    type: "equestrian",
    date: "2025-07-07",
    startTime: "08:00",
    endTime: "09:00",
    client: "فهد محمد",
    status: "active",
    location: "مدرسة الفروسية",
    day: 1
  },
  {
    id: "nur-001",
    title: "طلب مشتل",
    description: "طلب نباتات زينة",
    type: "nursery",
    date: "2025-07-07",
    startTime: "09:00",
    endTime: "10:00",
    client: "نورا الغامدي",
    status: "pending",
    location: "المشتل الرئيسي",
    day: 1
  },
  {
    id: "eq-003",
    title: "حصة فروسية",
    description: "تدريب فروسية نسائي",
    type: "equestrian",
    date: "2025-07-07",
    startTime: "11:00",
    endTime: "12:00",
    client: "مها العتيبي",
    status: "active",
    location: "مدرسة الفروسية",
    day: 1
  },

  // Tuesday (day 2) - July 8, 2025
  {
    id: "nur-002",
    title: "طلب مشتل",
    description: "طلب نباتات للحديقة",
    type: "nursery", 
    date: "2025-07-08",
    startTime: "08:00",
    endTime: "09:00",
    client: "خالد عبدالله",
    status: "active",
    location: "المشتل الرئيسي",
    day: 2
  },
  {
    id: "rest-002",
    title: "استراحة الكبيرة",
    description: "حجز مناسبة عائلية",
    type: "rest",
    date: "2025-07-08",
    startTime: "09:00",
    endTime: "10:00",
    client: "عبدالرحمن السعيد",
    status: "active",
    location: "الاستراحة الكبيرة",
    day: 2
  },
  {
    id: "eq-004",
    title: "حصة فروسية",
    description: "تدريب فروسية للشباب",
    type: "equestrian",
    date: "2025-07-08",
    startTime: "11:00",
    endTime: "12:00",
    client: "عمر الحربي",
    status: "active",
    location: "مدرسة الفروسية",
    day: 2
  },

  // Wednesday (day 3) - July 9, 2025
  {
    id: "evt-001",
    title: "مناسبة عامة",
    description: "فعالية ثقافية",
    type: "event",
    date: "2025-07-09",
    startTime: "09:00",
    endTime: "11:00",
    client: "إدارة الفعاليات",
    status: "active",
    location: "القاعة الرئيسية",
    day: 3
  },
  {
    id: "nur-003",
    title: "طلب مشتل",
    description: "طلب أشجار زينة",
    type: "nursery",
    date: "2025-07-09",
    startTime: "11:00",
    endTime: "12:00",
    client: "سلطان الدوسري",
    status: "pending",
    location: "المشتل الرئيسي",
    day: 3
  },

  // Thursday (day 4) - July 10, 2025
  {
    id: "eq-005",
    title: "حصة فروسية",
    description: "تدريب فروسية للأطفال",
    type: "equestrian",
    date: "2025-07-10",
    startTime: "08:00",
    endTime: "09:00",
    client: "ريان العنزي",
    status: "active",
    location: "مدرسة الفروسية",
    day: 4
  },
  {
    id: "evt-002",
    title: "مناسبة عامة", 
    description: "ورشة تعليمية",
    type: "event",
    date: "2025-07-10",
    startTime: "10:00",
    endTime: "12:00",
    client: "إدارة التعليم",
    status: "active",
    location: "القاعة التعليمية",
    day: 4
  },

  // Friday (day 5) - July 11, 2025
  {
    id: "rest-003",
    title: "استراحة Green",
    description: "حجز استراحة للعائلة",
    type: "rest",
    date: "2025-07-11",
    startTime: "08:00",
    endTime: "09:00",
    client: "محمد سعيد",
    status: "active",
    location: "الاستراحة الخضراء",
    day: 5
  },
  {
    id: "nur-004",
    title: "طلب مشتل",
    description: "طلب نباتات داخلية",
    type: "nursery",
    date: "2025-07-11",
    startTime: "09:00",
    endTime: "10:00",
    client: "لما القحطاني",
    status: "active",
    location: "المشتل الرئيسي",
    day: 5
  },
  {
    id: "eq-006",
    title: "حصة فروسية",
    description: "تدريب فروسية متقدم",
    type: "equestrian",
    date: "2025-07-11",
    startTime: "11:00",
    endTime: "12:00",
    client: "سارة المطيري",
    status: "active",
    location: "مدرسة الفروسية",
    day: 5
  },

  // Saturday (day 6) - July 12, 2025
  {
    id: "rest-004",
    title: "استراحة Tiny",
    description: "حجز استراحة صغيرة",
    type: "rest",
    date: "2025-07-12",
    startTime: "08:00",
    endTime: "09:00",
    client: "أحمد الشهري",
    status: "active",
    location: "الاستراحة الصغيرة",
    day: 6
  },
  {
    id: "eq-007",
    title: "حصة فروسية",
    description: "تدريب فروسية للشباب",
    type: "equestrian",
    date: "2025-07-12",
    startTime: "09:00",
    endTime: "10:00",
    client: "يوسف البقمي",
    status: "active",
    location: "مدرسة الفروسية",
    day: 6
  },
  {
    id: "evt-003",
    title: "مناسبة عامة",
    description: "فعالية رياضية",
    type: "event",
    date: "2025-07-12",
    startTime: "10:00",
    endTime: "11:00",
    client: "النادي الرياضي",
    status: "active",
    location: "الملعب الرئيسي",
    day: 6
  },
  {
    id: "rest-005",
    title: "استراحة العائلية",
    description: "حجز مناسبة خاصة",
    type: "rest",
    date: "2025-07-12",
    startTime: "11:00",
    endTime: "12:00",
    client: "عائلة القرني",
    status: "pending",
    location: "الاستراحة العائلية",
    day: 6
  },

  // Additional events for next week (July 13-19, 2025)
  {
    id: "eq-008",
    title: "حصة فروسية",
    description: "تدريب فروسية للأطفال",
    type: "equestrian",
    date: "2025-07-13",
    startTime: "08:00",
    endTime: "09:00",
    client: "زياد العوفي",
    status: "active",
    location: "مدرسة الفروسية",
    day: 0
  },
  {
    id: "nur-005",
    title: "طلب مشتل",
    description: "طلب شتلات فواكه",
    type: "nursery",
    date: "2025-07-14",
    startTime: "09:00",
    endTime: "10:00",
    client: "منصور الغانم",
    status: "pending",
    location: "المشتل الرئيسي",
    day: 1
  },
  {
    id: "maintenance-001",
    title: "صيانة دورية",
    description: "صيانة معدات الفروسية",
    type: "maintenance",
    date: "2025-07-15",
    startTime: "08:00",
    endTime: "10:00",
    client: "فريق الصيانة",
    status: "active",
    location: "مدرسة الفروسية",
    day: 2
  },
  {
    id: "evt-004",
    title: "مؤتمر زراعي",
    description: "مؤتمر عن الزراعة المستدامة",
    type: "event",
    date: "2025-07-16",
    startTime: "09:00",
    endTime: "12:00",
    client: "وزارة الزراعة",
    status: "active",
    location: "قاعة المؤتمرات",
    day: 3
  }
];

// Simulate API call for calendar events
export const fetchCalendarEvents = async (): Promise<CalendarEvent[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockCalendarEvents;
};

// Function to get events for a specific week
export const getEventsForWeek = (weekStart: Date): CalendarEvent[] => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  return mockCalendarEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= weekStart && eventDate <= weekEnd;
  });
}; 