/**
 * Módulo CEP - API Pública
 * 
 * Exporta apenas o necessário para uso externo.
 * Mantém detalhes de implementação privados.
 */

// Componentes principais
export { CEPInput } from './components/CEPInput'
export { CEPSearchButton } from './components/CEPSearchButton'

// Hook principal
export { useCEPLookup } from './hooks/useCEPLookup'

// Utilidades públicas
export { formatCEP, cleanCEP, formatCEPOnType, isCEPComplete } from './utils/cepFormatter'
export { validateCEP, canSearchCEP } from './utils/cepValidator'

// Serviço (se necessário uso direto)
export { fetchCEP, isViaCEPAvailable } from './services/cepService'

// Tipos
export type {
  CEPData,
  CEPResponse,
  CEPError,
  CEPErrorCode,
  UseCEPLookupOptions,
  CEPLookupState,
  CEPInputProps,
  CEPSearchButtonProps
} from './types/cep.types'

// Constantes úteis
export { CEP_MESSAGES, CEP_REGEX, CEP_LENGTH } from './constants/cep.constants'

// Configuração (se usuário quiser customizar)
export { CEP_CONFIG } from './config/cep.config'
