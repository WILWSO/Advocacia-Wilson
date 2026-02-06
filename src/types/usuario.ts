/**
 * Sistema de tipos para Usuarios
 * Centraliza todas las definiciones de tipos relacionadas con usuarios del sistema
 */

import type { UsuarioRole } from '../config/roles';
import { BaseEntity, BaseFilters, BaseStats, ActiveStatus } from './common';

// Re-exportar el tipo centralizado
export type { UsuarioRole } from '../config/roles';

/**
 * Enum para las posiciones en la empresa
 */
export type UsuarioPosicao = 'Socio' | 'Associado' | 'Parceiro';

/**
 * Interface principal para Usuario
 * Extiende BaseEntity para campos de auditoría estándar
 */
export interface Usuario extends BaseEntity {
  // Información básica
  email: string
  titulo?: string
  nome: string
  nome_completo?: string
  foto_perfil_url?: string
  data_nascimento?: string
  // Rol y estado
  role: UsuarioRole
  posicao: UsuarioPosicao // ✨ NUEVO CAMPO OBLIGATORIO
  ativo: boolean
  // Documentación
  tipo_documento?: string
  numero_documento?: string
  // Contacto
  whatsapp?: string
  redes_sociais?: {
    linkedin?: string
    instagram?: string
    twitter?: string
    facebook?: string
  }
  // Dirección
  endereco?: string
  numero?: string
  cidade?: string
  estado?: string
  cep?: string
  pais?: string
  // Perfil profesional
  equipe?: boolean
  educacao?: string[]
  especialidades?: string[]
  bio?: string
  // Metadata adicional
  data_criacao?: string
  data_atualizacao?: string
  // Campos de auditoría legacy (mapped from BaseEntity)
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
  posicao: UsuarioPosicao // ✨ NUEVO CAMPO OBLIGATORIO
  ativo: boolean
  foto_perfil_url?: string
  data_nascimento?: string
  tipo_documento?: string
  numero_documento?: string
  whatsapp?: string
  redes_sociais?: {
    linkedin?: string
    instagram?: string
    twitter?: string
    facebook?: string
  }
  endereco?: string
  numero?: string
  cidade?: string
  estado?: string
  cep?: string
  pais?: string
  equipe?: boolean
  educacao?: string[]
  especialidades?: string[]
  bio?: string
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
 * Extiende BaseStats con campos específicos
 */
export interface UsuarioStats extends BaseStats {
  ativos: number
  admins: number
  advogados: number
  assistentes: number
}

/**
 * Filtros de búsqueda de usuarios
 * Extiende BaseFilters con campos específicos
 */
export interface UsuarioFilters extends BaseFilters {
  busca: string
  filtroRole: string
  filtroStatus: string
}
