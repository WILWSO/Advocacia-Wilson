/**
 * Configuración Centralizada de APIs Externas (SSoT)
 * 
 * Define URLs, endpoints y configuraciones para servicios de terceros.
 * Cambiar una URL aquí actualizará todas las referencias en el sistema.
 * 
 * @module config/external-apis
 */

/**
 * Google Calendar API
 * Documentación: https://developers.google.com/calendar/api/v3/reference
 */
export const GOOGLE_CALENDAR_API = {
  /**
   * Base URL de la API de Google Calendar v3
   */
  BASE_URL: 'https://www.googleapis.com/calendar/v3',
  
  /**
   * URLs de OAuth 2.0
   */
  OAUTH: {
    AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
    TOKEN_URL: 'https://oauth2.googleapis.com/token',
    REVOKE_URL: 'https://oauth2.googleapis.com/revoke',
  },
  
  /**
   * Scopes de permisos
   */
  SCOPES: {
    CALENDAR_EVENTS: 'https://www.googleapis.com/auth/calendar.events',
    CALENDAR_READONLY: 'https://www.googleapis.com/auth/calendar.readonly',
    CALENDAR_FULL: 'https://www.googleapis.com/auth/calendar',
  },
  
  /**
   * Endpoints principales
   */
  ENDPOINTS: {
    EVENTS: '/calendars/primary/events',
    EVENT_BY_ID: (eventId: string) => `/calendars/primary/events/${eventId}`,
  },
} as const;

/**
 * Otras APIs externas (para uso futuro)
 */
export const EXTERNAL_APIS = {
  GOOGLE_CALENDAR: GOOGLE_CALENDAR_API,
  // Agregar más APIs aquí según necesidad
} as const;
