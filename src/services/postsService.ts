import { supabase } from '../lib/supabase';

export interface Post {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: string;
  image_url?: string;
  youtube_id?: string;
  tags: string[];
  data_criacao: string;
  likes: number;
  comentarios: number;
}

export class PostsService {
  static async getPublishedPosts(limit: number = 5): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('posts_sociais')
        .select('id, titulo, conteudo, tipo, image_url, youtube_id, tags, data_criacao, likes, comentarios')
        .eq('publicado', true)
        .order('data_criacao', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  static getBackgroundImage(post: Pick<Post, 'image_url' | 'youtube_id'>): string | null {
    if (post?.image_url) {
      return post.image_url;
    }
    if (post?.youtube_id) {
      return `https://img.youtube.com/vi/${post.youtube_id}/maxresdefault.jpg`;
    }
    return null;
  }

  static isNewPost(dateString: string): boolean {
    return new Date(dateString).getTime() > Date.now() - 48 * 60 * 60 * 1000;
  }
}
