import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BookingData {
  // معلومات الاستراحة
  restId: string
  restName: string
  restHref: string
  
  // معلومات التواريخ
  selectedDates: string[]
  isMultipleMode: boolean
  
  // معلومات السعر
  basePrice: number
  weekendPrice: number
  totalPrice: number
  withBreakfast: boolean
  breakfastPrice: number
  
  // معلومات الحجز
  availability?: {
    overnight?: {
      checkIn: string
      checkOut: string
    }
    withoutOvernight?: {
      checkIn: string
      checkOut: string
    }
  }
  
  // معلومات إضافية
  agreeToTerms: boolean
  notes?: string
}

interface BookingStore {
  bookingData: BookingData | null
  
  // Actions
  setBookingData: (data: BookingData) => void
  updateBookingData: (updates: Partial<BookingData>) => void
  clearBookingData: () => void
  
  // Getters
  getBookingData: () => BookingData | null
  hasBookingData: () => boolean
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      bookingData: null,
      
      setBookingData: (data) => set({ bookingData: data }),
      
      updateBookingData: (updates) => set((state) => ({
        bookingData: state.bookingData 
          ? { ...state.bookingData, ...updates }
          : null
      })),
      
      clearBookingData: () => set({ bookingData: null }),
      
      getBookingData: () => get().bookingData,
      
      hasBookingData: () => !!get().bookingData,
    }),
    {
      name: 'booking-storage', // اسم المفتاح في localStorage
      // حفظ البيانات في localStorage لتبقى حتى بعد إغلاق المتصفح
    }
  )
) 