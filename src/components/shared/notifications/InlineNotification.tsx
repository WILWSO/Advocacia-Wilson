import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../../utils/cn';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface InlineNotificationProps {
  type: NotificationType;
  message: string;
  onClose?: () => void;
  duration?: number;
  className?: string;
}

/**
 * Componente de notificación inline para mostrar dentro de formularios
 * Se posiciona relativamente dentro del contenedor padre
 */
export const InlineNotification: React.FC<InlineNotificationProps> = ({
  type,
  message,
  onClose,
  duration = 0,
  className
}) => {
  const notificationRef = useRef<HTMLDivElement>(null);

  // Hacer scroll y focus cuando aparece la notificación
  useEffect(() => {
    if (notificationRef.current) {
      // Scroll suave al elemento
      notificationRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
      });
      
      // Focus al elemento para accesibilidad
      notificationRef.current.focus();
    }
  }, []);
  
  const getIcon = () => {
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

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
    }
  };

  return (
    <motion.div
      ref={notificationRef}
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 300,
        mass: 0.6
      }}
      className={cn('w-full overflow-hidden', className)}
      tabIndex={-1}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={cn(
          'flex items-start gap-3 p-4 rounded-lg border shadow-sm',
          getStyles()
        )}
      >
        <div className={cn('flex-shrink-0 mt-0.5', getIconColor())}>
          {getIcon()}
        </div>
        <p className="flex-1 text-sm font-medium leading-relaxed">{message}</p>
        {onClose && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className={cn(
              'flex-shrink-0 rounded p-1 transition-colors',
              type === 'success' && 'hover:bg-green-100',
              type === 'error' && 'hover:bg-red-100',
              type === 'warning' && 'hover:bg-yellow-100',
              type === 'info' && 'hover:bg-blue-100'
            )}
            aria-label="Fechar notificação"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
