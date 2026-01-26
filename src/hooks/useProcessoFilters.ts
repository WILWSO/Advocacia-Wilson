/**
 * Hook personalizado para filtrado y búsqueda de procesos
 * Gestiona los filtros de status, advogado y búsqueda de texto
 */

import { useState, useMemo } from 'react'
import { ProcessoWithRelations } from '../types/processo'

export function useProcessoFilters(processos: ProcessoWithRelations[]) {
  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [filtroAdvogado, setFiltroAdvogado] = useState<string>('')
  const [busca, setBusca] = useState<string>('')

  // Procesos filtrados - memoizado para optimización
  const processosFiltrados = useMemo(() => {
    return processos.filter(processo => {
      const matchesBusca = busca === '' || 
        processo.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        processo.descricao.toLowerCase().includes(busca.toLowerCase()) ||
        processo.cliente_nome?.toLowerCase().includes(busca.toLowerCase())
      
      const matchesStatus = filtroStatus === '' || processo.status === filtroStatus
      const matchesAdvogado = filtroAdvogado === '' || processo.advogado_responsavel === filtroAdvogado

      return matchesBusca && matchesStatus && matchesAdvogado
    })
  }, [processos, busca, filtroStatus, filtroAdvogado])

  // Estadísticas de procesos
  const stats = useMemo(() => ({
    emAberto: processos.filter(p => p.status === 'em_aberto').length,
    emAndamento: processos.filter(p => p.status === 'em_andamento').length,
    fechados: processos.filter(p => p.status === 'fechado').length,
    total: processos.length
  }), [processos])

  // Resetear filtros
  const resetFilters = () => {
    setFiltroStatus('')
    setFiltroAdvogado('')
    setBusca('')
  }

  return {
    // Estados de filtros
    filtroStatus,
    setFiltroStatus,
    filtroAdvogado,
    setFiltroAdvogado,
    busca,
    setBusca,
    
    // Resultados
    processosFiltrados,
    stats,
    
    // Utilidades
    resetFilters,
    hasActiveFilters: busca !== '' || filtroStatus !== '' || filtroAdvogado !== ''
  }
}
