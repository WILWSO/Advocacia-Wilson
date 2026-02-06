/**
 * Configuración Centralizada de Tema (SSoT)
 * 
 * Define colores, variantes y utilidades de tema.
 * Cambiar un color aquí actualizará todas las referencias en el sistema.
 */

/**
 * Colores del sistema con todas sus variantes
 */
export const THEME_COLORS = {
  blue: {
    bg: 'bg-blue-50',
    bgHover: 'hover:bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    button: 'bg-blue-600 hover:bg-blue-700',
    ring: 'focus:ring-blue-500',
    icon: 'text-blue-600',
  },
  purple: {
    bg: 'bg-purple-50',
    bgHover: 'hover:bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
    button: 'bg-purple-600 hover:bg-purple-700',
    ring: 'focus:ring-purple-500',
    icon: 'text-purple-600',
  },
  indigo: {
    bg: 'bg-indigo-50',
    bgHover: 'hover:bg-indigo-100',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    button: 'bg-indigo-600 hover:bg-indigo-700',
    ring: 'focus:ring-indigo-500',
    icon: 'text-indigo-600',
  },
  green: {
    bg: 'bg-green-50',
    bgHover: 'hover:bg-green-100',
    text: 'text-green-700',
    border: 'border-green-200',
    button: 'bg-green-600 hover:bg-green-700',
    ring: 'focus:ring-green-500',
    icon: 'text-green-600',
  },
  red: {
    bg: 'bg-red-50',
    bgHover: 'hover:bg-red-100',
    text: 'text-red-700',
    border: 'border-red-200',
    button: 'bg-red-600 hover:bg-red-700',
    ring: 'focus:ring-red-500',
    icon: 'text-red-600',
  },
  yellow: {
    bg: 'bg-yellow-50',
    bgHover: 'hover:bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    button: 'bg-yellow-600 hover:bg-yellow-700',
    ring: 'focus:ring-yellow-500',
    icon: 'text-yellow-600',
  },
  neutral: {
    bg: 'bg-neutral-50',
    bgHover: 'hover:bg-neutral-100',
    text: 'text-neutral-700',
    border: 'border-neutral-200',
    button: 'bg-neutral-600 hover:bg-neutral-700',
    ring: 'focus:ring-neutral-500',
    icon: 'text-neutral-600',
  },
  primary: {
    bg: 'bg-primary-50',
    bgHover: 'hover:bg-primary-100',
    text: 'text-primary-700',
    border: 'border-primary-200',
    button: 'bg-primary-600 hover:bg-primary-700',
    ring: 'focus:ring-primary-500',
    icon: 'text-primary-600',
  },
} as const;

/**
 * Tipo de color del tema
 */
export type ThemeColor = keyof typeof THEME_COLORS;

/**
 * Colores comunes para componentes CrudListManager
 */
export const CRUD_COLORS = ['blue', 'purple', 'indigo', 'green'] as const;

export type CrudColor = typeof CRUD_COLORS[number];

/**
 * Helper para obtener clases de color
 */
export function getColorClasses(color: ThemeColor) {
  return THEME_COLORS[color];
}

/**
 * Helper para construir className con color
 */
export function buildColorClassName(
  color: ThemeColor,
  variant: keyof typeof THEME_COLORS[ThemeColor]
): string {
  return THEME_COLORS[color][variant];
}

/**
 * Estados de notificación con colores asociados
 */
export const NOTIFICATION_COLORS = {
  success: THEME_COLORS.green,
  error: THEME_COLORS.red,
  warning: THEME_COLORS.yellow,
  info: THEME_COLORS.blue,
} as const;

/**
 * Estados de status con colores asociados
 */
export const STATUS_COLORS = {
  ativo: THEME_COLORS.green,
  inativo: THEME_COLORS.red,
  pendente: THEME_COLORS.yellow,
  concluido: THEME_COLORS.blue,
  arquivado: THEME_COLORS.neutral,
} as const;

/**
 * Roles con colores asociados
 */
export const ROLE_COLORS = {
  admin: THEME_COLORS.purple,
  advogado: THEME_COLORS.blue,
  assistente: THEME_COLORS.green,
} as const;

/**
 * Status de procesos jurídicos con colores asociados
 */
export const PROCESSO_STATUS_COLORS = {
  em_aberto: 'bg-blue-100 text-blue-800 border-blue-200',
  em_andamento: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  fechado: 'bg-green-100 text-green-800 border-green-200',
  suspenso: 'bg-gray-100 text-gray-800 border-gray-200',
  arquivado: 'bg-neutral-100 text-neutral-800 border-neutral-200',
} as const;

/**
 * Prioridades de procesos con colores asociados
 */
export const PROCESSO_PRIORITY_COLORS = {
  baixa: 'bg-gray-100 text-gray-700 border-gray-300',
  media: 'bg-blue-100 text-blue-700 border-blue-300',
  alta: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  urgente: 'bg-red-100 text-red-800 border-red-300',
} as const;

/**
 * Tipos de audiências con colores asociados
 */
export const AUDIENCIA_COLORS = {
  inicial: 'bg-blue-100 border-blue-500 text-blue-900',
  instrucao: 'bg-green-100 border-green-500 text-green-900',
  julgamento: 'bg-purple-100 border-purple-500 text-purple-900',
  conciliacao: 'bg-indigo-100 border-indigo-500 text-indigo-900',
  default: 'bg-gray-100 border-gray-400 text-gray-800',
} as const;

/**
 * Variantes de botones (para AccessibleButton y sistema de botones)
 * ✅ SSoT: Definición única de todas las variantes de botones
 */
export const BUTTON_VARIANTS = {
  primary: 'bg-primary-800 hover:bg-primary-900 text-white focus:ring-primary-500',
  secondary: 'bg-gold-600 hover:bg-gold-700 text-white focus:ring-gold-500',
  outline: 'border-2 border-primary-800 text-primary-800 hover:bg-primary-800 hover:text-white focus:ring-primary-500',
  ghost: 'text-primary-800 hover:bg-primary-50 focus:ring-primary-500',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  warning: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500',
  neutral: 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-400',
  teste: 'px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors'
} as const;

/**
 * Tamaños de botones (para AccessibleButton)
 */
export const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
} as const;

/**
 * Colores para Accordion (sistema de acordeón)
 * ✅ SSoT: Colores configurables para componente Accordion
 */
export const ACCORDION_COLORS = {
  blue: {
    bg: 'bg-blue-50',
    hover: 'hover:bg-blue-100',
    border: 'border-blue-200'
  },
  green: {
    bg: 'bg-green-50',
    hover: 'hover:bg-green-100',
    border: 'border-green-200'
  },
  purple: {
    bg: 'bg-purple-50',
    hover: 'hover:bg-purple-100',
    border: 'border-purple-200'
  },
  indigo: {
    bg: 'bg-indigo-50',
    hover: 'hover:bg-indigo-100',
    border: 'border-indigo-200'
  },
  gray: {
    bg: 'bg-gray-50',
    hover: 'hover:bg-gray-100',
    border: 'border-gray-200'
  }
} as const;

/**
 * Clases comunes para componentes externos
 */
export const EXTERNAL_COMPONENT_CLASSES = {
  /** Botón de reproducción de YouTube */
  youtubeButton: 'bg-red-600 group-hover:bg-red-700',
  /** Contenedor de error */
  errorContainer: 'bg-red-100',
  errorText: 'text-red-800',
  errorBorder: 'border-red-200',
  errorBg: 'bg-red-50',
  /** Contenedor de éxito */
  successBg: 'bg-green-100',
  successText: 'text-green-700',
  successBorder: 'border-green-200'
} as const;

/**
 * Mapas de utilidad CSS (para ResponsiveGrid, BaseModal, etc)
 */
export const CSS_UTILITY_MAPS = {
  align: {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  },
  justify: {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  },
  maxWidth: {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl'
  }
} as const;

/**
 * Combinaciones comunes de colores para botones y estados
 * ✅ SSoT: Estilos reutilizables en Headers, Menus y componentes de layout
 */
export const COMMON_BUTTON_COLORS = {
  goldLight: 'bg-gold-100 text-primary-800 hover:bg-gold-200',
  goldTransparent: 'bg-gold-500/20 text-white hover:bg-gold-500/30',
  logoutDanger: 'text-red-600 hover:bg-red-50',
  primaryAction: 'bg-primary-800 hover:bg-primary-900 text-white',
  skipLink: 'bg-primary-900 text-white',
  skipLinkFocus: 'focus:ring-gold-500'
} as const;

/**
 * Clases comunes para componentes de secciones Home
 * ✅ SSoT: Estilos reutilizables en Hero, About, Team, PracticeAreas, Testimonials
 */
export const HOME_SECTION_CLASSES = {
  ctaButton: 'inline-block px-6 py-3 bg-primary-800 hover:bg-primary-900 text-white rounded text-sm font-medium transition-colors',
  linkMore: 'text-gold-600 hover:text-gold-700 font-medium inline-flex items-center',
  carouselButton: 'w-10 h-10 rounded-full bg-primary-800 hover:bg-primary-700 flex items-center justify-center transition-colors',
  carouselDotActive: 'bg-gold-500',
  carouselDotInactive: 'bg-primary-700 hover:bg-primary-600',
} as const;

/**
 * Clases para componentes de autenticación
 * ✅ SSoT: Estilos de botones, badges y forms en AuthLogin y ProtectedRoute
 */
export const AUTH_CLASSES = {
  userBadge: 'hidden xs:flex items-center gap-1.5 px-2.5 sm:px-3 bg-primary-100 text-primary-800 rounded text-xs sm:text-sm h-9 sm:h-10',
  logoutButton: 'px-2.5 sm:px-3 md:px-4 bg-red-600 hover:bg-red-700 text-white rounded text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-1.5 h-9 sm:h-10 min-w-[36px]',
  loginButton: 'px-2.5 sm:px-3 md:px-4 bg-gold-600 hover:bg-gold-700 text-white rounded text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 sm:gap-1.5 h-9 sm:h-10',
  formInput: 'w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500',
  backButton: 'mt-6 px-6 py-3 bg-primary-800 text-white rounded-lg font-medium hover:bg-primary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
} as const;

/**
 * Tamaños de iconos responsivos
 * ✅ SSoT: Tamaños consistentes para iconos en breakpoints móviles
 */
export const RESPONSIVE_ICON_SIZES = {
  small: 14,  // Para sm:hidden (mobile)
  medium: 16, // Para hidden sm:block (desktop)
} as const;

/**
 * Clases para componentes de agenda/calendario
 * ✅ SSoT: Estilos reutilizables en CalendarioMes, CalendarioSemana, CalendarioDia, CalendarioLista
 */
export const AGENDA_CLASSES = {
  card: 'bg-white rounded-lg shadow-sm border border-gray-200',
  emptyState: 'flex flex-col items-center justify-center text-gray-400',
  editButton: 'p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors',
  deleteButton: 'p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors',
} as const;

/**
 * Clases para componentes administrativos
 * ✅ SSoT: Estilos de formularios, inputs y modales en componentes admin
 */
export const ADMIN_CLASSES = {
  formInput: 'w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
  formTextarea: 'w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all',
  restrictedInput: 'w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500',
  restrictedTextarea: 'w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 resize-none',
  restrictedSelect: 'w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500',
} as const;
