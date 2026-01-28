/**
 * Hook para gestión de formulario de Clientes
 * Centraliza toda la lógica de negocio: CRUD, estados, handlers, permisos
 */

import { useState } from 'react'
import { useAuthLogin as useAuth } from '../../components/auth/useAuthLogin'
import { useClientes } from '../data-access/useClientes'
import { useNotification } from '../../components/shared/notifications/NotificationContext'
import { useInlineNotification } from '../ui/useInlineNotification'
import { Cliente, ClienteFormData } from '../../types/cliente'

export const useClienteForm = () => {
  const { user: currentUser } = useAuth()
  const { clientes, loading: isLoading, createCliente, updateCliente, deleteCliente } = useClientes()
  const { notification, error: errorNotif, success, hide } = useInlineNotification()
  const { success: successToast, warning, confirm: confirmDialog } = useNotification()

  // Permisos
  const isAdmin = currentUser?.role === 'admin'
  const isAdvogado = currentUser?.role === 'advogado'
  const isAssistente = currentUser?.role === 'assistente'
  const canEdit = isAdmin || isAdvogado || isAssistente
  const canDelete = isAdmin

  // Estados
  const [showModal, setShowModal] = useState(false)
  const [viewingCliente, setViewingCliente] = useState<Cliente | null>(null)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState<ClienteFormData>({
    nome_completo: '',
    celular: '',
    status: 'ativo',
    pais: 'Brasil',
    documentos_cliente: []
  })

  // Criar ou atualizar cliente
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Verificar permisos
    if (!canEdit) {
      warning('Você não tem permissão para editar clientes')
      return
    }
    
    try {
      if (editingCliente?.id) {
        // Preparar dados para atualização
        const updates: Partial<Cliente> = { ...formData }
        
        // Solo admin puede cambiar status
        if (!isAdmin) {
          delete updates.status
        }
        
        // Atualizar usando hook centralizado
        const { error } = await updateCliente(editingCliente.id, updates)
        if (error) throw new Error(error)
      } else {
        // Criar usando hook centralizado
        const { error } = await createCliente(formData)
        if (error) throw new Error(error)
      }

      handleCloseModal()
      
      // Mostrar éxito como toast global (fuera del modal)
      successToast('Cliente salvo com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error)
      // Mensaje amigable al usuario, el error técnico queda en la consola
      errorNotif('Erro ao salvar cliente')
      // No cerrar el modal para que el usuario vea el error
    }
  }

  // Deletar cliente
  const handleDelete = async (id: string) => {
    // Verificar permisos
    if (!canDelete) {
      warning('Apenas administradores podem excluir clientes')
      return
    }
    
    const confirmed = await confirmDialog({
      title: 'Excluir Cliente',
      message: 'Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    })

    if (!confirmed) return

    try {
      const { error } = await deleteCliente(id)
      if (error) throw new Error(error)
      
      // Mostrar éxito como toast global
      successToast('Cliente excluído com sucesso!')
    } catch (error: any) {
      console.error('Erro ao deletar cliente:', error)
      // Mensaje amigable al usuario, el error técnico queda en la consola
      errorNotif('Erro ao deletar cliente')
    }
  }

  // Abrir modal para editar
  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setFormData(cliente)
    setShowModal(true)
  }

  // Abrir modal para criar
  const handleCreate = () => {
    setEditingCliente(null)
    setFormData({
      nome_completo: '',
      celular: '',
      status: 'ativo',
      pais: 'Brasil',
      documentos_cliente: []
    })
    setShowModal(true)
  }

  // Abrir modal para visualizar
  const handleView = (cliente: Cliente) => {
    setViewingCliente(cliente)
  }

  // Fechar modal de visualização
  const handleCloseViewModal = () => {
    setViewingCliente(null)
  }

  // Fechar modal de formulário
  const handleCloseModal = () => {
    hide() // Limpiar notificaciones al cerrar modal
    setShowModal(false)
    setEditingCliente(null)
  }

  return {
    // Estados
    clientes,
    isLoading,
    showModal,
    viewingCliente,
    editingCliente,
    formData,
    setFormData,
    
    // Handlers
    handleSave,
    handleDelete,
    handleEdit,
    handleCreate,
    handleView,
    handleCloseModal,
    handleCloseViewModal,
    
    // Permisos
    isAdmin,
    isAdvogado,
    isAssistente,
    canEdit,
    canDelete,
    
    // Notificaciones
    notification,
    errorNotif,
    success,
    hide
  }
}
