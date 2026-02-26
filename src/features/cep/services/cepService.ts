/**
 * Servicio para consultar CEP usando API ViaCEP
 * https://viacep.com.br/
 */

import { CEPData, CEPResponse, CEPError } from '../types/cep.types'
import { CEP_CONFIG } from '../config/cep.config'
import { CEP_MESSAGES, CEP_ERROR_CODES } from '../constants/cep.constants'
import { cleanCEP } from '../utils/cepFormatter'
import { validateCEP } from '../utils/cepValidator'

/**
 * Busca endereço por CEP na API ViaCEP
 * @param cep - CEP a buscar (com ou sem formatação)
 * @returns Promise com resposta normalizada
 */
export const fetchCEP = async (cep: string): Promise<CEPResponse> => {
  // Validar CEP antes de fazer requisição
  const validation = validateCEP(cep)
  if (!validation.isValid) {
    return {
      success: false,
      error: {
        code: 'INVALID_CEP',
        message: validation.error || CEP_MESSAGES.INVALID
      }
    }
  }

  // Limpar CEP (remover hífen)
  const cleanedCEP = cleanCEP(cep)

  // Fazer requisição com timeout e retries
  return fetchWithRetry(cleanedCEP, CEP_CONFIG.api.retries)
}

/**
 * Faz requisição com retry automático
 * @param cep - CEP limpo (apenas números)
 * @param retriesLeft - Tentativas restantes
 * @returns Promise com resposta
 */
const fetchWithRetry = async (
  cep: string,
  retriesLeft: number
): Promise<CEPResponse> => {
  try {
    const response = await fetchWithTimeout(cep, CEP_CONFIG.api.timeout)
    return response
  } catch (error) {
    // Se ainda tem retries, tenta novamente
    if (retriesLeft > 0) {
      await delay(CEP_CONFIG.api.retryDelay)
      return fetchWithRetry(cep, retriesLeft - 1)
    }
    
    // Sem mais retries, retorna erro
    return {
      success: false,
      error: error as CEPError
    }
  }
}

/**
 * Faz requisição com timeout
 * @param cep - CEP limpo
 * @param timeout - Timeout em ms
 * @returns Promise com resposta
 */
const fetchWithTimeout = async (
  cep: string,
  timeout: number
): Promise<CEPResponse> => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const url = `${CEP_CONFIG.api.baseURL}/${cep}/json/`
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    })

    clearTimeout(timeoutId)

    // Verifica se resposta é OK
    if (!response.ok) {
      throw {
        code: 'NETWORK_ERROR',
        message: CEP_MESSAGES.NETWORK_ERROR
      } as CEPError
    }

    // Parse JSON
    const data: CEPData = await response.json()

    // ViaCEP retorna { erro: true } quando CEP não existe
    if (data.erro) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: CEP_MESSAGES.NOT_FOUND
        }
      }
    }

    // Sucesso!
    return {
      success: true,
      data
    }

  } catch (error: unknown) {
    clearTimeout(timeoutId)

    // Erro de timeout (AbortError)
    if (error instanceof Error && error.name === 'AbortError') {
      throw {
        code: 'TIMEOUT',
        message: CEP_MESSAGES.TIMEOUT
      } as CEPError
    }

    // Já é um CEPError
    if (typeof error === 'object' && error !== null && 'code' in error) {
      throw error
    }

    // Erro de rede genérico
    throw {
      code: 'NETWORK_ERROR',
      message: CEP_MESSAGES.NETWORK_ERROR
    } as CEPError
  }
}

/**
 * Utilitário para delay (sleep)
 * @param ms - Milisegundos para aguardar
 */
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Verifica se API está disponível (health check)
 * @returns true se API responde
 */
export const isViaCEPAvailable = async (): Promise<boolean> => {
  try {
    // Testa com um CEP conhecido (Av. Paulista, São Paulo)
    const response = await fetchCEP('01310-100')
    return response.success
  } catch {
    return false
  }
}
