/**
 * Hook personalizado para manejo de responsive design
 * Facilita la detección de breakpoints y adaptación de componentes
 */

import { useState, useEffect } from 'react';

// Breakpoints según Tailwind CSS
const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;
type BreakpointValue = typeof breakpoints[Breakpoint];

interface UseResponsiveReturn {
  // Breakpoint actual
  currentBreakpoint: Breakpoint;
  // Ancho de ventana actual
  windowWidth: number;
  // Helpers para verificar si estamos en cierto breakpoint
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  // Funciones para verificar breakpoints específicos
  isAtLeast: (breakpoint: Breakpoint) => boolean;
  isAtMost: (breakpoint: Breakpoint) => boolean;
  isBetween: (min: Breakpoint, max: Breakpoint) => boolean;
}

/**
 * Hook para manejo responsive con TypeScript
 */
export const useResponsive = (): UseResponsiveReturn => {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Listener optimizado con throttling
    let timeoutId: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 16); // ~60fps
    };

    window.addEventListener('resize', throttledResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Determinar breakpoint actual
  const getCurrentBreakpoint = (width: number): Breakpoint => {
    const sortedBreakpoints = Object.entries(breakpoints)
      .sort(([, a], [, b]) => b - a) as [Breakpoint, BreakpointValue][];

    for (const [breakpoint, minWidth] of sortedBreakpoints) {
      if (width >= minWidth) {
        return breakpoint;
      }
    }
    return 'xs';
  };

  const currentBreakpoint = getCurrentBreakpoint(windowWidth);

  // Helpers de conveniencia
  const isMobile = windowWidth < breakpoints.md;
  const isTablet = windowWidth >= breakpoints.md && windowWidth < breakpoints.lg;
  const isDesktop = windowWidth >= breakpoints.lg && windowWidth < breakpoints.xl;
  const isLargeDesktop = windowWidth >= breakpoints.xl;

  // Funciones de utilidad
  const isAtLeast = (breakpoint: Breakpoint): boolean => {
    return windowWidth >= breakpoints[breakpoint];
  };

  const isAtMost = (breakpoint: Breakpoint): boolean => {
    return windowWidth <= breakpoints[breakpoint];
  };

  const isBetween = (min: Breakpoint, max: Breakpoint): boolean => {
    return windowWidth >= breakpoints[min] && windowWidth <= breakpoints[max];
  };

  return {
    currentBreakpoint,
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isAtLeast,
    isAtMost,
    isBetween,
  };
};

/**
 * Hook para breakpoints específicos (más simple)
 */
export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`);
    setIsMatch(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMatch(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [breakpoint]);

  return isMatch;
};

/**
 * Hook para orientación de dispositivo
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return {
    orientation,
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
  };
};

export default useResponsive;