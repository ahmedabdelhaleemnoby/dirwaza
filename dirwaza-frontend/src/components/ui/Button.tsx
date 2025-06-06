import React from 'react';
import { Link } from '@/i18n/navigation';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  rounded?:boolean
  disabled?:boolean
}

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children,
  href,
  onClick,
  disabled=false,
  rounded=false,
  type = 'button'
}: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center  font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary focus:ring-primary/50",
    secondary: "bg-secondary text-white hover:bg-secondary focus:ring-secondary/50",
    outline: "border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary/30",
    ghost: "text-primary hover:bg-primary/10 focus:ring-primary/30"
  };
  
  const sizeClasses = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg"
  };
  const roundedClasses=rounded?" rounded-full ":' rounded-xl '
  const allClasses = `${baseClasses} ${roundedClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={allClasses}>
        {children}
      </Link>
    );
  }
  
  return (
    <button className={allClasses} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;