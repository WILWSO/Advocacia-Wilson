/**
 * Tipos centralizados para posts de la plataforma social
 * Single source of truth para evitar inconsistencias entre componentes
 */

/**
 * Tipo de post (article, video, image, announcement)
 */
export type PostType = 'article' | 'video' | 'image' | 'announcement';

/**
 * Autor del post (puede ser string simple o objeto con nombre)
 */
export type PostAuthor = string | { nome: string };

/**
 * Interface principal para posts
 * Usa nomenclatura portuguesa para coincidir con schema de Supabase
 */
export interface Post {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: PostType;
  image_url?: string;
  video_url?: string;
  youtube_id?: string;
  tags: string[];
  destaque: boolean;
  data_criacao: string;
  data_publicacao?: string;
  autor: PostAuthor;
  likes: number;
  comentarios: number;
}

/**
 * Interface para comentarios de posts
 */
export interface Comentario {
  id: string;
  post_id: string;
  autor_nome: string;
  comentario: string;
  data_criacao: string;
  aprovado: boolean;
}

/**
 * Props para PostModal
 */
export interface PostModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Props para PostPreview en SocialFeed
 */
export interface PostPreviewProps {
  post: Post;
  compact?: boolean;
  onLike?: (id: string) => void;
  isLiked?: boolean;
}
