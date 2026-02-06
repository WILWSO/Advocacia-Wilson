/**
 * Tipos centralizados para posts de la plataforma social
 * Single source of truth para evitar inconsistencias entre componentes
 */

import { BaseEntity, BaseFilters, BaseStats } from './common'

/**
 * Tipo de post (article, video, image, announcement)
 */
export type PostType = 'article' | 'video' | 'image' | 'announcement';

/**
 * Autor del post (puede ser string simple o objeto con nombre y email)
 */
export type PostAuthor = string | { nome: string; email?: string };

/**
 * Interface principal para posts
 * Usa nomenclatura portuguesa para coincidir con schema de Supabase
 * Extiende BaseEntity para campos de auditoría estándar
 */
export interface Post extends Omit<BaseEntity, 'id'> {
  id?: string;
  titulo: string;
  conteudo: string;
  tipo: PostType;
  image_url?: string;
  video_url?: string;
  youtube_id?: string;
  tags: string[];
  destaque: boolean;
  publicado: boolean;
  data_criacao?: string;
  data_atualizacao?: string;
  data_publicacao?: string;
  autor: PostAuthor;
  likes: number;
  comentarios: number;
}

/**
 * Interface para crear/editar posts (sin campos autogenerados)
 */
export interface PostFormData {
  titulo: string;
  conteudo: string;
  tipo: PostType;
  image_url?: string;
  video_url?: string;
  youtube_id?: string;
  tags: string[];
  destaque: boolean;
  publicado: boolean;
}

/**
 * Interface para comentarios de posts
 * Extiende BaseEntity para campos de auditoría estándar
 */
export interface Comentario extends BaseEntity {
  post_id: string;
  autor_nome: string;
  autor_email?: string;
  comentario: string;
  data_criacao: string;
  aprovado: boolean;
}

/**
 * Estadísticas de posts para filtros
 * Extiende BaseStats con campos específicos
 */
export interface PostStats extends BaseStats {
  publicados: number;
  rascunhos: number;
  destacados: number;
}

/**
 * Filtros para posts
 * Extiende BaseFilters con campos específicos
 */
export interface PostFilters extends BaseFilters {
  searchTerm: string;
  filterType: 'all' | PostType;
  filterStatus: 'all' | 'published' | 'draft';
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
