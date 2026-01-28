import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Comentario } from '../../types/post';

/**
 * Hook para gestionar comentarios de posts
 * Separa la lógica de comentarios del componente PostModal
 * @param postId - ID del post
 * @param autoApprove - Si es true, comentarios se aprueban automáticamente (para página pública)
 */
export const useComments = (postId: string, autoApprove = false) => {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  /**
   * Carga comentarios aprobados del post
   */
  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('comentarios_posts_social')
        .select('*')
        .eq('post_id', postId)
        .eq('aprovado', true)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Error loading comments:', error);
        return { success: false, error };
      }
      
      setComentarios(data || []);
      return { success: true, data };
    } catch (err) {
      console.error('Error loading comments:', err);
      return { success: false, error: err };
    } finally {
      setLoadingComments(false);
    }
  };

  /**
   * Envía un nuevo comentario
   * El comentario queda pendiente de aprobación o se aprueba automáticamente según autoApprove
   */
  const submitComment = async (autorNome: string, comentario: string) => {
    if (!comentario.trim() || !autorNome.trim()) {
      return { success: false, error: 'Campos obrigatórios vazios' };
    }

    setSubmittingComment(true);
    try {
      const { data, error } = await supabase
        .from('comentarios_posts_social')
        .insert({
          post_id: postId,
          autor_nome: autorNome.trim(),
          comentario: comentario.trim(),
          aprovado: autoApprove
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting comment:', error);
        return { success: false, error };
      }

      // Si autoApprove, agregar el comentario a la lista local
      if (autoApprove && data) {
        setComentarios(prev => [data, ...prev]);
      }

      return { success: true, data };
    } catch (err) {
      console.error('Error submitting comment:', err);
      return { success: false, error: err };
    } finally {
      setSubmittingComment(false);
    }
  };

  /**
   * Recarga los comentarios (útil después de aprobar uno)
   */
  const refreshComments = () => {
    return loadComments();
  };

  return {
    comentarios,
    loadingComments,
    submittingComment,
    loadComments,
    submitComment,
    refreshComments
  };
};
