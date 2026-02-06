import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { ACCORDION_COLORS } from '../../config/theme';

interface AccordionItem {
  id: string | number;
  icon?: React.ReactNode;
  title: string;
  count?: number;
  color?: 'indigo' | 'gray' | 'blue' | 'purple' | 'green';
  content: React.ReactNode;
  notification?: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null;
  headerAction?: React.ReactNode; // Botón o acción adicional en el header
}

interface AccordionProps {
  items?: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: Array<string | number> | boolean;
  className?: string;
  // Props para uso simple (sin items array)
  title?: string;
  icon?: React.ReactNode;
  color?: 'indigo' | 'gray' | 'blue' | 'purple' | 'green';
  children?: React.ReactNode;
}

/**
 * Componente Accordion reutilizable
 * Permite expandir/colapsar secciones con animaciones suaves
 * 
 * Dos modos de uso:
 * 1. Con array de items (múltiples secciones)
 * 2. Con children (sección única)
 * 
 * @param items - Array de items del acordeón (modo array)
 * @param title - Título para modo simple (con children)
 * @param icon - Ícono para modo simple
 * @param children - Contenido para modo simple
 * @param allowMultiple - Permite abrir múltiples items simultáneamente (default: true)
 * @param defaultOpen - IDs de items abiertos por defecto o boolean para modo simple
 * @param className - Clases CSS adicionales
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  title,
  icon,
  color = 'gray',
  children,
  allowMultiple = true,
  defaultOpen = [],
  className
}) => {
  // Si no hay items, crear un item único con children
  const accordionItems: AccordionItem[] = items || (title ? [{
    id: 'single',
    icon,
    title,
    color,
    content: children
  }] : []);

  const initialOpen = Array.isArray(defaultOpen) 
    ? defaultOpen 
    : (defaultOpen === true ? accordionItems.map(i => i.id) : []);

  const [openItems, setOpenItems] = useState<Array<string | number>>(initialOpen);

  const toggleItem = (id: string | number) => {
    if (allowMultiple) {
      setOpenItems(prev =>
        prev.includes(id)
          ? prev.filter(i => i !== id)
          : [...prev, id]
      );
    } else {
      setOpenItems(prev =>
        prev.includes(id) ? [] : [id]
      );
    }
  };

  const isOpen = (id: string | number) => openItems.includes(id);

  /**
   * ✅ SSoT: Colores importados desde config/theme.ts
   */
  const getColorClasses = (color?: string) => {
    return ACCORDION_COLORS[color as keyof typeof ACCORDION_COLORS] || ACCORDION_COLORS.gray;
  };

  return (
    <div className={cn("space-y-3", className)}>
      {accordionItems.map((item) => {
        const colors = getColorClasses(item.color);
        const itemIsOpen = isOpen(item.id);

        return (
          <div
            key={item.id}
            className={cn(
              "border rounded-xl overflow-hidden shadow-sm",
              colors.border
            )}
          >
            {/* Notificación inline sobre el título usando InlineNotification */}
            {item.notification && (
              <div className="p-3 border-b border-gray-200">
                <div className={cn(
                  "text-sm font-medium px-3 py-2 rounded-md",
                  item.notification.type === 'success' && "bg-green-50 text-green-800",
                  item.notification.type === 'error' && "bg-red-50 text-red-800",
                  item.notification.type === 'warning' && "bg-yellow-50 text-yellow-800",
                  item.notification.type === 'info' && "bg-blue-50 text-blue-800"
                )}>
                  {item.notification.message}
                </div>
              </div>
            )}

            {/* Header clickeable */}
            <div className={cn(
              "flex items-center justify-between gap-3 p-4 transition-colors",
              colors.bg
            )}>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
                className={cn(
                  "flex items-center gap-3 flex-1 min-w-0 text-left",
                  "focus:outline-none",
                  colors.hover,
                  "rounded-lg p-2 -ml-2"
                )}
                aria-expanded={itemIsOpen}
                aria-controls={`accordion-content-${item.id}`}
              >
                {item.icon && (
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                )}
                <h3 className="text-base font-bold text-gray-800">
                  {item.title}
                </h3>
                {item.count !== undefined && item.count > 0 && (
                  <span className="bg-white px-2.5 py-1 rounded-full text-sm font-semibold text-gray-700 shadow-sm">
                    {item.count}
                  </span>
                )}
                <motion.div
                  animate={{ rotate: itemIsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="flex-shrink-0 ml-auto"
                >
                  <ChevronDown size={20} className="text-gray-600" />
                </motion.div>
              </button>
              
              {/* Header Action (botón adicional) */}
              {item.headerAction && (
                <div className="flex-shrink-0 -mr-2">
                  {item.headerAction}
                </div>
              )}
            </div>

            {/* Contenido expandible */}
            <AnimatePresence initial={false}>
              {itemIsOpen && (
                <motion.div
                  id={`accordion-content-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-white border-t border-gray-200">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
