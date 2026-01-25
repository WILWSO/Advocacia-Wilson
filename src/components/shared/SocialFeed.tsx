import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Heart, 
  MessageCircle,
  Play, 
  ArrowRight,
  Tag,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { supabase } from '../../lib/supabase';
import { getTypeIcon, getTypeColor, formatDate, truncateText } from '../../utils/postUtils';
import { useMultiplePostsLike } from '../../hooks/useLikes';
import type { Post } from '../../types/post';

interface SocialFeedProps {
  maxPosts?: number;
  showFeaturedOnly?: boolean;
  showTitle?: boolean;
  compact?: boolean;
}

const PostPreview: React.FC<{ 
  post: Post; 
  compact?: boolean; 
  onLike?: (id: string) => void;
  isLiked?: boolean;
}> = ({ post, compact = false, onLike, isLiked = false }) => {
  const navigate = useNavigate();

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/social?postId=${post.id}`)}
      className={cn(
        "bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-neutral-200 group overflow-hidden cursor-pointer",
        post.destaque && "ring-2 ring-gold-200 border-gold-300",
        compact ? "p-3" : "p-0"
      )}
    >
      {/* Imagem/Vídeo de destaque */}
      {!compact && post.image_url && (
        <div className="aspect-video bg-neutral-100 overflow-hidden">
          <img
            src={post.image_url}
            alt={post.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      {!compact && post.video_url && (
        <div className="aspect-video bg-neutral-900 flex items-center justify-center relative group">
          <Play size={48} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Conteúdo */}
      <div className={cn(
        !compact && (post.image_url || post.video_url) && "p-3 sm:p-4",
        compact && "p-2"
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex-1">
            {/* Badge do tipo e destaque */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 flex-wrap">
              <span className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                getTypeColor(post.tipo)
              )}>
                {getTypeIcon(post.tipo)}
                <span className="hidden sm:inline">
                  {post.tipo === 'article' && 'Artigo'}
                  {post.tipo === 'video' && 'Vídeo'}
                  {post.tipo === 'image' && 'Imagem'}
                  {post.tipo === 'announcement' && 'Anúncio'}
                </span>
              </span>
              
              {post.destaque && (
                <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-gold-100 to-gold-200 text-gold-800 text-xs font-medium rounded-full border border-gold-300">
                  ⭐ <span className="hidden sm:inline ml-1">Destaque</span>
                </span>
              )}
            </div>

            {/* Título */}
            <h3 className={cn(
              "font-semibold text-neutral-800 line-clamp-2 group-hover:text-primary-600 transition-colors",
              compact ? "text-sm sm:text-base" : "text-base sm:text-lg md:text-xl mb-1 sm:mb-2"
            )}>
              {compact ? truncateText(post.titulo, 60) : post.titulo}
            </h3>
          </div>

          {/* Data */}
          <div className={cn(
            "flex items-center text-neutral-500 ml-2 sm:ml-3 flex-shrink-0",
            compact ? "text-xs" : "text-xs sm:text-sm"
          )}>
            <Calendar size={compact ? 12 : 14} className="mr-1" />
            <span className="hidden sm:inline">{formatDate(post.data_criacao)}</span>
            <span className="sm:hidden">{new Date(post.data_criacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
          </div>
        </div>

        {/* Conteúdo */}
        <p className={cn(
          "text-neutral-600 mb-2 sm:mb-3",
          compact ? "text-xs sm:text-sm line-clamp-2" : "text-sm sm:text-base line-clamp-2 sm:line-clamp-3"
        )}>
          {compact ? truncateText(post.conteudo, 100) : post.conteudo}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {(compact ? post.tags.slice(0, 2) : post.tags).map((tag, index) => (
              <span
                key={index}
                className={cn(
                  "inline-flex items-center px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md",
                  compact ? "text-xs" : "text-xs"
                )}
              >
                <Tag size={compact ? 8 : 10} className="mr-1" />
                {tag}
              </span>
            ))}
            {compact && post.tags.length > 2 && (
              <span className="text-xs text-neutral-500">
                +{post.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Footer com interações */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onLike?.(post.id);
              }}
              className={cn(
                "flex items-center gap-1 text-xs sm:text-sm transition-colors",
                isLiked 
                  ? "text-red-600 hover:text-red-700" 
                  : "text-neutral-500 hover:text-red-600"
              )}
            >
              <Heart 
                size={compact ? 14 : 16} 
                className={isLiked ? "fill-current" : ""} 
              />
              {post.likes}
            </button>
            
            <span className="flex items-center gap-1 text-neutral-500 text-xs sm:text-sm">
              <MessageCircle size={compact ? 14 : 16} />
              {post.comentarios}
            </span>
          </div>
          
          <span className={cn(
            "text-neutral-500 font-medium truncate ml-2",
            compact ? "text-xs" : "text-xs sm:text-sm"
          )}>
            {typeof post.autor === 'string' ? post.autor.split(' ')[0] : post.autor.nome.split(' ')[0]}
          </span>
        </div>
      </div>
    </motion.article>
  );
};

const SocialFeed: React.FC<SocialFeedProps> = ({
  maxPosts = 6,
  showFeaturedOnly = false,
  showTitle = true,
  compact = false
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { likedPosts, toggleLike, isLiked } = useMultiplePostsLike();
  const [loading, setLoading] = useState(true);

  // Carregar posts reais de Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('posts_sociais')
          .select('*')
          .eq('publicado', true)
          .order('data_criacao', { ascending: false })
          .limit(maxPosts);

        if (error) throw error;

        const formattedPosts: Post[] = (data || []).map(post => ({
          id: post.id,
          titulo: post.titulo,
          conteudo: post.conteudo,
          tipo: post.tipo as Post['tipo'],
          image_url: post.image_url,
          video_url: post.video_url,
          youtube_id: post.youtube_id,
          tags: post.tags || [],
          autor: post.autor || 'Santos & Nascimento',
          data_criacao: post.data_criacao,
          data_publicacao: post.data_publicacao,
          destaque: post.destaque || false,
          likes: post.likes || 0,
          comentarios: post.comentarios || 0
        }));

        let filteredPosts = formattedPosts;
        
        if (showFeaturedOnly) {
          filteredPosts = filteredPosts.filter(post => post.destaque);
        }

        setPosts(filteredPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [maxPosts, showFeaturedOnly]);

  const handleLike = (postId: string) => {
    toggleLike(postId);

    // Actualizar contador de likes en el estado local
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: isLiked(postId) ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {showTitle && (
            <div className="text-center mb-12">
              <div className="h-8 bg-neutral-200 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
              <div className="h-4 bg-neutral-200 rounded w-96 mx-auto animate-pulse" />
            </div>
          )}
          
          <div className={cn(
            "grid gap-6",
            compact 
              ? "grid-cols-1 md:grid-cols-2" 
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}>
            {Array.from({ length: maxPosts }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border border-neutral-200 overflow-hidden">
                <div className="aspect-video bg-neutral-200 animate-pulse" />
                <div className="p-4">
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3 bg-neutral-200 rounded animate-pulse" />
                    <div className="h-3 bg-neutral-200 rounded w-5/6 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-neutral-400 mb-4">
            <FileText size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-600 mb-2">
            Nenhum conteúdo disponível
          </h3>
          <p className="text-neutral-500">
            Novos conteúdos serão publicados em breve.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
              {showFeaturedOnly ? 'Destaques' : 'Últimas Notícias'}
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              {showFeaturedOnly 
                ? 'Conteúdos em destaque selecionados especialmente para você'
                : 'Mantenha-se informado com nossos artigos, vídeos e atualizações jurídicas'}
            </p>
          </motion.div>
        )}

        <div className={cn(
          "grid gap-6",
          compact 
            ? "grid-cols-1 md:grid-cols-2" 
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        )}>
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostPreview
                  post={post}
                  compact={compact}
                  onLike={handleLike}
                  isLiked={isLiked(post.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!compact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <button
              onClick={() => navigate('/social')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              Ver mais conteúdos
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SocialFeed;