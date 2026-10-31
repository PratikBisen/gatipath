import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative bg-surface rounded-2xl border border-border ${maxWidthClasses} w-full shadow-floating overflow-hidden z-10 animate-in zoom-in-95 duration-150`}
      >
        <div className="p-6 pb-4 border-b border-border flex items-start justify-between gap-4">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-base font-heading font-bold text-charcoal">
                {title}
              </h3>
            ) : (
              title
            )}
            {subtitle && (
              <p className="text-xs text-charcoal-muted mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-canvas transition-colors"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
