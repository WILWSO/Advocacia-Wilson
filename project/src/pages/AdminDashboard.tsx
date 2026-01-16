import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, User, Calendar, AlertCircle, CheckCircle, Clock, Users, FileText, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useProcessos, useUsuarios, useAuth } from '../hooks/useSupabase'
import { ResponsiveContainer, ResponsiveGrid } from '../components/shared/ResponsiveGrid'
import { useResponsive } from '../hooks/useResponsive'
import { cn } from '../utils/cn'
import Header from '../components/layout/Header'
import { supabase } from '../lib/supabase'

// Componente para card de processo
const ProcessoCard: React.FC<{ 
  processo: any
  onEdit: (processo: any) => void 
  onStatusChange: (id: string, status: string) => void 
}> = ({ processo, onEdit, onStatusChange }) => {
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg text-primary-900 line-clamp-2">
            {processo.titulo}
          </h3>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1",
            getStatusColor(processo.status)
          )}>
            {getStatusIcon(processo.status)}
            {getStatusText(processo.status)}
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
            {new Date(processo.data_criacao).toLocaleDateString('pt-BR')}
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
            onClick={() => onEdit(processo)}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Editar
          </button>
          
          <select
            value={processo.status}
            onChange={(e) => onStatusChange(processo.id, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          >
            <option value="em_aberto">Em Aberto</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="fechado">Fechado</option>
          </select>
        </div>
      </div>
    </motion.div>
  )
}

// Componente principal da administração
const AdminDashboard: React.FC = () => {
  const { isMobile } = useResponsive()
  const { user } = useAuth()
  const { processos, loading, error, fetchProcessos, createProcesso, updateProcesso } = useProcessos()
  const { usuarios } = useUsuarios()

  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [filtroAdvogado, setFiltroAdvogado] = useState<string>('')
  const [busca, setBusca] = useState<string>('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingProcesso, setEditingProcesso] = useState<any>(null)
  const [clientes, setClientes] = useState<any[]>([])
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
    numero_processo: '',
    status: 'em_aberto',
    area_direito: '',
    prioridade: 'media',
    valor_causa: '',
    data_vencimento: ''
  })

  useEffect(() => {
    fetchProcessos()
    fetchClientes()
  }, [])

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
    const cleanedData = {
      ...formData,
      data_vencimento: formData.data_vencimento || null,
      valor_causa: formData.valor_causa || null,
      cliente_id: formData.cliente_id || null,
      advogado_responsavel: formData.advogado_responsavel || null,
      numero_processo: formData.numero_processo || null,
      area_direito: formData.area_direito || null,
      status: formData.status || 'em_aberto'
    }
    
    if (editingProcesso) {
      // Modo edición
      const resultado = await updateProcesso(editingProcesso.id, cleanedData)
      if (!resultado.error) {
        resetForm()
      }
    } else {
      // Modo creación
      const resultado = await createProcesso(cleanedData)

      if (!resultado.error) {
        resetForm()
      }
    }
  }

  const handleEditProcesso = (processo: any) => {
    setEditingProcesso(processo)
    setFormData({
      titulo: processo.titulo || '',
      descricao: processo.descricao || '',
      advogado_responsavel: processo.advogado_responsavel || '',
      cliente_id: processo.cliente_id || '',
      numero_processo: processo.numero_processo || '',
      status: processo.status || 'em_aberto',
      area_direito: processo.area_direito || '',
      prioridade: processo.prioridade || 'media',
      valor_causa: processo.valor_causa || '',
      data_vencimento: processo.data_vencimento || ''
    })
    setShowCreateForm(true)
  }

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      advogado_responsavel: '',
      cliente_id: '',
      numero_processo: '',
      status: 'em_aberto',
      area_direito: '',
      prioridade: 'media',
      valor_causa: '',
      data_vencimento: ''
    })
    setEditingProcesso(null)
    setShowCreateForm(false)
  }

  const handleStatusChange = async (id: string, status: string) => {
    await updateProcesso(id, { status })
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
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
            {processosFiltrados.map(processo => (
              <ProcessoCard
                key={processo.id}
                processo={processo}
                onEdit={handleEditProcesso}
                onStatusChange={handleStatusChange}
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

      {/* Modal de criar processo (simplificado) */}
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

          <form onSubmit={handleCreateProcesso} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  value={formData.titulo}
                  onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição *
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="em_aberto">Em Aberto</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="fechado">Fechado</option>
                  </select>
                </div>
                
                <div className="md:col-span-2 xl:col-span-1">
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
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridade
                  </label>
                  <select
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
              </div>

              <div>
                <h4 className="text-md font-semibold text-gray-700 mb-3">Cliente</h4>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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

                <div className="xl:col-span-2">
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
                  onChange={(e) => setNewClienteForm({...newClienteForm, status: e.target.value as any})}
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
      </div>
    </div>
  )
}

export default AdminDashboard