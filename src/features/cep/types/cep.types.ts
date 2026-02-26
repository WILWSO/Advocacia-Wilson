/**
 * Tipos TypeScript para el módulo CEP
 */

// Respuesta de la API ViaCEP
export interface CEPData {
  cep: string
  logradouro: string  // endereco/rua
  complemento: string
  bairro: string
  localidade: string  // cidade
  uf: string          // estado (UF)
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean      // ViaCEP retorna { erro: true } cuando no encuentra
}

// Respuesta normalizada del servicio
export interface CEPResponse {
  success: boolean
  data?: CEPData
  error?: CEPError
}

// Tipos de errores posibles
export type CEPErrorCode = 'INVALID_CEP' | 'NOT_FOUND' | 'NETWORK_ERROR' | 'TIMEOUT'

export interface CEPError {
  code: CEPErrorCode
  message: string
}

// Opciones para el hook useCEPLookup
export interface UseCEPLookupOptions {
  enableCache?: boolean      // Habilitar cache de búsquedas
  cacheTimeout?: number      // Tiempo de expiración del cache (ms)
  autoSearch?: boolean       // Buscar automáticamente al completar 8 dígitos
  debounceMs?: number        // Delay para debounce en auto-search
  onSuccess?: (data: CEPData) => void  // Callback de éxito
  onError?: (error: CEPError) => void  // Callback de error
}

// Estado del hook
export interface CEPLookupState {
  loading: boolean
  error: CEPError | null
  data: CEPData | null
}

// Props del componente CEPInput
export interface CEPInputProps {
  value: string
  onChange: (value: string) => void
  onAddressFound?: (data: CEPData) => void
  autoSearch?: boolean
  disabled?: boolean
  className?: string
  placeholder?: string
  showSearchButton?: boolean
  enableCache?: boolean
}

// Props del componente CEPSearchButton
export interface CEPSearchButtonProps {
  cep: string
  onSearch: () => void
  loading?: boolean
  disabled?: boolean
  className?: string
}
