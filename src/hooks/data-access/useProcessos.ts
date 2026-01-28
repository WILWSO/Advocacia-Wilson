import { useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { ProcessoJuridico } from '../../types/processo'

/**
 * Hook para gerenciar processos jurídicos
 * @returns Objeto contendo lista de processos, loading, error e métodos CRUD
 */
export const useProcessos = () => {
  const [processos, setProcessos] = useState<ProcessoJuridico[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProcessos = useCallback(async (filters?: {
    status?: string
    advogado?: string
    limite?: number
  }) => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('processos_juridicos')
        .select(`
          *,
          usuarios:advogado_responsavel (
            nome,
            email
          ),
          clientes:cliente_id (
            nome_completo
          )
        `)
        .order('data_criacao', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.advogado) {
        query = query.eq('advogado_responsavel', filters.advogado)
      }

      if (filters?.limite) {
        query = query.limit(filters.limite)
      }

      const { data, error: supabaseError } = await query

      if (supabaseError) {
        console.error('Erro ao buscar processos:', supabaseError)
        throw supabaseError
      }

      // Transformar dados para incluir cliente_nome como string
      const processosTransformados = (data || []).map((processo: ProcessoJuridico & { clientes?: { nome_completo: string } }) => ({
        ...processo,
        cliente_nome: processo.clientes?.nome_completo || undefined
      }))

      setProcessos(processosTransformados)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar processos')
    } finally {
      setLoading(false)
    }
  }, [])

  const createProcesso = useCallback(async (processo: Omit<ProcessoJuridico, 'id'>) => {
    setError(null)
    
    try {
      // Garantir que o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      const { data, error: supabaseError } = await supabase
        .from('processos_juridicos')
        .insert([processo])
        .select()

      if (supabaseError) {
        console.error('Erro Supabase ao criar processo:', supabaseError)
        throw new Error(`Erro ao criar processo: ${supabaseError.message}`)
      }

      if (data && data.length > 0) {
        await fetchProcessos() // Recarregar lista
        return { data: data[0], error: null }
      }
      
      return { data: null, error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao criar processo'
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }, [fetchProcessos])

  const updateProcesso = useCallback(async (id: string, updates: Partial<ProcessoJuridico>) => {
    setError(null)
    
    try {
      // Garantir que o usuário está autenticado
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      const { data, error: supabaseError } = await supabase
        .from('processos_juridicos')
        .update(updates)
        .eq('id', id)
        .select()

      if (supabaseError) {
        console.error('Erro Supabase ao atualizar processo:', supabaseError)
        throw new Error(`Erro ao atualizar processo: ${supabaseError.message}`)
      }

      await fetchProcessos() // Recarregar lista
      return { data, error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar processo'
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }, [fetchProcessos])

  const deleteProcesso = useCallback(async (id: string) => {
    setError(null)
    
    try {
      const { error: supabaseError } = await supabase
        .from('processos_juridicos')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError

      await fetchProcessos() // Recarregar lista
      return { error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao excluir processo'
      setError(errorMsg)
      return { error: errorMsg }
    }
  }, [fetchProcessos])

  return {
    processos,
    loading,
    error,
    fetchProcessos,
    createProcesso,
    updateProcesso,
    deleteProcesso
  }
}
