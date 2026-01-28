/**
 * Sistema Centralizado de Nombres de Tablas de Base de Datos
 * 
 * Single Source of Truth (SSoT) para todas las tablas de Supabase.
 * Cambiar aquí afecta todo el sistema.
 * 
 * @module config/database
 */

/**
 * Nombres de tablas principales
 */
export const DB_TABLES = {
  // Tablas de negocio
  CLIENTES: 'clientes',
  USUARIOS: 'usuarios',
  PROCESSOS: 'processos',
  POSTS: 'posts',
  COMENTARIOS: 'comentarios',
  
  // Tablas de archivos/documentos
  DOCUMENTOS: 'documentos',
  
  // Tablas de sistema (si existen)
  AUDIT_LOG: 'audit_log',
  SESSIONS: 'sessions'
} as const;

/**
 * Nombres de buckets de almacenamiento (Storage)
 */
export const STORAGE_BUCKETS = {
  DOCUMENTOS: 'documentos',
  FOTOS_PERFIL: 'fotos-perfil',
  POSTS_MEDIA: 'posts-media',
  PUBLIC: 'public'
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
 */
export const TABLE_FIELDS = {
  CLIENTES: {
    ...COMMON_FIELDS,
    NOME_COMPLETO: 'nome_completo',
    EMAIL: 'email',
    TELEFONE: 'telefone',
    CPF: 'cpf',
    STATUS: 'status',
    ADVOGADO_RESPONSAVEL: 'advogado_responsavel',
    FOTO_PERFIL_URL: 'foto_perfil_url'
  },
  USUARIOS: {
    ...COMMON_FIELDS,
    NOME: 'nome',
    EMAIL: 'email',
    ROLE: 'role',
    STATUS: 'status',
    FOTO_PERFIL_URL: 'foto_perfil_url'
  },
  PROCESSOS: {
    ...COMMON_FIELDS,
    NUMERO_PROCESSO: 'numero_processo',
    TITULO: 'titulo',
    CLIENTE_ID: 'cliente_id',
    STATUS: 'status',
    TIPO_ACAO: 'tipo_acao',
    AREA_DIREITO: 'area_direito'
  },
  POSTS: {
    ...COMMON_FIELDS,
    TITULO: 'titulo',
    CONTEUDO: 'conteudo',
    TIPO: 'tipo',
    STATUS: 'status',
    AUTOR_ID: 'autor_id',
    IMAGEM_URL: 'imagem_url'
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
