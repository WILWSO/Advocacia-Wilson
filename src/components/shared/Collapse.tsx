import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { ACCORDION_COLORS } from '../../config/theme';

interface CollapseProps {
  id?: string;
  icon?: React.ReactNode;
  title: string;
  count?: number;
  color?: 'indigo' | 'gray' | 'blue' | 'purple' | 'green';
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  notification?: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null;
  headerAction?: React.ReactNode;
  className?: string;
}

/**
 * Componente Collapse individual
 * El toggle solo funciona en el ícono de flecha
 * Permite agregar acciones adicionales sin conflicto de eventos
 */
export const Collapse: React.FC<CollapseProps> = ({
  id,
  icon,
  title,
  count,
  color = 'gray',
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  children,
  notification,
  headerAction,
  className
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  
  // Si es controlado, usar controlledOpen, sino usar estado interno
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  
  const handleToggle = () => {
    const newValue = !isOpen;
    if (onOpenChange) {
      onOpenChange(newValue);
    } else {
      setInternalOpen(newValue);
    }
  };
  
  const colors = ACCORDION_COLORS[color] || ACCORDION_COLORS.gray;

  return (
    <div className={cn("border rounded-xl overflow-hidden shadow-sm", colors.border, className)}>
      {/* Notificación inline sobre el título */}
      {notification && (
        <div className="p-3 border-b border-gray-200">
          <div className={cn(
            "text-sm font-medium px-3 py-2 rounded-md",
            notification.type === 'success' && "bg-green-50 text-green-800",
            notification.type === 'error' && "bg-red-50 text-red-800",
            notification.type === 'warning' && "bg-yellow-50 text-yellow-800",
            notification.type === 'info' && "bg-blue-50 text-blue-800"
          )}>
            {notification.message}
          </div>
        </div>
      )}

      {/* Header: flex simple con toggle a la izquierda y botón a la derecha */}
      <div className={cn("flex items-center gap-2 p-4", colors.bg)}>
        {/* Toggle clickeable */}
        <button
          type="button"
          onClick={handleToggle}
          className="flex items-center gap-3 flex-1 hover:bg-black/5 transition-colors rounded-md p-2 -ml-2 text-left"
          aria-expanded={isOpen}
          aria-controls={id ? `collapse-content-${id}` : undefined}
        >
          {/* Icono chevron */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex-shrink-0"
          >
            <ChevronDown size={20} className="text-gray-600" />
          </motion.div>

          {/* Icono de sección */}
          {icon && (
            <div className="flex-shrink-0">
              {icon}
            </div>
          )}

          {/* Título */}
          <h3 className="text-base font-bold text-gray-800">
            {title}
          </h3>

          {/* Badge contador */}
          {count !== undefined && count > 0 && (
            <span className="bg-white px-2.5 py-1 rounded-full text-sm font-semibold text-gray-700 shadow-sm">
              {count}
            </span>
          )}
        </button>

        {/* Botón de acción */}
        {headerAction && (
          <div className="flex-shrink-0">
            {headerAction}
          </div>
        )}
      </div>

      {/* Contenido expandible */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={id ? `collapse-content-${id}` : undefined}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white border-t border-gray-200">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
