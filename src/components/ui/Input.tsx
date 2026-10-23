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
          <label htmlFor={inputId} className="block text-xs font-medium text-neutral-300">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border text-neutral-100 placeholder-neutral-500 text-sm transition-all focus:outline-none focus:ring-1',
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/30'
              : 'border-charcoal-700/80 focus:border-sage-500 focus:ring-sage-500/30 hover:border-charcoal-600',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-neutral-400 mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
