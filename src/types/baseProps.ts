/**
 * Tipos base para props comuns (SSoT para interfaces de componentes)
 * 
 * Centraliza definições de props que se repetem entre componentes similares.
 * Elimina duplicação de interfaces e padroniza assinaturas de componentes.
 * 
 * @example
 * import { BaseModalProps, BaseFormProps, LoadingProps } from './baseProps'
 * 
 * interface MyModalProps extends BaseModalProps {
 *   specificProp: string
 * }
 */

import { ReactNode, FormEvent, MouseEvent } from 'react'

// ==================== TIPOS BASE DE LAYOUT ==================== //

/**
 * Props base para containers responsivos
 */
export interface BaseContainerProps {
  children: ReactNode
  className?: string
  id?: string
  'data-testid'?: string
}

/**
 * Props base para componentes com espaçamento
 */
export interface BaseSpacingProps {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  margin?: 'none' | 'sm' | 'md' | 'lg' | 'xl' 
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Props base para componentes responsivos
 */
export interface BaseResponsiveProps {
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  hideOnMobile?: boolean
  hideOnDesktop?: boolean
}

// ==================== TIPOS BASE DE MODAIS ==================== //

/**
 * Props base para todos os modais
 */
export interface BaseModalProps extends BaseContainerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  footer?: ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'full'
  variant?: 'default' | 'dark' | 'glass' | 'bordered'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  preventScroll?: boolean
  overlayClassName?: string
  contentClassName?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl'
  closeOnOverlay?: boolean
  focusTrap?: boolean
}

/**
 * Props para modais com botões de ação
 */
export interface BaseModalActionsProps extends BaseModalProps {
  primaryAction?: {
    label: string
    onClick: () => void
    loading?: boolean
    disabled?: boolean
    variant?: 'primary' | 'secondary' | 'danger' | 'success'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    disabled?: boolean
  }
  additionalActions?: ReactNode
}

/**
 * Props específicas para modais de formulário
 */
export interface BaseFormModalProps extends BaseModalProps {
  onSubmit: (e: FormEvent) => void
  isSubmitting?: boolean
  submitLabel?: string
  cancelLabel?: string
  showCancelButton?: boolean
  hasUnsavedChanges?: boolean
  confirmMessage?: string
  formId?: string
}

/**
 * Props específicas para modais de visualização
 */
export interface BaseViewModalProps extends BaseModalProps {
  data?: any
  fields?: Array<{
    key: string
    label: string
    format?: (value: any) => string
    render?: (value: any, data: any) => ReactNode
  }>
  actions?: ReactNode
  loading?: boolean
  error?: string | Error | null
  emptyMessage?: string
  showEditButton?: boolean
  showDeleteButton?: boolean
  onEdit?: (data: any) => void
  onDelete?: (data: any) => void
  editText?: string
  deleteText?: string
}

/**
 * Props específicas para modais de confirmação
 */
export interface ConfirmModalProps extends BaseModalProps {
  type?: 'info' | 'warning' | 'danger' | 'success'
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  isProcessing?: boolean
}

/**
 * Props específicas para modais de formulário avançado
 */
export interface BaseFormModalProps extends BaseModalProps {
  onSubmit: (e: FormEvent) => void | Promise<void>
  submitText?: string
  cancelText?: string
  isSubmitting?: boolean
  submitDisabled?: boolean
  showUnsavedWarning?: boolean
  unsavedChanges?: boolean
  validationErrors?: Record<string, string>
  resetOnClose?: boolean
  formRef?: React.RefObject<HTMLFormElement>
  submitVariant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline'
  cancelVariant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline'
}

// ==================== TIPOS BASE DE FORMULÁRIOS ==================== //

/**
 * Props base para componentes de formulário
 */
export interface BaseFormProps extends BaseContainerProps {
  onSubmit: (e: FormEvent) => void
  isSubmitting?: boolean
  isValid?: boolean
  hasUnsavedChanges?: boolean
  autoComplete?: 'on' | 'off'
  noValidate?: boolean
}

/**
 * Props base para campos de input
 */
export interface BaseInputProps {
  id?: string
  name?: string
  label?: string
  placeholder?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  autoFocus?: boolean
  autoComplete?: string
  className?: string
  error?: string
  helperText?: string
  'data-testid'?: string
}

/**
 * Props para campos de texto específicos
 */
export interface BaseTextInputProps extends BaseInputProps {
  type?: 'text' | 'email' | 'tel' | 'url' | 'password'
  minLength?: number
  maxLength?: number
  pattern?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Props para select/dropdown
 */
export interface BaseSelectProps extends BaseInputProps {
  options?: Array<{
    value: string | number
    label: string
    disabled?: boolean
  }>
  multiple?: boolean
  size?: 'sm' | 'md' | 'lg'
}

// ==================== TIPOS BASE DE BOTÕES ==================== //

/**
 * Props base para todos os botões
 */
export interface BaseButtonProps {
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  className?: string
  id?: string
  'data-testid'?: string
  'aria-label'?: string
  'aria-describedby'?: string
  title?: string
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  icon?: string | ReactNode
  iconPosition?: 'left' | 'right'
}

/**
 * Props para botões com variantes visuais
 */
export interface BaseStyledButtonProps extends BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

/**
 * Props para botões de categoria específica (do AccessibleButton)
 */
export interface BaseCategoryButtonProps extends BaseStyledButtonProps {
  category?: 'create' | 'edit' | 'delete' | 'view' | 'save' | 'cancel' | 'close' | 'submit' | 'primary' | 'secondary' | 'danger' | 'warning'
}

/**
 * Props para botões com ícone
 */
export interface IconButtonProps {
  icon: string | ReactNode
  label: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'outline'
  rounded?: boolean
  tooltip?: string
  className?: string
  disabled?: boolean
  children?: ReactNode // Opcional ya que se genera automáticamente
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  id?: string
  'data-testid'?: string
}

/**
 * Props para botões de ação com confirmação
 */
export interface ActionButtonProps {
  action: 'edit' | 'delete' | 'view' | 'add' | 'download'
  onConfirm: () => void | Promise<void>
  confirmMessage?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  skipConfirmation?: boolean // Nova prop para desactivar fallback de segurança
  className?: string
  disabled?: boolean
  children?: ReactNode // Fazer opcional ya que se genera automáticamente
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void
  id?: string
  'data-testid'?: string
}

/**
 * Props para botões de link
 */
export interface LinkButtonProps {
  children: ReactNode
  href: string
  external?: boolean
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  id?: string
  'data-testid'?: string
}

// ==================== TIPOS BASE DE ESTADOS ==================== //

/**
 * Props para componentes com loading
 */
export interface LoadingProps {
  loading?: boolean
  loadingText?: string
  loadingIcon?: ReactNode
  skeleton?: boolean
}

/**
 * Props para componentes com erro
 */
export interface ErrorProps {
  error?: string | Error | null
  onRetry?: () => void
  showRetryButton?: boolean
  errorIcon?: ReactNode
}

/**
 * Props para componentes com estado vazio
 */
export interface EmptyStateProps {
  empty?: boolean
  emptyTitle?: string
  emptyMessage?: string
  emptyIcon?: ReactNode
  emptyAction?: {
    label: string
    onClick: () => void
  }
}

/**
 * Props combinadas para estados de dados
 */
export interface DataStateProps extends LoadingProps, ErrorProps, EmptyStateProps {
  data?: unknown[]
  isLoading?: boolean
  isEmpty?: boolean
  hasError?: boolean
}

// ==================== TIPOS BASE DE DADOS ==================== //

/**
 * Props para componentes com paginação
 */
export interface BasePaginationProps {
  currentPage?: number
  totalPages?: number
  totalItems?: number
  itemsPerPage?: number
  onPageChange?: (page: number) => void
  onItemsPerPageChange?: (itemsPerPage: number) => void
  showTotalItems?: boolean
  showItemsPerPage?: boolean
}

/**
 * Props para componentes com filtros
 */
export interface BaseFilterProps {
  searchTerm?: string
  onSearchChange?: (term: string) => void
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSortChange?: (field: string, order: 'asc' | 'desc') => void
  filters?: Record<string, unknown>
  onFiltersChange?: (filters: Record<string, unknown>) => void
}

// ==================== TIPOS BASE DE AUDITORIA ==================== //

/**
 * Props para informações de auditoria
 */
export interface BaseAuditProps {
  createdAt?: string | Date
  updatedAt?: string | Date
  createdBy?: string
  updatedBy?: string
  showCreatedInfo?: boolean
  showUpdatedInfo?: boolean
  dateFormat?: 'short' | 'long' | 'relative'
}

// ==================== EXPORTS CONSOLIDADOS ==================== //

/**
 * União de props mais comuns para facilitar import
 */
export interface CommonComponentProps 
  extends BaseContainerProps, 
          LoadingProps, 
          ErrorProps, 
          BaseResponsiveProps {
  // Combinação dos props mais utilizados
}

/**
 * Props para páginas administrativas
 */
export interface AdminPageProps 
  extends BaseContainerProps,
          DataStateProps,
          BaseFilterProps,
          BasePaginationProps {
  title?: string
  subtitle?: string
  headerActions?: ReactNode
}

/**
 * Props para páginas públicas
 */
export interface PublicPageProps 
  extends BaseContainerProps,
          BaseResponsiveProps {
  seoTitle?: string
  seoDescription?: string
}

// Type helpers para extrair props específicos
export type ModalOnlyProps = Pick<BaseModalProps, 'isOpen' | 'onClose' | 'title'>
export type FormOnlyProps = Pick<BaseFormProps, 'onSubmit' | 'isSubmitting'>
export type ButtonOnlyProps = Pick<BaseButtonProps, 'onClick' | 'disabled' | 'children'>
export type InputOnlyProps = Pick<BaseInputProps, 'value' | 'onChange' | 'error'>