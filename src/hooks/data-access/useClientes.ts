import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Cliente } from '../../types/cliente'
import { DB_TABLES } from '../../config/database'
import { ERROR_MESSAGES } from '../../config/messages'

interface UseClientesOptions {
  enablePolling?: boolean;
  pollingInterval?: number;
}

/**
 * Hook para gerenciar clientes
 * @returns Objeto contendo lista de clientes, loading, error e métodos CRUD
 */
export const useClientes = (options?: UseClientesOptions) => {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClientes = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true)
    }
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from(DB_TABLES.CLIENTES)
        .select('*')
        .order('data_criacao', { ascending: false })

      if (supabaseError) throw supabaseError

      setClientes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.clientes.LOAD_ERROR)
    } finally {
      if (!silent) {
        setLoading(false)
      }
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
        .from(DB_TABLES.CLIENTES)
        .insert([cliente])
        .select()

      if (supabaseError) {
        console.error('Erro Supabase ao criar cliente:', supabaseError)
        throw new Error(`${ERROR_MESSAGES.clientes.CREATE_ERROR}: ${supabaseError.message}`)
      }

      await fetchClientes()
      return { data: data?.[0], error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.clientes.CREATE_ERROR
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
        .from(DB_TABLES.CLIENTES)
        .update(updates)
        .eq('id', id)
        .select()

      if (supabaseError) {
        console.error('Erro Supabase ao atualizar cliente:', supabaseError)
        throw new Error(`${ERROR_MESSAGES.clientes.UPDATE_ERROR}: ${supabaseError.message}`)
      }

      await fetchClientes()
      return { data: data?.[0], error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.clientes.UPDATE_ERROR
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }, [fetchClientes])

  const deleteCliente = useCallback(async (id: string) => {
    setError(null)
    
    try {
      const { error: supabaseError } = await supabase
        .from(DB_TABLES.CLIENTES)
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError

      await fetchClientes()
      return { error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.clientes.DELETE_ERROR
      setError(errorMsg)
      return { error: errorMsg }
    }
  }, [fetchClientes])

  useEffect(() => {
    fetchClientes()
  }, [fetchClientes])

  // Polling periódico
  useEffect(() => {
    if (!options?.enablePolling) return;

    const interval = options.pollingInterval || 30000;

    const pollingId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchClientes(true); // silent = true para evitar parpadeos
      }
    }, interval);

    return () => clearInterval(pollingId);
  }, [options?.enablePolling, options?.pollingInterval, fetchClientes]);

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
