import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Calendar,
  Search,
  Tag,
  Heart,
  MessageCircle,
  Play,
  ExternalLink,
  Star,
  FileEdit
} from 'lucide-react';
import { useAuthStore } from '../components/auth/authStore';
import { cn } from '../utils/cn';
import { formatDate, getTypeIcon, getTypeColor } from '../utils/postUtils';
import { ResponsiveContainer } from '../components/shared/ResponsiveGrid';
import { usePostForm } from '../hooks/usePostForm';
import { usePostFilters } from '../hooks/usePostFilters';
import AccessibleButton from '../components/shared/buttons/AccessibleButton';
import CreatePostModal from '../components/admin/CreatePostModal';
import type { Post } from '../types/post';

const PostCard: React.FC<{ 
  post: Post; 
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
}> = ({ post, onEdit, onDelete }) => {

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border h-full flex flex-col",
        post.destaque ? 'border-gold-300 ring-2 ring-gold-100' : 'border-neutral-200',
        !post.publicado && 'opacity-60'
      )}
    >
      {/* Header do Card */}
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
              {post.titulo}
            </h3>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => onEdit(post)}
              className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
              title="Editar"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={() => onDelete(post.id || '')}
              className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Excluir"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Preview da mídia */}
      {post.image_url && (
        <div className="aspect-video bg-neutral-100">
          <img
            src={post.image_url}
            alt={post.titulo}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      {post.video_url && post.youtube_id && (
        <div className="aspect-video bg-neutral-900 overflow-hidden relative group cursor-pointer">
          <img 
            src={`https://img.youtube.com/vi/${post.youtube_id}/maxresdefault.jpg`}
            alt={post.titulo}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback a thumbnail de menor calidad si maxres no existe
              const target = e.target as HTMLImageElement;
              target.src = `https://img.youtube.com/vi/${post.youtube_id}/hqdefault.jpg`;
            }}
          />
          {/* Botón play superpuesto */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
            <div className="w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-700 flex items-center justify-center shadow-2xl transition-all group-hover:scale-110">
              <Play size={28} className="text-white ml-1" fill="white" />
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo */}
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-neutral-600 text-sm line-clamp-3 mb-3 flex-1">
          {post.conteudo}
        </p>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded"
              >
                <Tag size={10} className="mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Estatísticas e data */}
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
            {formatDate(post.data_criacao || new Date().toISOString())}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AdminSocialPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const postForm = usePostForm();
  const filters = usePostFilters(postForm.posts);

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h1 className="text-2xl font-bold text-neutral-800 mb-4">Acesso Restrito</h1>
          <p className="text-neutral-600 mb-4">
            Você precisa estar logado como administrador para acessar esta área.
          </p>
          <Link
            to="/social"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            Ver conteúdos públicos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="bg-neutral-50 min-h-full">
      {/* Header da página */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <ResponsiveContainer maxWidth="7xl" className="p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-primary-900 mb-2">Administração Social</h1>
                <p className="text-gray-600">
                  Gerencie notícias, vídeos e conteúdos importantes
                </p>
              </div>
              
              <div className="flex gap-3">

                {/* Botão de Novo Conteúdo */}
                {(
                <AccessibleButton
                  category="create"
                  onClick={() => postForm.handleOpenCreateModal()}
                  aria-label="Criar novo conteúdo"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Novo Conteúdo
                </AccessibleButton>
              )}
                            
              </div>
            </div>
          </ResponsiveContainer>
        </div>

        {/* Estadísticas */}
        <ResponsiveContainer maxWidth="7xl" className="py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total</p>
                  <p className="text-2xl font-bold text-neutral-900">{filters.stats.total}</p>
                </div>
                <FileText className="text-primary-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Publicados</p>
                  <p className="text-2xl font-bold text-green-600">{filters.stats.publicados}</p>
                </div>
                <Star className="text-green-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Rascunhos</p>
                  <p className="text-2xl font-bold text-neutral-600">{filters.stats.rascunhos}</p>
                </div>
                <FileEdit className="text-neutral-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Destaque</p>
                  <p className="text-2xl font-bold text-gold-600">{filters.stats.destaque}</p>
                </div>
                <Star className="text-gold-500 fill-current" size={24} />
              </div>
            </div>
          </div>

        {/* Filtros e Busca */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={filters.searchTerm}
                    onChange={(e) => filters.setSearchTerm(e.target.value)}
                    placeholder="Buscar conteúdos..."
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filtros */}
              <div className="flex gap-3">
                <select
                  value={filters.filterType}
                  onChange={(e) => filters.setFilterType(e.target.value as Post['tipo'] | 'all')}
                  className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="article">Artigos</option>
                  <option value="video">Vídeos</option>
                  <option value="image">Imagens</option>
                  <option value="announcement">Anúncios</option>
                </select>

                <select
                  value={filters.filterStatus}
                  onChange={(e) => filters.setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
                  className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">Todos os status</option>
                  <option value="published">Publicados</option>
                  <option value="draft">Rascunhos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de Posts */}
          {postForm.loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-500 hover:bg-primary-400 transition ease-in-out duration-150 cursor-not-allowed">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Carregando conteúdos...
              </div>
            </div>
          )}

          {postForm.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Erro ao carregar conteúdos
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{postForm.error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!postForm.loading && !postForm.error && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filters.filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onEdit={postForm.handleEditPost}
                    onDelete={postForm.handleDeletePost}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {!postForm.loading && !postForm.error && filters.filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-neutral-400 mb-4">
                <FileText size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-neutral-600 mb-2">
                Nenhum conteúdo encontrado
              </h3>
              <p className="text-neutral-500">
                {filters.searchTerm || filters.filterType !== 'all' || filters.filterStatus !== 'all'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece criando seu primeiro conteúdo.'}
              </p>
            </div>
          )}
        </ResponsiveContainer>
      </div>

      {/* Modal de Criação/Edição */}
      <CreatePostModal
        isOpen={postForm.isCreateModalOpen}
        onClose={() => postForm.handleCloseModal()}
        onSave={postForm.editingPost ? postForm.handleUpdatePost : postForm.handleCreatePost}
        editingPost={postForm.editingPost}
      />
    </>
  );
};

export default AdminSocialPage;