/**
 * Exports centralizados para componentes base (SSoT)
 * 
 * Ponto único de entrada para todos os componentes que implementam
 * Single Source of Truth no projeto.
 */

// Componentes base estruturais
export {
  BaseCard,
  BaseSection, 
  BaseList,
  BaseGrid,
  BaseDivider,
  type BaseListItem
} from './BaseComponents'

// Componentes de modal
export {
  BaseModal,
  FormModal,
  ViewModal,
  ConfirmModal
} from './BaseModals'

// Componentes de botão
export {
  BaseButton,
  IconButton,
  ActionButton,
  LinkButton,
  ButtonGroup
} from './BaseButtons'

// Sistema de categorías de botones (integrado en BaseButton)
export {
  getCategoryConfig,
  BUTTON_CATEGORY_CONFIG,
  type ButtonCategory,
  type CategoryConfig
} from './baseButtonCategories'

// Re-exportar tipos de props
export type {
  BaseModalProps,
  BaseFormModalProps,
  BaseViewModalProps,
  ConfirmModalProps,
  BaseButtonProps,
  IconButtonProps,
  ActionButtonProps,
  LinkButtonProps,
  BaseContainerProps,
  BaseSpacingProps,
  LoadingProps,
  ErrorProps
} from '../../types/baseProps'