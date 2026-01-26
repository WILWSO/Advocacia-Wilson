import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase usando variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipo para documentos almacenados en Storage
export interface DocumentoArquivo {
  nome: string
  url: string
  tipo: string
  tamanho?: number
  data_upload?: string
}

// Re-exportar tipos de proceso desde types/processo.ts
export type { 
  ProcessoJuridico,
  ProcessoWithRelations,
  ProcessoFormData,
  ProcessoLink,
  Jurisprudencia,
  Jurisdicao,
  Honorarios,
  Audiencia,
  ProcessoStatus,
  ProcessoPolo,
  ProcessoPrioridade,
  ProcessoCompetencia,
  AudienciaTipo,
  AudienciaForma,
  ClienteSimple,
  NewClienteForm
} from '../types/processo'

// Re-exportar tipos de cliente desde types/cliente.ts
export type {
  Cliente,
  ClienteFormData,
  ClienteStatus,
  EstadoCivil,
  ClienteStats,
  ClienteFilters
} from '../types/cliente'

// Re-exportar tipos de usuario desde types/usuario.ts
export type {
  Usuario,
  UsuarioFormData,
  UsuarioRole,
  PasswordForm,
  UsuarioStats,
  UsuarioFilters
} from '../types/usuario'

export interface PostSocial {
  id?: string
  titulo: string
  conteudo: string
  tipo: 'article' | 'video' | 'image' | 'announcement'
  image_url?: string
  video_url?: string
  youtube_id?: string
  tags: string[]
  autor: string | { nome: string; email: string }
  publicado: boolean
  destaque: boolean
  likes: number
  comentarios: number
  data_criacao?: string
  data_atualizacao?: string
}

export interface ComentarioProcesso {
  id?: string
  processo_id: string
  comentario: string
  autor: string
  data_criacao?: string
}