/**
 * Sistema de categorías de botones para BaseButtons (SSoT)
 * 
 * Proporciona configuración centralizada de categorías de botones
 * para usar con BaseButton, IconButton y ActionButton.
 * 
 * BENEFICIOS:
 * - Mantiene la brevedad del sistema de categorías legacy
 * - Compatible con la arquitectura SSoT de BaseButtons
 * - Cambios globales en un solo lugar
 * - Type-safe con TypeScript
 * 
 * @example
 * import { useCategoryButton } from '@/components/shared/baseButtonCategories'
 * 
 * const saveConfig = useCategoryButton('save')
 * <BaseButton {...saveConfig}>Salvar</BaseButton>
 * 
 * // O usar el componente wrapper
 * <CategoryButton category="save">Salvar</CategoryButton>
 */

import React from 'react'
import { 
  Plus, 
  Save, 
  Edit, 
  Trash2, 
  X, 
  Eye, 
  Upload, 
  Download,
  Send
} from 'lucide-react'

// ==================== TYPES ==================== //

export type ButtonCategory = 
  | 'create'
  | 'save'
  | 'edit'
  | 'delete'
  | 'cancel'
  | 'cancelModal'
  | 'view'
  | 'close'
  | 'submit'
  | 'download'
  | 'upload'

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'success' 
  | 'danger' 
  | 'warning' 
  | 'outline' 
  | 'ghost' 
  | 'link'

export interface CategoryConfig {
  variant: ButtonVariant
  icon?: React.ReactNode
  label?: string
  confirmMessage?: string // Para ActionButton
}

// ==================== CONFIGURACIÓN CENTRALIZADA ==================== //

/**
 * Configuración de categorías de botones
 * 
 * INSTRUCCIONES:
 * Para cambiar el estilo de TODOS los botones de una categoría,
 * modifica su configuración aquí.
 * 
 * EJEMPLO:
 * Cambiar todos los botones "create" a color primary:
 * create: { variant: 'primary', icon: <Plus size={18} />, label: 'Crear' }
 */
export const BUTTON_CATEGORY_CONFIG: Record<ButtonCategory, CategoryConfig> = {
  /**
   * CREATE: Botones para crear nuevos registros
   * Uso: "Novo Cliente", "Novo Processo", "Adicionar"
   */
  create: {
    variant: 'outline',
    icon: <Plus size={18} />,
    label: 'Criar'
  },

  /**
   * SAVE: Botones para guardar cambios
   * Uso: "Salvar", "Guardar", "Confirmar"
   */
  save: {
    variant: 'primary',
    icon: <Save size={18} />,
    label: 'Salvar'
  },

  /**
   * EDIT: Botones para editar registros
   * Uso: "Editar", "Modificar", "Alterar"
   */
  edit: {
    variant: 'primary',
    icon: <Edit size={18} />,
    label: 'Editar'
  },

  /**
   * DELETE: Botones para acciones destructivas
   * Uso: "Excluir", "Deletar", "Remover"
   */
  delete: {
    variant: 'danger',
    icon: <Trash2 size={18} />,
    label: 'Excluir',
    confirmMessage: 'Tem certeza que deseja excluir? Esta ação não pode ser desfeita.'
  },

  /**
   * CANCEL: Botones para cancelar acciones generales
   * Uso: "Cancelar" en formularios y operaciones
   */
  cancel: {
    variant: 'ghost',
    icon: <X size={18} />,
    label: 'Cancelar'
  },

  /**
   * CANCEL MODAL: Botones de cancelar específicos para modales
   * Uso: "Cancelar" en diálogos y modales (estilo outline)
   */
  cancelModal: {
    variant: 'outline',
    icon: <X size={18} />,
    label: 'Cancelar'
  },

  /**
   * VIEW: Botones para ver detalles
   * Uso: "Ver Detalhes", "Visualizar", "Abrir"
   */
  view: {
    variant: 'outline',
    icon: <Eye size={18} />,
    label: 'Ver'
  },

  /**
   * CLOSE: Botones para cerrar modales/diálogos
   * Uso: "Fechar", botones X en esquinas
   */
  close: {
    variant: 'ghost',
    icon: <X size={18} />,
    label: 'Fechar'
  },

  /**
   * SUBMIT: Botones para enviar formularios
   * Uso: "Enviar", "Submeter", formularios externos
   */
  submit: {
    variant: 'primary',
    icon: <Send size={18} />,
    label: 'Enviar'
  },

  /**
   * DOWNLOAD: Botones para descargar archivos
   * Uso: "Baixar", "Download", exportar documentos
   */
  download: {
    variant: 'secondary',
    icon: <Download size={18} />,
    label: 'Baixar'
  },

  /**
   * UPLOAD: Botones para subir archivos
   * Uso: "Enviar Arquivo", "Upload", anexar documentos
   */
  upload: {
    variant: 'outline',
    icon: <Upload size={18} />,
    label: 'Enviar Arquivo'
  }
}

// ==================== HOOK ==================== //

/**
 * Hook para obtener configuración de categoría de botón
 * 
 * @param category - Categoría del botón
 * @returns Configuración (variant, icon, label, confirmMessage)
 * 
 * @example
 * const config = useCategoryButton('save')
 * <BaseButton variant={config.variant} icon={config.icon}>
 *   {config.label}
 * </BaseButton>
 */
export const useCategoryButton = (category: ButtonCategory): CategoryConfig => {
  return BUTTON_CATEGORY_CONFIG[category]
}

// ==================== HELPER FUNCTION ==================== //

/**
 * Función helper para obtener configuración sin hook
 * Útil para componentes de clase o fuera de React
 */
export const getCategoryConfig = (category: ButtonCategory): CategoryConfig => {
  return BUTTON_CATEGORY_CONFIG[category]
}

// ==================== EXPORTS ==================== //

export default {
  BUTTON_CATEGORY_CONFIG,
  useCategoryButton,
  getCategoryConfig
}
