/**
 * ViewSwitcher Component
 * 
 * Selector de vistas similar al de Supabase Dashboard
 * Permite cambiar entre diferentes modos de visualización: List, Card, Grid, Section
 * 
 * @example
 * ```tsx
 * <ViewSwitcher
 *   currentView={viewMode}
 *   onChange={setViewMode}
 *   views={['list', 'card', 'grid', 'section']}
 * />
 * ```
 */

import React from 'react';
import { LayoutList, LayoutGrid, Grid3x3, Layers } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ViewMode = 'list' | 'card' | 'grid' | 'section';

interface ViewOption {
  value: ViewMode;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const VIEW_OPTIONS: ViewOption[] = [
  {
    value: 'list',
    label: 'Lista',
    icon: <LayoutList size={18} />,
    description: 'Vista de lista compacta'
  },
  {
    value: 'card',
    label: 'Cards',
    icon: <Layers size={18} />,
    description: 'Tarjetas individuales'
  },
  {
    value: 'grid',
    label: 'Grid',
    icon: <Grid3x3 size={18} />,
    description: 'Cuadrícula organizada'
  },
  {
    value: 'section',
    label: 'Secciones',
    icon: <LayoutGrid size={18} />,
    description: 'Vista por secciones'
  }
];

interface ViewSwitcherProps {
  /** Vista actualmente seleccionada */
  currentView: ViewMode;
  /** Callback al cambiar de vista */
  onChange: (view: ViewMode) => void;
  /** Vistas disponibles (opcional, por defecto todas) */
  views?: ViewMode[];
  /** Tamaño del componente */
  size?: 'sm' | 'md';
  /** Mostrar labels en los botones */
  showLabels?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  currentView,
  onChange,
  views = ['list', 'card', 'grid', 'section'],
  size = 'md',
  showLabels = false,
  className
}) => {
  const availableViews = VIEW_OPTIONS.filter(option => views.includes(option.value));

  const sizeClasses = {
    sm: 'h-8 px-2',
    md: 'h-10 px-3'
  };

  return (
    <div 
      className={cn(
        'inline-flex items-center gap-0.5 bg-gray-100 rounded-lg p-1',
        className
      )}
      role="tablist"
      aria-label="Selector de vista"
    >
      {availableViews.map((option) => {
        const isActive = currentView === option.value;
        
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={option.description}
            title={option.description}
            onClick={() => onChange(option.value)}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
              sizeClasses[size],
              isActive
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            )}
          >
            <span className={cn(
              'flex items-center justify-center',
              isActive && 'text-blue-600'
            )}>
              {option.icon}
            </span>
            {showLabels && (
              <span className="text-sm whitespace-nowrap">
                {option.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

/**
 * ViewSwitcher con labels siempre visibles (responsive)
 */
export const ViewSwitcherLabeled: React.FC<Omit<ViewSwitcherProps, 'showLabels'>> = (props) => {
  return (
    <div className="flex items-center gap-2">
      {/* Labels ocultos en móvil */}
      <div className="hidden md:block">
        <ViewSwitcher {...props} showLabels size="md" />
      </div>
      {/* Solo íconos en móvil */}
      <div className="md:hidden">
        <ViewSwitcher {...props} showLabels={false} size="sm" />
      </div>
    </div>
  );
};
