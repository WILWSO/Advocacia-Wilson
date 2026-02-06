import React from 'react';
import { ButtonCategory, getCategoryConfig } from './buttonCategories';
import { BUTTON_VARIANTS, BUTTON_SIZES } from '../../../config/theme';

/**
 * Interface que define las propiedades del componente AccessibleButton
 * Extiende las propiedades nativas del elemento HTML button
 */
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  
  /**
   * Categoría del botón (recomendado)
   * Usa la configuración centralizada de buttonCategories.ts
   * Si se especifica, toma precedencia sobre variant
   */
  category?: ButtonCategory;
  
  /**
   * Variante del botón (personalización individual)
   * Si se especifica junto con category, este tiene prioridad
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'warning' | 'neutral';
  
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Componente de botón accesible con soporte completo de ARIA
 * Incluye estados de carga, variantes de estilo, iconos, y optimizaciones de accesibilidad
 * 
 * NUEVO: Sistema de categorías configurables
 * Usa la prop `category` para aplicar configuración centralizada
 * O usa `variant` para personalización individual
 */
const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  category,
  variant,
  size = 'md',
  isLoading = false, 
  loadingText = 'Carregando...',
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  /**
   * Determina la variante a usar:
   * 1. Si se pasa variant explícita, usa esa (personalización individual)
   * 2. Si se pasa category, usa la variante de la configuración
   * 3. Fallback a 'primary'
   */
  const categoryConfig = category ? getCategoryConfig(category) : null;
  const effectiveVariant = variant || categoryConfig?.variant || 'primary';
  
  /**
   * Determina si usar colores personalizados de la categoría
   * Si la categoría tiene colors definidos y NO se pasó variant explícita,
   * usa los colores personalizados en lugar de la variante
   */
  const useCustomColors = categoryConfig?.colors && !variant;
  
  /**
   * Determina el icono a usar:
   * 1. Si se pasa leftIcon explícito, usa ese
   * 2. Si se pasa category y NO hay leftIcon, usa el icono de la categoría
   */
  const CategoryIcon = categoryConfig?.icon;
  const effectiveLeftIcon = leftIcon || (CategoryIcon && !rightIcon ? <CategoryIcon size={18} /> : null);
  /**
   * Clases base del botón: layout flex, transiciones, estados de focus y disabled
   * Incluye animación de escala al hacer clic (active:scale-95)
   */
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:pointer-events-none
    active:scale-95
  `;

  /**
   * ✅ SSoT: Variantes importadas desde config/theme.ts
   */
  const variantClasses = BUTTON_VARIANTS;

  /**
   * ✅ SSoT: Tamaños importados desde config/theme.ts
   */
  const sizeClasses = BUTTON_SIZES;

  /**
   * Determina si el botón debe estar deshabilitado
   * Se deshabilita si está explícitamente disabled O si está en estado de carga
   */
  const isDisabled = disabled || isLoading;
  
  /**
   * Construye las clases de color:
   * 1. Si hay colores personalizados de categoría, usa esos
   * 2. Si no, usa las clases de variante predefinidas
   */
  const colorClasses = useCustomColors && categoryConfig.colors
    ? `${categoryConfig.colors.base} ${categoryConfig.colors.hover} ${categoryConfig.colors.text} ${categoryConfig.colors.focus}`
    : variantClasses[effectiveVariant];
  
  /**
   * Determina el texto a mostrar en el botón
   * Si está cargando, muestra el texto de carga; caso contrario, muestra el children
   */
  const buttonText = isLoading ? loadingText : children;

  return (
    <button
      className={`${baseClasses} ${colorClasses} ${sizeClasses[size]} ${className}`}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-describedby={isLoading ? 'loading-state' : undefined}
      {...props}
    >
      {/* Spinner de carga animado - solo visible cuando isLoading es true */}
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Carregando"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {/* Icono izquierdo - usa effectiveLeftIcon que incluye lógica de categoría */}
      {effectiveLeftIcon && !isLoading && (
        <span className="mr-2" aria-hidden="true">
          {effectiveLeftIcon}
        </span>
      )}
      
      {/* Texto principal del botón */}
      <span>{buttonText}</span>
      
      {/* Icono derecho - se muestra solo si rightIcon existe y NO está cargando */}
      {rightIcon && !isLoading && (
        <span className="ml-2" aria-hidden="true">
          {rightIcon}
        </span>
      )}
      
      {/* Texto accesible para lectores de pantalla durante el estado de carga */}
      {isLoading && (
        <span id="loading-state" className="sr-only">
          Processando sua solicitação, por favor aguarde.
        </span>
      )}
    </button>
  );
};

export default AccessibleButton;