import { useState, useEffect } from 'react';
import { PostsService } from '../../services/postsService';

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
        // ✅ SSoT: Usa PostsService en lugar de query directa
        const result = await PostsService.hasFeaturedPosts();
        setHasFeaturedPosts(result);
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
