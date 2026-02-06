import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Usuario } from '../../types/usuario'
import { DB_TABLES } from '../../config/database'
import { ERROR_MESSAGES } from '../../config/messages'

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
        .from(DB_TABLES.USUARIOS)
        .select('*')
        .order('nome')

      if (!includeInactive) {
        query = query.eq('ativo', true)
      }

      const { data, error: supabaseError } = await query

      if (supabaseError) throw supabaseError

      setUsuarios(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : ERROR_MESSAGES.usuarios.LOAD_ERROR)
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

      // Esperar un momento antes del insert manual
      await new Promise(resolve => setTimeout(resolve, 100))

      // Crear registro en tabla usuarios con todos los campos
      const { data, error: supabaseError } = await supabase
        .from(DB_TABLES.USUARIOS)
        .insert([{
          id: authData.user.id,
          email: usuario.email,
          nome: usuario.nome,
          nome_completo: usuario.nome_completo || null,
          role: usuario.role,
          posicao: usuario.posicao, // Campo obligatorio
          ativo: usuario.ativo ?? true,
          titulo: usuario.titulo || null,
          foto_perfil_url: usuario.foto_perfil_url || null,
          data_nascimento: usuario.data_nascimento || null,
          tipo_documento: usuario.tipo_documento || null,
          numero_documento: usuario.numero_documento || null,
          whatsapp: usuario.whatsapp || null,
          redes_sociais: usuario.redes_sociais || null,
          endereco: usuario.endereco || null,
          numero: usuario.numero || null,
          cidade: usuario.cidade || null,
          estado: usuario.estado || null,
          cep: usuario.cep || null,
          pais: usuario.pais || 'Brasil',
          equipe: usuario.equipe ?? false,
          educacao: usuario.educacao || null,
          especialidades: usuario.especialidades || null,
          bio: usuario.bio || null
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
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.usuarios.CREATE_ERROR
      setError(errorMsg)
      return { data: null, error: errorMsg }
    }
  }, [fetchUsuarios])

  const updateUsuario = useCallback(async (id: string, updates: Partial<Usuario>) => {
    setError(null)
    
    try {
      const { data, error: supabaseError } = await supabase
        .from(DB_TABLES.USUARIOS)
        .update(updates)
        .eq('id', id)
        .select()

      if (supabaseError) {
        console.error('❌ Error de Supabase:', supabaseError);
        throw supabaseError;
      }

      await fetchUsuarios()
      return { data: data?.[0], error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.usuarios.UPDATE_ERROR
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
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.usuarios.PASSWORD_UPDATE_ERROR
      setError(errorMsg)
      return { error: errorMsg }
    }
  }, [])

  const deleteUsuario = useCallback(async (id: string) => {
    setError(null)
    
    try {
      // PASO 1: Intentar eliminar de Supabase Auth primero (manejar 404 silenciosamente)
      try {
        await supabase.auth.admin.deleteUser(id)
      } catch (authError: any) {
        // Solo lanzar el error si NO es 404 (usuario no encontrado en Auth)
        if (authError?.status !== 404) {
          throw authError
        }
        // Si es 404, el usuario no existe en Auth pero puede existir en la tabla
        // Continuar con la eliminación de la tabla usuarios
        console.warn(`🔄 Usuario ${id} no encontrado en Supabase Auth (404) - eliminando solo de la tabla usuarios. Esto es normal si el usuario fue eliminado previamente del sistema de autenticación.`)
      }

      // PASO 2: Eliminar de tabla usuarios
      const { error: dbError } = await supabase
        .from(DB_TABLES.USUARIOS)
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      await fetchUsuarios()
      return { error: null }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.usuarios.DELETE_ERROR
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
