/**
 * Hook para mostrar confirmación antes de cerrar modal con cambios no guardados
 * 
 * Integra con useUnsavedChanges y muestra un diálogo de confirmación
 * cuando el usuario intenta cerrar sin guardar.
 * 
 * @example
 * ```tsx
 * const { hasChanges, updateCurrent } = useUnsavedChanges(initialData);
 * const { confirm } = useNotification();
 * const handleClose = useConfirmNavigation(onClose, hasChanges, confirm);
 * 
 * <BaseModal onClose={handleClose} />
 * ```
 */

import { useCallback } from 'react';
import { CONFIRMATION_MESSAGES } from '../../config/messages';

type ConfirmFunction = (options: {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}) => Promise<boolean>;

/**
 * Crea un handler de cierre que muestra confirmación si hay cambios
 * 
 * @param onClose - Función original de cierre
 * @param hasChanges - Si hay cambios no guardados
 * @param confirm - Función de confirmación del NotificationContext
 * @param customMessage - Mensaje personalizado de confirmación
 * @returns Handler de cierre con confirmación integrada
 */
export const useConfirmNavigation = (
  onClose: () => void,
  hasChanges: boolean,
  confirm: ConfirmFunction,
  customMessage?: string
): (() => Promise<void>) => {
  return useCallback(async () => {
    if (hasChanges) {
      const confirmed = await confirm({
        title: 'Descartar alterações?',
        message: customMessage || CONFIRMATION_MESSAGES.DISCARD_CHANGES,
        confirmText: 'Descartar',
        cancelText: 'Continuar editando',
        type: 'warning'
      });
      if (confirmed) {
        onClose();
      }
    } else {
      onClose();
    }
  }, [hasChanges, onClose, confirm, customMessage]);
};
