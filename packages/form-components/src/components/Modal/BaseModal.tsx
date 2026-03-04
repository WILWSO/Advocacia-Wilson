/**
 * BaseModal Component
 * Generic modal/dialog component with overlay
 * Responsive and accessible
 */

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { DEFAULT_MODAL_STYLES } from '../../config/styles.config';
import { cn } from '../../hooks/styling/useFieldStyles';

/**
 * BaseModal props
 */
export interface BaseModalProps {
  /** Modal open state */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title or header content */
  header?: React.ReactNode;
  /** Modal body content */
  children: React.ReactNode;
  /** Modal footer content (typically buttons) */
  footer?: React.ReactNode;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Show close button in header */
  showCloseButton?: boolean;
  /** Modal size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Custom overlay className */
  overlayClassName?: string;
  /** Custom container className */
  containerClassName?: string;
  /** Custom header className */
  headerClassName?: string;
  /** Custom body className */
  bodyClassName?: string;
  /** Custom footer className */
  footerClassName?: string;
}

/**
 * Modal size variants
 */
const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
};

/**
 * BaseModal component
 * 
 * @example
 * ```tsx
 * import { BaseModal } from '@wsolutions/form-components';
 * 
 * function MyComponent() {
 *   const [isOpen, setIsOpen] = useState(false);
 * 
 *   return (
 *     <>
 *       <button onClick={() => setIsOpen(true)}>Open Modal</button>
 *       <BaseModal
 *         isOpen={isOpen}
 *         onClose={() => setIsOpen(false)}
 *         header={<h2>Modal Title</h2>}
 *         footer={
 *           <button onClick={() => setIsOpen(false)}>Close</button>
 *         }
 *       >
 *         <p>Modal content goes here</p>
 *       </BaseModal>
 *     </>
 *   );
 * }
 * ```
 */
export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  header,
  children,
  footer,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  size = 'md',
  overlayClassName,
  containerClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modal = (
    <>
      {/* Overlay */}
      <div
        className={cn(DEFAULT_MODAL_STYLES.overlay, overlayClassName)}
        onClick={handleOverlayClick}
      />

      {/* Modal Container */}
      <div className={cn(DEFAULT_MODAL_STYLES.container, containerClassName)} onClick={handleOverlayClick}>
        <div
          ref={modalRef}
          className={cn(
            'w-full',
            SIZE_CLASSES[size],
            'bg-white',
            'dark:bg-gray-900',
            'rounded-lg',
            'shadow-xl',
            'border',
            'border-gray-200',
            'dark:border-gray-700',
            'animate-scale-in'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {header && (
            <div className={cn(DEFAULT_MODAL_STYLES.header, headerClassName)}>
              <div className="flex-1">{header}</div>
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className={cn(DEFAULT_MODAL_STYLES.body, bodyClassName)}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={cn(DEFAULT_MODAL_STYLES.footer, footerClassName)}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
};

BaseModal.displayName = 'BaseModal';

export default BaseModal;
