import { Suspense } from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import TrainingBookingClient from '@/components/training/TrainingBookingClient';
import { getTrainingData } from '@/lib/api';

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
  const resolvedSearchParams = await searchParams;
  const step = resolvedSearchParams.step ? parseInt(resolvedSearchParams.step) : 1;

  let data = null;
  let error = null;

  try {
    data = await getTrainingData();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to fetch training data';
    console.error('Error fetching training data:', err);
  }

  // Handle error case
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">
            {error || 'Failed to load training data'}
          </div>
          <p className="text-gray-600">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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