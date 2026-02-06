/**
 * Sistema Centralizado de Nombres de Tablas de Base de Datos
 * 
 * Single Source of Truth (SSoT) para todas las tablas de Supabase.
 * Cambiar aquí afecta todo el sistema.
 * 
 * @module config/database
 */

// ✅ SSoT: STORAGE_BUCKETS importado y re-exportado desde config/storage
import { STORAGE_BUCKETS } from './storage';
export { STORAGE_BUCKETS };

/**
 * Nombres de tablas principales
 * ✅ Nombres actualizados para coincidir con Supabase
 * ✅ Sincronizado con database/schema.sql (2025-01-29)
 * ✅ Actualizado: documentos polimórfica, tablas eliminadas
 */
export const DB_TABLES = {
  // Tablas de negocio principales
  CLIENTES: 'clientes',
  USUARIOS: 'usuarios',
  PROCESSOS: 'processos_juridicos',
  AUDIENCIAS: 'audiencias',
  
  // Tabla de documentos (polimórfica - única para todas las entidades)
  DOCUMENTOS: 'documentos',
  
  // Tablas sociales
  POSTS: 'posts_sociais',
  COMENTARIOS: 'comentarios_sociais',
  
  // Tablas de sistema
  AUDIT_LOG: 'audit_log',
  JURISPRUDENCIAS: 'jurisprudencias'
} as const;

/**
 * Campos comunes en las tablas (para queries consistentes)
 */
export const COMMON_FIELDS = {
  ID: 'id',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
  DELETED_AT: 'deleted_at',
  CREATED_BY: 'created_by',
  UPDATED_BY: 'updated_by'
} as const;

/**
 * Campos específicos de cada tabla
 * ✅ Sincronizado con database/schema.sql (2025-01-29)
 * ✅ Actualizado: documentos polimórfica, jurisprudencias simplificada
 */
export const TABLE_FIELDS = {
  CLIENTES: {
    ...COMMON_FIELDS,
    NOME_COMPLETO: 'nome_completo',
    EMAIL: 'email',
    TELEFONE: 'telefone',
    CELULAR: 'celular',
    CPF_CNPJ: 'cpf_cnpj',
    STATUS: 'status',
    ADVOGADO_RESPONSAVEL: 'advogado_responsavel',
    FOTO_PERFIL_URL: 'foto_perfil_url',
    PAIS: 'pais'
  },
  USUARIOS: {
    ...COMMON_FIELDS,
    NOME: 'nome',
    NOME_COMPLETO: 'nome_completo',
    EMAIL: 'email',
    ROLE: 'role',
    ATIVO: 'ativo',
    FOTO_PERFIL_URL: 'foto_perfil_url',
    WHATSAPP: 'whatsapp',
    DATA_NASCIMENTO: 'data_nascimento'
  },
  PROCESSOS: {
    ...COMMON_FIELDS,
    NUMERO_PROCESSO: 'numero_processo',
    TITULO: 'titulo',
    DESCRICAO: 'descricao',
    CLIENTE_ID: 'cliente_id',
    ADVOGADO_RESPONSAVEL: 'advogado_responsavel',
    STATUS: 'status',
    POLO: 'polo',
    AREA_DIREITO: 'area_direito',
    COMPETENCIA: 'competencia',
    PRIORIDADE: 'prioridade',
    VALOR_CAUSA: 'valor_causa',
    JURISDICAO: 'jurisdicao',
    HONORARIOS: 'honorarios',
    AUDIENCIAS: 'audiencias',
    DOCUMENTOS_PROCESSO: 'documentos_processo',
    JURISPRUDENCIA: 'jurisprudencia'
  },
  POSTS: {
    ...COMMON_FIELDS,
    TITULO: 'titulo',
    CONTEUDO: 'conteudo',
    TIPO: 'tipo',
    PUBLICADO: 'publicado',
    DESTAQUE: 'destaque',
    AUTOR: 'autor',
    IMAGE_URL: 'image_url',
    VIDEO_URL: 'video_url',
    YOUTUBE_ID: 'youtube_id',
    TAGS: 'tags',
    LIKES: 'likes',
    COMENTARIOS: 'comentarios'
  },
  DOCUMENTOS: {
    ...COMMON_FIELDS,
    ENTITY_TYPE: 'entity_type', // 'cliente', 'processo', 'jurisprudencia', etc.
    ENTITY_ID: 'entity_id',
    NOME_DOCUMENTO: 'nome_documento',
    TIPO_DOCUMENTO: 'tipo_documento',
    DESCRICAO: 'descricao',
    URL_ARQUIVO: 'url_arquivo',
    TAMANHO_BYTES: 'tamanho_bytes',
    MIME_TYPE: 'mime_type',
    DATA_UPLOAD: 'data_upload',
    DATA_EXPIRACAO: 'data_expiracao',
    UPLOAD_POR: 'upload_por',
    ATIVO: 'ativo'
  },
  AUDIT_LOG: {
    ID: 'id',
    TABLE_NAME: 'table_name',
    RECORD_ID: 'record_id',
    OPERATION: 'operation',
    USUARIO_ID: 'usuario_id',
    USUARIO_EMAIL: 'usuario_email',
    USUARIO_NOME: 'usuario_nome',
    OLD_DATA: 'old_data',
    NEW_DATA: 'new_data',
    CHANGED_FIELDS: 'changed_fields',
    IP_ADDRESS: 'ip_address',
    USER_AGENT: 'user_agent',
    TIMESTAMP: 'timestamp',
    NOTES: 'notes'
  },
  JURISPRUDENCIAS: {
    ...COMMON_FIELDS,
    TITULO: 'titulo',
    EMENTA: 'ementa',
    LINK: 'link',
    DOCUMENTO: 'documento', // UUID referencia a tabla documentos
    PROCESSOS_RELACIONADOS: 'processos_relacionados',
    NOTAS: 'notas',
    ATIVO: 'ativo'
  },
  COMENTARIOS_SOCIAIS: {
    ID: 'id',
    POST_ID: 'post_id',
    AUTOR_NOME: 'autor_nome',
    AUTOR_EMAIL: 'autor_email',
    COMENTARIO: 'comentario',
    DATA_CRIACAO: 'data_criacao',
    APROVADO: 'aprovado'
  }
} as const;

/**
 * Helper para construir query select con campos específicos
 */
export const selectFields = (table: keyof typeof TABLE_FIELDS, fields?: string[]): string => {
  if (fields && fields.length > 0) {
    return fields.join(',');
  }
  return '*';
};

/**
 * Helper para verificar si una tabla existe
 */
export const isValidTable = (tableName: string): boolean => {
  return Object.values(DB_TABLES).includes(tableName as any);
};

/**
 * Type helpers
 */
export type TableName = typeof DB_TABLES[keyof typeof DB_TABLES];
export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];
