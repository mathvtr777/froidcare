import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={cn(
          'relative w-full rounded-2xl bg-charcoal-900 border border-charcoal-700/80 p-5 md:p-6 shadow-2xl z-10 my-8 transition-all max-h-[90vh] flex flex-col',
          maxWidths[maxWidth]
        )}
      >
        <div className="flex items-start justify-between pb-3 border-b border-charcoal-800">
          <div>
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-neutral-100">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xs text-neutral-400 mt-0.5">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-4 overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
};
