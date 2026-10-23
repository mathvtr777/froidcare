import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'sage' | 'outline' | 'subtle' | 'tertiary' | 'secondary';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  const variants = {
    default: 'bg-surface-container-high text-on-surface border border-outline-variant/60',
    sage: 'bg-primary-container/20 text-primary border border-primary/30',
    tertiary: 'bg-tertiary-container/20 text-tertiary border border-tertiary/30',
    secondary: 'bg-secondary-container/20 text-secondary border border-secondary/30',
    outline: 'bg-transparent text-on-surface-variant border border-outline-variant',
    subtle: 'bg-surface-container text-on-surface-variant',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
