/**
 * Validaciones centralizadas para formularios (SSoT para validaciones duplicadas)
 * 
 * Elimina duplicação de validações de email, documentos, campos requeridos
 * que estão espalhadas pelos hooks de formulário. Unifica mensagens de erro
 * e padrões de validação.
 * 
 * @example
 * const validation = useFormValidation()
 * 
 * // Validar email duplicado
 * const emailError = validation.validateEmailDuplicate(email, existingEmails, currentId)
 * 
 * // Validar campos requeridos 
 * const requiredError = validation.validateRequiredFields(formData, requiredFieldsConfig)
 */

import { useCallback } from 'react'
// import { FormValidator } from '../../lib/validation/FormValidator' // TODO: Implementar cuando exista
import { useFormNotifications } from './useFormNotifications'

// Tipos para configurações de validação
interface RequiredFieldConfig {
  field: string
  label: string
  customMessage?: string
}

interface DuplicateCheckConfig<T> {
  items: T[]
  field: keyof T  
  getValue: (item: T) => string | undefined
  currentId?: string | number
  entityName?: string
}

interface UseFormValidationOptions {
  showNotifications?: boolean
  notificationMode?: 'inline' | 'toast' | 'both'
}

interface UseFormValidationReturn {
  // Validação de campos requeridos
  validateRequiredFields: (
    formData: Record<string, unknown>,
    requiredFields: RequiredFieldConfig[]
  ) => string[]
  
  // Validação de duplicatas
  validateEmailDuplicate: <T>(
    email: string,
    config: DuplicateCheckConfig<T>
  ) => string | null
  
  validateCpfCnpjDuplicate: <T>(
    cpfCnpj: string,
    config: DuplicateCheckConfig<T>
  ) => string | null
  
  validateFieldDuplicate: <T>(
    value: string,
    config: DuplicateCheckConfig<T>
  ) => string | null
  
  // Validação completa de formulário
  validateFormData: (
    formData: Record<string, any>,
    validationConfig: {
      requiredFields?: RequiredFieldConfig[]
      duplicateChecks?: Array<{
        field: string
        config: DuplicateCheckConfig<any>
      }>
      customValidations?: Array<{
        field: string
        validator: (value: any) => string | null
      }>
    }
  ) => {
    isValid: boolean
    errors: string[]
    fieldErrors: Record<string, string>
  }
  
  // Helpers para formatação + validação
  formatAndValidateEmail: (email: string) => {
    isValid: any
    formatted: string
    error: string | null
  }
  
  formatAndValidateCpfCnpj: (cpfCnpj: string) => {
    isValid: any
    formatted: string
    error: string | null
  }
}

export function useFormValidation(
  options: UseFormValidationOptions = {}
): UseFormValidationReturn {
  const {
    showNotifications = false,
    notificationMode = 'inline'
  } = options
  
  const notifications = useFormNotifications({
    enableInline: notificationMode === 'inline' || notificationMode === 'both',
    enableToast: notificationMode === 'toast' || notificationMode === 'both'
  })

  // Validação de campos requeridos
  const validateRequiredFields = useCallback((
    formData: Record<string, any>,
    requiredFields: RequiredFieldConfig[]
  ): string[] => {
    const errors: string[] = []
    
    for (const fieldConfig of requiredFields) {
      const value = formData[fieldConfig.field]
      const validation = FormValidator.validateRequired(value, fieldConfig.label)
      
      if (!validation.isValid) {
        const errorMessage = fieldConfig.customMessage || validation.errors[0]
        errors.push(errorMessage)
        
        if (showNotifications) {
          notifications.error(errorMessage)
        }
      }
    }
    
    return errors
  }, [showNotifications, notifications])

  // Validação de email duplicado
  const validateEmailDuplicate = useCallback(<T,>(
    email: string,
    config: DuplicateCheckConfig<T>
  ): string | null => {
    if (!email?.trim()) return null
    
    const normalizedEmail = email.toLowerCase().trim()
    const duplicate = config.items.find(item => {
      const itemValue = config.getValue(item)?.toLowerCase().trim()
      const itemId = (item as any).id
      
      return itemValue === normalizedEmail && 
             (config.currentId ? itemId !== config.currentId : true)
    })
    
    if (duplicate) {
      const entityName = config.entityName || 'item'
      const duplicateName = (duplicate as any).nome || (duplicate as any).nome_completo || 'registro'
      const errorMessage = `Email já cadastrado para ${entityName}: ${duplicateName}`
      
      if (showNotifications) {
        notifications.error(errorMessage)
      }
      
      return errorMessage
    }
    
    return null
  }, [showNotifications, notifications])

  // Validação de CPF/CNPJ duplicado  
  const validateCpfCnpjDuplicate = useCallback(<T,>(
    cpfCnpj: string,
    config: DuplicateCheckConfig<T>
  ): string | null => {
    if (!cpfCnpj?.trim()) return null
    
    const normalizedCpfCnpj = cpfCnpj.toUpperCase().trim()
    const duplicate = config.items.find(item => {
      const itemValue = config.getValue(item)?.toUpperCase().trim()
      const itemId = (item as any).id
      
      return itemValue === normalizedCpfCnpj && 
             (config.currentId ? itemId !== config.currentId : true)
    })
    
    if (duplicate) {
      const entityName = config.entityName || 'item'
      const duplicateName = (duplicate as any).nome || (duplicate as any).nome_completo || 'registro'
      const errorMessage = `CPF/CNPJ já cadastrado para ${entityName}: ${duplicateName}`
      
      if (showNotifications) {
        notifications.error(errorMessage)
      }
      
      return errorMessage
    }
    
    return null
  }, [showNotifications, notifications])

  // Validação genérica de duplicatas
  const validateFieldDuplicate = useCallback(<T,>(
    value: string,
    config: DuplicateCheckConfig<T>
  ): string | null => {
    if (!value?.trim()) return null
    
    const normalizedValue = value.trim()
    const duplicate = config.items.find(item => {
      const itemValue = config.getValue(item)?.trim()
      const itemId = (item as any).id
      
      return itemValue === normalizedValue && 
             (config.currentId ? itemId !== config.currentId : true)
    })
    
    if (duplicate) {
      const entityName = config.entityName || 'item'
      const duplicateName = (duplicate as any).nome || (duplicate as any).nome_completo || 'registro'
      const fieldLabel = String(config.field)
      const errorMessage = `${fieldLabel} já cadastrado para ${entityName}: ${duplicateName}`
      
      if (showNotifications) {
        notifications.error(errorMessage)
      }
      
      return errorMessage
    }
    
    return null
  }, [showNotifications, notifications])

  // Validação completa de formulário
  const validateFormData = useCallback((
    formData: Record<string, any>,
    validationConfig: {
      requiredFields?: RequiredFieldConfig[]
      duplicateChecks?: Array<{
        field: string
        config: DuplicateCheckConfig<any>
      }>
      customValidations?: Array<{
        field: string
        validator: (value: any) => string | null
      }>
    }
  ) => {
    const errors: string[] = []
    const fieldErrors: Record<string, string> = {}
    
    // Validações de campos requeridos
    if (validationConfig.requiredFields) {
      const requiredErrors = validateRequiredFields(formData, validationConfig.requiredFields)
      errors.push(...requiredErrors)
    }
    
    // Validações de duplicatas
    if (validationConfig.duplicateChecks) {
      for (const check of validationConfig.duplicateChecks) {
        const value = formData[check.field]
        const error = validateFieldDuplicate(value, check.config)
        if (error) {
          errors.push(error)
          fieldErrors[check.field] = error
        }
      }
    }
    
    // Validações customizadas
    if (validationConfig.customValidations) {
      for (const validation of validationConfig.customValidations) {
        const value = formData[validation.field]
        const error = validation.validator(value)
        if (error) {
          errors.push(error)
          fieldErrors[validation.field] = error
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      fieldErrors
    }
  }, [validateRequiredFields, validateFieldDuplicate])

  // Helper: Format + Validate Email
  const formatAndValidateEmail = useCallback((email: string) => {
    const formatted = email.toLowerCase().trim()
    const validation = FormValidator.validateEmail(formatted)
    
    return {
      formatted,
      error: validation.isValid ? null : validation.errors[0]
    }
  }, [])

  // Helper: Format + Validate CPF/CNPJ
  const formatAndValidateCpfCnpj = useCallback((cpfCnpj: string) => {
    const formatted = cpfCnpj.toUpperCase().trim()
    const validation = FormValidator.validateCpfCnpj(formatted)
    
    return {
      formatted,
      error: validation.isValid ? null : validation.errors[0]
    }
  }, [])

  return {
    validateRequiredFields,
    validateEmailDuplicate,
    validateCpfCnpjDuplicate,
    validateFieldDuplicate,
    validateFormData,
    formatAndValidateEmail,
    formatAndValidateCpfCnpj
  }
}