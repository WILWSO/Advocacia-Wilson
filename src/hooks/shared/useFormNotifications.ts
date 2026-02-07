/**
 * Hook centralizado para notificações de formulários (SSoT para notifications)
 * 
 * Unifica gestão de notificações inline e toast para eliminar duplicação.
 * Integra automaticamente com InlineNotification component e useNotification hook.
 * 
 * @example
 * const notifications = useFormNotifications()
 * 
 * // Mostrar notificação inline
 * notifications.showInline('success', 'Dados salvos!')
 * 
 * // Mostrar toast global
 * notifications.showToast('error', 'Erro ao salvar')
 * 
 * // Usar no JSX
 * {notifications.inline.show && (
 *   <InlineNotification 
 *     type={notifications.inline.type}
 *     message={notifications.inline.message}
 *     onClose={notifications.hideInline}
 *   />
 * )}
 */

import { useState, useCallback, useEffect } from 'react'
import { useNotification } from '../../components/shared/notifications/useNotification'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface InlineNotificationState {
  show: boolean
  type: NotificationType
  message: string
}

interface UseFormNotificationsOptions {
  autoHideSuccess?: boolean // Auto-hide success notifications
  autoHideDelay?: number    // Delay para auto-hide (default: 5000ms)
  persistErrors?: boolean   // Erros não fazem auto-hide (default: true)
  enableToast?: boolean     // Abilita notificações toast (default: true)
  enableInline?: boolean    // Abilita notificações inline (default: true)
}

interface UseFormNotificationsReturn {
  // Estado inline
  inline: InlineNotificationState
  
  // Controles inline
  showInline: (type: NotificationType, message: string) => void
  hideInline: () => void
  
  // Controles toast (delegados para useNotification)
  showToast: (type: NotificationType, message: string) => void
  
  // Helpers combinados (inline + toast)
  success: (message: string, options?: { toastOnly?: boolean; inlineOnly?: boolean }) => void
  error: (message: string, options?: { toastOnly?: boolean; inlineOnly?: boolean }) => void
  warning: (message: string, options?: { toastOnly?: boolean; inlineOnly?: boolean }) => void
  info: (message: string, options?: { toastOnly?: boolean; inlineOnly?: boolean }) => void
  
  // Reset geral
  clear: () => void
  
  // Estados computed
  hasInlineNotification: boolean
}

const INITIAL_INLINE_STATE: InlineNotificationState = {
  show: false,
  type: 'info',
  message: ''
}

export function useFormNotifications(
  options: UseFormNotificationsOptions = {}
): UseFormNotificationsReturn {
  const {
    autoHideSuccess = true,
    autoHideDelay = 5000,
    persistErrors = true,
    enableToast = true,
    enableInline = true
  } = options

  const [inline, setInline] = useState<InlineNotificationState>(INITIAL_INLINE_STATE)
  
  // Hook de notificações toast (global)
  const { showNotification } = useNotification()

  // Auto-hide logic para notificações inline
  useEffect(() => {
    if (!inline.show) return

    const shouldAutoHide = autoHideSuccess && 
      (inline.type === 'success' || inline.type === 'info' || 
       (inline.type === 'warning' && !persistErrors))

    if (shouldAutoHide) {
      const timer = setTimeout(() => {
        setInline(prev => ({ ...prev, show: false }))
      }, autoHideDelay)

      return () => clearTimeout(timer)
    }
  }, [inline.show, inline.type, autoHideSuccess, autoHideDelay, persistErrors])

  // Controles inline
  const showInline = useCallback((type: NotificationType, message: string) => {
    if (!enableInline) return
    
    setInline({
      show: true,
      type,
      message
    })
  }, [enableInline])

  const hideInline = useCallback(() => {
    setInline(INITIAL_INLINE_STATE)
  }, [])

  // Controles toast
  const showToast = useCallback((type: NotificationType, message: string) => {
    if (!enableToast || !showNotification) return

    showNotification(type, message)
  }, [enableToast, showNotification])

  // Helpers combinados
  const success = useCallback((
    message: string, 
    options: { toastOnly?: boolean; inlineOnly?: boolean } = {}
  ) => {
    if (!options.toastOnly) showInline('success', message)
    if (!options.inlineOnly) showToast('success', message)
  }, [showInline, showToast])

  const error = useCallback((
    message: string,
    options: { toastOnly?: boolean; inlineOnly?: boolean } = {}
  ) => {
    if (!options.toastOnly) showInline('error', message)
    if (!options.inlineOnly) showToast('error', message)
  }, [showInline, showToast])

  const warning = useCallback((
    message: string,
    options: { toastOnly?: boolean; inlineOnly?: boolean } = {}
  ) => {
    if (!options.toastOnly) showInline('warning', message)
    if (!options.inlineOnly) showToast('warning', message)
  }, [showInline, showToast])

  const info = useCallback((
    message: string,
    options: { toastOnly?: boolean; inlineOnly?: boolean } = {}
  ) => {
    if (!options.toastOnly) showInline('info', message)
    if (!options.inlineOnly) showToast('info', message)
  }, [showInline, showToast])

  const clear = useCallback(() => {
    hideInline()
    // Toast notifications são geralmente auto-clearable pelo próprio sistema
  }, [hideInline])

  return {
    // Estado inline
    inline,
    
    // Controles inline
    showInline,
    hideInline,
    
    // Controles toast
    showToast,
    
    // Helpers combinados
    success,
    error,
    warning,
    info,
    
    // Reset
    clear,
    
    // Estados computed
    hasInlineNotification: inline.show
  }
}

// Hook especializado para notificações apenas inline (sem toast)
export function useInlineNotifications(options: Omit<UseFormNotificationsOptions, 'enableToast'> = {}) {
  return useFormNotifications({
    ...options,
    enableToast: false
  })
}

// Hook especializado para notificações apenas toast (sem inline)
export function useToastNotifications(options: Omit<UseFormNotificationsOptions, 'enableInline'> = {}) {
  return useFormNotifications({
    ...options,
    enableInline: false
  })
}