/**
 * Hook para gestión de formulario de Posts
 * Centraliza toda la lógica de negocio: CRUD, estados, handlers, permisos
 */

import { useState } from 'react'
import { useAuthLogin } from '../../components/auth/useAuthLogin'
import { usePosts as usePostsSociais } from '../data-access/usePosts'
import { useNotification } from '../../components/shared/notifications/NotificationContext'
import { Post } from '../../types/post'

export const usePostForm = () => {
  const { user, isAuthenticated } = useAuthLogin()
  const { posts, loading, error, createPost, updatePost, deletePost, togglePublished } = usePostsSociais()
  const { success, error: errorNotif, confirm: confirmDialog } = useNotification()

  // Estados
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)

  // Crear post
  const handleCreatePost = async (postData: Partial<Post>) => {
    if (!user) {
      errorNotif('Você precisa estar autenticado para criar conteúdo')
      return
    }

    const newPostData = {
      ...postData,
      autor: user.id,
      likes: 0,
      comentarios: 0
    } as Omit<Post, 'id' | 'data_criacao' | 'data_atualizacao'>

    const result = await createPost(newPostData)
    if (!result.error) {
      success('Conteúdo criado com sucesso!')
      handleCloseModal()
    } else {
      errorNotif('Erro ao criar conteúdo. Tente novamente.')
    }
  }

  // Actualizar post
  const handleUpdatePost = async (updatedPost: Partial<Post>) => {
    if (!editingPost?.id) return

    const result = await updatePost(editingPost.id, updatedPost)
    if (!result.error) {
      success('Conteúdo atualizado com sucesso!')
      handleCloseModal()
    } else {
      errorNotif('Erro ao atualizar conteúdo. Tente novamente.')
    }
  }

  // Deletar post
  const handleDeletePost = async (id: string) => {
    const confirmed = await confirmDialog({
      title: 'Excluir Conteúdo',
      message: 'Tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    })

    if (!confirmed) return

    const result = await deletePost(id)
    if (!result.error) {
      success('Conteúdo excluído com sucesso!')
    } else {
      errorNotif('Erro ao excluir conteúdo. Tente novamente.')
    }
  }

  // Toggle publicado/rascunho
  const handleTogglePublished = async (id: string) => {
    const post = posts.find(p => p.id === id)
    if (!post) return

    const result = await togglePublished(id, !post.publicado)
    if (!result.error) {
      success(post.publicado ? 'Conteúdo despublicado!' : 'Conteúdo publicado!')
    } else {
      errorNotif('Erro ao alterar status de publicação.')
    }
  }

  // Abrir modal para editar
  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setIsCreateModalOpen(true)
  }

  // Abrir modal para criar
  const handleOpenCreateModal = () => {
    setEditingPost(null)
    setIsCreateModalOpen(true)
  }

  // Fechar modal
  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setEditingPost(null)
  }

  return {
    // Estados
    posts,
    loading,
    error,
    isCreateModalOpen,
    editingPost,
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
