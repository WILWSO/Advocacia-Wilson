import { useState, useEffect } from 'react'
import { supabase, ProcessoJuridico, ComentarioProcesso, Usuario, PostSocial } from '../lib/supabase'
import { AuthError, PostgrestError } from '@supabase/supabase-js'

// Hook para autenticação
export const useAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar usuário atual
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
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

  const fetchProcessos = async (filters?: {
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

      if (supabaseError) throw supabaseError

      setProcessos(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar processos')
    } finally {
      setLoading(false)
    }
  }

  const createProcesso = async (processo: Omit<ProcessoJuridico, 'id'>) => {
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
  }

  const updateProcesso = async (id: string, updates: Partial<ProcessoJuridico>) => {
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
  }

  const deleteProcesso = async (id: string) => {
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
  }

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

  const fetchUsuarios = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('ativo', true)
        .order('nome')

      if (supabaseError) throw supabaseError

      setUsuarios(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  return {
    usuarios,
    loading,
    error,
    fetchUsuarios
  }
}

// Hook para Posts Sociais
export const usePostsSociais = () => {
  const [posts, setPosts] = useState<PostSocial[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async (publicadosOnly = false) => {
    try {
      setLoading(true)
      setError(null)
      
      let query = supabase
        .from('posts_sociais')
        .select(`
          *,
          autor:usuarios(nome, email)
        `)
        .order('data_criacao', { ascending: false })

      if (publicadosOnly) {
        query = query.eq('publicado', true)
      }

      const { data, error: supabaseError } = await query

      if (supabaseError) {
        throw supabaseError
      }

      setPosts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar posts')
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (postData: Omit<PostSocial, 'id' | 'data_criacao' | 'data_atualizacao'>) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from('posts_sociais')
        .insert([postData])
        .select()

      if (supabaseError) {
        throw supabaseError
      }

      await fetchPosts()
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar post'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const updatePost = async (id: string, postData: Partial<PostSocial>) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from('posts_sociais')
        .update(postData)
        .eq('id', id)
        .select()

      if (supabaseError) {
        throw supabaseError
      }

      await fetchPosts()
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar post'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const deletePost = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error: supabaseError } = await supabase
        .from('posts_sociais')
        .delete()
        .eq('id', id)

      if (supabaseError) {
        throw supabaseError
      }

      await fetchPosts()
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar post'
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const togglePublished = async (id: string, publicado: boolean) => {
    return await updatePost(id, { publicado })
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    togglePublished
  }
}

// Hook específico para posts públicos (sin autenticación requerida)
export const usePostsPublicos = () => {
  const [posts, setPosts] = useState<PostSocial[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasFetched, setHasFetched] = useState(false)

  const fetchPostsPublicos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Consulta simplificada sin JOIN para evitar problemas de permisos
      const { data, error: supabaseError } = await supabase
        .from('posts_sociais')
        .select('*')
        .eq('publicado', true)
        .order('data_criacao', { ascending: false })

      if (supabaseError) {
        console.error('Error al cargar posts:', supabaseError.message)
        throw supabaseError
      }

      // Transformar autor de UUID a string simple para mostrar
      const postsTransformed = (data || []).map(post => ({
        ...post,
        autor: typeof post.autor === 'string' ? 'Equipe Santos & Nascimento' : post.autor
      }))

      setPosts(postsTransformed)
      setHasFetched(true)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao carregar posts públicos'
      console.error('Error loading public posts:', err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Solo cargar una vez
    if (!hasFetched) {
      fetchPostsPublicos()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    posts,
    loading,
    error,
    fetchPosts: fetchPostsPublicos
  }
}