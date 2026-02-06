import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { ProcessoJuridico } from '../../types/processo'
import { DB_TABLES } from '../../config/database'
import { ERROR_MESSAGES } from '../../config/messages'

interface UseProcessosOptions {
  enablePolling?: boolean;
  pollingInterval?: number;
  autoFetch?: boolean;
}

/**
 * Hook para gerenciar processos jurídicos
 * @returns Objeto contendo lista de processos, loading, error e métodos CRUD
 */
export const useProcessos = (options?: UseProcessosOptions) => {
  const [processos, setProcessos] = useState<ProcessoJuridico[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProcessos = useCallback(async (filters?: {
    status?: string
    advogado?: string
    limite?: number
    silent?: boolean // Para polling sin mostrar loading
  }) => {
    // No mostrar loading si es una actualización silenciosa (polling)
    if (!filters?.silent) {
      setLoading(true)
    }
    setError(null)

    try {
      let query = supabase
        .from(DB_TABLES.PROCESSOS)
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
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.processos.LOAD_ERROR)
    } finally {
      if (!filters?.silent) {
        setLoading(false)
      }
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

      const { error: supabaseError } = await supabase
        .from(DB_TABLES.PROCESSOS)
        .insert([processo])

      if (supabaseError) {
        console.error('Erro Supabase ao criar processo:', supabaseError)
        throw new Error(`${ERROR_MESSAGES.processos.CREATE_ERROR}: ${supabaseError.message}`)
      }

      await fetchProcessos() // Recarregar lista
      return { data: null, error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.processos.CREATE_ERROR
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

      const { error: supabaseError } = await supabase
        .from(DB_TABLES.PROCESSOS)
        .update(updates)
        .eq('id', id)

      if (supabaseError) {
        console.error('Erro Supabase ao atualizar processo:', supabaseError)
        throw new Error(`${ERROR_MESSAGES.processos.UPDATE_ERROR}: ${supabaseError.message}`)
      }

      await fetchProcessos() // Recarregar lista
      return { data: null, error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.processos.UPDATE_ERROR
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }, [fetchProcessos])

  const deleteProcesso = useCallback(async (id: string) => {
    setError(null)
    
    try {
      const { error: supabaseError } = await supabase
        .from(DB_TABLES.PROCESSOS)
        .delete()
        .eq('id', id)

      if (supabaseError) throw supabaseError

      await fetchProcessos() // Recarregar lista
      return { error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.processos.DELETE_ERROR
      setError(errorMsg)
      return { error: errorMsg }
    }
  }, [fetchProcessos])

  // Auto-fetch inicial (si está habilitado)
  // SIEMPRE ejecutar useEffect, solo condicionar la lógica interna
  useEffect(() => {
    if (options?.autoFetch !== false) {
      fetchProcessos();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Polling periódico
  // SIEMPRE ejecutar useEffect, solo condicionar la lógica interna
  useEffect(() => {
    if (!options?.enablePolling) {
      return; // No hacer nada pero el hook se ejecuta
    }

    const interval = options.pollingInterval || 30000;

    const pollingId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        // Llamar fetchProcessos en modo silencioso (sin loading)
        fetchProcessos({ silent: true });
      }
    }, interval);

    return () => clearInterval(pollingId);
  }, [options?.enablePolling, options?.pollingInterval, fetchProcessos]);

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
