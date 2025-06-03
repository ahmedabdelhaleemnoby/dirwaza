import { ReactNode } from 'react';
// import DashboardLayout from '@/components/layout/DashboardLayout';
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
  //   redirect({ href: '/auth/login', locale: params.locale });
  // }
  
  return (
    // <DashboardLayout user={session.user}>
      {children}
    // </DashboardLayout>
  );
}