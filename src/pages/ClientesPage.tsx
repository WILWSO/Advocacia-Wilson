import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Edit3,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  FileText,
  Star,
  AlertCircle,
  Eye,
  Building2,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { supabase, DocumentoArquivo } from '../lib/supabase';
import { cn } from '../utils/cn';
import { ResponsiveContainer } from '../components/shared/ResponsiveGrid';
import { DocumentManager, DocumentItem } from '../components/admin/DocumentManager';
import { RestrictedInput, RestrictedSelect } from '../components/admin/RestrictedFormField';
import { AuditInfo } from '../components/shared/AuditInfo';
import { FormModal } from '../components/shared/modales/FormModal';
import { ViewModal } from '../components/shared/modales/ViewModal';
import { useNotification } from '../components/shared/notifications/NotificationContext';
import { useAuth } from '../hooks/useSupabase';
import { useInlineNotification } from '../hooks/useInlineNotification';
import { InlineNotification } from '../components/shared/notifications/InlineNotification';
import AccessibleButton from '../components/shared/buttons/AccessibleButton';

interface Cliente {
  id?: string;
  nome_completo: string;
  cpf_cnpj?: string;
  rg?: string;
  data_nascimento?: string;
  nacionalidade?: string;
  estado_civil?: 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel';
  profissao?: string;
  email?: string;
  telefone?: string;
  celular: string;
  telefone_alternativo?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  pais?: string;
  observacoes?: string;
  como_conheceu?: string;
  indicado_por?: string;
  status: 'ativo' | 'inativo' | 'potencial';
  categoria?: string;
  documentos_cliente?: DocumentoArquivo[];
  data_cadastro?: string;
  data_atualizacao?: string;
  ultimo_contato?: string;
}

const ClientesPage = () => {
  const { user: currentUser } = useAuth();
  const { notification, error: errorNotif, hide } = useInlineNotification();
  const { success: successToast, warning, confirm: confirmDialog } = useNotification(); // Toast global para mensajes de éxito
  const isAdmin = currentUser?.role === 'admin';
  const isAdvogado = currentUser?.role === 'advogado';
  const isAssistente = currentUser?.role === 'assistente';
  const canEdit = isAdmin || isAdvogado || isAssistente;
  const canDelete = isAdmin;
  
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [showModal, setShowModal] = useState(false);
  const [viewingCliente, setViewingCliente] = useState<Cliente | null>(null);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState<Cliente>({
    nome_completo: '',
    celular: '',
    status: 'ativo',
    pais: 'Brasil',
    documentos_cliente: []
  });

  // Carregar clientes
  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('data_cadastro', { ascending: false });

      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Criar ou atualizar cliente
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar permisos
    if (!canEdit) {
      warning('Você não tem permissão para editar clientes');
      return;
    }
    
    try {
      if (editingCliente?.id) {
        // Preparar dados para atualização
        const updates: Partial<Cliente> = { ...formData };
        
        // Solo admin puede cambiar status
        if (!isAdmin) {
          delete updates.status;
        }
        
        // Atualizar
        const { error } = await supabase
          .from('clientes')
          .update(updates)
          .eq('id', editingCliente.id);

        if (error) throw error;
      } else {
        // Criar
        const { error } = await supabase
          .from('clientes')
          .insert([formData]);

        if (error) throw error;
      }

      fetchClientes();
      handleCloseModal();
      
      // Mostrar éxito como toast global (fuera del modal)
      successToast('Cliente salvo com sucesso!');
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
      // Mensaje amigable al usuario, el error técnico queda en la consola
      errorNotif('Erro ao salvar cliente');
      // No cerrar el modal para que el usuario vea el error
    }
  };

  // Deletar cliente
  const handleDelete = async (id: string) => {
    // Verificar permisos
    if (!canDelete) {
      warning('Apenas administradores podem excluir clientes');
      return;
    }
    
    const confirmed = await confirmDialog({
      title: 'Excluir Cliente',
      message: 'Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchClientes();
      
      // Mostrar éxito como toast global
      successToast('Cliente excluído com sucesso!');
    } catch (error: any) {
      console.error('Erro ao deletar cliente:', error);
      // Mensaje amigable al usuario, el error técnico queda en la consola
      errorNotif('Erro ao deletar cliente');
    }
  };

  // Abrir modal para editar
  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData(cliente);
    setShowModal(true);
  };

  // Abrir modal para criar
  const handleCreate = () => {
    setEditingCliente(null);
    setFormData({
      nome_completo: '',
      celular: '',
      status: 'ativo',
      pais: 'Brasil',
      documentos_cliente: []
    });
    setShowModal(true);
  };

  // Abrir modal para visualizar
  const handleView = (cliente: Cliente) => {
    setViewingCliente(cliente);
  };

  // Funciones de gestión de documentos ahora manejadas por DocumentManager

  // Fechar modal
  const handleCloseModal = () => {
    hide(); // Limpiar notificaciones al cerrar modal
    setShowModal(false);
    setEditingCliente(null);
  };

  // Filtrar clientes
  const clientesFiltrados = clientes.filter(cliente => {
    const matchBusca = 
      cliente.nome_completo.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.email?.toLowerCase().includes(busca.toLowerCase()) ||
      cliente.cpf_cnpj?.includes(busca) ||
      cliente.celular?.includes(busca);

    const matchStatus = filtroStatus === 'todos' || cliente.status === filtroStatus;

    return matchBusca && matchStatus;
  });

  // Estatísticas
  const stats = {
    total: clientes.length,
    ativos: clientes.filter(c => c.status === 'ativo').length,
    potenciais: clientes.filter(c => c.status === 'potencial').length,
    inativos: clientes.filter(c => c.status === 'inativo').length
  };

  return (
    <div className="bg-neutral-50 min-h-full">
      {/* Header da página */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <ResponsiveContainer maxWidth="7xl" className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary-900 mb-2">Gestão de Clientes</h1>
                <p className="text-gray-600">
                  Gerencie cadastro e informações dos clientes
                </p>
              </div>
              
              {canEdit && (
                <AccessibleButton
                  category="create"
                  onClick={handleCreate}
                  aria-label="Criar novo cliente"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Novo Cliente
                </AccessibleButton>
              )}
            </div>
          </ResponsiveContainer>
        </div>

        {/* Conteúdo */}
        <ResponsiveContainer maxWidth="7xl" className="py-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
              <div className="text-2xl font-bold text-neutral-800">{stats.total}</div>
              <div className="text-sm text-neutral-600">Total de Clientes</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
              <div className="text-2xl font-bold text-green-700">{stats.ativos}</div>
              <div className="text-sm text-green-600">Ativos</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{stats.potenciais}</div>
              <div className="text-sm text-blue-600">Potenciais</div>
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg shadow-sm border border-neutral-300">
              <div className="text-2xl font-bold text-neutral-700">{stats.inativos}</div>
              <div className="text-sm text-neutral-600">Inativos</div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por nome, email, CPF/CNPJ ou telefone..."
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-neutral-500" />
                <select
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="ativo">Ativos</option>
                  <option value="potencial">Potenciais</option>
                  <option value="inativo">Inativos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Clientes */}
          {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-neutral-600 mt-4">Carregando clientes...</p>
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
            <Users size={48} className="mx-auto text-neutral-300 mb-4" />
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">
              Nenhum cliente encontrado
            </h3>
            <p className="text-neutral-500">
              {busca || filtroStatus !== 'todos'
                ? 'Tente ajustar os filtros de busca'
                : 'Comece cadastrando seu primeiro cliente'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientesFiltrados.map((cliente) => (
              <div
                key={cliente.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-200 overflow-hidden"
              >
                {/* Header do Card */}
                <div className={cn(
                  "p-4 border-b",
                  cliente.status === 'ativo' && 'bg-green-50 border-green-200',
                  cliente.status === 'potencial' && 'bg-blue-50 border-blue-200',
                  cliente.status === 'inativo' && 'bg-neutral-50 border-neutral-300'
                )}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-neutral-800 text-lg mb-1 flex items-center gap-2">
                        {cliente.categoria === 'VIP' && (
                          <Star size={16} className="text-gold-500" fill="currentColor" />
                        )}
                        {cliente.nome_completo}
                      </h3>
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                        cliente.status === 'ativo' && 'bg-green-100 text-green-700',
                        cliente.status === 'potencial' && 'bg-blue-100 text-blue-700',
                        cliente.status === 'inativo' && 'bg-neutral-100 text-neutral-600'
                      )}>
                        {cliente.status === 'ativo' && 'Ativo'}
                        {cliente.status === 'potencial' && 'Potencial'}
                        {cliente.status === 'inativo' && 'Inativo'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleView(cliente)}
                        className="p-2 text-neutral-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Visualizar"
                      >
                        <Eye size={16} />
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(cliente)}
                          className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit3 size={16} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(cliente.id!)}
                          className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Corpo do Card */}
                <div className="p-4 space-y-3">
                  {cliente.cpf_cnpj && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <FileText size={16} className="text-neutral-400" />
                      <span>{cliente.cpf_cnpj}</span>
                    </div>
                  )}
                  
                  {cliente.email && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Mail size={16} className="text-neutral-400" />
                      <a href={`mailto:${cliente.email}`} className="hover:text-primary-600 transition-colors">
                        {cliente.email}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Phone size={16} className="text-neutral-400" />
                    <a href={`tel:${cliente.celular}`} className="hover:text-primary-600 transition-colors">
                      {cliente.celular}
                    </a>
                  </div>

                  {(cliente.cidade || cliente.estado) && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <MapPin size={16} className="text-neutral-400" />
                      <span>{cliente.cidade}{cliente.estado && `, ${cliente.estado}`}</span>
                    </div>
                  )}

                  {cliente.profissao && (
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <User size={16} className="text-neutral-400" />
                      <span>{cliente.profissao}</span>
                    </div>
                  )}

                  {cliente.data_cadastro && (
                    <div className="flex items-center gap-2 text-sm text-neutral-500 pt-2 border-t border-neutral-100">
                      <Calendar size={14} />
                      <span>
                        Cadastrado em {new Date(cliente.data_cadastro).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Criar/Editar */}
        <FormModal
          isOpen={showModal}
          onClose={handleCloseModal}
          title={editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
          onSubmit={handleSave}
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
                  
                  {/* Información Personal */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                      <User size={20} />
                      Informações Pessoais
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <RestrictedInput
                          label="Nome Completo"
                          type="text"
                          required
                          value={formData.nome_completo}
                          onChange={(e) => setFormData({...formData, nome_completo: e.target.value})}
                          isRestricted={!isAdmin && editingCliente !== null}
                          restrictionMessage="Apenas admin pode editar"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          CPF/CNPJ
                        </label>
                        <input
                          type="text"
                          value={formData.cpf_cnpj || ''}
                          onChange={(e) => setFormData({...formData, cpf_cnpj: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          RG
                        </label>
                        <input
                          type="text"
                          value={formData.rg || ''}
                          onChange={(e) => setFormData({...formData, rg: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Data de Nascimento
                        </label>
                        <input
                          type="date"
                          value={formData.data_nascimento || ''}
                          onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Estado Civil
                        </label>
                        <select
                          value={formData.estado_civil || ''}
                          onChange={(e) => setFormData({...formData, estado_civil: e.target.value as Cliente['estado_civil']})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="">Selecione</option>
                          <option value="solteiro">Solteiro(a)</option>
                          <option value="casado">Casado(a)</option>
                          <option value="divorciado">Divorciado(a)</option>
                          <option value="viuvo">Viúvo(a)</option>
                          <option value="uniao_estavel">União Estável</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Profissão
                        </label>
                        <input
                          type="text"
                          value={formData.profissao || ''}
                          onChange={(e) => setFormData({...formData, profissao: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Nacionalidade
                        </label>
                        <input
                          type="text"
                          value={formData.nacionalidade || ''}
                          onChange={(e) => setFormData({...formData, nacionalidade: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contato */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                      <Phone size={20} />
                      Contato
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Celular *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.celular}
                          onChange={(e) => setFormData({...formData, celular: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Telefone Fixo
                        </label>
                        <input
                          type="tel"
                          value={formData.telefone || ''}
                          onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Telefone Alternativo
                        </label>
                        <input
                          type="tel"
                          value={formData.telefone_alternativo || ''}
                          onChange={(e) => setFormData({...formData, telefone_alternativo: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                      <MapPin size={20} />
                      Endereço
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          CEP
                        </label>
                        <input
                          type="text"
                          value={formData.cep || ''}
                          onChange={(e) => setFormData({...formData, cep: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Endereço
                        </label>
                        <input
                          type="text"
                          value={formData.endereco || ''}
                          onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Número
                        </label>
                        <input
                          type="text"
                          value={formData.numero || ''}
                          onChange={(e) => setFormData({...formData, numero: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Complemento
                        </label>
                        <input
                          type="text"
                          value={formData.complemento || ''}
                          onChange={(e) => setFormData({...formData, complemento: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Bairro
                        </label>
                        <input
                          type="text"
                          value={formData.bairro || ''}
                          onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Cidade
                        </label>
                        <input
                          type="text"
                          value={formData.cidade || ''}
                          onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Estado
                        </label>
                        <input
                          type="text"
                          value={formData.estado || ''}
                          onChange={(e) => setFormData({...formData, estado: e.target.value})}
                          maxLength={2}
                          placeholder="SP"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent uppercase"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          País
                        </label>
                        <input
                          type="text"
                          value={formData.pais || 'Brasil'}
                          onChange={(e) => setFormData({...formData, pais: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gestión */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                      <AlertCircle size={20} />
                      Informações de Gestão
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <RestrictedSelect
                          label="Status"
                          required
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value as Cliente['status']})}
                          isRestricted={!isAdmin}
                          restrictionMessage="Somente Admin pode alterar"
                        >
                          <option value="ativo">Ativo</option>
                          <option value="potencial">Potencial</option>
                          <option value="inativo">Inativo</option>
                        </RestrictedSelect>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Categoria
                        </label>
                        <input
                          type="text"
                          value={formData.categoria || ''}
                          onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                          placeholder="VIP, Regular, etc."
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Como Conheceu
                        </label>
                        <input
                          type="text"
                          value={formData.como_conheceu || ''}
                          onChange={(e) => setFormData({...formData, como_conheceu: e.target.value})}
                          placeholder="Google, Indicação, etc."
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Indicado Por
                        </label>
                        <input
                          type="text"
                          value={formData.indicado_por || ''}
                          onChange={(e) => setFormData({...formData, indicado_por: e.target.value})}
                          placeholder="Nome de quem indicou"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Observações
                        </label>
                        <textarea
                          value={formData.observacoes || ''}
                          onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                          rows={4}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Seção: Documentos */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-700 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                      <FileText size={20} />
                      Documentos do Cliente
                    </h3>
                    
                    <DocumentManager
                      documents={formData.documentos_cliente as DocumentItem[]}
                      onDocumentsChange={(docs) => setFormData({ ...formData, documentos_cliente: docs as DocumentoArquivo[] })}
                      bucketName="documentos_cliente"
                      entityId={editingCliente?.id}
                      uploadLabel="Adicionar Documento"
                      showUploadButton={true}
                      readOnly={false}
                    />
                  </div>

                  {/* Información de Auditoría */}
                  {editingCliente && (
                    <AuditInfo
                      creadoPor={editingCliente.creado_por}
                      atualizadoPor={editingCliente.atualizado_por}
                      dataCriacao={editingCliente.data_cadastro}
                      dataAtualizacao={editingCliente.data_atualizacao}
                    />
                  )}

                </FormModal>

        {/* Modal de Visualização */}
        <ViewModal
          isOpen={!!viewingCliente}
          onClose={() => setViewingCliente(null)}
          title="Detalhes do Cliente"
          onEdit={canEdit ? () => {
            setEditingCliente(viewingCliente);
            setFormData(viewingCliente);
            setViewingCliente(null);
            setShowModal(true);
          } : undefined}
          canEdit={canEdit}
          maxWidth="5xl"
        >
          {viewingCliente && <>
                <div className="space-y-6">
                  {/* Seção 1: Informações Pessoais */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                      <User size={20} />
                      Informações Pessoais
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Nome Completo</h4>
                        <p className="text-gray-900 font-medium">{viewingCliente.nome_completo}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</h4>
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          viewingCliente.status === 'ativo' && 'bg-green-100 text-green-800',
                          viewingCliente.status === 'potencial' && 'bg-blue-100 text-blue-800',
                          viewingCliente.status === 'inativo' && 'bg-gray-100 text-gray-800'
                        )}>
                          {viewingCliente.status === 'ativo' && 'Ativo'}
                          {viewingCliente.status === 'potencial' && 'Potencial'}
                          {viewingCliente.status === 'inativo' && 'Inativo'}
                        </span>
                      </div>

                      {viewingCliente.cpf_cnpj && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">CPF/CNPJ</h4>
                          <p className="text-gray-900 font-medium">{viewingCliente.cpf_cnpj}</p>
                        </div>
                      )}

                      {viewingCliente.rg && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">RG</h4>
                          <p className="text-gray-900 font-medium">{viewingCliente.rg}</p>
                        </div>
                      )}

                      {viewingCliente.data_nascimento && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                            <Calendar size={14} />
                            Data de Nascimento
                          </h4>
                          <p className="text-gray-900 font-medium">
                            {new Date(viewingCliente.data_nascimento).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}

                      {viewingCliente.nacionalidade && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Nacionalidade</h4>
                          <p className="text-gray-900 font-medium">{viewingCliente.nacionalidade}</p>
                        </div>
                      )}

                      {viewingCliente.estado_civil && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Estado Civil</h4>
                          <p className="text-gray-900 font-medium capitalize">{viewingCliente.estado_civil.replace('_', ' ')}</p>
                        </div>
                      )}

                      {viewingCliente.profissao && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                            <Building2 size={14} />
                            Profissão
                          </h4>
                          <p className="text-gray-900 font-medium">{viewingCliente.profissao}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Seção 2: Contato */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                      <Phone size={20} />
                      Informações de Contato
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {viewingCliente.email && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                            <Mail size={14} />
                            Email
                          </h4>
                          <a href={`mailto:${viewingCliente.email}`} className="text-blue-900 font-medium hover:underline">
                            {viewingCliente.email}
                          </a>
                        </div>
                      )}

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                          <Phone size={14} />
                          Celular
                        </h4>
                        <a href={`tel:${viewingCliente.celular}`} className="text-blue-900 font-medium hover:underline">
                          {viewingCliente.celular}
                        </a>
                      </div>

                      {viewingCliente.telefone && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                            <Phone size={14} />
                            Telefone Fixo
                          </h4>
                          <p className="text-blue-900 font-medium">{viewingCliente.telefone}</p>
                        </div>
                      )}

                      {viewingCliente.telefone_alternativo && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                            <Phone size={14} />
                            Telefone Alternativo
                          </h4>
                          <p className="text-blue-900 font-medium">{viewingCliente.telefone_alternativo}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Seção 3: Endereço */}
                  {(viewingCliente.endereco || viewingCliente.cidade || viewingCliente.estado) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                        <MapPin size={20} />
                        Endereço
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="space-y-2 text-gray-900">
                          {viewingCliente.endereco && (
                            <p>
                              {viewingCliente.endereco}
                              {viewingCliente.numero && `, ${viewingCliente.numero}`}
                              {viewingCliente.complemento && ` - ${viewingCliente.complemento}`}
                            </p>
                          )}
                          {viewingCliente.bairro && <p>{viewingCliente.bairro}</p>}
                          {(viewingCliente.cidade || viewingCliente.estado) && (
                            <p>
                              {viewingCliente.cidade}
                              {viewingCliente.estado && ` - ${viewingCliente.estado}`}
                            </p>
                          )}
                          {viewingCliente.cep && <p>CEP: {viewingCliente.cep}</p>}
                          {viewingCliente.pais && <p>{viewingCliente.pais}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Seção 4: Informações de Gestão */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                      <UserCheck size={20} />
                      Informações de Gestão
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {viewingCliente.categoria && (
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h4 className="text-xs font-semibold text-purple-700 uppercase mb-1 flex items-center gap-1">
                            <Star size={14} />
                            Categoria
                          </h4>
                          <p className="text-purple-900 font-medium">{viewingCliente.categoria}</p>
                        </div>
                      )}

                      {viewingCliente.como_conheceu && (
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h4 className="text-xs font-semibold text-purple-700 uppercase mb-1">Como Conheceu</h4>
                          <p className="text-purple-900 font-medium">{viewingCliente.como_conheceu}</p>
                        </div>
                      )}

                      {viewingCliente.indicado_por && (
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h4 className="text-xs font-semibold text-purple-700 uppercase mb-1">Indicado Por</h4>
                          <p className="text-purple-900 font-medium">{viewingCliente.indicado_por}</p>
                        </div>
                      )}

                      {viewingCliente.data_cadastro && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                            <Calendar size={14} />
                            Data de Cadastro
                          </h4>
                          <p className="text-gray-900 font-medium">
                            {new Date(viewingCliente.data_cadastro).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}
                    </div>

                    {viewingCliente.observacoes && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                          <MessageSquare size={14} />
                          Observações
                        </h4>
                        <p className="text-gray-900 whitespace-pre-wrap">{viewingCliente.observacoes}</p>
                      </div>
                    )}
                  </div>

                  {/* Documentos do Cliente */}
                  {viewingCliente.documentos_cliente && viewingCliente.documentos_cliente.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                        <FileText size={20} />
                        Documentos do Cliente
                      </h3>
                      <DocumentManager
                        documents={viewingCliente.documentos_cliente as DocumentItem[]}
                        onDocumentsChange={() => {}}
                        bucketName="documentos_cliente"
                        entityId={viewingCliente.id}
                        showUploadButton={false}
                        readOnly={true}
                      />
                    </div>
                  )}

                  {/* Informações de Auditoria */}
                  <AuditInfo
                    creadoPor={viewingCliente.creado_por}
                    atualizadoPor={viewingCliente.atualizado_por}
                    dataCriacao={viewingCliente.data_criacao}
                    dataAtualizacao={viewingCliente.data_atualizacao}
                  />
                </div>
          </>}
        </ViewModal>
      </ResponsiveContainer>
    </div>
  );
};

export default ClientesPage;
