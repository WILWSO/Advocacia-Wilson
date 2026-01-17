import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, User, Calendar, AlertCircle, CheckCircle, Clock, X, Eye, FileText, Upload, Download, Trash2, Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProcessos, useUsuarios, useAuth } from '../hooks/useSupabase'
import { ResponsiveContainer } from '../components/shared/ResponsiveGrid'
import { useResponsive } from '../hooks/useResponsive'
import { cn } from '../utils/cn'
import Header from '../components/layout/Header'
import { supabase, ProcessoJuridico, DocumentoArquivo } from '../lib/supabase'

// Componente para card de processo
const ProcessoCard: React.FC<{ 
  processo: ProcessoJuridico & { usuarios?: { nome: string }; cliente_nome?: string }
  onEdit: (processo: ProcessoJuridico & { usuarios?: { nome: string }; cliente_nome?: string }) => void 
  onView: (processo: ProcessoJuridico & { usuarios?: { nome: string }; cliente_nome?: string }) => void
  index: number
}> = ({ processo, onEdit, onView, index }) => {
  const { isMobile } = useResponsive()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_aberto': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'em_andamento': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'fechado': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em_aberto': return <AlertCircle size={16} />
      case 'em_andamento': return <Clock size={16} />
      case 'fechado': return <CheckCircle size={16} />
      default: return <AlertCircle size={16} />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'em_aberto': return 'Em Aberto'
      case 'em_andamento': return 'Em Andamento'
      case 'fechado': return 'Fechado'
      default: return status
    }
  }

  const getPrioridadeColor = (prioridade?: string) => {
    switch (prioridade) {
      case 'urgente': return 'bg-red-100 text-red-800 border-red-300'
      case 'alta': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'media': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'baixa': return 'bg-gray-100 text-gray-700 border-gray-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getPrioridadeText = (prioridade?: string) => {
    switch (prioridade) {
      case 'urgente': return 'Urgente'
      case 'alta': return 'Alta'
      case 'media': return 'Média'
      case 'baixa': return 'Baixa'
      default: return 'Média'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: "easeOut"
      }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg text-primary-900 line-clamp-2 flex-1">
            {processo.titulo}
          </h3>
          <div className="flex flex-col gap-2 items-end ml-2">
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 whitespace-nowrap",
              getStatusColor(processo.status)
            )}>
              {getStatusIcon(processo.status)}
              {getStatusText(processo.status)}
            </div>
            {processo.prioridade && (
              <motion.div
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 whitespace-nowrap",
                  getPrioridadeColor(processo.prioridade),
                  processo.prioridade === 'urgente' && "shadow-lg shadow-red-300"
                )}
                animate={processo.prioridade === 'urgente' ? {
                  opacity: [1, 0.7, 1],
                  y: [0, -2, 0]
                } : {}}
                transition={processo.prioridade === 'urgente' ? {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                } : {}}
              >
                {getPrioridadeText(processo.prioridade)}
              </motion.div>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {processo.descricao}
        </p>

        <div className="space-y-2 mb-4">
          {processo.cliente_nome && (
            <div className="flex items-center text-sm text-gray-500">
              <User size={14} className="mr-2" />
              {processo.cliente_nome}
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={14} className="mr-2" />
            {processo.data_criacao ? new Date(processo.data_criacao).toLocaleDateString('pt-BR') : 'N/A'}
          </div>

          {processo.usuarios && (
            <div className="flex items-center text-sm text-gray-500">
              <User size={14} className="mr-2" />
              Responsável: {processo.usuarios.nome}
            </div>
          )}
        </div>

        <div className={cn(
          "flex gap-2",
          isMobile ? "flex-col" : "flex-row"
        )}>
          <button
            onClick={() => onView(processo)}
            className="flex-1 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
          >
            <Eye size={16} />
            Ver
          </button>
          
          <button
            onClick={() => onEdit(processo)}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Editar
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Componente Skeleton para loading
const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse">
      {/* Header con título y badges */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        </div>
        <div className="flex flex-col gap-2 items-end ml-2">
          <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      
      {/* Descripción */}
      <div className="mb-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
      
      {/* Info items */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex items-center">
          <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-40"></div>
        </div>
      </div>
      
      {/* Botones */}
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
        <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  )
}

// Componente principal da administración
const AdminDashboard: React.FC = () => {
  useResponsive()
  const { user } = useAuth()
  const { processos, loading, error, fetchProcessos, createProcesso, updateProcesso } = useProcessos()
  const { usuarios } = useUsuarios()

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
    cliente_email: '',
    cliente_telefone: '',
    numero_processo: '',
    status: 'em_aberto',
    area_direito: '',
    prioridade: 'media',
    valor_causa: '',
    data_vencimento: '',
    documentos_processo: [] as DocumentoArquivo[]
  })
  
  const [uploadingFile, setUploadingFile] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

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

  // Función para subir archivo a Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, processoId?: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamaño (50MB máximo)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      alert('O arquivo é muito grande. Tamanho máximo: 50MB')
      return
    }

    // Validar tipo de archivo
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ]
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não permitido. Use: PDF, DOC, DOCX, JPG, PNG')
      return
    }

    setUploadingFile(true)
    setUploadProgress(0)

    try {
      // Usar ID temporal si estamos creando un nuevo proceso
      const targetId = processoId || editingProcesso?.id || `temp-${Date.now()}`
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = `${targetId}/${fileName}`

      // Subir archivo al bucket
      const { error: uploadError } = await supabase.storage
        .from('documentos_processo')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('documentos_processo')
        .getPublicUrl(filePath)

      // Crear objeto documento
      const novoDocumento: DocumentoArquivo = {
        nome: file.name,
        url: urlData.publicUrl,
        tipo: file.type,
        tamanho: file.size,
        data_upload: new Date().toISOString()
      }

      // Agregar a la lista de documentos
      setFormData(prev => ({
        ...prev,
        documentos_processo: [...prev.documentos_processo, novoDocumento]
      }))

      setUploadProgress(100)
      alert('Documento enviado com sucesso!')
      
      // Reset input
      e.target.value = ''
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao enviar documento. Tente novamente.')
    } finally {
      setUploadingFile(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  // Función para visualizar documento (abrir en nueva pestaña)
  const handleViewDocument = async (doc: DocumentoArquivo) => {
    try {
      // Extraer path del URL
      const urlParts = doc.url.split('/documentos_processo/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        
        // Obtener URL firmada con mayor tiempo de expiración
        const { data, error } = await supabase.storage
          .from('documentos_processo')
          .createSignedUrl(filePath, 3600) // 1 hora

        if (error) throw error
        
        if (data?.signedUrl) {
          window.open(data.signedUrl, '_blank')
        } else {
          throw new Error('No se pudo generar la URL')
        }
      } else {
        // Si es URL pública directa, abrirla
        window.open(doc.url, '_blank')
      }
    } catch (error) {
      console.error('Erro ao visualizar documento:', error)
      alert('Erro ao visualizar documento')
    }
  }

  // Función para descargar documento
  const handleDownloadDocument = async (doc: DocumentoArquivo) => {
    try {
      // Extraer path del URL
      const urlParts = doc.url.split('/documentos_processo/')
      let downloadUrl = doc.url
      
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        
        // Obtener URL firmada
        const { data, error } = await supabase.storage
          .from('documentos_processo')
          .createSignedUrl(filePath, 60) // 1 minuto es suficiente para descarga

        if (error) throw error
        
        if (data?.signedUrl) {
          downloadUrl = data.signedUrl
        }
      }
      
      // Descargar usando fetch y blob para forzar descarga real
      const response = await fetch(downloadUrl)
      if (!response.ok) throw new Error('Error al obtener el archivo')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = doc.nome
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      
      // Limpiar después de un pequeño delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 100)
      
      // Feedback visual
      alert('Download iniciado com sucesso!')
    } catch (error) {
      console.error('Erro ao baixar documento:', error)
      alert('Erro ao baixar documento. Tente novamente.')
    }
  }

  // Función para eliminar documento
  const handleDeleteDocument = async (doc: DocumentoArquivo, index: number) => {
    if (!confirm(`Deseja realmente remover o documento "${doc.nome}"?`)) return

    try {
      // Extraer path del URL
      const urlParts = doc.url.split('/documentos_processo/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        
        // Eliminar del storage
        const { error } = await supabase.storage
          .from('documentos_processo')
          .remove([filePath])

        if (error) throw error
      }

      // Remover de la lista
      const newDocs = formData.documentos_processo.filter((_: DocumentoArquivo, i: number) => i !== index)
      setFormData({...formData, documentos_processo: newDocs})
      
      alert('Documento removido com sucesso!')
    } catch (error) {
      console.error('Erro ao remover documento:', error)
      alert('Erro ao remover documento')
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
      alert('Erro ao criar cliente. Por favor, tente novamente.')
    }
  }

  const handleCreateProcesso = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Limpiar datos: convertir strings vacíos en null para campos opcionales
    const cleanedData: Partial<ProcessoJuridico> = {
      titulo: formData.titulo,
      descricao: formData.descricao,
      status: formData.status as ProcessoJuridico['status'],
      advogado_responsavel: formData.advogado_responsavel || '',
      numero_processo: formData.numero_processo || undefined,
      cliente_id: formData.cliente_id || undefined,
      cliente_email: formData.cliente_email || undefined,
      cliente_telefone: formData.cliente_telefone || undefined,
      area_direito: formData.area_direito || undefined,
      prioridade: formData.prioridade,
      valor_causa: formData.valor_causa || undefined,
      data_vencimento: formData.data_vencimento || undefined,
      documentos_processo: formData.documentos_processo || [],
    }
    
    if (editingProcesso && editingProcesso.id) {
      // Modo edición
      const resultado = await updateProcesso(editingProcesso.id, cleanedData)
      if (!resultado.error) {
        resetForm()
      }
    } else {
      // Modo creación
      const resultado = await createProcesso(cleanedData as Omit<ProcessoJuridico, 'id'>)

      if (!resultado.error) {
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
      cliente_email: processo.cliente_email || '',
      cliente_telefone: processo.cliente_telefone || '',
      numero_processo: processo.numero_processo || '',
      status: processo.status || 'em_aberto',
      area_direito: processo.area_direito || '',
      prioridade: processo.prioridade || 'media',
      valor_causa: processo.valor_causa || '',
      data_vencimento: processo.data_vencimento || '',
      documentos_processo: processo.documentos_processo || []
    })
    setShowCreateForm(true)
  }

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      advogado_responsavel: '',
      cliente_id: '',
      cliente_email: '',
      cliente_telefone: '',
      numero_processo: '',
      status: 'em_aberto',
      area_direito: '',
      prioridade: 'media',
      valor_causa: '',
      data_vencimento: '',
      documentos_processo: []
    })
    setEditingProcesso(null)
    setShowCreateForm(false)
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
            <p className="text-gray-600">Faça login para acessar o painel administrativo.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-20">
        <ResponsiveContainer maxWidth="7xl" className="py-8">
        
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary-900 mb-2">
                  Painel Administrativo
                </h1>
                <p className="text-gray-600">
                  Gerencie processos jurídicos e acompanhe o andamento das atividades
                </p>
              </div>
              
              {/* Botão de novo processo */}
              <div>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus size={16} />
                  Novo Processo
                </button>
              </div>
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
      </ResponsiveContainer>

      {/* Modal de criar/editar processo */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
          <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-800">
                {editingProcesso ? 'Editar Processo' : 'Novo Processo'}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

          <form onSubmit={handleCreateProcesso} className="p-4 sm:p-6 space-y-6">
              {/* Seção 1: Informações Básicas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Informações Básicas
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título do Processo *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.titulo}
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      placeholder="Ex: Ação de Indenização por Danos Morais"
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
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 1001234-12.2024.8.07.0001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                        value={formData.numero_processo}
                        onChange={(e) => setFormData({...formData, numero_processo: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status *
                      </label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
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
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewClienteModal(true)
                          setShowCreateForm(false)
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-1"
                        title="Cadastrar novo cliente"
                      >
                        <Plus size={16} />
                        Novo
                      </button>
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
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.advogado_responsavel}
                      onChange={(e) => setFormData({...formData, advogado_responsavel: e.target.value})}
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Vencimento
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.data_vencimento}
                      onChange={(e) => setFormData({...formData, data_vencimento: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Seção 4: Documentos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                  <FileText size={20} />
                  Documentos do Processo
                </h3>
                <div className="space-y-4">
                  {/* Botão de Upload */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Upload size={20} className="text-blue-600 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-blue-900 font-medium mb-2">
                          Adicionar Documentos
                        </p>
                        <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md cursor-pointer transition-colors">
                          <Upload size={16} className="mr-2" />
                          {uploadingFile ? 'Enviando...' : 'Selecionar Arquivo'}
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e, editingProcesso?.id)}
                            disabled={uploadingFile}
                          />
                        </label>
                        {uploadingFile && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{uploadProgress}% enviado</p>
                          </div>
                        )}
                        <p className="text-xs text-blue-700 mt-2">
                          Formatos aceitos: PDF, DOC, DOCX, JPG, PNG • Tamanho máximo: 50MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lista de Documentos */}
                  {formData.documentos_processo && formData.documentos_processo.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Documentos Anexados ({formData.documentos_processo.length})
                      </h4>
                      <div className="space-y-2">
                        {formData.documentos_processo.map((doc: DocumentoArquivo, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <FileText size={18} className="text-gray-600 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 truncate" title={doc.nome}>
                                  {doc.nome}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {doc.tamanho ? `${(doc.tamanho / 1024 / 1024).toFixed(2)} MB` : 'Tamanho desconhecido'}
                                  {doc.data_upload && ` • ${new Date(doc.data_upload).toLocaleDateString('pt-BR')}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => handleViewDocument(doc)}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                                title="Visualizar documento"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadDocument(doc)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                                title="Baixar documento"
                              >
                                <Download size={16} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDocument(doc, index)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                title="Remover documento"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors duration-200 shadow-md"
                >
                  {editingProcesso ? 'Atualizar Processo' : 'Criar Processo'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

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
                <button
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
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Criar Cliente
                </button>
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
      {viewingProcesso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Cabeçalho */}
            <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-800">
                Detalhes do Processo
              </h2>
              <button
                type="button"
                onClick={() => setViewingProcesso(null)}
                className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Seção 1: Informações Básicas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Informações Básicas
                </h3>
                
                {/* Título e Status */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">Título</h4>
                    <p className="text-lg font-semibold text-primary-900">{viewingProcesso.titulo}</p>
                  </div>
                  <div className={cn(
                    "inline-flex px-3 py-1 rounded-full text-sm font-medium border items-center gap-2",
                    viewingProcesso.status === 'em_aberto' && 'bg-blue-100 text-blue-800 border-blue-200',
                    viewingProcesso.status === 'em_andamento' && 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    viewingProcesso.status === 'fechado' && 'bg-green-100 text-green-800 border-green-200'
                  )}>
                    {viewingProcesso.status === 'em_aberto' && <AlertCircle size={16} />}
                    {viewingProcesso.status === 'em_andamento' && <Clock size={16} />}
                    {viewingProcesso.status === 'fechado' && <CheckCircle size={16} />}
                    {viewingProcesso.status === 'em_aberto' ? 'Em Aberto' : 
                     viewingProcesso.status === 'em_andamento' ? 'Em Andamento' : 'Fechado'}
                  </div>
                </div>

                {/* Descrição */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-2">Descrição</h4>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {viewingProcesso.descricao}
                  </p>
                </div>

                {/* Grid de informações básicas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingProcesso.numero_processo && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Número do Processo</h4>
                      <p className="text-gray-900 font-medium">{viewingProcesso.numero_processo}</p>
                    </div>
                  )}

                  {viewingProcesso.area_direito && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Área do Direito</h4>
                      <p className="text-gray-900 font-medium">{viewingProcesso.area_direito}</p>
                    </div>
                  )}

                  {viewingProcesso.prioridade && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Prioridade</h4>
                      <p className="text-gray-900 font-medium capitalize">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          viewingProcesso.prioridade === 'urgente' && 'bg-red-100 text-red-800',
                          viewingProcesso.prioridade === 'alta' && 'bg-orange-100 text-orange-800',
                          viewingProcesso.prioridade === 'media' && 'bg-yellow-100 text-yellow-800',
                          viewingProcesso.prioridade === 'baixa' && 'bg-green-100 text-green-800'
                        )}>
                          {viewingProcesso.prioridade}
                        </span>
                      </p>
                    </div>
                  )}

                  {viewingProcesso.valor_causa && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Valor da Causa</h4>
                      <p className="text-gray-900 font-medium">
                        R$ {parseFloat(viewingProcesso.valor_causa.toString()).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  )}

                  {viewingProcesso.data_vencimento && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <Calendar size={14} />
                        Data de Vencimento
                      </h4>
                      <p className="text-gray-900 font-medium">
                        {new Date(viewingProcesso.data_vencimento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}

                  {viewingProcesso.usuarios?.nome && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <User size={14} />
                        Advogado Responsável
                      </h4>
                      <p className="text-gray-900 font-medium">{viewingProcesso.usuarios.nome}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Seção 2: Informações do Cliente */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Informações do Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingProcesso.cliente_nome && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                        <User size={14} />
                        Cliente
                      </h4>
                      <p className="text-blue-900 font-medium">{viewingProcesso.cliente_nome}</p>
                    </div>
                  )}

                  {viewingProcesso.cliente_email && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                        <Mail size={14} />
                        Email
                      </h4>
                      <p className="text-blue-900 font-medium">{viewingProcesso.cliente_email}</p>
                    </div>
                  )}

                  {viewingProcesso.cliente_telefone && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                        <Phone size={14} />
                        Telefone
                      </h4>
                      <p className="text-blue-900 font-medium">{viewingProcesso.cliente_telefone}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Seção 3: Documentos */}
              {viewingProcesso.documentos_processo && viewingProcesso.documentos_processo.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                    <FileText size={20} />
                    Documentos do Processo
                  </h3>
                  <div className="space-y-2">
                    {viewingProcesso.documentos_processo.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText size={18} className="text-primary-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate" title={doc.nome}>
                              {doc.nome}
                            </p>
                            <p className="text-xs text-gray-500">
                              {doc.tamanho && `${(doc.tamanho / 1024 / 1024).toFixed(2)} MB`}
                              {doc.data_upload && ` • ${new Date(doc.data_upload).toLocaleDateString('pt-BR')}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleViewDocument(doc)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                            title="Visualizar documento"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadDocument(doc)}
                            className="p-2 text-primary-600 hover:bg-primary-100 rounded-md transition-colors"
                            title="Baixar documento"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seção 4: Informações do Sistema */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Informações do Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingProcesso.data_criacao && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <Clock size={14} />
                        Data de Criação
                      </h4>
                      <p className="text-gray-900 font-medium">
                        {new Date(viewingProcesso.data_criacao).toLocaleDateString('pt-BR')} às {new Date(viewingProcesso.data_criacao).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                  )}

                  {viewingProcesso.data_atualizacao && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <Clock size={14} />
                        Última Atualização
                      </h4>
                      <p className="text-gray-900 font-medium">
                        {new Date(viewingProcesso.data_atualizacao).toLocaleDateString('pt-BR')} às {new Date(viewingProcesso.data_atualizacao).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setViewingProcesso(null)}
                  className="flex-1 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium transition-colors"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleEditProcesso(viewingProcesso)
                    setViewingProcesso(null)
                  }}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-md"
                >
                  Editar Processo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  </div>
  )
}

export default AdminDashboard