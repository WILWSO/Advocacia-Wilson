import { SYSTEM_ICONS } from '../../../config/icons';

/**
 * Configuración centralizada de categorías de botones
 * 
 * INSTRUCCIONES DE USO:
 * 
 * 1. Para cambiar el estilo de TODOS los botones de una categoría:
 *    Modifica el objeto de configuración de esa categoría
 * 
 * 2. Para personalizar un botón individual:
 *    Pasa la prop `variant` directamente en el componente
 * 
 * EJEMPLO DE CAMBIO GLOBAL:
 * 
 * Cambiar todos los botones "create" a color gold:
 * create: {
 *   variant: 'secondary', // secondary es gold
 *   icon: SYSTEM_ICONS.create,
 *   defaultLabel: 'Crear'
 * }
 * 
 * Cambiar todos los botones "save" a color verde:
 * Primero agregar variante 'success' en AccessibleButton
 * save: {
 *   variant: 'success',
 *   icon: SYSTEM_ICONS.save,
 *   defaultLabel: 'Guardar'
 * }
 */

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
  | 'upload';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'warning' | 'neutral' | 'teste';

interface CategoryColors {  
  base: string;     /** Color base del botón */
  hover: string;    /** Color al hacer hover */
  text: string;     /** Color del texto */
  focus: string;    /** Color del focus ring */
}

interface CategoryConfig { 
  variant: ButtonVariant;   /** Variante de color por defecto (se usa si no hay colors personalizado) */
  colors?: CategoryColors;  /** Colores personalizados (opcional - tiene prioridad sobre variant) */
  icon?: any;               /** Icono por defecto de la categoría */
  defaultLabel?: string;    /** Label por defecto si no se especifica */
}

/**
 * CONFIGURACIÓN CENTRALIZADA DE CATEGORÍAS
 * 
 * Cambia estos valores para afectar TODOS los botones de esa categoría en el sistema
 * 
 * Puedes usar:
 * 1. variant - Para usar colores predefinidos (primary, secondary, etc)
 * 2. colors - Para definir colores completamente personalizados
 * 
 * Si defines colors, tiene prioridad sobre variant
 */
export const BUTTON_CATEGORIES: Record<ButtonCategory, CategoryConfig> = {
  /**
   * CREATE: Botones para crear nuevos registros
   * Ej: "Novo Processo", "Novo Cliente", "Novo Usuário"
   * 
   * EJEMPLO con colores personalizados:
   * colors: {
   *   base: 'bg-blue-600',
   *   hover: 'hover:bg-blue-700',
   *   text: 'text-white',
   *   focus: 'focus:ring-blue-500'
   * }
   */
  create: {
    variant: 'outline',
     // Descomenta para usar colores personalizados:
    // colors: {
    //   base: 'bg-gold-600',
    //   hover: 'hover:bg-gold-700',
    //   text: 'text-white',
    //   focus: 'focus:ring-gold-500'
    // },
    icon: SYSTEM_ICONS.create,
    defaultLabel: 'Criar'    
  },

  /**
   * SAVE: Botones para guardar cambios
   * Ej: "Salvar", "Guardar Alterações"
   */
  save: {
    variant: 'primary',
    // colors: {
    //   base: 'bg-primary-800',
    //   hover: 'hover:bg-primary-500',
    //   text: 'text-white',
    //   focus: 'focus:ring-primary-100'
    //},
    icon: SYSTEM_ICONS.save,
    defaultLabel: 'Salvar'
  },

  /**
   * EDIT: Botones para editar registros existentes
   * Ej: "Editar", "Modificar"
   */
  edit: {
    variant: 'primary',
    icon: SYSTEM_ICONS.edit,
    defaultLabel: 'Editar'
  },

  /**
   * DELETE: Botones para eliminar/acciones destructivas
   * Ej: "Excluir", "Remover", "Deletar"
   */
  delete: {
    variant: 'danger',
    icon: SYSTEM_ICONS.delete,
    defaultLabel: 'Excluir'
  },

  /**
   * CANCEL: Botones para cancelar acciones
   * Ej: "Cancelar", "Fechar sem salvar"
   */
  cancel: {
    variant: 'ghost',
    icon: SYSTEM_ICONS.close,
    defaultLabel: 'Cancelar'
  },

  /**
   * CANCEL-MODAL: Botones de cancelar específicos para modales
   * Usa el estilo original del FormModal (borde neutral, fondo hover suave)
   * Ej: Botones "Cancelar" en diálogos y formularios modales
   */
  cancelModal: {
    variant: 'ghost', // Fallback
    colors: {
      base: 'bg-white border border-neutral-300',
      hover: 'hover:bg-neutral-50',
      text: 'text-neutral-700',
      focus: 'focus:ring-neutral-400'
    },
    icon: SYSTEM_ICONS.close,
    defaultLabel: 'Cancelar'
  },

  /**
   * VIEW: Botones para ver detalles
   * Ej: "Ver Detalhes", "Visualizar"
   */
  view: {
    variant: 'outline',
    icon: SYSTEM_ICONS.view,
    defaultLabel: 'Ver'
  },

  /**
   * CLOSE: Botones para cerrar modales/diálogos
   * Ej: "Fechar", "Cerrar"
   */
  close: {
    variant: 'outline',
    icon: SYSTEM_ICONS.close,
    defaultLabel: 'Fechar'
  },

  /**
   * SUBMIT: Botones para enviar formularios
   * Ej: "Enviar", "Submeter"
   */
  submit: {
    variant: 'primary',
    icon: SYSTEM_ICONS.submit,
    defaultLabel: 'Enviar'
  },

  /**
   * DOWNLOAD: Botones para descargar archivos
   * Ej: "Baixar", "Download"
   */
  download: {
    variant: 'secondary',
    icon: SYSTEM_ICONS.download,
    defaultLabel: 'Baixar'
  },

  /**
   * UPLOAD: Botones para subir archivos
   * Ej: "Enviar Arquivo", "Upload"
   */
  upload: {
    variant: 'outline',
    icon: SYSTEM_ICONS.upload,
    defaultLabel: 'Enviar Arquivo'
  }
};

/**
 * Helper function para obtener la configuración de una categoría
 */
export const getCategoryConfig = (category: ButtonCategory): CategoryConfig => {
  return BUTTON_CATEGORIES[category];
};
