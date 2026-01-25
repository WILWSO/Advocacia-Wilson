import { useState, useCallback, useEffect, useRef } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface InlineNotificationState {
  show: boolean;
  type: NotificationType;
  message: string;
}

/**
 * Hook para gestionar notificaciones inline dentro de formularios
 * Mantiene el estado local de una notificación para un componente específico
 */
export const useInlineNotification = () => {
  const [notification, setNotification] = useState<InlineNotificationState>({
    show: false,
    type: 'info',
    message: ''
  });

  // Ref para evitar que se cierre automáticamente al desmontar
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showNotification = useCallback((type: NotificationType, message: string, duration?: number) => {
    // Limpiar timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setNotification({ show: true, type, message });

    // Los mensajes de error NO se auto-cierran (requieren acción del usuario)
    // Los demás tipos se auto-cierran según la duración especificada
    const autoDismissDuration = type === 'error' ? 0 : (duration ?? 5000);

    // Auto-hide después de la duración especificada (si no es 0)
    if (autoDismissDuration > 0) {
      timeoutRef.current = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, autoDismissDuration);
    }
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    showNotification('success', message, duration);
  }, [showNotification]);

  const error = useCallback((message: string, duration?: number) => {
    showNotification('error', message, duration);
  }, [showNotification]);

  const warning = useCallback((message: string, duration?: number) => {
    showNotification('warning', message, duration);
  }, [showNotification]);

  const info = useCallback((message: string, duration?: number) => {
    showNotification('info', message, duration);
  }, [showNotification]);

  const hide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setNotification(prev => ({ ...prev, show: false }));
  }, []);

  return {
    notification,
    showNotification,
    success,
    error,
    warning,
    info,
    hide
  };
};
