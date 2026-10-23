import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]';

    const variants = {
      primary:
        'bg-sage-600 hover:bg-sage-500 text-white shadow-sm hover:shadow active:bg-sage-700',
      secondary:
        'bg-charcoal-800 hover:bg-charcoal-700 text-neutral-200 border border-charcoal-600/70',
      outline:
        'border border-charcoal-600 bg-transparent hover:bg-charcoal-800/80 text-neutral-200',
      ghost:
        'bg-transparent hover:bg-charcoal-800/60 text-neutral-300 hover:text-white',
      danger:
        'bg-rose-900/40 hover:bg-rose-900/70 text-rose-200 border border-rose-800/60',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5 min-h-[34px]',
      md: 'px-4 py-2 text-sm gap-2 min-h-[42px]',
      lg: 'px-5 py-2.5 text-base gap-2.5 min-h-[48px]',
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
