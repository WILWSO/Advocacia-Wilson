import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, Play, Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { getTypeIcon, getTypeColor, formatDate } from '../../../utils/postUtils';
import { getYouTubeEmbedUrl } from '../../../utils/youtubeUtils';
import { useSinglePostLike } from '../../../hooks/useLikes';
import { useComments } from '../../../hooks/useComments';
import type { Post, PostModalProps } from '../../../types/post';
import { useNotification } from '../notifications/NotificationContext';

/**
 * Modal reutilizable para mostrar el contenido completo de un post
 * Usado en SocialPublicPage, SocialPage y SocialFeed
 */
const PostModal: React.FC<PostModalProps> = ({ post, isOpen, onClose }) => {
  const { success, error } = useNotification();
  const { isLiked, likes, toggleLike } = useSinglePostLike(post.likes);
  const { 
    comentarios, 
    loadingComments, 
    submittingComment, 
    loadComments, 
    submitComment 
  } = useComments(post.id);
  
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');

  const handleShare = () => {
    const url = `${window.location.origin}/social?postId=${post.id}`;
    if (navigator.share) {
      navigator.share({
        title: post.titulo,
        text: post.conteudo.substring(0, 100) + '...',
        url: url
      }).catch(() => {
        navigator.clipboard.writeText(url);
        success('Link copiado para a área de transferência!');
      });
    } else {
      navigator.clipboard.writeText(url);
      success('Link copiado para a área de transferência!');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submitComment(commentAuthor, newComment);
    
    if (result.success) {
      setNewComment('');
      setCommentAuthor('');
      success('Comentário enviado! Será exibido após aprovação.');
    } else {
      error('Erro ao enviar comentário');
    }
  };

  // Cargar comentarios cuando se abre la sección
  useEffect(() => {
    if (showComments && comentarios.length === 0) {
      loadComments();
    }
  }, [showComments]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              {/* Header del modal */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white">
                <div className="flex items-center gap-3 flex-wrap">
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
                
                {/* Botones de interacción en el header */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleLike}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-full transition-all font-medium text-sm shadow-md",
                      isLiked 
                        ? "bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600" 
                        : "bg-white text-neutral-600 hover:bg-red-50 hover:text-red-600 border border-neutral-200"
                    )}
                    title="Curtir"
                  >
                    <Heart 
                      size={16} 
                      className={cn(
                        "transition-all",
                        isLiked && "fill-current"
                      )} 
                    />
                    <span className="font-semibold">{likes}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowComments(!showComments)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-full transition-all font-medium text-sm shadow-md",
                      showComments
                        ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white"
                        : "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700"
                    )}
                    title="Comentários"
                  >
                    <MessageCircle size={16} />
                    <span className="font-semibold">{post.comentarios}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    className="flex items-center gap-1.5 p-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
                    title="Compartilhar"
                  >
                    <Share2 size={16} />
                  </motion.button>

                  <button
                    onClick={onClose}
                    className="ml-2 p-2 hover:bg-neutral-200 rounded-full transition-colors"
                    aria-label="Fechar modal"
                  >
                    <X size={20} className="text-neutral-600" />
                  </button>
                </div>
              </div>

              {/* Contenido del modal con scroll */}
              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="p-6">
                  {/* Imagen/Video si existe */}
                  {post.image_url && post.tipo !== 'video' && (
                    <div className="aspect-video bg-neutral-100 overflow-hidden rounded-lg mb-6">
                      <img
                        src={post.image_url}
                        alt={post.titulo}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {post.tipo === 'video' && post.video_url && (
                    <div className="aspect-video bg-neutral-900 overflow-hidden rounded-lg mb-6">
                      {post.youtube_id || extractYouTubeId(post.video_url) ? (
                        <iframe
                          src={getYouTubeEmbedUrl(post.youtube_id || extractYouTubeId(post.video_url)!)}
                          title={post.titulo}
                          className="w-full h-full border-0"
                          allowFullScreen
                          loading="lazy"
                          sandbox="allow-scripts allow-same-origin allow-presentation"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center relative">
                          <Play size={48} className="text-white opacity-80" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <p className="absolute bottom-4 left-4 text-white text-sm opacity-80">
                            Vídeo não disponível
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Título */}
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
                    {post.titulo}
                  </h2>

                  {/* Contenido completo */}
                  <div className="prose prose-neutral max-w-none">
                    <p className="text-neutral-700 text-base leading-relaxed whitespace-pre-line">
                      {post.conteudo}
                    </p>
                  </div>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-neutral-200">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-sm rounded-md transition-colors cursor-pointer"
                        >
                          <Tag size={12} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Autor y fecha */}
                  <div className="mt-6 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-sm text-neutral-600">
                      <span className="font-medium">Por:</span>{' '}
                      {typeof post.autor === 'string' ? post.autor : post.autor.nome}
                    </p>
                    <div className="text-sm text-neutral-500 flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(post.data_publicacao || post.data_criacao, true)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Panel de comentarios flotante (overlay sobre el modal) */}
          <AnimatePresence>
            {showComments && (
              <>
                {/* Backdrop semi-transparente */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowComments(false)}
                  className="fixed inset-0 z-[60] bg-black bg-opacity-30"
                />

                {/* Panel de comentarios */}
                <motion.div
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 300 }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="fixed right-0 top-0 bottom-0 z-[70] w-full sm:w-[500px] bg-white shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header del panel */}
                  <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 flex items-center justify-between shadow-lg">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <MessageCircle size={24} />
                      Comentários
                    </h3>
                    <button
                      onClick={() => setShowComments(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Contenido scrolleable */}
                  <div className="overflow-y-auto h-[calc(100vh-80px)] p-6">
                    {/* Formulario para nuevo comentario */}
                    <form onSubmit={handleSubmitComment} className="mb-6 bg-neutral-50 rounded-lg p-4 sticky top-0 z-10">
                      <h4 className="font-semibold text-neutral-800 mb-3">Deixe seu comentário</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={commentAuthor}
                          onChange={(e) => setCommentAuthor(e.target.value)}
                          placeholder="Seu nome"
                          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                          required
                          maxLength={100}
                        />
                        <div className="relative">
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escreva seu comentário..."
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
                            rows={4}
                            required
                            maxLength={1000}
                          />
                          <span className="absolute bottom-2 right-2 text-xs text-neutral-400">
                            {newComment.length}/1000
                          </span>
                        </div>
                        <button
                          type="submit"
                          disabled={submittingComment || !newComment.trim() || !commentAuthor.trim()}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-md"
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
                    <div className="space-y-4">
                      <h4 className="font-semibold text-neutral-800 mb-3 flex items-center gap-2">
                        <span>{comentarios.length}</span>
                        {comentarios.length === 1 ? 'Comentário' : 'Comentários'}
                      </h4>
                      
                      {loadingComments ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="animate-spin rounded-full h-10 w-10 border-3 border-primary-500 border-t-transparent" />
                        </div>
                      ) : comentarios.length > 0 ? (
                        comentarios.map((comentario) => (
                          <motion.div
                            key={comentario.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-neutral-50 rounded-lg p-4 border border-neutral-200"
                          >
                            <div className="flex items-start gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                {comentario.autor_nome.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-neutral-800 text-sm">
                                  {comentario.autor_nome}
                                </p>
                                <p className="text-xs text-neutral-500">
                                  {formatDate(comentario.data_criacao, true)}
                                </p>
                                <p className="text-sm text-neutral-700 whitespace-pre-wrap mt-2">
                                  {comentario.comentario}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <MessageCircle size={48} className="mx-auto text-neutral-300 mb-3" />
                          <p className="text-neutral-500 italic">
                            Seja o primeiro a comentar!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default PostModal;
