import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  hasHover?: boolean;
}

const Card = ({ className = '', children, hasHover = true, ...props }: CardProps) => {
  return (
    <div 
      className={`bg-white rounded-2xl shadow border border-accent overflow-hidden transition-all duration-300 ${hasHover ? "hover:shadow-xl hover:translate-y-[-5px]" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;