/**
 * Sistema Centralizado de Rutas de Navegación
 * 
 * Single Source of Truth (SSoT) para todas las rutas del sistema.
 * Cambiar aquí afecta todo el sistema.
 * 
 * @module config/routes
 */

/**
 * Rutas principales del sistema
 */
export const ROUTES = {
  // ==================== PÚBLICO ====================
  HOME: '/',
  NOSSA_HISTORIA: '/nossa-historia',
  EQUIPE: '/equipe',
  AREAS_ATUACAO: '/areas-atuacao',
  SOCIAL: '/social',
  CONTATO: '/contato',
  LOGIN: '/login',
  NOT_FOUND: '/404',
  
  // ==================== ADMINISTRATIVO ====================
  ADMIN: {
    BASE: '/admin',
    PROCESSOS: '/admin/processos',
    CLIENTES: '/admin/clientes',
    USUARIOS: '/admin/usuarios',
    SOCIAL: '/admin/social',
    // Alias para compatibilidade
    DASHBOARD: '/admin'
  },
  
  // ==================== SECCIONES DE PÁGINA (ANCHORS) ====================
  SECTIONS: {
    HERO: '#hero',
    TEAM: '#team',
    ABOUT: '#about',
    PRACTICE_AREAS: '#practice-areas',
    SOCIAL: '#social',
    TESTIMONIALS: '#testimonials',
    CONTACT: '#contact'
  }
} as const;

/**
 * Helper para verificar si una ruta pertenece al área administrativa
 */
export const isAdminRoute = (pathname: string): boolean => {
  return pathname.startsWith(ROUTES.ADMIN.BASE);
};

/**
 * Helper para verificar si una ruta es pública
 */
export const isPublicRoute = (pathname: string): boolean => {
  return !isAdminRoute(pathname);
};

/**
 * Helper para obtener el nombre de la ruta actual
 */
export const getRouteName = (pathname: string): string => {
  const routeMap: Record<string, string> = {
    [ROUTES.HOME]: 'Home',
    [ROUTES.NOSSA_HISTORIA]: 'Nossa História',
    [ROUTES.EQUIPE]: 'Equipe',
    [ROUTES.AREAS_ATUACAO]: 'Áreas de Atuação',
    [ROUTES.SOCIAL]: 'Social',
    [ROUTES.CONTATO]: 'Contato',
    [ROUTES.LOGIN]: 'Login',
    [ROUTES.ADMIN.BASE]: 'Dashboard',
    [ROUTES.ADMIN.PROCESSOS]: 'Processos',
    [ROUTES.ADMIN.CLIENTES]: 'Clientes',
    [ROUTES.ADMIN.USUARIOS]: 'Usuários',
    [ROUTES.ADMIN.SOCIAL]: 'Social'
  };
  
  return routeMap[pathname] || 'Página não encontrada';
};

/**
 * Helper para construir URL completa con query params
 */
export const buildUrl = (
  route: string, 
  params?: Record<string, string | number>
): string => {
  if (!params) return route;
  
  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
    
  return `${route}?${queryString}`;
};

/**
 * Type helper para rutas válidas
 */
export type RouteKey = typeof ROUTES[keyof typeof ROUTES] | string;
