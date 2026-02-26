/**
 * Configuração do módulo CEP
 * Centralize todas as configurações aqui para facilitar manutenção
 */

export const CEP_CONFIG = {
  // Configuração da API ViaCEP
  api: {
    baseURL: 'https://viacep.com.br/ws',
    timeout: 5000,      // 5 segundos
    retries: 2,         // Tentar 2 vezes antes de falhar
    retryDelay: 1000,   // 1 segundo entre tentativas
  },

  // Configuração de cache
  cache: {
    enabled: true,
    timeout: 3600000,   // 1 hora (em ms)
    storage: 'memory' as 'memory' | 'localStorage',
    maxItems: 50,       // Máximo de CEPs no cache
  },

  // Configuração de debounce
  debounce: {
    enabled: true,
    delay: 500,         // 500ms de delay
  },

  // Configuração de validação
  validation: {
    minLength: 8,
    maxLength: 9,       // Com hífen
    allowedChars: /^[0-9-]+$/,
  },
} as const

// Exportar valores individuais se necessário
export const VIACEP_BASE_URL = CEP_CONFIG.api.baseURL
export const VIACEP_TIMEOUT = CEP_CONFIG.api.timeout
export const CACHE_ENABLED = CEP_CONFIG.cache.enabled
export const CACHE_TIMEOUT = CEP_CONFIG.cache.timeout
export const DEBOUNCE_DELAY = CEP_CONFIG.debounce.delay
