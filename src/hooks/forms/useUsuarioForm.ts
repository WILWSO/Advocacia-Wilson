/**
 * Hook para gestión de formulario de Usuarios
 * Centraliza toda la lógica de negocio: CRUD, upload de fotos, cambio de contraseña, estados, handlers, permisos
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuthLogin as useAuth } from '../../components/auth/useAuthLogin'
import { useUsuarios } from '../data-access/useUsuarios'
import { useNotification } from '../../components/shared/notifications/useNotification'
import { useInlineNotification } from '../ui/useInlineNotification'
import { useUnsavedChanges } from './useUnsavedChanges'
import { usePermissions } from '../auth/usePermissions'
import { Usuario, UsuarioFormData, PasswordForm } from '../../types/usuario'
import { StorageService } from '../../services/storageService'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../config/messages'
import { formatFormData } from '../../utils/fieldFormatters'

export const useUsuarioForm = () => {
  const { user: currentUser } = useAuth()
  const { usuarios, loading, createUsuario, updateUsuario, updatePassword, deleteUsuario } = useUsuarios()
  const { notification, error: errorNotif, success, warning, hide } = useInlineNotification()
  const { success: successToast, confirm: confirmDialog } = useNotification()

  // Permisos centralizados
  const { isAdmin } = usePermissions()

  // Estados principales
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null)
  const [viewingUsuario, setViewingUsuario] = useState<Usuario | null>(null)
  const [changingPassword, setChangingPassword] = useState<Usuario | null>(null)
  
  // Estados auxiliares
  const [showPassword, setShowPassword] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUpdating, setIsUpdating] = useState(false)

  // Datos iniciales para detectar cambios - Modal Crear
  const createInitialData: UsuarioFormData = useMemo(() => ({
    titulo: '',
    nome: '',
    nome_completo: '',
    email: '',
    password: '',
    role: 'assistente',
    posicao: 'Associado', // ✨ Valor por defecto
    ativo: true,
    foto_perfil_url: '',
    data_nascimento: '',
    tipo_documento: '',
    numero_documento: '',
    whatsapp: '',
    redes_sociais: {},
    endereco: '',
    numero: '',
    cidade: '',
    estado: '',
    cep: '',
    pais: 'Brasil',
    equipe: false,
    educacao: [],
    especialidades: [],
    bio: ''
  }), []);

  // Datos iniciales para detectar cambios - Modal Editar
  const editInitialData: UsuarioFormData = editingUsuario ? {
    titulo: editingUsuario.titulo || '',
    nome: editingUsuario.nome || '',
    nome_completo: editingUsuario.nome_completo || '',
    email: editingUsuario.email || '',
    password: '',
    role: editingUsuario.role || 'assistente',
    posicao: editingUsuario.posicao || 'Associado', // ✨ Con fallback
    ativo: editingUsuario.ativo ?? true,
    foto_perfil_url: editingUsuario.foto_perfil_url || '',
    data_nascimento: editingUsuario.data_nascimento || '',
    tipo_documento: editingUsuario.tipo_documento || '',
    numero_documento: editingUsuario.numero_documento || '',
    whatsapp: editingUsuario.whatsapp || '',
    redes_sociais: editingUsuario.redes_sociais || {},
    endereco: editingUsuario.endereco || '',
    numero: editingUsuario.numero || '',
    cidade: editingUsuario.cidade || '',
    estado: editingUsuario.estado || '',
    cep: editingUsuario.cep || '',
    pais: editingUsuario.pais || 'Brasil',
    equipe: editingUsuario.equipe ?? false,
    educacao: editingUsuario.educacao || [],
    especialidades: editingUsuario.especialidades || [],
    bio: editingUsuario.bio || ''
  } : createInitialData;

  // Datos iniciales para detectar cambios - Modal Password
  const passwordInitialData: PasswordForm = useMemo(() => ({
    newPassword: '',
    confirmPassword: ''
  }), []);

  // Form data
  const [formData, setFormData] = useState<UsuarioFormData>(editingUsuario ? editInitialData : createInitialData)

  const [passwordForm, setPasswordForm] = useState<PasswordForm>(passwordInitialData)

  // Hooks para detectar cambios no guardados
  const { hasChanges: hasCreateFormChanges, updateCurrent: updateCreateForm, resetInitial: resetCreateForm } = useUnsavedChanges(createInitialData);
  const { hasChanges: hasEditFormChanges, updateCurrent: updateEditForm, resetInitial: resetEditForm } = useUnsavedChanges(editInitialData);
  const { hasChanges: hasPasswordFormChanges, updateCurrent: updatePasswordForm, resetInitial: resetPasswordForm } = useUnsavedChanges(passwordInitialData);

  // Sincronizar con modal states
  useEffect(() => {
    if (editingUsuario) {
      const data = {
        titulo: editingUsuario.titulo || '',
        nome: editingUsuario.nome || '',
        nome_completo: editingUsuario.nome_completo || '',
        email: editingUsuario.email || '',
        password: '',
        role: editingUsuario.role || 'assistente',
        posicao: editingUsuario.posicao || 'Associado', // ✨ Con fallback
        ativo: editingUsuario.ativo ?? true,
        foto_perfil_url: editingUsuario.foto_perfil_url || '',
        data_nascimento: editingUsuario.data_nascimento || '',
        tipo_documento: editingUsuario.tipo_documento || '',
        numero_documento: editingUsuario.numero_documento || '',
        whatsapp: editingUsuario.whatsapp || '',
        redes_sociais: editingUsuario.redes_sociais || {},
        endereco: editingUsuario.endereco || '',
        numero: editingUsuario.numero || '',
        cidade: editingUsuario.cidade || '',
        estado: editingUsuario.estado || '',
        cep: editingUsuario.cep || '',
        pais: editingUsuario.pais || 'Brasil',
        equipe: editingUsuario.equipe ?? false,
        educacao: editingUsuario.educacao || [],
        especialidades: editingUsuario.especialidades || [],
        bio: editingUsuario.bio || ''
      };
      setFormData(data);
      resetEditForm(data);
    } else if (showCreateForm) {
      setFormData(createInitialData);
      resetCreateForm(createInitialData);
    }
  }, [editingUsuario, showCreateForm, resetEditForm, resetCreateForm, createInitialData]);

  useEffect(() => {
    if (changingPassword) {
      setPasswordForm(passwordInitialData);
      resetPasswordForm(passwordInitialData);
    }
  }, [changingPassword, resetPasswordForm, passwordInitialData]);

  // Handler para actualizar formData y detectar cambios - Create/Edit
  // Mantiene strings vacíos para prevenir warnings de React en inputs controlados
  const handleFormChange = (newData: UsuarioFormData) => {
    setFormData(newData);
    if (editingUsuario) {
      updateEditForm(newData);
    } else {
      updateCreateForm(newData);
    }
  };

  // Handler para aplicar formateo en tiempo real a campos específicos
  const handleFieldChange = (field: keyof UsuarioFormData, value: string | boolean | string[]) => {
    let formattedValue = value;
    
    // Si es string, aplicar formateo
    if (typeof value === 'string') {
      // Formatear campos VARCHAR a MAYÚSCULAS en tiempo real (excepto 'titulo' que debe quedar como usuario escribe)
      if (['nome', 'nome_completo', 'numero_documento', 'endereco', 'cidade', 'estado', 'pais'].includes(field)) {
        formattedValue = value.toUpperCase();
      }
      // Formatear email a minúsculas en tiempo real
      else if (field === 'email') {
        formattedValue = value.toLowerCase();
      }
      // 'titulo' y otros campos TEXT permanecen sin formatear
    }
    // Para boolean y arrays, usar valor directamente
    
    handleFormChange({ ...formData, [field]: formattedValue });
  };

  // Handler para actualizar passwordForm y detectar cambios
  const handlePasswordFormChange = (newData: PasswordForm) => {
    setPasswordForm(newData);
    updatePasswordForm(newData);
  };

  // Reset form data
  const resetFormData = useCallback(() => {
    setFormData({
      titulo: '',
      nome: '',
      nome_completo: '',
      email: '',
      password: '',
      role: 'assistente',
      posicao: 'Associado', // Campo obligatorio
      ativo: true,
      foto_perfil_url: '',
      data_nascimento: '',
      tipo_documento: '',
      numero_documento: '',
      whatsapp: '',
      redes_sociais: {},
      endereco: '',
      numero: '',
      cidade: '',
      estado: '',
      cep: '',
      pais: 'Brasil',
      equipe: false,
      educacao: [],
      especialidades: [],
      bio: ''
    })
  }, [])

  // Crear usuario
  const handleCreateUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAdmin) {
      warning('Apenas administradores podem criar usuários')
      return
    }

    // Validaciones campos obligatorios
    if (!formData.email?.trim()) {
      errorNotif('Email é obrigatório')
      return
    }

    if (!formData.nome?.trim()) {
      errorNotif('Nome é obrigatório')
      return
    }

    if (!formData.role) {
      errorNotif('Perfil (role) é obrigatório')
      return
    }

    if (!formData.password) {
      errorNotif(ERROR_MESSAGES.usuarios.PASSWORD_REQUIRED)
      return
    }

    if (formData.password.length < 6) {
      errorNotif('A senha deve ter no mínimo 6 caracteres')
      return
    }

    // Validación formato email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(formData.email.trim())) {
      errorNotif('Email inválido')
      return
    }

    // Validación email duplicado
    const emailExistente = usuarios.find(
      u => u.email?.toLowerCase() === formData.email?.toLowerCase()
    )
    if (emailExistente) {
      errorNotif(`Email já cadastrado para o usuário: ${emailExistente.nome}`)
      return
    }

    // Validación numero_documento duplicado (solo si no está vacío)
    if (formData.numero_documento?.trim()) {
      const documentoExistente = usuarios.find(
        u => u.numero_documento?.toUpperCase() === formData.numero_documento?.toUpperCase()
      )
      if (documentoExistente) {
        errorNotif(`Número do documento já cadastrado para o usuário: ${documentoExistente.nome}`)
        return
      }
    }

    // Formatear campos antes de enviar
    const formattedData = formatFormData({...formData} as unknown as Record<string, unknown>)

    const { error } = await createUsuario(formattedData as unknown as Omit<Usuario, 'id'> & { password: string })
    
    if (!error) {
      setShowCreateForm(false)
      resetFormData()
      resetCreateForm(formData)
      successToast(SUCCESS_MESSAGES.usuarios.CREATED)
    } else {
      errorNotif(`Erro ao criar usuário: ${error}`)
    }
  }

  // Actualizar usuario
  const handleUpdateUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingUsuario) return

    const canEdit = isAdmin || currentUser?.id === editingUsuario.id
    
    if (!canEdit) {
      warning('Você não tem permissão para editar este usuário')
      return
    }

    // Validaciones campos obligatorios
    if (!formData.email?.trim()) {
      errorNotif('Email é obrigatório')
      return
    }

    if (!formData.nome?.trim()) {
      errorNotif('Nome é obrigatório')
      return
    }

    if (!formData.role) {
      errorNotif('Perfil (role) é obrigatório')
      return
    }

    // Validación formato email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(formData.email.trim())) {
      errorNotif('Email inválido')
      return
    }

    // Validación email duplicado (verificar solo si cambió)
    if (formData.email?.toLowerCase() !== editingUsuario.email?.toLowerCase()) {
      const emailExistente = usuarios.find(
        u => u.id !== editingUsuario.id && 
             u.email?.toLowerCase() === formData.email?.toLowerCase()
      )
      if (emailExistente) {
        errorNotif(`Email já cadastrado para o usuário: ${emailExistente.nome}`)
        return
      }
    }

    // Validación numero_documento duplicado (solo si cambió y no está vacío)
    if (formData.numero_documento?.trim() && 
        formData.numero_documento?.toUpperCase() !== editingUsuario.numero_documento?.toUpperCase()) {
      const documentoExistente = usuarios.find(
        u => u.id !== editingUsuario.id && 
             u.numero_documento?.toUpperCase() === formData.numero_documento?.toUpperCase()
      )
      if (documentoExistente) {
        errorNotif(`Número do documento já cadastrado para o usuário: ${documentoExistente.nome}`)
        return
      }
    }

    setIsUpdating(true)
    
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
      cidade: formData.cidade,
      estado: formData.estado,
      cep: formData.cep,
      pais: formData.pais,
      equipe: formData.equipe,
      educacao: formData.educacao,
      especialidades: formData.especialidades,
      bio: formData.bio
    }

    // Solo admin puede cambiar role, status y posicao
    if (isAdmin) {
      updates.role = formData.role
      updates.ativo = formData.ativo
      updates.posicao = formData.posicao // ✨ MOVIENDO POSICAO AQUÍ
    }

    // Formatear campos antes de enviar
    const formattedUpdates = formatFormData({...updates} as unknown as Record<string, unknown>)

    const { error } = await updateUsuario(editingUsuario.id!, formattedUpdates)
    
    setIsUpdating(false)
    
    if (!error) {
      setEditingUsuario(null)
      resetFormData()
      resetEditForm(formData)
      successToast(SUCCESS_MESSAGES.usuarios.UPDATED)
    } else {
      console.error('❌ Error al actualizar:', error)
      errorNotif(`Erro ao atualizar usuário: ${error}`)
    }
  }

  // Cambiar contraseña
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!changingPassword) return

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      warning('As senhas não coincidem')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      warning('A senha deve ter pelo menos 6 caracteres')
      return
    }

    const { error } = await updatePassword(changingPassword.id!, passwordForm.newPassword)
    
    if (!error) {
      setChangingPassword(null)
      setPasswordForm({ newPassword: '', confirmPassword: '' })
      resetPasswordForm(passwordForm)
      successToast(SUCCESS_MESSAGES.usuarios.PASSWORD_CHANGED)
    } else {
      errorNotif(`Erro ao atualizar senha: ${error}`)
    }
  }

  // Eliminar usuario
  const handleDeleteUsuario = async (usuario: Usuario) => {
    if (!isAdmin) {
      warning('Apenas administradores podem excluir usuários')
      return
    }

    const confirmed = await confirmDialog({
      title: 'Excluir Usuário',
      message: `Tem certeza que deseja excluir o usuário ${usuario.nome}? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    })

    if (!confirmed) return

    const { error } = await deleteUsuario(usuario.id!)
    
    if (!error) {
      successToast(SUCCESS_MESSAGES.usuarios.DELETED)
    } else {
      // Mensaje más específico para el usuario
      const friendlyError = error.includes('404') || error.includes('not found') 
        ? 'Usuário removido com sucesso (já não existia no sistema de autenticação)'
        : `Erro ao excluir usuário: ${error}`
      
      if (error.includes('404') || error.includes('not found')) {
        // Si es un error 404, tratarlo como éxito
        successToast('Usuário removido com sucesso')
      } else {
        errorNotif(friendlyError)
      }
    }
  }

  // Abrir modal para crear
  const handleOpenCreateForm = () => {
    resetFormData()
    setShowCreateForm(true)
  }

  // Abrir modal para editar
  const handleEditUsuario = (usuario: Usuario) => {
    setViewingUsuario(null)
    setEditingUsuario(usuario)
    setFormData({
      titulo: usuario.titulo || '',
      nome: usuario.nome,
      nome_completo: usuario.nome_completo || '',
      email: usuario.email,
      password: '',
      role: usuario.role,
      posicao: usuario.posicao, // Campo obligatorio
      ativo: usuario.ativo,
      foto_perfil_url: usuario.foto_perfil_url || '',
      data_nascimento: usuario.data_nascimento || '',
      tipo_documento: usuario.tipo_documento || '',
      numero_documento: usuario.numero_documento || '',
      whatsapp: usuario.whatsapp || '',
      redes_sociais: usuario.redes_sociais || {},
      endereco: usuario.endereco || '',
      numero: usuario.numero || '',
      cidade: usuario.cidade || '',
      estado: usuario.estado || '',
      cep: usuario.cep || '',
      pais: usuario.pais || 'Brasil',
      equipe: usuario.equipe ?? false,
      educacao: usuario.educacao || [],
      especialidades: usuario.especialidades || [],
      bio: usuario.bio || ''
    })
  }

  // Abrir modal para visualizar
  const handleViewUsuario = useCallback((usuario: Usuario) => {
    setViewingUsuario(usuario)
  }, [])

  // Abrir modal para cambiar contraseña
  const handleChangePassword = useCallback((usuario: Usuario) => {
    setChangingPassword(usuario)
    setPasswordForm({ newPassword: '', confirmPassword: '' })
  }, [])

  // Cerrar modales
  const handleCloseCreateForm = () => {
    hide()
    setShowCreateForm(false)
    resetFormData()
  }

  const handleCloseEditForm = () => {
    hide()
    setEditingUsuario(null)
    resetFormData()
  }

  const handleCloseViewModal = useCallback(() => {
    setViewingUsuario(null)
  }, [])

  const handleClosePasswordModal = useCallback(() => {
    setChangingPassword(null)
    setPasswordForm({ newPassword: '', confirmPassword: '' })
  }, [])

  // Upload de foto
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, usuarioId?: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPhoto(true)
    setUploadProgress(0)

    try {
      const targetId = usuarioId || editingUsuario?.id || `temp-${Date.now()}`
      
      // ✅ SSoT: Usa StorageService en lugar de queries directas
      const newPhotoUrl = await StorageService.uploadProfilePhoto(
        targetId,
        file,
        formData.foto_perfil_url // Elimina foto anterior automáticamente
      )

      if (!newPhotoUrl) {
        throw new Error('No se pudo obtener URL de la foto')
      }

      setFormData(prev => ({
        ...prev,
        foto_perfil_url: newPhotoUrl
      }))

      setUploadProgress(100)
      successToast(SUCCESS_MESSAGES.usuarios.PHOTO_UPLOADED)
      
      e.target.value = ''
    } catch (error: unknown) {
      console.error('Erro ao fazer upload:', error)
      const errorMsg = error instanceof Error ? error.message : ERROR_MESSAGES.usuarios.PHOTO_UPLOAD_ERROR;
      errorNotif(errorMsg)
    } finally {
      setUploadingPhoto(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  // Eliminar foto
  const handleDeletePhoto = async () => {
    const confirmed = await confirmDialog({
      title: 'Remover Foto',
      message: 'Deseja realmente remover a foto de perfil?',
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      type: 'warning'
    })

    if (!confirmed) return

    try {
      if (formData.foto_perfil_url) {
        // ✅ SSoT: Usa StorageService en lugar de acceso directo
        const deleted = await StorageService.deleteProfilePhoto(formData.foto_perfil_url)
        
        if (!deleted) {
          throw new Error('Erro ao remover foto')
        }

        setFormData({...formData, foto_perfil_url: ''})
        successToast(SUCCESS_MESSAGES.DELETED)
      }
    } catch (error) {
      console.error('Erro ao remover foto:', error)
      errorNotif(ERROR_MESSAGES.usuarios.PHOTO_REMOVE_ERROR)
    }
  }

  return {
    // Estados
    usuarios,
    loading,
    showCreateForm,
    editingUsuario,
    viewingUsuario,
    changingPassword,
    showPassword,
    setShowPassword,
    uploadingPhoto,
    uploadProgress,
    isUpdating,
    formData,
    setFormData,  // Export directo del setter para casos especiales (arrays, booleans)
    handleFormChange,
    handleFieldChange, // Nuevo handler para formateo en tiempo real
    passwordForm,
    setPasswordForm,  // Export directo del setter para formulario de contraseña
    handlePasswordFormChange,
    
    // Unsaved changes detection
    hasCreateFormChanges,
    hasEditFormChanges,
    hasPasswordFormChanges,
    
    // Handlers
    handleCreateUsuario,
    handleUpdateUsuario,
    handleUpdatePassword,
    handleDeleteUsuario,
    handleOpenCreateForm,
    handleEditUsuario,
    handleViewUsuario,
    handleChangePassword,
    handleCloseCreateForm,
    handleCloseEditForm,
    handleCloseViewModal,
    handleClosePasswordModal,
    handlePhotoUpload,
    handleDeletePhoto,
    
    // Permisos
    isAdmin,
    currentUser,
    
    // Notificaciones
    notification,
    errorNotif,
    success,
    warning,
    hide
  }
}
