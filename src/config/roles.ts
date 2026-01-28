/**
 * Sistema Centralizado de Roles de Usuario
 * 
 * Single Source of Truth (SSoT) para roles y permisos del sistema.
 * Cambiar aquí afecta todo el sistema.
 * 
 * @module config/roles
 */

/**
 * Roles disponibles en el sistema
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  ADVOGADO: 'advogado',
  ASSISTENTE: 'assistente'
} as const;

/**
 * Type derivado de los roles disponibles
 */
export type UsuarioRole = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Configuración de cada rol con metadatos
 */
export const ROLE_CONFIG = {
  [USER_ROLES.ADMIN]: {
    label: 'Administrador',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    description: 'Acesso total ao sistema',
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canManageUsers: true,
      canManageClients: true,
      canManageProcessos: true,
      canViewReports: true,
      canManageSocial: true
    }
  },
  [USER_ROLES.ADVOGADO]: {
    label: 'Advogado',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-300',
    description: 'Gestão de processos e clientes',
    permissions: {
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canManageUsers: false,
      canManageClients: true,
      canManageProcessos: true,
      canViewReports: true,
      canManageSocial: false
    }
  },
  [USER_ROLES.ASSISTENTE]: {
    label: 'Assistente',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    description: 'Visualização e edição limitada',
    permissions: {
      canCreate: true,
      canEdit: false,
      canDelete: false,
      canManageUsers: false,
      canManageClients: false,
      canManageProcessos: false,
      canViewReports: false,
      canManageSocial: false
    }
  }
} as const;

/**
 * Helper para verificar permisos de un rol
 */
export const hasPermission = (
  role: UsuarioRole | undefined | null, 
  permission: keyof typeof ROLE_CONFIG[typeof USER_ROLES.ADMIN]['permissions']
): boolean => {
  if (!role) return false;
  return ROLE_CONFIG[role]?.permissions[permission] ?? false;
};

/**
 * Helper para obtener label de un rol
 */
export const getRoleLabel = (role: UsuarioRole | undefined | null): string => {
  if (!role) return 'Sem função';
  return ROLE_CONFIG[role]?.label ?? 'Desconhecido';
};

/**
 * Helper para obtener configuración de estilos de un rol
 */
export const getRoleStyles = (role: UsuarioRole | undefined | null) => {
  if (!role) return {
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-300'
  };
  return {
    bgColor: ROLE_CONFIG[role]?.bgColor,
    textColor: ROLE_CONFIG[role]?.textColor,
    borderColor: ROLE_CONFIG[role]?.borderColor
  };
};

/**
 * Verifica si un usuario es administrador
 */
export const isAdmin = (role: UsuarioRole | undefined | null): boolean => {
  return role === USER_ROLES.ADMIN;
};

/**
 * Verifica si un usuario es advogado
 */
export const isAdvogado = (role: UsuarioRole | undefined | null): boolean => {
  return role === USER_ROLES.ADVOGADO;
};

/**
 * Verifica si un usuario es assistente
 */
export const isAssistente = (role: UsuarioRole | undefined | null): boolean => {
  return role === USER_ROLES.ASSISTENTE;
};

/**
 * Verifica si un usuario puede editar (admin o advogado)
 */
export const canEdit = (role: UsuarioRole | undefined | null): boolean => {
  return role === USER_ROLES.ADMIN || role === USER_ROLES.ADVOGADO;
};
