import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Edit2, Trash2, Plus } from 'lucide-react';
import AccessibleButton from '../shared/buttons/AccessibleButton';
import { cn } from '../../utils/cn';
import { useInlineNotification } from '../../hooks/ui/useInlineNotification';
import { InlineNotification } from '../shared/notifications/InlineNotification';
import { useNotification } from '../shared/notifications/NotificationContext';
import { THEME_COLORS, type ThemeColor } from '../../config/theme';
import { ADMIN_UI } from '../../config/messages';
import { useEffect } from 'react';

/**
 * Configuración de campo para el formulario
 */
export interface FieldConfig<T> {
  name: keyof T;
  label: string;
  type?: 'text' | 'url' | 'date' | 'time' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  className?: string;
  fullWidth?: boolean;
  options?: Array<{ value: string; label: string }>; // Para campos tipo select
}

/**
 * Props del componente CrudListManager
 */
interface CrudListManagerProps<T> {
  // Título y configuración
  title: string;
  icon?: React.ReactNode;
  color?: ThemeColor;
  
  // Datos y estado
  items: T[];
  tempItem: Partial<T>;
  setTempItem: (item: Partial<T>) => void;
  isEditing: boolean;
  
  // Modales
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  
  // Callbacks CRUD
  onAdd: () => boolean | void | { success: boolean; message?: string };
  onUpdate: () => boolean | void | { success: boolean; message?: string };
  onDelete: (index: number) => void;
  onEdit: (index: number) => void;
  onCancelEdit: () => void;
  
  // Configuración de campos
  fields: FieldConfig<T>[];
  
  // Función de renderizado personalizado para vista de lista
  renderItem: (item: T, index: number) => React.ReactNode;
  
  // Permisos
  canEdit?: boolean;
  
  // Texto personalizado
  emptyText?: string;
  confirmDeleteText?: string;
  
  // Callback para notificaciones al acordeón padre
  onNotification?: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

/**
 * Componente genérico para gestionar listas con operaciones CRUD
 * Reemplaza modales duplicados de Links, Jurisprudencias y Audiencias
 * 
 * @example
 * <CrudListManager
 *   title="Links do Processo"
 *   icon={<LinkIcon size={20} />}
 *   color="blue"
 *   items={links}
 *   tempItem={tempLink}
 *   setTempItem={setTempLink}
 *   fields={[
 *     { name: 'titulo', label: 'Título', required: true },
 *     { name: 'link', label: 'URL', type: 'url', required: true }
 *   ]}
 *   renderItem={(link) => (
 *     <div>
 *       <p>{link.titulo}</p>
 *       <a href={link.link}>{link.link}</a>
 *     </div>
 *   )}
 *   onAdd={handleAdd}
 *   onUpdate={handleUpdate}
 *   onDelete={handleDelete}
 *   {...crudState}
 * />
 */
export function CrudListManager<T extends Record<string, any>>({
  title,
  icon,
  color = 'blue',
  items,
  tempItem,
  setTempItem,
  isEditing,
  showAddModal,
  setShowAddModal,
  onAdd,
  onUpdate,
  onDelete,
  onEdit,
  onCancelEdit,
  fields,
  renderItem,
  canEdit = true,
  emptyText = ADMIN_UI.CRUD.EMPTY_TEXT,
  confirmDeleteText = ADMIN_UI.CRUD.DELETE_CONFIRM,
  onNotification,
}: CrudListManagerProps<T>) {
  const { notification, warning, hide } = useInlineNotification();
  const { confirm: confirmDialog } = useNotification();
  
  // Limpiar notificaciones cuando se abre/cierra el modal
  useEffect(() => {
    if (!showAddModal && notification.show) {
      hide();
    }
  }, [showAddModal, notification.show, hide]);
  
  // Colores por tema desde SSoT
  const colors = THEME_COLORS[color || 'blue'];

  // Validar si el formulario está completo
  const isFormValid = fields
    .filter((field) => field.required)
    .every((field) => {
      const value = tempItem[field.name];
      return value && String(value).trim() !== '';
    });

  // Handler para cerrar modal de agregar/editar
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    onCancelEdit();
    hide(); // Limpiar cualquier notificación pendiente
  };

  // Handler para guardar (agregar o actualizar)
  const handleSave = () => {
    if (!isFormValid) {
      const errorMsg = ADMIN_UI.CRUD.REQUIRED_FIELDS_ERROR;
      // Mostrar warning dentro del modal (siempre)
      warning(errorMsg);
      return;
    }

    let success = true;
    let errorMessage: string | undefined;
    
    if (isEditing) {
      const result = onUpdate();
      
      // Manejar diferentes formatos de retorno
      if (typeof result === 'object' && result !== null) {
        success = result.success;
        errorMessage = result.message;
      } else {
        success = result !== false;
      }
      
      // NO mostrar mensaje de éxito para evitar confusión - usuario debe guardar el formulario
      if (!success && errorMessage) {
        // Mostrar error dentro del modal, NO en el acordeón
        warning(errorMessage);
      }
    } else {
      const result = onAdd();
      
      // Manejar diferentes formatos de retorno
      if (typeof result === 'object' && result !== null) {
        success = result.success;
        errorMessage = result.message;
      } else {
        success = result !== false;
      }
      
      // NO mostrar mensaje de éxito para evitar confusión - usuario debe guardar el formulario
      if (!success && errorMessage) {
        // Mostrar error dentro del modal, NO en el acordeón
        warning(errorMessage);
      }
    }
    
    // Solo cerrar modal si fue exitoso
    if (success) {
      setShowAddModal(false);
      hide(); // Ocultar notificación inline del modal
    }
  };

  // Handler para eliminar con confirmación
  const handleDeleteWithConfirm = async (index: number) => {
    const confirmed = await confirmDialog({
      title: ADMIN_UI.CRUD.DELETE_TITLE,
      message: confirmDeleteText,
      confirmText: ADMIN_UI.CRUD.DELETE_BUTTON,
      cancelText: ADMIN_UI.CRUD.CANCEL_BUTTON,
      type: 'danger'
    });

    if (confirmed) {
      onDelete(index);
      onNotification?.('Item removido com sucesso', 'success');
      hide(); // Ocultar notificación inline del modal
    }
  };

  return (
    <div className="space-y-4">
      {/* Lista de items */}
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg border transition-colors group",
                colors.bg,
                colors.border
              )}
            >
              <div className="flex items-start justify-between gap-3">
                {renderItem(item, index)}
                
                {canEdit && (
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <AccessibleButton
                      type="button"
                      onClick={() => {
                        onEdit(index);
                        setShowAddModal(true);
                      }}
                      variant="ghost"
                      size="sm"
                      aria-label={`Editar ${title.toLowerCase()}`}
                      className="!p-1.5 hover:bg-blue-100 rounded"
                    >
                      <Edit2 size={16} className="text-blue-600" />
                    </AccessibleButton>
                    <AccessibleButton
                      type="button"
                      onClick={() => handleDeleteWithConfirm(index)}
                      variant="ghost"
                      size="sm"
                      aria-label={`Remover ${title.toLowerCase()}`}
                      className="!p-1.5 hover:bg-red-100 rounded"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </AccessibleButton>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para Agregar/Editar */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {icon}
                {isEditing ? `Editar ${title}` : `Adicionar ${title}`}
              </h4>
              <AccessibleButton
                onClick={handleCloseAddModal}
                variant="ghost"
                size="sm"
                aria-label={ADMIN_UI.CRUD.CLOSE_MODAL}
                className="!p-2 rounded-full"
              >
                <X size={24} />
              </AccessibleButton>
            </div>

            {/* Notificación inline - siempre mostrar dentro del modal */}
            <AnimatePresence mode="wait">
              {notification.show && (
                <InlineNotification
                  type={notification.type}
                  message={notification.message}
                  onClose={hide}
                  className="mb-4"
                />
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {/* Renderizar campos dinámicamente */}
              <div className={cn(
                "grid gap-4",
                fields.some(f => f.fullWidth) ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
              )}>
                {fields.map((field) => (
                  <div
                    key={String(field.name)}
                    className={cn(
                      field.fullWidth && "md:col-span-2"
                    )}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={String(tempItem[field.name] || '')}
                        onChange={(e) =>
                          setTempItem({ ...tempItem, [field.name]: e.target.value })
                        }
                        placeholder={field.placeholder}
                        rows={3}
                        className={cn(
                          "w-full px-3 py-2 border border-gray-300 rounded-lg resize-none",
                          colors.ring,
                          field.className
                        )}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        value={String(tempItem[field.name] || '')}
                        onChange={(e) =>
                          setTempItem({ ...tempItem, [field.name]: e.target.value })
                        }
                        className={cn(
                          "w-full px-3 py-2 border border-gray-300 rounded-lg bg-white",
                          colors.ring,
                          field.className
                        )}
                      >
                        <option value="">{field.placeholder || ADMIN_UI.CRUD.SELECT_PLACEHOLDER}</option>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type || 'text'}
                        value={String(tempItem[field.name] || '')}
                        onChange={(e) =>
                          setTempItem({ ...tempItem, [field.name]: e.target.value })
                        }
                        placeholder={field.placeholder}
                        className={cn(
                          "w-full px-3 py-2 border border-gray-300 rounded-lg",
                          colors.ring,
                          field.className
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-2">
                <AccessibleButton
                  type="button"
                  onClick={handleCloseAddModal}
                  variant="ghost"
                  size="lg"
                  aria-label={`Cancelar ${isEditing ? 'edição' : 'adição'}`}
                  className="flex-1"
                >
                  {ADMIN_UI.CRUD.CANCEL_BUTTON}
                </AccessibleButton>
                <AccessibleButton
                  type="button"
                  onClick={handleSave}
                  disabled={!isFormValid}
                  variant="primary"
                  size="lg"
                  aria-label={`Salvar ${title.toLowerCase()}`}
                  className={cn(
                    "flex-1",
                    isEditing ? "bg-green-600 hover:bg-green-700" : colors.button
                  )}
                >
                  {ADMIN_UI.CRUD.SAVE_BUTTON}
                </AccessibleButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Helper para crear el botón de "Adicionar" que va en el header del acordeón
 * Responsivo: muestra texto completo en pantallas grandes, solo "+" en móviles
 */
interface AddButtonProps {
  onClick: () => void;
  disabled?: boolean;
  color?: ThemeColor;
  label?: string;
  ariaLabel?: string;
}

export const CrudAddButton: React.FC<AddButtonProps> = ({
  onClick,
  disabled = false,
  color = 'blue',
  label = 'Adicionar',
  ariaLabel
}) => {
  const colors = THEME_COLORS[color];
  
  return (
    <>
      {/* Versión móvil: solo icono "+" */}
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "sm:hidden px-2.5 py-1.5 rounded-md font-medium text-white transition-all pointer-events-auto",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          colors.button,
          colors.ring
        )}
        aria-label={ariaLabel || label}
      >
        <Plus size={18} />
      </button>
      
      {/* Versión desktop: texto completo */}
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-white transition-all pointer-events-auto",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          colors.button,
          colors.ring
        )}
        aria-label={ariaLabel || label}
      >
        <Plus size={16} />
        {label}
      </button>
    </>
  );
};
