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
import { Cliente } from '../types/cliente';
import { DocumentoArquivo } from '../types/documento';
import { useClienteForm } from '../hooks/forms/useClienteForm';
import { useClienteFilters } from '../hooks/filters/useClienteFilters';
import { useAdminSEO } from '../hooks/seo/useSEO';
import { cn } from '../utils/cn';
import { formatShortDate } from '../utils/dateUtils';
import { DocumentManager, DocumentItem } from '../components/admin/DocumentManager';
import { AdminPageLayout } from '../components/layout/AdminPageLayout';
import { RestrictedInput, RestrictedSelect } from '../components/admin/RestrictedFormField';
import { AuditInfo } from '../components/shared/AuditInfo';
import { FormModal } from '../components/shared/modales/FormModal';
import { ViewModal } from '../components/shared/modales/ViewModal';
import { InlineNotification } from '../components/shared/notifications/InlineNotification';
import AccessibleButton from '../components/shared/buttons/AccessibleButton';
import { STORAGE_BUCKETS } from '../config/storage';
import { PAGES_UI } from '../config/messages';
import { CEPInput } from '../features/cep';

const ClientesPage = () => {
  // SEO centralizado (SSoT para eliminação de configuração dispersa)
  const seo = useAdminSEO('Gestão de Clientes')
  
  // Hook de formulário (lógica de negócio)
  const clienteForm = useClienteForm();
  
  // Hook de filtros
  const filters = useClienteFilters(clienteForm.clientes);

  return (
    <AdminPageLayout
      title={seo.title}
      description={PAGES_UI.CLIENTES.DESCRIPTION}
      headerAction={
        clienteForm.canEdit ? (
          <AccessibleButton
            category="create"
            onClick={clienteForm.handleCreate}
            aria-label="Criar novo cliente"
            size="lg"
          >
            {PAGES_UI.CLIENTES.NEW_BUTTON}
          </AccessibleButton>
        ) : undefined
      }
    >
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
              <div className="text-2xl font-bold text-neutral-800">{filters.stats.total}</div>
              <div className="text-sm text-neutral-600">{PAGES_UI.CLIENTES.STATS.TOTAL}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm border border-green-200">
              <div className="text-2xl font-bold text-green-700">{filters.stats.ativos}</div>
              <div className="text-sm text-green-600">{PAGES_UI.STATS.ATIVOS}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">{filters.stats.potenciais}</div>
              <div className="text-sm text-blue-600">{PAGES_UI.CLIENTES.STATS.POTENCIAIS}</div>
            </div>
            <div className="bg-neutral-50 p-4 rounded-lg shadow-sm border border-neutral-300">
              <div className="text-2xl font-bold text-neutral-700">{filters.stats.inativos}</div>
              <div className="text-sm text-neutral-600">{PAGES_UI.STATS.INATIVOS}</div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  type="text"
                  value={filters.busca}
                  onChange={(e) => filters.setBusca(e.target.value)}
                  placeholder={PAGES_UI.CLIENTES.FILTERS.SEARCH_PLACEHOLDER}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-neutral-500" />
                <select
                  value={filters.filtroStatus}
                  onChange={(e) => filters.setFiltroStatus(e.target.value)}
                  className="px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="todos">{PAGES_UI.CLIENTES.FILTERS.ALL_STATUS}</option>
                  <option value="ativo">{PAGES_UI.CLIENTES.FILTERS.STATUS_ATIVO}</option>
                  <option value="potencial">{PAGES_UI.CLIENTES.FILTERS.STATUS_POTENCIAL}</option>
                  <option value="inativo">{PAGES_UI.CLIENTES.FILTERS.STATUS_INATIVO}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Clientes */}
          {clienteForm.isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-neutral-600 mt-4">{PAGES_UI.CLIENTES.EMPTY.LOADING}</p>
          </div>
        ) : filters.clientesFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
            <Users size={48} className="mx-auto text-neutral-300 mb-4" />
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">
              {PAGES_UI.CLIENTES.EMPTY.TITLE}
            </h3>
            <p className="text-neutral-500">
              {filters.busca || filters.filtroStatus !== 'todos'
                ? PAGES_UI.CLIENTES.EMPTY.TRY_FILTERS
                : PAGES_UI.CLIENTES.EMPTY.NO_DATA}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filters.clientesFiltrados.map((cliente) => (
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
                        onClick={() => clienteForm.handleView(cliente)}
                        className="p-2 text-neutral-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Visualizar"
                      >
                        <Eye size={16} />
                      </button>
                      {clienteForm.canEdit && (
                        <button
                          onClick={() => clienteForm.handleEdit(cliente)}
                          className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit3 size={16} />
                        </button>
                      )}
                      {clienteForm.canDelete && (
                        <button
                          onClick={() => clienteForm.handleDelete(cliente.id!)}
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

                  {cliente.data_criacao && (
                    <div className="flex items-center gap-2 text-sm text-neutral-500 pt-2 border-t border-neutral-100">
                      <Calendar size={14} />
                      <span>
                        Cadastrado em {formatShortDate(cliente.data_criacao)}
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
          isOpen={clienteForm.showModal}
          onClose={clienteForm.handleCloseModal}
          title={clienteForm.editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
          onSubmit={clienteForm.handleSave}
          maxWidth="4xl"
          hasUnsavedChanges={clienteForm.hasChanges}
        >
                  {/* Notificación inline */}
                  <AnimatePresence mode="wait">
                    {clienteForm.notification.show && (
                      <InlineNotification
                        type={clienteForm.notification.type}
                        message={clienteForm.notification.message}
                        onClose={clienteForm.hide}
                        className="mb-4"
                      />
                    )}
                  </AnimatePresence>
                  
                  {/* Información Personal */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                      <User size={18} className="sm:w-5 sm:h-5" />
                      Informações Pessoais
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <RestrictedInput
                          label="Nome Completo"
                          type="text"
                          required
                          value={clienteForm.formData.nome_completo}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, nome_completo: e.target.value})}
                          isRestricted={!clienteForm.isAdmin && clienteForm.editingCliente !== null}
                          restrictionMessage="Apenas admin pode editar"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          CPF/CNPJ
                        </label>
                        <input
                          type="text"
                          value={clienteForm.formData.cpf_cnpj || ''}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, cpf_cnpj: e.target.value})}
                          onBlur={(e) => {
                            const error = clienteForm.validateField('cpf_cnpj', e.target.value)
                            if (error) clienteForm.errorNotif(error)
                          }}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          RG
                        </label>
                        <input
                          type="text"
                          value={clienteForm.formData.rg || ''}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, rg: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Data de Nascimento
                        </label>
                        <input
                          type="date"
                          value={clienteForm.formData.data_nascimento || ''}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, data_nascimento: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Estado Civil
                        </label>
                        <select
                          value={clienteForm.formData.estado_civil || ''}
                          onChange={(e) => clienteForm.handleFormChange({
                            ...clienteForm.formData, 
                            estado_civil: e.target.value === '' ? undefined : e.target.value as Cliente['estado_civil']
                          })}
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
                          value={clienteForm.formData.profissao || ''}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, profissao: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Nacionalidade
                        </label>
                        <input
                          type="text"
                          value={clienteForm.formData.nacionalidade || ''}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, nacionalidade: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contato */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                      <Phone size={18} className="sm:w-5 sm:h-5" />
                      Contato
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={clienteForm.formData.email || ''}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, email: e.target.value})}                          onBlur={(e) => {
                            const error = clienteForm.validateField('email', e.target.value)
                            if (error) clienteForm.errorNotif(error)
                          }}                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Celular *
                        </label>
                        <input
                          type="tel"
                          required
                          value={clienteForm.formData.celular}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, celular: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Telefone Fixo
                        </label>
                        <input
                          type="tel"
                          value={clienteForm.formData.telefone || ''}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, telefone: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Telefone Alternativo
                        </label>
                        <input
                          type="tel"
                          value={clienteForm.formData.telefone_alternativo || ''}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, telefone_alternativo: e.target.value})}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                      <MapPin size={18} className="sm:w-5 sm:h-5" />
                      Endereço
                    </h3>                
                  
                    
                    {/* Layout reorganizado: CEP primero, luego Endereço Completo, luego ubicación */}
                    <div className="space-y-4">
                      {/* Linha 1: CEP (Solo para Brasil - para buscar y auto-rellenar) */}
                      {clienteForm.formData.pais?.toUpperCase() === 'BRASIL' && (
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            CEP
                            <span className="text-neutral-500 text-xs ml-2">
                              (Busque para preencher automaticamente)
                            </span>
                          </label>
                          <div className="max-w-xs">
                            <CEPInput
                              value={clienteForm.formData.cep || ''}
                              onChange={(value) => clienteForm.handleFormChange({...clienteForm.formData, cep: value})}
                              onAddressFound={clienteForm.handleCEPFound}
                              autoSearch={true}
                              showSearchButton={true}
                              enableCache={true}
                            />
                          </div>
                        </div>
                      )}

                      {/* Linha 2: Endereço Completo (textarea) */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Endereço Completo
                          <span className="text-neutral-500 text-xs ml-2">
                            (Rua/Avenida, Número, Complemento, Bairro)
                          </span>
                        </label>
                        <textarea
                          value={clienteForm.formData.endereco_completo || ''}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, endereco_completo: e.target.value})}
                          rows={3}
                          maxLength={1000}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                          placeholder="Avenida Paulista, 1578 - 3º andar - Bela Vista"
                        />
                        <p className="text-xs text-neutral-500 mt-1">
                          {(clienteForm.formData.endereco_completo?.length || 0)}/1000 caracteres
                        </p>
                      </div>

                      {/* Linha 3: País + Estado + Cidade (ubicación geográfica) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            País *
                          </label>
                          <input
                            type="text"
                            value={clienteForm.formData.pais || 'Brasil'}
                            onChange={(e) => {
                              clienteForm.handleFormChange({...clienteForm.formData, pais: e.target.value})
                              // Limpiar estado al cambiar país (validación diferente)
                              if (e.target.value.toUpperCase() !== 'BRASIL') {
                                clienteForm.handleFormChange({...clienteForm.formData, pais: e.target.value, estado: ''})
                              }
                            }}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Brasil"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Estado {clienteForm.formData.pais?.toUpperCase() === 'BRASIL' ? '(UF - 2 dígitos) *' : '/ Provincia'}
                          </label>
                          <input
                            type="text"
                            value={clienteForm.formData.estado || ''}
                            onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, estado: e.target.value})}
                            maxLength={clienteForm.formData.pais?.toUpperCase() === 'BRASIL' ? 2 : 50}
                            placeholder={clienteForm.formData.pais?.toUpperCase() === 'BRASIL' ? 'SP' : 'Nombre del estado'}
                            className={`w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${clienteForm.formData.pais?.toUpperCase() === 'BRASIL' ? 'uppercase' : ''}`}
                            required={clienteForm.formData.pais?.toUpperCase() === 'BRASIL'}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Cidade
                          </label>
                          <input
                            type="text"
                            value={clienteForm.formData.cidade || ''}
                            onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, cidade: e.target.value})}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="São Paulo"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gestión */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                      <AlertCircle size={18} className="sm:w-5 sm:h-5" />
                      Informações de Gestão
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <RestrictedSelect
                          label="Status"
                          required
                          value={clienteForm.formData.status}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, status: e.target.value as Cliente['status']})}
                          isRestricted={!clienteForm.isAdmin}
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
                          value={clienteForm.formData.categoria || ''}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, categoria: e.target.value})}
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
                          value={clienteForm.formData.como_conheceu || ''}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, como_conheceu: e.target.value})}
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
                          value={clienteForm.formData.indicado_por || ''}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, indicado_por: e.target.value})}
                          placeholder="Nome de quem indicou"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Observações
                        </label>
                        <textarea
                          value={clienteForm.formData.observacoes || ''}
                          onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, observacoes: e.target.value})}
                          rows={4}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Seção: Documentos */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-700 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                      <FileText size={18} className="sm:w-5 sm:h-5" />
                      Documentos do Cliente
                    </h3>
                    
                    <DocumentManager
                      documents={clienteForm.formData.documentos_cliente as DocumentItem[]}
                      onDocumentsChange={(docs) => clienteForm.handleFormChange({ ...clienteForm.formData, documentos_cliente: docs as DocumentoArquivo[] })}
                      bucketName={STORAGE_BUCKETS.documentosCliente}
                      entityId={clienteForm.editingCliente?.id}
                      uploadLabel="Adicionar Documento"
                      showUploadButton={true}
                      readOnly={false}
                    />
                  </div>

                  {/* Información de Auditoría */}
                  {clienteForm.editingCliente && (
                    <AuditInfo
                      creadoPor={clienteForm.editingCliente.creado_por}
                      atualizadoPor={clienteForm.editingCliente.atualizado_por}
                      dataCriacao={clienteForm.editingCliente.data_criacao}
                      dataAtualizacao={clienteForm.editingCliente.data_atualizacao}
                    />
                  )}

                </FormModal>

        {/* Modal de Visualização */}
        <ViewModal
          isOpen={!!clienteForm.viewingCliente}
          onClose={clienteForm.handleCloseViewModal}
          title="Detalhes do Cliente"
          onEdit={clienteForm.canEdit ? () => {
            clienteForm.handleEdit(clienteForm.viewingCliente!);
            clienteForm.handleCloseViewModal();
          } : undefined}
          maxWidth="5xl"
        >
          {clienteForm.viewingCliente && <>
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
                        <p className="text-gray-900 font-medium">{clienteForm.viewingCliente.nome_completo}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</h4>
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          clienteForm.viewingCliente.status === 'ativo' && 'bg-green-100 text-green-800',
                          clienteForm.viewingCliente.status === 'potencial' && 'bg-blue-100 text-blue-800',
                          clienteForm.viewingCliente.status === 'inativo' && 'bg-gray-100 text-gray-800'
                        )}>
                          {clienteForm.viewingCliente.status === 'ativo' && 'Ativo'}
                          {clienteForm.viewingCliente.status === 'potencial' && 'Potencial'}
                          {clienteForm.viewingCliente.status === 'inativo' && 'Inativo'}
                        </span>
                      </div>

                      {clienteForm.viewingCliente.cpf_cnpj && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">CPF/CNPJ</h4>
                          <p className="text-gray-900 font-medium">{clienteForm.viewingCliente.cpf_cnpj}</p>
                        </div>
                      )}

                      {clienteForm.viewingCliente.rg && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">RG</h4>
                          <p className="text-gray-900 font-medium">{clienteForm.viewingCliente.rg}</p>
                        </div>
                      )}

                      {clienteForm.viewingCliente.data_nascimento && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                            <Calendar size={14} />
                            Data de Nascimento
                          </h4>
                          <p className="text-gray-900 font-medium">
                            {formatShortDate(clienteForm.viewingCliente.data_nascimento)}
                          </p>
                        </div>
                      )}

                      {clienteForm.viewingCliente.nacionalidade && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Nacionalidade</h4>
                          <p className="text-gray-900 font-medium">{clienteForm.viewingCliente.nacionalidade}</p>
                        </div>
                      )}

                      {clienteForm.viewingCliente.estado_civil && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1">Estado Civil</h4>
                          <p className="text-gray-900 font-medium capitalize">{clienteForm.viewingCliente.estado_civil.replace('_', ' ')}</p>
                        </div>
                      )}

                      {clienteForm.viewingCliente.profissao && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                            <Building2 size={14} />
                            Profissão
                          </h4>
                          <p className="text-gray-900 font-medium">{clienteForm.viewingCliente.profissao}</p>
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
                      {clienteForm.viewingCliente.email && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                            <Mail size={14} />
                            Email
                          </h4>
                          <a href={`mailto:${clienteForm.viewingCliente.email}`} className="text-blue-900 font-medium hover:underline">
                            {clienteForm.viewingCliente.email}
                          </a>
                        </div>
                      )}

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                          <Phone size={14} />
                          Celular
                        </h4>
                        <a href={`tel:${clienteForm.viewingCliente.celular}`} className="text-blue-900 font-medium hover:underline">
                          {clienteForm.viewingCliente.celular}
                        </a>
                      </div>

                      {clienteForm.viewingCliente.telefone && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                            <Phone size={14} />
                            Telefone Fixo
                          </h4>
                          <p className="text-blue-900 font-medium">{clienteForm.viewingCliente.telefone}</p>
                        </div>
                      )}

                      {clienteForm.viewingCliente.telefone_alternativo && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                            <Phone size={14} />
                            Telefone Alternativo
                          </h4>
                          <p className="text-blue-900 font-medium">{clienteForm.viewingCliente.telefone_alternativo}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Seção 3: Endereço */}
                  {(clienteForm.viewingCliente.endereco_completo || clienteForm.viewingCliente.cidade || clienteForm.viewingCliente.estado) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                        <MapPin size={20} />
                        Endereço
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="space-y-2 text-gray-900">
                          {clienteForm.viewingCliente.endereco_completo && (
                            <p className="whitespace-pre-wrap">{clienteForm.viewingCliente.endereco_completo}</p>
                          )}
                          {(clienteForm.viewingCliente.cidade || clienteForm.viewingCliente.estado) && (
                            <p>
                              {clienteForm.viewingCliente.cidade}
                              {clienteForm.viewingCliente.estado && ` - ${clienteForm.viewingCliente.estado}`}
                            </p>
                          )}
                          {clienteForm.viewingCliente.cep && <p>CEP: {clienteForm.viewingCliente.cep}</p>}
                          {clienteForm.viewingCliente.pais && <p>{clienteForm.viewingCliente.pais}</p>}
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
                      {clienteForm.viewingCliente.categoria && (
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h4 className="text-xs font-semibold text-purple-700 uppercase mb-1 flex items-center gap-1">
                            <Star size={14} />
                            Categoria
                          </h4>
                          <p className="text-purple-900 font-medium">{clienteForm.viewingCliente.categoria}</p>
                        </div>
                      )}

                      {clienteForm.viewingCliente.como_conheceu && (
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h4 className="text-xs font-semibold text-purple-700 uppercase mb-1">Como Conheceu</h4>
                          <p className="text-purple-900 font-medium">{clienteForm.viewingCliente.como_conheceu}</p>
                        </div>
                      )}

                      {clienteForm.viewingCliente.indicado_por && (
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h4 className="text-xs font-semibold text-purple-700 uppercase mb-1">Indicado Por</h4>
                          <p className="text-purple-900 font-medium">{clienteForm.viewingCliente.indicado_por}</p>
                        </div>
                      )}

                      {clienteForm.viewingCliente.data_criacao && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                            <Calendar size={14} />
                            Data de Cadastro
                          </h4>
                          <p className="text-gray-900 font-medium">
                            {formatShortDate(clienteForm.viewingCliente.data_criacao)}
                          </p>
                        </div>
                      )}
                    </div>

                    {clienteForm.viewingCliente.observacoes && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                          <MessageSquare size={14} />
                          Observações
                        </h4>
                        <p className="text-gray-900 whitespace-pre-wrap">{clienteForm.viewingCliente.observacoes}</p>
                      </div>
                    )}
                  </div>

                  {/* Documentos do Cliente */}
                  {clienteForm.viewingCliente.documentos_cliente && clienteForm.viewingCliente.documentos_cliente.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center gap-2">
                        <FileText size={20} />
                        Documentos do Cliente
                      </h3>
                      <DocumentManager
                        documents={clienteForm.viewingCliente.documentos_cliente as DocumentItem[]}
                        onDocumentsChange={() => {}}
                        bucketName={STORAGE_BUCKETS.documentosCliente}
                        entityId={clienteForm.viewingCliente.id}
                        showUploadButton={false}
                        readOnly={true}
                      />
                    </div>
                  )}

                  {/* Informações de Auditoria */}
                  <AuditInfo
                    creadoPor={clienteForm.viewingCliente.creado_por}
                    atualizadoPor={clienteForm.viewingCliente.atualizado_por}
                    dataCriacao={clienteForm.viewingCliente.data_criacao}
                    dataAtualizacao={clienteForm.viewingCliente.data_atualizacao}
                  />
                </div>
          </>}
        </ViewModal>
    </AdminPageLayout>
  );
};

export default ClientesPage;




