import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, Edit2, Trash2, Plus, Eye } from 'lucide-react';
import AccessibleButton from '../shared/buttons/AccessibleButton';
import { cn } from '../../utils/cn';
import { useInlineNotification } from '../../hooks/ui/useInlineNotification';
import { InlineNotification } from '../shared/notifications/InlineNotification';
import { useNotification } from '../shared/notifications/NotificationContext';

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
  color?: 'blue' | 'purple' | 'indigo' | 'green';
  
  // Datos y estado
  items: T[];
  tempItem: Partial<T>;
  setTempItem: (item: Partial<T>) => void;
  editingIndex: number | null;
  isEditing: boolean;
  
  // Modales
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  showViewModal: boolean;
  setShowViewModal: (show: boolean) => void;
  
  // Callbacks CRUD
  onAdd: () => void;
  onUpdate: () => void;
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
  addButtonText?: string;
  emptyText?: string;
  confirmDeleteText?: string;
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
  editingIndex,
  isEditing,
  showAddModal,
  setShowAddModal,
  showViewModal,
  setShowViewModal,
  onAdd,
  onUpdate,
  onDelete,
  onEdit,
  onCancelEdit,
  fields,
  renderItem,
  canEdit = true,
  addButtonText = 'Adicionar',
  emptyText = 'Nenhum item adicionado',
  confirmDeleteText = 'Deseja realmente remover este item?',
}: CrudListManagerProps<T>) {
  const { notification, warning, hide } = useInlineNotification();
  const { confirm: confirmDialog } = useNotification();
  
  // Colores por tema
  const colorClasses = {
    blue: {
      button: 'bg-blue-600 hover:bg-blue-700',
      modal: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      icon: 'text-blue-600',
      ring: 'focus:ring-blue-500 focus:border-blue-500',
    },
    purple: {
      button: 'bg-purple-600 hover:bg-purple-700',
      modal: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      icon: 'text-purple-600',
      ring: 'focus:ring-purple-500 focus:border-purple-500',
    },
    indigo: {
      button: 'bg-indigo-600 hover:bg-indigo-700',
      modal: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      icon: 'text-indigo-600',
      ring: 'focus:ring-indigo-500 focus:border-indigo-500',
    },
    green: {
      button: 'bg-green-600 hover:bg-green-700',
      modal: 'bg-green-50 border-green-200 hover:bg-green-100',
      icon: 'text-green-600',
      ring: 'focus:ring-green-500 focus:border-green-500',
    },
  };

  const colors = colorClasses[color];

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
  };

  // Handler para guardar (agregar o actualizar)
  const handleSave = () => {
    if (!isFormValid) {
      warning('Por favor, preencha todos os campos obrigat\u00f3rios');
      return;
    }

    if (isEditing) {
      onUpdate();
    } else {
      onAdd();
    }
    
    setShowAddModal(false);
  };

  // Handler para eliminar con confirmación
  const handleDeleteWithConfirm = async (index: number) => {
    const confirmed = await confirmDialog({
      title: 'Excluir Item',
      message: confirmDeleteText,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (confirmed) {
      onDelete(index);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-2 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          {icon}
          {title}
        </h3>

        <div className="flex gap-2">
          <AccessibleButton
            type="button"
            onClick={() => setShowAddModal(true)}
            disabled={!canEdit}
            variant="primary"
            size="md"
            leftIcon={<Plus size={18} />}
            aria-label={`Adicionar ${title.toLowerCase()}`}
            className={colors.button}
          >
            {addButtonText}
          </AccessibleButton>

          {items.length > 0 && (
            <AccessibleButton
              type="button"
              onClick={() => setShowViewModal(true)}
              variant="ghost"
              size="md"
              leftIcon={<Eye size={18} />}
              aria-label={`Ver ${items.length} ${title.toLowerCase()}`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
            >
              Ver ({items.length})
            </AccessibleButton>
          )}
        </div>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">{emptyText}</p>
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
                aria-label={`Fechar modal de ${title.toLowerCase()}`}
                className="!p-2 rounded-full"
              >
                <X size={24} />
              </AccessibleButton>
            </div>

            {/* Notificación inline */}
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
                        <option value="">{field.placeholder || 'Selecione...'}</option>
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
                  onClick={handleCloseAddModal}
                  variant="ghost"
                  size="lg"
                  aria-label={`Cancelar ${isEditing ? 'edição' : 'adição'}`}
                  className="flex-1"
                >
                  Cancelar
                </AccessibleButton>
                <AccessibleButton
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
                  Salvar
                </AccessibleButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Ver Lista */}
      {showViewModal && items.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {icon}
                {title} ({items.length})
              </h4>
              <AccessibleButton
                onClick={() => setShowViewModal(false)}
                variant="ghost"
                size="sm"
                aria-label={`Fechar modal de ${title.toLowerCase()}`}
                className="!p-2 rounded-full"
              >
                <X size={20} />
              </AccessibleButton>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border transition-colors group",
                    colors.modal
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {renderItem(item, index)}
                    </div>
                    {canEdit && (
                      <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => {
                            onEdit(index);
                            setShowViewModal(false);
                            setShowAddModal(true);
                          }}
                          className={cn(
                            "p-2 hover:bg-gray-200 rounded-md transition-colors",
                            colors.icon
                          )}
                          title={`Editar ${title.toLowerCase()}`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteWithConfirm(index)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          title={`Remover ${title.toLowerCase()}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
