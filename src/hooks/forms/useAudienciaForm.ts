/**
 * Hook para gestión de formulario de Audiencias
 * Centraliza toda la lógica de negocio: CRUD, estados, handlers, permisos
 * Patrón SSoT
 */

import { useState, useEffect } from 'react';
import { useAudiencias } from '../data-access/useAudiencias';
import { useNotification } from '../../components/shared/notifications/useNotification';
import { useInlineNotification } from '../ui/useInlineNotification';
import { useUnsavedChanges } from './useUnsavedChanges';
import { usePermissions } from '../auth/usePermissions';
import { Audiencia, AudienciaFormData, TIPOS_AUDIENCIA, FORMAS_AUDIENCIA } from '../../types/audiencia';
import { ERROR_MESSAGES } from '../../config/messages';
import { formatFormData } from '../../utils/fieldFormatters';

const EMPTY_FORM: AudienciaFormData = {
  proceso_id: '',
  fecha: '',
  hora: '',
  tipo: TIPOS_AUDIENCIA[0],
  forma: 'presencial',
  local: '',
  observaciones: '',
  link_meet: '',
};

interface UseAudienciaFormOptions {
  procesoId?: string;
  advogadoId?: string;
}

export const useAudienciaForm = (options?: UseAudienciaFormOptions) => {
  const { 
    audiencias, 
    loading: isLoading, 
    createAudiencia, 
    updateAudiencia, 
    deleteAudiencia 
  } = useAudiencias({
    ...options,
    enablePolling: true,      // ✅ Activar sincronización automática
    pollingInterval: 30000,   // ✅ Actualizar cada 30 segundos
  });
  
  const { notification, error: errorNotif, hide } = useInlineNotification();
  const { success: successToast, warning, confirm: confirmDialog } = useNotification();

  // Permisos centralizados
  const { isAdmin, isAdvogado, canEdit, canDelete } = usePermissions();

  // Estados
  const [showModal, setShowModal] = useState(false);
  const [viewingAudiencia, setViewingAudiencia] = useState<Audiencia | null>(null);
  const [editingAudiencia, setEditingAudiencia] = useState<Audiencia | null>(null);
  const [formData, setFormData] = useState<AudienciaFormData>(EMPTY_FORM);

  // Detección de cambios no guardados - siempre inicializar con EMPTY_FORM
  const { hasChanges, updateCurrent, resetInitial } = useUnsavedChanges(EMPTY_FORM);

  // Helper para garantizar que todos los valores sean strings seguros
  const ensureSafeFormData = (data: Partial<AudienciaFormData>): AudienciaFormData => ({
    proceso_id: data.proceso_id || '',
    fecha: data.fecha || '',
    hora: data.hora || '',
    tipo: data.tipo || TIPOS_AUDIENCIA[0],
    forma: data.forma || 'presencial',
    local: data.local || '',
    observaciones: data.observaciones || '',
    link_meet: data.link_meet || '',
  });

  // Resetear form cuando cambia la audiencia en edición
  useEffect(() => {
    if (editingAudiencia) {
      const editData = ensureSafeFormData({
        proceso_id: editingAudiencia.proceso_id,
        fecha: editingAudiencia.fecha,
        hora: editingAudiencia.hora,
        tipo: editingAudiencia.tipo,
        forma: editingAudiencia.forma,
        local: editingAudiencia.local,
        observaciones: editingAudiencia.observaciones,
        link_meet: editingAudiencia.link_meet,
      });
      setFormData(editData);
      resetInitial(editData);
    } else {
      setFormData(EMPTY_FORM);
      resetInitial(EMPTY_FORM);
    }
  }, [editingAudiencia, resetInitial]);

  // Crear o actualizar audiencia
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canEdit) {
      warning('Você não tem permissão para editar audiencias');
      return;
    }

    // Validación básica
    if (!formData.proceso_id || !formData.fecha || !formData.hora || !formData.tipo) {
      errorNotif(ERROR_MESSAGES.REQUIRED_FIELDS);
      return;
    }
    
    try {
      // Formatear campos antes de enviar
      const formattedData = formatFormData(formData as unknown as Record<string, unknown>) as unknown as AudienciaFormData;
      
      if (editingAudiencia?.id) {
        // Actualizar
        const result = await updateAudiencia(editingAudiencia.id, formattedData);
        if (!result) throw new Error('Erro ao atualizar audiencia');
      } else {
        // Crear
        const result = await createAudiencia(formattedData);
        if (!result) throw new Error('Erro ao criar audiencia');
      }

      // Resetear estado antes de cerrar
      resetInitial(EMPTY_FORM);
      setShowModal(false);
      setEditingAudiencia(null);
      setFormData(EMPTY_FORM);
      hide();
      successToast('Audiência salva com sucesso!');
    } catch (error: unknown) {
      console.error('Erro ao salvar audiência:', error);
      errorNotif(ERROR_MESSAGES.audiencias.SAVE_ERROR);
    }
  };

  // Eliminar audiencia
  const handleDelete = async (id: string) => {
    if (!canDelete) {
      warning('Apenas administradores podem excluir audiencias');
      return;
    }

    const confirmed = await confirmDialog({
      message: 'Tem certeza que deseja excluir esta audiencia? Esta ação não pode ser desfeita.',
      type: 'danger'
    });

    if (!confirmed) return;

    try {
      const result = await deleteAudiencia(id);
      if (!result) throw new Error('Erro ao excluir audiência');
      
      successToast('Audiência excluída com sucesso!');
    } catch (error: unknown) {
      console.error('Erro ao excluir audiência:', error);
      errorNotif(ERROR_MESSAGES.audiencias.DELETE_ERROR);
    }
  };

  // Handlers de modal
  const handleCreate = () => {
    setEditingAudiencia(null);
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

  const handleEdit = (audiencia: Audiencia) => {
    setEditingAudiencia(audiencia);
    setShowModal(true);
  };

  const handleView = (audiencia: Audiencia) => {
    setViewingAudiencia(audiencia);
  };

  const handleCloseModal = () => {
    // BaseModal maneja la confirmación automáticamente via hasUnsavedChanges
    setShowModal(false);
    setEditingAudiencia(null);
    setFormData(EMPTY_FORM);
    resetInitial(EMPTY_FORM);
    hide(); // Esconder notificaciones inline
  };

  const handleCloseView = () => {
    setViewingAudiencia(null);
  };

  // Handler para cambios de campo
  // Aplica formateo en tiempo real mientras el usuario digita
  const handleFieldChange = (field: keyof AudienciaFormData, value: unknown) => {
    // Asegurar que los valores opcionales nunca sean null/undefined
    let safeValue = value;
    if ((field === 'local' || field === 'observaciones' || field === 'link_meet') && 
        (value === null || value === undefined)) {
      safeValue = '';
    }
    
    const newData = { ...formData, [field]: safeValue };
    const formattedData = formatFormData(newData as unknown as Record<string, unknown>) as unknown as AudienciaFormData;
    setFormData(formattedData);
    updateCurrent(formattedData);
  };

  return {
    // Datos
    audiencias,
    isLoading,
    
    // Permisos
    canEdit,
    canDelete,
    isAdmin,
    isAdvogado,
    
    // Estados
    showModal,
    viewingAudiencia,
    editingAudiencia,
    formData: ensureSafeFormData(formData), // ✅ Garantizar valores seguros
    
    // Notificaciones
    notification,
    hide,
    
    // Detección de cambios
    hasChanges,
    
    // Handlers
    handleSave,
    handleDelete,
    handleCreate,
    handleEdit,
    handleView,
    handleCloseModal,
    handleCloseView,
    handleFieldChange,
    
    // Constantes
    tiposAudiencia: TIPOS_AUDIENCIA,
    formasAudiencia: FORMAS_AUDIENCIA,
  };
};

// Export default para compatibilidad
export default useAudienciaForm;
