import { create } from 'zustand'

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
  isHydrated: boolean
  
  // Actions
  setBookingData: (data: BookingData) => void
  updateBookingData: (updates: Partial<BookingData>) => void
  clearBookingData: () => void
  hydrate: (data: BookingData | null) => void
  
  // Getters
  getBookingData: () => BookingData | null
  hasBookingData: () => boolean
}

export const useBookingStore = create<BookingStore>()((set, get) => ({
  bookingData: null,
  isHydrated: false,
  
  setBookingData: (data) => set({ bookingData: data }),
  
  updateBookingData: (updates) => set((state) => ({
    bookingData: state.bookingData 
      ? { ...state.bookingData, ...updates }
      : null
  })),
  
  clearBookingData: () => set({ bookingData: null }),
  
  hydrate: (data) => set({ bookingData: data, isHydrated: true }),
  
  getBookingData: () => get().bookingData,
  
  hasBookingData: () => !!get().bookingData,
})) 