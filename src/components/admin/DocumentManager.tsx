import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Upload, Download, Trash2, Eye, FileText, Loader2 } from 'lucide-react'
import { StorageService } from '../../services/storageService'
import AccessibleButton from '../shared/buttons/AccessibleButton'
import { useInlineNotification } from '../../hooks/ui/useInlineNotification'
import { InlineNotification } from '../shared/notifications/InlineNotification'
import { useNotification } from '../shared/notifications/useNotification'
import { formatShortDate } from '../../utils/dateUtils'
import { ADMIN_UI } from '../../config/messages'
import { formatFileSize, getFileIcon } from '../../utils/fileHelpers'

export interface DocumentItem {
  nome: string
  url: string
  tipo: string
  tamanho: number
  data_upload: string
}

interface DocumentManagerProps {
  documents: DocumentItem[]
  onDocumentsChange: (docs: DocumentItem[]) => void
  bucketName: string
  entityId?: string
  maxSize?: number // en MB
  allowedTypes?: string[]
  uploadLabel?: string
  showUploadButton?: boolean
  readOnly?: boolean
  onNotification?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  onDocumentsChange,
  bucketName,
  entityId,
  maxSize = 50,
  allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg'
  ],
  uploadLabel = 'Adicionar Documento',
  showUploadButton = true,
  readOnly = false,
  onNotification
}) => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { notification, warning, error: errorNotif, success, hide } = useInlineNotification()
  const { confirm: confirmDialog } = useNotification()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamanho
    const maxSizeBytes = maxSize * 1024 * 1024
    if (file.size > maxSizeBytes) {
      const errorMsg = ADMIN_UI.DOCUMENT.ERROR_FILE_TOO_LARGE.replace('{maxSize}', maxSize.toString())
      
      if (onNotification) {
        onNotification(errorMsg, 'warning')
      } else {
        warning(errorMsg)
      }
      return
    }

    // Validar tipo
    if (!allowedTypes.includes(file.type)) {
      const errorMsg = ADMIN_UI.DOCUMENT.ERROR_FILE_TYPE
      
      if (onNotification) {
        onNotification(errorMsg, 'warning')
      } else {
        warning(errorMsg)
      }
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Usar ID temporal si no hay entityId
      const targetId = entityId || `temp-${Date.now()}`

      // Upload usando StorageService (retorna filePath para buckets privados)
      const filePath = await StorageService.uploadFile(bucketName, file, targetId)

      if (!filePath) {
        throw new Error(ADMIN_UI.DOCUMENT.ERROR_UPLOAD)
      }

      // Crear objeto documento - guardamos filePath para buckets privados
      const newDoc: DocumentItem = {
        nome: file.name,
        url: filePath, // Para buckets privados, guardamos el path (no URL pública)
        tipo: file.type,
        tamanho: file.size,
        data_upload: new Date().toISOString()
      }

      // Agregar a la lista
      onDocumentsChange([...documents, newDoc])

      setUploadProgress(100)
      
      // NO mostrar mensaje de éxito para evitar confusión - usuario debe guardar el formulario
      
      // Reset input
      e.target.value = ''
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      
      if (onNotification) {
        onNotification(ADMIN_UI.DOCUMENT.ERROR_SEND || 'Erro ao enviar documento', 'error')
      } else {
        errorNotif(ADMIN_UI.DOCUMENT.ERROR_SEND)
      }
    } finally {
      setUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const handleViewDocument = async (doc: DocumentItem) => {
    try {
      await StorageService.viewDocument(doc, bucketName)
    } catch (error) {
      console.error('Erro ao visualizar documento:', error)
      alert(ADMIN_UI.DOCUMENT.ERROR_VIEW)
    }
  }

  const handleDownloadDocument = async (doc: DocumentItem) => {
    try {
      await StorageService.downloadDocument(doc, bucketName)
      
      if (onNotification) {
        onNotification(ADMIN_UI.DOCUMENT.SUCCESS_DOWNLOAD || 'Documento baixado com sucesso', 'success')
      } else {
        success(ADMIN_UI.DOCUMENT.SUCCESS_DOWNLOAD)
      }
    } catch (error) {
      console.error('Erro ao baixar documento:', error)
      
      if (onNotification) {
        onNotification(ADMIN_UI.DOCUMENT.ERROR_DOWNLOAD || 'Erro ao baixar documento', 'error')
      } else {
        errorNotif(ADMIN_UI.DOCUMENT.ERROR_DOWNLOAD)
      }
    }
  }

  const handleDeleteDocument = async (doc: DocumentItem, index: number) => {
    const confirmed = await confirmDialog({
      title: ADMIN_UI.DOCUMENT.DELETE_TITLE,
      message: ADMIN_UI.DOCUMENT.DELETE_MESSAGE.replace('{name}', doc.nome),
      confirmText: ADMIN_UI.DOCUMENT.DELETE_CONFIRM,
      cancelText: ADMIN_UI.DOCUMENT.DELETE_CANCEL,
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      const deleted = await StorageService.deleteFile(bucketName, doc.url)
      
      if (!deleted) {
        throw new Error('Falha ao deletar arquivo do Storage')
      }

      const newDocs = documents.filter((_, i) => i !== index)
      onDocumentsChange(newDocs)
      
      if (onNotification) {
        onNotification(ADMIN_UI.DOCUMENT.SUCCESS_DELETE || 'Documento removido com sucesso', 'success')
      } else {
        success(ADMIN_UI.DOCUMENT.SUCCESS_DELETE)
      }
    } catch (error) {
      console.error('Erro ao remover documento:', error)
      
      if (onNotification) {
        onNotification(ADMIN_UI.DOCUMENT.ERROR_DELETE || 'Erro ao remover documento', 'error')
      } else {
        errorNotif(ADMIN_UI.DOCUMENT.ERROR_DELETE)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Notificación inline - solo mostrar si NO hay callback onNotification (modo standalone) */}
      {!onNotification && (
        <AnimatePresence mode="wait">
          {notification.show && (
            <InlineNotification
              type={notification.type}
              message={notification.message}
              onClose={hide}
              className="mb-2"
            />
          )}
        </AnimatePresence>
      )}
      
      {/* Input siempre renderizado (oculto) para acceso externo */}
      {!readOnly && (
        <input
          type="file"
          id={`file-upload-${bucketName}`}
          onChange={handleFileUpload}
          disabled={uploading}
          className="hidden"
          accept={allowedTypes.join(',')}
        />
      )}
      
      {/* Upload Button - solo si showUploadButton=true */}
      {showUploadButton && !readOnly && (
        <div>
          <label htmlFor={`file-upload-${bucketName}`} className="cursor-pointer inline-block">
            <AccessibleButton
              type="button"
              variant="outline"
              size="sm"
              leftIcon={uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              disabled={uploading}
              aria-label={uploadLabel}
              className="w-full sm:w-auto pointer-events-none"
            >
              {uploading ? ADMIN_UI.DOCUMENT.UPLOADING : uploadLabel}
            </AccessibleButton>
          </label>
          
          {uploading && uploadProgress > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">{uploadProgress}%</p>
            </div>
          )}
        </div>
      )}

      {/* Documents List */}
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {documents.map((doc, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {getFileIcon(doc.tipo)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.nome}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(doc.tamanho)} • {formatShortDate(doc.data_upload)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <AccessibleButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDocument(doc)}
                  aria-label={ADMIN_UI.DOCUMENT.VIEW_ARIA.replace('{name}', doc.nome)}
                  className="!p-2"
                >
                  <Eye size={16} />
                </AccessibleButton>
                
                <AccessibleButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadDocument(doc)}
                  aria-label={ADMIN_UI.DOCUMENT.DOWNLOAD_ARIA.replace('{name}', doc.nome)}
                  className="!p-2"
                >
                  <Download size={16} />
                </AccessibleButton>
                
                {!readOnly && (
                  <AccessibleButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDocument(doc, index)}
                    aria-label={ADMIN_UI.DOCUMENT.DELETE_ARIA.replace('{name}', doc.nome)}
                    className="!p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </AccessibleButton>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
          <FileText className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-sm text-gray-600">{ADMIN_UI.DOCUMENT.EMPTY_TEXT}</p>
        </div>
      )}
    </div>
  )
}
