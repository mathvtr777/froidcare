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
            <label htmlFor={inputId} className="block text-xs font-semibold text-on-surface">
              {label}
            </label>
          )}
          {maxLength && (
            <span className="text-[11px] text-on-surface-variant">
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
            'w-full px-3.5 py-2.5 rounded-xl bg-surface-container text-on-surface placeholder:text-outline text-sm transition-colors focus:outline-none focus:bg-surface-container-high border resize-y min-h-[90px]',
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

Textarea.displayName = 'Textarea';
