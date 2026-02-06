/**
 * Hook centralizado para gestión de permisos de usuario
 * Single Source of Truth (SSoT) para lógica de permisos en toda la aplicación
 * 
 * @example
 * ```tsx
 * const { isAdmin, canEdit, canDelete } = usePermissions();
 * 
 * if (canEdit) {
 *   // Mostrar botón de editar
 * }
 * ```
 */

import { useAuthLogin as useAuth } from '../../components/auth/useAuthLogin';
import { 
  isAdmin as checkIsAdmin, 
  isAdvogado as checkIsAdvogado, 
  isAssistente as checkIsAssistente, 
  canEdit as checkCanEdit 
} from '../../utils/roleHelpers';

interface UsePermissionsReturn {
  /** Usuario es administrador */
  isAdmin: boolean;
  /** Usuario es abogado */
  isAdvogado: boolean;
  /** Usuario es asistente */
  isAssistente: boolean;
  /** Usuario puede editar (admin, abogado o asistente) */
  canEdit: boolean;
  /** Usuario puede eliminar (solo admin) */
  canDelete: boolean;
  /** Role del usuario actual */
  role: string | undefined;
}

/**
 * Hook que centraliza toda la lógica de verificación de permisos
 * Elimina duplicación de código en todos los hooks de formularios
 * 
 * @returns Objeto con permisos del usuario actual
 */
export const usePermissions = (): UsePermissionsReturn => {
  const { user } = useAuth();
  
  const isAdmin = checkIsAdmin(user?.role);
  const isAdvogado = checkIsAdvogado(user?.role);
  const isAssistente = checkIsAssistente(user?.role);
  const canEdit = checkCanEdit(user?.role);
  const canDelete = isAdmin;
  
  return {
    isAdmin,
    isAdvogado,
    isAssistente,
    canEdit,
    canDelete,
    role: user?.role
  };
};
