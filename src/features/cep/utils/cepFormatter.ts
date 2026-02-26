/**
 * Utilidades para formatação de CEP
 */

import { CEP_LENGTH, CEP_REGEX } from '../constants/cep.constants'

/**
 * Formata CEP para o padrão 12345-678
 * @param cep - CEP sem formatação ou com formatação
 * @returns CEP formatado (12345-678)
 */
export const formatCEP = (cep: string): string => {
  const cleaned = cleanCEP(cep)
  
  if (cleaned.length !== CEP_LENGTH) {
    return cep // Retorna original se não tiver 8 dígitos
  }
  
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
}

/**
 * Remove toda formatação do CEP (deixa apenas números)
 * @param cep - CEP com ou sem formatação
 * @returns CEP apenas com números
 */
export const cleanCEP = (cep: string): string => {
  return cep.replace(/\D/g, '')
}

/**
 * Verifica se o CEP tem formato válido (com ou sem hífen)
 * @param cep - CEP a validar
 * @returns true se formato válido
 */
export const isValidCEPFormat = (cep: string): boolean => {
  if (!cep) return false
  return CEP_REGEX.test(cep)
}

/**
 * Formata CEP enquanto usuário digita (auto-formatação)
 * @param value - Valor atual do input
 * @returns Valor formatado progressivamente
 */
export const formatCEPOnType = (value: string): string => {
  const cleaned = cleanCEP(value)
  
  if (cleaned.length <= 5) {
    return cleaned
  }
  
  // Permite todos os dígitos após o hífen (sem limite de 8)
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
}

/**
 * Valida se CEP está completo (8 dígitos)
 * @param cep - CEP a validar
 * @returns true se completo
 */
export const isCEPComplete = (cep: string): boolean => {
  const cleaned = cleanCEP(cep)
  return cleaned.length === CEP_LENGTH
}
