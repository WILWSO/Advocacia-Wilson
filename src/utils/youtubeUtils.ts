/**
 * Utilidades para manejo de videos de YouTube
 */

/**
 * Extrae el ID de un video de YouTube desde diferentes formatos de URL
 * Soporta:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 */
export const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * Genera la URL de embed de YouTube con parámetros optimizados
 * @param videoId - ID del video de YouTube (11 caracteres)
 * @param autoplay - Si debe reproducirse automáticamente (default: false)
 * @returns URL completa para iframe embed
 */
export const getYouTubeEmbedUrl = (videoId: string, autoplay = false): string => {
  const params = new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1'
  });
  
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

/**
 * Genera la URL de thumbnail de YouTube en diferentes calidades
 * @param videoId - ID del video de YouTube
 * @param quality - Calidad: 'maxres' | 'hq' | 'mq' | 'sd' (default: 'maxres')
 */
export const getYouTubeThumbnail = (
  videoId: string, 
  quality: 'maxres' | 'hq' | 'mq' | 'sd' = 'maxres'
): string => {
  const qualityMap = {
    maxres: 'maxresdefault.jpg',
    hq: 'hqdefault.jpg',
    mq: 'mqdefault.jpg',
    sd: 'sddefault.jpg'
  };
  
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}`;
};

/**
 * Valida si un string es un ID válido de YouTube
 */
export const isValidYouTubeId = (id: string): boolean => {
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
};
