import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Heart, 
  MessageCircle,
  Play, 
  ExternalLink,
  FileText,
  Video,
  Image as ImageIcon,
  ArrowRight,
  Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface Post {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'video' | 'image' | 'announcement';
  imageUrl?: string;
  videoUrl?: string;
  tags: string[];
  author: string;
  createdAt: Date;
  published: boolean;
  likes: number;
  comments: number;
  featured: boolean;
}

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
  const getTypeIcon = (type: Post['type']) => {
    const icons = {
      article: <FileText size={16} />,
      video: <Video size={16} />,
      image: <ImageIcon size={16} />,
      announcement: <ExternalLink size={16} />
    };
    return icons[type];
  };

  const getTypeColor = (type: Post['type']) => {
    const colors = {
      article: 'bg-blue-100 text-blue-700 border-blue-200',
      video: 'bg-red-100 text-red-700 border-red-200',
      image: 'bg-green-100 text-green-700 border-green-200',
      announcement: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[type];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-neutral-200 group overflow-hidden",
        post.featured && "ring-2 ring-gold-200 border-gold-300",
        compact ? "p-3" : "p-0"
      )}
    >
      {/* Imagem/Vídeo de destaque */}
      {!compact && post.imageUrl && (
        <div className="aspect-video bg-neutral-100 overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      {!compact && post.videoUrl && (
        <div className="aspect-video bg-neutral-900 flex items-center justify-center relative group">
          <Play size={48} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}

      {/* Conteúdo */}
      <div className={cn(!compact && (post.imageUrl || post.videoUrl) && "p-4", compact && "")}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            {/* Badge do tipo e destaque */}
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
                getTypeColor(post.type)
              )}>
                {getTypeIcon(post.type)}
                {post.type === 'article' && 'Artigo'}
                {post.type === 'video' && 'Vídeo'}
                {post.type === 'image' && 'Imagem'}
                {post.type === 'announcement' && 'Anúncio'}
              </span>
              
              {post.featured && (
                <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-gold-100 to-gold-200 text-gold-800 text-xs font-medium rounded-full border border-gold-300">
                  ⭐ Destaque
                </span>
              )}
            </div>

            {/* Título */}
            <h3 className={cn(
              "font-semibold text-neutral-800 line-clamp-2 group-hover:text-primary-600 transition-colors",
              compact ? "text-sm" : "text-lg mb-2"
            )}>
              {compact ? truncateText(post.title, 60) : post.title}
            </h3>
          </div>

          {/* Data */}
          <div className={cn(
            "flex items-center text-neutral-500 ml-3",
            compact ? "text-xs" : "text-sm"
          )}>
            <Calendar size={compact ? 12 : 14} className="mr-1" />
            {formatDate(post.createdAt)}
          </div>
        </div>

        {/* Conteúdo */}
        <p className={cn(
          "text-neutral-600 mb-3",
          compact ? "text-xs line-clamp-2" : "text-sm line-clamp-3"
        )}>
          {compact ? truncateText(post.content, 100) : post.content}
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike?.(post.id)}
              className={cn(
                "flex items-center gap-1 text-sm transition-colors",
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
            
            <span className="flex items-center gap-1 text-neutral-500 text-sm">
              <MessageCircle size={compact ? 14 : 16} />
              {post.comments}
            </span>
          </div>

          {!compact && (
            <button className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
              Ler mais
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Autor */}
        <div className="mt-3 pt-3 border-t border-neutral-100">
          <p className={cn(
            "text-neutral-500 font-medium",
            compact ? "text-xs" : "text-sm"
          )}>
            Por {post.author}
          </p>
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
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Mock data - substituir por dados reais
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      
      // Simulando API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockPosts: Post[] = [
        {
          id: '1',
          title: 'Novas Mudanças no Código Civil 2024',
          content: 'Confira as principais alterações que entram em vigor este ano e como elas podem impactar seus direitos. Novas regras sobre contratos, propriedade e responsabilidade civil.',
          type: 'article',
          imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=450&fit=crop',
          tags: ['direito civil', 'legislação', '2024'],
          author: 'Dr. Wilson Santos',
          createdAt: new Date('2024-01-10'),
          published: true,
          likes: 45,
          comments: 12,
          featured: true
        },
        {
          id: '2',
          title: 'Direitos do Trabalhador em 2024',
          content: 'Webinar exclusivo sobre as principais mudanças na legislação trabalhista e como proteger seus direitos no ambiente de trabalho.',
          type: 'video',
          videoUrl: 'https://youtube.com/watch?v=example',
          imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=450&fit=crop',
          tags: ['direito trabalhista', 'webinar'],
          author: 'Dra. Maria Nascimento',
          createdAt: new Date('2024-01-05'),
          published: true,
          likes: 78,
          comments: 23,
          featured: false
        },
        {
          id: '3',
          title: 'Consultas Gratuitas em Janeiro',
          content: 'Durante todo o mês de janeiro, oferecemos consultas jurídicas gratuitas para novos clientes. Agende já a sua consulta!',
          type: 'announcement',
          imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=450&fit=crop',
          tags: ['consulta', 'promoção', 'gratuito'],
          author: 'Equipe Santos & Nascimento',
          createdAt: new Date('2024-01-01'),
          published: true,
          likes: 34,
          comments: 8,
          featured: true
        },
        {
          id: '4',
          title: 'Guia Completo: Como Agir em Acidentes de Trânsito',
          content: 'Passo a passo detalhado sobre o que fazer em caso de acidente de trânsito, documentos necessários e seus direitos.',
          type: 'article',
          imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=450&fit=crop',
          tags: ['trânsito', 'acidentes', 'direitos'],
          author: 'Dr. Carlos Silva',
          createdAt: new Date('2023-12-28'),
          published: true,
          likes: 67,
          comments: 15,
          featured: false
        }
      ];
      
      let filteredPosts = mockPosts.filter(post => post.published);
      
      if (showFeaturedOnly) {
        filteredPosts = filteredPosts.filter(post => post.featured);
      }
      
      filteredPosts = filteredPosts
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, maxPosts);
      
      setPosts(filteredPosts);
      setLoading(false);
    };

    fetchPosts();
  }, [maxPosts, showFeaturedOnly]);

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    // Atualizar contador de likes
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: likedPosts.has(postId) ? post.likes - 1 : post.likes + 1 
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
                  isLiked={likedPosts.has(post.id)}
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
            <Link
              to="/social"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              Ver mais conteúdos
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SocialFeed;