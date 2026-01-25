import React, { useState, useEffect } from 'react';
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
import { usePostsSociais } from '../hooks/usePosts';
import AccessibleButton from '../components/shared/buttons/AccessibleButton'
import { FormModal } from '../components/shared/modales/FormModal';
import { useNotification } from '../components/shared/notifications/NotificationContext';

interface Post {
  id?: string;
  titulo: string;
  conteudo: string;
  tipo: 'article' | 'video' | 'image' | 'announcement';
  image_url?: string;
  video_url?: string;
  youtube_id?: string;
  tags: string[];
  autor: string | { nome: string; email: string };
  data_criacao?: string;
  data_atualizacao?: string;
  publicado: boolean;
  likes: number;
  comentarios: number;
  destaque: boolean;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Partial<Post>) => void;
  editingPost?: Post | null;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingPost 
}) => {
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    tipo: 'article' as Post['tipo'],
    image_url: '',
    video_url: '',
    tags: '',
    destaque: false,
    publicado: true
  });

  useEffect(() => {
    if (editingPost) {
      setFormData({
        titulo: editingPost.titulo,
        conteudo: editingPost.conteudo,
        tipo: editingPost.tipo,
        image_url: editingPost.image_url || '',
        video_url: editingPost.video_url || '',
        tags: editingPost.tags.join(', '),
        destaque: editingPost.destaque,
        publicado: editingPost.publicado
      });
    } else {
      setFormData({
        titulo: '',
        conteudo: '',
        tipo: 'article',
        image_url: '',
        video_url: '',
        tags: '',
        destaque: false,
        publicado: true
      });
    }
  }, [editingPost, isOpen]);

  // Función para extraer el ID de YouTube de una URL
  const extractYouTubeId = (url: string): string | null => {
    if (!url) return null;
    
    // Patrones para diferentes formatos de URL de YouTube
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/, // youtube.com/watch?v=ID o youtu.be/ID
      /youtube\.com\/embed\/([^&\n?#]+)/, // youtube.com/embed/ID
      /youtube\.com\/v\/([^&\n?#]+)/ // youtube.com/v/ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    // Extraer youtube_id si es un video
    let youtube_id = null;
    if (formData.tipo === 'video' && formData.video_url) {
      youtube_id = extractYouTubeId(formData.video_url);
    }
    
    onSave({
      ...formData,
      tags: tagsArray,
      youtube_id: youtube_id || undefined,
      ...(editingPost ? { id: editingPost.id } : { 
        likes: 0,
        comentarios: 0
      })
    });
  };

  const typeIcons = {
    article: <FileText size={20} />,
    video: <Video size={20} />,
    image: <ImageIcon size={20} />,
    announcement: <ExternalLink size={20} />
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={editingPost ? 'Editar Conteúdo' : 'Criar Novo Conteúdo'}
      submitLabel={editingPost ? 'Atualizar' : 'Criar'}
      cancelLabel="Cancelar"
      maxWidth="2xl"
    >
            {/* Tipo de conteúdo */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Tipo de Conteúdo
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['article', 'video', 'image', 'announcement'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tipo: type }))}
                    className={cn(
                      "flex flex-col items-center p-3 rounded-lg border transition-all",
                      formData.tipo === type 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-neutral-200 hover:border-neutral-300'
                    )}
                  >
                    {typeIcons[type]}
                    <span className="mt-1 text-xs font-medium capitalize">
                      {type === 'article' && 'Artigo'}
                      {type === 'video' && 'Vídeo'}
                      {type === 'image' && 'Imagem'}
                      {type === 'announcement' && 'Anúncio'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                Título *
              </label>
              <input
                id="title"
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Digite o título do conteúdo..."
                required
              />
            </div>

            {/* Conteúdo */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-neutral-700 mb-2">
                Conteúdo *
              </label>
              <textarea
                id="content"
                value={formData.conteudo}
                onChange={(e) => setFormData(prev => ({ ...prev, conteudo: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Escreva o conteúdo aqui..."
                required
              />
            </div>

            {/* URLs de mídia */}
            {(formData.tipo === 'image' || formData.tipo === 'article' || formData.tipo === 'announcement') && (
              <div>
                <label htmlFor="mediaUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                  URL da Imagem
                </label>
                <input
                  id="mediaUrl"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Cole a URL da imagem aqui..."
                />
              </div>
            )}

            {formData.tipo === 'video' && (
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                  URL do Vídeo (YouTube)
                </label>
                <input
                  id="videoUrl"
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Suporta links do YouTube (youtube.com e youtu.be)
                </p>
              </div>
            )}

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-2">
                Tags (separadas por vírgula)
              </label>
              <input
                id="tags"
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="direito, civil, penal, trabalhista..."
              />
            </div>

            {/* Opções */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.destaque}
                  onChange={(e) => setFormData(prev => ({ ...prev, destaque: e.target.checked }))}
                  className="mr-2 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">Conteúdo em destaque</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.publicado}
                  onChange={(e) => setFormData(prev => ({ ...prev, publicado: e.target.checked }))}
                  className="mr-2 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">Publicar imediatamente</span>
              </label>
            </div>
    </FormModal>
  );
};

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
        "bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border",
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
      <div className="p-4">
        <p className="text-neutral-600 text-sm line-clamp-3 mb-3">
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
  const { 
    posts, 
    loading, 
    error, 
    createPost, 
    updatePost, 
    deletePost, 
    togglePublished 
  } = usePostsSociais();
  const { success, error: errorNotif, confirm: confirmDialog } = useNotification();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | Post['tipo']>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  const handleCreatePost = async (postData: Partial<Post>) => {
    if (!user) return;
    
    const newPostData = {
      ...postData,
      autor: user.id,
      likes: 0,
      comentarios: 0
    } as Omit<Post, 'id' | 'data_criacao' | 'data_atualizacao'>;
    
    const result = await createPost(newPostData);
    if (!result.error) {
      success('Conteúdo criado com sucesso!');
      setIsCreateModalOpen(false);
      setEditingPost(null);
    } else {
      errorNotif('Erro ao criar conteúdo. Tente novamente.');
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsCreateModalOpen(true);
  };

  const handleUpdatePost = async (updatedPost: Partial<Post>) => {
    if (!editingPost?.id) return;
    
    const result = await updatePost(editingPost.id, updatedPost);
    if (!result.error) {
      success('Conteúdo atualizado com sucesso!');
      setIsCreateModalOpen(false);
      setEditingPost(null);
    } else {
      errorNotif('Erro ao atualizar conteúdo. Tente novamente.');
    }
  };

  const handleDeletePost = async (id: string) => {
    const confirmed = await confirmDialog({
      title: 'Excluir Conteúdo',
      message: 'Tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (confirmed) {
      const result = await deletePost(id);
      if (!result.error) {
        success('Conteúdo excluído com sucesso!');
      } else {
        errorNotif('Erro ao excluir conteúdo. Tente novamente.');
      }
    }
  };

  const handleTogglePublished = async (id: string) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      const result = await togglePublished(id, !post.publicado);
      if (!result.error) {
        success(post.publicado ? 'Conteúdo despublicado!' : 'Conteúdo publicado!');
      } else {
        errorNotif('Erro ao alterar status de publicação.');
      }
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.conteudo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || post.tipo === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && post.publicado) ||
                         (filterStatus === 'draft' && !post.publicado);
    
    return matchesSearch && matchesType && matchesStatus;
  });

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
                  onClick={() => setIsCreateModalOpen(true)}
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

        {/* Filtros e Busca */}
        <ResponsiveContainer maxWidth="7xl" className="py-6">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar conteúdos..."
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filtros */}
              <div className="flex gap-3">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as Post['tipo'] | 'all')}
                  className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="article">Artigos</option>
                  <option value="video">Vídeos</option>
                  <option value="image">Imagens</option>
                  <option value="announcement">Anúncios</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'published' | 'draft')}
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
          {loading && (
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

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Erro ao carregar conteúdos
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onEdit={handleEditPost}
                    onDelete={handleDeletePost}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {!loading && !error && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-neutral-400 mb-4">
                <FileText size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-neutral-600 mb-2">
                Nenhum conteúdo encontrado
              </h3>
              <p className="text-neutral-500">
                {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece criando seu primeiro conteúdo.'}
              </p>
            </div>
          )}
        </ResponsiveContainer>
      </div>

      {/* Modal de Criação/Edição */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPost(null);
        }}
        onSave={editingPost ? handleUpdatePost : handleCreatePost}
        editingPost={editingPost}
      />
    </>
  );
};

export default AdminSocialPage;