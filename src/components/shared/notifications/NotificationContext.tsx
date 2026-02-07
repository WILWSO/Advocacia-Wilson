import React, { createContext, useState, useCallback, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, ArrowLeft } from 'lucide-react';
import { cn } from '../../../utils/cn';
import AccessibleButton from '../buttons/AccessibleButton';
import { getIcon as getSystemIcon } from '../../../config/icons';
import { NOTIFICATION_COLORS } from '../../../config/theme';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

interface NotificationContextType {
  showNotification: (type: NotificationType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  confirm: (options: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }) => Promise<boolean>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'danger',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const showNotification = useCallback(
    (type: NotificationType, message: string, duration: number = 5000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newNotification: Notification = { id, type, message, duration };

      setNotifications((prev) => [...prev, newNotification]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [removeNotification]
  );

  const success = useCallback(
    (message: string, duration?: number) => showNotification('success', message, duration),
    [showNotification]
  );

  const error = useCallback(
    (message: string, duration?: number) => showNotification('error', message, duration),
    [showNotification]
  );

  const warning = useCallback(
    (message: string, duration?: number) => showNotification('warning', message, duration),
    [showNotification]
  );

  const info = useCallback(
    (message: string, duration?: number) => showNotification('info', message, duration),
    [showNotification]
  );

  const confirm = useCallback(
    (options: {
      title?: string;
      message: string;
      confirmText?: string;
      cancelText?: string;
      type?: 'danger' | 'warning' | 'info';
    }): Promise<boolean> => {
      return new Promise((resolve) => {
        setConfirmDialog({
          isOpen: true,
          title: options.title || 'Confirmar ação',
          message: options.message,
          confirmText: options.confirmText || 'Confirmar',
          cancelText: options.cancelText || 'Cancelar',
          type: options.type || 'danger',
          onConfirm: () => {
            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
            resolve(true);
          },
          onCancel: () => {
            setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
            resolve(false);
          }
        });
      });
    },
    []
  );

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type: NotificationType) => {
    const colors = NOTIFICATION_COLORS[type];
    if (!colors) {
      console.error('Invalid notification type:', type, 'Available types:', Object.keys(NOTIFICATION_COLORS));
      // Fallback para evitar el crash
      const fallbackColors = NOTIFICATION_COLORS.info;
      return `${fallbackColors.bg} ${fallbackColors.text} ${fallbackColors.border}`;
    }
    return `${colors.bg} ${colors.text} ${colors.border}`;
  };

  const getIconColor = (type: NotificationType) => {
    const colors = NOTIFICATION_COLORS[type];
    if (!colors) {
      console.error('Invalid notification type for icon:', type);
      return NOTIFICATION_COLORS.info.icon;
    }
    return colors.icon;
  };

  return (
    <NotificationContext.Provider value={{ showNotification, success, error, warning, info, confirm }}>
      {children}
            {/* Confirm Dialog */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]"
              onClick={confirmDialog.onCancel}
            />
            
            {/* Dialog */}
            <div className="fixed inset-0 z-[151] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Icon */}
                <div className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4',
                  confirmDialog.type === 'danger' && 'bg-red-100',
                  confirmDialog.type === 'warning' && 'bg-yellow-100',
                  confirmDialog.type === 'info' && 'bg-blue-100'
                )}>
                  {confirmDialog.type === 'danger' && <AlertCircle className="w-6 h-6 text-red-600" />}
                  {confirmDialog.type === 'warning' && <AlertTriangle className="w-6 h-6 text-yellow-600" />}
                  {confirmDialog.type === 'info' && <Info className="w-6 h-6 text-blue-600" />}
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                  {confirmDialog.title}
                </h3>
                
                {/* Message */}
                <p className="text-sm text-gray-600 text-center mb-6">
                  {confirmDialog.message}
                </p>
                
                {/* Actions */}
                <div className="flex gap-3">
                  <AccessibleButton
                    onClick={confirmDialog.onCancel}
                    variant="warning"
                    size="lg"
                    className="flex-1"
                    leftIcon={<ArrowLeft className="w-5 h-5" />}
                  >
                    {confirmDialog.cancelText}
                  </AccessibleButton>
                  <AccessibleButton
                    onClick={confirmDialog.onConfirm}
                    variant="ghost"
                    size="lg"
                    className="flex-1"
                    leftIcon={getSystemIcon('close')}
                  >
                    {confirmDialog.confirmText}
                  </AccessibleButton>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
            {/* Toast Container */}
      <div className="fixed top-20 right-2 sm:right-4 z-[100] space-y-3 max-w-[calc(100vw-1rem)] sm:max-w-md w-full sm:w-auto pointer-events-none px-2 sm:px-0">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg shadow-lg border pointer-events-auto',
                getStyles(notification.type)
              )}
            >
              <div className={cn('flex-shrink-0 mt-0.5', getIconColor(notification.type))}>
                {getIcon(notification.type)}
              </div>
              <p className="flex-1 text-sm font-medium leading-relaxed">{notification.message}</p>
              <button
                onClick={() => removeNotification(notification.id)}
                className={cn(
                  'flex-shrink-0 rounded p-1 transition-colors',
                  notification.type === 'success' && 'hover:bg-green-100',
                  notification.type === 'error' && 'hover:bg-red-100',
                  notification.type === 'warning' && 'hover:bg-yellow-100',
                  notification.type === 'info' && 'hover:bg-blue-100'
                )}
                aria-label="Fechar notificação"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

// Asegurar export por defecto para HMR
export default NotificationProvider;
