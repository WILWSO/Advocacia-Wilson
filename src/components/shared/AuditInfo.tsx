import { Clock, User } from 'lucide-react'
import { useAuditData } from '../../hooks/useAuditData'
import { formatDate } from '../../utils/postUtils'

interface AuditInfoProps {
  creadoPor?: string
  atualizadoPor?: string
  dataCriacao?: string
  dataAtualizacao?: string
  className?: string
}

export const AuditInfo = ({ 
  creadoPor, 
  atualizadoPor, 
  dataCriacao, 
  dataAtualizacao,
  className = ''
}: AuditInfoProps) => {
  const { criadorInfo, atualizadorInfo, loading } = useAuditData(creadoPor, atualizadoPor)

  // Si no hay información de auditoría, no mostrar nada
  if (!creadoPor && !atualizadoPor && !dataCriacao && !dataAtualizacao) {
    return null
  }

  if (loading) {
    return (
      <div className={`bg-purple-50 border border-purple-200 rounded-lg p-4 ${className}`}>
        <p className="text-sm text-purple-600">Carregando informação de auditoria...</p>
      </div>
    )
  }

  return (
    <div className={`bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3 ${className}`}>
      <h4 className="text-sm font-semibold text-purple-900 uppercase tracking-wide mb-3 flex items-center gap-2">
        <Clock size={18} className="text-purple-600" />
        Informações de Auditoria
      </h4>
      
      <div className="space-y-3">
        {/* Información de creación */}
        {(creadoPor || dataCriacao) && (
          <div className="flex items-start gap-2 text-sm">
            <User size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-gray-700">Criado por:</span>{' '}
              <span className="font-semibold text-gray-900">
                {criadorInfo ? criadorInfo.nome : 'Carregando...'}
              </span>
              {dataCriacao && (
                <div className="text-gray-600 flex items-center gap-1 mt-1">
                  <Clock size={14} />
                  {formatDate(dataCriacao)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Información de actualización (solo si es diferente del creador) */}
        {atualizadoPor && atualizadoPor !== creadoPor && (
          <div className="flex items-start gap-2 text-sm pt-2 border-t border-purple-200">
            <User size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-gray-700">Última atualização por:</span>{' '}
              <span className="font-semibold text-gray-900">
                {atualizadorInfo ? atualizadorInfo.nome : 'Carregando...'}
              </span>
              {dataAtualizacao && (
                <div className="text-gray-600 flex items-center gap-1 mt-1">
                  <Clock size={14} />
                  {formatDate(dataAtualizacao)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Si solo hay fecha de actualización pero es el mismo usuario */}
        {atualizadoPor === creadoPor && dataAtualizacao && dataCriacao !== dataAtualizacao && (
          <div className="flex items-center gap-1.5 text-sm text-gray-700 pt-2 border-t border-purple-200">
            <Clock size={14} className="text-purple-600" />
            Última modificação: <span className="font-medium">{formatDate(dataAtualizacao)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
