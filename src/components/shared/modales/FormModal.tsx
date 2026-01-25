import React from 'react'
import { BaseModal } from './BaseModal'
import AccessibleButton from '../buttons/AccessibleButton'

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl'
  onSubmit: (e: React.FormEvent) => void
  isSubmitting?: boolean
  submitLabel?: string
  cancelLabel?: string
  children: React.ReactNode
  className?: string
  showCancelButton?: boolean
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
  showCancelButton = true
}) => {
  const formId = `form-${title.replace(/\s+/g, '-').toLowerCase()}`
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(e)
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
        disabled={isSubmitting}
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
    >
      <form id={formId} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {children}
      </form>
    </BaseModal>
  )
}
