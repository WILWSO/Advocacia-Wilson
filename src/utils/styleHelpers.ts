/**
 * Helpers centralizados para mapeo estado→estilo (SSoT para badges e classes CSS)
 * 
 * Elimina hardcodeo de classes CSS duplicadas en componentes.
 * Centraliza lógica de mapeo de estados para cores, ícones e badges.
 * 
 * @example
 * import { getStatusBadge, getPriorityBadge, getRoleBadge } from './styleHelpers'
 * 
 * // Badge de status centralizado
 * const statusClasses = getStatusBadge(cliente.status, 'cliente')
 * 
 * // Badge de prioridade
 * const priorityClasses = getPriorityBadge(processo.prioridade)
 */

import { CheckCircle, AlertCircle, Clock, Users, Shield, Award, User } from 'lucide-react'
import React from 'react'

// ==================== TIPOS ==================== //

export type EntityStatus = 
  | 'ativo' | 'inativo' | 'potencial'           // Cliente
  | 'em_aberto' | 'em_andamento' | 'fechado'    // Processo  
  | 'agendada' | 'realizada' | 'cancelada'      // Audiência

export type ProcessoPriority = 'urgente' | 'alta' | 'media' | 'baixa'

export type UserRole = 'admin' | 'advogado' | 'assistente'

export type UserPosition = 'Socio' | 'Associado' | 'Parceiro'

export type EntityType = 'cliente' | 'processo' | 'audiencia' | 'usuario'

// ==================== CONFIGURAÇÕES DE CORES ==================== //

const STATUS_COLORS = {
  // Status Cliente
  ativo: 'bg-green-100 text-green-800 border-green-300',
  inativo: 'bg-gray-100 text-gray-800 border-gray-300', 
  potencial: 'bg-blue-100 text-blue-800 border-blue-300',
  
  // Status Processo
  em_aberto: 'bg-blue-100 text-blue-800 border-blue-300',
  em_andamento: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  fechado: 'bg-green-100 text-green-800 border-green-300',
  
  // Status Audiência
  agendada: 'bg-blue-100 text-blue-800 border-blue-300',
  realizada: 'bg-green-100 text-green-800 border-green-300',
  cancelada: 'bg-red-100 text-red-800 border-red-300'
}

const PRIORITY_COLORS = {
  urgente: 'bg-red-100 text-red-800 border-red-300',
  alta: 'bg-orange-100 text-orange-800 border-orange-300', 
  media: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  baixa: 'bg-green-100 text-green-800 border-green-300'
}

const ROLE_COLORS = {
  admin: 'bg-purple-100 text-purple-800 border-purple-300',
  advogado: 'bg-blue-100 text-blue-800 border-blue-300',
  assistente: 'bg-gray-100 text-gray-800 border-gray-300'
}

const POSITION_COLORS = {
  Socio: 'bg-purple-100 text-purple-800 border-purple-300',
  Associado: 'bg-blue-100 text-blue-800 border-blue-300',
  Parceiro: 'bg-indigo-100 text-indigo-800 border-indigo-300'
}

const BOOLEAN_COLORS = {
  true: 'bg-green-100 text-green-800 border-green-300',
  false: 'bg-gray-100 text-gray-800 border-gray-300'
}

// ==================== ÍCONES ==================== //

const STATUS_ICONS = {
  // Status Cliente
  ativo: CheckCircle,
  inativo: AlertCircle,
  potencial: Clock,
  
  // Status Processo  
  em_aberto: Clock,
  em_andamento: AlertCircle,
  fechado: CheckCircle,
  
  // Status Audiência
  agendada: Clock,
  realizada: CheckCircle, 
  cancelada: AlertCircle
}

const PRIORITY_ICONS = {
  urgente: AlertCircle,
  alta: AlertCircle,
  media: Clock,
  baixa: CheckCircle
}

const ROLE_ICONS = {
  admin: Shield,
  advogado: Users,
  assistente: User
}

const POSITION_ICONS = {
  Socio: Award,
  Associado: Users,
  Parceiro: Users
}

// ==================== LABELS ==================== //

const STATUS_LABELS = {
  // Cliente
  ativo: 'Ativo',
  inativo: 'Inativo',
  potencial: 'Potencial',
  
  // Processo
  em_aberto: 'Em Aberto',
  em_andamento: 'Em Andamento', 
  fechado: 'Fechado',
  
  // Audiência
  agendada: 'Agendada',
  realizada: 'Realizada',
  cancelada: 'Cancelada'
}

const PRIORITY_LABELS = {
  urgente: 'Urgente',
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa'
}

const ROLE_LABELS = {
  admin: 'Administrador',
  advogado: 'Advogado',
  assistente: 'Assistente'
}

// ==================== FUNÇÕES PRINCIPAIS ==================== //

/**
 * Retorna classes CSS para badge de status
 */
export function getStatusBadge(status: EntityStatus, _entityType?: EntityType) {
  const classes = STATUS_COLORS[status] || BOOLEAN_COLORS.false
  const icon = STATUS_ICONS[status]
  const label = STATUS_LABELS[status] || status
  
  return {
    classes,
    icon,
    label,
    baseClasses: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border'
  }
}

/**
 * Retorna classes CSS para badge de prioridade  
 */
export function getPriorityBadge(priority: ProcessoPriority) {
  const classes = PRIORITY_COLORS[priority] || BOOLEAN_COLORS.false
  const icon = PRIORITY_ICONS[priority]
  const label = PRIORITY_LABELS[priority] || priority
  
  return {
    classes,
    icon, 
    label,
    baseClasses: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border'
  }
}

/**
 * Retorna classes CSS para badge de role/perfil
 */
export function getRoleBadge(role: UserRole) {
  const classes = ROLE_COLORS[role] || BOOLEAN_COLORS.false
  const icon = ROLE_ICONS[role]
  const label = ROLE_LABELS[role] || role
  
  return {
    classes,
    icon,
    label,
    baseClasses: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border'
  }
}

/**
 * Retorna classes CSS para badge de posição
 */
export function getPositionBadge(position: UserPosition) {
  const classes = POSITION_COLORS[position] || BOOLEAN_COLORS.false
  const icon = POSITION_ICONS[position]
  const label = position
  
  return {
    classes,
    icon,
    label,
    baseClasses: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border'
  }
}

/**
 * Retorna classes CSS para badge booleano (sim/não, ativo/inativo)
 */
export function getBooleanBadge(value: boolean, labels = { true: 'Sim', false: 'Não' }) {
  const classes = BOOLEAN_COLORS[String(value) as keyof typeof BOOLEAN_COLORS]
  const icon = value ? CheckCircle : AlertCircle
  const label = labels[String(value) as keyof typeof labels]
  
  return {
    classes,
    icon,
    label, 
    baseClasses: 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border'
  }
}

/**
 * Helper para criar badge React completo
 */
export function createBadgeComponent(
  badgeConfig: ReturnType<typeof getStatusBadge | typeof getPriorityBadge | typeof getRoleBadge>,
  options: { 
    showIcon?: boolean,
    size?: 'sm' | 'md' | 'lg',
    className?: string
  } = {}
) {
  const { showIcon = true, size = 'md', className = '' } = options
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1', 
    lg: 'text-base px-4 py-1.5'
  }
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }
  
  const IconComponent = badgeConfig.icon
  
  return React.createElement(
    'span',
    {
      className: `${badgeConfig.baseClasses} ${badgeConfig.classes} ${sizeClasses[size]} ${className}`.trim()
    },
    showIcon && IconComponent && React.createElement(IconComponent, { size: iconSizes[size] }),
    badgeConfig.label
  )
}

// ==================== BACKWARDS COMPATIBILITY ==================== //

/**
 * @deprecated Use getStatusBadge() instead
 * Mantido para compatibilidade com código existente
 */
export const getStatusBadgeColor = (status: EntityStatus) => {
  console.warn('getStatusBadgeColor is deprecated. Use getStatusBadge() instead.')
  return getStatusBadge(status).classes
}

/**
 * @deprecated Use getRoleBadge() instead  
 * Mantido para compatibilidade com código existente
 */
export const getRoleBadgeColor = (role: UserRole) => {
  console.warn('getRoleBadgeColor is deprecated. Use getRoleBadge() instead.')
  return getRoleBadge(role).classes
}

// ==================== EXPORTS CONSOLIDADOS ==================== //

export {
  STATUS_COLORS,
  PRIORITY_COLORS, 
  ROLE_COLORS,
  POSITION_COLORS,
  BOOLEAN_COLORS,
  STATUS_LABELS,
  PRIORITY_LABELS,
  ROLE_LABELS
}