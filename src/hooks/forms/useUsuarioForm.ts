/**
 * Hook para gestión de formulario de Usuarios
 * Centraliza toda la lógica de negocio: CRUD, upload de fotos, cambio de contraseña, estados, handlers, permisos
 */

import { useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuthLogin as useAuth } from '../../components/auth/useAuthLogin'
import { useUsuarios } from '../data-access/useUsuarios'
import { useNotification } from '../../components/shared/notifications/NotificationContext'
import { useInlineNotification } from '../ui/useInlineNotification'
import { Usuario, UsuarioFormData, PasswordForm } from '../../types/usuario'
import { StorageService } from '../../services/storageService'

export const useUsuarioForm = () => {
  const { user: currentUser } = useAuth()
  const { usuarios, loading, createUsuario, updateUsuario, updatePassword, deleteUsuario } = useUsuarios()
  const { notification, error: errorNotif, success, warning, hide } = useInlineNotification()
  const { success: successToast, confirm: confirmDialog } = useNotification()

  // Permisos
  const isAdmin = currentUser?.role === 'admin'

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

  // Form data
  const [formData, setFormData] = useState<UsuarioFormData>({
    titulo: '',
    nome: '',
    nome_completo: '',
    email: '',
    password: '',
    role: 'assistente',
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

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    newPassword: '',
    confirmPassword: ''
  })

  // Reset form data
  const resetFormData = useCallback(() => {
    setFormData({
      titulo: '',
      nome: '',
      nome_completo: '',
      email: '',
      password: '',
      role: 'assistente',
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
  }, [])

  // Crear usuario
  const handleCreateUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAdmin) {
      warning('Apenas administradores podem criar usuários')
      return
    }

    if (!formData.password) {
      errorNotif('Senha é obrigatória para criar usuário')
      return
    }

    const { error } = await createUsuario(formData as UsuarioFormData & { password: string })
    
    if (!error) {
      setShowCreateForm(false)
      resetFormData()
      successToast('Usuário criado com sucesso!')
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
    
    setIsUpdating(false)
    
    if (!error) {
      setEditingUsuario(null)
      resetFormData()
      successToast('Usuário atualizado com sucesso!')
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
      successToast('Senha atualizada com sucesso!')
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
      successToast('Usuário excluído com sucesso!')
    } else {
      errorNotif(`Erro ao excluir usuário: ${error}`)
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
      ativo: usuario.ativo,
      foto_perfil_url: usuario.foto_perfil_url || '',
      data_nascimento: usuario.data_nascimento || '',
      tipo_documento: usuario.tipo_documento || '',
      numero_documento: usuario.numero_documento || '',
      whatsapp: usuario.whatsapp || '',
      redes_sociais: usuario.redes_sociais || {},
      endereco: usuario.endereco || '',
      numero: usuario.numero || '',
      localidade: usuario.localidade || '',
      estado: usuario.estado || '',
      cep: usuario.cep || '',
      pais: usuario.pais || 'Brasil'
    })
  }

  // Abrir modal para visualizar
  const handleViewUsuario = (usuario: Usuario) => {
    setViewingUsuario(usuario)
  }

  // Abrir modal para cambiar contraseña
  const handleChangePassword = (usuario: Usuario) => {
    setChangingPassword(usuario)
    setPasswordForm({ newPassword: '', confirmPassword: '' })
  }

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

  const handleCloseViewModal = () => {
    setViewingUsuario(null)
  }

  const handleClosePasswordModal = () => {
    setChangingPassword(null)
    setPasswordForm({ newPassword: '', confirmPassword: '' })
  }

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
      successToast('Foto enviada com sucesso!')
      
      e.target.value = ''
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error)
      errorNotif(error.message || 'Erro ao enviar foto. Tente novamente.')
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
        const urlParts = formData.foto_perfil_url.split('/foto_perfil/')
        if (urlParts.length > 1) {
          const filePath = urlParts[1]
          
          const { error } = await supabase.storage
            .from('foto_perfil')
            .remove([filePath])

          if (error) throw error
        }

        setFormData({...formData, foto_perfil_url: ''})
        successToast('Foto removida com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao remover foto:', error)
      errorNotif('Erro ao remover foto')
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
    setFormData,
    passwordForm,
    setPasswordForm,
    
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
