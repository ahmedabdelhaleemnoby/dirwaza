'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  AlertTriangle,
  Home,
  ArrowLeft,
  ArrowRight,
  Search,
  FileX,
  Settings,
  HelpCircle,
  RefreshCcw
} from 'lucide-react';
import Button from './Button';
import Card from './Card';
import { usePathname } from 'next/navigation';

export type NotFoundContext = 'dashboard' | 'general';

interface NotFoundProps {
  context?: NotFoundContext;
  title?: string;
  message?: string;
  description?: string;
  suggestions?: string[];
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  showSuggestions?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export default function NotFound({
  context = 'general',
  title,
  message,
  description,
  suggestions,
  primaryAction,
  secondaryAction,
  showSuggestions = true,
  icon,
  className = ''
}: NotFoundProps) {
  const t = useTranslations('NotFound');
  const pathname = usePathname();
  const isRTL = pathname.startsWith('/ar');
  const isDashboard = context === 'dashboard' || pathname.includes('/dashboard');

  // Choose appropriate arrow icon based on RTL
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  // Get context-specific translations
  const contextT = isDashboard ? t.raw('dashboard') : t.raw('general');
  
  // Default values based on context
  const defaultTitle = title || contextT.title || t('title');
  const defaultMessage = message || contextT.message || '';
  const defaultDescription = description || contextT.description || t('description');
  
  // Default actions based on context
  const defaultPrimaryAction = primaryAction || {
    label: isDashboard ? contextT.backToDashboard || t('dashboard.backToDashboard') : contextT.goHome || t('general.suggestions.goHome') || t('backToHome'),
    href: isDashboard ? '/dashboard' : '/'
  };

  const defaultSecondaryAction = secondaryAction || (isDashboard ? {
    label: contextT.backToHome || t('dashboard.backToHome') || t('backToHome'),
    href: '/'
  } : {
    label: contextT.contactSupport || t('general.suggestions.contactSupport') || 'Contact Support',
    href: '/contact'
  });

  // Default suggestions based on context
  const defaultSuggestions = suggestions || (isDashboard ? [
    contextT.features?.underDevelopment || t('dashboard.features.underDevelopment'),
    contextT.features?.comingSoon || t('dashboard.features.comingSoon'),
    contextT.features?.nextVersion || t('dashboard.features.nextVersion'),
    contextT.features?.stayTuned || t('dashboard.features.stayTuned')
  ] : [
    contextT.suggestions?.checkUrl || t('general.suggestions.checkUrl'),
    contextT.suggestions?.goHome || t('general.suggestions.goHome'),
    contextT.suggestions?.contactSupport || t('general.suggestions.contactSupport'),
    contextT.suggestions?.searchSite || t('general.suggestions.searchSite')
  ]);

  const suggestionIcons = isDashboard ? [Settings, RefreshCcw, FileX, HelpCircle] : [Search, Home, HelpCircle, Search];

  // Choose appropriate main icon
  const mainIcon = icon || (isDashboard ? <Settings className="w-12 h-12 md:w-16 md:h-16 text-white" /> : <FileX className="w-12 h-12 md:w-16 md:h-16 text-white" />);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-neutral-light to-neutral-dark flex items-center justify-center p-4 ${className}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <motion.div 
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Card className="p-6 md:p-8 lg:p-12 xl:p-16 text-center bg-white/95 backdrop-blur-sm shadow-2xl border-0 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 pointer-events-none" />
          
          {/* Animated Icon */}
          <motion.div 
            className="mb-6 md:mb-8 flex justify-center relative z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.7, type: "spring", bounce: 0.3 }}
          >
            <div className="relative">
              <motion.div
                className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-secondary-dark to-secondary rounded-full flex items-center justify-center shadow-xl"
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                    "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                  ]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {mainIcon}
              </motion.div>
              
              {/* Warning indicator */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-secondary-dark fill-current" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1 
            className={`text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary mb-3 md:mb-4 ${isRTL ? 'font-ibm-plex-sans-arabic' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {defaultTitle}
          </motion.h1>

          {/* Main Message */}
          {defaultMessage && (
            <motion.div
              className="bg-gradient-to-r from-secondary-dark/10 to-secondary/10 rounded-xl p-4 md:p-6 mb-6 md:mb-8 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-secondary-dark/5 to-transparent" />
              <p className={`text-lg md:text-xl lg:text-2xl font-semibold text-primary-dark relative z-10 ${isRTL ? 'font-ibm-plex-sans-arabic' : ''}`}>
                {defaultMessage}
              </p>
            </motion.div>
          )}

          {/* Description */}
          <motion.p 
            className={`text-base md:text-lg text-primary-dark mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto ${isRTL ? 'font-ibm-plex-sans-arabic' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            {defaultDescription}
          </motion.p>

          {/* Suggestions Grid */}
          {showSuggestions && defaultSuggestions && (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              {defaultSuggestions.map((suggestion, index) => {
                const IconComponent = suggestionIcons[index] || HelpCircle;
                return (
                  <motion.div
                    key={index}
                    className={`bg-neutral-light rounded-lg p-3 md:p-4 flex items-center gap-3 border border-neutral-dark/20 hover:shadow-md transition-shadow ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-secondary-dark" />
                    </div>
                    <span className={`text-primary font-medium text-sm md:text-base ${isRTL ? 'font-ibm-plex-sans-arabic' : ''}`}>
                      {suggestion}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            {/* Primary Action */}
            <Button
              href={defaultPrimaryAction.href}
              variant="secondary"
              size="lg"
              className={`group min-w-[200px] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowIcon className={`w-4 h-4 md:w-5 md:h-5 ${isRTL ? 'ml-2 group-hover:translate-x-1' : 'mr-2 group-hover:-translate-x-1'} transition-transform`} />
              <span className={isRTL ? 'font-ibm-plex-sans-arabic' : ''}>
                {defaultPrimaryAction.label}
              </span>
            </Button>

            {/* Secondary Action */}
            <Button
              href={defaultSecondaryAction.href}
              variant="primary"
              size="lg"
              className={`group min-w-[200px] ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Home className={`w-4 h-4 md:w-5 md:h-5 ${isRTL ? 'ml-2' : 'mr-2'} transition-transform`} />
              <span className={isRTL ? 'font-ibm-plex-sans-arabic' : ''}>
                {defaultSecondaryAction.label}
              </span>
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
} 