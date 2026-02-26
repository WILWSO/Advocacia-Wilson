/**
 * Constantes del módulo CEP
 */

// Regex para validar formato de CEP
export const CEP_REGEX = /^\d{5}-?\d{3}$/

// Tamanho esperado do CEP (sem formatação)
export const CEP_LENGTH = 8

// Mensagens de feedback
export const CEP_MESSAGES = {
  LOADING: 'Buscando CEP...',
  SUCCESS: 'Endereço encontrado!',
  NOT_FOUND: 'CEP não encontrado',
  INVALID: 'CEP inválido. Use o formato: 12345-678',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  TIMEOUT: 'Tempo esgotado. Tente novamente.',
  EMPTY: 'Digite um CEP para buscar',
} as const

// Códigos de erro
export const CEP_ERROR_CODES = {
  INVALID_CEP: 'INVALID_CEP',
  NOT_FOUND: 'NOT_FOUND',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
} as const

// Estados visuais do input
export const CEP_INPUT_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const
