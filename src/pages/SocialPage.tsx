import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search,
  Star,
  FileEdit
} from 'lucide-react';
import { useAuthLogin } from '../components/auth/useAuthLogin';
import { usePostForm } from '../hooks/forms/usePostForm';
import { usePostFilters } from '../hooks/filters/usePostFilters';
import AccessibleButton from '../components/shared/buttons/AccessibleButton';
import CreatePostModal from '../components/admin/CreatePostModal';
import { SocialPostCard } from '../components/shared/cards/SocialPostCard';
import { AdminPageLayout } from '../components/layout/AdminPageLayout';
import { PAGES_UI } from '../config/messages';
import type { Post } from '../types/post';

const SocialPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthLogin();
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
    <AdminPageLayout
      title={PAGES_UI.SOCIAL.TITLE}
      description={PAGES_UI.SOCIAL.DESCRIPTION}
      headerAction={
        <AccessibleButton
          category="create"
          onClick={() => postForm.handleOpenCreateModal()}
          aria-label="Criar novo conteúdo"
          size="lg"
        >
          {PAGES_UI.SOCIAL.NEW_BUTTON}
        </AccessibleButton>
      }
    >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">{PAGES_UI.STATS.TOTAL}</p>
                  <p className="text-2xl font-bold text-neutral-900">{filters.stats.total}</p>
                </div>
                <FileText className="text-primary-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">{PAGES_UI.STATS.PUBLICADOS}</p>
                  <p className="text-2xl font-bold text-green-600">{filters.stats.publicados}</p>
                </div>
                <Star className="text-green-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">{PAGES_UI.STATS.RASCUNHOS}</p>
                  <p className="text-2xl font-bold text-neutral-600">{filters.stats.rascunhos}</p>
                </div>
                <FileEdit className="text-neutral-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">{PAGES_UI.STATS.DESTAQUES}</p>
                  <p className="text-2xl font-bold text-gold-600">{filters.stats.destacados}</p>
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
                    placeholder={PAGES_UI.SOCIAL.FILTERS.SEARCH_PLACEHOLDER}
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
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-primary-500 hover:bg-primary-400 transition ease-in-out duration-150">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {PAGES_UI.SOCIAL.EMPTY.LOADING}
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
                  <SocialPostCard
                    key={post.id}
                    post={post}
                    variant="admin"
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
                {PAGES_UI.SOCIAL.EMPTY.TITLE}
              </h3>
              <p className="text-neutral-500">
                {filters.searchTerm || filters.filterType !== 'all' || filters.filterStatus !== 'all'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece criando seu primeiro conteúdo.'}
              </p>
            </div>
          )}

        {/* Modal de Criação/Edição */}
        <CreatePostModal
          isOpen={postForm.isCreateModalOpen}
          onClose={() => postForm.handleCloseModal()}
          onSave={postForm.editingPost ? postForm.handleUpdatePost : postForm.handleCreatePost}
          editingPost={postForm.editingPost}
        />
    </AdminPageLayout>
    );
  };

export default SocialPage;