import React from 'react';
import Button from './Button';
import { ArrowLeft } from 'lucide-react';
import { useLocale } from 'next-intl';

interface BackButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const BackButton = ({ 
  label, 
  href = "/", 
  onClick,
  className = ""
}: BackButtonProps) => {
  const locale = useLocale();
  return (
    <div className="flex justify-end items-center w-full">
      <Button
        variant="ghost"
        size="md"
        href={href}
        onClick={onClick}
        className={`!ms-auto text-center hover:!bg-transparent border-none flex items-center gap-2 ${className}`}
      >
        {label} <ArrowLeft className={`${locale === "en" ? "rotate-180" : ""}`}/>
      </Button>
    </div>
  );
};

export default BackButton; 