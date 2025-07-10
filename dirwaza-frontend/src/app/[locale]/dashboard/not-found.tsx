'use client';

import { Settings } from 'lucide-react';
import NotFoundComponent from '@/components/ui/NotFound';

export default function NotFound() {
  return (
    <NotFoundComponent
      context="dashboard"
      icon={<Settings className="w-12 h-12 md:w-16 md:h-16 text-white" />}
    />
  );
} 