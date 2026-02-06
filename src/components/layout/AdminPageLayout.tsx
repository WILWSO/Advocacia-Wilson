import React from 'react';
import { 
  HEADING_CLASSES, 
  DESCRIPTION_CLASSES, 
  PAGE_HEADER_CLASSES, 
  SPACING_CLASSES 
} from '../../utils/formStyles';
import { ResponsiveContainer } from '../shared/ResponsiveGrid';
import { cn } from '../../utils/cn';

interface AdminPageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  headerAction?: React.ReactNode;
  className?: string;
  maxWidth?: '7xl' | '6xl' | '5xl' | 'full';
  titleSize?: 'h1' | 'h2' | 'h3';
  descriptionSize?: 'sm' | 'base' | 'lg';
}

/**
 * Layout estandarizado para páginas administrativas
 * 
 * Proporciona estructura consistente con:
 * - Header con título y descripción
 * - Acción opcional (ej: botón "Nueva...")
 * - ResponsiveContainer para anchos máximos adaptativos
 * - Padding y márgenes estandarizados
 * - Fondo neutro consistente
 * 
 * @example
 * <AdminPageLayout 
 *   title="Agenda" 
 *   description="Gestión de audiencias"
 *   titleSize="h2"
 *   descriptionSize="base"
 *   headerAction={<AccessibleButton>Nueva Audiencia</AccessibleButton>}
 * >
 *   {contenido}
 * </AdminPageLayout>
 */
export const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  children, // contenido principal de la página
  title, // título principal de la página
  description, // descripción opcional bajo el título
  headerAction, // acción opcional en el header (ej: botón)
  className, // clases adicionales para el contenedor del contenido
  maxWidth = 'full', // ancho del contenedor (qué tan cerca del borde puede llegar el contenido).
  titleSize = 'h1', // tamaño del título
  descriptionSize = 'base', // tamaño de la descripción
}) => {
  return (
    <div className="bg-neutral-50 min-h-full">
      {/* Header da página */}
      <div className={PAGE_HEADER_CLASSES.container}>
        <ResponsiveContainer maxWidth={maxWidth} className={SPACING_CLASSES.padding.page}>
          <div className={cn(
            PAGE_HEADER_CLASSES.wrapper,
            SPACING_CLASSES.gap.md
          )}>
            <div className={PAGE_HEADER_CLASSES.content}>
              <h1 className={HEADING_CLASSES[titleSize]}>{title}</h1>
              {description && (
                <p className={DESCRIPTION_CLASSES[descriptionSize]}>{description}</p>
              )}
            </div>
            
            {headerAction && (
              <div className={PAGE_HEADER_CLASSES.actions}>
                {headerAction}
              </div>
            )}
          </div>
        </ResponsiveContainer>
      </div>

      {/* Contenido principal */}
      <ResponsiveContainer 
        maxWidth={maxWidth} 
        className={cn(SPACING_CLASSES.padding.page, className)}
      >
        {children}
      </ResponsiveContainer>
    </div>
  );
};
