import { useState, useCallback, useEffect } from 'react'
import { Post } from '../../types/post'
import { PostsService } from '../../services/postsService'
import { ERROR_MESSAGES } from '../../config/messages'

/**
 * Hook para gerenciar posts sociais
 * @returns Objeto contendo lista de posts, loading, error e métodos CRUD
 */
export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async (publicadosOnly = false) => {
    setLoading(true)
    setError(null)

    try {
      // ✅ SSoT: Usa PostsService en lugar de queries directas
      const data = publicadosOnly 
        ? await PostsService.getPublishedPosts()
        : await PostsService.getAllPosts();

      setPosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.posts.LOAD_ERROR)
    } finally {
      setLoading(false)
    }
  }, [])

  const createPost = useCallback(async (post: Omit<Post, 'id' | 'data_criacao' | 'data_atualizacao'>) => {
    setError(null)
    
    try {
      // ✅ SSoT: Usa PostsService
      const data = await PostsService.createPost(post);

      await fetchPosts()
      return { data, error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.posts.CREATE_ERROR
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }, [fetchPosts])

  const updatePost = useCallback(async (id: string, updates: Partial<Post>) => {
    setError(null)
    
    try {
      // ✅ SSoT: Usa PostsService
      const data = await PostsService.updatePost(id, updates);

      await fetchPosts()
      return { data, error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.posts.UPDATE_ERROR
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }, [fetchPosts])

  const deletePost = useCallback(async (id: string) => {
    setError(null)
    
    try {
      // ✅ SSoT: Usa PostsService
      await PostsService.deletePost(id);

      await fetchPosts()
      return { error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.posts.DELETE_ERROR
      setError(errorMsg)
      return { error: errorMsg }
    }
  }, [fetchPosts])

  const togglePublished = useCallback(async (id: string, publicado: boolean) => {
    return await updatePost(id, { publicado })
  }, [updatePost])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    togglePublished
  }
}
