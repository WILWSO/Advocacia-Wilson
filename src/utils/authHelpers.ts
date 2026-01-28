/**
 * Auth Helpers - Utilidades centralizadas para autenticación
 * ACTUALIZADO: Usa configuración centralizada de roles
 */

import { Usuario } from '../types/usuario';
import { USER_ROLES, isAdmin, isAdvogado, isAssistente } from '../config/roles';

/**
 * Obtiene el nombre de display del usuario
 * Centraliza la lógica de fallback: nome → email
 */
export const getUserDisplayName = (user: Usuario | null): string => {
  return user?.nome || user?.email || '';
};

/**
 * Verifica si el usuario tiene un rol específico
 */
export const hasRole = (user: Usuario | null, role: string): boolean => {
  return user?.role === role;
};

/**
 * Verifica si el usuario es admin
 * @deprecated Use isAdmin desde config/roles.ts
 */
export const isAdminUser = (user: Usuario | null): boolean => {
  return isAdmin(user?.role);
};

/**
 * Verifica si el usuario es advogado
 */
export const isAdvogadoUser = (user: Usuario | null): boolean => {
  return user?.role === 'advogado';
};

/**
 * Verifica si el usuario es assistente
 */
export const isAssistenteUser = (user: Usuario | null): boolean => {
  return user?.role === 'assistente';
};
