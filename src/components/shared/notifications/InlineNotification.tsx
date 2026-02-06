import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { NOTIFICATION_COLORS } from '../../../config/theme';

type NotificationType = 'success' | 'error' | 'warning' | 'info';
type NotificationSize = 'sm' | 'base' | 'lg';

interface InlineNotificationProps {
  type: NotificationType;
  message: string;
  onClose?: () => void;
  duration?: number;
  className?: string;
  size?: NotificationSize; // Tamaño del texto: 'sm' | 'base' | 'lg'
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
  className,
  size = 'base' // Por defecto: text-base (16px)
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
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'info':
        return <Info className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  /**
   * ✅ SSoT: Usa NOTIFICATION_COLORS de config/theme
   * Consolidado: una sola función para estilos y color de icono
   */
  const colors = NOTIFICATION_COLORS[type];
  const colorStyles = `${colors.bg} ${colors.text} ${colors.border}`;
  const iconColor = colors.icon;

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs sm:text-sm';      // 12px → 14px
      case 'base':
        return 'text-sm sm:text-base';    // 14px → 16px (por defecto)
      case 'lg':
        return 'text-base sm:text-lg';    // 16px → 18px
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
          'flex items-start gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border shadow-sm',
          colorStyles
        )}
      >
        <div className={cn('flex-shrink-0 mt-0.5 sm:mt-0', iconColor)}>
          {getIcon()}
        </div>
        <p className={cn('flex-1 font-medium leading-relaxed', getTextSize())}>{message}</p>
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
              colors.bgHover
            )}
            aria-label="Fechar notificação"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
