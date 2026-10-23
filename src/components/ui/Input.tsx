import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-on-surface">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface placeholder:text-outline text-sm transition-colors focus:outline-none focus:bg-surface-container-high border',
            error
              ? 'border-error/80 focus:border-error focus:ring-1 focus:ring-error/30'
              : 'border-outline-variant/60 focus:border-primary/80 focus:ring-1 focus:ring-primary/20 hover:border-outline',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-error mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-on-surface-variant mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
