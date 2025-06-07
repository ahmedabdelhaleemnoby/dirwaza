'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import Button from '@/components/ui/Button';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // icons
import { Link } from '@/i18n/navigation';
import CartCount from '@/components/cart/CartCount';

export default function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/rest', label: t('rest') },
    { href: '/training', label: t('training') },
    { href: '/operator', label: t('operator') },
    { href: '/services', label: t('services') },
    { href: '/faq', label: t('faq') },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-padding mx-auto py-3 flex justify-between items-center">
        {/* الشعار */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.svg" 
              alt="Drooza Logo" 
              width={140} 
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Navigation Links - فقط على الشاشات الكبيرة */}
          <nav className="hidden lg:flex ms-10 space-x-6">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={index}
                  href={link.href}
                  className={clsx(
                    'font-medium transition-colors',
                    isActive 
                      ? 'text-secondary pointer-events-none' 
                      : 'text-primary hover:text-secondary'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* الزرار بتاع المينيو - ظاهر فقط في الشاشات الصغيرة */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-primary border border-secondary rounded-full p-2"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Login + Language */}
        <div className="hidden lg:flex items-center space-x-4">
          <CartCount />
          <Button variant="secondary" size="md" href="/login" className='rounded-lg py-1'>
            {t('login')}
          </Button>
          <LanguageSwitcher />
        </div>
      </div>

      {/* سايد بار في الموبايل */}
      <div className={clsx(
        'fixed top-0 bottom-0 w-64 bg-white z-50 shadow-lg p-4 transition-transform duration-300',
        'lg:hidden',
        pathname.startsWith('/ar') ? 'right-0' : 'left-0',
        sidebarOpen ? 'translate-x-0' : pathname.startsWith('/ar') ? 'translate-x-full' : '-translate-x-full'
      )}>
        <div className="flex justify-between items-center mb-6">
          <Image src="/logo.svg" alt="Logo" width={100} height={30} />
          <button onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col space-y-4">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={index}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                  'text-lg font-medium transition-colors',
                  isActive
                    ? 'text-secondary'
                    : 'text-primary hover:text-secondary'
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <CartCount isMobile />
        </nav>

        <div className="mt-6">
          <Button variant="secondary" size="md" href="/login" className='w-full py-2 rounded-lg'>
            {t('login')}
          </Button>
        </div>

        <div className="mt-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
