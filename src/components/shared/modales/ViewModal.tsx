import React from 'react'
import { BaseModal } from './BaseModal'
import AccessibleButton from '../buttons/AccessibleButton'

interface ViewModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl'
  onEdit?: () => void
  editLabel?: string
  canEdit?: boolean
  children: React.ReactNode
  className?: string
  additionalActions?: React.ReactNode
}

export const ViewModal: React.FC<ViewModalProps> = ({
  isOpen,
  onClose,
  title,
  maxWidth = '5xl',
  onEdit,
  editLabel = 'Editar',
  canEdit = true,
  children,
  className = '',
  additionalActions
}) => {
  const footer = (
    <>
      {additionalActions}
      <AccessibleButton
        category="close"
        type="button"
        onClick={onClose}
        size="lg"
      >
        Fechar
      </AccessibleButton>
      {canEdit && onEdit && (
        <AccessibleButton
          category="edit"
          type="button"
          onClick={onEdit}
          size="lg"
        >
          {editLabel}
        </AccessibleButton>
      )}
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
      <div className="space-y-6">
        {children}
      </div>
    </BaseModal>
  )
}
