import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Heart, 
  MessageCircle, 
  Share2, 
  Play, 
  ExternalLink,
  Tag,
  Search,
  Filter,
  X,
  Send,
  User,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../components/auth/authStore';
import { usePostsPublicos } from '../hooks/usePosts';
import { cn } from '../utils/cn';
import SEOHead from '../components/shared/SEOHead';
import PostModal from '../components/shared/modales/PostModal';
import { supabase } from '../lib/supabase';
import { useComments } from '../hooks/useComments';
import { formatDate, getTypeIcon, getTypeColor } from '../utils/postUtils';
import { extractYouTubeId, getYouTubeEmbedUrl } from '../utils/youtubeUtils';
import { useNotification } from '../components/shared/notifications/NotificationContext';
import { useSearchParams } from 'react-router-dom';
import type { Post, Comentario, PostType } from '../types/post';

const PostCard: React.FC<{ 
  post: Post; 
  onLike?: (id: string) => Promise<void>;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
  isLiked?: boolean;
  initialShowModal?: boolean;
}> = ({ post, onLike, onComment, onShare, isLiked = false, initialShowModal = false }) => {
  const [showModal, setShowModal] = useState(initialShowModal);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes);
  const [localComments, setLocalComments] = useState(post.comentarios);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  const MAX_CONTENT_LENGTH = 150; // Caracteres máximos para mostrar
  const MAX_TITLE_LENGTH = 60; // Caracteres máximos para el título

  // Abrir modal cuando initialShowModal cambia a true
  useEffect(() => {
    if (initialShowModal) {
      setShowModal(true);
    }
  }, [initialShowModal, post.id]);

  // Hook de comentarios (autoApprove true para página pública)
  const {
    comentarios,
    loadingComments,
    submittingComment,
    loadComments,
    submitComment
  } = useComments(post.id, true);

  // Sincronizar contador local con comentarios cargados
  useEffect(() => {
    if (comentarios.length > 0 && localComments !== comentarios.length) {
      setLocalComments(comentarios.length);
    }
  }, [comentarios.length, localComments]);

  // Crear nuevo comentario usando el hook
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentAuthor.trim()) return;

    const result = await submitComment(commentAuthor.trim(), newComment.trim());
    if (result.success) {
      setNewComment('');
      // El hook ya actualiza la lista local cuando autoApprove=true
      // Actualizar contador en la base de datos
      await supabase
        .from('posts_sociais')
        .update({ comentarios: comentarios.length })
        .eq('id', post.id);
    }
  };

  // Cargar comentarios cuando se abre la sección
  useEffect(() => {
    if (showComments && comentarios.length === 0) {
      loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showComments]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const shouldShowReadMore = post.conteudo.length > MAX_CONTENT_LENGTH;
  const displayContent = isExpanded 
    ? post.conteudo 
    : truncateText(post.conteudo, MAX_CONTENT_LENGTH);
  
  const displayTitle = truncateText(post.titulo, MAX_TITLE_LENGTH);

  return (
    <>
    <motion.article
      id={`post-${post.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => setShowModal(true)}
      className={cn(
        "bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-200 group overflow-hidden cursor-pointer",
        "h-auto md:h-[600px] flex flex-col", // Altura auto en móvil, fija en desktop
        post.destaque && "ring-2 ring-gold-200 border-gold-300"
      )}
    >
      {/* Imagen/Video de destaque */}
      {post.image_url && post.tipo !== 'video' && (
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

      {post.tipo === 'video' && post.video_url && (
        <div className="aspect-video bg-neutral-900 overflow-hidden">
          {post.youtube_id || extractYouTubeId(post.video_url) ? (
            <iframe
              src={getYouTubeEmbedUrl(post.youtube_id || extractYouTubeId(post.video_url)!)}
              title={post.titulo}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-presentation"
              onError={(e) => console.warn('Erro ao carregar vídeo:', e)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center relative group">
              <Play size={48} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white text-sm opacity-80">Vídeo não disponível</p>
            </div>
          )}
        </div>
      )}

      {/* Conteúdo - estrutura flex para altura uniforme */}
      <div className="p-4 sm:p-6 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div className="flex-1">
            {/* Badge do tipo e destaque */}
            <div className="flex items-center gap-2 mb-3">
              <span className={cn(
                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border",
                getTypeColor(post.tipo)
              )}>
                {getTypeIcon(post.tipo)}
                {post.tipo === 'article' && 'Artigo'}
                {post.tipo === 'video' && 'Vídeo'}
                {post.tipo === 'image' && 'Imagem'}
                {post.tipo === 'announcement' && 'Anúncio'}
              </span>
              
              {post.destaque && (
                <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-gold-100 to-gold-200 text-gold-800 text-xs font-medium rounded-full border border-gold-300">
                  ⭐ Destaque
                </span>
              )}
            </div>

            {/* Título */}
            <h2 className="text-xl font-bold text-neutral-800 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
              {displayTitle}
            </h2>
          </div>
        </div>

        {/* Conteúdo com altura flex-1 para ocupar espaço disponível */}
        <div className="flex-1 flex flex-col">
          <div className="text-neutral-600 mb-3 text-xs sm:text-sm leading-relaxed flex-1">
            {displayContent}
          </div>
          
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs rounded-md transition-colors cursor-pointer"
                >
                  <Tag size={10} className="mr-1" />
                  {tag}
                </span>
              ))}
              {post.tags.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 bg-neutral-50 text-neutral-500 text-xs rounded-md">
                  +{post.tags.length - 4} mais
                </span>
              )}
            </div>
          )}
        </div>

        {/* Sección de comentarios */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="px-4 sm:px-6 pb-4"
        >
          <div className="border-t border-neutral-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                <MessageCircle size={16} />
                Comentários ({localComments})
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComments(false);
                }}
                className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
                aria-label="Fechar comentários"
              >
                <X size={18} className="text-neutral-500" />
              </button>
            </div>

            {/* Formulário para novo comentário */}
            <form 
              onSubmit={(e) => {
                e.stopPropagation();
                handleSubmitComment(e);
              }} 
              className="mb-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-3">
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Seu nome"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  required
                  maxLength={100}
                />
                <div className="relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Escreva seu comentário..."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                    rows={3}
                    required
                    maxLength={1000}
                  />
                  <span className="absolute bottom-2 right-2 text-xs text-neutral-400">
                    {newComment.length}/1000
                  </span>
                </div>
                <button
                  type="submit"
                  onClick={(e) => e.stopPropagation()}
                  disabled={submittingComment || !newComment.trim() || !commentAuthor.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {submittingComment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Enviar comentário
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Lista de comentários */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {loadingComments ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
                </div>
              ) : comentarios.length > 0 ? (
                comentarios.map((comentario) => (
                  <motion.div
                    key={comentario.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-50 rounded-lg p-3 border border-neutral-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <User size={16} className="text-primary-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-neutral-800">
                            {comentario.autor_nome}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {new Intl.DateTimeFormat('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            }).format(new Date(comentario.data_criacao))}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-700 whitespace-pre-line break-words">
                          {comentario.comentario}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-neutral-500 italic text-center py-4">
                  Seja o primeiro a comentar!
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer - sempre na parte inferior */}
        <div className="mt-auto">
          {/* Footer com interações */}
          <div className="pt-4 border-t border-neutral-100 space-y-3">
            {/* Botones de interacción */}
            <div className="flex items-center justify-center sm:justify-start gap-6">
              <button
                onClick={async (e) => {
                  e.stopPropagation(); // Prevenir que abra el modal
                  if (onLike) {
                    await onLike(post.id);
                    setLocalLikes(prev => isLiked ? prev - 1 : prev + 1);
                  }
                }}
                className={cn(
                  "flex items-center gap-2 text-sm transition-all hover:scale-110",
                  isLiked 
                    ? "text-red-600 hover:text-red-700" 
                    : "text-neutral-500 hover:text-red-600"
                )}
              >
                <Heart 
                  size={18} 
                  className={cn(
                    "transition-all",
                    isLiked ? "fill-current" : ""
                  )} 
                />
                <span className="font-medium">{localLikes}</span>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevenir que abra el modal
                  setShowComments(!showComments);
                  onComment?.(post.id);
                }}
                className={cn(
                  "flex items-center gap-2 text-sm transition-colors hover:text-primary-600",
                  showComments ? "text-primary-600" : "text-neutral-500"
                )}
              >
                <MessageCircle size={18} />
                <span className="font-medium">{localComments}</span>
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevenir que abra el modal
                  onShare?.(post.id);
                }}
                className="flex items-center gap-2 text-neutral-500 hover:text-primary-600 text-sm transition-colors"
              >
                <Share2 size={18} />
                <span className="font-medium">Compartilhar</span>
              </button>
            </div>

            {/* Información de fecha y autor */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 text-xs text-neutral-500 pt-2 border-t border-neutral-100">
              <div className="flex items-center gap-1">
                <Calendar size={14} className="text-neutral-400" />
                <span>{formatDate(post.data_criacao)}</span>
              </div>
              <div className="flex items-center gap-1 text-neutral-600">
                <span className="font-medium">Por:</span>
                <span className="truncate max-w-[180px]">
                  {typeof post.autor === 'string' ? post.autor : post.autor.nome}
                </span>
              </div>
            </div>
          </div>
      </div> {/* Fim do footer mt-auto */}
    </div> {/* Fim do container p-6 flex flex-col flex-1 */}
    
    </motion.article>

    {/* Modal usando componente reutilizable */}
    <PostModal 
      post={post}
      isOpen={showModal}
      onClose={() => setShowModal(false)}
    />
    </>
  );
};

const SocialPublicPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { posts, loading, error, fetchPosts } = usePostsPublicos();
  const { success } = useNotification();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | Post['tipo']>('all');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareTitle, setShareTitle] = useState('');
  const [searchParams] = useSearchParams();
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Detectar postId en URL y abrir modal automáticamente
  useEffect(() => {
    const postIdFromUrl = searchParams.get('postId');
    
    if (postIdFromUrl && posts.length > 0) {
      const postExists = posts.find(p => p.id === postIdFromUrl);
      
      if (postExists) {
        setSelectedPostId(postIdFromUrl);
        
        // Scroll al post después de un pequeño delay
        setTimeout(() => {
          const element = document.getElementById(`post-${postIdFromUrl}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    }
  }, [searchParams, posts]);

  // Los posts ya vienen filtrados (solo publicados) del hook usePostsPublicos

  const handleLike = async (postId: string) => {
    const isCurrentlyLiked = likedPosts.has(postId);
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Optimistic update
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    // Update in database
    try {
      const newLikes = isCurrentlyLiked ? post.likes - 1 : post.likes + 1;
      const { error } = await supabase
        .from('posts_sociais')
        .update({ likes: Math.max(0, newLikes) })
        .eq('id', postId);
      
      if (error) {
        console.error('Error al actualizar likes:', error);
        // Revert optimistic update on error
        setLikedPosts(prev => {
          const newSet = new Set(prev);
          if (isCurrentlyLiked) {
            newSet.add(postId);
          } else {
            newSet.delete(postId);
          }
          return newSet;
        });
      }
    } catch (err) {
      console.error('Error al actualizar likes:', err);
    }
  };

  const handleComment = () => {
    // La funcionalidad de expandir comentarios se maneja en el PostCard
  };

  const handleShare = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const url = `${window.location.origin}/social#post-${postId}`;
    setShareUrl(url);
    setShareTitle(post.titulo);

    // Try native share API first
    if (navigator.share) {
      navigator.share({
        title: post.titulo,
        text: post.conteudo.substring(0, 100) + '...',
        url: url
      }).catch(() => {
        setShareModalOpen(true);
      });
    } else {
      setShareModalOpen(true);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      success('Link copiado para a área de transferência!');
      setShareModalOpen(false);
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.conteudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || post.tipo === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <SEOHead
        title="Social - Responsabilidade Social e Conteúdos Jurídicos"
        description="Acompanhe as últimas notícias, artigos e vídeos sobre direito. Mantenha-se informado com conteúdo jurídico de qualidade do escritório Santos & Nascimento."
        keywords="noticias juridicas, artigos direito, videos juridicos, atualizacoes legislacao, Santos Nascimento advogados"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 text-white">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
            >
              Responsabilidade Social e Conteúdos Jurídicos
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg text-primary-100 max-w-2xl mx-auto px-4"
            >
              Mantenha-se informado com nossos artigos, vídeos e atualizações sobre o mundo jurídico
            </motion.p>
            
            {isAuthenticated && user?.role === 'admin' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6"
              >
                <Link
                  to="/admin-social"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold-600 hover:bg-gold-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Settings size={20} />
                  Administrar Conteúdo
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar conteúdos..."
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-3">
              <div className="relative">
                <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | Post['tipo'])}
                  className="pl-10 pr-8 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="article">Artigos</option>
                  <option value="video">Vídeos</option>
                  <option value="image">Imagens</option>
                  <option value="announcement">Anúncios</option>
                </select>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200 text-sm text-neutral-600">
            <span>
              {loading ? 'Carregando...' : `${filteredPosts.length} conteúdo${filteredPosts.length !== 1 ? 's' : ''} encontrado${filteredPosts.length !== 1 ? 's' : ''}`}
            </span>
            {/* Debug info */}
            {!loading && (
              <span className="text-xs text-neutral-400">
                Total: {posts.length} | Filtrado: {filteredPosts.length}
              </span>
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-primary-600 hover:text-primary-700"
              >
                Limpar busca
              </button>
            )}
          </div>
        </div>

        {/* Lista de Posts */}
        {error ? (
          <div className="text-center py-16">
            <div className="text-red-400 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-red-600 mb-2">
              Erro ao carregar conteúdos
            </h3>
            <p className="text-neutral-500 mb-4">
              {error}
            </p>
            <button
              onClick={fetchPosts}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
                <div className="aspect-video bg-neutral-200 animate-pulse" />
                <div className="p-6">
                  <div className="h-6 bg-neutral-200 rounded w-3/4 mb-4 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-neutral-200 rounded animate-pulse" />
                    <div className="h-4 bg-neutral-200 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-neutral-200 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PostCard
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                    isLiked={likedPosts.has(post.id)}
                    initialShowModal={post.id === selectedPostId}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-neutral-400 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-neutral-600 mb-2">
              Nenhum conteúdo encontrado
            </h3>
            <p className="text-neutral-500">
              Tente ajustar os filtros de busca ou aguarde novos conteúdos.
            </p>
          </div>
        )}
      </div>

      {/* Modal de compartir */}
      <AnimatePresence>
        {shareModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={() => setShareModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-neutral-800">Compartilhar</h3>
                <button
                  onClick={() => setShareModalOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-neutral-600 mb-4">{shareTitle}</p>

              <div className="space-y-3">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareTitle + ' - ' + shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    <Share2 size={20} />
                  </div>
                  <span className="font-medium text-green-700">Compartilhar no WhatsApp</span>
                </a>

                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    <Share2 size={20} />
                  </div>
                  <span className="font-medium text-blue-700">Compartilhar no Facebook</span>
                </a>

                {/* Twitter/X */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold">
                    <Share2 size={20} />
                  </div>
                  <span className="font-medium text-sky-700">Compartilhar no X (Twitter)</span>
                </a>

                {/* Copiar link */}
                <button
                  onClick={() => copyToClipboard(shareUrl)}
                  className="w-full flex items-center gap-3 p-3 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-neutral-600 rounded-full flex items-center justify-center text-white">
                    <ExternalLink size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-neutral-700 block">Copiar link</span>
                    <span className="text-xs text-neutral-500 truncate block">{shareUrl}</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SocialPublicPage;