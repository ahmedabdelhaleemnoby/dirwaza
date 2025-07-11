// Nursery inventory data types
export interface Plant {
  id: string;
  name: string;
  nameEn: string;
  status: string;
  statusEn: string;
  price?: number;
  quantity?: number;
  image: string;
  isAvailable: boolean;
  category: string;
}

export interface InventoryApiData {
  unavailablePlants: Plant[];
  availablePlants: Plant[];
  totalUnavailable: number;
  totalAvailable: number;
}

// Inventory status mock data
export const mockInventoryData: InventoryApiData = {
  unavailablePlants: [
    {
      id: "1",
      name: "نخيل",
      nameEn: "Palm Tree",
      status: "نفذ من المخزون",
      statusEn: "Out of Stock",
      image: "/images/plants/1101b35d05734e4a3fb4665398bab88594651db4.png",
      isAvailable: false,
      category: "outdoor",
    },
    {
      id: "2",
      name: "مجموعة صبار",
      nameEn: "Cactus Collection",
      status: "نفذ من المخزون",
      statusEn: "Out of Stock",
      image: "/images/plants/5f6e073a6717cab45b081f91525324f08ee20eb8.png",
      isAvailable: false,
      category: "succulent",
    },
    {
      id: "3",
      name: "بونساي مزهر",
      nameEn: "Flowering Bonsai",
      status: "نفذ من المخزون",
      statusEn: "Out of Stock",
      image: "/images/plants/799b6543686f94732a27dc90e513a1ee556058f4.png",
      isAvailable: false,
      category: "indoor",
    },
  ],
  availablePlants: [
    {
      id: "4",
      name: "نباتات داخلية",
      nameEn: "Indoor Plants",
      status: "متوفر: 28 قطعة",
      statusEn: "Available: 28 pieces",
      price: 75,
      quantity: 28,
      image: "/images/plants/dieffenbachia.jpg",
      isAvailable: true,
      category: "indoor",
    },
    {
      id: "5",
      name: "أشجار فاكهة",
      nameEn: "Fruit Trees",
      status: "متوفر: 15 قطعة",
      statusEn: "Available: 15 pieces",
      price: 150,
      quantity: 15,
      image: "/images/plants/monstera.jpg",
      isAvailable: true,
      category: "outdoor",
    },
    {
      id: "6",
      name: "نباتات عطرية",
      nameEn: "Aromatic Plants",
      status: "متوفر: 20 قطعة",
      statusEn: "Available: 20 pieces",
      price: 45,
      quantity: 20,
      image: "/images/plants/snake-plant.jpg",
      isAvailable: true,
      category: "aromatic",
    },
  ],
  totalUnavailable: 8,
  totalAvailable: 35,
};

// Order data types
export interface Customer {
  name: string;
  phone: string;
  avatar: string;
}

export interface Order {
  id: string;
  customer: Customer;
  products: string;
  price: string;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

export interface OrdersApiData {
  orders: Order[];
  totalOrders: number;
  currentPage: number;
  totalPages: number;
}

// Nursery orders mock data
export const mockNurseryOrders: Order[] = [
  {
    id: "#2859",
    customer: {
      name: "نورة الحربي",
      phone: "+966 55 123 4567",
      avatar: "/images/avatars/user1.png"
    },
    products: "هدية زهور (5)،",
    price: "750",
    status: "new",
    date: "23 يونيو 2025"
  },
  {
    id: "#2858", 
    customer: {
      name: "فهد العتيبي",
      phone: "+966 55 234 5678",
      avatar: "/images/avatars/user2.png"
    },
    products: "أشجار نخيل (2)، نباتات صبار (5)",
    price: "920",
    status: "processing",
    date: "22 يونيو 2025"
  },
  {
    id: "#2857",
    customer: {
      name: "سارة القحطاني", 
      phone: "+966 55 345 6789",
      avatar: "/images/avatars/user3.png"
    },
    products: "شتلات زهور (5)، أشجار فاكهة",
    price: "1,250",
    status: "processing",
    date: "21 يونيو 2025"
  },
  {
    id: "#2856",
    customer: {
      name: "احمد القحطاني",
      phone: "+966 55 345 6789", 
      avatar: "/images/avatars/user4.png"
    },
    products: "هدية نخيل (2)، نباتات صبار (5)",
    price: "1,800",
    status: "completed",
    date: "20 يونيو 2025"
  },
  {
    id: "#2855",
    customer: {
      name: "منيرة الدوسري",
      phone: "+966 55 567 8901",
      avatar: "/images/avatars/user5.png"
    },
    products: "شتلات خضروات (15)، أسمدة",
    price: "520", 
    status: "cancelled",
    date: "19 يونيو 2025"
  },
  {
    id: "#2854",
    customer: {
      name: "احمد القحطاني",
      phone: "+966 55 345 6789",
      avatar: "/images/avatars/user6.png"
    },
    products: "أشجار نخيل (2)، نباتات صبار (5)",
    price: "1,800",
    status: "completed", 
    date: "18 يونيو 2025"
  },
  {
    id: "#2853",
    customer: {
      name: "خالد المطيري",
      phone: "+966 55 678 9012",
      avatar: "/images/avatars/user7.png"
    },
    products: "نباتات زينة (8)، أحواض",
    price: "650", 
    status: "new",
    date: "17 يونيو 2025"
  },
  {
    id: "#2852",
    customer: {
      name: "فاطمة الزهراني",
      phone: "+966 55 789 0123",
      avatar: "/images/avatars/user8.png"
    },
    products: "بذور خضروات (10)، تربة",
    price: "420", 
    status: "processing",
    date: "16 يونيو 2025"
  },
];

// Order statistics data types
export interface OrderStatData {
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative';
}

export interface ApiStatData {
  inventoryLevel: OrderStatData;
  totalOrders: OrderStatData;
  newOrders: OrderStatData;
  processing: OrderStatData;
  completed: OrderStatData;
}

// Order statistics mock data
export const mockOrderStatistics: ApiStatData = {
  inventoryLevel: {
    value: "85%",
    change: "-5%",
    changeType: "negative",
  },
  totalOrders: {
    value: 86,
    change: "+12%",
    changeType: "positive",
  },
  newOrders: {
    value: 24,
    change: "+8%",
    changeType: "positive",
  },
  processing: {
    value: 32,
    change: "+15%",
    changeType: "positive",
  },
  completed: {
    value: 30,
    change: "+5%",
    changeType: "positive",
  },
};

// Order filter options
export const mockOrderFilterOptions = {
  dateOptions: [
    { id: "all", label: "جميع التواريخ", labelEn: "All Dates", value: "all" },
    { id: "today", label: "اليوم", labelEn: "Today", value: "today" },
    { id: "week", label: "هذا الأسبوع", labelEn: "This Week", value: "week" },
    { id: "month", label: "هذا الشهر", labelEn: "This Month", value: "month" },
  ],
  statusOptions: [
    { id: "all", label: "جميع الحالات", labelEn: "All Status", value: "all" },
    { id: "new", label: "جديد", labelEn: "New", value: "new" },
    { id: "processing", label: "قيد المعالجة", labelEn: "Processing", value: "processing" },
    { id: "completed", label: "مكتمل", labelEn: "Completed", value: "completed" },
    { id: "cancelled", label: "ملغي", labelEn: "Cancelled", value: "cancelled" },
  ],
};

// Mock API functions
export const fetchInventoryData = async (): Promise<InventoryApiData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return mockInventoryData;
};

export const fetchOrdersData = async (page: number = 1, perPage: number = 6): Promise<OrdersApiData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const orders = mockNurseryOrders.slice(startIndex, endIndex);

  return {
    orders,
    totalOrders: mockNurseryOrders.length,
    currentPage: page,
    totalPages: Math.ceil(mockNurseryOrders.length / perPage)
  };
};

export const fetchOrderStatistics = async (): Promise<ApiStatData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return mockOrderStatistics;
};

export const fetchOrderFilters = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockOrderFilterOptions;
}; 