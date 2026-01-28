import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Usuario } from '../../types/usuario'

/**
 * Hook para gerenciar usuários do sistema
 * @returns Objeto contendo lista de usuários, loading, error e métodos CRUD
 */
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
