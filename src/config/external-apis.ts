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
 * Supabase Configuration
 * URLs e configurações do backend Supabase
 */
export const SUPABASE_CONFIG = {
  /**
   * URLs base do Supabase
   */
  BASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  
  /**
   * Storage buckets
   */
  STORAGE: {
    DOCUMENTS: 'documents',
    AVATARS: 'avatars',
    ATTACHMENTS: 'attachments',
  },
  
  /**
   * Tabelas principais
   */
  TABLES: {
    USUARIOS: 'usuarios',
    CLIENTES: 'clientes', 
    AUDIENCIAS: 'audiencias',
    COMENTARIOS: 'comentarios_social',
  },
} as const

/**
 * APIs do Sistema Brasileiro
 * URLs para consulta de dados públicos brasileiros
 */
export const BRAZILIAN_APIS = {
  /**
   * ViaCEP - Consulta de CEP
   * Documentação: https://viacep.com.br/
   */
  VIA_CEP: {
    BASE_URL: 'https://viacep.com.br/ws',
    ENDPOINTS: {
      BY_CEP: (cep: string) => `/${cep}/json/`,
      BY_ADDRESS: (uf: string, cidade: string, logradouro: string) => 
        `/${uf}/${cidade}/${logradouro}/json/`,
    },
  },
  
  /**
   * Brasil API - Múltiplos serviços
   * Documentação: https://brasilapi.com.br/
   */
  BRASIL_API: {
    BASE_URL: 'https://brasilapi.com.br/api',
    ENDPOINTS: {
      CEP: (cep: string) => `/cep/v1/${cep}`,
      CNPJ: (cnpj: string) => `/cnpj/v1/${cnpj}`,
      CPF: (cpf: string) => `/cpf/v1/${cpf}`,
      DDD: (ddd: string) => `/ddd/v1/${ddd}`,
      BANKS: '/banks/v1',
      HOLIDAYS: (year: number) => `/feriados/v1/${year}`,
    },
  },
  
  /**
   * Receita Federal - CNPJ
   * Documentação: https://receitaws.com.br/
   */
  RECEITA_WS: {
    BASE_URL: 'https://www.receitaws.com.br/v1',
    ENDPOINTS: {
      CNPJ: (cnpj: string) => `/cnpj/${cnpj}`,
    },
  },
} as const

/**
 * URLs do Frontend
 * Rotas e páginas da aplicação
 */
export const APP_ROUTES = {
  /**
   * Rotas principais
   */
  HOME: '/',
  DASHBOARD: '/dashboard',
  
  /**
   * Rotas de autenticação
   */
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  
  /**
   * Rotas de clientes
   */
  CLIENTES: {
    LIST: '/clientes',
    CREATE: '/clientes/novo',
    VIEW: (id: string | number) => `/clientes/${id}`,
    EDIT: (id: string | number) => `/clientes/${id}/editar`,
  },
  
  /**
   * Rotas de audiências
   */
  AUDIENCIAS: {
    LIST: '/audiencias',
    CREATE: '/audiencias/nova',
    VIEW: (id: string | number) => `/audiencias/${id}`,
    EDIT: (id: string | number) => `/audiencias/${id}/editar`,
    CALENDAR: '/audiencias/calendario',
  },
  
  /**
   * Rotas de usuários e administração
   */
  ADMIN: {
    USERS: '/admin/usuarios',
    SETTINGS: '/admin/configuracoes',
    REPORTS: '/admin/relatorios',
  },
  
  /**
   * Rotas de perfil
   */
  PROFILE: {
    VIEW: '/perfil',
    EDIT: '/perfil/editar',
    SETTINGS: '/perfil/configuracoes',
  },
} as const

/**
 * URLs de Documentação e Links Externos
 */
export const EXTERNAL_LINKS = {
  /**
   * Documentação
   */
  DOCS: {
    USER_GUIDE: 'https://docs.advocacia-wilson.com.br/guia-usuario',
    API_DOCS: 'https://docs.advocacia-wilson.com.br/api',
    FAQ: 'https://docs.advocacia-wilson.com.br/faq',
  },
  
  /**
   * Suporte
   */
  SUPPORT: {
    EMAIL: 'suporte@advocacia-wilson.com.br',
    WHATSAPP: 'https://wa.me/5511999999999',
    CONTACT_FORM: 'https://advocacia-wilson.com.br/contato',
  },
  
  /**
   * Redes sociais
   */
  SOCIAL: {
    LINKEDIN: 'https://linkedin.com/company/advocacia-wilson',
    INSTAGRAM: 'https://instagram.com/advocacia.wilson',
    FACEBOOK: 'https://facebook.com/advocacia.wilson',
  },
  
  /**
   * Sites jurídicos úteis
   */
  LEGAL_SITES: {
    TJSP: 'https://esaj.tjsp.jus.br/',
    CNJ: 'https://www.cnj.jus.br/',
    OAB: 'https://www.oab.org.br/',
    PLANALTO: 'https://www.planalto.gov.br/ccivil_03/leis/',
  },
} as const

/**
 * Configurações de APIs de terceiros
 */
export const THIRD_PARTY_APIS = {
  /**
   * Google Services
   */
  GOOGLE: {
    MAPS: {
      BASE_URL: 'https://maps.googleapis.com/maps/api',
      GEOCODING: '/geocode/json',
      PLACES: '/place',
    },
    ANALYTICS: {
      MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
    },
  },
  
  /**
   * SendGrid (Email)
   */
  SENDGRID: {
    BASE_URL: 'https://api.sendgrid.com/v3',
    API_KEY: import.meta.env.VITE_SENDGRID_API_KEY || '',
  },
  
  /**
   * WhatsApp Business API
   */
  WHATSAPP: {
    BASE_URL: 'https://graph.facebook.com/v18.0',
    PHONE_NUMBER_ID: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '',
    ACCESS_TOKEN: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || '',
  },
} as const

/**
 * Timeout configurations
 */
export const API_TIMEOUTS = {
  DEFAULT: 10000,      // 10 segundos
  UPLOAD: 30000,       // 30 segundos  
  LONG_POLLING: 60000, // 60 segundos
} as const

/**
 * Retry configurations
 */
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,      // 1 segundo
  BACKOFF_FACTOR: 2,      // Exponential backoff
} as const

/**
 * Configuração consolidada de todas as APIs
 */
export const EXTERNAL_APIS = {
  GOOGLE_CALENDAR: GOOGLE_CALENDAR_API,
  SUPABASE: SUPABASE_CONFIG,
  BRAZILIAN: BRAZILIAN_APIS,
  THIRD_PARTY: THIRD_PARTY_APIS,
  TIMEOUTS: API_TIMEOUTS,
  RETRY: RETRY_CONFIG,
} as const

/**
 * Todas as URLs da aplicação
 */
export const ALL_URLS = {
  ROUTES: APP_ROUTES,
  EXTERNAL: EXTERNAL_LINKS,
  APIS: EXTERNAL_APIS,
} as const

// Type helpers for better TypeScript support
export type AppRoute = typeof APP_ROUTES
export type ExternalLink = typeof EXTERNAL_LINKS
export type ApiConfig = typeof EXTERNAL_APIS
