/**
 * Hook para filtros y búsqueda de Clientes
 * Centraliza la lógica de filtrado y estadísticas
 */

import { useState, useMemo } from 'react'
import { Cliente, ClienteStats } from '../types/cliente'

export const useClienteFilters = (clientes: Cliente[]) => {
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState<string>('todos')

  // Filtrar clientes
  const clientesFiltrados = useMemo(() => {
    return clientes.filter(cliente => {
      const matchBusca = 
        cliente.nome_completo.toLowerCase().includes(busca.toLowerCase()) ||
        cliente.email?.toLowerCase().includes(busca.toLowerCase()) ||
        cliente.cpf_cnpj?.includes(busca) ||
        cliente.celular?.includes(busca)

      const matchStatus = filtroStatus === 'todos' || cliente.status === filtroStatus

      return matchBusca && matchStatus
    })
  }, [clientes, busca, filtroStatus])

  // Estadísticas
  const stats: ClienteStats = useMemo(() => ({
    total: clientes.length,
    ativos: clientes.filter(c => c.status === 'ativo').length,
    potenciais: clientes.filter(c => c.status === 'potencial').length,
    inativos: clientes.filter(c => c.status === 'inativo').length
  }), [clientes])

  return {
    // Estados
    busca,
    setBusca,
    filtroStatus,
    setFiltroStatus,
    
    // Computados
    clientesFiltrados,
    stats
  }
}
