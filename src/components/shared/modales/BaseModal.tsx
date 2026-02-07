import React, { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { CONFIRMATION_MESSAGES } from '../../../config/messages'
import { useNotification } from '../notifications/useNotification'
import AccessibleButton from '../buttons/AccessibleButton'
import { CSS_UTILITY_MAPS } from '../../../config/theme'

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl'
  children: React.ReactNode
  footer?: React.ReactNode
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  className?: string
  /** Indica si hay cambios no guardados (muestra confirmación antes de cerrar) */
  hasUnsavedChanges?: boolean
  /** Mensaje personalizado de confirmación */
  confirmMessage?: string
}

const maxWidthClasses = {
  ...CSS_UTILITY_MAPS.maxWidth,
  // Mejorando tamaños para mejor experiencia en desktop
  'lg': 'max-w-2xl',
  'xl': 'max-w-4xl', 
  '2xl': 'max-w-6xl'
};

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  maxWidth = '4xl',
  children,
  footer,
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = '',
  hasUnsavedChanges = false,
  confirmMessage
}) => {
  const { confirm } = useNotification();

  // Handler de cierre con confirmación si hay cambios
  // Usar useCallback para evitar recrear la función en cada render
  const handleClose = useCallback(async () => {
    if (hasUnsavedChanges) {
      const confirmed = await confirm({
        title: 'Descartar alterações?',
        message: confirmMessage || CONFIRMATION_MESSAGES.DISCARD_CHANGES,
        confirmText: 'Descartar',
        cancelText: 'Continuar editando',
        type: 'warning'
      });
      if (confirmed) {
        onClose();
      }
    } else {
      onClose();
    }
  }, [hasUnsavedChanges, confirmMessage, confirm, onClose]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleClose])

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={closeOnBackdropClick ? handleClose : undefined}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              mass: 0.8
            }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'bg-white rounded-xl shadow-2xl w-full max-h-[95vh] sm:max-h-[90vh]',
              'flex flex-col',
              'mx-2 sm:mx-0', // Márgenes más pequeños en móvil
              maxWidthClasses[maxWidth],
              className
            )}
          >
            {/* Header */}
            <div className="p-3 sm:p-4 md:p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-xl">
              <h2
                id="modal-title"
                className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-800 pr-2 truncate"
              >
                {title}
              </h2>
              {showCloseButton && (
                <AccessibleButton
                  onClick={handleClose}
                  variant="ghost"
                  size="sm"
                  aria-label="Fechar modal"
                  type="button"
                  className="!p-2"
                >
                  <X size={24} />
                </AccessibleButton>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 min-h-0">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="sticky bottom-0 bg-white p-3 sm:p-4 md:p-6 border-t border-neutral-200 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 z-10 rounded-b-xl">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
