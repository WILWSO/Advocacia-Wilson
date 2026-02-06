/**
 * Tipos para documentos y archivos del sistema
 * Usado por Cliente y Processo para gestión de documentos
 */

/**
 * Interface para documentos almacenados en Supabase Storage
 * Usado con DocumentManager y campo JSONB documentos_cliente
 */
export interface DocumentoArquivo {
  nome: string
  url: string
  tipo: string
  tamanho?: number
  data_upload?: string
}
