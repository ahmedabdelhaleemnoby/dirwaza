'use client';

import React, { ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { LucideIcon } from 'lucide-react';

export interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export default function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
  className = '',
  headerClassName = '',
  contentClassName = ''
}: SettingsSectionProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className={`bg-white rounded-lg border border-neutral-dark overflow-hidden ${className}`}>
      {/* Section Header */}
      <div className={`p-6 border-b border-neutral-dark ${headerClassName}`}>
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {Icon && (
            <div className="flex-shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary-dark">{title}</h3>
            {description && (
              <p className="text-sm text-secondary mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Section Content */}
      <div className={`p-6 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
} 