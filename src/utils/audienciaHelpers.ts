/**
 * Utilidades Centralizadas para Audiencias (SSoT)
 * 
 * Single Source of Truth para lógica relacionada con audiencias:
 * - Mapeo de forma de audiencia a colores
 * - Mapeo de forma de audiencia a iconos
 * - Clases de badge según forma
 * 
 * @module utils/audienciaHelpers
 */

import { AUDIENCIA_COLORS } from '../config/theme';
import { getIcon } from '../config/icons';

/**
 * Obtiene el color del tema AUDIENCIA_COLORS según la forma de audiencia
 * 
 * @param forma - Tipo de forma: 'presencial', 'virtual', 'hibrida'
 * @returns Clase de color del tema AUDIENCIA_COLORS
 * 
 * @example
 * getFormaColor('presencial') // AUDIENCIA_COLORS.inicial (clases azules)
 * getFormaColor('virtual') // AUDIENCIA_COLORS.instrucao (clases verdes)
 */
export const getFormaColor = (forma: string) => {
  const formaMap: Record<string, keyof typeof AUDIENCIA_COLORS> = {
    'presencial': 'inicial',
    'virtual': 'instrucao',
    'hibrida': 'julgamento',
  };
  return AUDIENCIA_COLORS[formaMap[forma] || 'default'];
};

/**
 * Obtiene el icono apropiado según la forma de audiencia
 * 
 * @param forma - Tipo de forma: 'presencial', 'virtual', 'hibrida'
 * @param size - Tamaño del icono en píxeles (default: 20)
 * @returns Elemento React del icono con color aplicado
 * 
 * @example
 * getFormaIcon('presencial', 24) // Icono userRound azul de 24px
 * getFormaIcon('virtual') // Icono video verde de 20px (default)
 */
export const getFormaIcon = (forma: string, size: number = 20) => {
  const colorMap: Record<string, string> = {
    'presencial': 'text-blue-600',
    'virtual': 'text-green-600',
    'hibrida': 'text-purple-600',
  };
  
  const iconMap: Record<string, 'userRound' | 'video' | 'user' | 'calendar'> = {
    'presencial': 'userRound',
    'virtual': 'video',
    'hibrida': 'user',
  };
  
  const iconKey = iconMap[forma] || 'calendar';
  const color = colorMap[forma] || 'text-gray-600';
  
  return getIcon(iconKey, size, color);
};

/**
 * Obtiene las clases CSS para badge según la forma de audiencia
 * 
 * @param forma - Tipo de forma: 'presencial', 'virtual', 'hibrida'
 * @returns String con clases Tailwind para background y texto
 * 
 * @example
 * getFormaBadgeClasses('presencial') // 'bg-blue-100 text-blue-800'
 * getFormaBadgeClasses('virtual') // 'bg-green-100 text-green-800'
 */
export const getFormaBadgeClasses = (forma: string): string => {
  const classMap = {
    'presencial': 'bg-blue-100 text-blue-800',
    'virtual': 'bg-green-100 text-green-800',
    'hibrida': 'bg-purple-100 text-purple-800',
  };
  return classMap[forma as keyof typeof classMap] || 'bg-gray-100 text-gray-800';
};

/**
 * Obtiene las clases CSS para border según la forma de audiencia
 * 
 * @param forma - Tipo de forma: 'presencial', 'virtual', 'hibrida'
 * @returns String con clase Tailwind para border-color
 * 
 * @example
 * getFormaBorderClass('presencial') // 'border-blue-500'
 * getFormaBorderClass('virtual') // 'border-green-500'
 */
export const getFormaBorderClass = (forma: string): string => {
  const classMap = {
    'presencial': 'border-blue-500',
    'virtual': 'border-green-500',
    'hibrida': 'border-purple-500',
  };
  return classMap[forma as keyof typeof classMap] || 'border-gray-500';
};
