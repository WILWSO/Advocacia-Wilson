/**
 * Hook para buscar CEP com cache, debounce e controle de estado
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { fetchCEP } from '../services/cepService'
import {
  CEPData,
  CEPError,
  CEPLookupState,
  UseCEPLookupOptions
} from '../types/cep.types'
import { CEP_CONFIG } from '../config/cep.config'
import { cleanCEP } from '../utils/cepFormatter'
import { canSearchCEP } from '../utils/cepValidator'

// Cache em memória (Map)
const cepCache = new Map<string, { data: CEPData; timestamp: number }>()

/**
 * Hook principal para busca de CEP
 * @param options - Opções de configuração
 * @returns Estado e funções para buscar CEP
 */
export const useCEPLookup = (options?: UseCEPLookupOptions) => {
  const {
    enableCache = CEP_CONFIG.cache.enabled,
    cacheTimeout = CEP_CONFIG.cache.timeout,
    autoSearch = false,
    debounceMs = CEP_CONFIG.debounce.delay,
    onSuccess,
    onError
  } = options || {}

  // Estado
  const [state, setState] = useState<CEPLookupState>({
    loading: false,
    error: null,
    data: null
  })

  // Refs para cleanup e debounce
  const debounceTimer = useRef<NodeJS.Timeout>()
  const abortController = useRef<AbortController>()

  /**
   * Limpa cache expirado
   */
  const cleanExpiredCache = useCallback(() => {
    if (!enableCache) return

    const now = Date.now()
    const keysToDelete: string[] = []

    cepCache.forEach((value, key) => {
      if (now - value.timestamp > cacheTimeout) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => cepCache.delete(key))

    // Limitar tamanho do cache
    if (cepCache.size > CEP_CONFIG.cache.maxItems) {
      const firstKey = cepCache.keys().next().value
      if (firstKey) cepCache.delete(firstKey)
    }
  }, [enableCache, cacheTimeout])

  /**
   * Busca CEP no cache
   */
  const getFromCache = useCallback((cep: string): CEPData | null => {
    if (!enableCache) return null

    cleanExpiredCache()

    const cached = cepCache.get(cep)
    if (!cached) return null

    const isExpired = Date.now() - cached.timestamp > cacheTimeout
    if (isExpired) {
      cepCache.delete(cep)
      return null
    }

    return cached.data
  }, [enableCache, cacheTimeout, cleanExpiredCache])

  /**
   * Salva CEP no cache
   */
  const saveToCache = useCallback((cep: string, data: CEPData) => {
    if (!enableCache) return

    cepCache.set(cep, {
      data,
      timestamp: Date.now()
    })
  }, [enableCache])

  /**
   * Busca CEP (função principal)
   */
  const searchCEP = useCallback(async (cep: string) => {
    // Validar antes de buscar
    if (!canSearchCEP(cep)) {
      setState({
        loading: false,
        error: {
          code: 'INVALID_CEP',
          message: 'CEP inválido'
        },
        data: null
      })
      return {
        success: false,
        error: { code: 'INVALID_CEP' as const, message: 'CEP inválido' }
      }
    }

    const cleanedCEP = cleanCEP(cep)

    // Verificar cache primeiro
    const cachedData = getFromCache(cleanedCEP)
    if (cachedData) {
      setState({
        loading: false,
        error: null,
        data: cachedData
      })
      onSuccess?.(cachedData)
      return {
        success: true,
        data: cachedData
      }
    }

    // Cancelar requisição anterior se existir
    if (abortController.current) {
      abortController.current.abort()
    }
    abortController.current = new AbortController()

    // Iniciar loading
    setState({
      loading: true,
      error: null,
      data: null
    })

    try {
      // Fazer requisição
      const response = await fetchCEP(cleanedCEP)

      if (response.success && response.data) {
        // Salvar no cache
        saveToCache(cleanedCEP, response.data)

        // Atualizar estado
        setState({
          loading: false,
          error: null,
          data: response.data
        })

        // Callback de sucesso
        onSuccess?.(response.data)

        return response
      } else {
        // Erro da API
        const error = response.error || {
          code: 'NETWORK_ERROR' as const,
          message: 'Erro desconhecido'
        }

        setState({
          loading: false,
          error,
          data: null
        })

        // Callback de erro
        onError?.(error)

        return response
      }
    } catch (error) {
      const cepError: CEPError = {
        code: 'NETWORK_ERROR',
        message: 'Erro ao buscar CEP'
      }

      setState({
        loading: false,
        error: cepError,
        data: null
      })

      onError?.(cepError)

      return {
        success: false,
        error: cepError
      }
    }
  }, [getFromCache, saveToCache, onSuccess, onError])

  /**
   * Busca CEP com debounce (para auto-search)
   */
  const searchCEPDebounced = useCallback((cep: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      searchCEP(cep)
    }, debounceMs)
  }, [searchCEP, debounceMs])

  /**
   * Limpa estado
   */
  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      data: null
    })
  }, [])

  /**
   * Limpa cache inteiro
   */
  const clearCache = useCallback(() => {
    cepCache.clear()
  }, [])

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
      if (abortController.current) {
        abortController.current.abort()
      }
    }
  }, [])

  return {
    // Estado
    loading: state.loading,
    error: state.error,
    data: state.data,

    // Funções
    searchCEP,
    searchCEPDebounced,
    reset,
    clearCache,

    // Utilitários
    hasData: !!state.data,
    hasError: !!state.error,
    isIdle: !state.loading && !state.error && !state.data,
  }
}
