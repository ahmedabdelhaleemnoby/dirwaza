import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface PaymentMethodCardProps {
  icon?: string;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  icon,
  label,
  selected = false,
  onClick,
  disabled = false,
}) => {
  const t = useTranslations('Components.PaymentMethodCard');

  return (
    <button
      onClick={onClick}
      type='button'
      disabled={disabled}
      className={`flex items-center gap-2 p-3 border rounded-md shadow w-full transition-all 
        ${disabled ? 'opacity-50 cursor-not-allowed' :  "cursor-pointer"}
        ${
        selected
          ? 'border-primary-light ring-1 ring-primary-light bg-neutral-light'
          : 'border-primary-light hover:shadow-xl'
      }`}
      aria-label={t('selectPaymentMethod')}
    >
      {icon && (
        <Image 
          src={icon} 
          alt={t('paymentMethodAlt')} 
          width={24} 
          height={24} 
        />
      )}
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
};

export default PaymentMethodCard; 