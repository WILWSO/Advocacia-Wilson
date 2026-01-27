import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  FileText,
  ExternalLink
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { FormModal } from '../shared/modales/FormModal';
import type { Post } from '../../types/post';

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

export default CreatePostModal;
