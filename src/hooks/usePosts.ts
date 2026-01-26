import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Post } from '../types/post';
import { usePosts as usePostsBase } from './useSupabase';

/**
 * Hook para gestionar posts sociais (administración)
 * Requiere autenticación
 * Ahora usa el hook base usePosts() de useSupabase.ts
 */
export const usePostsSociais = () => {
  return usePostsBase();
};

/**
 * Hook para posts públicos (sin autenticación requerida)
 * Usado en página pública de posts sociais
 * Extraído de useSupabase.ts para mejor modularidad CDMF
 */
export const usePostsPublicos = () => {
  const [posts, setPosts] = useState<Post[]>([]);
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
