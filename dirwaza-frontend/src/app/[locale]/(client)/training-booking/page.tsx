import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import TrainingBookingClient from '@/components/training/TrainingBookingClient';
import { getTrainingData } from '@/__mocks__/training.mock';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('TrainingBookingPage');
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function TrainingBookingPage({
  searchParams
}: {
  searchParams: Promise<{ step?: string }>
}) {
  const data = await getTrainingData();
  const resolvedSearchParams = await searchParams;
  const step = resolvedSearchParams.step ? parseInt(resolvedSearchParams.step) : 1;

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