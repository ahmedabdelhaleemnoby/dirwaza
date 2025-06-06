'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Gift } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function GiftFormPage() {
  const locale = useLocale();
  const t = useTranslations('GiftForm');
  const [formData, setFormData] = useState({
    recipientName: '',
    phoneNumber: '',
    message: '',
    deliveryDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
        
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-sky-200/85 rounded-full flex items-center justify-center">
         <Gift className='text-accent-dark w-6 h-6 ' />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-8">{t('title')}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('recipientName')}
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            required
          />
          
          <div className="flex relative flex-col gap-1">
            <Input
              label={t('phoneNumber')}
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className={" ps-14   "}
              dir={locale === "ar" ? "rtl" : "ltr"}
              placeholder="5***********"
              
            >
            <div className=' absolute top-0 start-px w-12 my-px inset-y-0 bg-neutral-light  rounded-s-lg  text-black/50 flex items-center justify-center'>
                {"+966"}
            </div>
            </Input>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              {t('message')}
            </label>
            <textarea
              name="message"
              value={formData.message}
              placeholder={t('messagePlaceholder')}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-primary-light bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent"
              rows={4}
              maxLength={150}
              required
            />
            <div className="text-xs text-gray-500 text-left">
              {formData.message.length}/150
            </div>
          </div>

          <Input
            label={t('deliveryDate')}
            name="deliveryDate"
            type="datetime-local"
            value={formData.deliveryDate}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
          >
            {t('submit')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
