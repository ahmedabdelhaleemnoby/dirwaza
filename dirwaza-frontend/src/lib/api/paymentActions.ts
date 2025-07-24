"use server";

// Types for Plant Booking API
export interface PlantOrderItem {
  plantId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface DeliveryAddress {
  district: string;
  city: string;
  streetName: string;
  addressDetails: string;
}

export interface RecipientPerson {
  recipientName: string;
  phoneNumber: string;
  message: string;
  deliveryDate: string;
}

export interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface CreatePlantBookingRequest {
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderType: "plants";
  paymentMethod: "card" | "applePay";
  recipientPerson?: RecipientPerson;
  deliveryAddress: DeliveryAddress;
  deliveryDate: string;
  deliveryTime: string;
  cardDetails: CardDetails;
  orderData: PlantOrderItem[];
}

// Types for REST Booking API
export interface CreateRestBookingRequest {
  fullName: string;
  email: string;
  phone: string;
  cardDetails: CardDetails;
  paymentAmount: "full" | "partial";
  paymentMethod: "card" | "applePay";
  totalPrice: number;
  totalPaid: number;
  overnight: boolean;
  checkIn: string[];
  restId: string;
}

// Types for Horse Booking API
export interface HorsePersonalInfo {
  fullName: string;
  parentName: string;
  age: string;
  mobileNumber: string;
  previousTraining: boolean;
  notes: string;
}

export interface HorseAppointment {
  date: string;
  timeSlot: string;
}

export interface CreateHorseBookingRequest {
  agreedToTerms: boolean;
  personalInfo: HorsePersonalInfo;
  numberPersons: number;
  selectedCategoryId: string;
  selectedCourseId: string;
  selectedAppointments: HorseAppointment[];
}

export interface PaymentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  isNewUser: boolean;
}

export interface CreateBookingResponse {
  success: boolean;
  paymentId: string;
  paymentUrl: string;
  reference: string;
  sessionId: string;
  uuid: string;
  amount: number;
  currency: string;
  user: PaymentUser;
  expiresAt: string;
  message: string;
}

export interface PaymentStatus {
  paymentId: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  amount: number;
  currency: string;
  reference: string;
  updatedAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
}

// Helper function to get API URL
const getApiUrl = () => {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001/api"
  );
};

// Create plant booking order
export async function createPlantBookingAction(
  orderData: CreatePlantBookingRequest
): Promise<ApiResponse<CreateBookingResponse>> {
  try {
    const apiUrl = getApiUrl();

    const response = await fetch(`${apiUrl}/bookings/plants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData?.message || `HTTP error! status: ${response.status}`,
        message: errorData?.message || `HTTP error! status: ${response.status}`,
      };
      // throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const result: CreateBookingResponse = await response.json();
    console.log(result, "result");
    return {
      success: true,
      data: result,
      message: result.message || "تم إنشاء رابط الدفع بنجاح",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create plant booking",
      message: "فشل في إنشاء طلب الدفع",
    };
  }
}

// Create REST booking order
export async function createRestBookingAction(
  orderData: CreateRestBookingRequest
): Promise<ApiResponse<CreateBookingResponse>> {
  try {
    const apiUrl = getApiUrl();

    const response = await fetch(`${apiUrl}/bookings/rest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData?.message || `HTTP error! status: ${response.status}`,
        message: errorData?.message || `HTTP error! status: ${response.status}`,
      };
    }

    const result: CreateBookingResponse = await response.json();

    return {
      success: true,
      data: result,
      message: result.message || "تم إنشاء رابط الدفع بنجاح",
    };
  } catch (error) {
    console.error("Create REST booking error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create REST booking",
      message: "فشل في إنشاء حجز الاستراحة",
    };
  }
}

// Create Horse booking order
export async function createHorseBookingAction(
  orderData: CreateHorseBookingRequest
): Promise<ApiResponse<CreateBookingResponse>> {
  try {
    const apiUrl = getApiUrl();

    const response = await fetch(`${apiUrl}/bookings/horse`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData?.message || `HTTP error! status: ${response.status}`,
        message: errorData?.message || `HTTP error! status: ${response.status}`
      };
    }

    const result: CreateBookingResponse = await response.json();

    return {
      success: true,
      data: result,
      message: result.message || "تم إنشاء رابط الدفع بنجاح",
    };
  } catch (error) {
    console.error("Create horse booking error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create horse booking",
      message: "فشل في إنشاء حجز الفروسية",
    };
  }
}

// Check payment status (for monitoring URL changes)
export async function checkPaymentStatusAction(
  paymentId: string
): Promise<ApiResponse<PaymentStatus>> {
  try {
    const apiUrl = getApiUrl();

    const response = await fetch(`${apiUrl}/payment/status/${paymentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData?.message || `HTTP error! status: ${response.status}`,
        message: errorData?.message || `HTTP error! status: ${response.status}`
      };
    }

    const result = await response.json();

    return {
      success: true,
      data: result,
      message: "تم جلب حالة الدفع بنجاح",
    };
  } catch (error) {
    console.error("Check payment status error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to check payment status",
      message: "فشل في جلب حالة الدفع",
    };
  }
}
