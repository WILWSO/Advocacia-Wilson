/**
 * Hook centralizado para operações CRUD (SSoT para modal states e handlers)
 * 
 * Elimina duplicação de estados de modais e handlers em páginas administrativas.
 * Padroniza padrões Create, Read, Update, Delete com confirmações automáticas.
 * 
 * @example
 * const crud = useCrudOperations<Cliente>({
 *   entityName: 'cliente',
 *   onDelete: async (cliente) => await deleteCliente(cliente.id),
 *   confirmDelete: true
 * })
 * 
 * // Estados
 * const { viewModal, formModal, isDeleting } = crud
 * 
 * // Handlers
 * const { handleCreate, handleEdit, handleView, handleDelete } = crud
 */

import { useState, useCallback } from 'react'
import { useNotification } from '../../components/shared/notifications/useNotification'
import { CONFIRMATION_MESSAGES } from '../../config/messages'

export interface ModalState<T> {
  isOpen: boolean
  item: T | null
  mode: 'create' | 'edit' | 'view' | null
}

interface UseCrudOperationsOptions<T> {
  entityName?: string          // Nome da entidade para mensagens (ex: 'cliente', 'processo')
  onDelete?: (item: T) => Promise<void>   // Função de delete customizada
  onAfterDelete?: () => void              // Callback após delete bem sucedido
  confirmDelete?: boolean                 // Mostrar confirmação antes de deletar (default: true)
  deleteMessage?: string                  // Mensagem customizada de confirmação
  successMessages?: {                     // Mensagens customizadas de sucesso
    delete?: string
  }
  errorMessages?: {                       // Mensagens customizadas de erro
    delete?: string
  }
}

interface UseCrudOperationsReturn<T> {
  // Estados dos modais
  viewModal: ModalState<T>
  formModal: ModalState<T>
  
  // Estados de loading
  isDeleting: boolean
  
  // Handlers para operações
  handleCreate: () => void
  handleEdit: (item: T) => void
  handleView: (item: T) => void
  handleDelete: (item: T) => Promise<void>
  
  // Controles de modal
  closeViewModal: () => void
  closeFormModal: () => void
  closeAllModals: () => void
  
  // Estados computed
  hasOpenModal: boolean
  isFormOpen: boolean
  isViewOpen: boolean
}

const INITIAL_MODAL_STATE = <T,>(): ModalState<T> => ({
  isOpen: false,
  item: null,
  mode: null
})

export function useCrudOperations<T>(
  options: UseCrudOperationsOptions<T> = {}
): UseCrudOperationsReturn<T> {
  const {
    entityName = 'item',
    onDelete,
    onAfterDelete,
    confirmDelete = true,
    deleteMessage,
    successMessages = {},
    errorMessages = {}
  } = options

  // Estados dos modais
  const [viewModal, setViewModal] = useState<ModalState<T>>(INITIAL_MODAL_STATE)
  const [formModal, setFormModal] = useState<ModalState<T>>(INITIAL_MODAL_STATE)
  const [isDeleting, setIsDeleting] = useState(false)

  // Hook de notificações
  const { showNotification } = useNotification()

  // Handlers para abrir modais
  const handleCreate = useCallback(() => {
    setFormModal({
      isOpen: true,
      item: null,
      mode: 'create'
    })
  }, [])

  const handleEdit = useCallback((item: T) => {
    setFormModal({
      isOpen: true,
      item,
      mode: 'edit'
    })
  }, [])

  const handleView = useCallback((item: T) => {
    setViewModal({
      isOpen: true,
      item,
      mode: 'view'
    })
  }, [])

  // Handler para delete com confirmação
  const handleDelete = useCallback(async (item: T) => {
    if (!onDelete) {
      console.warn('useCrudOperations: onDelete não foi fornecido')
      return
    }

    try {
      // Confirmación (se habilitada)
      if (confirmDelete && showNotification) {
        const message = deleteMessage || CONFIRMATION_MESSAGES.DELETE.replace('{item}', entityName)
        const confirmed = window.confirm(message)
        if (!confirmed) return
      }

      setIsDeleting(true)
      
      // Executar delete
      await onDelete(item)
      
      // Feedback de sucesso
      const successMsg = successMessages.delete || `${entityName} excluído com sucesso!`
      if (showNotification) {
        showNotification({
          type: 'success',
          message: successMsg
        })
      }
      
      // Callback pós-delete
      if (onAfterDelete) {
        onAfterDelete()
      }

    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      const finalErrorMsg = errorMessages.delete || `Erro ao excluir ${entityName}: ${errorMsg}`
      
      console.error(`Erro ao excluir ${entityName}:`, error)
      
      if (showNotification) {
        showNotification({
          type: 'error',
          message: finalErrorMsg
        })
      }
    } finally {
      setIsDeleting(false)
    }
  }, [
    onDelete, 
    confirmDelete, 
    deleteMessage, 
    entityName, 
    showNotification, 
    successMessages.delete, 
    errorMessages.delete, 
    onAfterDelete
  ])

  // Controles para fechar modais
  const closeViewModal = useCallback(() => {
    setViewModal(INITIAL_MODAL_STATE)
  }, [])

  const closeFormModal = useCallback(() => {
    setFormModal(INITIAL_MODAL_STATE)
  }, [])

  const closeAllModals = useCallback(() => {
    setViewModal(INITIAL_MODAL_STATE)
    setFormModal(INITIAL_MODAL_STATE)
  }, [])

  // Estados computed
  const hasOpenModal = viewModal.isOpen || formModal.isOpen
  const isFormOpen = formModal.isOpen
  const isViewOpen = viewModal.isOpen

  return {
    // Estados dos modais
    viewModal,
    formModal,
    
    // Estados de loading
    isDeleting,
    
    // Handlers para operações
    handleCreate,
    handleEdit,
    handleView,
    handleDelete,
    
    // Controles de modal
    closeViewModal,
    closeFormModal,
    closeAllModals,
    
    // Estados computed
    hasOpenModal,
    isFormOpen,
    isViewOpen
  }
}

// Hook especializado para operações CRUD com estados extras (como changePassword para usuários)
export function useExtendedCrudOperations<T>(
  options: UseCrudOperationsOptions<T> = {}
) {
  const baseCrud = useCrudOperations(options)
  
  // Estados extras que alguns CRUDs precisam
  const [extraModal, setExtraModal] = useState<ModalState<T>>(INITIAL_MODAL_STATE)
  
  const handleExtraAction = useCallback((item: T, actionType: string = 'extra') => {
    setExtraModal({
      isOpen: true,
      item,
      mode: actionType as 'create' | 'edit' | 'view'
    })
  }, [])
  
  const closeExtraModal = useCallback(() => {
    setExtraModal(INITIAL_MODAL_STATE)
  }, [])
  
  const closeAllModals = useCallback(() => {
    baseCrud.closeAllModals()
    closeExtraModal()
  }, [baseCrud, closeExtraModal])

  return {
    ...baseCrud,
    
    // Estados extras
    extraModal,
    
    // Handlers extras
    handleExtraAction,
    closeExtraModal,
    
    // Override do closeAllModals
    closeAllModals,
    
    // Estados computed atualizados
    hasOpenModal: baseCrud.hasOpenModal || extraModal.isOpen
  }
}