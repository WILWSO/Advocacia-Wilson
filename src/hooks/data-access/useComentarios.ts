import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { ComentarioProcesso } from '../../types/processo'
import { ERROR_MESSAGES } from '../../config/messages'

/**
 * Hook para gerenciar comentários de processos
 * @param processoId - ID do processo para buscar comentários
 * @returns Objeto contendo lista de comentários, loading, error e métodos
 */
export const useComentarios = (processoId: string) => {
  const [comentarios, setComentarios] = useState<ComentarioProcesso[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchComentarios = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from('comentarios_processos')
        .select(`
          *,
          usuarios:autor (
            nome,
            email
          )
        `)
        .eq('processo_id', processoId)
        .order('data_criacao', { ascending: true })

      if (supabaseError) throw supabaseError

      setComentarios(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.comentarios.LOAD_ERROR)
    } finally {
      setLoading(false)
    }
  }

  const addComentario = async (comentario: string, autor: string) => {
    setError(null)
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('comentarios_processos')
        .insert([{
          processo_id: processoId,
          comentario,
          autor
        }])
        .select()

      if (supabaseError) throw supabaseError

      await fetchComentarios() // Recarregar comentários
      return { data, error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.comentarios.ADD_ERROR
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }

  useEffect(() => {
    if (processoId) {
      fetchComentarios()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processoId])

  return {
    comentarios,
    loading,
    error,
    fetchComentarios,
    addComentario
  }
}
