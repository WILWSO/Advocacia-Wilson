/**
 * Hook genérico para gestión de estado de modales (SSoT)
 * 
 * Elimina duplicación de lógica de modales en componentes de formulario.
 * Centraliza los estados: isOpen, viewingItem, editingItem
 * 
 * @template T - Tipo del item siendo visualizado/editado
 * @returns Estado y handlers para gestión de modales
 * 
 * @example
 * // En un hook de formulario
 * const viewModal = useModalState<Cliente>();
 * const formModal = useModalState<Cliente>();
 * 
 * // Abrir modal para ver
 * viewModal.open(cliente);
 * 
 * // Abrir modal para crear
 * formModal.openCreate();
 * 
 * // Abrir modal para editar
 * formModal.openEdit(cliente);
 * 
 * // Cerrar modal
 * viewModal.close();
 */

import { useState, useCallback } from 'react';

export interface ModalState<T> {
  // Estados
  isOpen: boolean;
  item: T | null;
  mode: 'view' | 'create' | 'edit' | null;
  
  // Handlers básicos
  open: (item: T) => void;
  close: () => void;
  setItem: (item: T | null) => void;
  
  // Handlers con modo
  openView: (item: T) => void;
  openCreate: () => void;
  openEdit: (item: T) => void;
  
  // Helpers
  isViewing: boolean;
  isCreating: boolean;
  isEditing: boolean;
}

export function useModalState<T = unknown>(): ModalState<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState<T | null>(null);
  const [mode, setMode] = useState<'view' | 'create' | 'edit' | null>(null);

  // Handler genérico para abrir con item
  const open = useCallback((item: T) => {
    setItem(item);
    setIsOpen(true);
    setMode('view');
  }, []);

  // Handler para cerrar y limpiar
  const close = useCallback(() => {
    setIsOpen(false);
    setItem(null);
    setMode(null);
  }, []);

  // Handler para abrir en modo visualización
  const openView = useCallback((item: T) => {
    setItem(item);
    setMode('view');
    setIsOpen(true);
  }, []);

  // Handler para abrir en modo creación
  const openCreate = useCallback(() => {
    setItem(null);
    setMode('create');
    setIsOpen(true);
  }, []);

  // Handler para abrir en modo edición
  const openEdit = useCallback((item: T) => {
    setItem(item);
    setMode('edit');
    setIsOpen(true);
  }, []);

  return {
    // Estados
    isOpen,
    item,
    mode,
    
    // Handlers básicos
    open,
    close,
    setItem,
    
    // Handlers con modo
    openView,
    openCreate,
    openEdit,
    
    // Helpers
    isViewing: mode === 'view',
    isCreating: mode === 'create',
    isEditing: mode === 'edit',
  };
}
