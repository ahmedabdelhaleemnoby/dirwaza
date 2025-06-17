'use client';
import {  LogIn, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';


  export default function BookingInfo({data,valToggle}: {data?: {checkIn: string, checkOut: string},valToggle: boolean}) {
  const t = useTranslations('RestPage');
const defaultData = data || {checkIn: '', checkOut: ''};
  return (
    <div className="flex flex-col gap-4 lg:gap-8 bg-neutral-dark w-full py-5 px-4 rounded-2xl">
      <h3 className="text-3xl font-bold">{t("checkinInfo")}</h3>
      <div className="text-sm text-gray-600 space-y-1">
        <div className='flex items-center gap-4'>
          <LogIn className='w-6 h-6' />
          <span>{t('checkIn.label')}</span>
          <span>{t('checkIn.prefix', { time: defaultData?.checkIn , period: t('checkIn.period') })}</span>
        </div>
        <div className='flex items-center gap-4'>
          <LogOut className='w-6 h-6' />
          <span>{t('checkOut.label')}</span>
          <span>{t('checkOut.prefix', { time: defaultData?.checkOut , period: valToggle ? t('checkIn.period') : t('checkOut.period')  })}</span>
        </div>
      </div>
    </div>
  );
} 
//           <span>{t('checkIn.prefix', { time: defaultData?.checkIn , period: t('checkIn.period') })}</span>
