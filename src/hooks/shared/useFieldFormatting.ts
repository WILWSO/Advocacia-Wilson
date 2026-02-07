/**
 * Hook centralizado para formateo automático de campos (SSoT para field formatting)
 * 
 * Elimina lógica de formateo dispersa en hooks de formulário.
 * Aplica formatação automática baseada no tipo/nome do campo.
 * Integra com fieldFormatters.ts existente.
 * 
 * @example
 * const formatting = useFieldFormatting()
 * 
 * // Formatação automática
 * const formattedData = formatting.formatFormData(rawFormData)
 * 
 * // Formatação de campo individual
 * const formattedValue = formatting.formatField('email', 'TESTE@GMAIL.COM') // -> 'teste@gmail.com'
 */

import { useCallback } from 'react'
import { formatFormData, toUpperCase, toLowerCase } from '../../utils/fieldFormatters'

// Tipos de formatação por categoria
type FieldFormatType = 
  | 'uppercase'      // Nome, endereço, cidade, etc.
  | 'lowercase'      // Email
  | 'capitalize'     // Nomes próprios
  | 'document'       // CPF, CNPJ, RG
  | 'phone'          // Telefones
  | 'currency'       // Valores monetários
  | 'percentage'     // Percentuais
  | 'none'           // Sem formatação

// Configuração de formatação por tipo de campo
const FIELD_FORMAT_CONFIG: Record<string, FieldFormatType> = {
  // Campos que devem ir para uppercase
  nome: 'uppercase',
  nome_completo: 'uppercase', 
  numero_documento: 'uppercase',
  endereco: 'uppercase',
  numero: 'uppercase',
  complemento: 'uppercase',
  bairro: 'uppercase',
  cidade: 'uppercase',
  estado: 'uppercase',
  pais: 'uppercase',
  nacionalidade: 'uppercase',
  profissao: 'uppercase',
  como_conheceu: 'uppercase',
  indicado_por: 'uppercase',
  categoria: 'uppercase',
  observacoes: 'uppercase',
  
  // Campos que devem ir para lowercase
  email: 'lowercase',
  
  // Documentos (formatação específica)
  cpf_cnpj: 'document',
  rg: 'document',
  
  // Telefones (formatação específica)
  telefone: 'phone',
  celular: 'phone',
  telefone_alternativo: 'phone',
  whatsapp: 'phone',
  
  // Valores monetários
  valor: 'currency',
  honorarios: 'currency',
  custas: 'currency',
  
  // Sem formatação (manter como está)
  data_nascimento: 'none',
  data_criacao: 'none',
  data_atualizacao: 'none',
  id: 'none',
  foto_perfil_url: 'none'
}

interface UseFieldFormattingReturn {
  // Formatação automática completa
  formatFormData: (data: Record<string, any>) => Record<string, any>
  
  // Formatação de campo individual
  formatField: (fieldName: string, value: any) => any
  
  // Detectar tipo de formatação necessária
  getFieldFormatType: (fieldName: string) => FieldFormatType
  
  // Aplicar formatação específica
  applyUppercase: (value: string) => string
  applyLowercase: (value: string) => string
  applyCapitalize: (value: string) => string
  applyDocumentFormat: (value: string) => string
  applyPhoneFormat: (value: string) => string
  applyCurrencyFormat: (value: number | string) => string
  
  // Validar se campo precisa formatação
  needsFormatting: (fieldName: string) => boolean
}

export function useFieldFormatting(): UseFieldFormattingReturn {
  
  // Formatação de campo individual
  const formatField = useCallback((fieldName: string, value: any): any => {
    if (value === null || value === undefined || value === '') {
      return value
    }
    
    const formatType = FIELD_FORMAT_CONFIG[fieldName] || 'none'
    
    switch (formatType) {
      case 'uppercase':
        return typeof value === 'string' ? toUpperCase(value) : value
        
      case 'lowercase':
        return typeof value === 'string' ? toLowerCase(value) : value
        
      case 'capitalize':
        return typeof value === 'string' ? 
          value.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase()) : value
        
      case 'document':
        // Para documentos, apenas uppercase (formatação específica seria feita por library externa)
        return typeof value === 'string' ? toUpperCase(value.trim()) : value
        
      case 'phone':
        // Para telefones, remover caracteres não numéricos e manter apenas números
        return typeof value === 'string' ? 
          value.replace(/\D/g, '').substring(0, 15) : value // Limite de 15 dígitos
        
      case 'currency':
        // Para valores monetários, converter para número se necessário
        if (typeof value === 'string') {
          const numericValue = parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.'))
          return isNaN(numericValue) ? 0 : numericValue
        }
        return typeof value === 'number' ? value : 0
        
      case 'none':
      default:
        return value
    }
  }, [])

  // Detectar tipo de formatação
  const getFieldFormatType = useCallback((fieldName: string): FieldFormatType => {
    return FIELD_FORMAT_CONFIG[fieldName] || 'none'
  }, [])

  // Formatação automática completa (usar formatFormData existente como base)
  const formatFormDataHook = useCallback((data: Record<string, any>): Record<string, any> => {
    // Usar formatFormData existente primeiro
    const baseFormatted = formatFormData(data)
    
    // Aplicar formatações adicionais campo por campo
    const finalFormatted = { ...baseFormatted }
    
    Object.keys(finalFormatted).forEach(fieldName => {
      finalFormatted[fieldName] = formatField(fieldName, finalFormatted[fieldName])
    })
    
    return finalFormatted
  }, [formatField])

  // Funções de formatação específicas
  const applyUppercase = useCallback((value: string): string => {
    return toUpperCase(value)
  }, [])

  const applyLowercase = useCallback((value: string): string => {
    return toLowerCase(value)
  }, [])

  const applyCapitalize = useCallback((value: string): string => {
    return value.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
  }, [])

  const applyDocumentFormat = useCallback((value: string): string => {
    return toUpperCase(value.trim())
  }, [])

  const applyPhoneFormat = useCallback((value: string): string => {
    return value.replace(/\D/g, '').substring(0, 15)
  }, [])

  const applyCurrencyFormat = useCallback((value: number | string): string => {
    const numValue = typeof value === 'string' ? 
      parseFloat(value.replace(/[^\d.,]/g, '').replace(',', '.')) : value
    
    return isNaN(numValue) ? '0,00' : 
      numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }, [])

  // Verificar se campo precisa formatação
  const needsFormatting = useCallback((fieldName: string): boolean => {
    return FIELD_FORMAT_CONFIG[fieldName] !== 'none' && 
           FIELD_FORMAT_CONFIG[fieldName] !== undefined
  }, [])

  return {
    formatFormData: formatFormDataHook,
    formatField,
    getFieldFormatType,
    applyUppercase,
    applyLowercase, 
    applyCapitalize,
    applyDocumentFormat,
    applyPhoneFormat,
    applyCurrencyFormat,
    needsFormatting
  }
}

// Hook especializado para formatação em tempo real (onChange)
export function useRealTimeFormatting() {
  const formatting = useFieldFormatting()
  
  const handleFieldChange = useCallback((
    fieldName: string,
    value: any,
    setFormData: (updater: (prev: any) => any) => void
  ) => {
    const formattedValue = formatting.formatField(fieldName, value)
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: formattedValue
    }))
  }, [formatting])
  
  return {
    ...formatting,
    handleFieldChange
  }
}

// Export da configuração para uso em outros locais se necessário
export { FIELD_FORMAT_CONFIG }