'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Clock, Zap, Eye } from 'lucide-react';

export interface ComingSoonOverlayProps {
  /** Whether the overlay is visible */
  visible?: boolean;
  /** Custom message to display instead of default */
  customMessage?: string;
  /** Custom English message */
  customMessageEn?: string;
  /** Position type for the overlay */
  position?: 'absolute' | 'fixed';
  /** Z-index for the overlay */
  zIndex?: number;
  /** Background opacity (0-1) */
  backgroundOpacity?: number;
  /** Text color */
  textColor?: 'white' | 'black';
  /** Show icon with the message */
  showIcon?: boolean;
  /** Icon to display */
  icon?: 'clock' | 'zap' | 'eye' | 'none';
  /** Additional CSS classes */
  className?: string;
  /** Animation type */
  animation?: 'fade' | 'slide' | 'none';
  /** Corner position for small overlay */
  corner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  /** Size of the overlay */
  size?: 'full' | 'compact' | 'badge';
  /** Click handler (if you want to make it interactive) */
  onClick?: () => void;
}

const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({
  visible = true,
  customMessage,
  customMessageEn,
  position = 'absolute',
  zIndex = 50,
  backgroundOpacity = 0.4,
  textColor = 'white',
  showIcon = true,
  icon = 'clock',
  className = '',
  animation = 'fade',
  corner = 'center',
  size = 'full',
  onClick
}) => {
  const t = useTranslations('ComingSoon');

  // Don't render if not visible
  if (!visible) return null;

  // Get icon component
  const getIcon = () => {
    if (!showIcon || icon === 'none') return null;
    
    const iconProps = { 
      className: `w-5 h-5 sm:w-6 sm:h-6 ${textColor === 'white' ? 'text-white' : 'text-gray-800'}`,
      'aria-hidden': true
    };
    
    switch (icon) {
      case 'clock':
        return <Clock {...iconProps} />;
      case 'zap':
        return <Zap {...iconProps} />;
      case 'eye':
        return <Eye {...iconProps} />;
      default:
        return <Clock {...iconProps} />;
    }
  };

  // Get message text
  const getMessage = () => {
    if (customMessage) return customMessage;
    if (customMessageEn) return customMessageEn;
    return t('message');
  };

  // Get background color with opacity
  const getBackgroundColor = () => {
    return `rgba(0, 0, 0, ${backgroundOpacity})`;
  };

  // Get position classes based on corner and size
  const getPositionClasses = () => {
    if (size === 'full') {
      return 'inset-0 flex items-center justify-center';
    }
    
    if (size === 'badge') {
      switch (corner) {
        case 'top-left':
          return 'top-2 left-2';
        case 'top-right':
          return 'top-2 right-2';
        case 'bottom-left':
          return 'bottom-2 left-2';
        case 'bottom-right':
          return 'bottom-2 right-2';
        default:
          return 'top-2 right-2';
      }
    }
    
    // compact size
    switch (corner) {
      case 'top-left':
        return 'top-4 left-4 max-w-xs';
      case 'top-right':
        return 'top-4 right-4 max-w-xs';
      case 'bottom-left':
        return 'bottom-4 left-4 max-w-xs';
      case 'bottom-right':
        return 'bottom-4 right-4 max-w-xs';
      case 'center':
        return 'inset-0 flex items-center justify-center';
      default:
        return 'top-4 right-4 max-w-xs';
    }
  };

  // Get animation classes
  const getAnimationClasses = () => {
    switch (animation) {
      case 'fade':
        return 'animate-in fade-in duration-300';
      case 'slide':
        return 'animate-in slide-in-from-top duration-500';
      default:
        return '';
    }
  };

  // Get content styling based on size
  const getContentClasses = () => {
    const baseClasses = `
      ${textColor === 'white' ? 'text-white' : 'text-gray-800'}
      font-medium text-center rounded-lg
    `;
    
    switch (size) {
      case 'badge':
        return `${baseClasses} text-xs px-2 py-1 bg-gray-800/90 backdrop-blur-sm border border-gray-600`;
      case 'compact':
        return `${baseClasses} text-sm p-3 bg-gray-800/90 backdrop-blur-sm border border-gray-600 shadow-lg`;
      case 'full':
      default:
        return `${baseClasses} text-lg sm:text-xl p-6 sm:p-8 max-w-md mx-4`;
    }
  };

  return (
    <div
      className={`
        ${position} ${getPositionClasses()} ${getAnimationClasses()} ${className}
      `}
      style={{
        zIndex,
        backgroundColor: size === 'full' ? getBackgroundColor() : 'transparent'
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={getContentClasses()}>
        <div className="flex items-center justify-center gap-2 mb-2">
          {getIcon()}
          {size !== 'badge' && (
            <span className="font-bold text-primary">
              {t('title')}
            </span>
          )}
        </div>
        
        <div className={`
          leading-relaxed [direction:rtl]
          ${size === 'badge' ? 'text-xs' : size === 'compact' ? 'text-sm' : 'text-base'}
        `}>
          {getMessage()}
        </div>
        
        {size === 'full' && (
          <div className="mt-4 text-sm opacity-80 [direction:rtl]">
            {t('subtitle')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComingSoonOverlay; 