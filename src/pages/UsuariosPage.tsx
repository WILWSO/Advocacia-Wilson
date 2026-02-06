import { AnimatePresence } from 'framer-motion'
import { Search, User, Mail, Shield, Eye, EyeOff, Trash2, Edit2, CheckCircle, AlertCircle, Calendar, Upload, Camera, MapPin, Phone, FileText, Briefcase, Award } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useUsuarioForm } from '../hooks/forms/useUsuarioForm'
import { useUsuarioFilters } from '../hooks/filters/useUsuarioFilters'
import { ResponsiveGrid, ResponsiveContainer } from '../components/shared/ResponsiveGrid'
import { useResponsive } from '../hooks/ui/useResponsive'
import { getRoleBadgeColor, getRoleLabel } from '../utils/roleHelpers'
import { cn } from '../utils/cn'
import { AuditInfo } from '../components/shared/AuditInfo'
import { ArrayInput } from '../components/shared/ArrayInput'
import SkeletonCard from '../components/shared/cards/SkeletonCard'
import UsuarioCard from '../components/shared/cards/UsuarioCard'
import AccessibleButton from '../components/shared/buttons/AccessibleButton'
import { FormModal } from '../components/shared/modales/FormModal'
import { ViewModal } from '../components/shared/modales/ViewModal'
import { InlineNotification } from '../components/shared/notifications/InlineNotification'
import { RestrictedInput, RestrictedSelect, RestrictedFormField } from '../components/admin/RestrictedFormField'

// Main Component
const UsuariosPage: React.FC = () => {
  useResponsive()
  
  // Hook de formulario (lógica de negocio)
  const usuarioForm = useUsuarioForm()
  
  // Hook de filtros
  const filters = useUsuarioFilters(usuarioForm.usuarios)

  // Detectar si debe abrir modal del usuario actual desde AdminHeader
  const location = useLocation()
  
  useEffect(() => {
    const state = location.state as { viewCurrentUser?: boolean } | null
    if (state?.viewCurrentUser && usuarioForm.currentUser && !usuarioForm.viewingUsuario) {
      usuarioForm.handleViewUsuario(usuarioForm.currentUser)
      // Limpiar el estado para evitar que se abra de nuevo
      window.history.replaceState({}, document.title)
    }
  }, [location.state, usuarioForm]); // Dependencia completa del form

  return (
    <>
      <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 min-h-full">
        <ResponsiveContainer className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary-900 mb-2">
                Gestão de Usuários
              </h1>
              <p className="text-gray-600">
                Gerencie os usuários do sistema
              </p>
            </div>
            {usuarioForm.isAdmin && (
              <AccessibleButton
                category="create"
                onClick={usuarioForm.handleOpenCreateForm}
                aria-label="Criar novo usuário"
                size="lg"
                className="w-full sm:w-auto"
              >
                Novo Usuário
              </AccessibleButton>
            )}
          </div>

          {/* filters.stats */}
          <ResponsiveGrid
            cols={{ xs: 1, sm: 2, lg: 4 }}
            gap={{ xs: 4, sm: 4, lg: 4 }}
            className="mb-8"
          >
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{filters.stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{filters.stats.ativos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">{filters.stats.admins}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Advogados</p>
                  <p className="text-2xl font-bold text-gray-900">{filters.stats.advogados}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-gray-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Assistentes</p>
                  <p className="text-2xl font-bold text-gray-900">{filters.stats.assistentes}</p>
                </div>
              </div>
            </div>
          </ResponsiveGrid>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <ResponsiveGrid
              cols={{ xs: 1, sm: 2, lg: 3 }}
              gap={{ xs: 4, sm: 4, lg: 4 }}
            >
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Nome ou email..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    value={filters.busca}
                    onChange={(e) => filters.setBusca(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={filters.filtroRole}
                  onChange={(e) => filters.setFiltroRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  <option value="admin">Administrador</option>
                  <option value="advogado">Advogado</option>
                  <option value="assistente">Assistente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.filtroStatus}
                  onChange={(e) => filters.setFiltroStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  <option value="ativo">Ativos</option>
                  <option value="inativo">Inativos</option>
                </select>
              </div>
            </ResponsiveGrid>
          </div>

          {/* Lista de usuarios */}
          {usuarioForm.loading ? (
            <ResponsiveGrid
              cols={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 3, '2xl': 4 }}
              gap={{ xs: 3, sm: 4, md: 5, lg: 6, xl: 7 }}
              className="animate-pulse"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </ResponsiveGrid>
          ) : (
            <ResponsiveGrid
              cols={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 3, '2xl': 4 }}
              gap={{ xs: 3, sm: 4, md: 5, lg: 6, xl: 7 }}
              className="transition-all duration-300 ease-in-out"
            >
              {filters.usuariosFiltrados.map((usuario, index) => (
                <UsuarioCard
                  key={usuario.id}
                  usuario={usuario}
                  currentUser={usuarioForm.currentUser}
                  onView={usuarioForm.handleViewUsuario}
                  onChangePassword={usuarioForm.handleChangePassword}
                  index={index}
                />
              ))}
            </ResponsiveGrid>
          )}

          {filters.usuariosFiltrados.length === 0 && !usuarioForm.loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum usuário encontrado</p>
            </div>
          )}
      </ResponsiveContainer>
    </div>

    {/* Modal Crear Usuario */}
    <FormModal
      isOpen={usuarioForm.showCreateForm}
      onClose={() => { usuarioForm.hide(); usuarioForm.handleCloseCreateForm(); }}
      title="Novo Usuário"
      onSubmit={usuarioForm.handleCreateUsuario}
      isSubmitting={false}
      submitLabel="Criar Usuário"
      maxWidth="4xl"
      hasUnsavedChanges={usuarioForm.hasCreateFormChanges}
    >
              {/* Notificación inline */}
              <AnimatePresence mode="wait">
                {usuarioForm.notification.show && (
                  <InlineNotification
                    type={usuarioForm.notification.type}
                    message={usuarioForm.notification.message}
                    onClose={usuarioForm.hide}
                    className="mb-4"
                  />
                )}
              </AnimatePresence>
              
               {/* Foto de Perfil */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <Camera size={20} />
                  Foto de Perfil
                </h3>
                
                <div className="space-y-4">
                  {/* Preview da foto */}
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {usuarioForm.formData.foto_perfil_url ? (
                        <img
                          src={usuarioForm.formData.foto_perfil_url}
                          alt="Foto de perfil"
                          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center border-4 border-gray-200 shadow-lg">
                          <User size={48} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      {usuarioForm.formData.foto_perfil_url ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Foto de perfil atual</p>
                          <button
                            type="button"
                            onClick={usuarioForm.handleDeletePhoto}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1 text-sm font-medium"
                          >
                            <Trash2 size={16} />
                            Remover Foto
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Nenhuma foto adicionada ainda</p>
                      )}
                    </div>
                  </div>

                  {/* Upload de foto */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Upload size={20} className="text-blue-600 flex-shrink-0" />
                      <div className="flex-1">
                        <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md cursor-pointer transition-colors">
                          <Camera size={16} className="mr-2" />
                          {usuarioForm.uploadingPhoto ? 'Enviando...' : 'Selecionar Foto'}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            onChange={(e) => usuarioForm.handlePhotoUpload(e)}
                            disabled={usuarioForm.uploadingPhoto}
                          />
                        </label>
                        {usuarioForm.uploadingPhoto && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${usuarioForm.uploadProgress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{usuarioForm.uploadProgress}% enviado</p>
                          </div>
                        )}
                        <p className="text-xs text-blue-700 mt-2">
                          Formatos aceitos: JPG, PNG, WEBP • Tamanho máximo: 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Básica</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.titulo}
                      onChange={(e) => usuarioForm.handleFieldChange('titulo', e.target.value)}
                      placeholder="Dr., Dra., Advogado(a)"
                    />
                  </div>

                  <div>
                    <RestrictedInput
                      label="Nome Login"
                      type="text"
                      required
                      value={usuarioForm.formData.nome}
                      onChange={(e) => usuarioForm.handleFieldChange('nome', e.target.value)}
                      isRestricted={false} // Siempre editable en creación
                    />
                  </div>
                </div>

                <div>
                  <RestrictedInput
                    label="Nome Completo"
                    type="text"
                    value={usuarioForm.formData.nome_completo}
                    onChange={(e) => usuarioForm.handleFieldChange('nome_completo', e.target.value)}
                    isRestricted={false}
                  />
                </div>

                <div>
                  <RestrictedInput
                    label="Email"
                    type="email"
                    required
                    value={usuarioForm.formData.email}
                    onChange={(e) => usuarioForm.handleFieldChange('email', e.target.value)}
                    isRestricted={false} // Siempre editable en creación
                  />
                </div>

                <RestrictedFormField
                  label="Senha"
                  required
                  helperText="Mínimo 6 caracteres"
                  isRestricted={false}
                >
                  <div className="relative">
                    <input
                      type={usuarioForm.showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.password}
                      onChange={(e) => usuarioForm.handleFieldChange('password', e.target.value)}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => usuarioForm.setShowPassword(!usuarioForm.showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={usuarioForm.showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {usuarioForm.showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </RestrictedFormField>

              {/* Contacto - REDES SOCIAIS */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Redes Sociais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.redes_sociais?.linkedin || ''}
                      onChange={(e) => usuarioForm.handleFieldChange('redes_sociais', {
                        ...usuarioForm.formData.redes_sociais,
                        linkedin: e.target.value
                      })}
                      placeholder="https://linkedin.com/in/seu-perfil"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram
                    </label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.redes_sociais?.instagram || ''}
                      onChange={(e) => usuarioForm.handleFieldChange('redes_sociais', {
                        ...usuarioForm.formData.redes_sociais,
                        instagram: e.target.value
                      })}
                      placeholder="https://instagram.com/seu-perfil"
                    />
                  </div>
                </div>
              </div>

              {/* Perfil Profesional */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Perfil Profesional</h3>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="equipe-create"
                      checked={usuarioForm.formData.equipe || false}
                      onChange={(e) => usuarioForm.handleFieldChange('equipe', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Exibir na página Equipe</span>
                  </label>
                </div>

                <ArrayInput
                  label="Educação / Formação"
                  id="educacao-create"
                  value={usuarioForm.formData.educacao || []}
                  onChange={(value: string[]) => usuarioForm.handleFieldChange('educacao', value)}
                  placeholder="Ex: Bacharel em Direito - UFT"
                  helperText="Adicione cada formação separadamente"
                  maxItems={10}
                />

                <ArrayInput
                  label="Especialidades"
                  id="especialidades-create"
                  value={usuarioForm.formData.especialidades || []}
                  onChange={(value: string[]) => usuarioForm.handleFieldChange('especialidades', value)}
                  placeholder="Ex: Direito Trabalhista"
                  helperText="Adicione cada especialidade separadamente"
                  maxItems={10}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio / Experiência
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    value={usuarioForm.formData.bio || ''}
                    onChange={(e) => usuarioForm.handleFieldChange('bio', e.target.value)}
                    placeholder="Breve descrição da experiência profissional..."
                  />
                </div>
              </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {usuarioForm.isAdmin && (
                    <div>
                      <RestrictedSelect
                        label="Role"
                        required
                        value={usuarioForm.formData.role}
                        onChange={(e) => usuarioForm.handleFieldChange('role', e.target.value as 'admin' | 'advogado' | 'assistente')}
                        isRestricted={false} // Siempre editable para admin
                      >
                        <option value="assistente">Assistente</option>
                        <option value="advogado">Advogado</option>
                        <option value="admin">Administrador</option>
                      </RestrictedSelect>
                    </div>
                  )}

                  {/* ✨ NUEVO CAMPO POSICAO */}
                  <div>
                    <RestrictedSelect
                      label="Posição"
                      required
                      value={usuarioForm.formData.posicao}
                      onChange={(e) => usuarioForm.handleFieldChange('posicao', e.target.value as 'Socio' | 'Associado' | 'Parceiro')}
                      isRestricted={false} // Editable en creación
                    >
                      <option value="Associado">Associado</option>
                      <option value="Socio">Sócio</option>
                      <option value="Parceiro">Parceiro</option>
                    </RestrictedSelect>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.data_nascimento}
                      onChange={(e) => usuarioForm.handleFieldChange('data_nascimento', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Documentación */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Documentação</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Documento
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.tipo_documento}
                      onChange={(e) => usuarioForm.handleFieldChange('tipo_documento', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="CPF">CPF</option>
                      <option value="RG">RG</option>
                      <option value="Passaporte">Passaporte</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número do Documento
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.numero_documento}
                      onChange={(e) => usuarioForm.handleFieldChange('numero_documento', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contacto</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    value={usuarioForm.formData.whatsapp}
                    onChange={(e) => usuarioForm.handleFieldChange('whatsapp', e.target.value)}
                    placeholder="+55 (11) 99999-9999"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Endereço</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Endereço
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.endereco}
                      onChange={(e) => usuarioForm.handleFieldChange('endereco', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.numero}
                      onChange={(e) => usuarioForm.handleFieldChange('numero', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.cidade}
                      onChange={(e) => usuarioForm.handleFieldChange('cidade', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.estado}
                      onChange={(e) => usuarioForm.handleFieldChange('estado', e.target.value)}
                      placeholder="SP, RJ, MG..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.cep}
                      onChange={(e) => usuarioForm.handleFieldChange('cep', e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    value={usuarioForm.formData.pais}
                    onChange={(e) => usuarioForm.handleFieldChange('pais', e.target.value)}
                  />
                </div>
              </div>

              {/* Status */}
              {usuarioForm.isAdmin && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={usuarioForm.formData.ativo}
                    onChange={(e) => usuarioForm.handleFieldChange('ativo', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
                    Usuário ativo
                  </label>
                </div>
              )}
            </FormModal>

    {/* Modal Editar Usuario */}
    <FormModal
      isOpen={!!usuarioForm.editingUsuario}
      onClose={() => { usuarioForm.hide(); usuarioForm.handleCloseEditForm(); }}
      title="Editar Usuário"
      onSubmit={usuarioForm.handleUpdateUsuario}
      isSubmitting={usuarioForm.isUpdating}
      submitLabel="Salvar"
      maxWidth="4xl"
      hasUnsavedChanges={usuarioForm.hasEditFormChanges}
    >
              {/* Notificación inline */}
              <AnimatePresence mode="wait">
                {usuarioForm.notification.show && (
                  <InlineNotification
                    type={usuarioForm.notification.type}
                    message={usuarioForm.notification.message}
                    onClose={usuarioForm.hide}
                    className="mb-4"
                  />
                )}
              </AnimatePresence>
              
              {/* Foto de Perfil */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <Camera size={20} />
                  Foto de Perfil
                </h3>
                
                <div className="space-y-4">
                  {/* Preview da foto */}
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {usuarioForm.formData.foto_perfil_url ? (
                        <img
                          src={usuarioForm.formData.foto_perfil_url}
                          alt="Foto de perfil"
                          className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center border-4 border-gray-200 shadow-lg">
                          <User size={48} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      {usuarioForm.formData.foto_perfil_url ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Foto de perfil atual</p>
                          <button
                            type="button"
                            onClick={usuarioForm.handleDeletePhoto}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1 text-sm font-medium"
                          >
                            <Trash2 size={16} />
                            Remover Foto
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Nenhuma foto adicionada ainda</p>
                      )}
                    </div>
                  </div>

                  {/* Upload de foto */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Upload size={20} className="text-blue-600 flex-shrink-0" />
                      <div className="flex-1">
                        <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md cursor-pointer transition-colors">
                          <Camera size={16} className="mr-2" />
                          {usuarioForm.uploadingPhoto ? 'Enviando...' : 'Selecionar Foto'}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            onChange={(e) => usuarioForm.handlePhotoUpload(e, usuarioForm.editingUsuario?.id)}
                            disabled={usuarioForm.uploadingPhoto}
                          />
                        </label>
                        {usuarioForm.uploadingPhoto && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${usuarioForm.uploadProgress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{usuarioForm.uploadProgress}% enviado</p>
                          </div>
                        )}
                        <p className="text-xs text-blue-700 mt-2">
                          Formatos aceitos: JPG, PNG, WEBP • Tamanho máximo: 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Básica</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.titulo}
                      onChange={(e) => usuarioForm.handleFieldChange('titulo', e.target.value)}
                      placeholder="Dr., Dra., Advogado(a)"
                    />
                  </div>

                  <div>
                    <RestrictedInput
                      label="Nome Login (aparecerá menu de login)"
                      type="text"
                      required
                      value={usuarioForm.formData.nome}
                      onChange={(e) => usuarioForm.handleFieldChange('nome', e.target.value)}
                      isRestricted={!usuarioForm.isAdmin && usuarioForm.currentUser?.id !== usuarioForm.editingUsuario?.id}
                      restrictionMessage="Apenas admin ou próprio usuário pode editar"
                    />
                  </div>
                </div>

                <div>
                  <RestrictedInput
                    label="Nome Completo"
                    type="text"
                    value={usuarioForm.formData.nome_completo}
                    onChange={(e) => usuarioForm.handleFieldChange('nome_completo', e.target.value)}
                    isRestricted={false}
                  />
                </div>

                <div>
                  <RestrictedInput
                    label="Email"
                    type="email"
                    required
                    value={usuarioForm.formData.email}
                    onChange={(e) => usuarioForm.handleFieldChange('email', e.target.value)}
                    isRestricted={!usuarioForm.isAdmin && usuarioForm.currentUser?.id !== usuarioForm.editingUsuario?.id}
                    restrictionMessage="Apenas admin ou próprio usuário pode editar"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {usuarioForm.isAdmin && (
                    <div>
                      <RestrictedSelect
                        label="Role"
                        required
                        value={usuarioForm.formData.role}
                        onChange={(e) => usuarioForm.handleFieldChange('role', e.target.value as 'admin' | 'advogado' | 'assistente')}
                        isRestricted={false} // Solo admin puede ver este campo ya
                      >
                        <option value="assistente">Assistente</option>
                        <option value="advogado">Advogado</option>
                        <option value="admin">Administrador</option>
                      </RestrictedSelect>
                    </div>
                  )}

                  {/* ✨ NUEVO CAMPO POSICAO */}
                  <div>
                    <RestrictedSelect
                      label="Posição"
                      required
                      value={usuarioForm.formData.posicao}
                      onChange={(e) => usuarioForm.handleFieldChange('posicao', e.target.value as 'Socio' | 'Associado' | 'Parceiro')}
                      isRestricted={!usuarioForm.isAdmin}
                      restrictionMessage="Apenas admin pode alterar posição"
                    >
                      <option value="Associado">Associado</option>
                      <option value="Socio">Sócio</option>
                      <option value="Parceiro">Parceiro</option>
                    </RestrictedSelect>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.data_nascimento}
                      onChange={(e) => usuarioForm.handleFieldChange('data_nascimento', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Contacto - REDES SOCIAIS */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Redes Sociais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.redes_sociais?.linkedin || ''}
                      onChange={(e) => usuarioForm.handleFieldChange('redes_sociais', {
                        ...usuarioForm.formData.redes_sociais,
                        linkedin: e.target.value
                      })}
                      placeholder="https://linkedin.com/in/seu-perfil"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instagram
                    </label>
                    <input
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.redes_sociais?.instagram || ''}
                      onChange={(e) => usuarioForm.handleFieldChange('redes_sociais', {
                        ...usuarioForm.formData.redes_sociais,
                        instagram: e.target.value
                      })}
                      placeholder="https://instagram.com/seu-perfil"
                    />
                  </div>
                </div>
              </div>

              {/* Perfil Profesional */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Perfil Profissional</h3>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="equipe-edit"
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    checked={usuarioForm.formData.equipe || false}
                    onChange={(e) => usuarioForm.handleFieldChange('equipe', e.target.checked)}
                  />
                  <label htmlFor="equipe-edit" className="text-sm font-medium text-gray-700">
                    Exibir na página "Equipe"
                  </label>
                </div>

                <ArrayInput
                  label="Educação / Formação"
                  id="educacao-edit"
                  value={usuarioForm.formData.educacao || []}
                  onChange={(value: string[]) => usuarioForm.handleFieldChange('educacao', value)}
                  placeholder="Ex: Bacharel em Direito - UFT"
                  helperText="Adicione cada formação separadamente"
                  maxItems={10}
                />

                <ArrayInput
                  label="Especialidades"
                  id="especialidades-edit"
                  value={usuarioForm.formData.especialidades || []}
                  onChange={(value: string[]) => usuarioForm.handleFieldChange('especialidades', value)}
                  placeholder="Ex: Direito Trabalhista"
                  helperText="Adicione cada especialidade separadamente"
                  maxItems={10}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biografia Profissional
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 min-h-[120px]"
                    value={usuarioForm.formData.bio || ''}
                    onChange={(e) => usuarioForm.handleFieldChange('bio', e.target.value)}
                    placeholder="Breve descrição da experiência e áreas de atuação do profissional"
                    rows={4}
                  />
                </div>
              </div>

              {/* Documentación */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Documentação</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Documento
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.tipo_documento}
                      onChange={(e) => usuarioForm.handleFieldChange('tipo_documento', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="CPF">CPF</option>
                      <option value="RG">RG</option>
                      <option value="Passaporte">Passaporte</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número do Documento
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.numero_documento}
                      onChange={(e) => usuarioForm.handleFieldChange('numero_documento', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contacto</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    value={usuarioForm.formData.whatsapp}
                    onChange={(e) => usuarioForm.handleFieldChange('whatsapp', e.target.value)}
                    placeholder="+55 (11) 99999-9999"
                  />
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Endereço</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Endereço
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.endereco}
                      onChange={(e) => usuarioForm.handleFieldChange('endereco', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.numero}
                      onChange={(e) => usuarioForm.handleFieldChange('numero', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.cidade}
                      onChange={(e) => usuarioForm.handleFieldChange('cidade', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.estado}
                      onChange={(e) => usuarioForm.handleFieldChange('estado', e.target.value)}
                      placeholder="SP, RJ, MG..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={usuarioForm.formData.cep}
                      onChange={(e) => usuarioForm.handleFieldChange('cep', e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    value={usuarioForm.formData.pais}
                    onChange={(e) => usuarioForm.handleFieldChange('pais', e.target.value)}
                  />
                </div>
              </div>

              {usuarioForm.isAdmin && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ativo-edit"
                    checked={usuarioForm.formData.ativo}
                    onChange={(e) => usuarioForm.handleFormChange({...usuarioForm.formData, ativo: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ativo-edit" className="ml-2 block text-sm text-gray-900">
                    Usuário ativo
                  </label>
                </div>
              )}

              {/* Información de Auditoría */}
              {usuarioForm.editingUsuario && (
                <AuditInfo
                  creadoPor={usuarioForm.editingUsuario.creado_por}
                  atualizadoPor={usuarioForm.editingUsuario.atualizado_por}
                  dataCriacao={usuarioForm.editingUsuario.data_criacao}
                  dataAtualizacao={usuarioForm.editingUsuario.data_atualizacao}
                />
              )}
            </FormModal>

      {/* Modal Cambiar Contraseña */}
      <FormModal
        isOpen={!!usuarioForm.changingPassword}
        onClose={() => { usuarioForm.hide(); usuarioForm.handleClosePasswordModal(); }}
        title="Alterar Senha"
        onSubmit={usuarioForm.handleUpdatePassword}
        submitLabel="Alterar Senha"
        maxWidth="md"
        hasUnsavedChanges={usuarioForm.hasPasswordFormChanges}
      >
            {/* Notificación inline */}
            <AnimatePresence mode="wait">
              {usuarioForm.notification.show && (
                <InlineNotification
                  type={usuarioForm.notification.type}
                  message={usuarioForm.notification.message}
                  onClose={usuarioForm.hide}
                  className="mb-4"
                />
              )}
            </AnimatePresence>
            
            {usuarioForm.changingPassword && (
              <>
              {/* Campo oculto de usuario para accesibilidad */}
              <input
                type="text"
                name="username"
                value={usuarioForm.changingPassword.email}
                autoComplete="username"
                style={{ display: 'none' }}
                readOnly
                aria-hidden="true"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuário
                </label>
                <p className="text-gray-900 font-medium">{usuarioForm.changingPassword.nome}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Senha *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  value={usuarioForm.passwordForm.newPassword}
                  onChange={(e) => usuarioForm.setPasswordForm({...usuarioForm.passwordForm, newPassword: e.target.value})}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                  value={usuarioForm.passwordForm.confirmPassword}
                  onChange={(e) => usuarioForm.setPasswordForm({...usuarioForm.passwordForm, confirmPassword: e.target.value})}
                  autoComplete="new-password"
                />
              </div>
              </>
            )}
      </FormModal>

    {/* Modal Ver Usuario */}
    <ViewModal
      isOpen={!!usuarioForm.viewingUsuario}
      onClose={() => usuarioForm.handleCloseViewModal()}
      title="Detalhes do Usuário"
      maxWidth="2xl"
      canEdit={false} // Desabilita o botão Editar padrão de ViewModal
      additionalActions={
        usuarioForm.viewingUsuario && (
          <>
            {/* Botão Editar: Admin vê em todos, usuários só no seu próprio */}
            {(usuarioForm.isAdmin || usuarioForm.currentUser?.id === usuarioForm.viewingUsuario.id) && (
              <AccessibleButton
                onClick={() => usuarioForm.handleEditUsuario(usuarioForm.viewingUsuario!)}
                variant="primary"
                size="lg"
                leftIcon={<Edit2 size={16} />}
                aria-label={`Editar usuário ${usuarioForm.viewingUsuario.nome}`}
              >
                Editar
              </AccessibleButton>
            )}

            {/* Botão Senha: Admin vê em todos, usuários só no seu próprio */}
            {(usuarioForm.isAdmin || usuarioForm.currentUser?.id === usuarioForm.viewingUsuario.id) && (
              <AccessibleButton
                onClick={() => {
                  usuarioForm.handleCloseViewModal()
                  usuarioForm.handleChangePassword(usuarioForm.viewingUsuario!)
                  usuarioForm.setPasswordForm({ newPassword: '', confirmPassword: '' })
                }}
                variant="warning"
                size="lg"
                leftIcon={<Shield size={16} />}
                aria-label={`Alterar senha de ${usuarioForm.viewingUsuario.nome}`}
              >
                Alterar Senha
              </AccessibleButton>
            )}

            {/* Botão Excluir: Solo admin y no puede eliminarse a sí mismo */}
            {usuarioForm.isAdmin && usuarioForm.currentUser?.id !== usuarioForm.viewingUsuario.id && (
              <AccessibleButton
                onClick={() => {
                  usuarioForm.handleCloseViewModal()
                  usuarioForm.handleDeleteUsuario(usuarioForm.viewingUsuario!)
                }}
                variant="danger"
                size="lg"
                leftIcon={<Trash2 size={16} />}
                aria-label={`Excluir usuário ${usuarioForm.viewingUsuario.nome}`}
              >
                Excluir
              </AccessibleButton>
            )}
          </>
        )
      }
    >
      {usuarioForm.viewingUsuario && <>
            <div className="space-y-6">
              {/* Foto de Perfil y Info Principal */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200">
                {/* Foto de perfil */}
                <div className="flex-shrink-0">
                  {usuarioForm.viewingUsuario.foto_perfil_url ? (
                    <img
                      src={usuarioForm.viewingUsuario.foto_perfil_url}
                      alt={usuarioForm.viewingUsuario.nome}
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center border-4 border-gray-200 shadow-lg">
                      <User size={48} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Informações principais */}
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {usuarioForm.viewingUsuario.titulo ? `${usuarioForm.viewingUsuario.titulo} ${usuarioForm.viewingUsuario.nome}` : usuarioForm.viewingUsuario.nome}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                    {/* Role Badge */}
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border",
                      getRoleBadgeColor(usuarioForm.viewingUsuario.role)
                    )}>
                      <Shield size={14} />
                      {getRoleLabel(usuarioForm.viewingUsuario.role)}
                    </span>

                    {/* ✨ Posição Badge */}
                    {usuarioForm.viewingUsuario.posicao && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        <Award size={14} />
                        {usuarioForm.viewingUsuario.posicao}
                      </span>
                    )}

                    {/* Status Badge */}
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
                      usuarioForm.viewingUsuario.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    )}>
                      {usuarioForm.viewingUsuario.ativo ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      {usuarioForm.viewingUsuario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información Básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <User size={20} />
                  Informações Pessoais
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nome Login */}
                  <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                    <label className="text-xs font-semibold text-primary-700 uppercase mb-1 flex items-center gap-1">
                      <User size={14} />
                      Nome Login
                    </label>
                    <p className="text-primary-900 font-medium">
                      {usuarioForm.viewingUsuario.titulo ? 
                        `${usuarioForm.viewingUsuario.titulo} ${usuarioForm.viewingUsuario.nome}` : 
                        usuarioForm.viewingUsuario.nome
                      }
                    </p>
                  </div>

                  {usuarioForm.viewingUsuario.nome_completo && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nome Completo</label>
                      <p className="text-gray-900 font-medium">{usuarioForm.viewingUsuario.nome_completo}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                      <Mail size={14} />
                      Email
                    </label>
                    <a href={`mailto:${usuarioForm.viewingUsuario.email}`} className="text-blue-900 font-medium hover:underline">
                      {usuarioForm.viewingUsuario.email}
                    </a>
                  </div>

                  {usuarioForm.viewingUsuario.data_nascimento && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <Calendar size={14} />
                        Data de Nascimento
                      </label>
                      <p className="text-gray-900 font-medium">
                        {new Date(usuarioForm.viewingUsuario.data_nascimento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documentação */}
              {(usuarioForm.viewingUsuario.tipo_documento || usuarioForm.viewingUsuario.numero_documento) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <FileText size={20} />
                    Documentação
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {usuarioForm.viewingUsuario.tipo_documento && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tipo de Documento</label>
                        <p className="text-gray-900 font-medium">{usuarioForm.viewingUsuario.tipo_documento}</p>
                      </div>
                    )}

                    {usuarioForm.viewingUsuario.numero_documento && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Número do Documento</label>
                        <p className="text-gray-900 font-medium">{usuarioForm.viewingUsuario.numero_documento}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contacto */}
              {(usuarioForm.viewingUsuario.whatsapp || usuarioForm.viewingUsuario.redes_sociais) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Phone size={20} />
                    Contato e Redes Sociais
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {usuarioForm.viewingUsuario.whatsapp && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <label className="text-xs font-semibold text-green-700 uppercase mb-1 flex items-center gap-1">
                          <Phone size={14} />
                          WhatsApp
                        </label>
                        <a href={`https://wa.me/${usuarioForm.viewingUsuario.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-900 font-medium hover:underline">
                          {usuarioForm.viewingUsuario.whatsapp}
                        </a>
                      </div>
                    )}

                    {usuarioForm.viewingUsuario.redes_sociais && Object.keys(usuarioForm.viewingUsuario.redes_sociais).length > 0 && (
                      <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <label className="block text-xs font-semibold text-blue-700 uppercase mb-2">Redes Sociais</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {Object.entries(usuarioForm.viewingUsuario.redes_sociais).map(([rede, url]) => (
                            <a
                              key={rede}
                              href={url as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-blue-900 hover:text-blue-700 hover:underline"
                            >
                              <span className="font-medium capitalize">{rede}:</span>
                              <span className="text-sm truncate">{url as string}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Endereço */}
              {(usuarioForm.viewingUsuario.endereco || usuarioForm.viewingUsuario.cidade || usuarioForm.viewingUsuario.cep) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <MapPin size={20} />
                    Endereço
                  </h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="space-y-2 text-gray-900">
                      {usuarioForm.viewingUsuario.endereco && (
                        <p>
                          <span className="font-medium">{usuarioForm.viewingUsuario.endereco}</span>
                          {usuarioForm.viewingUsuario.numero && `, ${usuarioForm.viewingUsuario.numero}`}
                        </p>
                      )}
                      {usuarioForm.viewingUsuario.cidade && <p>{usuarioForm.viewingUsuario.cidade}</p>}
                      {usuarioForm.viewingUsuario.estado && <p>{usuarioForm.viewingUsuario.estado}</p>}
                      {usuarioForm.viewingUsuario.cep && <p>CEP: {usuarioForm.viewingUsuario.cep}</p>}
                      {usuarioForm.viewingUsuario.pais && <p>{usuarioForm.viewingUsuario.pais}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Información Profesional */}
              {(usuarioForm.viewingUsuario.equipe || (usuarioForm.viewingUsuario.educacao && usuarioForm.viewingUsuario.educacao.length > 0) || (usuarioForm.viewingUsuario.especialidades && usuarioForm.viewingUsuario.especialidades.length > 0) || usuarioForm.viewingUsuario.bio) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Briefcase size={20} />
                    Informações Profissionais
                  </h3>
                  
                  {/* Equipe */}
                  {usuarioForm.viewingUsuario.equipe !== undefined && (
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <label className="block text-xs font-semibold text-amber-700 uppercase mb-1">Parte da Equipe</label>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
                        usuarioForm.viewingUsuario.equipe ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                      )}>
                        {usuarioForm.viewingUsuario.equipe ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        {usuarioForm.viewingUsuario.equipe ? 'Sim' : 'Não'}
                      </span>
                    </div>
                  )}

                  {/* Educação / Formação */}
                  {usuarioForm.viewingUsuario.educacao && usuarioForm.viewingUsuario.educacao.length > 0 && (
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                      <label className="block text-xs font-semibold text-indigo-700 uppercase mb-2">Educação / Formação</label>
                      <ul className="space-y-2">
                        {usuarioForm.viewingUsuario.educacao.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-900">
                            <CheckCircle size={16} className="text-indigo-600 mt-1 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Especialidades */}
                  {usuarioForm.viewingUsuario.especialidades && usuarioForm.viewingUsuario.especialidades.length > 0 && (
                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                      <label className="block text-xs font-semibold text-teal-700 uppercase mb-2">Especialidades</label>
                      <div className="flex flex-wrap gap-2">
                        {usuarioForm.viewingUsuario.especialidades.map((item, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-teal-300 rounded-full text-sm text-teal-900 font-medium">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Biografia */}
                  {usuarioForm.viewingUsuario.bio && (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Biografia</label>
                      <p className="text-slate-900 leading-relaxed whitespace-pre-wrap">{usuarioForm.viewingUsuario.bio}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Informações do Sistema */}
              <AuditInfo
                creadoPor={usuarioForm.viewingUsuario.creado_por}
                atualizadoPor={usuarioForm.viewingUsuario.atualizado_por}
                dataCriacao={usuarioForm.viewingUsuario.data_criacao}
                dataAtualizacao={usuarioForm.viewingUsuario.data_atualizacao}
              />
            </div>
      </>}
    </ViewModal>
    </>
  )
}

export default UsuariosPage





