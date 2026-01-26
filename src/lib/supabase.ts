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
  titulo?: string
  nome: string
  nome_completo?: string
  foto_perfil_url?: string
  data_nascimento?: string
  role: 'admin' | 'advogado' | 'assistente'
  ativo: boolean
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
  data_criacao?: string
  data_atualizacao?: string
  // Campos de auditoría
  creado_por?: string
  atualizado_por?: string
}

export interface Cliente {
  id?: string
  nome_completo: string
  cpf_cnpj?: string
  rg?: string
  data_nascimento?: string
  nacionalidade?: string
  estado_civil?: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel'
  profissao?: string
  email?: string
  telefone?: string
  celular: string
  telefone_alternativo?: string
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  pais?: string
  observacoes?: string
  como_conheceu?: string
  indicado_por?: string
  status?: 'ativo' | 'inativo' | 'potencial'
  categoria?: string
  documentos_cliente?: DocumentoArquivo[]
  data_cadastro?: string
  data_atualizacao?: string
  ultimo_contato?: string
  // Campos de auditoría
  creado_por?: string
  atualizado_por?: string
}