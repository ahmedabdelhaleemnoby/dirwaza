import { useBookingStore, type BookingData } from '@/store/bookingStore'
import { useRouter } from '@/i18n/navigation'
import { useCallback } from 'react'

export function useBooking() {
  const store = useBookingStore()
  const router = useRouter()

  // حفظ بيانات الحجز والانتقال للدفع
  const saveBookingAndNavigateToPayment = useCallback((bookingData: BookingData) => {
    store.setBookingData(bookingData)
    router.push('/rest/payment')
  }, [store, router])

  // الانتقال للدفع إذا كانت البيانات موجودة
  const navigateToPaymentIfDataExists = useCallback(() => {
    if (store.hasBookingData()) {
      router.push('/rest/payment')
    } else {
      throw new Error('لا توجد بيانات حجز')
    }
  }, [store, router])

  // مسح البيانات والعودة للصفحة الرئيسية
  const clearAndNavigateToHome = useCallback(() => {
    store.clearBookingData()
    router.push('/rest')
  }, [store, router])

  // التحقق من وجود البيانات المطلوبة
  const validateBookingData = useCallback(() => {
    const data = store.getBookingData()
    if (!data) return { isValid: false, error: 'لا توجد بيانات حجز' }
    if (!data.selectedDates.length) return { isValid: false, error: 'لم يتم اختيار تواريخ' }
    if (!data.agreeToTerms) return { isValid: false, error: 'يجب الموافقة على الشروط' }
    return { isValid: true }
  }, [store])

  return {
    // Store methods
    ...store,
    
    // Helper methods
    saveBookingAndNavigateToPayment,
    navigateToPaymentIfDataExists,
    clearAndNavigateToHome,
    validateBookingData,
    
    // Computed values
    totalDays: store.bookingData?.selectedDates.length || 0,
    isValid: validateBookingData().isValid,
  }
} 