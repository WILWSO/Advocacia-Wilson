/**
 * Notification (Toast) Component
 * Display temporary notification messages
 * Supports info, success, warning, and error variants
 */

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { DEFAULT_NOTIFICATION_STYLES } from '../../config/styles.config';
import { cn } from '../../hooks/styling/useFieldStyles';

/**
 * Notification variant types
 */
export type NotificationVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * Notification position
 */
export type NotificationPosition = 
  | 'top-left' 
  | 'top-center' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-center' 
  | 'bottom-right';

/**
 * Notification props
 */
export interface NotificationProps {
  /** Notification message */
  message: React.ReactNode;
  /** Notification variant (type) */
  variant?: NotificationVariant;
  /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
  duration?: number;
  /** Show notification */
  isVisible?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Show close button */
  showCloseButton?: boolean;
  /** Position on screen */
  position?: NotificationPosition;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Custom className */
  className?: string;
}

/**
 * Position classes
 */
const POSITION_CLASSES: Record<NotificationPosition, string> = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
};

/**
 * Default icons for each variant
 */
const VARIANT_ICONS: Record<NotificationVariant, React.ReactNode> = {
  info: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  success: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

/**
 * Notification component
 * 
 * @example
 * ```tsx
 * import { Notification } from '@wsolutions/form-components';
 * 
 * function MyComponent() {
 *   const [show, setShow] = useState(false);
 * 
 *   return (
 *     <>
 *       <button onClick={() => setShow(true)}>Show Notification</button>
 *       <Notification
 *         isVisible={show}
 *         message="Operation completed successfully!"
 *         variant="success"
 *         duration={3000}
 *         onClose={() => setShow(false)}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export const Notification: React.FC<NotificationProps> = ({
  message,
  variant = 'info',
  duration = 5000,
  isVisible = false,
  onClose,
  showCloseButton = true,
  position = 'top-right',
  icon,
  className,
}) => {
  const [visible, setVisible] = useState(isVisible);

  // Sync with isVisible prop
  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  // Auto-dismiss
  useEffect(() => {
    if (!visible || duration === 0) return;

    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  const notification = (
    <div
      className={cn(
        'fixed',
        'z-50',
        POSITION_CLASSES[position],
        'animate-slide-in'
      )}
    >
      <div
        className={cn(
          DEFAULT_NOTIFICATION_STYLES.container,
          DEFAULT_NOTIFICATION_STYLES.variants[variant],
          className
        )}
      >
        {/* Icon */}
        <div className={DEFAULT_NOTIFICATION_STYLES.icon}>
          {icon || VARIANT_ICONS[variant]}
        </div>

        {/* Message */}
        <div className={DEFAULT_NOTIFICATION_STYLES.message}>
          {message}
        </div>

        {/* Close Button */}
        {showCloseButton && (
          <button
            type="button"
            onClick={handleClose}
            className={DEFAULT_NOTIFICATION_STYLES.closeButton}
            aria-label="Close notification"
          >
            <svg
              className="w-4 h-4"
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
    </div>
  );

  return createPortal(notification, document.body);
};

Notification.displayName = 'Notification';

export default Notification;
