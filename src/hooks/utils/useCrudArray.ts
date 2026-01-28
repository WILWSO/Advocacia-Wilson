import { useState } from 'react';

/**
 * Hook genérico para gestionar operaciones CRUD en arrays
 * Elimina duplicación de lógica para Links, Jurisprudencias, Audiencias, etc.
 * 
 * @template T - Tipo de los elementos del array
 * @param initialItems - Array inicial de elementos
 * @returns Objeto con items, estado de edición y funciones CRUD
 * 
 * @example
 * const links = useCrudArray<ProcessoLink>([]);
 * links.addItem({ titulo: 'Test', link: 'https://...' });
 * links.startEdit(0);
 * links.updateItem(0, { titulo: 'Updated', link: 'https://...' });
 * links.deleteItem(0);
 */
export function useCrudArray<T>(initialItems: T[] = []) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempItem, setTempItem] = useState<Partial<T>>({});

  /**
   * Agrega un nuevo item al array
   */
  const addItem = (item: T) => {
    setItems([...items, item]);
  };

  /**
   * Actualiza un item existente en el array
   */
  const updateItem = (index: number, item: T) => {
    const updated = [...items];
    updated[index] = item;
    setItems(updated);
  };

  /**
   * Elimina un item del array
   */
  const deleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  /**
   * Inicia el modo de edición para un item específico
   */
  const startEdit = (index: number) => {
    setEditingIndex(index);
    setTempItem(items[index]);
  };

  /**
   * Cancela el modo de edición y resetea el item temporal
   */
  const cancelEdit = () => {
    setEditingIndex(null);
    setTempItem({});
  };

  /**
   * Resetea el item temporal sin cancelar el modo de edición
   */
  const resetTempItem = () => {
    setTempItem({});
  };

  /**
   * Reemplaza todos los items del array
   */
  const setAllItems = (newItems: T[]) => {
    setItems(newItems);
  };

  return {
    items,
    setItems: setAllItems,
    editingIndex,
    isEditing: editingIndex !== null,
    tempItem,
    setTempItem,
    addItem,
    updateItem,
    deleteItem,
    startEdit,
    cancelEdit,
    resetTempItem,
  };
}
