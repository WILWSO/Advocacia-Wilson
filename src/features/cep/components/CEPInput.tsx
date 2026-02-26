/**
 * Input de CEP inteligente con busca automática
 * Componente completo e standalone
 */

import { useState, useEffect, useRef } from 'react'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { CEPInputProps } from '../types/cep.types'
import { CEPSearchButton } from './CEPSearchButton'
import { useCEPLookup } from '../hooks/useCEPLookup'
import { formatCEPOnType, isCEPComplete } from '../utils/cepFormatter'
import { cn } from '../../../utils/cn'

export const CEPInput: React.FC<CEPInputProps> = ({
  value,
  onChange,
  onAddressFound,
  autoSearch = false,
  disabled = false,
  className,
  placeholder = '00000-000',
  showSearchButton = true,
  enableCache = true
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [feedbackMessage, setFeedbackMessage] = useState<string>('')
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null)
  const isFirstRender = useRef(true)

  // Hook de busca
  const { 
    loading, 
    searchCEP, 
    searchCEPDebounced 
  } = useCEPLookup({
    enableCache,
    autoSearch,
    onSuccess: (cepData) => {
      setFeedbackMessage('Endereço encontrado!')
      setFeedbackType('success')
      onAddressFound?.(cepData)
      
      // Limpar feedback após 3 segundos
      setTimeout(() => {
        setFeedbackMessage('')
        setFeedbackType(null)
      }, 3000)
    },
    onError: (cepError) => {
      setFeedbackMessage(cepError.message)
      setFeedbackType('error')
      
      // Limpar feedback de erro após 5 segundos
      setTimeout(() => {
        setFeedbackMessage('')
        setFeedbackType(null)
      }, 5000)
    }
  })

  // Sincronizar valor externo con estado interno
  useEffect(() => {
    if (value !== inputValue && !isFirstRender.current) {
      setInputValue(value)
    }
    isFirstRender.current = false
  }, [value, inputValue])

  // Handler de mudança
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const formattedValue = formatCEPOnType(rawValue)
    
    setInputValue(formattedValue)
    onChange(formattedValue)

    // Limpar feedback ao digitar
    setFeedbackMessage('')
    setFeedbackType(null)

    // Auto-search se habilitado e CEP completo
    if (autoSearch && isCEPComplete(formattedValue)) {
      searchCEPDebounced(formattedValue)
    }
  }

  // Handler de busca manual
  const handleSearch = () => {
    if (inputValue && isCEPComplete(inputValue)) {
      searchCEP(inputValue)
    }
  }

  // Handler de blur (se não for auto-search)
  const handleBlur = () => {
    if (!autoSearch && isCEPComplete(inputValue)) {
      searchCEP(inputValue)
    }
  }

  // Determinar estado visual do input
  const inputState = loading ? 'loading' : feedbackType || 'idle'

  return (
    <div className="w-full">
      <div className="relative flex items-center gap-2">
        {/* Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled || loading}
            placeholder={placeholder}
            maxLength={9}
            className={cn(
              'w-full px-3 py-2 pr-10',
              'border rounded-lg',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              
              // Estados
              inputState === 'idle' && [
                'border-neutral-300',
                'focus:ring-primary-500 focus:border-primary-500'
              ],
              
              inputState === 'loading' && [
                'border-primary-300 bg-primary-50',
                'focus:ring-primary-400 focus:border-primary-400'
              ],
              
              inputState === 'success' && [
                'border-green-500 bg-green-50',
                'focus:ring-green-400 focus:border-green-500'
              ],
              
              inputState === 'error' && [
                'border-red-500 bg-red-50',
                'focus:ring-red-400 focus:border-red-500'
              ],
              
              (disabled || loading) && 'opacity-60 cursor-not-allowed',
              
              className
            )}
          />

          {/* Ícone de estado */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {loading && (
              <Loader2 
                size={18} 
                className="text-primary-600 animate-spin" 
                aria-label="Carregando"
              />
            )}
            
            {!loading && feedbackType === 'success' && (
              <CheckCircle2 
                size={18} 
                className="text-green-600" 
                aria-label="Sucesso"
              />
            )}
            
            {!loading && feedbackType === 'error' && (
              <AlertCircle 
                size={18} 
                className="text-red-600" 
                aria-label="Erro"
              />
            )}
          </div>
        </div>

        {/* Botão de busca (opcional) */}
        {showSearchButton && (
          <CEPSearchButton
            cep={inputValue}
            onSearch={handleSearch}
            loading={loading}
            disabled={disabled || !isCEPComplete(inputValue)}
          />
        )}
      </div>

      {/* Mensagem de feedback */}
      {feedbackMessage && (
        <div
          className={cn(
            'mt-2 text-sm flex items-start gap-2',
            feedbackType === 'success' && 'text-green-700',
            feedbackType === 'error' && 'text-red-700'
          )}
          role="alert"
          aria-live="polite"
        >
          {feedbackType === 'success' && <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" />}
          {feedbackType === 'error' && <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />}
          <span>{feedbackMessage}</span>
        </div>
      )}
    </div>
  )
}
