import { Clock, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface AuditInfoProps {
  creadoPor?: string
  atualizadoPor?: string
  dataCriacao?: string
  dataAtualizacao?: string
  className?: string
}

interface UsuarioInfo {
  nome: string
  email: string
}

export const AuditInfo = ({ 
  creadoPor, 
  atualizadoPor, 
  dataCriacao, 
  dataAtualizacao,
  className = ''
}: AuditInfoProps) => {
  const [criadorInfo, setCriadorInfo] = useState<UsuarioInfo | null>(null)
  const [atualizadorInfo, setAtualizadorInfo] = useState<UsuarioInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsuarioInfo = async () => {
      try {
        setLoading(true)
        
        // Buscar información del creador
        if (creadoPor) {
          const { data: criador } = await supabase
            .from('usuarios')
            .select('nome, email')
            .eq('id', creadoPor)
            .single()
          
          if (criador) {
            setCriadorInfo(criador)
          }
        }

        // Buscar información del último actualizador
        if (atualizadoPor && atualizadoPor !== creadoPor) {
          const { data: atualizador } = await supabase
            .from('usuarios')
            .select('nome, email')
            .eq('id', atualizadoPor)
            .single()
          
          if (atualizador) {
            setAtualizadorInfo(atualizador)
          }
        } else if (atualizadoPor === creadoPor && criadorInfo) {
          // Si es el mismo usuario, reutilizar la info del creador
          setAtualizadorInfo(criadorInfo)
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
  }, [creadoPor, atualizadoPor, criadorInfo])

  // Si no hay información de auditoría, no mostrar nada
  if (!creadoPor && !atualizadoPor && !dataCriacao && !dataAtualizacao) {
    return null
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    } catch {
      return 'N/A'
    }
  }

  if (loading) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-3 ${className}`}>
        <p className="text-xs text-gray-500">Carregando informação de auditoria...</p>
      </div>
    )
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2 ${className}`}>
      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
        Auditoria
      </h4>
      
      <div className="space-y-1.5">
        {/* Información de creación */}
        {(creadoPor || dataCriacao) && (
          <div className="flex items-start gap-2 text-xs">
            <User size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-gray-600">Criado por:</span>{' '}
              <span className="font-medium text-gray-800">
                {criadorInfo ? criadorInfo.nome : 'Carregando...'}
              </span>
              {dataCriacao && (
                <div className="text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock size={12} />
                  {formatDate(dataCriacao)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Información de actualización (solo si es diferente del creador) */}
        {atualizadoPor && atualizadoPor !== creadoPor && (
          <div className="flex items-start gap-2 text-xs pt-1.5 border-t border-gray-200">
            <User size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-gray-600">Última atualização por:</span>{' '}
              <span className="font-medium text-gray-800">
                {atualizadorInfo ? atualizadorInfo.nome : 'Carregando...'}
              </span>
              {dataAtualizacao && (
                <div className="text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock size={12} />
                  {formatDate(dataAtualizacao)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Si solo hay fecha de actualización pero es el mismo usuario */}
        {atualizadoPor === creadoPor && dataAtualizacao && dataCriacao !== dataAtualizacao && (
          <div className="flex items-center gap-1 text-xs text-gray-500 pt-1">
            <Clock size={12} />
            Última modificação: {formatDate(dataAtualizacao)}
          </div>
        )}
      </div>
    </div>
  )
}
