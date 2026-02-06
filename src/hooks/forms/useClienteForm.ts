/**
 * Hook para gestión de formulario de Clientes
 * Centraliza toda la lógica de negocio: CRUD, estados, handlers, permisos
 */

import { useState, useEffect } from 'react'
import { useClientes } from '../data-access/useClientes'
import { useNotification } from '../../components/shared/notifications/useNotification'
import { useInlineNotification } from '../ui/useInlineNotification'
import { useModalState } from '../ui/useModalState'
import { useUnsavedChanges } from './useUnsavedChanges'
import { usePermissions } from '../auth/usePermissions'
import { Cliente, ClienteFormData } from '../../types/cliente'
import { CONFIRMATION_MESSAGES, SUCCESS_MESSAGES, PERMISSION_MESSAGES, ERROR_MESSAGES } from '../../config/messages'
import { formatFormData } from '../../utils/fieldFormatters'

// Formulario vacío con todos los campos inicializados como strings vacíos
// Esto previene warnings de React sobre inputs controlados (null/undefined)
const EMPTY_CLIENTE_FORM: ClienteFormData = {
  nome_completo: '',
  cpf_cnpj: '',
  rg: '',
  data_nascimento: '',
  nacionalidade: '',
  estado_civil: undefined,
  profissao: '',
  email: '',
  telefone: '',
  celular: '',
  telefone_alternativo: '',
  cep: '',
  endereco: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  pais: 'Brasil',
  observacoes: '',
  como_conheceu: '',
  indicado_por: '',
  status: 'ativo',
  categoria: '',
  documentos_cliente: [],
  ultimo_contato: '',
};

export const useClienteForm = () => {
  const { clientes, loading: isLoading, createCliente, updateCliente, deleteCliente } = useClientes({
    enablePolling: true,
    pollingInterval: 30000,
  })
  const { notification, error: errorNotif, success, hide } = useInlineNotification()
  const { success: successToast, warning, confirm: confirmDialog } = useNotification()
  
  // Modales con useModalState
  const viewModal = useModalState<Cliente>()
  const formModal = useModalState<Cliente>()

  // Permisos centralizados
  const { isAdmin, isAdvogado, isAssistente, canEdit, canDelete } = usePermissions()

  // Datos iniciales para detectar cambios - usar EMPTY_CLIENTE_FORM como base
  const initialData = formModal.item ? {
    ...EMPTY_CLIENTE_FORM,
    ...formModal.item,
    // Asegurar que campos opcionales sean strings vacíos en lugar de null/undefined
    cpf_cnpj: formModal.item.cpf_cnpj || '',
    rg: formModal.item.rg || '',
    data_nascimento: formModal.item.data_nascimento || '',
    profissao: formModal.item.profissao || '',
    nacionalidade: formModal.item.nacionalidade || '',
    email: formModal.item.email || '',
    telefone: formModal.item.telefone || '',
    telefone_alternativo: formModal.item.telefone_alternativo || '',
    cep: formModal.item.cep || '',
    endereco: formModal.item.endereco || '',
    numero: formModal.item.numero || '',
    complemento: formModal.item.complemento || '',
    bairro: formModal.item.bairro || '',
    cidade: formModal.item.cidade || '',
    estado: formModal.item.estado || '',
    pais: formModal.item.pais || 'Brasil',
    categoria: formModal.item.categoria || '',
    como_conheceu: formModal.item.como_conheceu || '',
    indicado_por: formModal.item.indicado_por || '',
    observacoes: formModal.item.observacoes || '',
    ultimo_contato: formModal.item.ultimo_contato || '',
    documentos_cliente: formModal.item.documentos_cliente || []
  } as ClienteFormData : EMPTY_CLIENTE_FORM;

  const [formData, setFormData] = useState<ClienteFormData>(initialData)

  // Hook para detectar cambios no guardados
  const { hasChanges, updateCurrent, resetInitial } = useUnsavedChanges(initialData)

  // Sincronizar con modal state
  useEffect(() => {
    if (formModal.item) {
      const data = {
        ...EMPTY_CLIENTE_FORM,
        ...formModal.item,
        // Garantizar que todos los campos sean strings (nunca null/undefined)
        cpf_cnpj: formModal.item.cpf_cnpj || '',
        rg: formModal.item.rg || '',
        data_nascimento: formModal.item.data_nascimento || '',
        profissao: formModal.item.profissao || '',
        nacionalidade: formModal.item.nacionalidade || '',
        email: formModal.item.email || '',
        telefone: formModal.item.telefone || '',
        telefone_alternativo: formModal.item.telefone_alternativo || '',
        cep: formModal.item.cep || '',
        endereco: formModal.item.endereco || '',
        numero: formModal.item.numero || '',
        complemento: formModal.item.complemento || '',
        bairro: formModal.item.bairro || '',
        cidade: formModal.item.cidade || '',
        estado: formModal.item.estado || '',
        categoria: formModal.item.categoria || '',
        como_conheceu: formModal.item.como_conheceu || '',
        indicado_por: formModal.item.indicado_por || '',
        observacoes: formModal.item.observacoes || '',
        ultimo_contato: formModal.item.ultimo_contato || '',
      } as ClienteFormData
      setFormData(data)
      resetInitial(data)
    } else {
      setFormData(EMPTY_CLIENTE_FORM)
      resetInitial(EMPTY_CLIENTE_FORM)
    }
  }, [formModal.item, formModal.isOpen, resetInitial])

  // Handler para actualizar formData y detectar cambios
  // Aplica formateo en tiempo real mientras el usuario digita
  const handleFormChange = (newData: ClienteFormData) => {
    const formattedData = formatFormData(newData as unknown as Record<string, unknown>) as unknown as ClienteFormData
    setFormData(formattedData)
    updateCurrent(formattedData)
  }

  // Criar ou atualizar cliente
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Verificar permisos
    if (!canEdit) {
      warning(PERMISSION_MESSAGES.NO_PERMISSION)
      return null
    }
    
    // Validación básica de CPF/CNPJ duplicado (solo al crear y solo si NO está vacío)
    if (!formModal.item?.id && formData.cpf_cnpj && formData.cpf_cnpj.trim() !== '') {
      const cpfCnpjExistente = clientes.find(
        c => c.cpf_cnpj?.toUpperCase() === formData.cpf_cnpj?.toUpperCase()
      )
      if (cpfCnpjExistente) {
        errorNotif(`CPF/CNPJ já cadastrado para o cliente: ${cpfCnpjExistente.nome_completo}`)
        return null
      }
    }
    
    // Validación de CPF/CNPJ duplicado al editar (verificar si cambió y NO está vacío)
    if (formModal.item?.id && formData.cpf_cnpj && formData.cpf_cnpj.trim() !== '') {
      const cpfCnpjExistente = clientes.find(
        c => c.id !== formModal.item?.id && 
             c.cpf_cnpj?.toUpperCase() === formData.cpf_cnpj?.toUpperCase()
      )
      if (cpfCnpjExistente) {
        errorNotif(`CPF/CNPJ já cadastrado para o cliente: ${cpfCnpjExistente.nome_completo}`)
        return null
      }
    }
    
    try {
      let resultado
      if (formModal.item?.id) {
        // Preparar dados para atualização
        const updates: Partial<Cliente> = { ...formData }
        
        // Solo admin puede cambiar status
        if (!isAdmin) {
          delete updates.status
        }
        
        // Formatear campos antes de enviar
        const formattedUpdates = formatFormData(updates)
        
        // Atualizar usando hook centralizado
        resultado = await updateCliente(formModal.item.id, formattedUpdates)
        if (resultado.error) throw new Error(resultado.error)
      } else {
        // Formatear campos antes de enviar
        const formattedData = formatFormData(formData as unknown as Record<string, unknown>) as unknown as typeof formData
        
        // Criar usando hook centralizado
        resultado = await createCliente(formattedData as Parameters<typeof createCliente>[0])
        if (resultado.error) throw new Error(resultado.error)
      }

      // Marcar como guardado
      resetInitial(formData)
      handleCloseModal()
      
      // Mostrar éxito como toast global (fuera del modal)
      successToast(formModal.item?.id ? SUCCESS_MESSAGES.clientes.UPDATED : SUCCESS_MESSAGES.clientes.CREATED)
      
      // Retornar el cliente creado/actualizado
      return resultado
    } catch (error: unknown) {
      console.error('Erro ao salvar cliente:', error)
      
      // Detectar errores específicos de PostgreSQL
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      if (errorMessage.includes('duplicate key') && errorMessage.includes('cpf_cnpj')) {
        errorNotif('CPF/CNPJ já cadastrado. Este documento já existe no sistema.')
      } else if (errorMessage.includes('duplicate key') && errorMessage.includes('email')) {
        errorNotif('E-mail já cadastrado. Este e-mail já existe no sistema.')
      } else if (errorMessage.includes('check constraint') && errorMessage.includes('estado_civil')) {
        errorNotif('Estado civil inválido. Selecione uma opção válida.')
      } else if (errorMessage.includes('invalid input syntax for type timestamp')) {
        errorNotif('Data inválida. Verifique o formato da data.')
      } else {
        // Mensaje genérico para otros errores
        errorNotif(ERROR_MESSAGES.clientes.SAVE_ERROR)
      }
      
      // No cerrar el modal para que el usuario vea el error
      return null
    }
  }

  // Deletar cliente
  const handleDelete = async (id: string) => {
    // Verificar permisos
    if (!canDelete) {
      warning(PERMISSION_MESSAGES.ADMIN_ONLY_DELETE)
      return
    }
    
    const confirmed = await confirmDialog({
      title: CONFIRMATION_MESSAGES.clientes.DELETE_TITLE,
      message: CONFIRMATION_MESSAGES.clientes.DELETE,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    })

    if (!confirmed) return

    try {
      const { error } = await deleteCliente(id)
      if (error) throw new Error(error)
      
      // Mostrar éxito como toast global
      successToast(SUCCESS_MESSAGES.clientes.DELETED)
    } catch (error: unknown) {
      console.error('Erro ao deletar cliente:', error)
      // Mensaje amigable al usuario, el error técnico queda en la consola
      errorNotif(ERROR_MESSAGES.clientes.DELETE_ERROR)
    }
  }

  // Abrir modal para editar
  const handleEdit = (cliente: Cliente) => {
    formModal.openEdit(cliente)
    // No need to call setFormData here, useEffect will handle it
  }

  // Abrir modal para criar
  const handleCreate = () => {
    formModal.openCreate()
    setFormData({
      nome_completo: '',
      celular: '',
      status: 'ativo',
      pais: 'Brasil',
      documentos_cliente: []
    } as ClienteFormData)
  }

  // Abrir modal para visualizar
  const handleView = (cliente: Cliente) => {
    viewModal.openView(cliente)
  }

  // Fechar modal de visualização
  const handleCloseViewModal = () => {
    viewModal.close()
  }

  // Fechar modal de formulário
  const handleCloseModal = () => {
    hide()
    formModal.close()
  }

  return {
    // Estados
    clientes,
    isLoading,
    showModal: formModal.isOpen,
    viewingCliente: viewModal.item,
    editingCliente: formModal.item,
    formData,
    handleFormChange,
    hasChanges,
    
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
