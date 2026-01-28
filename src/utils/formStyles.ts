/**
 * Sistema Centralizado de Estilos y Clases CSS
 * 
 * Single Source of Truth (SSoT) para clases CSS reutilizables.
 * Cambiar aquí afecta todo el sistema.
 * 
 * @module utils/formStyles
 */

import { cn } from './cn';

// ==================== CLASES DE FORMULARIOS ====================

export const getInputClasses = (hasError: boolean, isDisabled: boolean): string => {
  return cn(
    "w-full px-4 py-2 border rounded transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
    hasError ? 'border-red-300 bg-red-50' : 'border-neutral-300',
    isDisabled && 'opacity-50 cursor-not-allowed'
  );
};

export const getLabelClasses = (): string => {
  return "block text-sm font-medium text-neutral-700 mb-1";
};

export const getButtonClasses = (isSubmitting: boolean): string => {
  return cn(
    "w-full px-6 py-3 text-white rounded text-sm font-medium transition-all",
    "flex items-center justify-center",
    isSubmitting 
      ? 'bg-neutral-400 cursor-not-allowed' 
      : 'bg-primary-800 hover:bg-primary-900 active:transform active:scale-95'
  );
};

// ==================== LAYOUT Y CONTENEDORES ====================

/**
 * Container principal responsivo
 */
export const CONTAINER_CLASSES = {
  base: 'container mx-auto px-4',
  withPadding: 'container mx-auto px-4 md:px-6',
  centered: 'container mx-auto px-4 max-w-7xl',
  narrow: 'container mx-auto px-4 max-w-4xl'
} as const;

/**
 * Secciones de página
 */
export const SECTION_CLASSES = {
  base: 'py-12 md:py-16 lg:py-20',
  hero: 'py-16 md:py-24 lg:py-32',
  tight: 'py-8 md:py-12',
  withBackground: 'py-12 md:py-16 lg:py-20 bg-gray-50'
} as const;

// ==================== BOTONES ====================

/**
 * Estilos de botones por variante
 */
export const BUTTON_STYLES = {
  primary: 'px-3 xl:px-4 py-2 bg-primary-800 hover:bg-primary-900 text-white rounded text-sm font-medium transition-colors',
  secondary: 'px-3 xl:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-sm font-medium transition-colors',
  danger: 'px-3 xl:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors',
  ghost: 'px-3 xl:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm font-medium transition-colors',
  link: 'text-primary-800 hover:text-primary-900 underline text-sm font-medium transition-colors'
} as const;

/**
 * Tamaños de botones
 */
export const BUTTON_SIZES = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 xl:px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
} as const;

// ==================== TEXTOS Y TIPOGRAFÍA ====================

/**
 * Clases de texto comunes
 */
export const TEXT_CLASSES = {
  gold: 'text-gold-400',
  goldHover: 'hover:text-gold-400',
  primary: 'text-primary-800',
  primaryHover: 'hover:text-primary-800',
  muted: 'text-gray-600',
  error: 'text-red-600',
  success: 'text-green-600',
  warning: 'text-amber-600'
} as const;

/**
 * Títulos y headings
 */
export const HEADING_CLASSES = {
  h1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
  h2: 'text-3xl md:text-4xl lg:text-5xl font-bold',
  h3: 'text-2xl md:text-3xl lg:text-4xl font-bold',
  h4: 'text-xl md:text-2xl lg:text-3xl font-semibold',
  h5: 'text-lg md:text-xl lg:text-2xl font-semibold',
  h6: 'text-base md:text-lg lg:text-xl font-semibold'
} as const;

// ==================== CARDS Y CONTENEDORES ====================

/**
 * Estilos de cards
 */
export const CARD_CLASSES = {
  base: 'bg-white rounded-lg shadow-md p-6',
  hover: 'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow',
  bordered: 'bg-white rounded-lg border border-gray-200 p-6',
  flat: 'bg-white rounded-lg p-6'
} as const;

// ==================== ESTADOS Y BADGES ====================

/**
 * Badges de estado
 */
export const BADGE_CLASSES = {
  success: 'px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium',
  error: 'px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium',
  warning: 'px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-medium',
  info: 'px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium',
  neutral: 'px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium'
} as const;

// ==================== ANIMACIONES Y TRANSICIONES ====================

/**
 * Clases de transición comunes
 */
export const TRANSITION_CLASSES = {
  all: 'transition-all duration-200',
  colors: 'transition-colors duration-200',
  transform: 'transition-transform duration-200',
  opacity: 'transition-opacity duration-200',
  shadow: 'transition-shadow duration-200'
} as const;

/**
 * Efectos hover comunes
 */
export const HOVER_EFFECTS = {
  scale: 'hover:scale-105 transition-transform',
  lift: 'hover:-translate-y-1 transition-transform',
  glow: 'hover:shadow-lg transition-shadow',
  brightness: 'hover:brightness-110 transition-all'
} as const;

// ==================== HELPERS ====================

/**
 * Helper para construir clases de botón
 */
export const getButtonClassNames = (
  variant: keyof typeof BUTTON_STYLES = 'primary',
  size: keyof typeof BUTTON_SIZES = 'md',
  disabled: boolean = false
): string => {
  return cn(
    BUTTON_STYLES[variant],
    BUTTON_SIZES[size],
    disabled && 'opacity-50 cursor-not-allowed'
  );
};

/**
 * Helper para construir clases de container
 */
export const getContainerClassNames = (
  variant: keyof typeof CONTAINER_CLASSES = 'base'
): string => {
  return CONTAINER_CLASSES[variant];
};

/**
 * Helper para construir clases de card
 */
export const getCardClassNames = (
  variant: keyof typeof CARD_CLASSES = 'base'
): string => {
  return CARD_CLASSES[variant];
};
