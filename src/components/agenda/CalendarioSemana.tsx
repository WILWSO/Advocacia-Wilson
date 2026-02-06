/**
 * Componente de vista semanal del calendario
 * Muestra las audiencias organizadas por día en una semana
 */

import React from 'react';
import { AudienciaWithProcesso } from '../../types/audiencia';
import { cn } from '../../utils/cn';
import { getIcon } from '../../config/icons';
import { AGENDA_UI } from '../../config/messages';
import { AGENDA_CLASSES } from '../../config/theme';
import { getFormaColor } from '../../utils/audienciaHelpers';
import { isToday as checkIsToday } from '../../utils/dateUtils';

interface CalendarioSemanaProps {
  currentDate: Date;
  audiencias: AudienciaWithProcesso[];
  onAudienciaClick: (audiencia: AudienciaWithProcesso) => void;
}

export const CalendarioSemana: React.FC<CalendarioSemanaProps> = ({
  currentDate,
  audiencias,
  onAudienciaClick,
}) => {
  // Obtener el inicio de la semana (lunes)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar al lunes
    return new Date(d.setDate(diff));
  };

  const weekStart = getWeekStart(currentDate);
  
  // Generar array de 7 días de la semana
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  // Filtrar audiencias por día
  const getAudienciasForDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return audiencias.filter(a => a.fecha === dateStr).sort((a, b) => 
      a.hora.localeCompare(b.hora)
    );
  };

  return (
    <div className={AGENDA_CLASSES.card}>
      {/* Grid de días */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 divide-x divide-gray-200">
        {weekDays.map((date, index) => {
          const dayAudiencias = getAudienciasForDay(date);
          const today = checkIsToday(date);

          return (
            <div
              key={index}
              className={cn(
                'min-h-[400px] flex flex-col',
                today ? 'bg-blue-50' : 'bg-white'
              )}
            >
              {/* Header del día */}
              <div
                className={cn(
                  'p-3 border-b border-gray-200 text-center',
                  today ? 'bg-primary-600 text-white' : 'bg-gray-50'
                )}
              >
                <div className="text-xs font-medium uppercase">
                  {AGENDA_UI.WEEK_DAYS_SHORT[index]}
                </div>
                <div className={cn(
                  'text-2xl font-bold mt-1',
                  today ? 'text-white' : 'text-gray-900'
                )}>
                  {date.getDate()}
                </div>
                <div className="text-xs opacity-75">
                  {date.toLocaleDateString('es-ES', { month: 'short' })}
                </div>
              </div>

              {/* Audiencias del día */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {dayAudiencias.length === 0 ? (
                  <div className={`${AGENDA_CLASSES.emptyState} h-full`}>
                    {getIcon('calendar', 32)}
                    <p className="text-xs mt-2">{AGENDA_UI.EMPTY_STATE.NO_HEARINGS_WEEK}</p>
                  </div>
                ) : (
                  dayAudiencias.map((audiencia) => (
                    <button
                      key={audiencia.id}
                      onClick={() => onAudienciaClick(audiencia)}
                      className={cn(
                        'w-full text-left p-2 rounded border-l-4 transition-all',
                        'hover:shadow-md hover:scale-105',
                        getFormaColor(audiencia.forma)
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {getIcon('clock', 14)}
                        <span className="text-sm font-bold">
                          {audiencia.hora.substring(0, 5)}
                        </span>
                      </div>
                      <div className="text-sm font-medium line-clamp-2 mb-1">
                        {audiencia.tipo}
                      </div>
                      {audiencia.proceso && (
                        <div className="text-xs text-gray-600 truncate flex items-center gap-1">
                          {getIcon('gavel', 12)}
                          {audiencia.proceso.numero_processo || 'S/N'}
                        </div>
                      )}
                      {audiencia.local && (
                        <div className="text-xs text-gray-600 truncate mt-1">
                          📍 {audiencia.local}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Contador de audiencias */}
              {dayAudiencias.length > 0 && (
                <div className="p-2 border-t border-gray-200 text-center text-xs text-gray-600 bg-gray-50">
                  {dayAudiencias.length} {dayAudiencias.length !== 1 ? AGENDA_UI.LABELS.HEARINGS : AGENDA_UI.LABELS.HEARING}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
