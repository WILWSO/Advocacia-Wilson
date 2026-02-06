/**
 * File Helpers - Utilidades para manejo de archivos
 * ✅ SSoT: Funciones centralizadas para formateo y visualización de archivos
 */

import { getIcon } from '../config/icons';

/**
 * Formatea el tamaño de archivo en bytes a formato legible
 * @param bytes - Tamaño del archivo en bytes
 * @returns String formateado (ej: "2.5 MB", "150 KB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Obtiene el icono apropiado según el tipo de archivo
 * @param tipo - MIME type del archivo (ej: "application/pdf", "image/png")
 * @param size - Tamaño del icono en píxeles (default: 24)
 * @returns Componente de icono React
 */
export const getFileIcon = (tipo: string, size: number = 24) => {
  if (tipo.includes('pdf')) {
    return getIcon('file', size, 'text-red-500');
  }
  if (tipo.includes('image')) {
    return getIcon('image', size, 'text-blue-500');
  }
  if (tipo.includes('word') || tipo.includes('document')) {
    return getIcon('file', size, 'text-blue-600');
  }
  if (tipo.includes('excel') || tipo.includes('spreadsheet')) {
    return getIcon('file', size, 'text-green-600');
  }
  
  return getIcon('file', size, 'text-gray-500');
};
