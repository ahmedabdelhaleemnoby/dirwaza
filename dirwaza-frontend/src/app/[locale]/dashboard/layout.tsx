import { ReactNode } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
// import { auth } from '@/lib/auth';
// import { redirect } from '@/i18n/navigation';

export default async function DashboardRootLayout({
  children,
  // params
}: {
  children: ReactNode;
  // params: { locale: string };
}) {
  // const session = await auth();
  
  // if (!session?.user) {
  //   redirect({ href: '/login', locale: params.locale });
  // }
  
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}