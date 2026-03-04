/**
 * ClientTypeSelector Component
 * 
 * Selector visual para tipo de cliente (Pessoa Física/Jurídica)
 * 
 * @principle SRP - Solo responsable de renderizar el selector
 * @principle KISS - Implementación simple con botones
 */

import { TipoCliente } from '@/types/cliente';
import { User, Building2 } from 'lucide-react';

/**
 * Props del componente
 */
export interface ClientTypeSelectorProps {
  /** Valor actual del tipo de cliente */
  value: TipoCliente;
  /** Callback cuando cambia el tipo */
  onChange: (tipo: TipoCliente) => void;
  /** Si está deshabilitado (ej: usuario no admin) */
  disabled?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * Selector de tipo de cliente (Pessoa Física/Jurídica)
 * 
 * @example
 * ```tsx
 * <ClientTypeSelector
 *   value={formData.tipo_cliente}
 *   onChange={(tipo) => setFormData({...formData, tipo_cliente: tipo})}
 *   disabled={!isAdmin}
 * />
 * ```
 */
export function ClientTypeSelector({ 
  value, 
  onChange, 
  disabled = false,
  className = ''
}: ClientTypeSelectorProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-neutral-700">
        Tipo de Cliente <span className="text-red-500">*</span>
      </label>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Pessoa Física */}
        <button
          type="button"
          onClick={() => !disabled && onChange('PF')}
          disabled={disabled}
          className={`
            flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all
            ${value === 'PF' 
              ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm' 
              : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          `}
          aria-pressed={value === 'PF'}
        >
          <User size={20} className="flex-shrink-0" />
          <div className="text-left">
            <div className="font-medium">Pessoa Física</div>
            <div className="text-xs opacity-75">CPF</div>
          </div>
        </button>
        
        {/* Pessoa Jurídica */}
        <button
          type="button"
          onClick={() => !disabled && onChange('PJ')}
          disabled={disabled}
          className={`
            flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all
            ${value === 'PJ' 
              ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm' 
              : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400 hover:bg-neutral-50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          `}
          aria-pressed={value === 'PJ'}
        >
          <Building2 size={20} className="flex-shrink-0" />
          <div className="text-left">
            <div className="font-medium">Pessoa Jurídica</div>
            <div className="text-xs opacity-75">CNPJ</div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default ClientTypeSelector;
