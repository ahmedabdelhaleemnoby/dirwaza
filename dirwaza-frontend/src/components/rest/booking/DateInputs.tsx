'use client';
import { useTranslations } from 'next-intl';

interface DateInputsProps {
  isMultipleMode: boolean;
  checkInDate: string;
  checkOutDate: string;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
}

export default function DateInputs({
  isMultipleMode,
  checkInDate,
  checkOutDate,
  onCheckInChange,
  onCheckOutChange
}: DateInputsProps) {
  const t = useTranslations('RestPage');

  return (
    <div className="grid grid-cols-2 gap-2 mb-2">
      <div>
        <label className="block text-xs text-gray-600 mb-1">
          {isMultipleMode ? t('checkInDate') : t('date')}
        </label>
        <input
          type="date"
          value={isMultipleMode ? checkInDate : checkInDate}
          onChange={(e) => onCheckInChange(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
        />
      </div>
      
      {isMultipleMode && (
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            {t('checkOutDate')}
          </label>
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => onCheckOutChange(e.target.value)}
            min={checkInDate || new Date().toISOString().split('T')[0]}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
          />
        </div>
      )}
    </div>
  );
} 