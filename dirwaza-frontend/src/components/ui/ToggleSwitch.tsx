'use client';

import React from 'react';
import { useLocale } from 'next-intl';

export interface ToggleSwitchProps {
  id?: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  label?: string;
  description?: string;
  className?: string;
}

export default function ToggleSwitch({
  id,
  name,
  checked,
  onChange,
  disabled = false,
  size = 'md',
  color = 'primary',
  label,
  description,
  className = ''
}: ToggleSwitchProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const sizeClasses = {
    sm: 'w-9 h-5',
    md: 'w-11 h-6',
    lg: 'w-14 h-7'
  };

  const thumbSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const translateClasses = {
    sm: isRTL ? (checked ? '-translate-x-4' : 'translate-x-0') : (checked ? 'translate-x-4' : 'translate-x-0'),
    md: isRTL ? (checked ? '-translate-x-5' : 'translate-x-0') : (checked ? 'translate-x-5' : 'translate-x-0'),
    lg: isRTL ? (checked ? '-translate-x-7' : 'translate-x-0') : (checked ? 'translate-x-7' : 'translate-x-0')
  };

  const colorClasses = {
    primary: checked ? 'bg-accent-dark' : 'bg-neutral-dark',
    success: checked ? 'bg-primary' : 'bg-neutral-dark',
    warning: checked ? 'bg-secondary' : 'bg-neutral-dark',
    danger: checked ? 'bg-red-500' : 'bg-neutral-dark'
  };

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const toggleElement = (
    <button
      type="button"
      id={id}
      name={name}
      role="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={handleToggle}
      className={`
        relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <span
        className={`
          inline-block rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out
          ${thumbSizeClasses[size]}
          ${translateClasses[size]}
        `}
      />
    </button>
  );

  if (!label && !description) {
    return toggleElement;
  }

  return (
    <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      {toggleElement}
      <div className="flex-1">
        {label && (
          <label
            htmlFor={id}
            className={`text-sm font-medium text-gray-900 cursor-pointer ${disabled ? 'opacity-50' : ''}`}
          >
            {label}
          </label>
        )}
        {description && (
          <p className={`text-xs text-gray-500 mt-1 ${disabled ? 'opacity-50' : ''}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
} 