/**
 * Botão de busca de CEP standalone
 * Pode ser usado independentemente ou com CEPInput
 */

import { Search, Loader2 } from 'lucide-react'
import { CEPSearchButtonProps } from '../types/cep.types'
import { cn } from '../../../utils/cn'

export const CEPSearchButton: React.FC<CEPSearchButtonProps> = ({
  cep,
  onSearch,
  loading = false,
  disabled = false,
  className
}) => {
  const handleClick = () => {
    if (!loading && !disabled && cep) {
      onSearch()
    }
  }

  const isDisabled = disabled || loading || !cep

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'px-3 py-2 rounded-lg',
        'text-sm font-medium',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        
        // Estados
        !isDisabled && [
          'bg-primary-600 text-white',
          'hover:bg-primary-700',
          'active:bg-primary-800',
          'focus:ring-primary-500'
        ],
        
        isDisabled && [
          'bg-neutral-300 text-neutral-500',
          'cursor-not-allowed'
        ],
        
        className
      )}
      aria-label="Buscar CEP"
      title="Buscar endereço por CEP"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Buscando...</span>
        </>
      ) : (
        <>
          <Search size={16} />
          <span>Buscar</span>
        </>
      )}
    </button>
  )
}
