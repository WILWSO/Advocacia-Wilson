/**
 * Hook para inputs con formateo en tiempo real
 * Mantiene la posición del cursor y formatea según el tipo de campo
 */

import { useCallback, useRef, useEffect } from 'react';
import { formatFieldValue } from '../../utils/fieldFormatters';

interface UseFormattedInputOptions {
  fieldName: string;
  value: string;
  onChange: (value: string) => void;
  formatOnBlur?: boolean; // Para emails, formatear solo al perder foco
}

export const useFormattedInput = ({
  fieldName,
  value,
  onChange,
  formatOnBlur = false,
}: UseFormattedInputOptions) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const cursorPositionRef = useRef<number | null>(null);

  // Preservar posición del cursor después del formateo
  useEffect(() => {
    if (inputRef.current && cursorPositionRef.current !== null) {
      const input = inputRef.current;
      const position = cursorPositionRef.current;
      
      // Restaurar cursor
      input.setSelectionRange(position, position);
      cursorPositionRef.current = null;
    }
  }, [value]);

  // Handler para onChange con formateo en tiempo real
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      const cursorPosition = e.target.selectionStart || 0;

      // Formatear solo si no es formatOnBlur
      if (!formatOnBlur) {
        const formatted = formatFieldValue(fieldName, newValue);
        
        // Calcular nueva posición del cursor (ajustar por diferencia de longitud)
        const lengthDiff = (formatted?.length || 0) - newValue.length;
        cursorPositionRef.current = Math.max(0, cursorPosition + lengthDiff);
        
        onChange(formatted || '');
      } else {
        // Sin formateo en tiempo real, solo actualizar valor
        onChange(newValue);
      }
    },
    [fieldName, onChange, formatOnBlur]
  );

  // Handler para onBlur (para emails y campos especiales)
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (formatOnBlur) {
        const formatted = formatFieldValue(fieldName, e.target.value);
        onChange(formatted || '');
      }
    },
    [fieldName, onChange, formatOnBlur]
  );

  return {
    inputRef,
    value: value || '',
    onChange: handleChange,
    onBlur: handleBlur,
  };
};

/**
 * Versión simplificada para usar directamente en inputs
 */
export const useFormattedField = <T extends Record<string, unknown>>(
  fieldName: string,
  formData: T,
  setFormData: (data: T) => void,
  formatOnBlur = false
) => {
  const value = formData[fieldName] || '';
  
  const onChange = useCallback(
    (newValue: string) => {
      setFormData({ ...formData, [fieldName]: newValue });
    },
    [formData, fieldName, setFormData]
  );

  return useFormattedInput({
    fieldName,
    value: value as string,
    onChange,
    formatOnBlur,
  });
};
