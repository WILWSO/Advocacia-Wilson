import { supabase } from '../lib/supabase';
import { Post } from '../types/post';

/**
 * PostsService - Single Source of Truth para acceso a datos de posts_sociais
 * Centraliza todas las operaciones CRUD para mantener SSoT
 */
export class PostsService {
  /**
   * Obtiene todos los posts (publicados y no publicados)
   * Requiere autenticación de admin
   */
  static async getAllPosts(): Promise<Post[]> {
    try {
      const { data, error } = await supabase
        .from('posts_sociais')
        .select(`
          *,
          autor:usuarios(nome, email)
        `)
        .order('data_criacao', { ascending: false });

      if (error) throw error;

      // Transformar datos para mantener compatibilidad con tipo Post
      const postsTransformados = (data || []).map((post: any) => ({
        ...post,
        autor: post.autor || post.autor_id
      }));

      return postsTransformados as Post[];
    } catch (error) {
      console.error('Error fetching all posts:', error);
      throw error;
    }
  }

  /**
   * Obtiene posts publicados con límite opcional
   * Usado en páginas públicas y carousel
   */
  static async getPublishedPosts(limit?: number): Promise<Post[]> {
    try {
      let query = supabase
        .from('posts_sociais')
        .select('*')
        .eq('publicado', true)
        .order('data_criacao', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as Post[];
    } catch (error) {
      console.error('Error fetching published posts:', error);
      throw error;
    }
  }

  /**
   * Obtiene posts destacados publicados con límite opcional
   * Usado en homepage y secciones especiales
   */
  static async getFeaturedPosts(limit?: number): Promise<Post[]> {
    try {
      let query = supabase
        .from('posts_sociais')
        .select('*')
        .eq('publicado', true)
        .eq('destaque', true)
        .order('data_criacao', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as Post[];
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      throw error;
    }
  }

  /**
   * Obtiene un post por ID
   */
  static async getPostById(id: string): Promise<Post | null> {
    try {
      const { data, error } = await supabase
        .from('posts_sociais')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Post;
    } catch (error) {
      console.error('Error fetching post by ID:', error);
      return null;
    }
  }

  /**
   * Verifica si existen posts destacados publicados
   * Usado para mostrar/ocultar secciones
   */
  static async hasFeaturedPosts(): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('posts_sociais')
        .select('id', { count: 'exact', head: true })
        .eq('publicado', true)
        .eq('destaque', true);

      if (error) throw error;
      return (count ?? 0) > 0;
    } catch (error) {
      console.error('Error checking featured posts:', error);
      return false;
    }
  }

  /**
   * Crea un nuevo post
   * Requiere autenticación
   */
  static async createPost(post: Omit<Post, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<Post> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('posts_sociais')
        .insert([post])
        .select()
        .single();

      if (error) {
        console.error('Erro Supabase ao criar post:', error);
        throw new Error(`Erro ao criar post: ${error.message}`);
      }

      return data as Post;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  /**
   * Actualiza un post existente
   * Requiere autenticación
   */
  static async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('posts_sociais')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro Supabase ao atualizar post:', error);
        throw new Error(`Erro ao atualizar post: ${error.message}`);
      }

      return data as Post;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  /**
   * Actualiza solo el contador de likes de un post
   * Usado en páginas públicas sin autenticación
   */
  static async updateLikes(id: string, likes: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('posts_sociais')
        .update({ likes: Math.max(0, likes) })
        .eq('id', id);

      if (error) {
        console.error('Error al actualizar likes:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating likes:', error);
      throw error;
    }
  }

  /**
   * Actualiza solo el contador de comentarios de un post
   */
  static async updateComments(id: string, comentarios: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('posts_sociais')
        .update({ comentarios })
        .eq('id', id);

      if (error) {
        console.error('Error al actualizar comentarios:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating comments:', error);
      throw error;
    }
  }

  /**
   * Cambia el estado de publicación de un post
   * Requiere autenticación
   */
  static async togglePublished(id: string, publicado: boolean): Promise<Post> {
    return await this.updatePost(id, { publicado });
  }

  /**
   * Elimina un post
   * Requiere autenticación
   */
  static async deletePost(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('posts_sociais')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
}
