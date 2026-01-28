/**
 * Sistema de tipos para Clientes
 * Centraliza todas las definiciones de tipos relacionadas con clientes
 */

import { DocumentoArquivo } from './documento'

/**
 * Estado civil del cliente
 */
export type EstadoCivil = 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel'

/**
 * Status del cliente
 */
export type ClienteStatus = 'ativo' | 'inativo' | 'potencial'

/**
 * Interface principal para Cliente
 * Coincide con schema de Supabase
 */
export interface Cliente {
  id?: string
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
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
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
  // Metadata
  data_criacao?: string
  data_atualizacao?: string
  ultimo_contato?: string
  // Campos de auditoría
  creado_por?: string
  atualizado_por?: string
}

/**
 * Datos del formulario de cliente (estado local)
 */
export interface ClienteFormData extends Omit<Cliente, 'id' | 'data_criacao' | 'data_atualizacao' | 'creado_por' | 'atualizado_por'> {
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
 */
export interface ClienteStats {
  total: number
  ativos: number
  inativos: number
  potenciais: number
}

/**
 * Filtros de búsqueda de clientes
 */
export interface ClienteFilters {
  busca: string
  status: string
}
