import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Cliente } from '../../types/cliente'

/**
 * Hook para gerenciar clientes
 * @returns Objeto contendo lista de clientes, loading, error e métodos CRUD
 */
export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClientes = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from('clientes')
        .select('*')
        .order('data_criacao', { ascending: false })

      if (supabaseError) throw supabaseError

      setClientes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }, [])

  const createCliente = useCallback(async (cliente: Omit<Cliente, 'id' | 'data_criacao' | 'data_atualizacao'>) => {
    setError(null)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      const { data, error: supabaseError } = await supabase
        .from('clientes')
        .insert([cliente])
        .select()

      if (supabaseError) {
        console.error('Erro Supabase ao criar cliente:', supabaseError)
        throw new Error(`Erro ao criar cliente: ${supabaseError.message}`)
      }

      await fetchClientes()
      return { data: data?.[0], error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao criar cliente'
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }, [fetchClientes])

  const updateCliente = useCallback(async (id: string, updates: Partial<Cliente>) => {
    setError(null)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      const { data, error: supabaseError } = await supabase
        .from('clientes')
        .update(updates)
        .eq('id', id)
        .select()

      if (supabaseError) {
        console.error('Erro Supabase ao atualizar cliente:', supabaseError)
        throw new Error(`Erro ao atualizar cliente: ${supabaseError.message}`)
      }

      await fetchClientes()
      return { data: data?.[0], error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar cliente'
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }, [fetchClientes])

  const deleteCliente = useCallback(async (id: string) => {
    setError(null)
    
    try {
      const { error: supabaseError } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError

      await fetchClientes()
      return { error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao excluir cliente'
      setError(errorMsg)
      return { error: errorMsg }
    }
  }, [fetchClientes])

  useEffect(() => {
    fetchClientes()
  }, [fetchClientes])

  return {
    clientes,
    loading,
    error,
    fetchClientes,
    createCliente,
    updateCliente,
    deleteCliente
  }
}
