import { Booking } from "@/types/profile";

// Profile bookings mock data
export const mockProfileBookings: Booking[] = [
  // Rest bookings
  {
    id: "1",
    title: "The Green",
    location: "اللؤلؤة، الدوحة",
    date: "21 يونيو 2025",
    time: "من 4:00 م إلى 12:00 ص",
    status: "confirmed",
    image: "/images/resort1.jpg",
    type: "rest",
  },
  {
    id: "2",
    title: "The Long",
    location: "اللؤلؤة، الدوحة",
    date: "28 يونيو 2025",
    time: "من 2:00 م إلى 10:00 م",
    status: "pending",
    image: "/images/resort2.jpg",
    type: "rest",
  },
  {
    id: "3",
    title: "Tiny House",
    location: "اللؤلؤة، الدوحة",
    date: "15 مايو 2025",
    time: "من 6:00 م إلى 2:00 ص",
    status: "confirmed",
    image: "/images/resort3.jpg",
    type: "rest",
  },
  
  // Operator bookings
  {
    id: "4",
    title: "نباتات الزينة",
    location: "مزرعة الدروازة",
    date: "25 يونيو 2025",
    time: "طلب مؤكد",
    status: "confirmed",
    image: "/images/plants/monstera.jpg",
    type: "operator",
  },
  {
    id: "5",
    title: "نباتات الحدائق",
    location: "مزرعة الدروازة",
    date: "30 يونيو 2025",
    time: "قيد التوصيل",
    status: "pending",
    image: "/images/plants/snake-plant.jpg",
    type: "operator",
  },
  {
    id: "6",
    title: "نباتات داخلية",
    location: "مزرعة الدروازة",
    date: "20 مايو 2025",
    time: "تم التوصيل",
    status: "confirmed",
    image: "/images/plants/dieffenbachia.jpg",
    type: "operator",
  },
  
  // Training bookings
  {
    id: "7",
    title: "تدريب الأطفال",
    location: "مزرعة الدروازة",
    date: "24 يونيو 2025",
    time: "من 3:00 م إلى 5:00 م",
    status: "confirmed",
    image: "/images/service1.svg",
    type: "training",
  },
  {
    id: "8",
    title: "تدريب النساء",
    location: "مزرعة الدروازة",
    date: "27 يونيو 2025",
    time: "من 4:00 م إلى 6:00 م",
    status: "pending",
    image: "/images/service2.svg",
    type: "training",
  },
  {
    id: "9",
    title: "تدريب متقدم",
    location: "مزرعة الدروازة",
    date: "18 مايو 2025",
    time: "من 2:00 م إلى 4:00 م",
    status: "confirmed",
    image: "/images/service3.svg",
    type: "training",
  },
];

// Rest reservations table data types
export interface Reservation {
  id: string;
  clientName: string;
  clientPhone: string;
  restName: string;
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  bookingType: 'withStay' | 'withoutStay';
  reservationStatus: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'halfAmount' | 'fullAmount';
}

export interface TableData<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

// Rest reservations mock data
export const mockReservations: Reservation[] = [
  {
    id: 'RES-1025',
    clientName: 'سارة الأحمد',
    clientPhone: '+966 50 987 6543',
    restName: 'The Long',
    checkInDate: '27 يونيو 2025',
    checkInTime: '10:00 ص',
    checkOutDate: '27 يونيو 2025',
    checkOutTime: '10:00 م',
    bookingType: 'withoutStay',
    reservationStatus: 'confirmed',
    paymentStatus: 'halfAmount'
  },
  {
    id: 'RES-1024',
    clientName: 'سارة الأحمد',
    clientPhone: '+966 50 987 6543',
    restName: 'The Long',
    checkInDate: '27 يونيو 2025',
    checkInTime: '10:00 ص',
    checkOutDate: '27 يونيو 2025',
    checkOutTime: '10:00 م',
    bookingType: 'withoutStay',
    reservationStatus: 'confirmed',
    paymentStatus: 'halfAmount'
  },
  {
    id: 'RES-1023',
    clientName: 'فهد المطيري',
    clientPhone: '+966 54 321 9876',
    restName: 'The Green House',
    checkInDate: '30 يونيو 2025',
    checkInTime: '03:00 م',
    checkOutDate: '02 يوليو 2025',
    checkOutTime: '12:00 م',
    bookingType: 'withStay',
    reservationStatus: 'pending',
    paymentStatus: 'halfAmount'
  },
  {
    id: 'RES-1022',
    clientName: 'محمد العبدالله',
    clientPhone: '+966 55 123 4567',
    restName: 'The Long',
    checkInDate: '05 يوليو 2025',
    checkInTime: '12:00 م',
    checkOutDate: '05 يوليو 2025',
    checkOutTime: '11:00 م',
    bookingType: 'withoutStay',
    reservationStatus: 'confirmed',
    paymentStatus: 'fullAmount'
  },
  {
    id: 'RES-1021',
    clientName: 'سارة الأحمد',
    clientPhone: '+966 50 987 6543',
    restName: 'The Green House',
    checkInDate: '10 يوليو 2025',
    checkInTime: '02:00 م',
    checkOutDate: '12 يوليو 2025',
    checkOutTime: '12:00 م',
    bookingType: 'withStay',
    reservationStatus: 'cancelled',
    paymentStatus: 'halfAmount'
  }
];

// Reservation statistics data types
export interface ReservationStatData {
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative';
}

export interface ApiReservationStatData {
  occupancyRate: ReservationStatData;
  cancelledReservations: ReservationStatData;
  confirmedReservations: ReservationStatData;
  totalReservations: ReservationStatData;
}

// Reservation statistics mock data
export const mockReservationStatistics: ApiReservationStatData = {
  occupancyRate: {
    value: '76',
    change: '+5%',
    changeType: 'positive',
  },
  cancelledReservations: {
    value: 12,
    change: '-3%',
    changeType: 'negative',
  },
  confirmedReservations: {
    value: 86,
    change: '+12%',
    changeType: 'positive',
  },
  totalReservations: {
    value: '85%',
    change: '+12%',
    changeType: 'positive',
  },
};

// Reservation filter options
export const mockReservationFilterOptions = {
  statusOptions: [
    { id: "all", label: "جميع الحالات", labelEn: "All Statuses", value: "all" },
    { id: "confirmed", label: "مؤكد", labelEn: "Confirmed", value: "confirmed" },
    { id: "pending", label: "قيد التأكيد", labelEn: "Pending Confirmation", value: "pending" },
    { id: "cancelled", label: "ملغي", labelEn: "Cancelled", value: "cancelled" },
  ],
};

// Mock API functions
export const fetchReservations = async (): Promise<TableData<Reservation>> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    items: mockReservations,
    totalItems: 45,
    currentPage: 1,
    totalPages: 9,
    loading: false,
    error: null
  };
};

export const fetchReservationStatistics = async (): Promise<ApiReservationStatData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return mockReservationStatistics;
};

export const fetchReservationFilters = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockReservationFilterOptions;
}; 