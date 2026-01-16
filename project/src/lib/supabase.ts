import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase usando variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Tipos TypeScript para las tablas
export interface ProcessoJuridico {
  id?: string
  titulo: string
  descricao: string
  status: 'em_aberto' | 'em_andamento' | 'fechado'
  advogado_responsavel: string
  data_criacao?: string
  data_atualizacao?: string
  cliente_nome?: string
  cliente_email?: string
  cliente_telefone?: string
  numero_processo?: string
}

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

export interface Usuario {
  id?: string
  email: string
  nome: string
  role: 'admin' | 'advogado' | 'assistente'
  ativo: boolean
  data_criacao?: string
}