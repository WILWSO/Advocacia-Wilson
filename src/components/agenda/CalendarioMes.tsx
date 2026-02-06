/**
 * Componente de vista mensual del calendario
 * Muestra las audiencias organizadas por día en formato de cuadrícula
 */

import React from 'react';
import { AudienciaWithProcesso } from '../../types/audiencia';
import { cn } from '../../utils/cn';
import { AGENDA_UI } from '../../config/messages';
import { getFormaBadgeClasses } from '../../utils/audienciaHelpers';
import { isToday as checkIsToday } from '../../utils/dateUtils';

interface CalendarioMesProps {
  currentDate: Date;
  audiencias: AudienciaWithProcesso[];
  onAudienciaClick: (audiencia: AudienciaWithProcesso) => void;
}

export const CalendarioMes: React.FC<CalendarioMesProps> = ({
  currentDate,
  audiencias,
  onAudienciaClick,
}) => {
  // Obtener primer y último día del mes
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Obtener día de la semana del primer día (0 = domingo, ajustar a lunes = 0)
  const startDayOfWeek = (firstDay.getDay() + 6) % 7;
  
  // Días del mes
  const daysInMonth = lastDay.getDate();
  
  // Días a mostrar (incluyendo días del mes anterior y siguiente)
  const totalCells = Math.ceil((daysInMonth + startDayOfWeek) / 7) * 7;
  
  // Generar array de días
  const days: (Date | null)[] = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - startDayOfWeek + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      days.push(new Date(year, month, dayNumber));
    } else {
      days.push(null);
    }
  }

  // Filtrar audiencias por día
  const getAudienciasForDay = (date: Date | null) => {
    if (!date) return [];
    
    const dateStr = date.toISOString().split('T')[0];
    return audiencias.filter(a => a.fecha === dateStr);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header con días de la semana */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {AGENDA_UI.WEEK_DAYS_SHORT.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-semibold text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7">
        {days.map((date, index) => {
          const dayAudiencias = getAudienciasForDay(date);
          const today = checkIsToday(date);

          return (
            <div
              key={index}
              className={cn(
                'min-h-[100px] p-2 border-b border-r border-gray-100',
                date ? 'bg-white hover:bg-gray-50' : 'bg-gray-50',
                index % 7 === 6 && 'border-r-0'
              )}
            >
              {date && (
                <>
                  {/* Número del día */}
                  <div
                    className={cn(
                      'text-sm font-medium mb-1',
                      today
                        ? 'bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center'
                        : 'text-gray-700'
                    )}
                  >
                    {date.getDate()}
                  </div>

                  {/* Audiencias del día */}
                  <div className="space-y-1">
                    {dayAudiencias.slice(0, 3).map((audiencia) => (
                      <button
                        key={audiencia.id}
                        onClick={() => onAudienciaClick(audiencia)}
                        className={cn(
                          'w-full text-left px-2 py-1 rounded text-xs truncate',
                          'hover:opacity-80 transition-opacity',
                          getFormaBadgeClasses(audiencia.forma)
                        )}
                        title={`${audiencia.hora} - ${audiencia.tipo}`}
                      >
                        {audiencia.hora.substring(0, 5)} {audiencia.tipo}
                      </button>
                    ))}
                    {dayAudiencias.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayAudiencias.length - 3} {AGENDA_UI.LABELS.MORE_ITEMS}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
