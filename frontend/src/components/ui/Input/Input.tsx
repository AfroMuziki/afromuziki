// frontend/src/components/ui/Input/Input.tsx
import { forwardRef, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { cn } from '../../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helper, leftIcon, rightIcon, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');
    
    const inputType = type === 'password' && showPassword ? 'text' : type;
    
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-400 dark:text-gray-500">{leftIcon}</span>
            </div>
          )}
          
          <input
            id={inputId}
            type={inputType}
            className={cn(
              'w-full rounded-lg border bg-white dark:bg-gray-900 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent',
              'disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-800',
              leftIcon ? 'pl-10' : 'pl-4',
              (rightIcon || type === 'password') ? 'pr-10' : 'pr-4',
              error 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-700 hover:border-gold-400',
              'py-2.5 text-sm',
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
            {...props}
          />
          
          {(rightIcon || type === 'password') && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon && !(type === 'password') && (
                <span className="text-gray-400 dark:text-gray-500">{rightIcon}</span>
              )}
              {type === 'password' && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        
        {helper && !error && (
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
