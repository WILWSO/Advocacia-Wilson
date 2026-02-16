import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, 
  Trash2, 
  Heart, 
  MessageCircle, 
  Share2, 
  Play, 
  Calendar,
  Tag,
  Star,
  FileEdit,
  X,
  Send,
  User
} from 'lucide-react';
import { cn } from '../../../utils/cn';
import { getTypeIcon, getTypeColor, truncateText } from '../../../utils/postUtils';
import { formatDateTimeLong } from '../../../utils/dateUtils';
import { extractYouTubeId, getYouTubeEmbedUrl } from '../../../utils/youtubeUtils';
import { EXTERNAL_COMPONENT_CLASSES } from '../../../config/theme';
import { useComments } from '../../../hooks/data-access/useComments';
import { PostsService } from '../../../services/postsService';
import type { Post } from '../../../types/post';

/**
 * Props del componente SocialPostCard
 * Incluye validación de permisos por ownership
 */
export interface SocialPostCardProps {
  post: Post;
  variant: 'admin' | 'public';
  
  // Admin variant props
  onEdit?: (post: Post) => void;
  onDelete?: (id: string) => void;
  canEdit?: boolean;   // Control de permisos para editar
  canDelete?: boolean; // Control de permisos para eliminar
  
  // Public variant props
  onLike?: (id: string) => Promise<void>;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
  isLiked?: boolean;
  initialShowModal?: boolean;
  onClick?: () => void;
}

/**
 * SocialPostCard - Componente unificado para visualización de posts sociales
 * Soporta dos variantes: admin (gestión) y public (interacción pública)
 * 
 * Este componente centraliza la lógica de renderizado de posts que antes
 * estaba duplicada en SocialPage.tsx y SocialPublicPage.tsx (SSoT)
 */
export const SocialPostCard: React.FC<SocialPostCardProps> = ({
  post,
  variant,
  onEdit,
  onDelete,
  canEdit = true,   // Por defecto true para retrocompatibilidad
  canDelete = true, // Por defecto true para retrocompatibilidad
  onLike,
  onComment,
  onShare,
  isLiked = false,
  initialShowModal = false,
  onClick
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes);
  const [localComments, setLocalComments] = useState(post.comentarios);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  const MAX_CONTENT_LENGTH = 150;
  const MAX_TITLE_LENGTH = 60;

  // Abrir modal automáticamente si initialShowModal es true
  useEffect(() => {
    if (initialShowModal) {
      setShowModal(true);
    }
  }, [initialShowModal]);

  // Hook de comentarios (solo para variant public)
  const {
    comentarios,
    loadingComments,
    submittingComment,
    loadComments,
    submitComment
  } = useComments(post.id || '', variant === 'public');

  // Sincronizar contador de comentarios
  useEffect(() => {
    if (variant === 'public' && comentarios.length > 0 && localComments !== comentarios.length) {
      setLocalComments(comentarios.length);
    }
  }, [comentarios.length, localComments, variant]);

  // Cargar comentarios al abrir sección
  useEffect(() => {
    if (variant === 'public' && showComments && comentarios.length === 0) {
      loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showComments, variant]);

  // Handler para submit de comentarios
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentAuthor.trim()) return;

    const result = await submitComment(commentAuthor.trim(), newComment.trim());
    if (result.success) {
      setNewComment('');
      await PostsService.updateComments(post.id!, comentarios.length);
    }
  };

  // Preparar contenido truncado (solo para public)
  const displayContent = variant === 'public' 
    ? truncateText(post.conteudo, MAX_CONTENT_LENGTH)
    : post.conteudo;
  
  const displayTitle = variant === 'public'
    ? truncateText(post.titulo, MAX_TITLE_LENGTH)
    : post.titulo;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => {
        if (variant === 'public') {
          setShowModal(true);
        }
        onClick?.();
      }}
      className={cn(
        "bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border overflow-hidden",
        post.destaque && "ring-2 ring-gold-200 border-gold-300",
        variant === 'admin' && [
          post.destaque ? 'border-gold-300 ring-2 ring-gold-100' : 'border-neutral-200',
          !post.publicado && 'opacity-60'
        ],
        variant === 'public' && [
          "border-neutral-200 group cursor-pointer",
          "h-auto md:h-[600px] flex flex-col"
        ]
      )}
    >
      {/* Header do Card - Solo para admin */}
      {variant === 'admin' && (
        <div className="p-4 border-b border-neutral-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                  getTypeColor(post.tipo)
                )}>
                  {getTypeIcon(post.tipo)}
                  {post.tipo === 'article' && 'Artigo'}
                  {post.tipo === 'video' && 'Vídeo'}
                  {post.tipo === 'image' && 'Imagem'}
                  {post.tipo === 'announcement' && 'Anúncio'}
                </span>
                
                {post.destaque && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-gold-100 text-gold-800 text-xs font-medium rounded-full">
                    <Star size={12} className="fill-current" />
                    Destaque
                  </span>
                )}
                
                {!post.publicado && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-full">
                    <FileEdit size={12} />
                    Rascunho
                  </span>
                )}
              </div>
              
              <h3 className="font-semibold text-neutral-800 line-clamp-2">
                {displayTitle}
              </h3>
            </div>
            
            <div className="flex items-center gap-1 ml-2">
              {canEdit && (
                <button
                  onClick={() => onEdit?.(post)}
                  className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                  title="Editar"
                >
                  <Edit3 size={14} />
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => onDelete?.(post.id || '')}
                  className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Excluir"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview de imagen */}
      {post.image_url && post.tipo !== 'video' && (
        <div className={cn(
          "aspect-video bg-neutral-100 overflow-hidden",
          variant === 'public' && "group-hover:scale-[1.02] transition-transform duration-300"
        )}>
          <img
            src={post.image_url}
            alt={post.titulo}
            className={cn(
              "w-full h-full object-cover",
              variant === 'public' && "group-hover:scale-105 transition-transform duration-300"
            )}
            loading={variant === 'public' ? 'lazy' : undefined}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Preview de video */}
      {post.tipo === 'video' && post.video_url && (
        <div className="aspect-video bg-neutral-900 overflow-hidden">
          {variant === 'admin' && post.youtube_id ? (
            // Admin: Thumbnail con botón play
            <div className="relative group cursor-pointer w-full h-full">
              <img 
                src={`https://img.youtube.com/vi/${post.youtube_id}/maxresdefault.jpg`}
                alt={post.titulo}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://img.youtube.com/vi/${post.youtube_id}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all group-hover:scale-110", EXTERNAL_COMPONENT_CLASSES.youtubeButton)}>
                  <Play size={28} className="text-white ml-1" fill="white" />
                </div>
              </div>
            </div>
          ) : variant === 'public' && (post.youtube_id || extractYouTubeId(post.video_url)) ? (
            // Public: iframe embebido
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
            // Fallback
            <div className="w-full h-full flex items-center justify-center relative group">
              <Play size={48} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <p className="absolute bottom-4 left-4 text-white text-sm opacity-80">Vídeo não disponível</p>
            </div>
          )}
        </div>
      )}

      {/* Contenido */}
      <div className={cn(
        variant === 'admin' && "p-4",
        variant === 'public' && "p-4 sm:p-6 flex flex-col flex-1"
      )}>
        {/* Header para public variant */}
        {variant === 'public' && (
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex-1">
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

              <h2 className="text-xl font-bold text-neutral-800 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                {displayTitle}
              </h2>
            </div>
          </div>
        )}

        {/* Contenido del post */}
        <div className={cn(
          variant === 'public' && "flex-1 flex flex-col"
        )}>
          <p className={cn(
            "text-neutral-600 mb-3",
            variant === 'admin' ? "text-sm line-clamp-3" : "text-xs sm:text-sm leading-relaxed flex-1"
          )}>
            {displayContent}
          </p>
          
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
              {(variant === 'admin' ? post.tags : post.tags.slice(0, 4)).map((tag, index) => (
                <span
                  key={index}
                  className={cn(
                    "inline-flex items-center px-2 py-1 text-xs rounded",
                    variant === 'admin' 
                      ? "bg-neutral-100 text-neutral-600"
                      : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-md transition-colors cursor-pointer"
                  )}
                >
                  <Tag size={10} className="mr-1" />
                  {tag}
                </span>
              ))}
              {variant === 'public' && post.tags.length > 4 && (
                <span className="inline-flex items-center px-2 py-1 bg-neutral-50 text-neutral-500 text-xs rounded-md">
                  +{post.tags.length - 4} mais
                </span>
              )}
            </div>
          )}
        </div>

        {/* Sección de comentarios - Solo public */}
        {variant === 'public' && showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="border-t border-neutral-200 pt-4 mb-4"
          >
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

            {/* Formulário de comentário */}
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
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

            {/* Lista de comentarios */}
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
          </motion.div>
        )}

        {/* Footer con estadísticas - Admin */}
        {variant === 'admin' && (
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Heart size={12} />
                {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={12} />
                {post.comentarios}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDateTimeLong(post.data_criacao || new Date().toISOString())}
            </div>
          </div>
        )}

        {/* Footer con interacciones - Public */}
        {variant === 'public' && (
          <div className="mt-auto">
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              {/* Botones de interacción */}
              <div className="flex items-center justify-center sm:justify-start gap-6">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (onLike && post.id) {
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
                    e.stopPropagation();
                    setShowComments(!showComments);
                    if (post.id) onComment?.(post.id);
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
                    e.stopPropagation();
                    if (post.id) onShare?.(post.id);
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
                  <span>{formatDateTimeLong(post.data_criacao || new Date().toISOString())}</span>
                </div>
                <div className="flex items-center gap-1 text-neutral-600">
                  <span className="font-medium">Por:</span>
                  <span className="truncate max-w-[180px]">
                    {typeof post.autor === 'string' ? post.autor : post.autor.nome}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalle completo - Solo para variant public */}
      {variant === 'public' && (
        <AnimatePresence>
          {showModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />

              {/* Modal Container */}
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
                >
                  {/* Header del Modal */}
                  <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white">
                    <div className="flex items-center gap-3 flex-wrap flex-1">
                      <span className={cn(
                        "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border",
                        getTypeColor(post.tipo)
                      )}>
                        {getTypeIcon(post.tipo)}
                        {post.tipo === 'article' && 'Artigo'}
                        {post.tipo === 'video' && 'Vídeo'}
                        {post.tipo === 'image' && 'Imagem'}
                        {post.tipo === 'announcement' && 'Anúncio'}
                      </span>
                      {post.destaque && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-gold-100 to-gold-200 text-gold-800 text-xs font-medium rounded-full border border-gold-300">
                          ⭐ Destaque
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                      aria-label="Cerrar modal"
                    >
                      <X size={20} className="text-neutral-600" />
                    </button>
                  </div>

                  {/* Contenido del Modal */}
                  <div className="p-6">
                    {/* Título */}
                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-4 leading-tight">
                      {post.titulo}
                    </h2>

                    {/* Imagen/Video */}
                    {post.image_url && post.tipo !== 'video' && (
                      <div className="mb-6 rounded-xl overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.titulo}
                          className="w-full h-auto"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {post.tipo === 'video' && post.video_url && (post.youtube_id || extractYouTubeId(post.video_url)) && (
                      <div className="mb-6 aspect-video rounded-xl overflow-hidden">
                        <iframe
                          src={getYouTubeEmbedUrl(post.youtube_id || extractYouTubeId(post.video_url)!)}
                          title={post.titulo}
                          className="w-full h-full border-0"
                          allowFullScreen
                          sandbox="allow-scripts allow-same-origin allow-presentation"
                        />
                      </div>
                    )}

                    {/* Contenido completo */}
                    <div className="prose prose-neutral max-w-none mb-6">
                      <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                        {post.conteudo}
                      </p>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm rounded-lg transition-colors"
                          >
                            <Tag size={14} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 mb-6 pb-6 border-b border-neutral-200">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-neutral-400" />
                        <span>{formatDateTimeLong(post.data_criacao || new Date().toISOString())}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-neutral-400" />
                        <span className="font-medium">
                          {typeof post.autor === 'string' ? post.autor : post.autor.nome}
                        </span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (post.id && onLike) {
                            await onLike(post.id);
                            setLocalLikes(prev => isLiked ? prev - 1 : prev + 1);
                          }
                        }}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                          isLiked
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        )}
                      >
                        <Heart size={18} className={isLiked ? "fill-current" : ""} />
                        <span>{localLikes}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowComments(!showComments);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 rounded-lg font-medium transition-colors"
                      >
                        <MessageCircle size={18} />
                        <span>{localComments}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (post.id && onShare) {
                            onShare(post.id);
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 rounded-lg font-medium transition-colors"
                      >
                        <Share2 size={18} />
                        <span>Compartir</span>
                      </button>
                    </div>

                    {/* Sección de Comentarios */}
                    {showComments && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-neutral-200 pt-6"
                      >
                        <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                          Comentários ({localComments})
                        </h3>

                        {/* Formulario de nuevo comentario */}
                        <form onSubmit={handleSubmitComment} className="mb-6">
                          <div className="space-y-3">
                            <input
                              type="text"
                              placeholder="Seu nome"
                              value={commentAuthor}
                              onChange={(e) => setCommentAuthor(e.target.value)}
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              required
                            />
                            <textarea
                              placeholder="Escreva seu comentário..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              rows={3}
                              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                              required
                            />
                            <button
                              type="submit"
                              disabled={submittingComment}
                              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white rounded-lg font-medium transition-colors"
                            >
                              <Send size={16} />
                              {submittingComment ? 'Enviando...' : 'Enviar'}
                            </button>
                          </div>
                        </form>

                        {/* Lista de comentarios */}
                        {loadingComments ? (
                          <div className="text-center py-8 text-neutral-500">
                            Carregando comentários...
                          </div>
                        ) : comentarios.length > 0 ? (
                          <div className="space-y-4">
                            {comentarios.map((comentario) => (
                              <div key={comentario.id} className="bg-neutral-50 rounded-lg p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                      <User size={16} className="text-primary-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-neutral-800">
                                        {comentario.autor_nome}
                                      </p>
                                      <p className="text-xs text-neutral-500">
                                        {formatDateTimeLong(comentario.data_criacao)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-neutral-700 leading-relaxed ml-10">
                                  {comentario.comentario}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-neutral-500">
                            Nenhum comentário ainda. Seja o primeiro!
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default SocialPostCard;
