/**
 * Sistema de modais base (SSoT para componentes modais)
 * 
 * Elimina duplicação entre FormModal, ViewModal, ConfirmModal, etc.
 * Padroniza comportamento, acessibilidade e estilos de modais.
 * 
 * @example
 * import { BaseModal, FormModal, ViewModal, ConfirmModal } from './BaseModals'
 * 
 * <FormModal
 *   isOpen={isOpen}
 *   onClose={onClose}
 *   title="Editar Cliente"
 *   onSubmit={handleSubmit}
 *   submitText="Salvar"
 * >
 *   <FormContent />
 * </FormModal>
 */

import React, { useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'
import { 
  BaseModalProps, 
  BaseFormModalProps, 
  BaseViewModalProps, 
  ConfirmModalProps 
} from '../../types/baseProps'
import { useFormNotifications } from '../../hooks/shared/useFormNotifications'
import { useAsyncOperation } from '../../hooks/shared/useAsyncOperation'

// ==================== BASE MODAL ==================== //

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  variant = 'default',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  preventScroll = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  ...props
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Gerencia foco e acessibilidade
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      modalRef.current?.focus()
      
      if (preventScroll) {
        document.body.style.overflow = 'hidden'
      }
    } else {
      if (preventScroll) {
        document.body.style.overflow = 'unset'
      }
      previousFocusRef.current?.focus()
    }

    return () => {
      if (preventScroll) {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, preventScroll])

  // Gerencia tecla ESC
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeOnEscape, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-[95vw]'
  }

  const variantClasses = {
    default: 'bg-white',
    dark: 'bg-gray-900 text-white',
    glass: 'bg-white/90 backdrop-blur-md',
    bordered: 'bg-white border-2 border-gray-300'
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  // Filtrar props que não devem ir para o DOM
  const { 
    loading, 
    fields, 
    initialData, 
    onSubmit, 
    submitText,
    cancelText,
    isSubmitting,
    submitDisabled,
    showUnsavedWarning,
    unsavedChanges,
    hasUnsavedChanges,
    validationErrors,
    resetOnClose,
    formRef,
    submitVariant,
    cancelVariant,
    ...domProps 
  } = props

  return (
    <div 
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black/50 backdrop-blur-sm',
        overlayClassName
      )}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      {...domProps}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'w-full rounded-xl shadow-2xl',
          'transform transition-all duration-300 ease-out',
          'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      >
        {/* Header */}
        {(title || subtitle || showCloseButton) && (
          <div className={cn(
            'flex items-start justify-between p-6 pb-4',
            'border-b border-gray-200',
            contentClassName
          )}>
            <div className="flex-1 min-w-0">
              {title && (
                <h2 id="modal-title" className="text-xl font-semibold text-gray-900 truncate">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'ml-4 p-2 text-gray-400 hover:text-gray-600',
                  'rounded-lg hover:bg-gray-100 transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500'
                )}
                aria-label="Fechar modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cn('p-6', contentClassName)}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={cn(
            'px-6 py-4 bg-gray-50 rounded-b-xl',
            'border-t border-gray-200',
            contentClassName
          )}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== FORM MODAL ==================== //

export const FormModal: React.FC<BaseFormModalProps> = ({
  onSubmit,
  submitText = 'Salvar',
  cancelText = 'Cancelar',
  isSubmitting = false,
  submitDisabled = false,
  showUnsavedWarning = true,
  unsavedChanges = false,
  validationErrors = {},
  resetOnClose = false,
  formRef,
  submitVariant = 'primary',
  cancelVariant = 'secondary',
  ...modalProps
}) => {
  const { showNotification } = useFormNotifications()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    if (Object.keys(validationErrors).length > 0) {
      showNotification('Por favor, corrija os erros antes de continuar', 'error')
      return
    }
    
    try {
      await onSubmit(e)
    } catch (error) {
      showNotification('Erro ao salvar dados', 'error')
      console.error('Form submission error:', error)
    }
  }

  const handleClose = () => {
    if (showUnsavedWarning && unsavedChanges) {
      const confirmClose = window.confirm(
        'Você tem alterações não salvas. Deseja realmente fechar?'
      )
      if (!confirmClose) return
    }
    
    if (resetOnClose && formRef?.current) {
      formRef.current.reset()
    }
    
    modalProps.onClose()
  }

  const buttonVariants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  }

  const footer = (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={handleClose}
        disabled={isSubmitting}
        className={cn(
          'px-4 py-2 rounded-lg font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          buttonVariants[cancelVariant],
          isSubmitting && 'opacity-50 cursor-not-allowed'
        )}
      >
        {cancelText}
      </button>
      
      <button
        type="submit"
        form="modal-form"
        disabled={isSubmitting || submitDisabled}
        className={cn(
          'px-4 py-2 rounded-lg font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          buttonVariants[submitVariant],
          (isSubmitting || submitDisabled) && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSubmitting ? 'Salvando...' : submitText}
      </button>
    </div>
  )

  return (
    <BaseModal
      {...modalProps}
      onClose={handleClose}
      footer={footer}
      closeOnOverlayClick={!unsavedChanges}
      closeOnEscape={!unsavedChanges}
    >
      <form 
        id="modal-form"
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
      >
        {modalProps.children}
      </form>
    </BaseModal>
  )
}

// ==================== VIEW MODAL ==================== //

export const ViewModal: React.FC<BaseViewModalProps> = ({
  isOpen,
  onClose,
  title,
  size,
  showCloseButton,
  className,
  data,
  fields = [],
  actions,
  loading = false,
  error,
  emptyMessage = 'Nenhum dado encontrado',
  showEditButton = false,
  showDeleteButton = false,
  onEdit,
  onDelete,
  editText = 'Editar',
  deleteText = 'Excluir'
}) => {
  const renderField = (field: NonNullable<typeof fields>[0], value: any) => {
    if (field.render) {
      return field.render(value, data)
    }
    
    if (field.format) {
      return field.format(value)
    }
    
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400">—</span>
    }
    
    return String(value)
  }

  const footer = (actions || showEditButton || showDeleteButton) && (
    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
      <div className="flex gap-2 order-2 sm:order-1">
        {actions}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 order-1 sm:order-2">
        {showEditButton && onEdit && (
          <button
            onClick={() => onEdit(data)}
            className={cn(
              'w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors text-sm',
              'bg-primary-600 text-white hover:bg-primary-700',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            )}
          >
            {editText}
          </button>
        )}
        
        {showDeleteButton && onDelete && (
          <button
            onClick={() => onDelete(data)}
            className={cn(
              'w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors text-sm',
              'bg-red-600 text-white hover:bg-red-700',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            )}
          >
            {deleteText}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      showCloseButton={showCloseButton}
      className={className}
      footer={footer}
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">
          <p>Erro ao carregar dados: {typeof error === 'string' ? error : error.message}</p>
        </div>
      ) : !data ? (
        <div className="text-center py-8 text-gray-500">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {fields?.map((field) => (
              <div 
                key={field.key} 
                className={cn(
                  "space-y-2",
                  // Campos que ocupan toda la fila en desktop
                  ['endereco', 'observacoes', 'nome_completo'].includes(field.key) && "md:col-span-2 lg:col-span-3",
                  // Campos que ocupan 2 columnas en desktop grande
                  ['email', 'telefone'].includes(field.key) && "lg:col-span-1"
                )}
              >
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {field.label}
                </label>
                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg border text-sm leading-relaxed break-words">
                  {renderField(field, data[field.key])}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </BaseModal>
  )
}

// ==================== CONFIRM MODAL ==================== //

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  type = 'warning',
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  isProcessing = false,
  ...modalProps
}) => {
  const { execute } = useAsyncOperation()

  const handleConfirm = async () => {
    try {
      await execute(async () => {
        await onConfirm()
      })
      modalProps.onClose()
    } catch (error) {
      // Error is already handled by execute
      console.error('Confirm action error:', error)
    }
  }

  const typeIcons = {
    info: '🔵',
    warning: '⚠️',
    danger: '❌',
    success: '✅'
  }

  const typeColors = {
    info: 'text-blue-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    success: 'text-green-600'
  }

  const confirmButtonColors = {
    info: 'bg-blue-600 hover:bg-blue-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    danger: 'bg-red-600 hover:bg-red-700',
    success: 'bg-green-600 hover:bg-green-700'
  }

  const footer = (
    <div className="flex justify-end gap-3">
      <button
        onClick={modalProps.onClose}
        disabled={isProcessing}
        className={cn(
          'px-4 py-2 rounded-lg font-medium transition-colors',
          'border border-gray-300 text-gray-700 hover:bg-gray-50',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
          isProcessing && 'opacity-50 cursor-not-allowed'
        )}
      >
        {cancelText}
      </button>
      
      <button
        onClick={handleConfirm}
        disabled={isProcessing}
        className={cn(
          'px-4 py-2 rounded-lg font-medium text-white transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          confirmButtonColors[type],
          isProcessing && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isProcessing ? 'Processando...' : confirmText}
      </button>
    </div>
  )

  return (
    <BaseModal
      {...modalProps}
      size="sm"
      footer={footer}
      closeOnOverlayClick={!isProcessing}
      closeOnEscape={!isProcessing}
    >
      <div className="flex items-start gap-4">
        <div className={cn('text-2xl', typeColors[type])}>
          {typeIcons[type]}
        </div>
        <div className="flex-1">
          <p className="text-gray-900">{message}</p>
        </div>
      </div>
    </BaseModal>
  )
}

export default {
  BaseModal,
  FormModal,
  ViewModal,
  ConfirmModal
}