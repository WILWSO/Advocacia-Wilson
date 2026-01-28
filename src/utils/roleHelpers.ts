/**
 * Utilitários para gestão de roles de usuário
 * 
 * ACTUALIZADO: Migrado para usar configuración centralizada de src/config/roles.ts
 * Este archivo ahora re-exporta las funciones centralizadas para mantener compatibilidad.
 */

// Importar desde la configuración centralizada
import { 
  USER_ROLES,
  ROLE_CONFIG,
  hasPermission,
  getRoleLabel as getCentralizedRoleLabel,
  getRoleStyles as getCentralizedRoleStyles,
  isAdmin,
  isAdvogado,
  isAssistente,
  canEdit,
  type UsuarioRole
} from '../config/roles';

// Re-exportar para uso externo
export { 
  USER_ROLES,
  ROLE_CONFIG,
  hasPermission,
  isAdmin,
  isAdvogado,
  isAssistente,
  canEdit,
  type UsuarioRole
};

// Re-exportar con los nombres correctos
export { 
  getRoleLabel,
  getRoleStyles
} from '../config/roles';

/**
 * Obtém a configuração completa do badge para um role (compatibilidad)
 * @deprecated Use getRoleStyles desde config/roles.ts
 */
export const getRoleBadgeConfig = (role: string) => {
  const styles = getCentralizedRoleStyles(role as any);
  const label = getCentralizedRoleLabel(role as any);
  return {
    label,
    className: `${styles.bgColor} ${styles.textColor} ${styles.borderColor}`
  };
};

/**
 * Obtém apenas a classe CSS do badge para um role (compatibilidad)
 * @deprecated Use getRoleStyles desde config/roles.ts
 */
export const getRoleBadgeColor = (role: string): string => {
  return getRoleBadgeConfig(role).className;
};
