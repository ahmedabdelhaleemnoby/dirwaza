'use client';
import { useTranslations } from 'next-intl';

interface PriceBreakdownProps {
  selectedDates: string[];
  getDayPrice: (date: Date) => number;
  isWeekend: (date: Date) => boolean;
  calculateTotal: () => number;
}

export default function PriceBreakdown({ 
  selectedDates, 
  getDayPrice, 
  isWeekend,
  calculateTotal 
}: PriceBreakdownProps) {
  const t = useTranslations('RestPage');

  return (
    <div className="border-t pt-4 mb-4">
      <div className="space-y-2 text-sm">
        {selectedDates.map((dateStr) => {
          const date = new Date(dateStr);
          const price = getDayPrice(date);
          const isDateWeekend = isWeekend(date);
          
          return (
            <div key={dateStr} className="flex justify-between">
              <span className="text-xs">
                {date.toLocaleDateString('ar-EG')}
                {isDateWeekend && <span className="text-orange-600 mr-1">{t('weekendLabel')}</span>}
              </span>
              <span className="text-xs">{price} {t('currency')}</span>
            </div>
          );
        })}
        <div className="flex justify-between font-bold pt-2 border-t">
          <span>{t('total')}</span>
          <span>{calculateTotal()} {t('currency')}</span>
        </div>
      </div>
    </div>
  );
} 