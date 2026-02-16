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
import type { Post } from '../../types/post';

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
  /** Verifica si el usuario puede editar un post específico (ownership-based) */
  canEditPost: (post: Post) => boolean;
  /** Verifica si el usuario puede eliminar un post específico (ownership-based) */
  canDeletePost: (post: Post) => boolean;
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
  
  /**
   * Verifica si el usuario puede editar un post específico
   * Admin: Puede editar cualquier post
   * Advogado: Solo puede editar sus propios posts (ownership)
   * Assistente: No puede editar posts
   * 
   * @param post - Post a validar
   * @returns true si el usuario puede editar el post
   */
  const canEditPost = (post: Post): boolean => {
    if (!user) return false;
    
    // Admin puede editar cualquier post
    if (isAdmin) return true;
    
    // Advogado solo puede editar posts donde él es el autor
    if (isAdvogado) {
      // Si el autor es un objeto con id
      if (typeof post.autor === 'object' && 'id' in post.autor) {
        return (post.autor as any).id === user.id;
      }
      // Si el autor es un UUID string
      return post.autor === user.id;
    }
    
    // Assistente y otros roles no pueden editar posts
    return false;
  };
  
  /**
   * Verifica si el usuario puede eliminar un post específico
   * Admin: Puede eliminar cualquier post
   * Advogado: Solo puede eliminar sus propios posts (ownership)
   * Assistente: No puede eliminar posts
   * 
   * @param post - Post a validar
   * @returns true si el usuario puede eliminar el post
   */
  const canDeletePost = (post: Post): boolean => {
    if (!user) return false;
    
    // Admin puede eliminar cualquier post
    if (isAdmin) return true;
    
    // Advogado solo puede eliminar posts donde él es el autor
    if (isAdvogado) {
      // Si el autor es un objeto con id
      if (typeof post.autor === 'object' && 'id' in post.autor) {
        return (post.autor as any).id === user.id;
      }
      // Si el autor es un UUID string
      return post.autor === user.id;
    }
    
    // Assistente y otros roles no pueden eliminar posts
    return false;
  };
  
  return {
    isAdmin,
    isAdvogado,
    isAssistente,
    canEdit,
    canDelete,
    role: user?.role,
    canEditPost,
    canDeletePost
  };
};
