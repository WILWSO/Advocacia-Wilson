/**
 * Utilidades para classNames condicionales
 * Similar a clsx/classNames pero optimizado para este proyecto
 */

type ClassValue = string | number | boolean | undefined | null | ClassArray | ClassObject;
type ClassArray = ClassValue[];
type ClassObject = Record<string, boolean | undefined | null>;

/**
 * Función para combinar classNames de manera condicional
 */
export function cn(...classes: ClassValue[]): string {
  const result: string[] = [];

  for (const cls of classes) {
    if (!cls) continue;

    if (typeof cls === 'string') {
      result.push(cls);
    } else if (typeof cls === 'number') {
      result.push(String(cls));
    } else if (Array.isArray(cls)) {
      const nested = cn(...cls);
      if (nested) result.push(nested);
    } else if (typeof cls === 'object') {
      for (const [key, value] of Object.entries(cls)) {
        if (value) result.push(key);
      }
    }
  }

  return result.join(' ');
}

/**
 * Utilidades específicas para responsive design
 */
export const responsive = {
  /**
   * Genera clases de grid responsivo
   */
  gridCols: (cols: Record<string, number>) => {
    return Object.entries(cols)
      .map(([breakpoint, count]) => 
        breakpoint === 'xs' ? `grid-cols-${count}` : `${breakpoint}:grid-cols-${count}`
      )
      .join(' ');
  },

  /**
   * Genera clases de padding responsivo
   */
  padding: (values: Record<string, number> | number) => {
    if (typeof values === 'number') {
      return `p-${values}`;
    }
    
    return Object.entries(values)
      .map(([breakpoint, value]) => 
        breakpoint === 'xs' ? `p-${value}` : `${breakpoint}:p-${value}`
      )
      .join(' ');
  },

  /**
   * Genera clases de margin responsivo
   */
  margin: (values: Record<string, number> | number) => {
    if (typeof values === 'number') {
      return `m-${values}`;
    }
    
    return Object.entries(values)
      .map(([breakpoint, value]) => 
        breakpoint === 'xs' ? `m-${value}` : `${breakpoint}:m-${value}`
      )
      .join(' ');
  },

  /**
   * Genera clases de texto responsivo
   */
  text: (sizes: Record<string, string>) => {
    return Object.entries(sizes)
      .map(([breakpoint, size]) => 
        breakpoint === 'xs' ? `text-${size}` : `${breakpoint}:text-${size}`
      )
      .join(' ');
  },

  /**
   * Genera clases de ocultar/mostrar por breakpoint
   */
  visibility: (config: { hideOn?: string[]; showOn?: string[] }) => {
    const classes: string[] = [];
    
    if (config.hideOn) {
      config.hideOn.forEach(bp => classes.push(`${bp}:hidden`));
    }
    
    if (config.showOn) {
      classes.push('hidden');
      config.showOn.forEach(bp => classes.push(`${bp}:block`));
    }
    
    return classes.join(' ');
  }
};

export default cn;