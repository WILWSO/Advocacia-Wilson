/**
 * Sistema de tipos para Clientes
 * Centraliza todas las definiciones de tipos relacionadas con clientes
 */

import { DocumentoArquivo } from './documento'
import { BaseEntity, BaseFilters, BaseStats, ActiveStatus } from './common'

/**
 * Estado civil del cliente
 */
export type EstadoCivil = 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel'

/**
 * Status del cliente - extiende ActiveStatus con 'potencial'
 */
export type ClienteStatus = ActiveStatus | 'potencial'

/**
 * Interface principal para Cliente
 * Extiende BaseEntity para campos de auditoría estándar
 */
export interface Cliente extends BaseEntity {
  // Información Personal
  nome_completo: string
  cpf_cnpj?: string
  rg?: string
  data_nascimento?: string
  nacionalidade?: string
  estado_civil?: EstadoCivil
  profissao?: string
  // Contacto
  email?: string
  telefone?: string
  celular: string
  telefone_alternativo?: string
  // Dirección
  cep?: string
  endereco_completo?: string
  cidade?: string
  estado?: string
  pais?: string
  // Información Adicional
  observacoes?: string
  como_conheceu?: string
  indicado_por?: string
  // Status y gestión
  status: ClienteStatus
  categoria?: string
  // Documentos
  documentos_cliente?: DocumentoArquivo[]
  // Metadata adicional
  data_criacao?: string
  data_atualizacao?: string
  ultimo_contato?: string
  // Campos de auditoría legacy (mapped from BaseEntity)
  creado_por?: string
  atualizado_por?: string
}

/**
 * Datos del formulario de cliente (estado local)
 */
export interface ClienteFormData extends Omit<Cliente, 'id' | 'created_at' | 'updated_at' | 'data_criacao' | 'data_atualizacao' | 'creado_por' | 'atualizado_por'> {
  id?: string
}

/**
 * Cliente simplificado para selects y listas
 */
export interface ClienteSimple {
  id: string
  nome_completo: string
  celular: string
  email?: string
  status: ClienteStatus
}

/**
 * Estadísticas de clientes
 * Extiende BaseStats con campos específicos
 */
export interface ClienteStats extends BaseStats {
  ativos: number
  inativos: number
  potenciais: number
}

/**
 * Filtros de búsqueda de clientes
 * Extiende BaseFilters con campos específicos
 */
export interface ClienteFilters extends BaseFilters {
  busca: string
  status: string
}
