import React from 'react';
import { cn } from '../../lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, maxLength, value, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full space-y-1.5">
        <div className="flex justify-between items-center">
          {label && (
            <label htmlFor={inputId} className="block text-xs font-medium text-neutral-300">
              {label}
            </label>
          )}
          {maxLength && (
            <span className="text-[11px] text-neutral-500">
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          id={inputId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={cn(
            'w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 border text-neutral-100 placeholder-neutral-500 text-sm transition-all focus:outline-none focus:ring-1 resize-y min-h-[90px]',
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

Textarea.displayName = 'Textarea';
