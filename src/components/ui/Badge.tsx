import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'sage' | 'outline' | 'subtle';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  const variants = {
    default: 'bg-charcoal-800 text-neutral-300 border border-charcoal-700/60',
    sage: 'bg-sage-950/80 text-sage-300 border border-sage-800/60',
    outline: 'bg-transparent text-neutral-300 border border-charcoal-600',
    subtle: 'bg-charcoal-850 text-neutral-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

