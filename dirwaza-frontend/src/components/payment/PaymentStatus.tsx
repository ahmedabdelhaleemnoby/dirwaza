import React from 'react';
import { Check } from 'lucide-react';

interface PaymentStatusProps {
  isSuccess?: boolean;
  message: string;
  subMessage?: string;
}

const PaymentStatus = ({  message, subMessage }: PaymentStatusProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 bg-neutral-light py-8 rounded-t-xl">
      <div className="rounded-full bg-white p-6">
        <Check className="h-8 w-8 text-primary" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold">{message}</h2>
        {subMessage && <p className="text-sm text-gray-500">{subMessage}</p>}
      </div>
    </div>
  );
};

export default PaymentStatus; 