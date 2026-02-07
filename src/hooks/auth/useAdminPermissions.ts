/**
 * Hook especializado para páginas administrativas que extiende usePermissions
 * con información contextual adicional y métodos de utilidad
 * 
 * Centraliza lógica común de verificaciones de permisos en páginas administrativas
 */

import { usePermissions } from './usePermissions';
import { useAuthLogin } from '../../components/auth/useAuthLogin';
import { Usuario } from '../../types/usuario';

interface UseAdminPermissionsReturn {
  /** Permisos básicos del usuario */
  isAdmin: boolean;
  isAdvogado: boolean;
  isAssistente: boolean;
  canEdit: boolean;
  canDelete: boolean;
  role: string | undefined;
  
  /** Información contextual del usuario */
  currentUser: Usuario | null;
  isAuthenticated: boolean;
  
  /** Métodos de utilidad para verificaciones comunes */
  canEditEntity: (entityCreatedBy?: string) => boolean;
  canDeleteEntity: (entityCreatedBy?: string) => boolean;
  hasMinimumRole: (minimumRole: 'admin' | 'advogado' | 'assistente') => boolean;
}

/**
 * Hook que extiende usePermissions con funcionalidades específicas para páginas administrativas
 * Proporciona métodos de utilidad para verificaciones comunes de permisos en entidades
 * 
 * @example
 * ```tsx
 * const { canEditEntity, canDeleteEntity, isAdmin } = useAdminPermissions();
 * 
 * // Verificar si puede editar una entidad específica
 * const canEditThisCliente = canEditEntity(cliente.criado_por);
 * 
 * // Verificar si puede eliminar considerando el creador
 * const canDeleteThisProcesso = canDeleteEntity(processo.criado_por);
 * ```
 */
export const useAdminPermissions = (): UseAdminPermissionsReturn => {
  const permissions = usePermissions();
  const { user: currentUser, isAuthenticated } = useAuthLogin();

  /**
   * Verifica si el usuario puede editar una entidad específica
   * Administradores pueden editar todo, otros solo lo que crearon
   */
  const canEditEntity = (entityCreatedBy?: string): boolean => {
    if (!permissions.canEdit) return false;
    if (permissions.isAdmin) return true;
    if (!entityCreatedBy || !currentUser?.id) return permissions.canEdit;
    return entityCreatedBy === currentUser.id;
  };

  /**
   * Verifica si el usuario puede eliminar una entidad específica
   * Solo administradores pueden eliminar, con posibles excepciones futuras
   */
  const canDeleteEntity = (entityCreatedBy?: string): boolean => {
    if (!permissions.canDelete) return false;
    if (permissions.isAdmin) return true;
    // Lógica futura: permitir eliminar lo que uno creó
    // return entityCreatedBy === currentUser?.id;
    console.log('Delete permission check for entity created by:', entityCreatedBy); // Para uso futuro
    return false;
  };

  /**
   * Verifica si el usuario tiene al menos el rol mínimo especificado
   */
  const hasMinimumRole = (minimumRole: 'admin' | 'advogado' | 'assistente'): boolean => {
    switch (minimumRole) {
      case 'admin':
        return permissions.isAdmin;
      case 'advogado':
        return permissions.isAdmin || permissions.isAdvogado;
      case 'assistente':
        return permissions.isAdmin || permissions.isAdvogado || permissions.isAssistente;
      default:
        return false;
    }
  };

  return {
    ...permissions,
    currentUser,
    isAuthenticated,
    canEditEntity,
    canDeleteEntity,
    hasMinimumRole
  };
};