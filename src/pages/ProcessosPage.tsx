import React, { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Plus, Search, User, AlertCircle, CheckCircle, Clock, Eye, FileText, Download, Mail, Phone, Link as LinkIcon, Scale, ExternalLink, Upload } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProcessos } from '../hooks/data-access/useProcessos'
import { useUsuarios } from '../hooks/data-access/useUsuarios'
import { useResponsive } from '../hooks/ui/useResponsive'
import { cn } from '../utils/cn'
import { DocumentoArquivo } from '../types/documento'
import { ProcessoLink, Jurisprudencia, ProcessoWithRelations } from '../types/processo'
import { StorageService } from '../services/storageService'
import { STORAGE_BUCKETS } from '../config/storage'
import { AuditInfo } from '../components/shared/AuditInfo'
import SkeletonCard from '../components/shared/cards/SkeletonCard'
import ProcessoCard from '../components/shared/cards/ProcessoCard'
import AccessibleButton from '../components/shared/buttons/AccessibleButton'
import { FormModal } from '../components/shared/modales/FormModal'
import { ViewModal } from '../components/shared/modales/ViewModal'
import { CrudListManager, CrudAddButton } from '../components/admin/CrudListManager'
import { RestrictedInput, RestrictedSelect } from '../components/admin/RestrictedFormField'

// 🆕 SSoT - Imports dos componentes base
import { 
  BaseCard, 
  BaseSection, 
  BaseGrid
} from '../components/shared'
import { DocumentManager, DocumentItem } from '../components/admin/DocumentManager'
import { InlineNotification } from '../components/shared/notifications/InlineNotification'
import { Collapse } from '../components/shared/Collapse'
import { Accordion } from '../components/shared/Accordion'
import { useProcessoForm } from '../hooks/forms/useProcessoForm'
import { useProcessoFilters } from '../hooks/filters/useProcessoFilters'
import { useClienteForm } from '../hooks/forms/useClienteForm'
import { useAdminSEO } from '../hooks/seo/useSEO'
import { AdminPageLayout } from '../components/layout/AdminPageLayout'
import { PAGES_UI } from '../config/messages'

// Componente de gestión de procesos jurídicos
const ProcessosPage: React.FC = () => {
  useResponsive()
  
  // SEO centralizado (SSoT para eliminación de configuración dispersa)
  const seo = useAdminSEO('Gestão de Processos')
  
  const { processos, loading, error, fetchProcessos, createProcesso, updateProcesso } = useProcessos({
    enablePolling: true,
    pollingInterval: 30000,
  })
  const { usuarios } = useUsuarios()
  
  // Estados para notificaciones inline del acordeón
  const [documentosNotification, setDocumentosNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null>(null)
  
  const [linksNotification, setLinksNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null>(null)
  
  const [jurisprudenciasNotification, setJurisprudenciasNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null>(null)
  
  // Hook de formulario con toda la lógica centralizada
  const processoForm = useProcessoForm({
    onSuccess: fetchProcessos,
    createProcesso,
    updateProcesso,
    processos: processos as ProcessoWithRelations[]
  })
  
  // Hook para gestión de clientes (crear desde ProcessosPage)
  const clienteForm = useClienteForm()
  
  // Hook de filtros (cast a ProcessoWithRelations para compatibilidad)
  const filters = useProcessoFilters(processos as ProcessoWithRelations[])
  
  // Estado para controlar apertura del Collapse de documentos
  const [documentosCollapseOpen, setDocumentosCollapseOpen] = useState(false)

  // Cargar procesos al montar el componente
  useEffect(() => {
    fetchProcessos()
  }, [fetchProcessos])

  // Handlers para documentos (usan StorageService - SSoT)
  const handleViewDocument = async (doc: DocumentoArquivo) => {
    if (!doc.url) return
    try {
      // ✅ SSoT: Usa STORAGE_BUCKETS de config/storage.ts
      await StorageService.viewDocument(doc, STORAGE_BUCKETS.documentosProcesso)
    } catch (error) {
      console.error('Erro ao visualizar documento:', error)
    }
  }

  const handleDownloadDocument = async (doc: DocumentoArquivo) => {
    if (!doc.url) return
    try {
      // ✅ SSoT: Usa STORAGE_BUCKETS de config/storage.ts
      await StorageService.downloadDocument(doc, STORAGE_BUCKETS.documentosProcesso)
    } catch (error) {
      console.error('Erro ao baixar documento:', error)
    }
  }

  const handleViewProcesso = (processo: ProcessoWithRelations) => {
    processoForm.handleView(processo)
  }

  return (
    <AdminPageLayout
      title={seo.title}
      description="Gerencie processos jurídicos e acompanhe o andamento das atividades"
      headerAction={
        processoForm.canEdit ? (
          <AccessibleButton
            category="create"
            onClick={() => processoForm.setShowCreateForm(true)}
            aria-label="Criar novo processo"
            size="lg"
          >
            Novo Processo
          </AccessibleButton>
        ) : undefined
      }
    >

        {/* Stats - 🆕 Migrado para componentes base SSoT */}
        <BaseGrid cols={{ xs: 1, sm: 2, lg: 3 }} gap="lg" className="mb-8">
          <BaseCard variant="elevated">
            <BaseSection padding="md">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Em Aberto</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filters.stats.emAberto}
                  </p>
                </div>
              </div>
            </BaseSection>
          </BaseCard>

          <BaseCard variant="elevated">
            <BaseSection padding="md">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filters.stats.emAndamento}
                  </p>
                </div>
              </div>
            </BaseSection>
          </BaseCard>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Fechados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filters.stats.fechados}
                </p>
              </div>
            </div>
          </div>
        </BaseGrid>

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
                  value={filters.busca}
                  onChange={(e) => filters.handleBuscaChange(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.filtroStatus}
                onChange={(e) => filters.setFiltroStatus(e.target.value)}
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
                value={filters.filtroAdvogado}
                onChange={(e) => filters.setFiltroAdvogado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Todos</option>
                {usuarios
                  .filter(usuario => ['admin', 'advogado'].includes(usuario.role))
                  .map(usuario => (
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
            {filters.processosFiltrados.map((processo, index) => (
              <ProcessoCard
                key={processo.id}
                processo={processo}
                onEdit={(p) => processoForm.loadProcessoForEdit(p)}
                onView={handleViewProcesso}
                canEdit={processoForm.canEdit}
                index={index}
              />
            ))}
          </div>
        )}

        {filters.processosFiltrados.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{PAGES_UI.PROCESSOS.EMPTY.TITLE}</p>
          </div>
        )}

      {/* Modal de crear/editar proceso */}
      <FormModal
        isOpen={processoForm.showCreateForm}
        onClose={processoForm.resetForm}
        onSubmit={processoForm.handleSubmit}
        title={processoForm.editingProcesso ? PAGES_UI.PROCESSOS.MODAL.TITLE_EDIT : PAGES_UI.PROCESSOS.MODAL.TITLE_NEW}
        submitLabel={processoForm.editingProcesso ? PAGES_UI.PROCESSOS.MODAL.SUBMIT_UPDATE : PAGES_UI.PROCESSOS.MODAL.SUBMIT_SAVE}
        cancelLabel={PAGES_UI.PROCESSOS.MODAL.CANCEL}
        maxWidth="4xl"
        hasUnsavedChanges={processoForm.hasChanges}
      >
              {/* Notificaciones ahora aparecen sobre cada item del acordeón */}
              
              {/* Seção 1: Informações Básicas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Informações Básicas
                </h3>
                <div className="space-y-4">
                  <RestrictedInput
                    label="Título do Processo"
                    required
                    autoFocus
                    type="text"
                    placeholder="Ex: Ação de Indenização por Danos Morais"
                    value={processoForm.formData.titulo}
                    onChange={(e) => processoForm.handleFormChange({...processoForm.formData, titulo: e.target.value})}
                    isRestricted={!processoForm.isAdmin && processoForm.editingProcesso !== null}
                    restrictionMessage="Apenas Admin pode alterar"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={processoForm.formData.descricao}
                      onChange={(e) => processoForm.handleFormChange({...processoForm.formData, descricao: e.target.value})}
                      placeholder="Descreva os detalhes do processo..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <RestrictedInput
                      label="Número do Processo"
                      type="text"
                      placeholder="Ex: 1001234-12.2024.8.07.0001"
                      required
                      value={processoForm.formData.numero_processo}
                      onChange={(e) => processoForm.handleFormChange({...processoForm.formData, numero_processo: e.target.value})}
                      isRestricted={!processoForm.isAdmin && processoForm.editingProcesso !== null}
                      restrictionMessage="Apenas Admin pode alterar"
                    />

                    <RestrictedSelect
                      label="Status"
                      required
                      value={processoForm.formData.status}
                      onChange={(e) => processoForm.handleFormChange({...processoForm.formData, status: e.target.value})}
                      isRestricted={processoForm.isAssistente}
                      restrictionMessage={PAGES_UI.PROCESSOS.PERMISSIONS.ADMIN_LAWYER}
                    >
                      <option value="em_aberto">Em Aberto</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="fechado">Fechado</option>
                    </RestrictedSelect>
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
                        <RestrictedSelect
                          label="Selecione o Cliente"
                          required
                          value={processoForm.formData.cliente_id}
                          onChange={(e) => processoForm.handleClienteChange(e.target.value)}
                        >
                          <option value="">Selecione um cliente</option>
                          {processoForm.clientes.map(cliente => (
                            <option key={cliente.id} value={cliente.id}>
                              {cliente.nome_completo}
                            </option>
                          ))}
                        </RestrictedSelect>
                      </div>
                      <div className="flex items-end">
                        <AccessibleButton
                          type="button"
                          onClick={() => {
                            // No cerrar el modal de processos, solo abrir el de cliente encima
                            clienteForm.handleCreate()
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
                      <RestrictedSelect
                        label="Polo do Cliente"
                        required
                        value={processoForm.formData.polo}
                        onChange={(e) => processoForm.handleFormChange({...processoForm.formData, polo: e.target.value as 'ativo' | 'passivo' | ''})}
                      >
                        <option value="">Selecione o polo</option>
                        <option value="ativo">Ativo (Autor/Requerente)</option>
                        <option value="passivo">Passivo (Réu/Requerido)</option>
                      </RestrictedSelect>
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
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600"
                        value={processoForm.formData.cliente_email}
                        placeholder="Será carregado ao selecionar o cliente"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                        <Phone size={16} />
                        Telefone do Cliente
                      </label>
                      <input
                        type="tel"
                        disabled
                        className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600"
                        value={processoForm.formData.cliente_telefone}
                        placeholder="Será carregado ao selecionar o cliente"
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
                      value={processoForm.formData.area_direito}
                      onChange={(e) => processoForm.handleFormChange({...processoForm.formData, area_direito: e.target.value})}
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
                      Prioridade
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={processoForm.formData.prioridade}
                      onChange={(e) => processoForm.handleFormChange({...processoForm.formData, prioridade: e.target.value})}
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">Urgente</option>
                    </select>
                  </div>

                  <RestrictedSelect
                    label="Advogado Responsável"
                    required
                    value={processoForm.formData.advogado_responsavel}
                    onChange={(e) => processoForm.handleFormChange({...processoForm.formData, advogado_responsavel: e.target.value})}
                    isRestricted={!processoForm.isAdmin && processoForm.editingProcesso !== null}
                    restrictionMessage="Apenas Admin pode alterar"
                  >
                    <option value="">Selecione um advogado</option>
                    {usuarios
                      .filter(usuario => ['admin', 'advogado'].includes(usuario.role))
                      .map(usuario => (
                      <option key={usuario.id} value={usuario.id}>
                        {usuario.nome} {usuario.role === 'admin' ? '👑' : ''}
                      </option>
                    ))}
                  </RestrictedSelect>

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
                      value={processoForm.formData.valor_causa}
                      onChange={(e) => processoForm.handleFormChange({...processoForm.formData, valor_causa: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Competência
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={processoForm.formData.competencia}
                      onChange={(e) => processoForm.handleFormChange({...processoForm.formData, competencia: e.target.value as 'federal' | 'estadual' | 'trabalhista' | 'eleitoral' | ''})}
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
                      value={processoForm.formData.atividade_pendente}
                      onChange={(e) => processoForm.handleFormChange({...processoForm.formData, atividade_pendente: e.target.value})}
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
                      value={processoForm.formData.jurisdicao.uf}
                      onChange={(e) => processoForm.handleFormChange({
                        ...processoForm.formData, 
                        jurisdicao: {...processoForm.formData.jurisdicao, uf: e.target.value.toUpperCase()}
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
                      value={processoForm.formData.jurisdicao.municipio}
                      onChange={(e) => processoForm.handleFormChange({
                        ...processoForm.formData, 
                        jurisdicao: {...processoForm.formData.jurisdicao, municipio: e.target.value}
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
                      value={processoForm.formData.jurisdicao.vara}
                      onChange={(e) => processoForm.handleFormChange({
                        ...processoForm.formData, 
                        jurisdicao: {...processoForm.formData.jurisdicao, vara: e.target.value}
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
                      value={processoForm.formData.jurisdicao.juiz}
                      onChange={(e) => processoForm.handleFormChange({
                        ...processoForm.formData, 
                        jurisdicao: {...processoForm.formData.jurisdicao, juiz: e.target.value}
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
                      value={processoForm.formData.honorarios.valor_honorarios}
                      onChange={(e) => processoForm.handleFormChange({
                        ...processoForm.formData, 
                        honorarios: {...processoForm.formData.honorarios, valor_honorarios: e.target.value}
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
                      value={processoForm.formData.honorarios.detalhes}
                      onChange={(e) => processoForm.handleFormChange({
                        ...processoForm.formData, 
                        honorarios: {...processoForm.formData.honorarios, detalhes: e.target.value}
                      })}
                      placeholder="Ex: Honorários contratuais - 3 parcelas de R$ 1.000,00"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 6: Documentos, Links e Jurisprudências */}
              <div className="space-y-4">
                {/* Documentos do Processo */}
                <Collapse
                  id="documentos"
                  icon={<FileText size={20} />}
                  title="Documentos do Processo"
                  count={processoForm.formData.documentos_processo?.length || 0}
                  color="gray"
                  notification={documentosNotification}
                  open={documentosCollapseOpen}
                  onOpenChange={setDocumentosCollapseOpen}
                  headerAction={
                    <button
                      type="button"
                      onClick={() => {
                        const uploadInput = document.getElementById('external-file-upload-documentos') as HTMLInputElement
                        if (uploadInput) {
                          uploadInput.click()
                        }
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors text-sm font-medium"
                    >
                      <Upload size={16} />
                      <span className="hidden sm:inline">Adicionar</span>
                    </button>
                  }
                >
                  <DocumentManager
                    documents={processoForm.formData.documentos_processo as DocumentItem[]}
                    onDocumentsChange={(docs) => processoForm.handleFormChange({ ...processoForm.formData, documentos_processo: docs as DocumentoArquivo[] })}
                    bucketName={STORAGE_BUCKETS.documentosProcesso}
                    entityId={processoForm.editingProcesso?.id}
                    uploadLabel={PAGES_UI.PROCESSOS.SECTIONS.DOCUMENTS}
                    showUploadButton={false}
                    readOnly={false}
                    onNotification={(message, type) => {
                      setDocumentosNotification({ message, type });
                      setTimeout(() => setDocumentosNotification(null), 5000);
                    }}
                  />
                </Collapse>

                {/* Links do Processo */}
                <Collapse
                  id="links"
                  icon={<LinkIcon size={20} />}
                  title="Links do Processo"
                  count={processoForm.linksCrud.items?.length || 0}
                  color="blue"
                  notification={linksNotification}
                  defaultOpen={false}
                  headerAction={
                    <CrudAddButton
                      onClick={() => processoForm.setShowLinksModal(true)}
                      disabled={!processoForm.canEdit}
                      color="blue"
                      label="Adicionar Link"
                      ariaLabel="Adicionar novo link ao processo"
                    />
                  }
                >
                  <CrudListManager
                        title=""
                        icon={<LinkIcon size={20} />}
                        color="blue"
                        items={processoForm.linksCrud.items}
                        tempItem={processoForm.linksCrud.tempItem}
                        setTempItem={processoForm.linksCrud.setTempItem}
                        isEditing={processoForm.linksCrud.isEditing}
                        showAddModal={processoForm.showLinksModal}
                        setShowAddModal={processoForm.setShowLinksModal}
                        onAdd={processoForm.handleAddLink}
                        onUpdate={processoForm.handleUpdateLink}
                        onDelete={processoForm.linksCrud.deleteItem}
                        onEdit={processoForm.linksCrud.startEdit}
                        onCancelEdit={processoForm.linksCrud.cancelEdit}
                        onNotification={(message, type) => {
                          setLinksNotification({ message, type });
                          setTimeout(() => setLinksNotification(null), 5000);
                        }}
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
                        canEdit={processoForm.canEdit}
                        emptyText="Nenhum link adicionado"
                        confirmDeleteText="Deseja realmente remover este link?"
                      />
                </Collapse>

                {/* Jurisprudências */}
                <Collapse
                  id="jurisprudencias"
                  icon={<Scale size={20} />}
                  title="Jurisprudências"
                  count={processoForm.jurisprudenciasCrud.items?.length || 0}
                  color="purple"
                  notification={jurisprudenciasNotification}
                  defaultOpen={false}
                  headerAction={
                    <CrudAddButton
                      onClick={() => processoForm.setShowJurisprudenciaModal(true)}
                      disabled={!processoForm.canEdit}
                      color="purple"
                      label="Adicionar Jurisprudência"
                      ariaLabel="Adicionar nova jurisprudência ao processo"
                    />
                  }
                >
                  <CrudListManager
                        title=""
                        icon={<Scale size={20} />}
                        color="purple"
                        items={processoForm.jurisprudenciasCrud.items}
                        tempItem={processoForm.jurisprudenciasCrud.tempItem}
                        setTempItem={processoForm.jurisprudenciasCrud.setTempItem}
                        isEditing={processoForm.jurisprudenciasCrud.isEditing}
                        showAddModal={processoForm.showJurisprudenciaModal}
                        setShowAddModal={processoForm.setShowJurisprudenciaModal}
                        onAdd={processoForm.handleAddJurisprudencia}
                        onUpdate={processoForm.handleUpdateJurisprudencia}
                        onDelete={processoForm.jurisprudenciasCrud.deleteItem}
                        onEdit={processoForm.jurisprudenciasCrud.startEdit}
                        onCancelEdit={processoForm.jurisprudenciasCrud.cancelEdit}
                        onNotification={(message, type) => {
                          setJurisprudenciasNotification({ message, type });
                          setTimeout(() => setJurisprudenciasNotification(null), 5000);
                        }}
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
                        canEdit={processoForm.canEdit}
                        emptyText="Nenhuma jurisprudência adicionada"
                        confirmDeleteText="Deseja realmente remover esta jurisprudência?"
                      />
                </Collapse>
              </div>

              {/* Modales FUERA del Collapse para que funcionen cuando está cerrado */}
              {/* Modal de Links */}
              <CrudListManager
                title=""
                icon={<LinkIcon size={20} />}
                color="blue"
                items={[]} // No mostramos la lista aquí, solo el modal
                tempItem={processoForm.linksCrud.tempItem}
                setTempItem={processoForm.linksCrud.setTempItem}
                isEditing={processoForm.linksCrud.isEditing}
                showAddModal={processoForm.showLinksModal}
                setShowAddModal={processoForm.setShowLinksModal}
                onAdd={processoForm.handleAddLink}
                onUpdate={processoForm.handleUpdateLink}
                onDelete={() => {}}
                onEdit={() => {}}
                onCancelEdit={processoForm.linksCrud.cancelEdit}
                onNotification={(message, type) => {
                  setLinksNotification({ message, type });
                  setTimeout(() => setLinksNotification(null), 5000);
                }}
                fields={[
                  { name: 'titulo', label: 'Título do Link', type: 'text', placeholder: 'Ex: Consulta processo TJ-SP', required: true },
                  { name: 'link', label: 'URL do Link', type: 'url', placeholder: 'https://...', required: true },
                ]}
                renderItem={() => <div />} // No usado aquí
                canEdit={processoForm.canEdit}
                emptyText=""
                confirmDeleteText=""
              />

              {/* Modal de Jurisprudências */}
              <CrudListManager
                title=""
                icon={<Scale size={20} />}
                color="purple"
                items={[]} // No mostramos la lista aquí, solo el modal
                tempItem={processoForm.jurisprudenciasCrud.tempItem}
                setTempItem={processoForm.jurisprudenciasCrud.setTempItem}
                isEditing={processoForm.jurisprudenciasCrud.isEditing}
                showAddModal={processoForm.showJurisprudenciaModal}
                setShowAddModal={processoForm.setShowJurisprudenciaModal}
                onAdd={processoForm.handleAddJurisprudencia}
                onUpdate={processoForm.handleUpdateJurisprudencia}
                onDelete={() => {}}
                onEdit={() => {}}
                onCancelEdit={processoForm.jurisprudenciasCrud.cancelEdit}
                onNotification={(message, type) => {
                  setJurisprudenciasNotification({ message, type });
                  setTimeout(() => setJurisprudenciasNotification(null), 5000);
                }}
                fields={[
                  { name: 'ementa', label: 'Ementa da Jurisprudência', type: 'textarea', placeholder: 'Digite a ementa da jurisprudência...', required: true, fullWidth: true },
                  { name: 'link', label: 'Link da Jurisprudência', type: 'url', placeholder: 'https://...', required: true, fullWidth: true },
                ]}
                renderItem={() => <div />} // No usado aquí
                canEdit={processoForm.canEdit}
                emptyText=""
                confirmDeleteText=""
              />

              {/* Input externo para upload de documentos - siempre en el DOM */}
              <input
                type="file"
                id="external-file-upload-documentos"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return

                  // Validar tamaño (50 MB)
                  const maxSizeBytes = 50 * 1024 * 1024
                  if (file.size > maxSizeBytes) {
                    setDocumentosNotification({ 
                      message: `Arquivo muito grande. Tamanho máximo: 50 MB`, 
                      type: 'warning' 
                    })
                    setTimeout(() => setDocumentosNotification(null), 5000)
                    e.target.value = ''
                    return
                  }

                  // Validar tipo
                  const allowedTypes = [
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'image/jpeg',
                    'image/png',
                    'image/jpg'
                  ]
                  if (!allowedTypes.includes(file.type)) {
                    setDocumentosNotification({ 
                      message: 'Tipo de arquivo não permitido', 
                      type: 'warning' 
                    })
                    setTimeout(() => setDocumentosNotification(null), 5000)
                    e.target.value = ''
                    return
                  }

                  try {
                    // Upload usando StorageService
                    const targetId = processoForm.editingProcesso?.id || `temp-${Date.now()}`
                    const filePath = await StorageService.uploadFile(STORAGE_BUCKETS.documentosProcesso, file, targetId)

                    if (!filePath) {
                      throw new Error('Erro ao fazer upload')
                    }

                    // Crear objeto documento
                    const newDoc: DocumentItem = {
                      nome: file.name,
                      url: filePath,
                      tipo: file.type,
                      tamanho: file.size,
                      data_upload: new Date().toISOString()
                    }

                    // Agregar a la lista
                    processoForm.handleFormChange({
                      ...processoForm.formData,
                      documentos_processo: [...(processoForm.formData.documentos_processo || []), newDoc]
                    })
                    
                    // Abrir el Collapse para mostrar el documento
                    setDocumentosCollapseOpen(true)

                    // Reset input
                    e.target.value = ''
                  } catch (error) {
                    console.error('Erro ao fazer upload:', error)
                    setDocumentosNotification({ 
                      message: 'Erro ao enviar documento', 
                      type: 'error' 
                    })
                    setTimeout(() => setDocumentosNotification(null), 5000)
                    e.target.value = ''
                  }
                }}
                className="hidden"
                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png,image/jpg"
              />

              {/* Información de Auditoría */}
              {processoForm.editingProcesso && (
                <AuditInfo
                  creadoPor={processoForm.editingProcesso.creado_por}
                  atualizadoPor={processoForm.editingProcesso.atualizado_por}
                  dataCriacao={processoForm.editingProcesso.data_criacao}
                  dataAtualizacao={processoForm.editingProcesso.data_atualizacao}
                />
              )}

      </FormModal>

      {/* Modal de Cliente reutilizado desde useClienteForm */}
      <FormModal
        isOpen={clienteForm.showModal}
        onClose={() => {
          clienteForm.handleCloseModal()
          // No hacer nada más, el modal de processos permanece abierto con sus datos
        }}
        title={clienteForm.editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
        onSubmit={async (e) => {
          // Guardar el cliente y capturar el resultado
          const resultado = await clienteForm.handleSave(e)
          
          // Si se guardó exitosamente (resultado contiene data)
          if (resultado && resultado.data) {
            // Recargar lista de clientes
            await processoForm.refetchClientes()
            
            // Seleccionar automáticamente el cliente creado en el formulario de processo
            processoForm.handleClienteChange(resultado.data.id)
          }
        }}
        maxWidth="4xl"
        hasUnsavedChanges={clienteForm.hasChanges}
      >
          <div className="space-y-6">
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

            {/* Informações Pessoais */}
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
                    value={clienteForm.formData.nome_completo}
                    onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, nome_completo: e.target.value})}
                    isRestricted={false}
                    restrictionMessage=""
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Celular *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(xx) xxxxx-xxxx"
                    value={clienteForm.formData.celular}
                    onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, celular: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={clienteForm.formData.email || ''}
                    onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Status
                  </label>
                  <select
                    value={clienteForm.formData.status}
                    onChange={(e) => clienteForm.handleFormChange({...clienteForm.formData, status: e.target.value as 'ativo' | 'inativo' | 'potencial'})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="potencial">Potencial</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                💡 Formulario simplificado. Para dados completos, use <Link to="/admin/clientes" className="text-primary-600 hover:underline">Gestão de Clientes</Link>
              </p>
            </div>
          </div>
      </FormModal>

      {/* Modal de Visualização de Processo */}
      <ViewModal
        isOpen={processoForm.isViewingProcesso}
        onClose={processoForm.handleCloseViewModal}
        title="Detalhes do Processo"
        onEdit={processoForm.handleEditFromView}
        maxWidth="5xl"
      >
        {processoForm.viewingProcesso && (
          <>
                {/* Seção 1: Informações Principais - Grid Compacto */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Informações Principais</h3>
                    <div className={cn(
                      "inline-flex px-3 py-1.5 rounded-full text-sm font-semibold border-2 items-center gap-2",
                      processoForm.viewingProcesso.status === 'em_aberto' && 'bg-blue-100 text-blue-800 border-blue-300',
                      processoForm.viewingProcesso.status === 'em_andamento' && 'bg-yellow-100 text-yellow-800 border-yellow-300',
                      processoForm.viewingProcesso.status === 'fechado' && 'bg-green-100 text-green-800 border-green-300'
                    )}>
                      {processoForm.viewingProcesso.status === 'em_aberto' && <AlertCircle size={16} />}
                      {processoForm.viewingProcesso.status === 'em_andamento' && <Clock size={16} />}
                      {processoForm.viewingProcesso.status === 'fechado' && <CheckCircle size={16} />}
                      {processoForm.viewingProcesso.status === 'em_aberto' ? 'Em Aberto' : 
                       processoForm.viewingProcesso.status === 'em_andamento' ? 'Em Andamento' : 'Fechado'}
                    </div>
                  </div>

                  {/* Grid responsivo de campos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {processoForm.viewingProcesso.numero_processo && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Nº Processo</div>
                        <div className="text-sm font-bold text-gray-900">{processoForm.viewingProcesso.numero_processo}</div>
                      </div>
                    )}

                    {processoForm.viewingProcesso.area_direito && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Área do Direito</div>
                        <div className="text-sm font-medium text-gray-900">{processoForm.viewingProcesso.area_direito}</div>
                      </div>
                    )}

                    {processoForm.viewingProcesso.prioridade && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Prioridade</div>
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold",
                          processoForm.viewingProcesso.prioridade === 'urgente' && 'bg-red-100 text-red-800',
                          processoForm.viewingProcesso.prioridade === 'alta' && 'bg-orange-100 text-orange-800',
                          processoForm.viewingProcesso.prioridade === 'media' && 'bg-yellow-100 text-yellow-800',
                          processoForm.viewingProcesso.prioridade === 'baixa' && 'bg-green-100 text-green-800'
                        )}>
                          {processoForm.viewingProcesso.prioridade.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {processoForm.viewingProcesso.valor_causa && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Valor da Causa</div>
                        <div className="text-sm font-bold text-green-700">
                          R$ {parseFloat(processoForm.viewingProcesso.valor_causa.toString()).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    )}

                    {processoForm.viewingProcesso.polo && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Pólo</div>
                        <div className="text-sm font-medium text-gray-900">
                          {processoForm.viewingProcesso.polo === 'ativo' ? '👤 Ativo (Autor)' : '⚖️ Passivo (Réu)'}
                        </div>
                      </div>
                    )}

                    {processoForm.viewingProcesso.competencia && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Competência</div>
                        <div className="text-sm font-medium text-gray-900 capitalize">{processoForm.viewingProcesso.competencia}</div>
                      </div>
                    )}

                    {processoForm.viewingProcesso.usuarios?.nome && (
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm sm:col-span-2 lg:col-span-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                          <User size={12} />
                          Advogado
                        </div>
                        <div className="text-sm font-medium text-gray-900">{processoForm.viewingProcesso.usuarios.nome}</div>
                      </div>
                    )}
                  </div>

                  {/* Descrição */}
                  <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Descrição</div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {processoForm.viewingProcesso.descricao}
                    </p>
                  </div>

                  {/* Atividade Pendente */}
                  {processoForm.viewingProcesso.atividade_pendente && (
                    <div className="mt-4 bg-amber-50 p-4 rounded-lg border-2 border-amber-300 shadow-sm">
                      <div className="text-xs font-bold text-amber-800 uppercase mb-2 flex items-center gap-1">
                        <AlertCircle size={14} />
                        ⚠️ Atividade Pendente
                      </div>
                      <p className="text-sm text-gray-900 whitespace-pre-wrap font-medium">
                        {processoForm.viewingProcesso.atividade_pendente}
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
                      {processoForm.viewingProcesso.cliente_nome && (
                        <div className="bg-white p-3 rounded-lg border border-blue-100">
                          <div className="text-xs font-semibold text-blue-700 uppercase mb-1">Nome</div>
                          <div className="text-sm font-bold text-blue-900">{processoForm.viewingProcesso.cliente_nome}</div>
                        </div>
                      )}
                      {processoForm.viewingProcesso.cliente_email && (
                        <div className="bg-white p-3 rounded-lg border border-blue-100">
                          <div className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                            <Mail size={12} />
                            Email
                          </div>
                          <div className="text-sm text-blue-900 break-all">{processoForm.viewingProcesso.cliente_email}</div>
                        </div>
                      )}
                      {processoForm.viewingProcesso.cliente_telefone && (
                        <div className="bg-white p-3 rounded-lg border border-blue-100">
                          <div className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                            <Phone size={12} />
                            Telefone
                          </div>
                          <div className="text-sm font-medium text-blue-900">{processoForm.viewingProcesso.cliente_telefone}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Jurisdição */}
                  {processoForm.viewingProcesso.jurisdicao && (processoForm.viewingProcesso.jurisdicao.uf || processoForm.viewingProcesso.jurisdicao.municipio || processoForm.viewingProcesso.jurisdicao.vara || processoForm.viewingProcesso.jurisdicao.juiz) && (
                    <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200 p-4 sm:p-5 shadow-sm">
                      <h3 className="text-base font-bold text-purple-900 mb-3 flex items-center gap-2">
                        <Scale size={18} />
                        Jurisdição
                      </h3>
                      <div className="space-y-2">
                        {processoForm.viewingProcesso.jurisdicao.uf && (
                          <div className="bg-white p-3 rounded-lg border border-purple-100">
                            <div className="text-xs font-semibold text-purple-700 uppercase mb-1">UF</div>
                            <div className="text-sm font-bold text-purple-900">{processoForm.viewingProcesso.jurisdicao.uf}</div>
                          </div>
                        )}
                        {processoForm.viewingProcesso.jurisdicao.municipio && (
                          <div className="bg-white p-3 rounded-lg border border-purple-100">
                            <div className="text-xs font-semibold text-purple-700 uppercase mb-1">Município</div>
                            <div className="text-sm text-purple-900">{processoForm.viewingProcesso.jurisdicao.municipio}</div>
                          </div>
                        )}
                        {processoForm.viewingProcesso.jurisdicao.vara && (
                          <div className="bg-white p-3 rounded-lg border border-purple-100">
                            <div className="text-xs font-semibold text-purple-700 uppercase mb-1">Vara</div>
                            <div className="text-sm text-purple-900">{processoForm.viewingProcesso.jurisdicao.vara}</div>
                          </div>
                        )}
                        {processoForm.viewingProcesso.jurisdicao.juiz && (
                          <div className="bg-white p-3 rounded-lg border border-purple-100">
                            <div className="text-xs font-semibold text-purple-700 uppercase mb-1">Juiz(a)</div>
                            <div className="text-sm text-purple-900">{processoForm.viewingProcesso.jurisdicao.juiz}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Seção 3: Honorários */}
                {processoForm.viewingProcesso.honorarios && (processoForm.viewingProcesso.honorarios.valor_honorarios || processoForm.viewingProcesso.honorarios.detalhes) && (
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border-2 border-green-300 p-4 sm:p-5 shadow-md">
                    <h3 className="text-base font-bold text-green-900 mb-3 flex items-center gap-2">
                      💰 Honorários
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {processoForm.viewingProcesso.honorarios.valor_honorarios && (
                        <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                          <div className="text-xs font-bold text-green-700 uppercase mb-1">Valor</div>
                          <div className="text-2xl font-bold text-green-700">
                            R$ {typeof processoForm.viewingProcesso.honorarios.valor_honorarios === 'number' 
                              ? processoForm.viewingProcesso.honorarios.valor_honorarios.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                              : processoForm.viewingProcesso.honorarios.valor_honorarios}
                          </div>
                        </div>
                      )}
                      {processoForm.viewingProcesso.honorarios.detalhes && (
                        <div className="bg-white p-4 rounded-lg border border-green-200">
                          <div className="text-xs font-bold text-green-700 uppercase mb-2">Detalhes</div>
                          <p className="text-sm text-gray-900 whitespace-pre-wrap">
                            {processoForm.viewingProcesso.honorarios.detalhes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Seções colapsables con Accordion */}
                <Accordion
                  allowMultiple={false} // elegir si se permite abrir múltiples secciones al mismo tiempo
                  defaultOpen={[]} // Inicia con todas las secciones colapsadas
                  items={[
                    // Documentos
                    ...(processoForm.viewingProcesso.documentos_processo && processoForm.viewingProcesso.documentos_processo.length > 0 ? [{
                      id: 'documentos',
                      icon: <FileText size={18} className="text-gray-700" />,
                      title: 'Documentos',
                      count: processoForm.viewingProcesso.documentos_processo.length,
                      color: 'gray' as const,
                      content: (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {processoForm.viewingProcesso.documentos_processo.map((doc, index) => (
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
                      )
                    }] : []),
                    // Links
                    ...(processoForm.viewingProcesso.links_processo && processoForm.viewingProcesso.links_processo.length > 0 ? [{
                      id: 'links',
                      icon: <LinkIcon size={18} className="text-blue-600" />,
                      title: 'Links do Processo',
                      count: processoForm.viewingProcesso.links_processo.length,
                      color: 'blue' as const,
                      content: (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {processoForm.viewingProcesso.links_processo.map((link: ProcessoLink, index: number) => (
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
                      )
                    }] : []),
                    // Jurisprudências
                    ...(processoForm.viewingProcesso.jurisprudencia && processoForm.viewingProcesso.jurisprudencia.length > 0 ? [{
                      id: 'jurisprudencias',
                      icon: <Scale size={18} className="text-purple-600" />,
                      title: 'Jurisprudências',
                      count: processoForm.viewingProcesso.jurisprudencia.length,
                      color: 'purple' as const,
                      content: (
                        <div className="space-y-3">
                          {processoForm.viewingProcesso.jurisprudencia.map((juris: Jurisprudencia, index: number) => (
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
                      )
                    }] : [])
                  ]}
                />

              {/* Informações de Auditoria */}
              <AuditInfo
                creadoPor={processoForm.viewingProcesso.creado_por}
                atualizadoPor={processoForm.viewingProcesso.atualizado_por}
                dataCriacao={processoForm.viewingProcesso.data_criacao}
                dataAtualizacao={processoForm.viewingProcesso.data_atualizacao}
              />
          </>
        )}
      </ViewModal>
    </AdminPageLayout>
  )
}

export default ProcessosPage;