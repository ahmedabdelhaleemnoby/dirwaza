import { ReactNode } from 'react';
// import Sidebar from './Sidebar';
import Header from './Header';
import { User } from '@/lib/auth';

export default function DashboardLayout({ 
  children, 
  // user 
}: { 
  children: ReactNode; 
  user?: User 
}) {
  return (
    <div className="flex min-h-screen">
      {/* <Sidebar /> */}
      
      <div className="flex-1 flex flex-col">
        <Header  />
        
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}