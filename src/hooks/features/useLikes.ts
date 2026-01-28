import { useState, useCallback } from 'react';

/**
 * Hook para gestionar likes en posts
 * Soporta dos modos: single (para modal de un post) y multiple (para feed)
 */

/**
 * useLikes para un único post (modo modal)
 */
export const useSinglePostLike = (initialLikes: number) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);

  const toggleLike = useCallback(() => {
    setIsLiked(prev => !prev);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  }, [isLiked]);

  return { isLiked, likes, toggleLike };
};

/**
 * useLikes para múltiples posts (modo feed)
 */
export const useMultiplePostsLike = () => {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = useCallback((postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  }, []);

  const isLiked = useCallback((postId: string) => {
    return likedPosts.has(postId);
  }, [likedPosts]);

  return { likedPosts, toggleLike, isLiked };
};

/**
 * Utilidades para persistencia de likes (localStorage)
 */
const LIKES_STORAGE_KEY = 'social_likes';

export const saveLikesToStorage = (likedPosts: Set<string>) => {
  try {
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(Array.from(likedPosts)));
  } catch (error) {
    console.error('Error saving likes to storage:', error);
  }
};

export const loadLikesFromStorage = (): Set<string> => {
  try {
    const stored = localStorage.getItem(LIKES_STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.error('Error loading likes from storage:', error);
  }
  return new Set();
};
