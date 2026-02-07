import React from 'react'
import { BaseModal } from './BaseModal'
import AccessibleButton from '../buttons/AccessibleButton'

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl'
  onSubmit?: (e: React.FormEvent) => void // Hacer opcional
  isSubmitting?: boolean
  submitLabel?: string
  cancelLabel?: string
  children: React.ReactNode
  className?: string
  showCancelButton?: boolean
  /** Indica si hay cambios no guardados (muestra confirmación antes de cerrar) */
  hasUnsavedChanges?: boolean
  /** Mensaje personalizado de confirmación */
  confirmMessage?: string
  /** Deshabilita el botón de submit */
  submitDisabled?: boolean
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  maxWidth = '4xl',
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  children,
  className = '',
  showCancelButton = true,
  hasUnsavedChanges = false,
  confirmMessage,
  submitDisabled = false
}) => {
  const formId = `form-${title.replace(/\s+/g, '-').toLowerCase()}`
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Solo llamar onSubmit si está definido y no está deshabilitado
    if (onSubmit && !submitDisabled) {
      onSubmit(e)
    }
  }

  const footer = (
    <>
      {showCancelButton && ( //
        <AccessibleButton
          category="cancel"
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          size="lg"
        >
          {cancelLabel}
        </AccessibleButton>
      )}
      <AccessibleButton
        category="save"
        type="submit"
        form={formId}
        disabled={isSubmitting || submitDisabled || !onSubmit}
        isLoading={isSubmitting}
        loadingText="Salvando..."
        size="lg"
      >
        {submitLabel}
      </AccessibleButton>
    </>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      footer={footer}
      className={className}
      hasUnsavedChanges={hasUnsavedChanges}
      confirmMessage={confirmMessage}
    >
      <form id={formId} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {children}
      </form>
    </BaseModal>
  )
}
