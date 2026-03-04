/**
 * Maintenance Mode Configuration
 * 
 * Centralized configuration for maintenance mode feature
 * @module features/maintenance/config
 */

/**
 * Main configuration object for maintenance mode
 */
export const MAINTENANCE_CONFIG = {
  /**
   * Environment variable keys
   */
  ENV_KEYS: {
    /** Key for maintenance mode activation flag */
    MAINTENANCE_MODE: 'VITE_MAINTENANCE_MODE',
    /** Key for comma-separated list of dev emails */
    DEV_EMAILS: 'VITE_MAINTENANCE_DEV_EMAILS',
  },

  /**
   * Default messages for maintenance screen
   * Can be overridden via component props
   */
  MESSAGES: {
    /** Main title displayed on maintenance screen */
    TITLE: 'Sistema en Mantenimiento',
    /** Main message explaining the situation */
    MESSAGE: 'Estamos trabajando para mejorar tu experiencia. Volveremos pronto con nuevas funcionalidades.',
    /** Estimated time for maintenance completion */
    ESTIMATED_TIME: '15-30 minutos',
    /** Contact email for urgent matters */
    CONTACT_EMAIL: 'soporte@wilsonalbuquerque.adv.br',
    /** Loading message while checking status */
    LOADING: 'Verificando estado del sistema...',
  },

  /**
   * UI configuration
   */
  UI: {
    /** Icon size in pixels */
    ICON_SIZE: 80,
    /** Animation duration for spinning icon */
    ANIMATION_DURATION: '3s',
    /** Show contact information section */
    SHOW_CONTACT: true,
    /** Show estimated time section */
    SHOW_ESTIMATED_TIME: true,
    /** Show animated icon */
    SHOW_ICON: true,
  },

  /**
   * Dev badge configuration (for developers during maintenance)
   */
  DEV_BADGE: {
    /** Whether to show badge for developers */
    ENABLED: true,
    /** Text displayed in badge */
    TEXT: 'Modo Desarrollador',
    /** Badge position on screen */
    POSITION: 'top-center' as const,
    /** Show pulse animation on badge */
    ANIMATED: true,
  },

  /**
   * Performance settings
   */
  PERFORMANCE: {
    /** Debounce time for auth check (ms) */
    AUTH_CHECK_DEBOUNCE: 100,
    /** Loading state minimum duration (ms) */
    MIN_LOADING_DURATION: 50,
  },
} as const;

/**
 * Type helper for maintenance configuration
 */
export type MaintenanceConfig = typeof MAINTENANCE_CONFIG;

/**
 * Get environment variable value safely
 */
export function getEnvValue(key: keyof typeof MAINTENANCE_CONFIG.ENV_KEYS): string {
  const envKey = MAINTENANCE_CONFIG.ENV_KEYS[key];
  return import.meta.env[envKey] || '';
}

/**
 * Check if maintenance mode is enabled via environment
 */
export function isMaintenanceEnabled(): boolean {
  return getEnvValue('MAINTENANCE_MODE').toLowerCase() === 'true';
}
