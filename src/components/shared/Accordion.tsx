import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AccordionItem {
  id: string | number;
  icon?: React.ReactNode;
  title: string;
  count?: number;
  color?: 'indigo' | 'gray' | 'blue' | 'purple' | 'green';
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: Array<string | number>;
  className?: string;
}

/**
 * Componente Accordion reutilizable
 * Permite expandir/colapsar secciones con animaciones suaves
 * 
 * @param items - Array de items del acordeón
 * @param allowMultiple - Permite abrir múltiples items simultáneamente (default: true)
 * @param defaultOpen - IDs de items abiertos por defecto
 * @param className - Clases CSS adicionales
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = true,
  defaultOpen = [],
  className
}) => {
  const [openItems, setOpenItems] = useState<Array<string | number>>(defaultOpen);

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

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'indigo':
        return {
          bg: 'bg-indigo-50',
          hover: 'hover:bg-indigo-100',
          border: 'border-indigo-200'
        };
      case 'gray':
        return {
          bg: 'bg-gray-50',
          hover: 'hover:bg-gray-100',
          border: 'border-gray-200'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          hover: 'hover:bg-blue-100',
          border: 'border-blue-200'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          hover: 'hover:bg-purple-100',
          border: 'border-purple-200'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          hover: 'hover:bg-green-100',
          border: 'border-green-200'
        };
      default:
        return {
          bg: 'bg-gray-50',
          hover: 'hover:bg-gray-100',
          border: 'border-gray-200'
        };
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => {
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
            {/* Header clickeable */}
            <button
              onClick={() => toggleItem(item.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
                colors.bg,
                colors.hover
              )}
              aria-expanded={itemIsOpen}
              aria-controls={`accordion-content-${item.id}`}
            >
              <div className="flex items-center gap-3">
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
              </div>
              <motion.div
                animate={{ rotate: itemIsOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex-shrink-0"
              >
                <ChevronDown size={20} className="text-gray-600" />
              </motion.div>
            </button>

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
