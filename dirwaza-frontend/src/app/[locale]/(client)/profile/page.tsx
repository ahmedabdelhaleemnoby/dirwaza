import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { BookingsSection, ContactSection, ProfileHeader, SettingsSection } from '@/components/profile';


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ProfilePage');
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ProfilePage() {

  return (
    <div className="flex flex-col max-w-screen-md w-full min-h-screen items-center px-4 py-8 mx-auto">
      {/* Profile Header */}
      <ProfileHeader />
      
      {/* Bookings and Orders Section */}
      <BookingsSection />
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* Settings Section */}
      <SettingsSection />
    </div>
  );
} 