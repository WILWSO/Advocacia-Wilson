/**
 * Hook para gestión de filtros de Posts
 * Separa la lógica de filtrado y estadísticas del componente
 */

import { useState, useMemo } from 'react'
import { Post, PostStats, PostType } from '../types/post'

export const usePostFilters = (posts: Post[]) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | PostType>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')

  // Posts filtrados
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Filtro de búsqueda
      const matchesSearch = post.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.conteudo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      // Filtro por tipo
      const matchesType = filterType === 'all' || post.tipo === filterType

      // Filtro por status
      const matchesStatus = filterStatus === 'all' ||
                           (filterStatus === 'published' && post.publicado) ||
                           (filterStatus === 'draft' && !post.publicado)

      return matchesSearch && matchesType && matchesStatus
    })
  }, [posts, searchTerm, filterType, filterStatus])

  // Estadísticas
  const stats: PostStats = useMemo(() => {
    return {
      total: posts.length,
      publicados: posts.filter(p => p.publicado).length,
      rascunhos: posts.filter(p => !p.publicado).length,
      destacados: posts.filter(p => p.destaque).length
    }
  }, [posts])

  return {
    // Estado de filtros
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,

    // Resultados
    filteredPosts,
    stats
  }
}
