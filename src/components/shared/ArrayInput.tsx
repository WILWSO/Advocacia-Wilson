/**
 * Componente para inputs de tipo array
 * Permite agregar/eliminar items dinámicamente
 * Patrón: Botón "+" al final agrega campos arriba con foco automático
 */

import { Plus, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ArrayInputProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  helperText?: string;
  maxItems?: number;
  id?: string;
}

export const ArrayInput = ({ 
  label, 
  value = [], 
  onChange, 
  placeholder = "Digite aqui...",
  helperText,
  maxItems = 10,
  id
}: ArrayInputProps) => {
  
  const lastInputRef = useRef<HTMLInputElement>(null);
  const shouldFocusRef = useRef(false);

  // Foco automático en el último input cuando se agrega nuevo item
  useEffect(() => {
    if (shouldFocusRef.current && lastInputRef.current) {
      lastInputRef.current.focus();
      shouldFocusRef.current = false;
    }
  }, [value.length]);
  
  const handleAdd = () => {
    if (value.length < maxItems) {
      onChange([...value, '']);
      shouldFocusRef.current = true;
    }
  };

  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
  };

  const handleChange = (index: number, newText: string) => {
    const newValue = [...value];
    newValue[index] = newText;
    onChange(newValue);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="space-y-2">
        {/* Items existentes */}
        {value.map((item, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1 relative">
              <input
                type="text"
                ref={index === value.length - 1 ? lastInputRef : null}
                id={index === 0 ? id : undefined}
                value={item}
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
              title="Remover item"
            >
              <X size={18} />
            </button>
          </div>
        ))}

        {/* Botón "+" al final */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={value.length >= maxItems}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          title="Adicionar item"
        >
          <Plus size={18} />
          <span>Adicionar {label.toLowerCase()}</span>
        </button>
      </div>

      {helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};
