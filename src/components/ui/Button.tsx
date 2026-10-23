import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-primary hover:bg-primary-container text-on-primary font-semibold shadow-lg shadow-primary/20',
      gradient:
        'bg-gradient-to-r from-primary to-primary-container text-on-primary font-semibold shadow-[0_12px_28px_-6px_rgba(90,240,179,0.28)] hover:opacity-95',
      secondary:
        'bg-surface-container-high hover:bg-surface-container-highest text-on-surface shadow-sm',
      outline:
        'border border-outline-variant bg-transparent hover:bg-surface-container text-on-surface',
      ghost:
        'bg-transparent hover:bg-surface-container text-on-surface-variant hover:text-on-surface',
      danger:
        'bg-error-container/30 hover:bg-error-container/50 text-error border border-error/30',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5 min-h-[36px]',
      md: 'px-5 py-2.5 text-sm gap-2 min-h-[44px]',
      lg: 'px-6 py-3.5 text-base gap-2.5 min-h-[50px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
