import { useState, useEffect } from 'react';
import { PostsService } from '../../services/postsService';
import { Post } from '../../types/post';

interface UsePostsCarouselReturn {
  posts: Post[];
  currentPost: Post | undefined;
  currentPostIndex: number;
  isLoading: boolean;
  direction: number;
  setDirection: (dir: number) => void;
  setCurrentPostIndex: (index: number) => void;
  nextPost: () => void;
  prevPost: () => void;
}

export const usePostsCarousel = (autoRotateInterval: number = 5000): UsePostsCarouselReturn => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const data = await PostsService.getPublishedPosts(5);
      if (data.length > 0) {
        setPosts(data);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (posts.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentPostIndex((prev) => (prev + 1) % posts.length);
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [posts.length, autoRotateInterval]);

  const nextPost = () => {
    setDirection(1);
    setCurrentPostIndex((prev) => (prev + 1) % posts.length);
  };

  const prevPost = () => {
    setDirection(-1);
    setCurrentPostIndex((prev) => (prev - 1 + posts.length) % posts.length);
  };

  return {
    posts,
    currentPost: posts[currentPostIndex],
    currentPostIndex,
    isLoading,
    direction,
    setDirection,
    setCurrentPostIndex,
    nextPost,
    prevPost,
  };
};
