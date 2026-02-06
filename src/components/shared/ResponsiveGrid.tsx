/**
 * Componente Grid Responsivo Avanzado
 * Sistema flexible para layouts responsive con TypeScript
 */

import React from 'react';
import { cn } from '../../utils/cn';
import { CSS_UTILITY_MAPS } from '../../config/theme';

interface ResponsiveGridProps {
  children: React.ReactNode;
  // Configuración de columnas para cada breakpoint
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  // Gap entre elementos
  gap?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  } | number;
  // Clases adicionales
  className?: string;
  // Props HTML
  role?: string;
  'aria-label'?: string;
}

/**
 * Grid responsivo con configuración granular por breakpoint
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { xs: 1, sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 6,
  className,
  ...props
}) => {
  // Generar clases de grid
  const generateGridClasses = () => {
    const classes: string[] = [];
    
    // Columnas
    Object.entries(cols).forEach(([breakpoint, colCount]) => {
      if (breakpoint === 'xs') {
        classes.push(`grid-cols-${colCount}`);
      } else {
        classes.push(`${breakpoint}:grid-cols-${colCount}`);
      }
    });

    // Gap
    if (typeof gap === 'number') {
      classes.push(`gap-${gap}`);
    } else {
      Object.entries(gap).forEach(([breakpoint, gapValue]) => {
        if (breakpoint === 'xs') {
          classes.push(`gap-${gapValue}`);
        } else {
          classes.push(`${breakpoint}:gap-${gapValue}`);
        }
      });
    }

    return classes.join(' ');
  };

  return (
    <div
      className={cn(
        'grid',
        generateGridClasses(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface ResponsiveContainerProps {
  children: React.ReactNode;
  // Tamaño máximo del contenedor
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'screen';
  // Padding responsivo
  padding?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  } | number;
  // Centrado
  centered?: boolean;
  className?: string;
}

/**
 * Contenedor responsivo con padding y ancho máximo configurables
 */
export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'full',
  padding = 4,
  centered = true,
  className,
}) => {
  // Generar clases de padding
  const generatePaddingClasses = () => {
    if (typeof padding === 'number') {
      return `px-${padding}`;
    }

    const classes: string[] = [];
    Object.entries(padding).forEach(([breakpoint, paddingValue]) => {
      if (breakpoint === 'xs') {
        classes.push(`px-${paddingValue}`);
      } else {
        classes.push(`${breakpoint}:px-${paddingValue}`);
      }
    });
    
    return classes.join(' ');
  };

  const containerClasses = cn(
    maxWidth === 'full' ? 'w-full' : `max-w-${maxWidth}`,
    centered && 'mx-auto',
    generatePaddingClasses(),
    className
  );

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

interface ResponsiveStackProps {
  children: React.ReactNode;
  // Dirección del stack en diferentes breakpoints
  direction?: {
    xs?: 'row' | 'col';
    sm?: 'row' | 'col';
    md?: 'row' | 'col';
    lg?: 'row' | 'col';
    xl?: 'row' | 'col';
    '2xl'?: 'row' | 'col';
  };
  // Espaciado entre elementos
  spacing?: number;
  // Alineación
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  className?: string;
}

/**
 * Stack responsivo que cambia dirección según breakpoint
 */
export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  direction = { xs: 'col', md: 'row' },
  spacing = 4,
  align = 'start',
  justify = 'start',
  className,
}) => {
  // Generar clases de dirección
  const generateDirectionClasses = () => {
    const classes: string[] = ['flex'];
    
    Object.entries(direction).forEach(([breakpoint, dir]) => {
      const flexClass = dir === 'col' ? 'flex-col' : 'flex-row';
      
      if (breakpoint === 'xs') {
        classes.push(flexClass);
      } else {
        classes.push(`${breakpoint}:${flexClass}`);
      }
    });

    return classes.join(' ');
  };

  // Generar clases de espaciado
  const generateSpacingClasses = () => {
    // Para flex-col usamos space-y, para flex-row usamos space-x
    const isVertical = direction.xs === 'col';
    return isVertical ? `space-y-${spacing}` : `space-x-${spacing}`;
  };

  // Mapear valores de alineación
  const alignClasses = CSS_UTILITY_MAPS.align;
  const justifyClasses = CSS_UTILITY_MAPS.justify;

  return (
    <div
      className={cn(
        generateDirectionClasses(),
        generateSpacingClasses(),
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  );
};

interface HideOnBreakpointProps {
  children: React.ReactNode;
  // Ocultar en breakpoints específicos
  hideOn?: ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')[];
  // Mostrar solo en breakpoints específicos
  showOnlyOn?: ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')[];
  className?: string;
}

/**
 * Componente para mostrar/ocultar elementos en breakpoints específicos
 */
export const HideOnBreakpoint: React.FC<HideOnBreakpointProps> = ({
  children,
  hideOn,
  showOnlyOn,
  className,
}) => {
  const generateVisibilityClasses = () => {
    const classes: string[] = [];

    if (hideOn) {
      hideOn.forEach(breakpoint => {
        classes.push(`${breakpoint}:hidden`);
      });
    }

    if (showOnlyOn) {
      // Ocultar por defecto
      classes.push('hidden');
      // Mostrar solo en los breakpoints especificados
      showOnlyOn.forEach(breakpoint => {
        classes.push(`${breakpoint}:block`);
      });
    }

    return classes.join(' ');
  };

  return (
    <div className={cn(generateVisibilityClasses(), className)}>
      {children}
    </div>
  );
};

export { ResponsiveGrid as default };