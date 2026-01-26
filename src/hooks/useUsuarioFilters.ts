/**
 * Hook para filtros y búsqueda de Usuarios
 * Centraliza la lógica de filtrado y estadísticas
 */

import { useState, useMemo } from 'react'
import { Usuario, UsuarioStats } from '../types/usuario'

export const useUsuarioFilters = (usuarios: Usuario[]) => {
  const [busca, setBusca] = useState('')
  const [filtroRole, setFiltroRole] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('ativo')

  // Filtrar usuarios
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(usuario => {
      const matchBusca = 
        usuario.nome.toLowerCase().includes(busca.toLowerCase()) ||
        usuario.email.toLowerCase().includes(busca.toLowerCase())
      
      const matchRole = filtroRole === '' || usuario.role === filtroRole
      
      const matchStatus = filtroStatus === '' || 
        (filtroStatus === 'ativo' && usuario.ativo) ||
        (filtroStatus === 'inativo' && !usuario.ativo)
      
      return matchBusca && matchRole && matchStatus
    })
  }, [usuarios, busca, filtroRole, filtroStatus])

  // Estadísticas
  const stats: UsuarioStats = useMemo(() => ({
    total: usuarios.length,
    ativos: usuarios.filter(u => u.ativo).length,
    admins: usuarios.filter(u => u.role === 'admin').length,
    advogados: usuarios.filter(u => u.role === 'advogado').length,
    assistentes: usuarios.filter(u => u.role === 'assistente').length
  }), [usuarios])

  return {
    // Estados
    busca,
    setBusca,
    filtroRole,
    setFiltroRole,
    filtroStatus,
    setFiltroStatus,
    
    // Computados
    usuariosFiltrados,
    stats
  }
}
