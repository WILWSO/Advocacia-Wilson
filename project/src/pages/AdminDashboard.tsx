import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, User, Calendar, AlertCircle, CheckCircle, Clock, X, Eye, FileText, Upload, Download, Trash2, Mail, Phone, Link as LinkIcon, Scale, ExternalLink, Edit2, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProcessos, useUsuarios, useAuth } from '../hooks/useSupabase'
import { ResponsiveContainer } from '../components/shared/ResponsiveGrid'
import { useResponsive } from '../hooks/useResponsive'
import { cn } from '../utils/cn'
import Header from '../components/layout/Header'
import { supabase, ProcessoJuridico, DocumentoArquivo } from '../lib/supabase'
import { AuditInfo } from '../components/shared/AuditInfo'

// Tipos para los nuevos campos JSONB
interface ProcessoLink {
  titulo: string
  link: string
}

interface Jurisprudencia {
  ementa: string
  link: string
}

// Componente para card de processo
const ProcessoCard: React.FC<{ 
  processo: ProcessoJuridico & { usuarios?: { nome: string }; cliente_nome?: string }
  onEdit: (processo: ProcessoJuridico & { usuarios?: { nome: string }; cliente_nome?: string }) => void 
  onView: (processo: ProcessoJuridico & { usuarios?: { nome: string }; cliente_nome?: string }) => void
  canEdit: boolean
  index: number
}> = ({ processo, onEdit, onView, canEdit, index }) => {
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
          
          {canEdit && (
            <button
              onClick={() => onEdit(processo)}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Editar
            </button>
          )}
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
  const isAdmin = user?.role === 'admin'
  const isAdvogado = user?.role === 'advogado'
  const isAssistente = user?.role === 'assistente'
  const canEdit = isAdmin || isAdvogado || isAssistente
  // const canDelete = isAdmin // No hay función de eliminar procesos en esta página
  
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
    audiencias: [] as Array<{ data: string; assunto: string; lugar: string }>,
    documentos_processo: [] as DocumentoArquivo[],
    links_processo: [] as ProcessoLink[],
    jurisprudencia: [] as Jurisprudencia[]
  })
  
  // Estados para gestionar links y jurisprudencias
  const [newLink, setNewLink] = useState({ titulo: '', url: '' })
  const [editingLinkIndex, setEditingLinkIndex] = useState<number | null>(null)
  const [newJurisprudencia, setNewJurisprudencia] = useState({ ementa: '', link: '' })
  const [editingJurisprudenciaIndex, setEditingJurisprudenciaIndex] = useState<number | null>(null)
  
  // Estados para gestionar audiencias
  const [newAudiencia, setNewAudiencia] = useState({ data: '', horario: '', tipo: '', forma: '', lugar: '' })
  const [editingAudienciaIndex, setEditingAudienciaIndex] = useState<number | null>(null)
  
  const [uploadingFile, setUploadingFile] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showLinksModal, setShowLinksModal] = useState(false)
  const [showLinksViewModal, setShowLinksViewModal] = useState(false)
  const [showDocumentViewModal, setShowDocumentViewModal] = useState(false)
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

      // Subir archivo al bucket con opciones para visualización inline
      const { error: uploadError } = await supabase.storage
        .from('documentos_processo')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
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

  // Función para visualizar documento (solo visualizar, no descargar)
  const handleViewDocument = async (doc: DocumentoArquivo) => {
    try {
      // Extraer path del URL
      const urlParts = doc.url.split('/documentos_processo/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]

        // Descargar archivo como Blob para evitar headers de descarga del servidor
        const { data: fileBlob, error } = await supabase.storage
          .from('documentos_processo')
          .download(filePath)

        if (error) throw error

        if (fileBlob) {
          // Crear URL local del blob con el tipo MIME correcto
          const blobUrl = URL.createObjectURL(
            new Blob([fileBlob], { type: doc.tipo || fileBlob.type })
          )
          
          // Abrir en nueva pestaña - se visualizará inline
          window.open(blobUrl, '_blank')
          
          // Limpiar URL después de 1 minuto
          setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
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

  // Funciones para manejar links do processo
  const handleAddLink = () => {
    if (!newLink?.titulo?.trim() || !newLink?.url?.trim()) {
      alert('Por favor, preencha o título e o link')
      return
    }

    setFormData({
      ...formData,
      links_processo: [...formData.links_processo, { titulo: newLink.titulo, link: newLink.url }]
    })
    setNewLink({ titulo: '', url: '' })
  }

  const handleEditLink = (index: number) => {
    const link = formData.links_processo[index]
    setNewLink({ titulo: link.titulo, url: link.link })
    setEditingLinkIndex(index)
  }

  const handleSaveLink = () => {
    if (!newLink?.titulo?.trim() || !newLink?.url?.trim()) {
      alert('Por favor, preencha o título e o link')
      return
    }

    if (editingLinkIndex !== null) {
      const updatedLinks = [...formData.links_processo]
      updatedLinks[editingLinkIndex] = { titulo: newLink.titulo, link: newLink.url }
      setFormData({ ...formData, links_processo: updatedLinks })
      setNewLink({ titulo: '', url: '' })
      setEditingLinkIndex(null)
    }
  }

  const handleCancelEditLink = () => {
    setNewLink({ titulo: '', url: '' })
    setEditingLinkIndex(null)
  }

  const handleDeleteLink = (index: number) => {
    if (!confirm('Deseja realmente remover este link?')) return
    
    const updatedLinks = formData.links_processo.filter((_, i) => i !== index)
    setFormData({ ...formData, links_processo: updatedLinks })
  }

  // Funciones para manejar jurisprudências
  const handleAddJurisprudencia = () => {
    if (!newJurisprudencia.ementa.trim() || !newJurisprudencia.link.trim()) {
      alert('Por favor, preencha a ementa e o link')
      return
    }

    setFormData({
      ...formData,
      jurisprudencia: [...formData.jurisprudencia, { ...newJurisprudencia }]
    })
    setNewJurisprudencia({ ementa: '', link: '' })
  }

  const handleEditJurisprudencia = (index: number) => {
    const juris = formData.jurisprudencia[index]
    setNewJurisprudencia({ ...juris })
    setEditingJurisprudenciaIndex(index)
  }

  const handleSaveJurisprudencia = () => {
    if (!newJurisprudencia.ementa.trim() || !newJurisprudencia.link.trim()) {
      alert('Por favor, preencha a ementa e o link')
      return
    }

    if (editingJurisprudenciaIndex !== null) {
      const updatedJuris = [...formData.jurisprudencia]
      updatedJuris[editingJurisprudenciaIndex] = { ...newJurisprudencia }
      setFormData({ ...formData, jurisprudencia: updatedJuris })
      setNewJurisprudencia({ ementa: '', link: '' })
      setEditingJurisprudenciaIndex(null)
    }
  }

  const handleCancelEditJurisprudencia = () => {
    setNewJurisprudencia({ ementa: '', link: '' })
    setEditingJurisprudenciaIndex(null)
  }

  const handleDeleteJurisprudencia = (index: number) => {
    if (!confirm('Deseja realmente remover esta jurisprudência?')) return
    
    const updatedJuris = formData.jurisprudencia.filter((_, i) => i !== index)
    setFormData({ ...formData, jurisprudencia: updatedJuris })
  }

  // Funciones para manejar audiências
  const handleAddAudiencia = () => {
    if (!newAudiencia.data.trim() || !newAudiencia.horario.trim() || !newAudiencia.tipo.trim() || !newAudiencia.forma.trim() || !newAudiencia.lugar.trim()) {
      alert('Por favor, preencha todos os campos da audiência')
      return
    }

    setFormData({
      ...formData,
      audiencias: [...formData.audiencias, { ...newAudiencia }]
    })
    setNewAudiencia({ data: '', horario: '', tipo: '', forma: '', lugar: '' })
  }

  const handleEditAudiencia = (index: number) => {
    const audiencia = formData.audiencias[index]
    setNewAudiencia({ ...audiencia })
    setEditingAudienciaIndex(index)
  }

  const handleSaveAudiencia = () => {
    if (!newAudiencia.data.trim() || !newAudiencia.horario.trim() || !newAudiencia.tipo.trim() || !newAudiencia.forma.trim() || !newAudiencia.lugar.trim()) {
      alert('Por favor, preencha todos os campos da audiência')
      return
    }

    if (editingAudienciaIndex !== null) {
      const updatedAudiencias = [...formData.audiencias]
      updatedAudiencias[editingAudienciaIndex] = { ...newAudiencia }
      setFormData({ ...formData, audiencias: updatedAudiencias })
      setNewAudiencia({ data: '', horario: '', tipo: '', forma: '', lugar: '' })
      setEditingAudienciaIndex(null)
    }
  }

  const handleCancelEditAudiencia = () => {
    setNewAudiencia({ data: '', horario: '', tipo: '', forma: '', lugar: '' })
    setEditingAudienciaIndex(null)
  }

  const handleDeleteAudiencia = (index: number) => {
    if (!confirm('Deseja realmente remover esta audiência?')) return
    
    const updatedAudiencias = formData.audiencias.filter((_, i) => i !== index)
    setFormData({ ...formData, audiencias: updatedAudiencias })
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
    
    // Verificar permisos
    if (!canEdit) {
      alert('Você não tem permissão para criar ou editar processos');
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
      polo: (processo.polo as 'ativo' | 'passivo') || '',
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
      audiencias: processo.audiencias || [],
      documentos_processo: processo.documentos_processo || [],
      links_processo: processo.links_processo || [],
      jurisprudencia: processo.jurisprudencia || []
    })
    setShowCreateForm(true)
  }

  const resetForm = () => {
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
    setNewLink({ titulo: '', link: '' })
    setEditingLinkIndex(null)
    setNewJurisprudencia({ ementa: '', link: '' })
    setEditingJurisprudenciaIndex(null)
    setNewAudiencia({ data: '', horario: '', tipo: '', forma: '', lugar: '' })
    setEditingAudienciaIndex(null)
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
              {canEdit && (
                <div>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Plus size={16} />
                    Novo Processo
                  </button>
                </div>
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
                      onChange={(e) => setFormData({...formData, competencia: e.target.value})}
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FileText size={20} />
                    Documentos do Processo
                  </h3>
                  
                  <div className="flex gap-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer">
                      <Upload size={18} />
                      Selecionar Arquivo
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, editingProcesso?.id)}
                        disabled={uploadingFile}
                      />
                    </label>
                    
                    {formData.documentos_processo && formData.documentos_processo.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowDocumentViewModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-300"
                      >
                        <Eye size={18} />
                        Ver ({formData.documentos_processo.length})
                      </button>
                    )}
                  </div>
                </div>

                {uploadingFile && (
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{uploadProgress}% enviado</p>
                  </div>
                )}

                {/* Modal para Ver Documentos */}
                {showDocumentViewModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Documentos Anexados ({formData.documentos_processo?.length || 0})
                        </h3>
                        <button
                          onClick={() => setShowDocumentViewModal(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {formData.documentos_processo && formData.documentos_processo.length > 0 ? (
                          formData.documentos_processo.map((doc: DocumentoArquivo, index: number) => (
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
                                  disabled={!canEdit}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">
                            Nenhum documento anexado
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Links do Processo */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <LinkIcon size={20} />
                    Links do Processo
                  </h3>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowLinksModal(true)}
                      disabled={!canEdit}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Plus size={18} />
                      Adicionar Link
                    </button>
                    
                    {formData.links_processo && formData.links_processo.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowLinksViewModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-300"
                      >
                        <Eye size={18} />
                        Ver ({formData.links_processo.length})
                      </button>
                    )}
                  </div>
                </div>

                {/* Modal para Adicionar/Editar Link */}
                {showLinksModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <LinkIcon size={20} />
                          {editingLinkIndex === null ? 'Adicionar Link' : 'Editar Link'}
                        </h4>
                        <button
                          onClick={() => {
                            setShowLinksModal(false);
                            setNewLink({ titulo: '', url: '' });
                            setEditingLinkIndex(null);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Título do Link
                          </label>
                          <input
                            type="text"
                            value={newLink?.titulo || ''}
                            onChange={(e) => setNewLink({ ...newLink, titulo: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ex: Consulta processo TJ-SP"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL do Link
                          </label>
                          <input
                            type="url"
                            value={newLink?.url || ''}
                            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://..."
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          {editingLinkIndex === null ? (
                            <>
                              <button
                                onClick={() => {
                                  setShowLinksModal(false);
                                  setNewLink({ titulo: '', url: '' });
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => {
                                  handleAddLink();
                                  setShowLinksModal(false);
                                }}
                                disabled={!newLink?.titulo?.trim() || !newLink?.url?.trim()}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Salvar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  handleCancelEditLink();
                                  setShowLinksModal(false);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => {
                                  handleSaveLink();
                                  setShowLinksModal(false);
                                }}
                                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                              >
                                Salvar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal para Ver Links */}
                {showLinksViewModal && formData.links_processo.length > 0 && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <LinkIcon size={20} />
                          Links do Processo ({formData.links_processo.length})
                        </h4>
                        <button
                          onClick={() => setShowLinksViewModal(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {formData.links_processo.map((link, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors group">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <LinkIcon size={16} className="text-blue-600 flex-shrink-0" />
                                  <p className="text-sm font-medium text-gray-900">
                                    Link #{index + 1}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">
                                  {link.titulo}
                                </p>
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
                              {canEdit && (
                                <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleEditLink(index);
                                      setShowLinksViewModal(false);
                                      setShowLinksModal(true);
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                                    title="Editar link"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLink(index)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                    title="Remover link"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Gestión de Jurisprudências */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Scale size={20} />
                    Jurisprudências
                  </h3>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowJurisprudenciaModal(true)}
                      disabled={!canEdit}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Plus size={18} />
                      Adicionar Jurisprudência
                    </button>
                    
                    {formData.jurisprudencia && formData.jurisprudencia.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowJurisprudenciaViewModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-300"
                      >
                        <Eye size={18} />
                        Ver ({formData.jurisprudencia.length})
                      </button>
                    )}
                  </div>
                </div>

                {/* Modal para Adicionar/Editar Jurisprudência */}
                {showJurisprudenciaModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <Scale size={20} />
                          {editingJurisprudenciaIndex === null ? 'Adicionar Jurisprudência' : 'Editar Jurisprudência'}
                        </h4>
                        <button
                          onClick={() => {
                            setShowJurisprudenciaModal(false);
                            setNewJurisprudencia({ ementa: '', link: '' });
                            setEditingJurisprudenciaIndex(null);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ementa da Jurisprudência
                          </label>
                          <textarea
                            value={newJurisprudencia.ementa}
                            onChange={(e) => setNewJurisprudencia({ ...newJurisprudencia, ementa: e.target.value })}
                            placeholder="Digite a ementa da jurisprudência..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Link da Jurisprudência
                          </label>
                          <input
                            type="url"
                            value={newJurisprudencia.link}
                            onChange={(e) => setNewJurisprudencia({ ...newJurisprudencia, link: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          {editingJurisprudenciaIndex === null ? (
                            <>
                              <button
                                onClick={() => {
                                  setShowJurisprudenciaModal(false);
                                  setNewJurisprudencia({ ementa: '', link: '' });
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => {
                                  handleAddJurisprudencia();
                                  setShowJurisprudenciaModal(false);
                                }}
                                disabled={!newJurisprudencia.ementa.trim() || !newJurisprudencia.link.trim()}
                                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Salvar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  handleCancelEditJurisprudencia();
                                  setShowJurisprudenciaModal(false);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => {
                                  handleSaveJurisprudencia();
                                  setShowJurisprudenciaModal(false);
                                }}
                                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                              >
                                Salvar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal para Ver Jurisprudências */}
                {showJurisprudenciaViewModal && formData.jurisprudencia.length > 0 && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <Scale size={20} />
                          Jurisprudências ({formData.jurisprudencia.length})
                        </h4>
                        <button
                          onClick={() => setShowJurisprudenciaViewModal(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {formData.jurisprudencia.map((juris: Jurisprudencia, index: number) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors group">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Scale size={16} className="text-purple-600 flex-shrink-0" />
                                  <p className="text-sm font-medium text-gray-900">
                                    Jurisprudência #{index + 1}
                                  </p>
                                </div>
                                <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">
                                  {juris.ementa}
                                </p>
                                <a
                                  href={juris.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-purple-600 hover:underline flex items-center gap-1 break-all"
                                >
                                  <ExternalLink size={12} />
                                  {juris.link}
                                </a>
                              </div>
                              {canEdit && (
                                <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleEditJurisprudencia(index);
                                      setShowJurisprudenciaViewModal(false);
                                      setShowJurisprudenciaModal(true);
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                                    title="Editar jurisprudência"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteJurisprudencia(index)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                    title="Remover jurisprudência"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Gestión de Audiências */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Calendar size={20} />
                    Audiências
                  </h3>
                  
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAudienciaModal(true)}
                      disabled={!canEdit}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <Plus size={18} />
                      Adicionar Audiência
                    </button>
                    
                    {formData.audiencias && formData.audiencias.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAudienciaViewModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors border border-gray-300"
                      >
                        <Eye size={18} />
                        Ver ({formData.audiencias.length})
                      </button>
                    )}
                  </div>
                </div>

                {/* Modal para Adicionar/Editar Audiência */}
                {showAudienciaModal && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <Calendar size={20} />
                          {editingAudienciaIndex === null ? 'Adicionar Audiência' : 'Editar Audiência'}
                        </h4>
                        <button
                          onClick={() => {
                            setShowAudienciaModal(false);
                            setNewAudiencia({ data: '', horario: '', tipo: '', forma: '', lugar: '' });
                            setEditingAudienciaIndex(null);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Data da Audiência
                            </label>
                            <input
                              type="date"
                              value={newAudiencia.data}
                              onChange={(e) => setNewAudiencia({ ...newAudiencia, data: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Horário
                            </label>
                            <input
                              type="time"
                              value={newAudiencia.horario}
                              onChange={(e) => setNewAudiencia({ ...newAudiencia, horario: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Tipo
                            </label>
                            <input
                              type="text"
                              value={newAudiencia.tipo}
                              onChange={(e) => setNewAudiencia({ ...newAudiencia, tipo: e.target.value })}
                              placeholder="Ex: Conciliação, Instrução"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Forma
                            </label>
                            <input
                              type="text"
                              value={newAudiencia.forma}
                              onChange={(e) => setNewAudiencia({ ...newAudiencia, forma: e.target.value })}
                              placeholder="Ex: Presencial, Virtual"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Local
                          </label>
                          <input
                            type="text"
                            value={newAudiencia.lugar}
                            onChange={(e) => setNewAudiencia({ ...newAudiencia, lugar: e.target.value })}
                            placeholder="Ex: Sala 201 - Forum Cível"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          {editingAudienciaIndex === null ? (
                            <>
                              <button
                                onClick={() => {
                                  setShowAudienciaModal(false);
                                  setNewAudiencia({ data: '', horario: '', tipo: '', forma: '', lugar: '' });
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => {
                                  handleAddAudiencia();
                                  setShowAudienciaModal(false);
                                }}
                                disabled={!newAudiencia.data || !newAudiencia.horario || !newAudiencia.tipo}
                                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Salvar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  handleCancelEditAudiencia();
                                  setShowAudienciaModal(false);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => {
                                  handleSaveAudiencia();
                                  setShowAudienciaModal(false);
                                }}
                                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                              >
                                Salvar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal para Ver Audiências */}
                {showAudienciaViewModal && formData.audiencias.length > 0 && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                          <Calendar size={20} />
                          Audiências Agendadas ({formData.audiencias.length})
                        </h4>
                        <button
                          onClick={() => setShowAudienciaViewModal(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={24} />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {formData.audiencias.map((audiencia, index) => (
                          <div key={index} className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors group">
                            <div className="flex items-start justify-between gap-3">
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
                              {canEdit && (
                                <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleEditAudiencia(index);
                                      setShowAudienciaViewModal(false);
                                      setShowAudienciaModal(true);
                                    }}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                                    title="Editar audiência"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAudiencia(index)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                                    title="Remover audiência"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Información de Auditoría */}
              {editingProcesso && (
                <AuditInfo
                  creadoPor={editingProcesso.creado_por}
                  atualizadoPor={editingProcesso.atualizado_por}
                  dataCriacao={editingProcesso.data_criacao}
                  dataAtualizacao={editingProcesso.data_atualizacao}
                />
              )}

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
                  disabled={!canEdit}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors duration-200 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                  title={!canEdit ? 'Você não tem permissão para criar ou editar processos' : ''}
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
            className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Cabeçalho fixo */}
            <div className="px-4 sm:px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-gradient-to-r from-primary-600 to-primary-700 text-white flex-shrink-0">
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold truncate">
                  Detalhes do Processo
                </h2>
                <p className="text-sm text-primary-100 truncate mt-0.5">
                  {viewingProcesso.titulo}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingProcesso(null)}
                className="p-2 rounded-full hover:bg-white/20 transition-colors flex-shrink-0 ml-4"
                aria-label="Fechar"
              >
                <X size={24} />
              </button>
            </div>

            {/* Conteúdo scrollável */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-6">
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
              </div>
            </div>

            {/* Botones de acción fijos en el footer */}
            <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50 flex gap-3 flex-shrink-0">
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
          </motion.div>
        </div>
      )}
    </div>
  </div>
  )
}

export default AdminDashboard