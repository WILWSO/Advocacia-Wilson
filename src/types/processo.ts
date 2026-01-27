/**
 * Tipos centralizados para procesos jurídicos
 * Single source of truth para evitar inconsistencias entre componentes
 */

import { DocumentoArquivo } from '../lib/supabase'



export type ProcessoStatus = 'em_aberto' | 'em_andamento' | 'fechado'
export type ProcessoPolo = 'ativo' | 'passivo'
export type ProcessoPrioridade = 'baixa' | 'media' | 'alta' | 'urgente'
export type ProcessoCompetencia = 'federal' | 'estadual' | 'trabalhista' | 'eleitoral'
export type AudienciaTipo = 'Conciliação' | 'Instrução'
export type AudienciaForma = 'Presencial' | 'Virtual' | 'Híbrida'
export interface ProcessoLink {
  titulo: string
  link: string
}

/**
 * Jurisprudencia relacionada al proceso
 */
export interface Jurisprudencia {
  ementa: string
  link: string
}

/**
 * Información de jurisdicción del proceso
 */
export interface Jurisdicao {
  uf?: string
  municipio?: string
  vara?: string
  juiz?: string
}

/**
 * Información de honorarios
 */
export interface Honorarios {
  valor_honorarios?: number
  detalhes?: string
}

/**
 * Audiencia programada
 */
export interface Audiencia {
  data: string
  horario: string
  tipo: AudienciaTipo
  forma: AudienciaForma
  lugar: string
}

/**
 * Interface principal para proceso jurídico
 * Coincide con schema de Supabase
 */
export interface ProcessoJuridico {
  id?: string
  titulo: string
  descricao: string
  status: ProcessoStatus
  advogado_responsavel?: string
  data_criacao?: string
  data_atualizacao?: string
  cliente_nome?: string
  cliente_email?: string
  cliente_telefone?: string
  numero_processo?: string
  cliente_id?: string
  polo?: ProcessoPolo
  area_direito?: string
  prioridade?: ProcessoPrioridade
  valor_causa?: string
  atividade_pendente?: string
  competencia?: ProcessoCompetencia
  // Campos JSONB
  jurisdicao?: Jurisdicao
  honorarios?: Honorarios
  audiencias?: Audiencia[]
  documentos_processo?: DocumentoArquivo[]
  links_processo?: ProcessoLink[]
  jurisprudencia?: Jurisprudencia[]
  // Campos de auditoría
  creado_por?: string
  atualizado_por?: string
}

/**
 * Proceso con relaciones (joins con otras tablas)
 */
export interface ProcessoWithRelations extends ProcessoJuridico {
  usuarios?: {
    nome: string
  }
  cliente_nome?: string
}

/**
 * Datos del formulario de proceso (estado local)
 */
export interface ProcessoFormData {
  titulo: string
  descricao: string
  advogado_responsavel: string
  cliente_id: string
  polo: ProcessoPolo | ''
  cliente_email: string
  cliente_telefone: string
  numero_processo: string
  status: string
  area_direito: string
  prioridade: string
  valor_causa: string
  atividade_pendente: string
  competencia: ProcessoCompetencia | ''
  jurisdicao: {
    uf: string
    municipio: string
    vara: string
    juiz: string
  }
  honorarios: {
    valor_honorarios: string
    detalhes: string
  }
  audiencias: Audiencia[]
  documentos_processo: DocumentoArquivo[]
  links_processo: ProcessoLink[]
  jurisprudencia: Jurisprudencia[]
}

/**
 * Cliente simplificado para el formulario
 */
export interface ClienteSimple {
  id: string
  nome_completo: string
  status: string
}

/**
 * Formulario de nuevo cliente
 */
export interface NewClienteForm {
  nome_completo: string
  celular: string
  email: string
  status: 'ativo' | 'inativo' | 'potencial'
}
