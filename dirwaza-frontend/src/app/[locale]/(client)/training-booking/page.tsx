import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import TrainingBookingClient from '@/components/training/TrainingBookingClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('TrainingBookingPage');
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

// Mock API data - Replace with real API calls in production
async function getTrainingData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    categories: [
      {
        id: 'children',
        name: 'الأطفال',
        nameEn: 'Children',
        description: 'برامج تدريبية مخصصة للأطفال من عمر 6 إلى 14 سنة',
        descriptionEn: 'Training programs for children aged 6 to 14 years',
        icon: '👶',
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
        id: 'youth',
        name: 'الشباب',
        nameEn: 'Youth',
        description: 'برامج تدريبية للشباب من عمر 15 إلى ما فوق',
        descriptionEn: 'Training programs for youth aged 15 and above',
        icon: '👨‍🦱',
        courses: [
          {
            id: 'youth-daily',
            name: 'حصة يومية',
            nameEn: 'Daily Session',
            price: 200,
            sessions: 1,
            duration: '1.5 ساعة',
            durationEn: '1.5 hours'
          },
          {
            id: 'youth-10-sessions',
            name: '10 حصص تدريبية',
            nameEn: '10 Training Sessions',
            price: 1800,
            sessions: 10,
            duration: '15 ساعة',
            durationEn: '15 hours'
          }
        ]
      },
      {
        id: 'women',
        name: 'النساء',
        nameEn: 'Women',
        description: 'برامج تدريبية للنساء من جميع الأعمار',
        descriptionEn: 'Training programs for women of all ages',
        icon: '👩',
        courses: [
          {
            id: 'women-daily',
            name: 'حصة يومية',
            nameEn: 'Daily Session',
            price: 190,
            sessions: 1,
            duration: '1 ساعة',
            durationEn: '1 hour'
          },
          {
            id: 'women-group',
            name: 'حصص جماعية',
            nameEn: 'Group Sessions',
            price: 1500,
            sessions: 8,
            duration: '8 ساعات جماعية',
            durationEn: '8 group hours'
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
}

export default async function TrainingBookingPage({
  searchParams
}: {
  searchParams: { step?: string }
}) {
  const data = await getTrainingData();
  const step = searchParams.step ? parseInt(searchParams.step) : 1;

  return (
    <div className="min-h-screen ">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        <TrainingBookingClient 
          initialData={data}
          initialStep={step}
        />
      </Suspense>
    </div>
  );
} 