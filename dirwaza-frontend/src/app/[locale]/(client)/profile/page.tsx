import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { BookingsSection, ContactSection, ProfileHeader, SettingsSection } from '@/components/profile';
import { getUserProfileData, getUserBookingsData, getContactInfoData } from '@/lib/api/authActions';
import { mockProfileData } from '@/mock/profileMockData';
import { redirect } from '@/i18n/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ProfilePage');
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ProfilePage() {
  // Fetch user profile data using SSR
  const profileResult = await getUserProfileData();
  
  // If user is not authenticated or profile fetch fails, redirect to login
  if (!profileResult.success) {
    redirect({ href: '/login', locale: 'ar' }); // Default to Arabic locale
  }

  // Fetch user bookings data using SSR
  const bookingsResult = await getUserBookingsData();
  
  // Fetch contact info data using SSR
  const contactInfoResult = await getContactInfoData();
  
  // Use fetched data or fallback to mock data for development
  const profileData = profileResult.data || mockProfileData;
  const bookingsData = bookingsResult.data || [];
  const contactInfoData = contactInfoResult.success ? contactInfoResult.data : null;

  return (
    <div className="flex flex-col max-w-screen-md w-full min-h-screen items-center px-4 py-8 mx-auto">
      {/* Profile Header with fetched data */}
      <ProfileHeader user={profileData} />
      
      {/* Bookings and Orders Section with fetched bookings */}
      <BookingsSection bookings={bookingsData} />
      
      {/* Contact Section with fetched contact info */}
      <ContactSection contactData={contactInfoData} />
      
      {/* Settings Section */}
      <SettingsSection />
    </div>
  );
} 