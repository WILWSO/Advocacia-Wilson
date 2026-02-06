/**
 * Auth Helpers - Utilidades centralizadas para autenticación
 * 
 * NOTA: Para verificaciones de roles, usa las funciones de config/roles.ts o utils/roleHelpers.ts
 * Este archivo solo contiene utilidades auxiliares de autenticación.
 */

import { Usuario } from '../types/usuario';

/**
 * Obtiene el nombre de display del usuario
 * Concatena título + nome para login, con fallback a email
 */
export const getUserDisplayName = (user: Usuario | null): string => {
  if (!user) return '';
  
  // Concatenar título con nome si ambos existen
  if (user.titulo && user.nome) {
    return `${user.titulo} ${user.nome}`;
  }
  
  // Fallback: nome solo, o email si no hay nome
  return user.nome || user.email || '';
};

/**
 * Verifica si el usuario tiene un rol específico
 */
export const hasRole = (user: Usuario | null, role: string): boolean => {
  return user?.role === role;
};
