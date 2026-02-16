import React from 'react'
import { BaseModal } from './BaseModal'
import AccessibleButton from '../buttons/AccessibleButton'

interface ViewModalProps {
  isOpen: boolean
  onClose: () => void
  title: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl'
  onEdit?: () => void
  editLabel?: string
  canEdit?: boolean
  onDelete?: () => void
  deleteLabel?: string
  canDelete?: boolean
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
  onDelete,
  deleteLabel = 'Eliminar',
  canDelete = false,
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
      {canDelete && onDelete && (
        <AccessibleButton
          category="delete"
          type="button"
          onClick={onDelete}
          size="lg"
        >
          {deleteLabel}
        </AccessibleButton>
      )}
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
