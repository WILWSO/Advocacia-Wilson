/**
 * Hook centralizado para operações assíncronas (SSoT para loading/error states)
 * 
 * Elimina duplicação de estados loading, error e success em todos os hooks de formulário.
 * Integra automaticamente com sistema de notificações para UX consistente.
 * 
 * @example
 * const { execute, loading, error, success, reset } = useAsyncOperation({
 *   onSuccess: (result) => console.log('Operação concluída:', result),
 *   onError: (error) => console.error('Erro:', error),
 *   successMessage: 'Operação realizada com sucesso!',
 *   showNotifications: true
 * })
 * 
 * // Usar em qualquer operação async
 * const handleSave = () => execute(() => saveData(formData))
 */

import { useState, useCallback } from 'react'
import { useNotification } from '../../components/shared/notifications/useNotification'

interface UseAsyncOperationOptions<T = unknown> {
  onSuccess?: (result: T) => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
  successMessage?: string
  errorMessage?: string
  showNotifications?: boolean
  autoReset?: boolean // Reset success/error após X tempo
  resetDelay?: number // Delay em ms para auto reset (default: 3000)
}

interface UseAsyncOperationReturn<T = unknown> {
  loading: boolean
  error: string | null
  success: boolean
  lastResult: T | null
  execute: <R = T>(operation: () => Promise<R>) => Promise<R | null>
  reset: () => void
  setError: (error: string) => void
  setSuccess: (success: boolean) => void
}

export function useAsyncOperation<T = unknown>(
  options: UseAsyncOperationOptions<T> = {}
): UseAsyncOperationReturn<T> {
  const {
    onSuccess,
    onError,
    successMessage,
    errorMessage,
    showNotifications = true,
    autoReset = false,
    resetDelay = 3000
  } = options

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [lastResult, setLastResult] = useState<T | null>(null)

  // Hook de notificações
  const { showNotification } = useNotification()

  const reset = useCallback(() => {
    setError(null)
    setSuccess(false)
    setLastResult(null)
  }, [])

  const execute = useCallback(async <R = T>(
    operation: () => Promise<R>
  ): Promise<R | null> => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      const result = await operation()
      
      setSuccess(true)
      setLastResult(result as unknown as T)

      // Callback de sucesso
      if (onSuccess) {
        await onSuccess(result as unknown as T)
      }

      // Notificação de sucesso
      if (showNotifications && showNotification && successMessage) {
        showNotification('success', successMessage)
      }

      // Auto reset
      if (autoReset) {
        setTimeout(() => {
          setSuccess(false)
        }, resetDelay)
      }

      return result

    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      
      setError(errorMsg)
      setSuccess(false)

      // Callback de erro
      if (onError) {
        await onError(error instanceof Error ? error : new Error(errorMsg))
      }

      // Notificação de erro
      if (showNotifications && showNotification) {
        const finalErrorMessage = errorMessage || errorMsg || 'Erro ao realizar operação'
        showNotification('error', finalErrorMessage)
      }

      return null

    } finally {
      setLoading(false)
    }
  }, [onSuccess, onError, successMessage, errorMessage, showNotifications, showNotification, autoReset, resetDelay])

  const setErrorState = useCallback((errorMsg: string) => {
    setError(errorMsg)
    setSuccess(false)
  }, [])

  const setSuccessState = useCallback((successState: boolean) => {
    setSuccess(successState)
    if (successState) {
      setError(null)
    }
  }, [])

  return {
    loading,
    error,
    success,
    lastResult,
    execute,
    reset,
    setError: setErrorState,
    setSuccess: setSuccessState
  }
}

// Hook especializado para operações com upload (usuários com foto)
export function useAsyncUpload<T = unknown>(options: UseAsyncOperationOptions<T> = {}) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  
  const asyncOp = useAsyncOperation(options)

  const executeUpload = useCallback(async <R = T>(
    operation: (progressCallback: (progress: number) => void) => Promise<R>
  ): Promise<R | null> => {
    setUploading(true)
    setUploadProgress(0)

    const progressCallback = (progress: number) => {
      setUploadProgress(Math.min(Math.max(progress, 0), 100))
    }

    try {
      const result = await asyncOp.execute(() => operation(progressCallback))
      return result
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [asyncOp])

  return {
    ...asyncOp,
    uploading,
    uploadProgress,
    executeUpload,
    loading: asyncOp.loading || uploading
  }
}