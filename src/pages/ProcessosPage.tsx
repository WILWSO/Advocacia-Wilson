import React, { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Plus, Search, User, Calendar, AlertCircle, CheckCircle, Clock, Eye, FileText, Download, Mail, Phone, Link as LinkIcon, Scale, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProcessos, useUsuarios, useAuth } from '../hooks/useSupabase'
import { ResponsiveContainer } from '../components/shared/ResponsiveGrid'
import { useResponsive } from '../hooks/useResponsive'
import { cn } from '../utils/cn'
import { supabase, ProcessoJuridico, DocumentoArquivo } from '../lib/supabase'
import { AuditInfo } from '../components/shared/AuditInfo'
import SkeletonCard from '../components/shared/cards/SkeletonCard'
import ProcessoCard from '../components/shared/cards/ProcessoCard'
import AccessibleButton from '../components/shared/buttons/AccessibleButton'
import { FormModal } from '../components/shared/modales/FormModal'
import { ViewModal } from '../components/shared/modales/ViewModal'
import { useCrudArray } from '../hooks/useCrudArray'
import { CrudListManager } from '../components/admin/CrudListManager'
import { DocumentManager, DocumentItem } from '../components/admin/DocumentManager'
import { useInlineNotification } from '../hooks/useInlineNotification'
import { InlineNotification } from '../components/shared/notifications/InlineNotification'
import { useNotification } from '../components/shared/notifications/NotificationContext'

// Tipos para los nuevos campos JSONB
interface ProcessoLink {
  titulo: string
  link: string
}

interface Jurisprudencia {
  ementa: string
  link: string
}

// Componente de gestión de procesos jurídicos
const ProcessosPage: React.FC = () => {
  useResponsive()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const isAdvogado = user?.role === 'advogado'
  const isAssistente = user?.role === 'assistente'
  const canEdit = isAdmin || isAdvogado || isAssistente
  // const canDelete = isAdmin // No hay función de eliminar procesos en esta página
  
  const { processos, loading, error, fetchProcessos, createProcesso, updateProcesso } = useProcessos()
  const { usuarios } = useUsuarios()
  const { notification, warning, error: errorNotif, hide } = useInlineNotification()
  const { success: successToast } = useNotification() // Toast global para mensajes de éxito

  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [filtroAdvogado, setFiltroAdvogado] = useState<string>('')
  const [busca, setBusca] = useState<string>('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingProcesso, setEditingProcesso] = useState<(ProcessoJuridico & { usuarios?: { nome: string }; cliente_nome?: string }) | null>(null)
  const [viewingProcesso, setViewingProcesso] = useState<(ProcessoJuridico & { usuarios?: { nome: string }; cliente_nome?: string }) | null>(null)
  const [clientes, setClientes] = useState<{ id: string; nome_completo: string; status: string }[]>([])
  const [showNewClienteModal, setShowNewClienteModal] = useState(false)
  const [newClienteForm, setNewClienteForm] = useState({
    nome_completo: '',
    celular: '',
    email: '',
    status: 'ativo' as 'ativo' | 'inativo' | 'potencial'
  })
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    advogado_responsavel: '',
    cliente_id: '',
    polo: '' as 'ativo' | 'passivo' | '',
    cliente_email: '',
    cliente_telefone: '',
    numero_processo: '',
    status: 'em_aberto',
    area_direito: '',
    prioridade: 'media',
    valor_causa: '',
    atividade_pendente: '',
    competencia: '' as 'federal' | 'estadual' | 'trabalhista' | 'eleitoral' | '',
    // Campos JSONB
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
    audiencias: [] as Array<{ data: string; horario: string; tipo: string; forma: string; lugar: string }>,
    documentos_processo: [] as DocumentoArquivo[],
    links_processo: [] as ProcessoLink[],
    jurisprudencia: [] as Jurisprudencia[]
  })
  
  // Estados para gestionar links, jurisprudencias y audiencias con useCrudArray
  const linksCrud = useCrudArray<ProcessoLink>(formData.links_processo)
  const jurisprudenciasCrud = useCrudArray<Jurisprudencia>(formData.jurisprudencia)
  const audienciasCrud = useCrudArray<any>(formData.audiencias)
  
  // Sincronizar useCrudArray cuando se carga un proceso para editar
  useEffect(() => {
    if (editingProcesso) {
      linksCrud.setItems(formData.links_processo)
      jurisprudenciasCrud.setItems(formData.jurisprudencia)
      audienciasCrud.setItems(formData.audiencias)
    }
  }, [editingProcesso?.id])
  
  // Estados de modales para CrudListManager
  const [showLinksModal, setShowLinksModal] = useState(false)
  const [showLinksViewModal, setShowLinksViewModal] = useState(false)
  const [showJurisprudenciaModal, setShowJurisprudenciaModal] = useState(false)
  const [showJurisprudenciaViewModal, setShowJurisprudenciaViewModal] = useState(false)
  const [showAudienciaModal, setShowAudienciaModal] = useState(false)
  const [showAudienciaViewModal, setShowAudienciaViewModal] = useState(false)

  useEffect(() => {
    fetchProcessos()
    fetchClientes()
  }, [fetchProcessos])

  const fetchClientes = async () => {
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
  }

  // Funciones de gestión de documentos ahora manejadas por DocumentManager

  // Sincronizar cambios de useCrudArray con formData
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      links_processo: linksCrud.items,
      jurisprudencia: jurisprudenciasCrud.items,
      audiencias: audienciasCrud.items
    }))
  }, [linksCrud.items, jurisprudenciasCrud.items, audienciasCrud.items])

  // Handlers para Links (integrados con useCrudArray)
  const handleAddLink = () => {
    if (!linksCrud.tempItem.titulo?.trim() || !linksCrud.tempItem.link?.trim()) {
      warning('Por favor, preencha o título e o link')
      return
    }
    linksCrud.addItem(linksCrud.tempItem as ProcessoLink)
    linksCrud.resetTempItem()
  }

  const handleUpdateLink = () => {
    if (!linksCrud.tempItem.titulo?.trim() || !linksCrud.tempItem.link?.trim()) {
      warning('Por favor, preencha o título e o link')
      return
    }
    if (linksCrud.editingIndex !== null) {
      linksCrud.updateItem(linksCrud.editingIndex, linksCrud.tempItem as ProcessoLink)
      linksCrud.cancelEdit()
    }
  }

  // Handlers para Jurisprudencias (integrados con useCrudArray)
  const handleAddJurisprudencia = () => {
    if (!jurisprudenciasCrud.tempItem.ementa?.trim() || !jurisprudenciasCrud.tempItem.link?.trim()) {
      warning('Por favor, preencha a ementa e o link')
      return
    }
    jurisprudenciasCrud.addItem(jurisprudenciasCrud.tempItem as Jurisprudencia)
    jurisprudenciasCrud.resetTempItem()
  }

  const handleUpdateJurisprudencia = () => {
    if (!jurisprudenciasCrud.tempItem.ementa?.trim() || !jurisprudenciasCrud.tempItem.link?.trim()) {
      warning('Por favor, preencha a ementa e o link')
      return
    }
    if (jurisprudenciasCrud.editingIndex !== null) {
      jurisprudenciasCrud.updateItem(jurisprudenciasCrud.editingIndex, jurisprudenciasCrud.tempItem as Jurisprudencia)
      jurisprudenciasCrud.cancelEdit()
    }
  }

  // Handlers para Audiencias (integrados con useCrudArray)
  const handleAddAudiencia = () => {
    const { data, horario, tipo, forma, lugar } = audienciasCrud.tempItem
    if (!data?.trim() || !horario?.trim() || !tipo?.trim() || !forma?.trim() || !lugar?.trim()) {
      warning('Por favor, preencha todos os campos da audiência')
      return
    }
    audienciasCrud.addItem(audienciasCrud.tempItem)
    audienciasCrud.resetTempItem()
  }

  const handleUpdateAudiencia = () => {
    const { data, horario, tipo, forma, lugar } = audienciasCrud.tempItem
    if (!data?.trim() || !horario?.trim() || !tipo?.trim() || !forma?.trim() || !lugar?.trim()) {
      warning('Por favor, preencha todos os campos da audiência')
      return
    }
    if (audienciasCrud.editingIndex !== null) {
      audienciasCrud.updateItem(audienciasCrud.editingIndex, audienciasCrud.tempItem)
      audienciasCrud.cancelEdit()
    }
  }

  // Handlers para Documentos
  const handleViewDocument = async (doc: DocumentoArquivo) => {
    if (!doc.url) return
    
    try {
      // Extraer path desde la URL
      const urlPattern = new RegExp(`/object/(?:public/)?documentos_processo/(.+)`)
      const match = doc.url.match(urlPattern)
      
      if (match && match[1]) {
        const filePath = match[1]
        
        const { data, error } = await supabase.storage
          .from('documentos_processo')
          .createSignedUrl(filePath, 60)

        if (error) throw error
        
        if (data?.signedUrl) {
          window.open(data.signedUrl, '_blank')
        }
      } else {
        // Si no coincide el patrón, intentar abrir directamente
        window.open(doc.url, '_blank')
      }
    } catch (error) {
      console.error('Erro ao visualizar documento:', error)
      errorNotif('Erro ao visualizar documento')
    }
  }

  const handleDownloadDocument = async (doc: DocumentoArquivo) => {
    if (!doc.url) return
    
    try {
      // Extraer path desde la URL
      const urlPattern = new RegExp(`/object/(?:public/)?documentos_processo/(.+)`)
      const match = doc.url.match(urlPattern)
      let downloadUrl = doc.url
      
      if (match && match[1]) {
        const filePath = match[1]
        
        const { data, error } = await supabase.storage
          .from('documentos_processo')
          .createSignedUrl(filePath, 60)

        if (error) throw error
        
        if (data?.signedUrl) {
          downloadUrl = data.signedUrl
        }
      }
      
      const response = await fetch(downloadUrl)
      if (!response.ok) throw new Error('Error al obtener el archivo')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.nome || 'documento'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erro ao baixar documento:', error)
      errorNotif('Erro ao baixar documento')
    }
  }

  const handleCreateCliente = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([{ 
          ...newClienteForm,
          pais: 'Brasil'
        }])
        .select()
      
      if (error) throw error
      
      // Actualizar lista de clientes
      await fetchClientes()
      
      // Seleccionar el nuevo cliente
      if (data && data[0]) {
        setFormData({...formData, cliente_id: data[0].id})
      }
      
      // Resetear form y cerrar modal
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
  }

  const handleCreateProcesso = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Verificar permisos
    if (!canEdit) {
      warning('Você não tem permissão para criar ou editar processos');
      return;
    }
    
    // Limpiar datos: convertir strings vacíos en null para campos opcionales
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
      prioridade: formData.prioridade,
      valor_causa: formData.valor_causa || undefined,
      atividade_pendente: formData.atividade_pendente || undefined,
      competencia: formData.competencia || undefined,
      // Campos JSONB
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
      // Remover campos protegidos según el rol del usuario
      const dataToUpdate = { ...cleanedData }
      
      if (user?.role === 'assistente') {
        // Assistente no puede editar: numero_processo, titulo, advogado_responsavel, status
        delete dataToUpdate.numero_processo
        delete dataToUpdate.titulo
        delete dataToUpdate.advogado_responsavel
        delete dataToUpdate.status
      } else if (user?.role === 'advogado') {
        // Advogado no puede editar: numero_processo, titulo, advogado_responsavel
        delete dataToUpdate.numero_processo
        delete dataToUpdate.titulo
        delete dataToUpdate.advogado_responsavel
      }
      // Admin puede editar todo, no eliminamos nada
      
      // IMPORTANTE: Remover campos undefined antes de enviar a Supabase
      const cleanUpdate = Object.fromEntries(
        Object.entries(dataToUpdate).filter(([_, value]) => value !== undefined)
      )
      
      const resultado = await updateProcesso(editingProcesso.id, cleanUpdate)
      
      if (!resultado.error) {
        successToast('Processo atualizado com sucesso!')
        resetForm()
      }
    } else {
      // Modo creación
      const resultado = await createProcesso(cleanedData as Omit<ProcessoJuridico, 'id'>)

      if (!resultado.error) {
        successToast('Processo criado com sucesso!')
        resetForm()
      }
    }
  }

  const handleViewProcesso = (processo: ProcessoJuridico & { usuarios?: { nome: string }; cliente_nome?: string }) => {
    setViewingProcesso(processo)
  }

  const handleEditProcesso = (processo: ProcessoJuridico & { usuarios?: { nome: string }; cliente_nome?: string }) => {
    setEditingProcesso(processo)
    setFormData({
      titulo: processo.titulo || '',
      descricao: processo.descricao || '',
      advogado_responsavel: processo.advogado_responsavel || '',
      cliente_id: processo.cliente_id || '',
      polo: (processo.polo as 'ativo' | 'passivo') || '',
      cliente_email: processo.cliente_email || '',
      cliente_telefone: processo.cliente_telefone || '',
      numero_processo: processo.numero_processo || '',
      status: processo.status || 'em_aberto',
      area_direito: processo.area_direito || '',
      prioridade: processo.prioridade || 'media',
      valor_causa: processo.valor_causa || '',
      atividade_pendente: processo.atividade_pendente || '',
      competencia: (processo.competencia || '') as 'federal' | 'estadual' | 'trabalhista' | 'eleitoral' | '',
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
  }

  const resetForm = () => {
    hide(); // Limpiar notificaciones al cerrar modal
    setFormData({
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
      jurisdicao: { uf: '', municipio: '', vara: '', juiz: '' },
      honorarios: { valor_honorarios: '', detalhes: '' },
      audiencias: [],
      documentos_processo: [],
      links_processo: [],
      jurisprudencia: []
    })
    setEditingProcesso(null)
    setShowCreateForm(false)
    // Resetear los useCrudArray
    linksCrud.cancelEdit()
    jurisprudenciasCrud.cancelEdit()
    audienciasCrud.cancelEdit()
  }

  const processosFiltrados = processos.filter(processo => {
    const matchesBusca = busca === '' || 
      processo.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      processo.descricao.toLowerCase().includes(busca.toLowerCase()) ||
      processo.cliente_nome?.toLowerCase().includes(busca.toLowerCase())
    
    const matchesStatus = filtroStatus === '' || processo.status === filtroStatus
    const matchesAdvogado = filtroAdvogado === '' || processo.advogado_responsavel === filtroAdvogado

    return matchesBusca && matchesStatus && matchesAdvogado
  })

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
          <p className="text-gray-600">Faça login para acessar o painel administrativo.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-full">
      <ResponsiveContainer maxWidth="7xl" className="p-6 lg:p-8">
        
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary-900 mb-2">
                  Gestão de Processos
                </h1>
                <p className="text-gray-600">
                  Gerencie processos jurídicos e acompanhe o andamento das atividades
                </p>
              </div>
              
              {/* Botão de novo processo */}
              {canEdit && (
                <AccessibleButton
                  category="create"
                  onClick={() => setShowCreateForm(true)}
                  aria-label="Criar novo processo"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Novo Processo
                </AccessibleButton> // Fim do botão
              )} 
            </div>
          </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Aberto</p>
                <p className="text-2xl font-bold text-gray-900">
                  {processos.filter(p => p.status === 'em_aberto').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-gray-900">
                  {processos.filter(p => p.status === 'em_andamento').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fechados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {processos.filter(p => p.status === 'fechado').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros e busca */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
            <div className="sm:col-span-2 xl:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por título, descrição ou cliente..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos</option>
                <option value="em_aberto">Em Aberto</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="fechado">Fechado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Advogado
              </label>
              <select
                value={filtroAdvogado}
                onChange={(e) => setFiltroAdvogado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos</option>
                {usuarios.map(usuario => (
                  <option key={usuario.id} value={usuario.id}>
                    {usuario.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de processos */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
            {processosFiltrados.map((processo, index) => (
              <ProcessoCard
                key={processo.id}
                processo={processo}
                onEdit={handleEditProcesso}
                onView={handleViewProcesso}
                canEdit={canEdit}
                index={index}
              />
            ))}
          </div>
        )}

        {processosFiltrados.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum processo encontrado</p>
          </div>
        )}

      {/* Modal de crear/editar proceso */}
      <FormModal
        isOpen={showCreateForm}
        onClose={resetForm}
        onSubmit={handleCreateProcesso}
        title={editingProcesso ? 'Editar Processo' : 'Novo Processo'}
        submitLabel={editingProcesso ? 'Atualizar' : 'Salvar'}
        cancelLabel="Cancelar"
        maxWidth="4xl"
      >
              {/* Notificación inline */}
              <AnimatePresence mode="wait">
                {notification.show && (
                  <InlineNotification
                    type={notification.type}
                    message={notification.message}
                    onClose={hide}
                    className="mb-4"
                  />
                )}
              </AnimatePresence>
              
              {/* Seção 1: Informações Básicas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Informações Básicas
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título do Processo *
                      {!isAdmin && editingProcesso && (
                        <span className="ml-2 text-xs text-amber-600">(Apenas admin pode editar)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      className={cn(
                        "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500",
                        !isAdmin && editingProcesso && "bg-gray-100 cursor-not-allowed opacity-75"
                      )}
                      value={formData.titulo}
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      placeholder="Ex: Ação de Indenização por Danos Morais"
                      disabled={!isAdmin && editingProcesso !== null}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição *
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.descricao}
                      onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                      placeholder="Descreva os detalhes do processo..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número do Processo
                        {!isAdmin && editingProcesso && (
                          <span className="ml-2 text-xs text-amber-600">(Apenas admin pode editar)</span>
                        )}
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 1001234-12.2024.8.07.0001"
                        className={cn(
                          "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500",
                          !isAdmin && editingProcesso && "bg-gray-100 cursor-not-allowed opacity-75"
                        )}
                        value={formData.numero_processo}
                        onChange={(e) => setFormData({...formData, numero_processo: e.target.value})}
                        disabled={!isAdmin && editingProcesso !== null}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status *
                        {isAssistente && (
                          <span className="ml-2 text-xs text-amber-600">(Apenas admin e advogado podem editar)</span>
                        )}
                      </label>
                      <select
                        required
                        disabled={isAssistente}
                        className={cn(
                          "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500",
                          isAssistente && "bg-gray-100 cursor-not-allowed opacity-75"
                        )}
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        title={isAssistente ? 'Apenas administradores e advogados podem alterar o status' : ''}
                      >
                        <option value="em_aberto">Em Aberto</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="fechado">Fechado</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 2: Cliente */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Informações do Cliente
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Selecione o Cliente *
                        </label>
                        <select
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                          value={formData.cliente_id}
                          onChange={(e) => setFormData({...formData, cliente_id: e.target.value})}
                        >
                          <option value="">Selecione um cliente</option>
                          {clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                              {cliente.nome_completo}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <AccessibleButton
                          type="button"
                          onClick={() => {
                            setShowNewClienteModal(true)
                            setShowCreateForm(false)
                          }}
                          variant="primary"
                          size="md"
                          leftIcon={<Plus size={16} />}
                          aria-label="Cadastrar novo cliente"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Novo
                        </AccessibleButton>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Polo do Cliente
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                        value={formData.polo}
                        onChange={(e) => setFormData({...formData, polo: e.target.value as 'ativo' | 'passivo' | ''})}
                      >
                        <option value="">Selecione o polo</option>
                        <option value="ativo">Ativo (Autor/Requerente)</option>
                        <option value="passivo">Passivo (Réu/Requerido)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Mail size={16} />
                        Email do Cliente
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                        value={formData.cliente_email}
                        onChange={(e) => setFormData({...formData, cliente_email: e.target.value})}
                        placeholder="cliente@exemplo.com"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Phone size={16} />
                        Telefone do Cliente
                      </label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                        value={formData.cliente_telefone}
                        onChange={(e) => setFormData({...formData, cliente_telefone: e.target.value})}
                        placeholder="(xx) xxxxx-xxxx"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 3: Detalhes Jurídicos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Detalhes Jurídicos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Área do Direito
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.area_direito}
                      onChange={(e) => setFormData({...formData, area_direito: e.target.value})}
                    >
                      <option value="">Selecione uma área</option>
                      <option value="Direito Civil">Direito Civil</option>
                      <option value="Direito Criminal">Direito Criminal</option>
                      <option value="Direito Trabalhista">Direito Trabalhista</option>
                      <option value="Direito Empresarial">Direito Empresarial</option>
                      <option value="Direito Família">Direito de Família</option>
                      <option value="Direito Previdenciário">Direito Previdenciário</option>
                      <option value="Direito Tributário">Direito Tributário</option>
                      <option value="Direito Imobiliário">Direito Imobiliário</option>
                      <option value="Direito do Consumidor">Direito do Consumidor</option>
                      <option value="Direito Administrativo">Direito Administrativo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prioridade *
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.prioridade}
                      onChange={(e) => setFormData({...formData, prioridade: e.target.value})}
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Advogado Responsável
                      {!isAdmin && editingProcesso && (
                        <span className="ml-2 text-xs text-amber-600">(Apenas admin pode editar)</span>
                      )}
                    </label>
                    <select
                      className={cn(
                        "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500",
                        !isAdmin && editingProcesso && "bg-gray-100 cursor-not-allowed opacity-75"
                      )}
                      value={formData.advogado_responsavel}
                      onChange={(e) => setFormData({...formData, advogado_responsavel: e.target.value})}
                      disabled={!isAdmin && editingProcesso !== null}
                    >
                      <option value="">Selecione um advogado</option>
                      {usuarios.map(usuario => (
                        <option key={usuario.id} value={usuario.id}>
                          {usuario.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor da Causa (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.valor_causa}
                      onChange={(e) => setFormData({...formData, valor_causa: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Competência
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.competencia}
                      onChange={(e) => setFormData({...formData, competencia: e.target.value as 'federal' | 'estadual' | 'trabalhista' | 'eleitoral' | ''})}
                      placeholder="Ex: Federal, Estadual, Trabalhista, Eleitoral"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Atividade Pendente
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.atividade_pendente}
                      onChange={(e) => setFormData({...formData, atividade_pendente: e.target.value})}
                      placeholder="Descreva as atividades pendentes do processo..."
                    />
                  </div>
                </div>
              </div>

              {/* Seção 4: Jurisdição */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Jurisdição
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      UF (Estado)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="Ex: SP, RJ, MG"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 uppercase"
                      value={formData.jurisdicao.uf}
                      onChange={(e) => setFormData({
                        ...formData, 
                        jurisdicao: {...formData.jurisdicao, uf: e.target.value.toUpperCase()}
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Município
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: São Paulo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.jurisdicao.municipio}
                      onChange={(e) => setFormData({
                        ...formData, 
                        jurisdicao: {...formData.jurisdicao, municipio: e.target.value}
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vara
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 1ª Vara Cível"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.jurisdicao.vara}
                      onChange={(e) => setFormData({
                        ...formData, 
                        jurisdicao: {...formData.jurisdicao, vara: e.target.value}
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Juiz
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Dr. João Silva"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.jurisdicao.juiz}
                      onChange={(e) => setFormData({
                        ...formData, 
                        jurisdicao: {...formData.jurisdicao, juiz: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Seção 5: Honorários */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Honorários
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor dos Honorários (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0,00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.honorarios.valor_honorarios}
                      onChange={(e) => setFormData({
                        ...formData, 
                        honorarios: {...formData.honorarios, valor_honorarios: e.target.value}
                      })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Detalhes dos Honorários
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.honorarios.detalhes}
                      onChange={(e) => setFormData({
                        ...formData, 
                        honorarios: {...formData.honorarios, detalhes: e.target.value}
                      })}
                      placeholder="Ex: Honorários contratuais - 3 parcelas de R$ 1.000,00"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 6: Documentos */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                  <FileText size={20} className="text-gray-700" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Documentos do Processo
                  </h3>
                </div>

                <DocumentManager
                  documents={formData.documentos_processo as DocumentItem[]}
                  onDocumentsChange={(docs) => setFormData({ ...formData, documentos_processo: docs as DocumentoArquivo[] })}
                  bucketName="documentos_processo"
                  entityId={editingProcesso?.id}
                  uploadLabel="Adicionar Documento"
                  showUploadButton={true}
                  readOnly={false}
                />
              </div>

              {/* Links do Processo - CrudListManager */}
              <CrudListManager
                title="Links do Processo"
                icon={<LinkIcon size={20} />}
                color="blue"
                items={linksCrud.items}
                tempItem={linksCrud.tempItem}
                setTempItem={linksCrud.setTempItem}
                editingIndex={linksCrud.editingIndex}
                isEditing={linksCrud.isEditing}
                showAddModal={showLinksModal}
                setShowAddModal={setShowLinksModal}
                showViewModal={showLinksViewModal}
                setShowViewModal={setShowLinksViewModal}
                onAdd={handleAddLink}
                onUpdate={handleUpdateLink}
                onDelete={linksCrud.deleteItem}
                onEdit={linksCrud.startEdit}
                onCancelEdit={linksCrud.cancelEdit}
                fields={[
                  { name: 'titulo', label: 'Título do Link', type: 'text', placeholder: 'Ex: Consulta processo TJ-SP', required: true },
                  { name: 'link', label: 'URL do Link', type: 'url', placeholder: 'https://...', required: true },
                ]}
                renderItem={(link, index) => (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <LinkIcon size={16} className="text-blue-600 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-900">Link #{index + 1}</p>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{link.titulo}</p>
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1 break-all"
                    >
                      <ExternalLink size={12} />
                      {link.link}
                    </a>
                  </div>
                )}
                canEdit={canEdit}
                addButtonText="Adicionar Link"
                emptyText="Nenhum link adicionado"
                confirmDeleteText="Deseja realmente remover este link?"
              />

              {/* Jurisprudências - CrudListManager */}
              <CrudListManager
                title="Jurisprudências"
                icon={<Scale size={20} />}
                color="purple"
                items={jurisprudenciasCrud.items}
                tempItem={jurisprudenciasCrud.tempItem}
                setTempItem={jurisprudenciasCrud.setTempItem}
                editingIndex={jurisprudenciasCrud.editingIndex}
                isEditing={jurisprudenciasCrud.isEditing}
                showAddModal={showJurisprudenciaModal}
                setShowAddModal={setShowJurisprudenciaModal}
                showViewModal={showJurisprudenciaViewModal}
                setShowViewModal={setShowJurisprudenciaViewModal}
                onAdd={handleAddJurisprudencia}
                onUpdate={handleUpdateJurisprudencia}
                onDelete={jurisprudenciasCrud.deleteItem}
                onEdit={jurisprudenciasCrud.startEdit}
                onCancelEdit={jurisprudenciasCrud.cancelEdit}
                fields={[
                  { name: 'ementa', label: 'Ementa da Jurisprudência', type: 'textarea', placeholder: 'Digite a ementa da jurisprudência...', required: true, fullWidth: true },
                  { name: 'link', label: 'Link da Jurisprudência', type: 'url', placeholder: 'https://...', required: true, fullWidth: true },
                ]}
                renderItem={(juris, index) => (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Scale size={14} className="text-purple-600 flex-shrink-0" />
                      <span className="text-sm font-bold text-purple-900">Jurisprudência #{index + 1}</span>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 mb-2">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{juris.ementa}</p>
                    </div>
                    <a
                      href={juris.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-600 hover:underline flex items-center gap-1 break-all"
                    >
                      <ExternalLink size={10} />
                      {juris.link}
                    </a>
                  </div>
                )}
                canEdit={canEdit}
                addButtonText="Adicionar Jurisprudência"
                emptyText="Nenhuma jurisprudência adicionada"
                confirmDeleteText="Deseja realmente remover esta jurisprudência?"
              />

              {/* Audiências - CrudListManager */}
              <CrudListManager
                title="Audiências"
                icon={<Calendar size={20} />}
                color="indigo"
                items={audienciasCrud.items}
                tempItem={audienciasCrud.tempItem}
                setTempItem={audienciasCrud.setTempItem}
                editingIndex={audienciasCrud.editingIndex}
                isEditing={audienciasCrud.isEditing}
                showAddModal={showAudienciaModal}
                setShowAddModal={setShowAudienciaModal}
                showViewModal={showAudienciaViewModal}
                setShowViewModal={setShowAudienciaViewModal}
                onAdd={handleAddAudiencia}
                onUpdate={handleUpdateAudiencia}
                onDelete={audienciasCrud.deleteItem}
                onEdit={audienciasCrud.startEdit}
                onCancelEdit={audienciasCrud.cancelEdit}
                fields={[
                  { name: 'data', label: 'Data da Audiência', type: 'date', required: true },
                  { name: 'horario', label: 'Horário', type: 'time', required: true },
                  { name: 'tipo', label: 'Tipo', type: 'text', placeholder: 'Ex: Conciliação, Instrução', required: true },
                  { name: 'forma', label: 'Forma', type: 'text', placeholder: 'Ex: Presencial, Virtual', required: true },
                  { name: 'lugar', label: 'Local', type: 'text', placeholder: 'Ex: Sala 201 - Forum Cível', required: true, fullWidth: true },
                ]}
                renderItem={(audiencia) => (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar size={18} className="text-indigo-600 flex-shrink-0" />
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(audiencia.data + 'T00:00:00').toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: '2-digit', 
                          year: 'numeric' 
                        })} às {audiencia.horario}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700 ml-7">
                      <p><span className="font-medium">Tipo:</span> {audiencia.tipo}</p>
                      <p><span className="font-medium">Forma:</span> {audiencia.forma}</p>
                      <p className="col-span-2"><span className="font-medium">Local:</span> 📍 {audiencia.lugar}</p>
                    </div>
                  </div>
                )}
                canEdit={canEdit}
                addButtonText="Adicionar Audiência"
                emptyText="Nenhuma audiência agendada"
                confirmDeleteText="Deseja realmente remover esta audiência?"
              />

              {/* Información de Auditoría */}
              {editingProcesso && (
                <AuditInfo
                  creadoPor={editingProcesso.creado_por}
                  atualizadoPor={editingProcesso.atualizado_por}
                  dataCriacao={editingProcesso.data_criacao}
                  dataAtualizacao={editingProcesso.data_atualizacao}
                />
              )}

      </FormModal>

      {/* Modal de redirecionamento para cadastro de cliente */}
      {showNewClienteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Cadastrar Novo Cliente</h2>
            
            <form onSubmit={handleCreateCliente} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  value={newClienteForm.nome_completo}
                  onChange={(e) => setNewClienteForm({...newClienteForm, nome_completo: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Celular *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(xx) xxxxx-xxxx"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    value={newClienteForm.celular}
                    onChange={(e) => setNewClienteForm({...newClienteForm, celular: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    value={newClienteForm.email}
                    onChange={(e) => setNewClienteForm({...newClienteForm, email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  value={newClienteForm.status}
                  onChange={(e) => setNewClienteForm({...newClienteForm, status: e.target.value as 'ativo' | 'inativo' | 'potencial'})}
                >
                  <option value="ativo">Ativo</option>
                  <option value="potencial">Potencial</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <AccessibleButton
                  type="button"
                  onClick={() => {
                    setShowNewClienteModal(false)
                    setShowCreateForm(true)
                    setNewClienteForm({
                      nome_completo: '',
                      celular: '',
                      email: '',
                      status: 'ativo'
                    })
                  }}
                  variant="ghost"
                  size="lg"
                  aria-label="Cancelar cadastro de cliente"
                  className="flex-1 border-2 border-gray-300"
                >
                  Cancelar
                </AccessibleButton>
                <AccessibleButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  aria-label="Criar novo cliente"
                  className="flex-1"
                >
                  Criar Cliente
                </AccessibleButton>
              </div>
            </form>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Para cadastrar dados completos, acesse <Link to="/admin/clientes" className="text-primary-600 hover:underline">Gestão de Clientes</Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização de Processo */}
      <ViewModal
        isOpen={!!viewingProcesso}
        onClose={() => setViewingProcesso(null)}
        title="Detalhes do Processo"
        onEdit={() => {
          if (viewingProcesso) {
            handleEditProcesso(viewingProcesso)
            setViewingProcesso(null)
          }
        }}
        maxWidth="5xl"
      >
        {viewingProcesso && (
          <>
                {/* Seção 1: Informações Principais - Grid Compacto */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Informações Principais</h3>
                    <div className={cn(
                      "inline-flex px-3 py-1.5 rounded-full text-sm font-semibold border-2 items-center gap-2",
                      viewingProcesso.status === 'em_aberto' && 'bg-blue-100 text-blue-800 border-blue-300',
                      viewingProcesso.status === 'em_andamento' && 'bg-yellow-100 text-yellow-800 border-yellow-300',
                      viewingProcesso.status === 'fechado' && 'bg-green-100 text-green-800 border-green-300'
                    )}>
                      {viewingProcesso.status === 'em_aberto' && <AlertCircle size={16} />}
                      {viewingProcesso.status === 'em_andamento' && <Clock size={16} />}
                      {viewingProcesso.status === 'fechado' && <CheckCircle size={16} />}
                      {viewingProcesso.status === 'em_aberto' ? 'Em Aberto' : 
                       viewingProcesso.status === 'em_andamento' ? 'Em Andamento' : 'Fechado'}
                    </div>
                  </div>

                  {/* Grid responsivo de campos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {viewingProcesso.numero_processo && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Nº Processo</div>
                        <div className="text-sm font-bold text-gray-900">{viewingProcesso.numero_processo}</div>
                      </div>
                    )}

                    {viewingProcesso.area_direito && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Área do Direito</div>
                        <div className="text-sm font-medium text-gray-900">{viewingProcesso.area_direito}</div>
                      </div>
                    )}

                    {viewingProcesso.prioridade && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Prioridade</div>
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold",
                          viewingProcesso.prioridade === 'urgente' && 'bg-red-100 text-red-800',
                          viewingProcesso.prioridade === 'alta' && 'bg-orange-100 text-orange-800',
                          viewingProcesso.prioridade === 'media' && 'bg-yellow-100 text-yellow-800',
                          viewingProcesso.prioridade === 'baixa' && 'bg-green-100 text-green-800'
                        )}>
                          {viewingProcesso.prioridade.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {viewingProcesso.valor_causa && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Valor da Causa</div>
                        <div className="text-sm font-bold text-green-700">
                          R$ {parseFloat(viewingProcesso.valor_causa.toString()).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    )}

                    {viewingProcesso.polo && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Pólo</div>
                        <div className="text-sm font-medium text-gray-900">
                          {viewingProcesso.polo === 'ativo' ? '👤 Ativo (Autor)' : '⚖️ Passivo (Réu)'}
                        </div>
                      </div>
                    )}

                    {viewingProcesso.competencia && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Competência</div>
                        <div className="text-sm font-medium text-gray-900 capitalize">{viewingProcesso.competencia}</div>
                      </div>
                    )}

                    {viewingProcesso.usuarios?.nome && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm sm:col-span-2 lg:col-span-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                          <User size={12} />
                          Advogado
                        </div>
                        <div className="text-sm font-medium text-gray-900">{viewingProcesso.usuarios.nome}</div>
                      </div>
                    )}
                  </div>

                  {/* Descrição */}
                  <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Descrição</div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {viewingProcesso.descricao}
                    </p>
                  </div>

                  {/* Atividade Pendente */}
                  {viewingProcesso.atividade_pendente && (
                    <div className="mt-4 bg-amber-50 p-4 rounded-lg border-2 border-amber-300 shadow-sm">
                      <div className="text-xs font-bold text-amber-800 uppercase mb-2 flex items-center gap-1">
                        <AlertCircle size={14} />
                        ⚠️ Atividade Pendente
                      </div>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap font-medium">
                        {viewingProcesso.atividade_pendente}
                      </p>
                    </div>
                  )}
                </div>

                {/* Seção 2: Cliente e Jurisdição - Grid Lado a Lado */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Cliente */}
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-4 sm:p-5 shadow-sm">
                    <h3 className="text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <User size={18} />
                      Cliente
                    </h3>
                    <div className="space-y-2">
                      {viewingProcesso.cliente_nome && (
                        <div className="bg-white p-3 rounded-lg border border-blue-100">
                          <div className="text-xs font-semibold text-blue-700 uppercase mb-1">Nome</div>
                          <div className="text-sm font-bold text-blue-900">{viewingProcesso.cliente_nome}</div>
                        </div>
                      )}
                      {viewingProcesso.cliente_email && (
                        <div className="bg-white p-3 rounded-lg border border-blue-100">
                          <div className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                            <Mail size={12} />
                            Email
                          </div>
                          <div className="text-sm text-blue-900 break-all">{viewingProcesso.cliente_email}</div>
                        </div>
                      )}
                      {viewingProcesso.cliente_telefone && (
                        <div className="bg-white p-3 rounded-lg border border-blue-100">
                          <div className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                            <Phone size={12} />
                            Telefone
                          </div>
                          <div className="text-sm font-medium text-blue-900">{viewingProcesso.cliente_telefone}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Jurisdição */}
                  {viewingProcesso.jurisdicao && (viewingProcesso.jurisdicao.uf || viewingProcesso.jurisdicao.municipio || viewingProcesso.jurisdicao.vara || viewingProcesso.jurisdicao.juiz) && (
                    <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 p-4 sm:p-5 shadow-sm">
                      <h3 className="text-base font-bold text-purple-900 mb-3 flex items-center gap-2">
                        <Scale size={18} />
                        Jurisdição
                      </h3>
                      <div className="space-y-2">
                        {viewingProcesso.jurisdicao.uf && (
                          <div className="bg-white p-3 rounded-lg border border-purple-100">
                            <div className="text-xs font-semibold text-purple-700 uppercase mb-1">UF</div>
                            <div className="text-sm font-bold text-purple-900">{viewingProcesso.jurisdicao.uf}</div>
                          </div>
                        )}
                        {viewingProcesso.jurisdicao.municipio && (
                          <div className="bg-white p-3 rounded-lg border border-purple-100">
                            <div className="text-xs font-semibold text-purple-700 uppercase mb-1">Município</div>
                            <div className="text-sm text-purple-900">{viewingProcesso.jurisdicao.municipio}</div>
                          </div>
                        )}
                        {viewingProcesso.jurisdicao.vara && (
                          <div className="bg-white p-3 rounded-lg border border-purple-100">
                            <div className="text-xs font-semibold text-purple-700 uppercase mb-1">Vara</div>
                            <div className="text-sm text-purple-900">{viewingProcesso.jurisdicao.vara}</div>
                          </div>
                        )}
                        {viewingProcesso.jurisdicao.juiz && (
                          <div className="bg-white p-3 rounded-lg border border-purple-100">
                            <div className="text-xs font-semibold text-purple-700 uppercase mb-1">Juiz(a)</div>
                            <div className="text-sm text-purple-900">{viewingProcesso.jurisdicao.juiz}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Seção 3: Honorários */}
                {viewingProcesso.honorarios && (viewingProcesso.honorarios.valor_honorarios || viewingProcesso.honorarios.detalhes) && (
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border-2 border-green-300 p-4 sm:p-5 shadow-md">
                    <h3 className="text-base font-bold text-green-900 mb-3 flex items-center gap-2">
                      💰 Honorários
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {viewingProcesso.honorarios.valor_honorarios && (
                        <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                          <div className="text-xs font-bold text-green-700 uppercase mb-1">Valor</div>
                          <div className="text-2xl font-bold text-green-700">
                            R$ {typeof viewingProcesso.honorarios.valor_honorarios === 'number' 
                              ? viewingProcesso.honorarios.valor_honorarios.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                              : viewingProcesso.honorarios.valor_honorarios}
                          </div>
                        </div>
                      )}
                      {viewingProcesso.honorarios.detalhes && (
                        <div className="bg-white p-4 rounded-lg border border-green-200">
                          <div className="text-xs font-bold text-green-700 uppercase mb-2">Detalhes</div>
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">
                            {viewingProcesso.honorarios.detalhes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Seção 4: Audiências */}
                {viewingProcesso.audiencias && viewingProcesso.audiencias.length > 0 && (
                  <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-200 p-4 sm:p-5 shadow-sm">
                    <h3 className="text-base font-bold text-indigo-900 mb-3 flex items-center gap-2">
                      <Calendar size={18} />
                      Audiências ({viewingProcesso.audiencias.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {viewingProcesso.audiencias.map((audiencia, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-indigo-200 hover:border-indigo-300 transition-colors">
                          <div className="flex items-center gap-2 mb-3">
                            <Calendar size={16} className="text-indigo-600 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="text-sm font-bold text-indigo-900">
                                {new Date(audiencia.data + 'T00:00:00').toLocaleDateString('pt-BR')} às {audiencia.horario}
                              </div>
                              <div className="text-xs text-gray-500 capitalize">
                                {new Date(audiencia.data + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long' })}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1.5 text-xs">
                            <div className="flex">
                              <span className="font-semibold text-gray-600 w-16">Tipo:</span>
                              <span className="text-gray-900">{audiencia.tipo}</span>
                            </div>
                            <div className="flex">
                              <span className="font-semibold text-gray-600 w-16">Forma:</span>
                              <span className="text-gray-900">{audiencia.forma}</span>
                            </div>
                            <div className="flex">
                              <span className="font-semibold text-gray-600 w-16">Local:</span>
                              <span className="text-gray-900">{audiencia.lugar}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção 5: Documentos */}
                {viewingProcesso.documentos_processo && viewingProcesso.documentos_processo.length > 0 && (
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
                    <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <FileText size={18} />
                      Documentos ({viewingProcesso.documentos_processo.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {viewingProcesso.documentos_processo.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all group">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <FileText size={16} className="text-primary-600 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate" title={doc.nome}>
                                {doc.nome}
                              </p>
                              <p className="text-xs text-gray-500">
                                {doc.tamanho && `${(doc.tamanho / 1024 / 1024).toFixed(2)} MB`}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleViewDocument(doc)}
                              className="p-1.5 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                              title="Visualizar"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadDocument(doc)}
                              className="p-1.5 text-primary-600 hover:bg-primary-100 rounded-md transition-colors"
                              title="Baixar"
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção 6: Links */}
                {viewingProcesso.links_processo && viewingProcesso.links_processo.length > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 p-4 sm:p-5 shadow-sm">
                    <h3 className="text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <LinkIcon size={18} />
                      Links do Processo ({viewingProcesso.links_processo.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {viewingProcesso.links_processo.map((link: ProcessoLink, index: number) => (
                        <a
                          key={index}
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:shadow-sm transition-all group"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <LinkIcon size={16} className="text-blue-600 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{link.titulo}</p>
                              <p className="text-xs text-blue-600 truncate">{link.link}</p>
                            </div>
                          </div>
                          <ExternalLink size={16} className="text-blue-600 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção 7: Jurisprudências */}
                {viewingProcesso.jurisprudencia && viewingProcesso.jurisprudencia.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 p-4 sm:p-5 shadow-sm">
                    <h3 className="text-base font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <Scale size={18} />
                      Jurisprudências ({viewingProcesso.jurisprudencia.length})
                    </h3>
                    <div className="space-y-3">
                      {viewingProcesso.jurisprudencia.map((juris: Jurisprudencia, index: number) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <Scale size={14} className="text-purple-600 flex-shrink-0" />
                              <span className="text-sm font-bold text-purple-900">Jurisprudência #{index + 1}</span>
                            </div>
                            <a
                              href={juris.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-purple-600 hover:bg-purple-100 rounded-md transition-colors flex-shrink-0"
                              title="Abrir link"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                              {juris.ementa}
                            </p>
                          </div>
                          <a
                            href={juris.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-purple-600 hover:underline flex items-center gap-1 mt-2 break-all"
                          >
                            <ExternalLink size={10} />
                            {juris.link}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Informações de Auditoria */}
              <AuditInfo
                creadoPor={viewingProcesso.creado_por}
                atualizadoPor={viewingProcesso.atualizado_por}
                dataCriacao={viewingProcesso.data_criacao}
                dataAtualizacao={viewingProcesso.data_atualizacao}
              />
          </>
        )}
      </ViewModal>
      </ResponsiveContainer>
    </div>
  )
}

export default ProcessosPage