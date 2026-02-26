/**
 * Validador específico de CEP
 * Complementa o FormValidator com validações específicas de CEP
 */

import { CEP_LENGTH, CEP_REGEX, CEP_MESSAGES } from '../constants/cep.constants'
import { cleanCEP } from './cepFormatter'

export interface CEPValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Valida CEP brasileiro
 * @param cep - CEP a validar
 * @returns Resultado da validação
 */
export const validateCEP = (cep: string): CEPValidationResult => {
  // CEP vazio
  if (!cep || cep.trim().length === 0) {
    return {
      isValid: false,
      error: CEP_MESSAGES.EMPTY
    }
  }

  // Verifica formato básico
  if (!CEP_REGEX.test(cep)) {
    return {
      isValid: false,
      error: CEP_MESSAGES.INVALID
    }
  }

  // Verifica tamanho (sem formatação)
  const cleaned = cleanCEP(cep)
  if (cleaned.length !== CEP_LENGTH) {
    return {
      isValid: false,
      error: CEP_MESSAGES.INVALID
    }
  }

  // Verifica se não é apenas zeros
  if (cleaned === '00000000') {
    return {
      isValid: false,
      error: 'CEP não pode ser 00000-000'
    }
  }

  // Validação passou
  return {
    isValid: true
  }
}

/**
 * Valida se CEP está pronto para busca
 * @param cep - CEP a validar
 * @returns true se pode buscar
 */
export const canSearchCEP = (cep: string): boolean => {
  const result = validateCEP(cep)
  return result.isValid
}
