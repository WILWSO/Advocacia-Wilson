/**
 * Sistema de tipos para Usuarios
 * Centraliza todas las definiciones de tipos relacionadas con usuarios del sistema
 */

import type { UsuarioRole } from '../config/roles';

// Re-exportar el tipo centralizado
export type { UsuarioRole } from '../config/roles';

/**
 * Interface principal para Usuario
 * Coincide con schema de Supabase
 */
export interface Usuario {
  id?: string
  // Información básica
  email: string
  titulo?: string
  nome: string
  nome_completo?: string
  foto_perfil_url?: string
  data_nascimento?: string
  // Rol y estado
  role: UsuarioRole
  ativo: boolean
  // Documentación
  tipo_documento?: string
  numero_documento?: string
  // Contacto
  whatsapp?: string
  redes_sociais?: {
    [key: string]: string
  }
  // Dirección
  endereco?: string
  numero?: string
  localidade?: string
  estado?: string
  cep?: string
  pais?: string
  // Metadata
  data_criacao?: string
  data_atualizacao?: string
  // Campos de auditoría
  creado_por?: string
  atualizado_por?: string
}

/**
 * Datos del formulario de usuario (estado local)
 * Incluye password para creación
 */
export interface UsuarioFormData {
  titulo?: string
  nome: string
  nome_completo?: string
  email: string
  password?: string
  role: UsuarioRole
  ativo: boolean
  foto_perfil_url?: string
  data_nascimento?: string
  tipo_documento?: string
  numero_documento?: string
  whatsapp?: string
  redes_sociais?: {
    [key: string]: string
  }
  endereco?: string
  numero?: string
  localidade?: string
  estado?: string
  cep?: string
  pais?: string
}

/**
 * Formulario de cambio de contraseña
 */
export interface PasswordForm {
  newPassword: string
  confirmPassword: string
}

/**
 * Estadísticas de usuarios
 */
export interface UsuarioStats {
  total: number
  ativos: number
  admins: number
  advogados: number
  assistentes: number
}

/**
 * Filtros de búsqueda de usuarios
 */
export interface UsuarioFilters {
  busca: string
  filtroRole: string
  filtroStatus: string
}
