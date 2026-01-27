/**
 * Hook personalizado para gestión del formulario de procesos
 * Centraliza la lógica de estado, validación y operaciones CRUD
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { 
  ProcessoJuridico, 
  ProcessoFormData, 
  ProcessoWithRelations,
  ClienteSimple,
  NewClienteForm,
  ProcessoLink,
  Jurisprudencia,
  Audiencia
} from '../types/processo'
import { useCrudArray } from './useCrudArray'
import { useInlineNotification } from './useInlineNotification'
import { useNotification } from '../components/shared/notifications/NotificationContext'
import { useAuth } from './useSupabase'


interface UseProcessoFormOptions {
  onSuccess?: () => void
  createProcesso: (data: Omit<ProcessoJuridico, 'id'>) => Promise<{ error: any }>
  updateProcesso: (id: string, data: Partial<ProcessoJuridico>) => Promise<{ error: any }>
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
  audiencias: [],
  documentos_processo: [],
  links_processo: [],
  jurisprudencia: []
}

export function useProcessoForm({ onSuccess, createProcesso, updateProcesso }: UseProcessoFormOptions) {
  const { user } = useAuth()
  const { notification, success, warning, error: errorNotif, hide } = useInlineNotification()
  const { success: successToast } = useNotification()

  // Estados principales
  const [formData, setFormData] = useState<ProcessoFormData>(initialFormData)
  const [editingProcesso, setEditingProcesso] = useState<ProcessoWithRelations | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [clientes, setClientes] = useState<ClienteSimple[]>([])
  const [showNewClienteModal, setShowNewClienteModal] = useState(false)
  const [newClienteForm, setNewClienteForm] = useState<NewClienteForm>({
    nome_completo: '',
    celular: '',
    email: '',
    status: 'ativo'
  })

  // Estados de modales para CrudListManager
  const [showLinksModal, setShowLinksModal] = useState(false)
  const [showLinksViewModal, setShowLinksViewModal] = useState(false)
  const [showJurisprudenciaModal, setShowJurisprudenciaModal] = useState(false)
  const [showJurisprudenciaViewModal, setShowJurisprudenciaViewModal] = useState(false)
  const [showAudienciaModal, setShowAudienciaModal] = useState(false)
  const [showAudienciaViewModal, setShowAudienciaViewModal] = useState(false)

  // CRUD Arrays para listas anidadas
  const linksCrud = useCrudArray<ProcessoLink>(formData.links_processo)
  const jurisprudenciasCrud = useCrudArray<Jurisprudencia>(formData.jurisprudencia)
  const audienciasCrud = useCrudArray<Audiencia>(formData.audiencias)

  // Permisos del usuario
  const isAdmin = user?.role === 'admin'
  const isAdvogado = user?.role === 'advogado'
  const isAssistente = user?.role === 'assistente'
  const canEdit = isAdmin || isAdvogado || isAssistente

  // Sincronizar useCrudArray cuando se carga un proceso para editar
  useEffect(() => {
    if (editingProcesso) {
      linksCrud.setItems(formData.links_processo)
      jurisprudenciasCrud.setItems(formData.jurisprudencia)
      audienciasCrud.setItems(formData.audiencias)
    }
  }, [editingProcesso?.id])

  // Sincronizar cambios de useCrudArray con formData
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      links_processo: linksCrud.items,
      jurisprudencia: jurisprudenciasCrud.items,
      audiencias: audienciasCrud.items
    }))
  }, [linksCrud.items, jurisprudenciasCrud.items, audienciasCrud.items])

  // Cargar clientes
  const fetchClientes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nome_completo, status')
        .eq('status', 'ativo')
        .order('nome_completo')
      
      if (error) {
        console.warn('Tabla clientes no encontrada o sin datos:', error)
        setClientes([])
        return
      }
      setClientes(data || [])
    } catch (error) {
      console.warn('Erro ao carregar clientes (tabla puede no existir aún):', error)
      setClientes([])
    }
  }, [])

  useEffect(() => {
    fetchClientes()
  }, [fetchClientes])

  // Handlers para Links
  const handleAddLink = useCallback(() => {
    if (!linksCrud.tempItem.titulo?.trim() || !linksCrud.tempItem.link?.trim()) {
      warning('Por favor, preencha o título e o link')
      return
    }
    linksCrud.addItem(linksCrud.tempItem as ProcessoLink)
    linksCrud.resetTempItem()
  }, [linksCrud, warning])

  const handleUpdateLink = useCallback(() => {
    if (!linksCrud.tempItem.titulo?.trim() || !linksCrud.tempItem.link?.trim()) {
      warning('Por favor, preencha o título e o link')
      return
    }
    if (linksCrud.editingIndex !== null) {
      linksCrud.updateItem(linksCrud.editingIndex, linksCrud.tempItem as ProcessoLink)
      linksCrud.cancelEdit()
    }
  }, [linksCrud, warning])

  // Handlers para Jurisprudencias
  const handleAddJurisprudencia = useCallback(() => {
    if (!jurisprudenciasCrud.tempItem.ementa?.trim() || !jurisprudenciasCrud.tempItem.link?.trim()) {
      warning('Por favor, preencha a ementa e o link')
      return
    }
    jurisprudenciasCrud.addItem(jurisprudenciasCrud.tempItem as Jurisprudencia)
    jurisprudenciasCrud.resetTempItem()
  }, [jurisprudenciasCrud, warning])

  const handleUpdateJurisprudencia = useCallback(() => {
    if (!jurisprudenciasCrud.tempItem.ementa?.trim() || !jurisprudenciasCrud.tempItem.link?.trim()) {
      warning('Por favor, preencha a ementa e o link')
      return
    }
    if (jurisprudenciasCrud.editingIndex !== null) {
      jurisprudenciasCrud.updateItem(jurisprudenciasCrud.editingIndex, jurisprudenciasCrud.tempItem as Jurisprudencia)
      jurisprudenciasCrud.cancelEdit()
    }
  }, [jurisprudenciasCrud, warning])

  // Handlers para Audiencias
  const handleAddAudiencia = useCallback(() => {
    const { data, horario, tipo, forma, lugar } = audienciasCrud.tempItem
    if (!data?.trim() || !horario?.trim() || !tipo?.trim() || !forma?.trim() || !lugar?.trim()) {
      warning('Por favor, preencha todos os campos da audiência')
      return
    }
    audienciasCrud.addItem(audienciasCrud.tempItem as Audiencia)
    audienciasCrud.resetTempItem()
  }, [audienciasCrud, warning])

  const handleUpdateAudiencia = useCallback(() => {
    const { data, horario, tipo, forma, lugar } = audienciasCrud.tempItem
    if (!data?.trim() || !horario?.trim() || !tipo?.trim() || !forma?.trim() || !lugar?.trim()) {
      warning('Por favor, preencha todos os campos da audiência')
      return
    }
    if (audienciasCrud.editingIndex !== null) {
      audienciasCrud.updateItem(audienciasCrud.editingIndex, audienciasCrud.tempItem as Audiencia)
      audienciasCrud.cancelEdit()
    }
  }, [audienciasCrud, warning])

  // Handler para crear cliente
  const handleCreateCliente = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([{ 
          nome_completo: newClienteForm.nome_completo,
          celular: newClienteForm.celular,
          email: newClienteForm.email || null,
          status: newClienteForm.status,
          pais: 'Brasil'
        }])
        .select()
      
      if (error) {
        console.error('Error detalle:', error)
        throw error
      }
      
      await fetchClientes()
      
      if (data && data[0]) {
        setFormData(prev => ({ ...prev, cliente_id: data[0].id }))
      }
      
      success('Cliente criado com sucesso!')
      
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
      errorNotif('Erro ao criar cliente. Por favor, tente novamente.')
    }
  }, [newClienteForm, fetchClientes, success, errorNotif])

  // Handler principal para crear/actualizar proceso
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canEdit) {
      warning('Você não tem permissão para criar ou editar processos')
      return
    }
    
    // Limpiar datos
    const cleanedData: Partial<ProcessoJuridico> = {
      titulo: formData.titulo,
      descricao: formData.descricao,
      status: formData.status as ProcessoJuridico['status'],
      advogado_responsavel: formData.advogado_responsavel || undefined,
      numero_processo: formData.numero_processo || undefined,
      cliente_id: formData.cliente_id || undefined,
      polo: formData.polo || undefined,
      cliente_email: formData.cliente_email || undefined,
      cliente_telefone: formData.cliente_telefone || undefined,
      area_direito: formData.area_direito || undefined,
      prioridade: (formData.prioridade as any) || 'media',
      valor_causa: formData.valor_causa || undefined,
      atividade_pendente: formData.atividade_pendente || undefined,
      competencia: formData.competencia || undefined,
      jurisdicao: formData.jurisdicao.uf || formData.jurisdicao.municipio || formData.jurisdicao.vara || formData.jurisdicao.juiz 
        ? formData.jurisdicao 
        : undefined,
      honorarios: formData.honorarios.valor_honorarios || formData.honorarios.detalhes 
        ? {
            valor_honorarios: formData.honorarios.valor_honorarios ? parseFloat(formData.honorarios.valor_honorarios) : undefined,
            detalhes: formData.honorarios.detalhes || undefined
          }
        : undefined,
      audiencias: formData.audiencias.length > 0 ? formData.audiencias : undefined,
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
        Object.entries(dataToUpdate).filter(([_, value]) => value !== undefined)
      )
      
      const resultado = await updateProcesso(editingProcesso.id, cleanUpdate)
      
      if (!resultado.error) {
        successToast('Processo atualizado com sucesso!')
        resetForm()
        onSuccess?.()
      }
    } else {
      // Modo creación
      const resultado = await createProcesso(cleanedData as Omit<ProcessoJuridico, 'id'>)

      if (!resultado.error) {
        successToast('Processo criado com sucesso!')
        resetForm()
        onSuccess?.()
      }
    }
  }, [formData, editingProcesso, user, canEdit, createProcesso, updateProcesso, successToast, warning, onSuccess])

  // Cargar proceso para edición
  const loadProcessoForEdit = useCallback((processo: ProcessoWithRelations) => {
    setEditingProcesso(processo)
    setFormData({
      titulo: processo.titulo || '',
      descricao: processo.descricao || '',
      advogado_responsavel: processo.advogado_responsavel || '',
      cliente_id: processo.cliente_id || '',
      polo: (processo.polo as any) || '',
      cliente_email: processo.cliente_email || '',
      cliente_telefone: processo.cliente_telefone || '',
      numero_processo: processo.numero_processo || '',
      status: processo.status || 'em_aberto',
      area_direito: processo.area_direito || '',
      prioridade: processo.prioridade || 'media',
      valor_causa: processo.valor_causa || '',
      atividade_pendente: processo.atividade_pendente || '',
      competencia: (processo.competencia || '') as any,
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
      audiencias: processo.audiencias || [],
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
    audienciasCrud.cancelEdit()
  }, [hide, linksCrud, jurisprudenciasCrud, audienciasCrud])

  return {
    // Estado
    formData,
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
    showAudienciaModal,
    setShowAudienciaModal,
    showAudienciaViewModal,
    setShowAudienciaViewModal,
    
    // CRUD Arrays
    linksCrud,
    jurisprudenciasCrud,
    audienciasCrud,
    
    // Handlers
    handleAddLink,
    handleUpdateLink,
    handleAddJurisprudencia,
    handleUpdateJurisprudencia,
    handleAddAudiencia,
    handleUpdateAudiencia,
    handleCreateCliente,
    handleSubmit,
    loadProcessoForEdit,
    resetForm,
    hide,
    
    // Permisos
    isAdmin,
    isAdvogado,
    isAssistente,
    canEdit
  }
}
