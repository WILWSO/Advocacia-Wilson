/**
 * Configuración Centralizada de Storage (SSoT)
 * 
 * Define buckets, paths y límites para el sistema de archivos.
 * Cambiar un bucket aquí actualizará todas las referencias en el sistema.
 */

/**
 * Buckets de Supabase Storage
 * ✅ Sincronizado con Supabase (2025-01-29)
 */
export const STORAGE_BUCKETS = {
  documentosCliente: 'documentos_cliente',
  documentosProcesso: 'documentos_processo',
  fotoPerfil: 'foto_perfil', // ✅ Actualizado: foto_perfil (sin 's')
} as const;

/**
 * Límites de tamaño por tipo de archivo (en bytes)
 */
export const FILE_SIZE_LIMITS = {
  documento: 10 * 1024 * 1024,      // 10MB para documentos
  imagem: 5 * 1024 * 1024,          // 5MB para imágenes
  fotoPerfil: 2 * 1024 * 1024,      // 2MB para fotos de perfil
} as const;

/**
 * Extensiones permitidas por tipo
 */
export const ALLOWED_EXTENSIONS = {
  documento: ['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.xls'],
  imagem: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  fotoPerfil: ['.jpg', '.jpeg', '.png'],
} as const;

/**
 * Mensajes de error de storage
 */
export const STORAGE_ERROR_MESSAGES = {
  fileTooBig: (maxSize: number) => `Arquivo muito grande. Tamanho máximo: ${maxSize / (1024 * 1024)}MB`,
  invalidExtension: (allowed: readonly string[]) => `Extensão não permitida. Permitidas: ${allowed.join(', ')}`,
  uploadFailed: 'Erro ao fazer upload do arquivo',
  deleteFailed: 'Erro ao excluir arquivo',
  downloadFailed: 'Erro ao baixar arquivo',
} as const;

/**
 * Configuración de buckets con metadatos
 */
export const BUCKET_CONFIG = {
  [STORAGE_BUCKETS.documentosCliente]: {
    maxSize: FILE_SIZE_LIMITS.documento,
    allowedExtensions: ALLOWED_EXTENSIONS.documento,
    label: 'Documentos do Cliente',
  },
  [STORAGE_BUCKETS.documentosProcesso]: {
    maxSize: FILE_SIZE_LIMITS.documento,
    allowedExtensions: ALLOWED_EXTENSIONS.documento,
    label: 'Documentos do Processo',
  },
  [STORAGE_BUCKETS.fotoPerfil]: {
    maxSize: FILE_SIZE_LIMITS.fotoPerfil,
    allowedExtensions: ALLOWED_EXTENSIONS.fotoPerfil,
    label: 'Foto de Perfil',
  },
} as const;

/**
 * Helper para validar archivo
 */
export function validateFile(
  file: File,
  bucket: keyof typeof BUCKET_CONFIG
): { valid: boolean; error?: string } {
  const config = BUCKET_CONFIG[bucket];
  
  // Validar tamaño
  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: STORAGE_ERROR_MESSAGES.fileTooBig(config.maxSize),
    };
  }
  
  // Validar extensión
  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
  const isValidExtension = config.allowedExtensions.some(
    (ext) => ext === extension
  );
  
  if (!isValidExtension) {
    return {
      valid: false,
      error: STORAGE_ERROR_MESSAGES.invalidExtension(config.allowedExtensions),
    };
  }
  
  return { valid: true };
}

/**
 * Helper para obtener configuración de bucket
 */
export function getBucketConfig(bucket: keyof typeof BUCKET_CONFIG) {
  return BUCKET_CONFIG[bucket];
}
