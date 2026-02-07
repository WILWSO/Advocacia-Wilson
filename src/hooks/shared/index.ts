/**
 * Exports centralizados para hooks compartilhados (SSoT)
 * 
 * Ponto único de entrada para todos os hooks que implementam
 * Single Source of Truth no projeto.
 */

// Hooks de operações assíncronas
export { useAsyncOperation, useAsyncUpload } from './useAsyncOperation'

// Hooks de notificações
export { 
  useFormNotifications, 
  useInlineNotifications, 
  useToastNotifications,
  type NotificationType 
} from './useFormNotifications'

// Hooks de operações CRUD
export { 
  useCrudOperations, 
  useExtendedCrudOperations,
  type ModalState 
} from './useCrudOperations'

// Hooks de validação  
export {
  useFormValidation
} from './useFormValidation'

// Hooks de formatação
export {
  useFieldFormatting,
  useRealTimeFormatting,
  FIELD_FORMAT_CONFIG
} from './useFieldFormatting'