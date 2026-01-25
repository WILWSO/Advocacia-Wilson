import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook para verificar si existen posts destacados publicados
 * Usado para mostrar/ocultar la sección Social y el link en el navbar
 */
export const useFeaturedPosts = () => {
  const [hasFeaturedPosts, setHasFeaturedPosts] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkFeaturedPosts = async () => {
      try {
        const { count, error } = await supabase
          .from('posts_sociais')
          .select('id', { count: 'exact', head: true })
          .eq('publicado', true)
          .eq('destaque', true);

        if (error) throw error;

        setHasFeaturedPosts((count ?? 0) > 0);
      } catch (error) {
        console.error('Error checking featured posts:', error);
        setHasFeaturedPosts(false);
      } finally {
        setLoading(false);
      }
    };

    checkFeaturedPosts();
  }, []);

  return { hasFeaturedPosts, loading };
};
