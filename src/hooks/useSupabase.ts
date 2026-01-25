import { useState, useEffect, useCallback } from 'react'
import { supabase, ProcessoJuridico, ComentarioProcesso, Usuario, PostSocial } from '../lib/supabase'

// Hook para autenticação
export const useAuth = () => {
  const [user, setUser] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Función para obtener datos completos del usuario
    const fetchUserWithRole = async (authUser: { id: string; email?: string }) => {
      if (!authUser) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        // Obtener datos del usuario desde la tabla usuarios
        const { data: userData, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (error) {
          console.error('Error fetching user data:', error)
          setUser(authUser)
        } else {
          // Combinar datos de auth con datos de la tabla
          setUser({ ...authUser, ...userData })
        }
      } catch (err) {
        console.error('Error:', err)
        setUser(authUser)
      }
      
      setLoading(false)
    }

    // Verificar usuário atual
    supabase.auth.getUser().then(({ data: { user } }) => {
      fetchUserWithRole(user)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        fetchUserWithRole(session?.user ?? null)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword
  }
}

// Hook para gerenciar processos jurídicos
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
        cliente_nome: processo.clientes?.nome_completo || null
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

// Hook para gerenciar comentários
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
      setError(err instanceof Error ? err.message : 'Erro ao carregar comentários')
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
      const errorMsg = err instanceof Error ? err.message : 'Erro ao adicionar comentário'
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

// Hook para gerenciar usuários
export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsuarios = useCallback(async (includeInactive = false) => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('usuarios')
        .select('*')
        .order('nome')

      if (!includeInactive) {
        query = query.eq('ativo', true)
      }

      const { data, error: supabaseError } = await query

      if (supabaseError) throw supabaseError

      setUsuarios(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }, [])

  const createUsuario = useCallback(async (usuario: Omit<Usuario, 'id'> & { password: string }) => {
    setError(null)
    
    try {
      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: usuario.email,
        password: usuario.password,
        email_confirm: true
      })

      if (authError) throw authError

      // Crear registro en tabla usuarios
      const { data, error: supabaseError } = await supabase
        .from('usuarios')
        .insert([{
          id: authData.user.id,
          email: usuario.email,
          nome: usuario.nome,
          role: usuario.role,
          ativo: usuario.ativo
        }])
        .select()

      if (supabaseError) {
        // Si falla la inserción en BD, eliminar el usuario de Auth
        await supabase.auth.admin.deleteUser(authData.user.id)
        throw supabaseError
      }

      await fetchUsuarios()
      return { data: data?.[0], error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao criar usuário'
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }, [fetchUsuarios])

  const updateUsuario = useCallback(async (id: string, updates: Partial<Usuario>) => {
    setError(null)
    
    try {
      const { data, error: supabaseError } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', id)
        .select()

      if (supabaseError) throw supabaseError

      await fetchUsuarios()
      return { data: data?.[0], error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar usuário'
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }, [fetchUsuarios])

  const updatePassword = useCallback(async (userId: string, newPassword: string) => {
    setError(null)
    
    try {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        { password: newPassword }
      )

      if (authError) throw authError

      return { error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar senha'
      setError(errorMsg)
      return { error: errorMsg }
    }
  }, [])

  const deleteUsuario = useCallback(async (id: string) => {
    setError(null)
    
    try {
      // Eliminar de tabla usuarios
      const { error: dbError } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      // Eliminar de Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id)

      if (authError) throw authError

      await fetchUsuarios()
      return { error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao excluir usuário'
      setError(errorMsg)
      return { error: errorMsg }
    }
  }, [fetchUsuarios])

  useEffect(() => {
    fetchUsuarios()
  }, [fetchUsuarios])

  return {
    usuarios,
    loading,
    error,
    fetchUsuarios,
    createUsuario,
    updateUsuario,
    updatePassword,
    deleteUsuario
  }
}