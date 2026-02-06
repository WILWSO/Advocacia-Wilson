/**
 * Utilidades para filtrado de posts y elementos del menú
 * ✅ SSoT: Lógica de filtrado centralizada
 * 
 * @module utils/postFilters
 */

import { pageDropdownItems } from '../components/home/NavBar';

/**
 * Filtra items del dropdown de página basado en disponibilidad de posts destacados
 * 
 * Si no hay posts destacados, oculta el item '#social' del menú.
 * 
 * @param hasFeaturedPosts - Indica si existen posts destacados
 * @returns Array filtrado de items del dropdown
 * 
 * @example
 * const items = filterPageDropdownItems(hasFeaturedPosts);
 */
export const filterPageDropdownItems = (hasFeaturedPosts: boolean) => {
  return pageDropdownItems.filter(item => {
    // Si es el item "Destaques", solo mostrarlo si hay posts destacados
    if (item.href === '#social') {
      return hasFeaturedPosts;
    }
    return true;
  });
};
