/**
 * Hook para gestión de formulario de Posts
 * Centraliza toda la lógica de negocio: CRUD, estados, handlers, permisos
 */

import { useAuthLogin } from '../../components/auth/useAuthLogin'
import { usePosts as usePostsSociais } from '../data-access/usePosts'
import { useNotification } from '../../components/shared/notifications/useNotification'
import { useModalState } from '../ui/useModalState'
import { Post } from '../../types/post'
import { CONFIRMATION_MESSAGES, SUCCESS_MESSAGES, ERROR_MESSAGES, AUTH_MESSAGES } from '../../config/messages'
import { formatFormData } from '../../utils/fieldFormatters'

export const usePostForm = () => {
  const { user, isAuthenticated } = useAuthLogin()
  const { posts, loading, error, createPost, updatePost, deletePost, togglePublished } = usePostsSociais()
  const { success, error: errorNotif, confirm: confirmDialog } = useNotification()

  // Modal con useModalState
  const formModal = useModalState<Post>()

  // Crear post
  const handleCreatePost = async (postData: Partial<Post>) => {
    if (!user) {
      errorNotif(AUTH_MESSAGES.LOGIN_REQUIRED)
      return
    }

    const newPostData = {
      ...postData,
      autor: user.id,
      likes: 0,
      comentarios: 0
    } as Omit<Post, 'id' | 'data_criacao' | 'data_atualizacao'>

    // Formatear campos antes de enviar
    const formattedData = formatFormData(newPostData)

    const result = await createPost(formattedData)
    if (!result.error) {
      success(SUCCESS_MESSAGES.posts.CREATED)
      handleCloseModal()
    } else {
      errorNotif(ERROR_MESSAGES.SAVE_ERROR)
    }
  }

  // Actualizar post
  const handleUpdatePost = async (updatedPost: Partial<Post>) => {
    if (!formModal.item?.id) return

    // Formatear campos antes de enviar
    const formattedData = formatFormData(updatedPost)

    const result = await updatePost(formModal.item.id, formattedData)
    if (!result.error) {
      success(SUCCESS_MESSAGES.posts.UPDATED)
      handleCloseModal()
    } else {
      errorNotif(ERROR_MESSAGES.SAVE_ERROR)
    }
  }

  // Deletar post
  const handleDeletePost = async (id: string) => {
    const confirmed = await confirmDialog({
      title: CONFIRMATION_MESSAGES.posts.DELETE_TITLE,
      message: CONFIRMATION_MESSAGES.posts.DELETE,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    })

    if (!confirmed) return

    const result = await deletePost(id)
    if (!result.error) {
      success(SUCCESS_MESSAGES.posts.DELETED)
    } else {
      errorNotif(ERROR_MESSAGES.DELETE_ERROR)
    }
  }

  // Toggle publicado/rascunho
  const handleTogglePublished = async (id: string) => {
    const post = posts.find(p => p.id === id)
    if (!post) return

    const result = await togglePublished(id, !post.publicado)
    if (!result.error) {
      success(post.publicado ? SUCCESS_MESSAGES.posts.UNPUBLISHED : SUCCESS_MESSAGES.posts.PUBLISHED)
    } else {
      errorNotif(ERROR_MESSAGES.SAVE_ERROR)
    }
  }

  // Abrir modal para editar
  const handleEditPost = (post: Post) => {
    formModal.openEdit(post)
  }

  // Abrir modal para criar
  const handleOpenCreateModal = () => {
    formModal.openCreate()
  }

  // Fechar modal
  const handleCloseModal = () => {
    formModal.close()
  }

  return {
    // Estados
    posts,
    loading,
    error,
    isCreateModalOpen: formModal.isOpen,
    editingPost: formModal.item,
    user,
    isAuthenticated,

    // Handlers
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    handleTogglePublished,
    handleEditPost,
    handleOpenCreateModal,
    handleCloseModal
  }
}
