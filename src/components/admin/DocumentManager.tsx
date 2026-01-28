import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Upload, Download, Trash2, Eye, FileText, Loader2 } from 'lucide-react'
import { StorageService } from '../../services/storageService'
import AccessibleButton from '../shared/buttons/AccessibleButton'
import { useInlineNotification } from '../../hooks/ui/useInlineNotification'
import { InlineNotification } from '../shared/notifications/InlineNotification'
import { useNotification } from '../shared/notifications/NotificationContext'

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
  readOnly = false
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
      warning(`O arquivo é muito grande. Tamanho máximo: ${maxSize}MB`)
      return
    }

    // Validar tipo
    if (!allowedTypes.includes(file.type)) {
      warning('Tipo de arquivo não permitido. Use: PDF, DOC, DOCX, JPG, PNG')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Usar ID temporal si no hay entityId
      const targetId = entityId || `temp-${Date.now()}`

      // Upload usando StorageService
      const publicUrl = await StorageService.uploadFile(bucketName, file, targetId)

      if (!publicUrl) {
        throw new Error('Erro ao fazer upload do arquivo')
      }

      // Crear objeto documento
      const newDoc: DocumentItem = {
        nome: file.name,
        url: publicUrl, // Guardamos la URL pública como referencia (contiene el path)
        tipo: file.type,
        tamanho: file.size,
        data_upload: new Date().toISOString()
      }

      // Agregar a la lista
      onDocumentsChange([...documents, newDoc])

      setUploadProgress(100)
      success('Documento enviado com sucesso!')
      
      // Reset input
      e.target.value = ''
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      errorNotif('Erro ao enviar documento. Tente novamente.')
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
      alert('Erro ao visualizar documento. Verifique as permissões no Supabase Storage.')
    }
  }

  const handleDownloadDocument = async (doc: DocumentItem) => {
    try {
      await StorageService.downloadDocument(doc, bucketName)
      success('Download iniciado com sucesso!')
    } catch (error) {
      console.error('Erro ao baixar documento:', error)
      errorNotif('Erro ao baixar documento. Tente novamente.')
    }
  }

  const handleDeleteDocument = async (doc: DocumentItem, index: number) => {
    const confirmed = await confirmDialog({
      title: 'Excluir Documento',
      message: `Deseja realmente remover o documento "${doc.nome}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
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
      
      success('Documento removido com sucesso!')
    } catch (error) {
      console.error('Erro ao remover documento:', error)
      errorNotif('Erro ao remover documento. Tente novamente.')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (tipo: string) => {
    if (tipo.includes('pdf')) return <FileText className="text-red-500" size={24} />
    if (tipo.includes('image')) return <FileText className="text-blue-500" size={24} />
    return <FileText className="text-gray-500" size={24} />
  }

  return (
    <div className="space-y-4">
      {/* Notificación inline */}
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
      
      {/* Upload Button */}
      {showUploadButton && !readOnly && (
        <div>
          <input
            type="file"
            id={`file-upload-${bucketName}`}
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            accept={allowedTypes.join(',')}
          />
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
              {uploading ? 'Enviando...' : uploadLabel}
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
                    {formatFileSize(doc.tamanho)} • {new Date(doc.data_upload).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <AccessibleButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewDocument(doc)}
                  aria-label={`Visualizar ${doc.nome}`}
                  className="!p-2"
                >
                  <Eye size={16} />
                </AccessibleButton>
                
                <AccessibleButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadDocument(doc)}
                  aria-label={`Baixar ${doc.nome}`}
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
                    aria-label={`Remover ${doc.nome}`}
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
          <p className="text-sm text-gray-600">Nenhum documento anexado</p>
        </div>
      )}
    </div>
  )
}
