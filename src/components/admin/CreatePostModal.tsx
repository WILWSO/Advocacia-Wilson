import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Video, 
  FileText,
  ExternalLink
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { extractYouTubeId } from '../../utils/youtubeUtils';
import { FormModal } from '../shared/modales/FormModal';
import { useUnsavedChanges } from '../../hooks/forms/useUnsavedChanges';
import { ADMIN_UI } from '../../config/messages';
import { ADMIN_CLASSES } from '../../config/theme';
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

  // Datos iniciales para detectar cambios
  const initialData = editingPost ? {
    titulo: editingPost.titulo,
    conteudo: editingPost.conteudo,
    tipo: editingPost.tipo,
    image_url: editingPost.image_url || '',
    video_url: editingPost.video_url || '',
    tags: editingPost.tags.join(', '),
    destaque: editingPost.destaque,
    publicado: editingPost.publicado
  } : {
    titulo: '',
    conteudo: '',
    tipo: 'article' as Post['tipo'],
    image_url: '',
    video_url: '',
    tags: '',
    destaque: false,
    publicado: true
  };

  // Hook para detectar cambios no guardados
  const { hasChanges, updateCurrent, resetInitial } = useUnsavedChanges(initialData);

  useEffect(() => {
    if (editingPost) {
      const data = {
        titulo: editingPost.titulo,
        conteudo: editingPost.conteudo,
        tipo: editingPost.tipo,
        image_url: editingPost.image_url || '',
        video_url: editingPost.video_url || '',
        tags: editingPost.tags.join(', '),
        destaque: editingPost.destaque,
        publicado: editingPost.publicado
      };
      setFormData(data);
      resetInitial(data);
    } else {
      const data = {
        titulo: '',
        conteudo: '',
        tipo: 'article' as Post['tipo'],
        image_url: '',
        video_url: '',
        tags: '',
        destaque: false,
        publicado: true
      };
      setFormData(data);
      resetInitial(data);
    }
  }, [editingPost, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Actualizar formData y notificar cambios
  const handleChange = (newData: typeof formData) => {
    setFormData(newData);
    updateCurrent(newData);
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
    resetInitial(formData); // Marcar como guardado
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
      title={editingPost ? ADMIN_UI.POST.MODAL_TITLE_EDIT : ADMIN_UI.POST.MODAL_TITLE_CREATE}
      submitLabel={editingPost ? ADMIN_UI.POST.SUBMIT_UPDATE : ADMIN_UI.POST.SUBMIT_CREATE}
      cancelLabel={ADMIN_UI.POST.CANCEL}
      maxWidth="2xl"
      hasUnsavedChanges={hasChanges}
    >
            {/* Tipo de conteúdo */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                {ADMIN_UI.POST.TYPE_LABEL}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(['article', 'video', 'image', 'announcement'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleChange({ ...formData, tipo: type })}
                    className={cn(
                      "flex flex-col items-center p-3 rounded-lg border transition-all",
                      formData.tipo === type 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-neutral-200 hover:border-neutral-300'
                    )}
                  >
                    {typeIcons[type]}
                    <span className="mt-1 text-xs font-medium capitalize">
                      {ADMIN_UI.POST_TYPES[type]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                {ADMIN_UI.POST.TITLE_REQUIRED}
              </label>
              <input
                id="title"
                type="text"
                value={formData.titulo}
                onChange={(e) => handleChange({ ...formData, titulo: e.target.value })}
                className={ADMIN_CLASSES.formInput}
                placeholder={ADMIN_UI.POST.TITLE_PLACEHOLDER}
                required
              />
            </div>

            {/* Conteúdo */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-neutral-700 mb-2">
                {ADMIN_UI.POST.CONTENT_REQUIRED}
              </label>
              <textarea
                id="content"
                value={formData.conteudo}
                onChange={(e) => handleChange({ ...formData, conteudo: e.target.value })}
                rows={6}
                className={ADMIN_CLASSES.formTextarea}
                placeholder={ADMIN_UI.POST.CONTENT_PLACEHOLDER}
                required
              />
            </div>

            {/* URLs de mídia */}
            {(formData.tipo === 'image' || formData.tipo === 'article' || formData.tipo === 'announcement') && (
              <div>
                <label htmlFor="mediaUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                  {ADMIN_UI.POST.IMAGE_URL_LABEL}
                </label>
                <input
                  id="mediaUrl"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => handleChange({ ...formData, image_url: e.target.value })}
                  className={ADMIN_CLASSES.formInput}
                  placeholder={ADMIN_UI.POST.IMAGE_URL_PLACEHOLDER}
                />
              </div>
            )}

            {formData.tipo === 'video' && (
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-neutral-700 mb-2">
                  {ADMIN_UI.POST.VIDEO_URL_LABEL}
                </label>
                <input
                  id="videoUrl"
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => handleChange({ ...formData, video_url: e.target.value })}
                  className={ADMIN_CLASSES.formInput}
                  placeholder={ADMIN_UI.POST.VIDEO_URL_PLACEHOLDER}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {ADMIN_UI.POST.VIDEO_URL_HELPER}
                </p>
              </div>
            )}

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-2">
                {ADMIN_UI.POST.TAGS_LABEL}
              </label>
              <input
                id="tags"
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange({ ...formData, tags: e.target.value })}
                className={ADMIN_CLASSES.formInput}
                placeholder={ADMIN_UI.POST.TAGS_PLACEHOLDER}
              />
            </div>

            {/* Opções */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.destaque}
                  onChange={(e) => handleChange({ ...formData, destaque: e.target.checked })}
                  className="mr-2 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">{ADMIN_UI.POST.FEATURED_LABEL}</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.publicado}
                  onChange={(e) => handleChange({ ...formData, publicado: e.target.checked })}
                  className="mr-2 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">{ADMIN_UI.POST.PUBLISH_LABEL}</span>
              </label>
            </div>
    </FormModal>
  );
};

export default CreatePostModal;
