'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import { AvailableDates } from '@/types/training';

interface DateTimeSelectionStepProps {
  availableDates: AvailableDates;
  selectedDates: string[];
  selectedTimes: Record<string, string[]>;
  agreedToTerms: boolean;
  onUpdate: (data: {
    selectedDates?: string[];
    selectedTimes?: Record<string, string[]>;
    agreedToTerms?: boolean;
  }) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const DateTimeSelectionStep: React.FC<DateTimeSelectionStepProps> = ({
  availableDates,
  selectedDates,
  selectedTimes,
  agreedToTerms,
  onUpdate,
  onPrevious,
  onNext
}) => {
  const t = useTranslations('TrainingBookingPage.dateTimeSelection');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 5 || day === 6; // Friday and Saturday in Arabic calendar
  };

  const formatDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateDisabled = (date: Date) => {
    const dateString = formatDateString(date);
    return availableDates.disabledDates.includes(dateString) || date < new Date();
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    const dateString = formatDateString(date);
    const newSelectedDates = selectedDates.includes(dateString)
      ? selectedDates.filter(d => d !== dateString)
      : [...selectedDates, dateString];

    // Remove times for unselected dates
    const newSelectedTimes = { ...selectedTimes };
    if (!newSelectedDates.includes(dateString)) {
      delete newSelectedTimes[dateString];
    }

    onUpdate({
      selectedDates: newSelectedDates,
      selectedTimes: newSelectedTimes
    });
  };

  const handleTimeClick = (date: string, time: string) => {
    const currentTimes = selectedTimes[date] || [];
    const newTimes = currentTimes.includes(time)
      ? currentTimes.filter(t => t !== time)
      : [...currentTimes, time];

    onUpdate({
      selectedTimes: {
        ...selectedTimes,
        [date]: newTimes
      }
    });
  };

  const getAvailableTimesForDate = (date: string) => {
    const dateObj = new Date(date);
    return isWeekend(dateObj) 
      ? availableDates.timeSlots.weekends 
      : availableDates.timeSlots.weekdays;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10 w-10" />
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateString = formatDateString(date);
      const isSelected = selectedDates.includes(dateString);
      const isDisabled = isDateDisabled(date);
      const isToday = dateString === formatDateString(new Date());

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(date)}
          disabled={isDisabled}
          className={`
            h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200
            ${isSelected 
              ? 'bg-primary text-white shadow-md' 
              : isToday
                ? 'bg-secondary text-white'
                : isDisabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-primary-light hover:text-primary'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const canSubmit = () => {
    return selectedDates.length > 0 && 
           selectedDates.every(date => selectedTimes[date]?.length > 0) &&
           agreedToTerms;
  };



  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('title')}
        </h2>
        <p className="text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      {/* Calendar */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('dateLabel')}
          </h3>
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePreviousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h4 className="text-lg font-semibold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h4>
            
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="h-10 flex items-center justify-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>
      </div>

      {/* Time Selection */}
      {selectedDates.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('timeLabel')}
          </h3>
          
          <div className="space-y-6">
            {selectedDates.map(date => (
              <div key={date} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                <h4 className="font-medium text-gray-900 mb-3">
                  {new Date(date + 'T00:00:00').toLocaleDateString('ar-SA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {getAvailableTimesForDate(date).map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeClick(date, time)}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${selectedTimes[date]?.includes(time)
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-primary-light hover:text-primary border border-gray-200'
                        }
                      `}
                    >
                      {time} {t('evening')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Terms Agreement */}
      <div className="bg-gray-50 rounded-xl p-6">
        <label className="flex items-start space-x-3 rtl:space-x-reverse cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => onUpdate({ agreedToTerms: e.target.checked })}
            className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
          />
          <span className="text-sm text-gray-700 leading-relaxed">
            {t('agreeToTerms')}
          </span>
        </label>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="min-w-32"
        >
          {t('previous')}
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!canSubmit() }
          className="min-w-32"
        >
          {t('next')}
        </Button>
      </div>
    </div>
  );
};

export default DateTimeSelectionStep; 