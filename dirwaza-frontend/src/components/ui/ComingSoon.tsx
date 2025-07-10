'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { 
  Construction, 
  Rocket, 
  Clock, 
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Package,
  Truck,
  MapPin,
  Bell
} from 'lucide-react';
import Button from './Button';
import Card from './Card';
import { usePathname } from 'next/navigation';

interface ComingSoonProps {
  title?: string;
  message?: string;
  description?: string;
  features?: string[];
  icon?: React.ReactNode;
  backUrl?: string;
  backLabel?: string;
  expectedLaunch?: string;
  className?: string;
}

export default function ComingSoon({
  title,
  message,
  description,
  features,
  icon,
  backUrl = '/dashboard',
  backLabel,
  expectedLaunch,
  className = ''
}: ComingSoonProps) {
  const t = useTranslations('Dashboard.shipmentTracking');
  const pathname = usePathname();
  const isRTL = pathname.startsWith('/ar');

  const defaultFeatures = [
    t('features.realTimeTracking'),
    t('features.deliveryUpdates'),
    t('features.routeOptimization'),
    t('features.customerNotifications')
  ];

  const featureIcons = [Package, Truck, MapPin, Bell];

  // Choose appropriate arrow icon based on RTL
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-neutral-light to-neutral-dark flex items-center justify-center p-4 ${className}`}>
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
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring", bounce: 0.4 }}
          >
            <div className="relative">
              <motion.div
                className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-secondary to-secondary-dark rounded-full flex items-center justify-center shadow-xl"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {icon || <Construction className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 text-white" />}
              </motion.div>
              
              {/* Sparkles Animation */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
              </motion.div>

              {/* Floating particles */}
              <motion.div
                className="absolute -top-4 -left-4"
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-2 h-2 bg-secondary rounded-full" />
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
            {title || t('comingSoonTitle')}
          </motion.h1>

          {/* Main Message */}
          <motion.div
            className="bg-gradient-to-r from-secondary/10 to-secondary-dark/10 rounded-xl p-4 md:p-6 mb-6 md:mb-8 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent" />
            <p className={`text-lg md:text-xl lg:text-2xl font-semibold text-primary-dark mb-2 relative z-10 ${isRTL ? 'font-ibm-plex-sans-arabic' : ''}`}>
              {message || t('comingSoon')}
            </p>
            {expectedLaunch && (
              <div className={`flex items-center justify-center gap-2 text-secondary-dark relative z-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-medium">{expectedLaunch}</span>
              </div>
            )}
          </motion.div>

          {/* Description */}
          {description && (
            <motion.p 
              className={`text-base md:text-lg text-primary-dark mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto ${isRTL ? 'font-ibm-plex-sans-arabic' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              {description}
            </motion.p>
          )}

          {/* Features Grid */}
          {(features || defaultFeatures) && (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              {(features || defaultFeatures).map((feature, index) => {
                const IconComponent = featureIcons[index] || Package;
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
                    <span className={`text-primary font-medium text-sm md:text-base ${isRTL ? 'font-ibm-plex-sans-arabic' : ''}`}>{feature}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Animated Rocket */}
          <motion.div 
            className="mb-6 md:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block"
            >
              <Rocket className="w-12 h-12 md:w-16 md:h-16 text-secondary mx-auto" />
            </motion.div>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.5 }}
          >
            <Button
              href={backUrl}
              variant="secondary"
              size="lg"
              className={`group ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowIcon className={`w-4 h-4 md:w-5 md:h-5 ${isRTL ? 'ml-2 group-hover:translate-x-1' : 'mr-2 group-hover:-translate-x-1'} transition-transform`} />
              <span className={isRTL ? 'font-ibm-plex-sans-arabic' : ''}>
                {backLabel || t('backToDashboard')}
              </span>
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
} 