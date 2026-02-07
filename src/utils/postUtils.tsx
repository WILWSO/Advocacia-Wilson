import { FileText, Video, ImageIcon, ExternalLink } from 'lucide-react';
import { PostType } from '../types/post';
import { formatDate as formatDateUtil, formatDateTimeLong } from './dateUtils';

/**
 * Retorna el ícono correspondiente al tipo de post
 */
export const getTypeIcon = (type: PostType) => {
  const icons = {
    article: <FileText size={16} />,
    video: <Video size={16} />,
    image: <ImageIcon size={16} />,
    announcement: <ExternalLink size={16} />
  };
  return icons[type];
};

/**
 * Retorna las clases de color correspondientes al tipo de post
 */
export const getTypeColor = (type: PostType) => {
  const colors = {
    article: 'bg-blue-100 text-blue-700 border-blue-200',
    video: 'bg-red-100 text-red-700 border-red-200',
    image: 'bg-green-100 text-green-700 border-green-200',
    announcement: 'bg-purple-100 text-purple-700 border-purple-200'
  };
  return colors[type];
};

/**
 * Formatea una fecha al formato brasileño
 * @deprecated Use formatDate desde utils/dateUtils.ts directamente
 * 
 * MIGRACIÓN: Cambiar todos los usos a:
 * - formatDate(date, 'pt-BR') para fecha simple
 * - formatDateTimeLong(date, 'pt-BR') para fecha con hora
 * 
 * Este wrapper será removido en una versión futura.
 */
export const formatDate = (date: Date | string, includeTime = false): string => {
  console.warn('postUtils.formatDate is deprecated. Use dateUtils.formatDate or dateUtils.formatDateTimeLong directly.')
  return includeTime ? formatDateTimeLong(date, 'pt-BR') : formatDateUtil(date, 'pt-BR');
};

/**
 * Trunca un texto a una longitud máxima
 */
export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

/**
 * Verifica si un post es nuevo (menos de 48 horas)
 * Migrado desde services/postsService.ts
 */
export const isNewPost = (dateString?: string): boolean => {
  if (!dateString) return false;
  return new Date(dateString).getTime() > Date.now() - 48 * 60 * 60 * 1000;
};

/**
 * Obtiene la imagen de fondo de un post (imagen propia o thumbnail de YouTube)
 * Migrado desde services/postsService.ts
 */
export const getBackgroundImage = (post: { image_url?: string; youtube_id?: string }): string | null => {
  if (post?.image_url) {
    return post.image_url;
  }
  if (post?.youtube_id) {
    return `https://img.youtube.com/vi/${post.youtube_id}/maxresdefault.jpg`;
  }
  return null;
};
