import { supabase } from '../lib/supabase';

/**
 * Interface para documentos (compatible con DocumentoArquivo y DocumentItem)
 */
export interface StorageDocument {
  url: string;
  nome: string;
  tipo?: string;
  tamanho?: number;
}

/**
 * StorageService - Single Source of Truth para operaciones de Supabase Storage
 * Centraliza toda la lógica de acceso, visualización y descarga de documentos
 */
export class StorageService {
  /**
   * Extrae el filePath desde una URL de Supabase Storage
   * Soporta formato: /object/public/{bucketName}/ y /object/{bucketName}/
   * 
   * @param url - URL completa del documento en Supabase
   * @param bucketName - Nombre del bucket (ej: 'documentos_processo', 'documentos_cliente')
   * @returns filePath extraído o null si no se puede extraer
   */
  static extractFilePath(url: string, bucketName: string): string | null {
    try {
      const urlPattern = new RegExp(`/object/(?:public/)?${bucketName}/(.+)`);
      const match = url.match(urlPattern);
      return match && match[1] ? match[1] : null;
    } catch (error) {
      console.error('Error extracting file path:', error);
      return null;
    }
  }

  /**
   * Genera una Signed URL para acceso temporal a documentos privados
   * 
   * @param bucketName - Nombre del bucket
   * @param filePath - Path del archivo dentro del bucket
   * @param expiresIn - Tiempo de expiración en segundos (default: 60)
   * @returns Signed URL o null si hay error
   */
  static async getSignedUrl(
    bucketName: string,
    filePath: string,
    expiresIn: number = 60
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, expiresIn);

      if (error) throw error;

      return data?.signedUrl || null;
    } catch (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }
  }

  /**
   * Visualiza un documento en nueva pestaña
   * - Para documentos privados: genera signed URL
   * - Para documentos públicos: abre URL directa
   * - Usa .download() para mejor compatibilidad con RLS
   * 
   * @param doc - Documento a visualizar
   * @param bucketName - Nombre del bucket
   */
  static async viewDocument(doc: StorageDocument, bucketName: string): Promise<void> {
    if (!doc.url) {
      console.error('Document URL is missing');
      return;
    }

    try {
      const filePath = this.extractFilePath(doc.url, bucketName);

      if (filePath) {
        // Usar .download() para obtener el blob directamente (mejor compatibilidad RLS)
        const { data: fileBlob, error } = await supabase.storage
          .from(bucketName)
          .download(filePath);

        if (error) throw error;

        if (fileBlob) {
          // Crear blob URL para visualización
          const blobUrl = URL.createObjectURL(
            new Blob([fileBlob], { type: doc.tipo || fileBlob.type })
          );

          window.open(blobUrl, '_blank');

          // Liberar memoria después de 60 segundos
          setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
        }
      } else {
        // Fallback: abrir URL directa (para documentos públicos)
        window.open(doc.url, '_blank');
      }
    } catch (error) {
      console.error('Error viewing document:', error);
      throw new Error('Erro ao visualizar documento. Verifique as permissões no Supabase Storage.');
    }
  }

  /**
   * Descarga un documento al dispositivo del usuario
   * - Genera signed URL para documentos privados
   * - Crea blob y trigger de descarga automática
   * 
   * @param doc - Documento a descargar
   * @param bucketName - Nombre del bucket
   */
  static async downloadDocument(doc: StorageDocument, bucketName: string): Promise<void> {
    if (!doc.url) {
      console.error('Document URL is missing');
      return;
    }

    try {
      const filePath = this.extractFilePath(doc.url, bucketName);
      let downloadUrl = doc.url;

      if (filePath) {
        // Generar signed URL para acceso temporal
        const signedUrl = await this.getSignedUrl(bucketName, filePath, 60);
        if (signedUrl) {
          downloadUrl = signedUrl;
        }
      }

      // Fetch del archivo
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error('Error al obtener el archivo');

      // Crear blob y trigger de descarga
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.nome || 'documento';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();

      // Cleanup con timeout para asegurar que la descarga inicie
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (error) {
      console.error('Error downloading document:', error);
      throw new Error('Erro ao baixar documento. Tente novamente.');
    }
  }

  /**
   * Upload de archivo a Supabase Storage
   * 
   * @param bucketName - Nombre del bucket
   * @param file - Archivo a subir
   * @param entityId - ID de la entidad (cliente/proceso/usuario)
   * @returns Path del archivo subido o null si hay error
   */
  static async uploadFile(
    bucketName: string,
    file: File,
    entityId: string
  ): Promise<string | null> {
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `${entityId}/${fileName}`;

      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (error) throw error;

      // Retornar public URL como referencia (contiene el path)
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  /**
   * Elimina un archivo de Supabase Storage
   * 
   * @param bucketName - Nombre del bucket
   * @param url - URL del documento a eliminar
   * @returns true si se eliminó exitosamente, false si hubo error
   */
  static async deleteFile(bucketName: string, url: string): Promise<boolean> {
    try {
      const filePath = this.extractFilePath(url, bucketName);
      if (!filePath) {
        console.error('Could not extract file path from URL');
        return false;
      }

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  /**
   * Sube una foto de perfil de usuario
   * - Validaciones: tipo (JPG, PNG, WEBP) y tamaño (5MB)
   * - Elimina foto anterior si existe
   * - Retorna URL pública de la nueva foto
   * 
   * @param userId - ID del usuario (usado para organizar en carpetas)
   * @param file - Archivo de imagen
   * @param oldPhotoUrl - URL de la foto anterior (opcional, para eliminar)
   * @returns Public URL de la foto subida o null si hay error
   */
  static async uploadProfilePhoto(
    userId: string,
    file: File,
    oldPhotoUrl?: string
  ): Promise<string | null> {
    try {
      // Validar tamaño (5MB máximo)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('A foto é muito grande. Tamanho máximo: 5MB');
      }

      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Tipo de arquivo não permitido. Use: JPG, PNG ou WEBP');
      }

      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `${userId}/${fileName}`;

      // Eliminar foto anterior si existe
      if (oldPhotoUrl) {
        await this.deleteProfilePhoto(oldPhotoUrl);
      }

      // Subir nueva foto
      const { error: uploadError } = await supabase.storage
        .from('foto_perfil')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('foto_perfil')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      throw error;
    }
  }

  /**
   * Elimina una foto de perfil anterior
   * - Extrae el filePath de la URL
   * - Elimina el archivo del bucket foto_perfil
   * 
   * @param url - URL de la foto a eliminar
   * @returns true si se eliminó exitosamente, false si hubo error
   */
  static async deleteProfilePhoto(url: string): Promise<boolean> {
    try {
      const urlParts = url.split('/foto_perfil/');
      if (urlParts.length < 2) {
        console.error('Invalid profile photo URL format');
        return false;
      }

      const filePath = urlParts[1];

      const { error } = await supabase.storage
        .from('foto_perfil')
        .remove([filePath]);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      return false;
    }
  }
}
