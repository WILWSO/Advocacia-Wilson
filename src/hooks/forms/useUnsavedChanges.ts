/**
 * Hook para detectar cambios no guardados en formularios
 * 
 * Compara el estado inicial con el estado actual para determinar
 * si hay cambios pendientes de guardar.
 * 
 * @example
 * ```tsx
 * const { hasChanges, resetInitial, updateCurrent } = useUnsavedChanges(initialData);
 * 
 * // Actualizar cuando cambian los inputs
 * const handleChange = (e) => {
 *   const newData = { ...data, [e.target.name]: e.target.value };
 *   setData(newData);
 *   updateCurrent(newData);
 * };
 * 
 * // Resetear después de guardar
 * const handleSave = async () => {
 *   await saveData(data);
 *   resetInitial(data);
 * };
 * ```
 */

import { useState, useCallback, useEffect } from 'react';

/**
 * Compara dos objetos para detectar cambios
 * Soporta objetos anidados y arrays
 */
const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
};

interface UseUnsavedChangesReturn<T> {
  /** Indica si hay cambios no guardados */
  hasChanges: boolean;
  /** Actualiza el estado inicial (llamar después de guardar) */
  resetInitial: (newData: T) => void;
  /** Actualiza el estado actual (llamar en cada cambio) */
  updateCurrent: (newData: T) => void;
  /** Marca manualmente que no hay cambios */
  markAsSaved: () => void;
}

/**
 * Hook para detectar y gestionar cambios no guardados
 * 
 * @param initialData - Datos iniciales del formulario
 * @returns Objeto con estado y métodos para gestionar cambios
 */
export const useUnsavedChanges = <T extends Record<string, any>>(
  initialData: T
): UseUnsavedChangesReturn<T> => {
  const [initial, setInitial] = useState<T>(initialData);
  const [current, setCurrent] = useState<T>(initialData);
  
  // Actualizar initial cuando cambia initialData (ej: al cargar datos para editar)
  useEffect(() => {
    setInitial(initialData);
    setCurrent(initialData);
  }, [JSON.stringify(initialData)]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const hasChanges = !deepEqual(initial, current);
  
  const resetInitial = useCallback((newData: T) => {
    setInitial(newData);
    setCurrent(newData);
  }, []);
  
  const updateCurrent = useCallback((newData: T) => {
    setCurrent(newData);
  }, []);
  
  const markAsSaved = useCallback(() => {
    setInitial(current);
  }, [current]);
  
  return {
    hasChanges,
    resetInitial,
    updateCurrent,
    markAsSaved
  };
};
