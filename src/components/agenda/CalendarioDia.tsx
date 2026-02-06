/**
 * Componente de vista diaria del calendario
 * Muestra las audiencias del día en formato timeline
 */

import React from 'react';
import { AudienciaWithProcesso } from '../../types/audiencia';
import { cn } from '../../utils/cn';
import { getIcon } from '../../config/icons';
import { AGENDA_UI } from '../../config/messages';
import { AGENDA_CLASSES } from '../../config/theme';
import { getFormaColor, getFormaIcon as getAudienciaFormaIcon, getFormaBorderClass } from '../../utils/audienciaHelpers';
import { isToday as checkIsToday } from '../../utils/dateUtils';

interface CalendarioDiaProps {
  currentDate: Date;
  audiencias: AudienciaWithProcesso[];
  onAudienciaClick: (audiencia: AudienciaWithProcesso) => void;
  onEditClick: (audiencia: AudienciaWithProcesso) => void;
  onDeleteClick: (id: string) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export const CalendarioDia: React.FC<CalendarioDiaProps> = ({
  currentDate,
  audiencias,
  onAudienciaClick,
  onEditClick,
  onDeleteClick,
  canEdit,
  canDelete,
}) => {
  // Filtrar audiencias del día
  const dateStr = currentDate.toISOString().split('T')[0];
  const dayAudiencias = audiencias
    .filter(a => a.fecha === dateStr)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  return (
    <div className={AGENDA_CLASSES.card}>
      {/* Header del día */}
      <div className={cn(
        'p-6 border-b border-gray-200',
        checkIsToday(currentDate) ? 'bg-gradient-to-r from-primary-50 to-primary-100' : 'bg-gray-50'
      )}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-600 uppercase">
              {currentDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
            </div>
            <div className="text-3xl font-bold text-gray-900 mt-1">
              {currentDate.getDate()} de {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </div>
            {checkIsToday(currentDate) && (
              <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                {getIcon('calendar', 14)}
                {AGENDA_UI.LABELS.TODAY}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary-600">
              {dayAudiencias.length}
            </div>
            <div className="text-sm text-gray-600">
              {dayAudiencias.length !== 1 ? AGENDA_UI.LABELS.HEARINGS : AGENDA_UI.LABELS.HEARING}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de audiencias */}
      <div className="p-6">
        {dayAudiencias.length === 0 ? (
          <div className={`${AGENDA_CLASSES.emptyState} py-16`}>
            {getIcon('calendar', 64)}
            <p className="text-xl font-semibold mt-4 text-gray-600">
              {AGENDA_UI.EMPTY_STATE.NO_HEARINGS_DAY}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {AGENDA_UI.EMPTY_STATE.NO_HEARINGS_DAY_MESSAGE}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {dayAudiencias.map((audiencia, index) => (
              <div
                key={audiencia.id}
                className="relative"
              >
                {/* Timeline line */}
                {index !== dayAudiencias.length - 1 && (
                  <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-gray-200" />
                )}

                {/* Audiencia card */}
                <div className="flex gap-4">
                  {/* Hora con timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      'flex items-center justify-center w-12 h-12 rounded-full border-4 bg-white z-10',
                      getFormaBorderClass(audiencia.forma)
                    )}>
                      {getIcon('clock', 20, 'text-gray-700')}
                    </div>
                    <div className="text-sm font-bold text-gray-900 mt-2">
                      {audiencia.hora.substring(0, 5)}
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={cn(
                      'flex-1 p-5 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all',
                      getFormaColor(audiencia.forma)
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 cursor-pointer" onClick={() => onAudienciaClick(audiencia)}>
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-3">
                          {getAudienciaFormaIcon(audiencia.forma, 24)}
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {audiencia.tipo}
                            </h3>
                            <span className="text-sm font-medium capitalize opacity-75">
                              {audiencia.forma}
                            </span>
                          </div>
                        </div>

                        {/* Proceso */}
                        {audiencia.proceso && (
                          <div className="mb-3 p-3 bg-white/50 rounded-lg">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                              {getIcon('gavel', 16)}
                              {AGENDA_UI.LABELS.PROCESS_JURIDICO}
                            </div>
                            <p className="text-base font-semibold text-gray-900">
                              {audiencia.proceso.numero_processo || 'S/N'} - {audiencia.proceso.titulo}
                            </p>
                          </div>
                        )}

                        {/* Local */}
                        {audiencia.local && (
                          <div className="flex items-start gap-2 mb-2">
                            {getIcon('mapPin', 18, 'text-gray-600')}
                            <div>
                              <div className="text-xs font-medium text-gray-600 uppercase">{AGENDA_UI.LABELS.LOCAL}</div>
                              <p className="text-base text-gray-800">{audiencia.local}</p>
                            </div>
                          </div>
                        )}

                        {/* Link virtual */}
                        {audiencia.link_meet && (
                          <div className="mt-2">
                            <a
                              href={audiencia.link_meet}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {getIcon('video', 18)}
                              {AGENDA_UI.LABELS.JOIN_MEETING}
                            </a>
                          </div>
                        )}

                        {/* Observaciones */}
                        {audiencia.observaciones && (
                          <div className="mt-3 p-3 bg-white/70 rounded-lg border border-gray-300">
                            <div className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                              {getIcon('info', 16)}
                              {AGENDA_UI.LABELS.OBSERVATIONS}
                            </div>
                            <p className="text-base text-gray-700 whitespace-pre-wrap">
                              {audiencia.observaciones}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {canEdit && (
                          <button
                            onClick={() => onEditClick(audiencia)}
                            className={AGENDA_CLASSES.editButton}
                            title={AGENDA_UI.LABELS.EDIT}
                          >
                            {getIcon('edit', 20)}
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => onDeleteClick(audiencia.id)}
                            className={AGENDA_CLASSES.deleteButton}
                            title={AGENDA_UI.LABELS.DELETE}
                          >
                            {getIcon('delete', 20)}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
