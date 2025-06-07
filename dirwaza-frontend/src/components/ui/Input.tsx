import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  labelClassName?: string;
  containerClassName?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', labelClassName = '', containerClassName = '', icon, children,  ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-1 ${containerClassName}`}>
        {label && (
          <label className={`text-sm font-medium text-gray-700 ${labelClassName}`}>
            {label}
          </label>
        )}
        <div className='relative'>
        {icon && (
          <span className='absolute top-0 start-0 w-12 inset-y-0 bg-accent-dark text-white flex items-center justify-center'>
            {icon}
          </span>
        )}
        {children}
        <input
          ref={ref}
          
          className={`w-full px-3 py-2 border border-primary-light bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
          
        /></div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 