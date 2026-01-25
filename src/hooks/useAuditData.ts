import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface UsuarioInfo {
  nome: string
  email: string
}

interface UseAuditDataReturn {
  criadorInfo: UsuarioInfo | null
  atualizadorInfo: UsuarioInfo | null
  loading: boolean
}

/**
 * Hook personalizado para cargar información de auditoría de usuarios
 * @param creadoPor - ID del usuario que creó el registro
 * @param atualizadoPor - ID del usuario que actualizó el registro
 * @returns Información de los usuarios (creador y actualizador) y estado de carga
 */
export const useAuditData = (
  creadoPor?: string,
  atualizadoPor?: string
): UseAuditDataReturn => {
  const [criadorInfo, setCriadorInfo] = useState<UsuarioInfo | null>(null)
  const [atualizadorInfo, setAtualizadorInfo] = useState<UsuarioInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsuarioInfo = async () => {
      try {
        setLoading(true)
        
        // Buscar información del creador
        if (creadoPor) {
          const { data: criador, error: criadorError } = await supabase
            .from('usuarios')
            .select('nome, email')
            .eq('id', creadoPor)
            .single()
          
          if (criadorError) {
            console.error('Error al cargar creador:', criadorError)
          } else if (criador) {
            setCriadorInfo(criador)
            
            // Si el actualizador es el mismo que el creador, reutilizar la info
            if (atualizadoPor === creadoPor) {
              setAtualizadorInfo(criador)
            }
          }
        }

        // Buscar información del último actualizador (solo si es diferente del creador)
        if (atualizadoPor && atualizadoPor !== creadoPor) {
          const { data: atualizador, error: atualizadorError } = await supabase
            .from('usuarios')
            .select('nome, email')
            .eq('id', atualizadoPor)
            .single()
          
          if (atualizadorError) {
            console.error('Error al cargar actualizador:', atualizadorError)
          } else if (atualizador) {
            setAtualizadorInfo(atualizador)
          }
        }
      } catch (error) {
        console.error('Error al cargar información de auditoría:', error)
      } finally {
        setLoading(false)
      }
    }

    if (creadoPor || atualizadoPor) {
      fetchUsuarioInfo()
    } else {
      setLoading(false)
    }
  }, [creadoPor, atualizadoPor])

  return {
    criadorInfo,
    atualizadorInfo,
    loading
  }
}
