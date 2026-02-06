/**
 * Hook personalizado para gestión del formulario de procesos
 * Centraliza la lógica de estado, validación y operaciones CRUD
 */

import { useState, useEffect, useCallback } from 'react'
import { useUnsavedChanges } from './useUnsavedChanges'
import { useClientes } from '../data-access/useClientes'
import { usePermissions } from '../auth/usePermissions'
import { formatFieldValue } from '../../utils/fieldFormatters'
import { 
  ProcessoJuridico, 
  ProcessoFormData, 
  ProcessoWithRelations,
  NewClienteForm,
  ProcessoLink,
  Jurisprudencia
} from '../../types/processo'
import { ClienteSimple } from '../../types/cliente'
import { useCrudArray } from '../utils/useCrudArray'
import { useInlineNotification } from '../ui/useInlineNotification'
import { useNotification } from '../../components/shared/notifications/useNotification'
import { useAuthLogin as useAuth } from '../../components/auth/useAuthLogin'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../config/messages'
import { FormValidator } from '../../utils/FormValidator'
import { formatFormData } from '../../utils/fieldFormatters'


interface UseProcessoFormOptions {
  onSuccess?: () => void
  createProcesso: (data: Omit<ProcessoJuridico, 'id'>) => Promise<{ error: any }>
  updateProcesso: (id: string, data: Partial<ProcessoJuridico>) => Promise<{ error: any }>
  processos?: ProcessoWithRelations[] // Para validar numero_processo único
}

const initialFormData: ProcessoFormData = {
  titulo: '',
  descricao: '',
  advogado_responsavel: '',
  cliente_id: '',
  polo: '',
  cliente_email: '',
  cliente_telefone: '',
  numero_processo: '',
  status: 'em_aberto',
  area_direito: '',
  prioridade: 'media',
  valor_causa: '',
  atividade_pendente: '',
  competencia: '',
  jurisdicao: {
    uf: '',
    municipio: '',
    vara: '',
    juiz: ''
  },
  honorarios: {
    valor_honorarios: '',
    detalhes: ''
  },
  documentos_processo: [],
  links_processo: [],
  jurisprudencia: []
}

export function useProcessoForm({ onSuccess, createProcesso, updateProcesso, processos = [] }: UseProcessoFormOptions) {
  const { user } = useAuth()
  const { notification, success, warning, error: errorNotif, hide } = useInlineNotification()
  const { success: successToast } = useNotification()

  // Estados principales
  const [formData, setFormData] = useState<ProcessoFormData>(initialFormData)
  const [editingProcesso, setEditingProcesso] = useState<ProcessoWithRelations | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showNewClienteModal, setShowNewClienteModal] = useState(false)
  const [newClienteForm, setNewClienteForm] = useState<NewClienteForm>({
    nome_completo: '',
    celular: '',
    email: '',
    status: 'ativo'
  })

  // Helper para garantizar que los valores de formData sean siempre strings (nunca null/undefined)
  // Esto previene warnings de React sobre controlled components
  const safeFormData = {
    ...formData,
    titulo: formData.titulo ?? '',
    descricao: formData.descricao ?? '',
    advogado_responsavel: formData.advogado_responsavel ?? '',
    cliente_id: formData.cliente_id ?? '',
    polo: formData.polo ?? '',
    cliente_email: formData.cliente_email ?? '',
    cliente_telefone: formData.cliente_telefone ?? '',
    numero_processo: formData.numero_processo ?? '',
    status: formData.status ?? 'em_aberto',
    area_direito: formData.area_direito ?? '',
    prioridade: formData.prioridade ?? 'media',
    valor_causa: formData.valor_causa ?? '',
    atividade_pendente: formData.atividade_pendente ?? '',
    competencia: formData.competencia ?? '',
    jurisdicao: {
      uf: formData.jurisdicao?.uf ?? '',
      municipio: formData.jurisdicao?.municipio ?? '',
      vara: formData.jurisdicao?.vara ?? '',
      juiz: formData.jurisdicao?.juiz ?? ''
    },
    honorarios: {
      valor_honorarios: formData.honorarios?.valor_honorarios ?? '',
      detalhes: formData.honorarios?.detalhes ?? ''
    },
    // Arrays que deben mantenerse (documentos, links, jurisprudencia)
    documentos_processo: formData.documentos_processo ?? [],
    links_processo: formData.links_processo ?? [],
    jurisprudencia: formData.jurisprudencia ?? [],
  }

  // useUnsavedChanges para detección de cambios
  const initialData: ProcessoFormData = editingProcesso ? {
    titulo: editingProcesso.titulo || '',
    descricao: editingProcesso.descricao || '',
    advogado_responsavel: editingProcesso.advogado_responsavel || '',
    cliente_id: editingProcesso.cliente_id || '',
    polo: editingProcesso.polo || '',
    cliente_email: editingProcesso.cliente_email || '',
    cliente_telefone: editingProcesso.cliente_telefone || '',
    numero_processo: editingProcesso.numero_processo || '',
    status: editingProcesso.status || 'em_aberto',
    area_direito: editingProcesso.area_direito || '',
    prioridade: editingProcesso.prioridade || 'media',
    valor_causa: editingProcesso.valor_causa || '',
    atividade_pendente: editingProcesso.atividade_pendente || '',
    competencia: editingProcesso.competencia || '',
    jurisdicao: {
      uf: editingProcesso.jurisdicao?.uf || '',
      municipio: editingProcesso.jurisdicao?.municipio || '',
      vara: editingProcesso.jurisdicao?.vara || '',
      juiz: editingProcesso.jurisdicao?.juiz || ''
    },
    honorarios: {
      valor_honorarios: editingProcesso.honorarios?.valor_honorarios?.toString() || '',
      detalhes: editingProcesso.honorarios?.detalhes || ''
    },
    documentos_processo: editingProcesso.documentos_processo || [],
    links_processo: editingProcesso.links_processo || [],
    jurisprudencia: editingProcesso.jurisprudencia || []
  } : initialFormData;
  
  const { hasChanges, updateCurrent, resetInitial } = useUnsavedChanges(initialData)

  // ✅ SSoT: Usar useClientes hook en lugar de queries directas
  const { clientes: clientesData, fetchClientes: refetchClientes, createCliente } = useClientes()
  const [clientes, setClientes] = useState<ClienteSimple[]>([])

  // Handler para cambios de formulario
  // Aplica formateo en tiempo real mientras el usuario digita
  const handleFormChange = useCallback((newData: ProcessoFormData) => {
    const formattedData = formatFormData(newData)
    setFormData(formattedData)
    updateCurrent(formattedData)
  }, [updateCurrent])

  // Handler específico para cambio de cliente
  // Carga automáticamente email y teléfono del cliente seleccionado
  const handleClienteChange = useCallback((clienteId: string) => {
    const clienteSelecionado = clientesData.find(c => c.id === clienteId)
    
    const newData: ProcessoFormData = {
      ...formData,
      cliente_id: clienteId,
      cliente_email: clienteSelecionado?.email || '',
      cliente_telefone: clienteSelecionado?.celular || ''
    }
    
    handleFormChange(newData)
  }, [formData, clientesData, handleFormChange])

  // Estados de modales para CrudListManager
  const [showLinksModal, setShowLinksModal] = useState(false)
  const [showLinksViewModal, setShowLinksViewModal] = useState(false)
  const [showJurisprudenciaModal, setShowJurisprudenciaModal] = useState(false)
  const [showJurisprudenciaViewModal, setShowJurisprudenciaViewModal] = useState(false)

  // CRUD Arrays para listas anidadas
  const linksCrud = useCrudArray<ProcessoLink>(formData.links_processo || [])
  const jurisprudenciasCrud = useCrudArray<Jurisprudencia>(formData.jurisprudencia || [])

  // Permisos centralizados
  const { isAdmin, isAdvogado, isAssistente, canEdit } = usePermissions()

  // Sincronizar useCrudArray cuando se carga un proceso para editar
  useEffect(() => {
    if (editingProcesso) {
      linksCrud.setItems(formData.links_processo)
      jurisprudenciasCrud.setItems(formData.jurisprudencia)
    }
  }, [editingProcesso?.id])

  // Sincronizar cambios de useCrudArray con formData
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      links_processo: linksCrud.items,
      jurisprudencia: jurisprudenciasCrud.items
    }))
  }, [linksCrud.items, jurisprudenciasCrud.items])

  // Sincronizar useUnsavedChanges cuando cambia el modal
  useEffect(() => {
    if (editingProcesso) {
      const editData: ProcessoFormData = {
        titulo: editingProcesso.titulo || '',
        descricao: editingProcesso.descricao || '',
        advogado_responsavel: editingProcesso.advogado_responsavel || '',
        cliente_id: editingProcesso.cliente_id || '',
        polo: editingProcesso.polo || '',
        cliente_email: editingProcesso.cliente_email || '',
        cliente_telefone: editingProcesso.cliente_telefone || '',
        numero_processo: editingProcesso.numero_processo || '',
        status: editingProcesso.status || 'em_aberto',
        area_direito: editingProcesso.area_direito || '',
        prioridade: editingProcesso.prioridade || 'media',
        valor_causa: editingProcesso.valor_causa || '',
        atividade_pendente: editingProcesso.atividade_pendente || '',
        competencia: editingProcesso.competencia || '',
        jurisdicao: {
          uf: editingProcesso.jurisdicao?.uf || '',
          municipio: editingProcesso.jurisdicao?.municipio || '',
          vara: editingProcesso.jurisdicao?.vara || '',
          juiz: editingProcesso.jurisdicao?.juiz || ''
        },
        honorarios: {
          valor_honorarios: editingProcesso.honorarios?.valor_honorarios?.toString() || '',
          detalhes: editingProcesso.honorarios?.detalhes || ''
        },
        documentos_processo: editingProcesso.documentos_processo || [],
        links_processo: editingProcesso.links_processo || [],
        jurisprudencia: editingProcesso.jurisprudencia || []
      }
      setFormData(editData)
      resetInitial(editData)
    } else {
      // Siempre resetear a initialFormData cuando no hay processo en edición
      setFormData(initialFormData)
      resetInitial(initialFormData)
    }
  }, [editingProcesso, showCreateForm, resetInitial])

  // Transformar clientes de useClientes a ClienteSimple format
  useEffect(() => {
    const clientesSimples = clientesData
      .filter(c => c.status === 'ativo')
      .map(c => ({
        id: c.id!,
        nome_completo: c.nome_completo,
        celular: c.celular,
        email: c.email,
        status: c.status
      }))
    setClientes(clientesSimples)
  }, [clientesData])

  // Handlers para Links
  const handleAddLink = useCallback((): { success: boolean; message?: string } => {
    const tituloValidation = FormValidator.validateRequired(linksCrud.tempItem.titulo || '', 'Título')
    const linkValidation = FormValidator.validateURL(linksCrud.tempItem.link || '', 'Link')
    
    if (!tituloValidation.isValid || !linkValidation.isValid) {
      // Mensaje específico según el error
      let errorMsg = '';
      if (!tituloValidation.isValid && !linkValidation.isValid) {
        errorMsg = 'Por favor, preencha o título e insira um link válido';
      } else if (!tituloValidation.isValid) {
        errorMsg = 'Por favor, preencha o título do link';
      } else {
        errorMsg = 'URL inválida. Verifique o formato do link (deve começar com http:// ou https://)';
      }
      return { success: false, message: errorMsg }
    }
    linksCrud.addItem(linksCrud.tempItem as ProcessoLink)
    linksCrud.resetTempItem()
    return { success: true }
  }, [linksCrud])

  const handleUpdateLink = useCallback((): { success: boolean; message?: string } => {
    const tituloValidation = FormValidator.validateRequired(linksCrud.tempItem.titulo || '', 'Título')
    const linkValidation = FormValidator.validateURL(linksCrud.tempItem.link || '', 'Link')
    
    if (!tituloValidation.isValid || !linkValidation.isValid) {
      // Mensaje específico según el error
      let errorMsg = '';
      if (!tituloValidation.isValid && !linkValidation.isValid) {
        errorMsg = 'Por favor, preencha o título e insira um link válido';
      } else if (!tituloValidation.isValid) {
        errorMsg = 'Por favor, preencha o título do link';
      } else {
        errorMsg = 'URL inválida. Verifique o formato do link (deve começar com http:// ou https://)';
      }
      return { success: false, message: errorMsg }
    }
    if (linksCrud.editingIndex !== null) {
      linksCrud.updateItem(linksCrud.editingIndex, linksCrud.tempItem as ProcessoLink)
      linksCrud.cancelEdit()
    }
    return { success: true }
  }, [linksCrud])

  // Handlers para Jurisprudencias
  const handleAddJurisprudencia = useCallback((): { success: boolean; message?: string } => {
    const ementaValidation = FormValidator.validateEmenta(jurisprudenciasCrud.tempItem.ementa || '')
    const linkValidation = FormValidator.validateURL(jurisprudenciasCrud.tempItem.link || '', 'Link')
    
    if (!ementaValidation.isValid || !linkValidation.isValid) {
      // Mensaje específico según el error
      let errorMsg = '';
      if (!ementaValidation.isValid && !linkValidation.isValid) {
        errorMsg = 'Por favor, preencha a ementa e insira um link válido';
      } else if (!ementaValidation.isValid) {
        errorMsg = 'Por favor, preencha a ementa da jurisprudência';
      } else {
        errorMsg = 'URL inválida. Verifique o formato do link (deve começar com http:// ou https://)';
      }
      return { success: false, message: errorMsg }
    }
    jurisprudenciasCrud.addItem(jurisprudenciasCrud.tempItem as Jurisprudencia)
    jurisprudenciasCrud.resetTempItem()
    return { success: true }
  }, [jurisprudenciasCrud])

  const handleUpdateJurisprudencia = useCallback((): { success: boolean; message?: string } => {
    const ementaValidation = FormValidator.validateEmenta(jurisprudenciasCrud.tempItem.ementa || '')
    const linkValidation = FormValidator.validateURL(jurisprudenciasCrud.tempItem.link || '', 'Link')
    
    if (!ementaValidation.isValid || !linkValidation.isValid) {
      // Mensaje específico según el error
      let errorMsg = '';
      if (!ementaValidation.isValid && !linkValidation.isValid) {
        errorMsg = 'Por favor, preencha a ementa e insira um link válido';
      } else if (!ementaValidation.isValid) {
        errorMsg = 'Por favor, preencha a ementa da jurisprudência';
      } else {
        errorMsg = 'URL inválida. Verifique o formato do link (deve começar com http:// ou https://)';
      }
      return { success: false, message: errorMsg }
    }
    if (jurisprudenciasCrud.editingIndex !== null) {
      jurisprudenciasCrud.updateItem(jurisprudenciasCrud.editingIndex, jurisprudenciasCrud.tempItem as Jurisprudencia)
      jurisprudenciasCrud.cancelEdit()
    }
    return { success: true }
  }, [jurisprudenciasCrud])

  // Handler para crear cliente
  const handleCreateCliente = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data, error } = await createCliente({ 
        ...newClienteForm,
        pais: 'Brasil'
      })
      
      if (error) throw new Error(error)
      
      await refetchClientes()
      
      if (data && data.id) {
        setFormData(prev => ({ ...prev, cliente_id: data.id! }))
      }
      
      success(SUCCESS_MESSAGES.clientes.CREATED)
      
      setNewClienteForm({
        nome_completo: '',
        celular: '',
        email: '',
        status: 'ativo'
      })
      setShowNewClienteModal(false)
      setShowCreateForm(true)
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      errorNotif(ERROR_MESSAGES.clientes.CREATE_ERROR)
    }
  }, [newClienteForm, refetchClientes, createCliente, success, errorNotif])

  // Handler principal para crear/actualizar proceso
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canEdit) {
      warning('Você não tem permissão para criar ou editar processos')
      return
    }
    
    // Validar campos obligatorios
    if (!formData.advogado_responsavel) {
      warning('Selecione um advogado responsável')
      return
    }

    if (!formData.cliente_id) {
      warning('Selecione um cliente')
      return
    }

    if (!formData.polo || !['ativo', 'passivo'].includes(formData.polo)) {
      warning('Selecione o polo do cliente (Ativo ou Passivo)')
      return
    }

    // Validar numero_processo único (si fue proporcionado)
    if (formData.numero_processo && formData.numero_processo.trim()) {
      const numeroExistente = processos.find(p => 
        p.numero_processo === formData.numero_processo && 
        p.id !== editingProcesso?.id
      )
      
      if (numeroExistente) {
        warning(`O número do processo "${formData.numero_processo}" já está cadastrado`)
        return
      }
    }
    
    // Limpiar datos y convertir empty strings a null para campos opcionales
    const cleanedData: any = {
      titulo: formatFieldValue('titulo', formData.titulo),
      descricao: formatFieldValue('descricao', formData.descricao),
      status: formData.status as ProcessoJuridico['status'],
      advogado_responsavel: formData.advogado_responsavel,  // Campo obligatorio
      numero_processo: formatFieldValue('numero_processo', formData.numero_processo),
      cliente_id: formatFieldValue('cliente_id', formData.cliente_id),
      polo: formData.polo as 'ativo' | 'passivo',  // Validado previamente
      cliente_email: formatFieldValue('cliente_email', formData.cliente_email),
      cliente_telefone: formatFieldValue('cliente_telefone', formData.cliente_telefone),
      area_direito: formatFieldValue('area_direito', formData.area_direito),
      prioridade: formData.prioridade || 'media',
      valor_causa: formData.valor_causa && String(formData.valor_causa).trim() ? parseFloat(String(formData.valor_causa)) : null,
      atividade_pendente: formatFieldValue('atividade_pendente', formData.atividade_pendente),
      competencia: formatFieldValue('competencia', formData.competencia),
      jurisdicao: formData.jurisdicao.uf || formData.jurisdicao.municipio || formData.jurisdicao.vara || formData.jurisdicao.juiz 
        ? formData.jurisdicao 
        : undefined,
      honorarios: formData.honorarios.valor_honorarios && String(formData.honorarios.valor_honorarios).trim() || formData.honorarios.detalhes 
        ? {
            valor_honorarios: formData.honorarios.valor_honorarios && String(formData.honorarios.valor_honorarios).trim() ? parseFloat(String(formData.honorarios.valor_honorarios)) : null,
            detalhes: formData.honorarios.detalhes || undefined
          }
        : undefined,
      documentos_processo: formData.documentos_processo || [],
      links_processo: formData.links_processo || [],
      jurisprudencia: formData.jurisprudencia || [],
    }
    
    if (editingProcesso && editingProcesso.id) {
      // Modo edición
      const dataToUpdate = { ...cleanedData }
      
      // Remover campos protegidos según el rol
      if (user?.role === 'assistente') {
        delete dataToUpdate.numero_processo
        delete dataToUpdate.titulo
        delete dataToUpdate.advogado_responsavel
        delete dataToUpdate.status
      } else if (user?.role === 'advogado') {
        delete dataToUpdate.numero_processo
        delete dataToUpdate.titulo
        delete dataToUpdate.advogado_responsavel
      }
      
      const cleanUpdate = Object.fromEntries(
        Object.entries(dataToUpdate).filter(([_key, value]) => value !== undefined)
      )
      
      // NO aplicar formatFormData: cleanUpdate ya tiene tipos correctos
      const resultado = await updateProcesso(editingProcesso.id, cleanUpdate)
      
      if (resultado.error) {
        // Mensajes específicos para errores de BD
        const errorMessage = resultado.error.message || ''
        const errorCode = resultado.error.code || ''
        
        if (errorCode === '23505' && errorMessage.includes('numero_processo')) {
          warning('Este número de processo já existe no sistema')
        } else if (errorCode === '23514' || errorMessage.includes('check constraint')) {
          if (errorMessage.includes('polo')) {
            warning('Polo do cliente deve ser "Ativo" ou "Passivo"')
          } else if (errorMessage.includes('status')) {
            warning('Status inválido. Selecione: Em Aberto, Em Andamento ou Fechado')
          } else if (errorMessage.includes('prioridade')) {
            warning('Prioridade inválida. Selecione: Urgente, Alta, Média ou Baixa')
          } else if (errorMessage.includes('competencia')) {
            warning('Competência inválida. Selecione uma opção válida')
          } else {
            warning('Dados inválidos. Verifique os campos e tente novamente')
          }
        } else if (errorCode === '23502' || errorMessage.includes('not-null')) {
          warning('Preencha todos os campos obrigatórios')
        } else if (errorCode === '23503' || errorMessage.includes('foreign key')) {
          if (errorMessage.includes('advogado_responsavel')) {
            warning('Advogado responsável inválido. Selecione um advogado da lista')
          } else if (errorMessage.includes('cliente')) {
            warning('Cliente inválido. Selecione um cliente da lista')
          } else {
            warning('Referência inválida. Verifique os dados selecionados')
          }
        } else if (errorMessage.includes('invalid input syntax for type date')) {
          warning('Data inválida. Use o formato DD/MM/AAAA')
        } else {
          console.error('Erro Supabase ao atualizar processo:', resultado.error)
          errorNotif(ERROR_MESSAGES.processos.UPDATE_ERROR)
        }
      } else {
        successToast(SUCCESS_MESSAGES.processos.UPDATED)
        resetForm()
        onSuccess?.()
      }
    } else {
      // Modo creación: NO aplicar formatFormData para evitar convertir null a ""
      // cleanedData ya tiene los tipos correctos (números convertidos, null donde corresponde)
      
      // Remover campos undefined antes de enviar
      const dataToCreate = Object.fromEntries(
        Object.entries(cleanedData).filter(([_key, value]) => value !== undefined)
      )
      
      const resultado = await createProcesso(dataToCreate as Omit<ProcessoJuridico, 'id'>)

      if (resultado.error) {
        // Mensajes específicos para errores de BD
        const errorMessage = resultado.error.message || ''
        const errorCode = resultado.error.code || ''
        
        if (errorCode === '23505' && errorMessage.includes('numero_processo')) {
          warning('Este número de processo já existe no sistema')
        } else if (errorCode === '23514' || errorMessage.includes('check constraint')) {
          if (errorMessage.includes('polo')) {
            warning('Polo do cliente deve ser "Ativo" ou "Passivo"')
          } else if (errorMessage.includes('status')) {
            warning('Status inválido. Selecione: Em Aberto, Em Andamento ou Fechado')
          } else if (errorMessage.includes('prioridade')) {
            warning('Prioridade inválida. Selecione: Urgente, Alta, Média ou Baixa')
          } else if (errorMessage.includes('competencia')) {
            warning('Competência inválida. Selecione uma opção válida')
          } else {
            warning('Dados inválidos. Verifique os campos e tente novamente')
          }
        } else if (errorCode === '23502' || errorMessage.includes('not-null')) {
          warning('Preencha todos os campos obrigatórios')
        } else if (errorCode === '23503' || errorMessage.includes('foreign key')) {
          if (errorMessage.includes('advogado_responsavel')) {
            warning('Advogado responsável inválido. Selecione um advogado da lista')
          } else if (errorMessage.includes('cliente')) {
            warning('Cliente inválido. Selecione um cliente da lista')
          } else {
            warning('Referência inválida. Verifique os dados selecionados')
          }
        } else if (errorMessage.includes('invalid input syntax for type date')) {
          warning('Data inválida. Use o formato DD/MM/AAAA')
        } else {
          console.error('Erro Supabase ao criar processo:', resultado.error)
          errorNotif(ERROR_MESSAGES.processos.CREATE_ERROR)
        }
      } else {
        successToast(SUCCESS_MESSAGES.processos.CREATED)
        resetForm()
        onSuccess?.()
      }
    }
  }, [formData, editingProcesso, user, canEdit, createProcesso, updateProcesso, successToast, warning, errorNotif, onSuccess, processos])

  // Cargar proceso para edición
  const loadProcessoForEdit = useCallback((processo: ProcessoWithRelations) => {
    setEditingProcesso(processo)
    setFormData({
      titulo: processo.titulo || '',
      descricao: processo.descricao || '',
      advogado_responsavel: processo.advogado_responsavel || '',
      cliente_id: processo.cliente_id || '',
      polo: processo.polo || '',
      cliente_email: processo.cliente_email || '',
      cliente_telefone: processo.cliente_telefone || '',
      numero_processo: processo.numero_processo || '',
      status: processo.status || 'em_aberto',
      area_direito: processo.area_direito || '',
      prioridade: processo.prioridade || 'media',
      valor_causa: processo.valor_causa || '',
      atividade_pendente: processo.atividade_pendente || '',
      competencia: processo.competencia || '',
      jurisdicao: processo.jurisdicao ? {
        uf: processo.jurisdicao.uf || '',
        municipio: processo.jurisdicao.municipio || '',
        vara: processo.jurisdicao.vara || '',
        juiz: processo.jurisdicao.juiz || ''
      } : { uf: '', municipio: '', vara: '', juiz: '' },
      honorarios: processo.honorarios ? {
        valor_honorarios: processo.honorarios.valor_honorarios?.toString() || '',
        detalhes: processo.honorarios.detalhes || ''
      } : { valor_honorarios: '', detalhes: '' },
      documentos_processo: processo.documentos_processo || [],
      links_processo: processo.links_processo || [],
      jurisprudencia: processo.jurisprudencia || []
    })
    setShowCreateForm(true)
  }, [])

  // Resetear formulario
  const resetForm = useCallback(() => {
    hide()
    setFormData(initialFormData)
    setEditingProcesso(null)
    setShowCreateForm(false)
    linksCrud.cancelEdit()
    jurisprudenciasCrud.cancelEdit()
    resetInitial(initialFormData)
  }, [hide, linksCrud, jurisprudenciasCrud, resetInitial])

  return {
    // Estado
    formData: safeFormData, // Usar safeFormData para prevenir warnings de React
    setFormData,
    editingProcesso,
    showCreateForm,
    setShowCreateForm,
    clientes,
    showNewClienteModal,
    setShowNewClienteModal,
    newClienteForm,
    setNewClienteForm,
    notification,
    
    // Modales
    showLinksModal,
    setShowLinksModal,
    showLinksViewModal,
    setShowLinksViewModal,
    showJurisprudenciaModal,
    setShowJurisprudenciaModal,
    showJurisprudenciaViewModal,
    setShowJurisprudenciaViewModal,
    
    // CRUD Arrays
    linksCrud,
    jurisprudenciasCrud,
    
    // Handlers
    handleAddLink,
    handleUpdateLink,
    handleAddJurisprudencia,
    handleUpdateJurisprudencia,
    handleCreateCliente,
    handleSubmit,
    handleFormChange,
    handleClienteChange,
    loadProcessoForEdit,
    resetForm,
    hide,
    refetchClientes,
    
    // Detección de cambios
    hasChanges,
    
    // Permisos
    isAdmin,
    isAdvogado,
    isAssistente,
    canEdit
  }
}
