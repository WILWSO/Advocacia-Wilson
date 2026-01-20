import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, User, Mail, Shield, X, Eye, EyeOff, Trash2, Edit2, CheckCircle, AlertCircle, Calendar, Clock, Upload, Camera, MapPin, Phone, FileText } from 'lucide-react'
import { useUsuarios, useAuth } from '../hooks/useSupabase'
import { Usuario, supabase } from '../lib/supabase'
import { ResponsiveContainer } from '../components/shared/ResponsiveGrid'
import { useResponsive } from '../hooks/useResponsive'
import { cn } from '../utils/cn'
import Header from '../components/layout/Header'
import { AuditInfo } from '../components/shared/AuditInfo'

// Skeleton Card
const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
        <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  )
}

// Usuario Card Component
const UsuarioCard: React.FC<{ 
  usuario: Usuario
  currentUser: { id?: string; role?: string } | null
  onChangePassword: (usuario: Usuario) => void
  onView: (usuario: Usuario) => void
  index: number
}> = ({ usuario, currentUser, onChangePassword, onView, index }) => {
  const { isMobile } = useResponsive()
  const isCurrentUser = currentUser?.id === usuario.id
  const isAdmin = currentUser?.role === 'admin'

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'advogado': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'assistente': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador'
      case 'advogado': return 'Advogado'
      case 'assistente': return 'Assistente'
      default: return role
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
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-primary-900">
                {usuario.nome}
              </h3>
              {isCurrentUser && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Você
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Mail size={14} />
              {usuario.email}
            </p>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1",
            getRoleColor(usuario.role)
          )}>
            <Shield size={14} />
            {getRoleText(usuario.role)}
          </div>
        </div>

        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <span className={cn(
              "font-medium",
              usuario.ativo ? "text-green-600" : "text-red-600"
            )}>
              {usuario.ativo ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          {usuario.data_criacao && (
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Cadastrado em:</span>
              <span className="text-gray-900">
                {new Date(usuario.data_criacao).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </div>

        <div className={cn(
          "flex gap-2",
          isMobile ? "flex-col" : "flex-row"
        )}>
          {/* Botão Ver: Todos podem ver seus próprios dados, admin vê todos */}
          {(isAdmin || isCurrentUser) && (
            <button
              onClick={() => onView(usuario)}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
            >
              <Eye size={16} />
              Ver Detalhes
            </button>
          )}
          
          {/* Botão Senha: Admin vê em todos, usuários só no seu próprio card */}
          {(isAdmin || isCurrentUser) && (
            <button
              onClick={() => onChangePassword(usuario)}
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
            >
              <Shield size={16} />
              Senha
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Main Component
const UsuariosPage: React.FC = () => {
  useResponsive()
  const { user: currentUser } = useAuth()
  const { usuarios, loading, createUsuario, updateUsuario, updatePassword, deleteUsuario } = useUsuarios()

  const [busca, setBusca] = useState<string>('')
  const [filtroRole, setFiltroRole] = useState<string>('')
  const [filtroStatus, setFiltroStatus] = useState<string>('ativo')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null)
  const [viewingUsuario, setViewingUsuario] = useState<Usuario | null>(null)
  const [changingPassword, setChangingPassword] = useState<Usuario | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [formData, setFormData] = useState({
    titulo: '',
    nome: '',
    nome_completo: '',
    email: '',
    password: '',
    role: 'assistente' as 'admin' | 'advogado' | 'assistente',
    ativo: true,
    foto_perfil_url: '',
    data_nascimento: '',
    tipo_documento: '',
    numero_documento: '',
    whatsapp: '',
    redes_sociais: {} as { [key: string]: string },
    endereco: '',
    numero: '',
    localidade: '',
    estado: '',
    cep: '',
    pais: 'Brasil'
  })

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const isAdmin = currentUser?.role === 'admin'

  // Filtrar usuarios
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(usuario => {
      const matchBusca = usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        usuario.email.toLowerCase().includes(busca.toLowerCase())
      const matchRole = filtroRole === '' || usuario.role === filtroRole
      const matchStatus = filtroStatus === '' || 
                         (filtroStatus === 'ativo' && usuario.ativo) ||
                         (filtroStatus === 'inativo' && !usuario.ativo)
      
      return matchBusca && matchRole && matchStatus
    })
  }, [usuarios, busca, filtroRole, filtroStatus])

  // Stats
  const stats = useMemo(() => ({
    total: usuarios.length,
    ativos: usuarios.filter(u => u.ativo).length,
    admins: usuarios.filter(u => u.role === 'admin').length,
    advogados: usuarios.filter(u => u.role === 'advogado').length,
    assistentes: usuarios.filter(u => u.role === 'assistente').length
  }), [usuarios])

  const handleCreateUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAdmin) {
      alert('Apenas administradores podem criar usuários')
      return
    }

    const { error } = await createUsuario(formData)
    
    if (!error) {
      setShowCreateForm(false)
      setFormData({
        titulo: '',
        nome: '',
        nome_completo: '',
        email: '',
        password: '',
        role: 'usuario',
        ativo: true,
        foto_perfil_url: '',
        data_nascimento: '',
        tipo_documento: '',
        numero_documento: '',
        whatsapp: '',
        redes_sociais: {},
        endereco: '',
        numero: '',
        localidade: '',
        estado: '',
        cep: '',
        pais: 'Brasil'
      })
      alert('Usuário criado com sucesso!')
    } else {
      alert(`Erro ao criar usuário: ${error}`)
    }
  }

  const handleUpdateUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingUsuario) return

    const canEdit = isAdmin || currentUser?.id === editingUsuario.id
    
    if (!canEdit) {
      alert('Você não tem permissão para editar este usuário')
      return
    }

    const updates: Partial<Usuario> = {
      titulo: formData.titulo,
      nome: formData.nome,
      nome_completo: formData.nome_completo,
      email: formData.email,
      foto_perfil_url: formData.foto_perfil_url,
      data_nascimento: formData.data_nascimento,
      tipo_documento: formData.tipo_documento,
      numero_documento: formData.numero_documento,
      whatsapp: formData.whatsapp,
      redes_sociais: formData.redes_sociais,
      endereco: formData.endereco,
      numero: formData.numero,
      localidade: formData.localidade,
      estado: formData.estado,
      cep: formData.cep,
      pais: formData.pais
    }

    // Solo admin puede cambiar role y status
    if (isAdmin) {
      updates.role = formData.role
      updates.ativo = formData.ativo
    }

    const { error } = await updateUsuario(editingUsuario.id!, updates)
    
    if (!error) {
      setEditingUsuario(null)
      setFormData({
        titulo: '',
        nome: '',
        nome_completo: '',
        email: '',
        password: '',
        role: 'usuario',
        ativo: true,
        foto_perfil_url: '',
        data_nascimento: '',
        tipo_documento: '',
        numero_documento: '',
        whatsapp: '',
        redes_sociais: {},
        endereco: '',
        numero: '',
        localidade: '',
        estado: '',
        cep: '',
        pais: 'Brasil'
      })
      alert('Usuário atualizado com sucesso!')
    } else {
      alert(`Erro ao atualizar usuário: ${error}`)
    }
  }

  const handleChangePassword = (usuario: Usuario) => {
    setChangingPassword(usuario)
    setPasswordForm({ newPassword: '', confirmPassword: '' })
  }

  const handleViewUsuario = (usuario: Usuario) => {
    setViewingUsuario(usuario)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!changingPassword) return

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('As senhas não coincidem')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres')
      return
    }

    const { error } = await updatePassword(changingPassword.id!, passwordForm.newPassword)
    
    if (!error) {
      setChangingPassword(null)
      setPasswordForm({ newPassword: '', confirmPassword: '' })
      alert('Senha atualizada com sucesso!')
    } else {
      alert(`Erro ao atualizar senha: ${error}`)
    }
  }

  const handleDeleteUsuario = async (usuario: Usuario) => {
    if (!isAdmin) {
      alert('Apenas administradores podem excluir usuários')
      return
    }

    if (!confirm(`Tem certeza que deseja excluir o usuário ${usuario.nome}? Esta ação não pode ser desfeita.`)) {
      return
    }

    const { error } = await deleteUsuario(usuario.id!)
    
    if (!error) {
      alert('Usuário excluído com sucesso!')
    } else {
      alert(`Erro ao excluir usuário: ${error}`)
    }
  }

  // Función para subir foto de perfil a Supabase Storage
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, usuarioId?: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamaño (5MB máximo para fotos)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert('A foto é muito grande. Tamanho máximo: 5MB')
      return
    }

    // Validar tipo de archivo (solo imágenes)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não permitido. Use: JPG, PNG ou WEBP')
      return
    }

    setUploadingPhoto(true)
    setUploadProgress(0)

    try {
      // Usar ID temporal si estamos creando un nuevo usuario
      const targetId = usuarioId || editingUsuario?.id || `temp-${Date.now()}`
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const filePath = `${targetId}/${fileName}`

      // Eliminar foto anterior si existe
      if (formData.foto_perfil_url) {
        const oldUrlParts = formData.foto_perfil_url.split('/foto_perfil/')
        if (oldUrlParts.length > 1) {
          const oldFilePath = oldUrlParts[1]
          await supabase.storage.from('foto_perfil').remove([oldFilePath])
        }
      }

      // Subir nueva foto al bucket
      const { error: uploadError } = await supabase.storage
        .from('foto_perfil')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from('foto_perfil')
        .getPublicUrl(filePath)

      // Actualizar formData
      setFormData(prev => ({
        ...prev,
        foto_perfil_url: urlData.publicUrl
      }))

      setUploadProgress(100)
      alert('Foto enviada com sucesso!')
      
      // Reset input
      e.target.value = ''
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao enviar foto. Tente novamente.')
    } finally {
      setUploadingPhoto(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  // Función para eliminar foto de perfil
  const handleDeletePhoto = async () => {
    if (!confirm('Deseja realmente remover a foto de perfil?')) return

    try {
      if (formData.foto_perfil_url) {
        const urlParts = formData.foto_perfil_url.split('/foto_perfil/')
        if (urlParts.length > 1) {
          const filePath = urlParts[1]
          
          // Eliminar del storage
          const { error } = await supabase.storage
            .from('foto_perfil')
            .remove([filePath])

          if (error) throw error
        }

        // Limpiar del formulario
        setFormData({...formData, foto_perfil_url: ''})
        alert('Foto removida com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao remover foto:', error)
      alert('Erro ao remover foto')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <Header />
      
      <ResponsiveContainer className="pt-20">
        <div className="py-8">
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
            {isAdmin && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Novo Usuário</span>
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.ativos}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Advogados</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.advogados}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-gray-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Assistentes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.assistentes}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={filtroRole}
                  onChange={(e) => setFiltroRole(e.target.value)}
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
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todos</option>
                  <option value="ativo">Ativos</option>
                  <option value="inativo">Inativos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de usuarios */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {usuariosFiltrados.map((usuario, index) => (
                <UsuarioCard
                  key={usuario.id}
                  usuario={usuario}
                  currentUser={currentUser}
                  onView={handleViewUsuario}
                  onChangePassword={handleChangePassword}
                  index={index}
                />
              ))}
            </div>
          )}

          {usuariosFiltrados.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum usuário encontrado</p>
            </div>
          )}
        </div>
      </ResponsiveContainer>

      {/* Modal Crear Usuario */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">Novo Usuário</h2>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateUsuario} className="p-6 space-y-6">
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
                      value={formData.titulo}
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      placeholder="Dr., Dra., Advogado(a)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    value={formData.nome_completo}
                    onChange={(e) => setFormData({...formData, nome_completo: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isAdmin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role *
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'advogado' | 'assistente'})}
                      >
                        <option value="assistente">Assistente</option>
                        <option value="advogado">Advogado</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.data_nascimento}
                      onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Foto de Perfil */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <Camera size={20} />
                  Foto de Perfil
                </h3>
                
                <div className="space-y-4">
                  {/* Preview da foto */}
                  {formData.foto_perfil_url && (
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={formData.foto_perfil_url}
                          alt="Foto de perfil"
                          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleDeletePhoto}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Remover Foto
                      </button>
                    </div>
                  )}

                  {/* Upload de foto */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Upload size={20} className="text-blue-600 flex-shrink-0" />
                      <div className="flex-1">
                        <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md cursor-pointer transition-colors">
                          <Camera size={16} className="mr-2" />
                          {uploadingPhoto ? 'Enviando...' : 'Selecionar Foto'}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            onChange={(e) => handlePhotoUpload(e)}
                            disabled={uploadingPhoto}
                          />
                        </label>
                        {uploadingPhoto && (
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
                          Formatos aceitos: JPG, PNG, WEBP • Tamanho máximo: 5MB
                        </p>
                      </div>
                    </div>
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
                      value={formData.tipo_documento}
                      onChange={(e) => setFormData({...formData, tipo_documento: e.target.value})}
                    >
                      <option value="">Selecione</option>
                      <option value="CPF">CPF</option>
                      <option value="CNPJ">CNPJ</option>
                      <option value="RG">RG</option>
                      <option value="Passaporte">Passaporte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número do Documento
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.numero_documento}
                      onChange={(e) => setFormData({...formData, numero_documento: e.target.value})}
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
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
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
                      value={formData.endereco}
                      onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.numero}
                      onChange={(e) => setFormData({...formData, numero: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Localidade
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.localidade}
                      onChange={(e) => setFormData({...formData, localidade: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.estado}
                      onChange={(e) => setFormData({...formData, estado: e.target.value})}
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
                      value={formData.cep}
                      onChange={(e) => setFormData({...formData, cep: e.target.value})}
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
                    value={formData.pais}
                    onChange={(e) => setFormData({...formData, pais: e.target.value})}
                  />
                </div>
              </div>

              {/* Status */}
              {isAdmin && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
                    Usuário ativo
                  </label>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!isAdmin}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                  title={!isAdmin ? 'Apenas administradores podem criar usuários' : ''}
                >
                  Criar Usuário
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal Editar Usuario */}
      {editingUsuario && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-bold text-gray-800">Editar Usuário</h2>
              <button
                type="button"
                onClick={() => setEditingUsuario(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateUsuario} className="p-6 space-y-6">
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
                      value={formData.titulo}
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      placeholder="Dr., Dra., Advogado(a)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    value={formData.nome_completo}
                    onChange={(e) => setFormData({...formData, nome_completo: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isAdmin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role *
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'advogado' | 'assistente'})}
                      >
                        <option value="assistente">Assistente</option>
                        <option value="advogado">Advogado</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.data_nascimento}
                      onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Foto de Perfil */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <Camera size={20} />
                  Foto de Perfil
                </h3>
                
                <div className="space-y-4">
                  {/* Preview da foto */}
                  {formData.foto_perfil_url && (
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={formData.foto_perfil_url}
                          alt="Foto de perfil"
                          className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleDeletePhoto}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Remover Foto
                      </button>
                    </div>
                  )}

                  {/* Upload de foto */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <Upload size={20} className="text-blue-600 flex-shrink-0" />
                      <div className="flex-1">
                        <label className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md cursor-pointer transition-colors">
                          <Camera size={16} className="mr-2" />
                          {uploadingPhoto ? 'Enviando...' : 'Selecionar Foto'}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            onChange={(e) => handlePhotoUpload(e, editingUsuario?.id)}
                            disabled={uploadingPhoto}
                          />
                        </label>
                        {uploadingPhoto && (
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
                          Formatos aceitos: JPG, PNG, WEBP • Tamanho máximo: 5MB
                        </p>
                      </div>
                    </div>
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
                      value={formData.tipo_documento}
                      onChange={(e) => setFormData({...formData, tipo_documento: e.target.value})}
                    >
                      <option value="">Selecione</option>
                      <option value="CPF">CPF</option>
                      <option value="CNPJ">CNPJ</option>
                      <option value="RG">RG</option>
                      <option value="Passaporte">Passaporte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número do Documento
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.numero_documento}
                      onChange={(e) => setFormData({...formData, numero_documento: e.target.value})}
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
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
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
                      value={formData.endereco}
                      onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.numero}
                      onChange={(e) => setFormData({...formData, numero: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Localidade
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.localidade}
                      onChange={(e) => setFormData({...formData, localidade: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                      value={formData.estado}
                      onChange={(e) => setFormData({...formData, estado: e.target.value})}
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
                      value={formData.cep}
                      onChange={(e) => setFormData({...formData, cep: e.target.value})}
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
                    value={formData.pais}
                    onChange={(e) => setFormData({...formData, pais: e.target.value})}
                  />
                </div>
              </div>

              {isAdmin && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ativo-edit"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ativo-edit" className="ml-2 block text-sm text-gray-900">
                    Usuário ativo
                  </label>
                </div>
              )}

              {/* Información de Auditoría */}
              {editingUsuario && (
                <AuditInfo
                  creadoPor={editingUsuario.creado_por}
                  atualizadoPor={editingUsuario.atualizado_por}
                  dataCriacao={editingUsuario.data_criacao}
                  dataAtualizacao={editingUsuario.data_atualizacao}
                />
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingUsuario(null)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!isAdmin && editingUsuario?.id !== currentUser?.id}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                  title={!isAdmin && editingUsuario?.id !== currentUser?.id ? 'Você só pode editar seu próprio perfil' : ''}
                >
                  Salvar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal Cambiar Contraseña */}
      {changingPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full"
          >
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Alterar Senha</h2>
              <button
                type="button"
                onClick={() => setChangingPassword(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuário
                </label>
                <p className="text-gray-900 font-medium">{changingPassword.nome}</p>
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
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
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
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setChangingPassword(null)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors shadow-md"
                >
                  Alterar Senha
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal Ver Usuario */}
      {viewingUsuario && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setViewingUsuario(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-bold text-gray-900">Detalhes do Usuário</h3>
              <button
                onClick={() => setViewingUsuario(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Conteúdo */}
            <div className="p-6 space-y-6">
              {/* Foto de Perfil y Info Principal */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200">
                {/* Foto de perfil */}
                <div className="flex-shrink-0">
                  {viewingUsuario.foto_perfil_url ? (
                    <img
                      src={viewingUsuario.foto_perfil_url}
                      alt={viewingUsuario.nome}
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
                    {viewingUsuario.nome}
                  </h4>
                  {viewingUsuario.titulo && (
                    <p className="text-lg text-gray-600 mb-3">{viewingUsuario.titulo}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                    {/* Role Badge */}
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
                      viewingUsuario.role === 'admin' && 'bg-purple-100 text-purple-800',
                      viewingUsuario.role === 'advogado' && 'bg-blue-100 text-blue-800',
                      viewingUsuario.role === 'assistente' && 'bg-gray-100 text-gray-800'
                    )}>
                      <Shield size={14} />
                      {viewingUsuario.role === 'admin' && 'Administrador'}
                      {viewingUsuario.role === 'advogado' && 'Advogado'}
                      {viewingUsuario.role === 'assistente' && 'Assistente'}
                    </span>

                    {/* Status Badge */}
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
                      viewingUsuario.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    )}>
                      {viewingUsuario.ativo ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      {viewingUsuario.ativo ? 'Ativo' : 'Inativo'}
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
                  {viewingUsuario.nome_completo && (
                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nome Completo</label>
                      <p className="text-gray-900 font-medium">{viewingUsuario.nome_completo}</p>
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <label className="text-xs font-semibold text-blue-700 uppercase mb-1 flex items-center gap-1">
                      <Mail size={14} />
                      Email
                    </label>
                    <a href={`mailto:${viewingUsuario.email}`} className="text-blue-900 font-medium hover:underline">
                      {viewingUsuario.email}
                    </a>
                  </div>

                  {viewingUsuario.data_nascimento && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                        <Calendar size={14} />
                        Data de Nascimento
                      </label>
                      <p className="text-gray-900 font-medium">
                        {new Date(viewingUsuario.data_nascimento).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Documentação */}
              {(viewingUsuario.tipo_documento || viewingUsuario.numero_documento) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <FileText size={20} />
                    Documentação
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingUsuario.tipo_documento && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Tipo de Documento</label>
                        <p className="text-gray-900 font-medium">{viewingUsuario.tipo_documento}</p>
                      </div>
                    )}

                    {viewingUsuario.numero_documento && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Número do Documento</label>
                        <p className="text-gray-900 font-medium">{viewingUsuario.numero_documento}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contacto */}
              {(viewingUsuario.whatsapp || viewingUsuario.redes_sociais) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <Phone size={20} />
                    Contato e Redes Sociais
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {viewingUsuario.whatsapp && (
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <label className="text-xs font-semibold text-green-700 uppercase mb-1 flex items-center gap-1">
                          <Phone size={14} />
                          WhatsApp
                        </label>
                        <a href={`https://wa.me/${viewingUsuario.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-900 font-medium hover:underline">
                          {viewingUsuario.whatsapp}
                        </a>
                      </div>
                    )}

                    {viewingUsuario.redes_sociais && Object.keys(viewingUsuario.redes_sociais).length > 0 && (
                      <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <label className="block text-xs font-semibold text-blue-700 uppercase mb-2">Redes Sociais</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {Object.entries(viewingUsuario.redes_sociais).map(([rede, url]) => (
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
              {(viewingUsuario.endereco || viewingUsuario.localidade || viewingUsuario.cep) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                    <MapPin size={20} />
                    Endereço
                  </h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="space-y-2 text-gray-900">
                      {viewingUsuario.endereco && (
                        <p>
                          <span className="font-medium">{viewingUsuario.endereco}</span>
                          {viewingUsuario.numero && `, ${viewingUsuario.numero}`}
                        </p>
                      )}
                      {viewingUsuario.localidade && <p>{viewingUsuario.localidade}</p>}
                      {viewingUsuario.estado && <p>{viewingUsuario.estado}</p>}
                      {viewingUsuario.cep && <p>CEP: {viewingUsuario.cep}</p>}
                      {viewingUsuario.pais && <p>{viewingUsuario.pais}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Datas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
                  <Clock size={20} />
                  Informações do Sistema
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                      <Calendar size={14} />
                      Data de Cadastro
                    </label>
                    <p className="text-gray-900 font-medium">
                      {viewingUsuario.data_criacao
                        ? new Date(viewingUsuario.data_criacao).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                      <Clock size={14} />
                      Última Atualização
                    </label>
                    <p className="text-gray-900 font-medium">
                      {viewingUsuario.data_atualizacao
                        ? new Date(viewingUsuario.data_atualizacao).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* ID (útil para debug/admin) */}
                {isAdmin && viewingUsuario.id && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <label className="block text-xs font-semibold text-purple-700 uppercase mb-1">ID do Sistema</label>
                    <p className="text-xs text-purple-900 font-mono">
                      {viewingUsuario.id}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex flex-wrap gap-3">
                {/* Botão Editar: Admin vê em todos, usuários só no seu próprio */}
                {(isAdmin || currentUser?.id === viewingUsuario.id) && (
                  <button
                    onClick={() => {
                      setViewingUsuario(null)
                      setEditingUsuario(viewingUsuario)
                      setFormData({
                        titulo: viewingUsuario.titulo || '',
                        nome: viewingUsuario.nome,
                        nome_completo: viewingUsuario.nome_completo || '',
                        email: viewingUsuario.email,
                        password: '',
                        role: viewingUsuario.role,
                        ativo: viewingUsuario.ativo,
                        foto_perfil_url: viewingUsuario.foto_perfil_url || '',
                        data_nascimento: viewingUsuario.data_nascimento || '',
                        tipo_documento: viewingUsuario.tipo_documento || '',
                        numero_documento: viewingUsuario.numero_documento || '',
                        whatsapp: viewingUsuario.whatsapp || '',
                        redes_sociais: viewingUsuario.redes_sociais || {},
                        endereco: viewingUsuario.endereco || '',
                        numero: viewingUsuario.numero || '',
                        localidade: viewingUsuario.localidade || '',
                        estado: viewingUsuario.estado || '',
                        cep: viewingUsuario.cep || '',
                        pais: viewingUsuario.pais || 'Brasil'
                      })
                    }}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Edit2 size={16} />
                    Editar
                  </button>
                )}

                {/* Botão Senha: Admin vê em todos, usuários só no seu próprio */}
                {(isAdmin || currentUser?.id === viewingUsuario.id) && (
                  <button
                    onClick={() => {
                      setViewingUsuario(null)
                      setChangingPassword(viewingUsuario)
                      setPasswordForm({ newPassword: '', confirmPassword: '' })
                    }}
                    className="flex-1 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Shield size={16} />
                    Alterar Senha
                  </button>
                )}

                {/* Botão Excluir: Solo admin y no puede eliminarse a sí mismo */}
                {isAdmin && currentUser?.id !== viewingUsuario.id && (
                  <button
                    onClick={() => {
                      setViewingUsuario(null)
                      handleDeleteUsuario(viewingUsuario)
                    }}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                )}
              </div>

              {/* Botão Fechar siempre visible */}
              <button
                onClick={() => setViewingUsuario(null)}
                className="w-full mt-3 px-4 py-3 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 font-medium transition-colors"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default UsuariosPage
