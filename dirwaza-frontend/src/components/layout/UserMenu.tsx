'use client';

import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';

interface UserMenuProps {
  isMobile?: boolean;
  className?: string;
}

export default function UserMenu({ isMobile = false, className = '' }: UserMenuProps) {
  const t = useTranslations('Header');
  
  // Mock authentication state - replace with actual auth logic
  const [isAuthenticated] = useState(false);
  const [user] = useState({ name: 'User-111', avatar: '/icons/profile.svg' });

  if (isAuthenticated) {
    return (
      <div className={`flex items-center ${className}`}>
        <Link 
          href="/profile" 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-8 h-8 rounded-full border-2 border-gray-200"
          />
          {isMobile && (
            <span className="text-primary font-medium">{user.name}</span>
          )}
        </Link>
      </div>
    );
  }

  return (
    <Button 
      variant="secondary" 
      size="md" 
      href="/login" 
      className={`${isMobile ? 'w-full py-2' : 'py-1'} rounded-lg ${className}`}
    >
      {t('login')}
    </Button>
  );
} 