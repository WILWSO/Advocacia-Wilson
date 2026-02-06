import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Filter,
  Settings,
  X,
  Share2,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthLogin } from '../components/auth/useAuthLogin';
import { usePosts as usePostsPublicos } from '../hooks/data-access/usePosts';
import SEOHead from '../components/shared/SEOHead';
import { PostsService } from '../services/postsService';
import { SocialPostCard } from '../components/shared/cards/SocialPostCard';
import { useNotification } from '../components/shared/notifications/useNotification';
import { useSearchParams } from 'react-router-dom';
import type { Post } from '../types/post';

const SocialPublicPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthLogin();
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
      
      // ✅ SSoT: Usa PostsService en lugar de query directa
      await PostsService.updateLikes(postId, newLikes);
    } catch (err) {
      console.error('Error al actualizar likes:', err);
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
              onClick={() => fetchPosts()}
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
                  <SocialPostCard
                    post={post}
                    variant="public"
                    onLike={handleLike}
                    onComment={handleComment}
                    onShare={handleShare}
                    isLiked={post.id ? likedPosts.has(post.id) : false}
                    initialShowModal={post.id === selectedPostId}
                    onClick={() => setSelectedPostId(post.id || null)}
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