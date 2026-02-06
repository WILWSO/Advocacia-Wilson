import { useContext } from 'react';
import { NotificationContext } from './NotificationContext';

/**
 * Hook para acceder al sistema de notificaciones
 * 
 * @throws Error si se usa fuera de NotificationProvider
 * @returns Contexto de notificaciones con métodos para mostrar mensajes y confirmaciones
 * 
 * @example
 * const { success, error, confirm } = useNotification();
 * 
 * // Mostrar notificación
 * success('Guardado con éxito');
 * 
 * // Confirmación
 * const confirmed = await confirm({ message: '¿Continuar?' });
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de NotificationProvider');
  }
  return context;
};
