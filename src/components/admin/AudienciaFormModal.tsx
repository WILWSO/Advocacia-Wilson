/**
 * Modal de formulario para crear/editar Audiencias
 * Usa FormModal (SSoT) y sigue el patrón estándar del sistema
 */

import React, { useEffect, useState } from 'react';
import { FormModal } from '../shared/modales/FormModal';
import { InlineNotification } from '../shared/notifications/InlineNotification';
import { useProcessos } from '../../hooks/data-access/useProcessos';
import { AudienciaFormData, TIPOS_AUDIENCIA, FORMAS_AUDIENCIA } from '../../types/audiencia';
import { getInputClasses, getLabelClasses } from '../../utils/formStyles';
import { ADMIN_UI } from '../../config/messages';

interface AudienciaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (e: React.FormEvent) => Promise<void>;
  formData: AudienciaFormData;
  onFieldChange: (field: keyof AudienciaFormData, value: any) => void;
  isEditing: boolean;
  notification: { message: string; type: 'success' | 'error' } | null;
  onHideNotification: () => void;
  hasUnsavedChanges?: boolean;
}

export const AudienciaFormModal: React.FC<AudienciaFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formData,
  onFieldChange,
  isEditing,
  notification,
  onHideNotification,
  hasUnsavedChanges = false,
}) => {
  const { processos, fetchProcessos } = useProcessos();
  const [showTip, setShowTip] = useState(true);

  // Cargar procesos al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchProcessos();
      setShowTip(true); // Resetear tip cuando se abre el modal
    }
  }, [isOpen, fetchProcessos]);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? ADMIN_UI.AUDIENCIA.MODAL_TITLE_EDIT : ADMIN_UI.AUDIENCIA.MODAL_TITLE_CREATE}
      onSubmit={onSave}
      hasUnsavedChanges={hasUnsavedChanges}
    >
      <div className="space-y-4">
        {/* Notificación inline - Solo mostrar si hay mensaje y show es true */}
        {notification && notification.message && notification.message.trim() !== '' && (
          <InlineNotification
            message={notification.message}
            type={notification.type}
            onClose={onHideNotification}
          />
        )}

        {/* Mensaje informativo inicial (solo cuando no hay notificación activa y no está editando) */}
        {(!notification || !notification.message || notification.message.trim() === '') && !isEditing && showTip && (
          <InlineNotification
            message={ADMIN_UI.AUDIENCIA.TIP_MESSAGE}
            type="info"
            onClose={() => setShowTip(false)}
          />
        )}

        {/* Processo (Obrigatório) */}
        <div>
          <label htmlFor="proceso_id" className={getLabelClasses()}>
            {ADMIN_UI.AUDIENCIA.PROCESS_REQUIRED}
          </label>
          <select
            id="proceso_id"
            value={formData.proceso_id}
            onChange={(e) => onFieldChange('proceso_id', e.target.value)}
            className={getInputClasses(false, false)}
            required
          >
            <option value="">{ADMIN_UI.AUDIENCIA.PROCESS_PLACEHOLDER}</option>
            {processos.map((proceso) => (
              <option key={proceso.id} value={proceso.id}>
                {proceso.numero_processo || 'S/N'} - {proceso.titulo}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fecha" className={getLabelClasses()}>
              {ADMIN_UI.AUDIENCIA.DATE_REQUIRED}
            </label>
            <input
              type="date"
              id="fecha"
              value={formData.fecha}
              onChange={(e) => onFieldChange('fecha', e.target.value)}
              className={getInputClasses(false, false)}
              required
            />
          </div>

          <div>
            <label htmlFor="hora" className={getLabelClasses()}>
              {ADMIN_UI.AUDIENCIA.TIME_REQUIRED}
            </label>
            <input
              type="time"
              id="hora"
              value={formData.hora}
              onChange={(e) => onFieldChange('hora', e.target.value)}
              className={getInputClasses(false, false)}
              required
            />
          </div>
        </div>

        {/* Tipo de Audiencia */}
        <div>
          <label htmlFor="tipo" className={getLabelClasses()}>
            {ADMIN_UI.AUDIENCIA.TYPE_REQUIRED}
          </label>
          <select
            id="tipo"
            value={formData.tipo}
            onChange={(e) => onFieldChange('tipo', e.target.value)}
            className={getInputClasses(false, false)}
            required
          >
            {TIPOS_AUDIENCIA.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Forma (Presencial/Virtual/Híbrida) */}
        <div>
          <label htmlFor="forma" className={getLabelClasses()}>
            {ADMIN_UI.AUDIENCIA.FORM_REQUIRED}
          </label>
          <select
            id="forma"
            value={formData.forma}
            onChange={(e) => onFieldChange('forma', e.target.value as 'presencial' | 'virtual' | 'hibrida')}
            className={getInputClasses(false, false)}
            required
          >
            {FORMAS_AUDIENCIA.map((forma) => (
              <option key={forma.value} value={forma.value}>
                {forma.label}
              </option>
            ))}
          </select>
        </div>

        {/* Local */}
        <div>
          <label htmlFor="local" className={getLabelClasses()}>
            {ADMIN_UI.AUDIENCIA.LOCAL_LABEL}
          </label>
          <input
            type="text"
            id="local"
            value={formData.local}
            onChange={(e) => onFieldChange('local', e.target.value)}
            className={getInputClasses(false, false)}
            placeholder={ADMIN_UI.AUDIENCIA.LOCAL_PLACEHOLDER}
          />
        </div>

        {/* Link Meet (para audiencias virtuales) */}
        {(formData.forma === 'virtual' || formData.forma === 'hibrida') && (
          <div>
            <label htmlFor="link_meet" className={getLabelClasses()}>
              {ADMIN_UI.AUDIENCIA.LINK_LABEL}
            </label>
            <input
              type="url"
              id="link_meet"
              value={formData.link_meet}
              onChange={(e) => onFieldChange('link_meet', e.target.value)}
              className={getInputClasses(false, false)}
              placeholder={ADMIN_UI.AUDIENCIA.LINK_PLACEHOLDER}
            />
          </div>
        )}

        {/* Observaciones */}
        <div>
          <label htmlFor="observaciones" className={getLabelClasses()}>
            {ADMIN_UI.AUDIENCIA.OBSERVATIONS_LABEL}
          </label>
          <textarea
            id="observaciones"
            value={formData.observaciones}
            onChange={(e) => onFieldChange('observaciones', e.target.value)}
            className={getInputClasses(false, false)}
            rows={3}
            placeholder={ADMIN_UI.AUDIENCIA.OBSERVATIONS_PLACEHOLDER}
          />
        </div>
      </div>
    </FormModal>
  );
};
