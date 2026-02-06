/**
 * Tipos comunes y base para todas las entidades del sistema
 * Single Source of Truth (SSoT) para interfaces compartidas
 */

/**
 * Interface base para todas las entidades con campos de auditoría
 */
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
}

/**
 * Interface base para filtros de búsqueda
 */
export interface BaseFilters {
  searchTerm?: string
}

/**
 * Interface base para estadísticas de entidades
 */
export interface BaseStats {
  total: number
}

/**
 * Tipo común para estado activo/inactivo
 * Usado por Cliente, Usuario, y otras entidades con estado binario
 */
export type ActiveStatus = 'ativo' | 'inativo'

/**
 * Tipo para estado de publicación
 * Usado por entidades con workflow de publicación
 */
export type PublicationStatus = 'rascunho' | 'publicado' | 'arquivado'

/**
 * Interface base para entidades con estado activo/inactivo
 */
export interface WithActiveStatus {
  ativo: ActiveStatus
}

/**
 * Interface base para entidades con campo de observaciones
 */
export interface WithObservations {
  observaciones?: string
}

/**
 * Interface base para FormData (datos de formulario sin campos de auditoría)
 * No incluye: id, created_at, updated_at, created_by, updated_by
 */
export type BaseFormData<T extends BaseEntity> = Omit<
  T,
  'id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'
>
