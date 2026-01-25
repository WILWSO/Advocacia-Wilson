import { useState, useEffect } from 'react';
import { supabase, PostSocial } from '../lib/supabase';

/**
 * Hook para gestionar posts sociais (administración)
 * Requiere autenticación
 * Extraído de useSupabase.ts para mejor modularidad CDMF
 */
export const usePostsSociais = () => {
  const [posts, setPosts] = useState<PostSocial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (publicadosOnly = false) => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('posts_sociais')
        .select(`
          *,
          autor:usuarios(nome, email)
        `)
        .order('data_criacao', { ascending: false });

      if (publicadosOnly) {
        query = query.eq('publicado', true);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) {
        throw supabaseError;
      }

      setPosts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: Omit<PostSocial, 'id' | 'data_criacao' | 'data_atualizacao'>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('posts_sociais')
        .insert([postData])
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      await fetchPosts();
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar post';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (id: string, postData: Partial<PostSocial>) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('posts_sociais')
        .update(postData)
        .eq('id', id)
        .select();

      if (supabaseError) {
        throw supabaseError;
      }

      await fetchPosts();
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar post';
      setError(errorMessage);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error: supabaseError } = await supabase
        .from('posts_sociais')
        .delete()
        .eq('id', id);

      if (supabaseError) {
        throw supabaseError;
      }

      await fetchPosts();
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar post';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (id: string, publicado: boolean) => {
    return await updatePost(id, { publicado });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    togglePublished
  };
};

/**
 * Hook para posts públicos (sin autenticación requerida)
 * Usado en página pública de posts sociais
 * Extraído de useSupabase.ts para mejor modularidad CDMF
 */
export const usePostsPublicos = () => {
  const [posts, setPosts] = useState<PostSocial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchPostsPublicos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Consulta simplificada sin JOIN para evitar problemas de permisos
      const { data, error: supabaseError } = await supabase
        .from('posts_sociais')
        .select('*')
        .eq('publicado', true)
        .order('data_criacao', { ascending: false });

      if (supabaseError) {
        console.error('Error al cargar posts:', supabaseError.message);
        throw supabaseError;
      }

      // Transformar autor de UUID a string simple para mostrar
      const postsTransformed = (data || []).map(post => ({
        ...post,
        autor: typeof post.autor === 'string' ? 'Equipe Santos & Nascimento' : post.autor
      }));

      setPosts(postsTransformed);
      setHasFetched(true);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao carregar posts públicos';
      console.error('Error loading public posts:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Solo cargar una vez
    if (!hasFetched) {
      fetchPostsPublicos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts: fetchPostsPublicos
  };
};
