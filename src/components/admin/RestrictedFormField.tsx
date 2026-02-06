import React, { ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { ADMIN_UI } from '../../config/messages'

interface RestrictedFormFieldProps {
  label: string
  children: ReactNode
  required?: boolean
  helperText?: string
  isRestricted?: boolean
  restrictionMessage?: string
  className?: string
}

export const RestrictedFormField: React.FC<RestrictedFormFieldProps> = ({
  label,
  children,
  required = false,
  helperText,
  isRestricted = false,
  restrictionMessage = ADMIN_UI.RESTRICTED_FIELD.DEFAULT_MESSAGE,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && !isRestricted && <span className="text-red-500 ml-1">*</span>}
        {isRestricted && (
          <span className="inline-flex items-center ml-2 gap-1">
            <Lock className="text-amber-600" size={14} />
            <span className="text-amber-600 font-semibold text-xs">({restrictionMessage})</span>
          </span>
        )}
      </label>

      {isRestricted ? (
        <div className="pointer-events-none opacity-70">
          {children}
        </div>
      ) : (
        <>
          {children}
          {helperText && (
            <p className="text-xs text-gray-500 mt-1">{helperText}</p>
          )}
        </>
      )}
    </div>
  )
}

interface RestrictedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  isRestricted?: boolean
  restrictionMessage?: string
  helperText?: string
}

export const RestrictedInput: React.FC<RestrictedInputProps> = ({
  label,
  isRestricted = false,
  restrictionMessage,
  helperText,
  required,
  className = '',
  ...inputProps
}) => {
  // Clase base para inputs
  const baseInputClass = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';
  
  // Clase para inputs restringidos (amarillito)
  const restrictedInputClass = 'w-full px-3 py-2 border border-amber-300 rounded-md bg-amber-50 text-gray-700';
  
  // Asegurar que value nunca sea null/undefined (React controlled input requirement)
  const safeValue = inputProps.value ?? '';
  
  return (
    <RestrictedFormField
      label={label}
      required={required}
      isRestricted={isRestricted}
      restrictionMessage={restrictionMessage}
      helperText={helperText}
    >
      <input
        {...inputProps}
        value={safeValue}
        required={required}
        disabled={isRestricted || inputProps.disabled}
        className={`${isRestricted ? restrictedInputClass : baseInputClass} ${className}`}
      />
    </RestrictedFormField>
  )
}

interface RestrictedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  isRestricted?: boolean
  restrictionMessage?: string
  helperText?: string
  children: React.ReactNode
}

export const RestrictedSelect: React.FC<RestrictedSelectProps> = ({
  label,
  isRestricted = false,
  restrictionMessage,
  helperText,
  required,
  children,
  className = '',
  ...selectProps
}) => {
  // Clase base para selects
  const baseSelectClass = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors';
  
  // Clase para selects restringidos (amarillito)
  const restrictedSelectClass = 'w-full px-3 py-2 border border-amber-300 rounded-md bg-amber-50 text-gray-700';
  
  // Asegurar que value nunca sea null/undefined (React controlled input requirement)
  const safeValue = selectProps.value ?? '';
  
  return (
    <RestrictedFormField
      label={label}
      required={required}
      isRestricted={isRestricted}
      restrictionMessage={restrictionMessage}
      helperText={helperText}
    >
      <select
        {...selectProps}
        value={safeValue}
        required={required}
        disabled={isRestricted || selectProps.disabled}
        className={`${isRestricted ? restrictedSelectClass : baseSelectClass} ${className}`}
      >
        {children}
      </select>
    </RestrictedFormField>
  )
}

interface RestrictedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  isRestricted?: boolean
  restrictionMessage?: string
  helperText?: string
}

export const RestrictedTextarea: React.FC<RestrictedTextareaProps> = ({
  label,
  isRestricted = false,
  restrictionMessage,
  helperText,
  required,
  className = '',
  ...textareaProps
}) => {
  // Clase base para textareas
  const baseTextareaClass = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors';
  
  // Clase para textareas restringidos (amarillito)
  const restrictedTextareaClass = 'w-full px-3 py-2 border border-amber-300 rounded-md bg-amber-50 text-gray-700 resize-none';
  
  // Asegurar que value nunca sea null/undefined (React controlled input requirement)
  const safeValue = textareaProps.value ?? '';
  
  return (
    <RestrictedFormField
      label={label}
      required={required}
      isRestricted={isRestricted}
      restrictionMessage={restrictionMessage}
      helperText={helperText}
    >
      <textarea
        {...textareaProps}
        value={safeValue}
        required={required}
        disabled={isRestricted || textareaProps.disabled}
        className={`${isRestricted ? restrictedTextareaClass : baseTextareaClass} ${className}`}
      />
    </RestrictedFormField>
  )
}
