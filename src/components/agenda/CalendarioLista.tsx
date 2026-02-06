/**
 * Componente de vista de lista del calendario
 * Muestra las audiencias en formato lista ordenadas por fecha
 */

import React from 'react';
import { AudienciaWithProcesso } from '../../types/audiencia';
import { getIcon } from '../../config/icons';
import { AGENDA_UI } from '../../config/messages';
import { AGENDA_CLASSES } from '../../config/theme';
import { getFormaIcon as getAudienciaFormaIcon } from '../../utils/audienciaHelpers';
import { formatDateRelative } from '../../utils/dateUtils';

interface CalendarioListaProps {
  audiencias: AudienciaWithProcesso[];
  onAudienciaClick: (audiencia: AudienciaWithProcesso) => void;
  onEditClick: (audiencia: AudienciaWithProcesso) => void;
  onDeleteClick: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export const CalendarioLista: React.FC<CalendarioListaProps> = ({
  audiencias,
  onAudienciaClick,
  onEditClick,
  onDeleteClick,
  canEdit,
  canDelete,
}) => {
  // Agrupar audiencias por fecha
  const audienciasPorFecha = audiencias.reduce((acc, audiencia) => {
    const fecha = audiencia.fecha;
    if (!acc[fecha]) {
      acc[fecha] = [];
    }
    acc[fecha].push(audiencia);
    return acc;
  }, {} as Record<string, AudienciaWithProcesso[]>);

  // Ordenar fechas
  const fechasOrdenadas = Object.keys(audienciasPorFecha).sort();

  if (audiencias.length === 0) {
    return (
      <div className={`${AGENDA_CLASSES.card} p-12 text-center`}>
        <div className={AGENDA_CLASSES.emptyState}>
          {getIcon('calendar', 56, 'text-gray-400')}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {AGENDA_UI.EMPTY_STATE.NO_HEARINGS_TITLE}
            </h3>
            <p className="text-base text-gray-600">
              {AGENDA_UI.EMPTY_STATE.NO_HEARINGS_MESSAGE}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {fechasOrdenadas.map((fecha) => (
        <div key={fecha}>
          {/* Encabezado de fecha */}
          <h3 className="text-xl font-bold text-gray-900 mb-4 capitalize">
            {formatDateRelative(fecha)}
          </h3>

          {/* Lista de audiencias del día */}
          <div className="space-y-2">
            {audienciasPorFecha[fecha].map((audiencia) => (
              <div
                key={audiencia.id}
                className={`${AGENDA_CLASSES.card} p-4 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Contenido principal */}
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => onAudienciaClick(audiencia)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {/* Hora */}
                      <div className="flex items-center gap-2">
                        {getIcon('clock', 20, 'text-gray-500')}
                        <span className="text-base font-semibold text-gray-900">
                          {audiencia.hora.substring(0, 5)}
                        </span>
                      </div>

                      {/* Forma */}
                      <div className="flex items-center gap-1">
                        {getAudienciaFormaIcon(audiencia.forma, 20)}
                        <span className="text-sm text-gray-600 capitalize">
                          {audiencia.forma}
                        </span>
                      </div>
                    </div>

                    {/* Tipo */}
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {audiencia.tipo}
                    </h4>

                    {/* Proceso */}
                    {audiencia.proceso && (
                      <p className="text-base text-gray-600 mb-1">
                        {getIcon('gavel', 18, 'text-gray-400 inline mr-1')}
                        {AGENDA_UI.LABELS.PROCESS}: {audiencia.proceso.numero_processo || 'S/N'} -{' '}
                        {audiencia.proceso.titulo}
                      </p>
                    )}

                    {/* Local */}
                    {audiencia.local && (
                      <p className="text-base text-gray-600">
                        {getIcon('mapPin', 18, 'text-gray-400 inline mr-1')}
                        {audiencia.local}
                      </p>
                    )}

                    {/* Link virtual */}
                    {audiencia.link_meet && (
                      <a
                        href={audiencia.link_meet}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base text-primary-600 hover:text-primary-700 inline-flex items-center gap-1 mt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {getIcon('video', 18)}
                        {AGENDA_UI.LABELS.MEETING_LINK}
                      </a>
                    )}

                    {/* Observaciones */}
                    {audiencia.observaciones && (
                      <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          {getIcon('info', 16, 'text-gray-500 inline mr-1')}
                          {AGENDA_UI.LABELS.OBSERVATIONS}:
                        </p>
                        <p className="text-base text-gray-600 whitespace-pre-wrap">
                          {audiencia.observaciones}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <button
                        onClick={() => onEditClick(audiencia)}
                        className={AGENDA_CLASSES.editButton}
                        title={AGENDA_UI.LABELS.EDIT}
                      >
                        {getIcon('edit', 18)}
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => onDeleteClick(audiencia.id)}
                        className={AGENDA_CLASSES.deleteButton}
                        title={AGENDA_UI.LABELS.DELETE}
                      >
                        {getIcon('delete', 18)}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
