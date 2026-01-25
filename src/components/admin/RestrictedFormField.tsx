import React, { ReactNode } from 'react'
import { Lock } from 'lucide-react'

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
  restrictionMessage = 'Você não tem permissão para editar este campo',
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {isRestricted && (
          <Lock className="inline-block ml-2 text-amber-600" size={14} />
        )}
      </label>

      {isRestricted ? (
        <div className="relative">
          <div className="pointer-events-none opacity-60">
            {children}
          </div>
          <div className="absolute inset-0 bg-amber-50/50 border border-amber-200 rounded-md flex items-center justify-center cursor-not-allowed">
            <div className="text-center px-4">
              <Lock className="mx-auto text-amber-600 mb-1" size={20} />
              <p className="text-xs text-amber-700 font-medium">
                {restrictionMessage}
              </p>
            </div>
          </div>
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
        required={required}
        disabled={isRestricted || inputProps.disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
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
        required={required}
        disabled={isRestricted || selectProps.disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
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
        required={required}
        disabled={isRestricted || textareaProps.disabled}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
      />
    </RestrictedFormField>
  )
}
