/**
 * Field-related types
 * 
 * Shared types for field configuration, validation, and formatting
 */

import type { Validator } from './validator.types';
import type { Formatter } from './formatter.types';

/**
 * Field type enumeration
 */
export type FieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'date'
  | 'datetime'
  | 'time'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'textarea'
  | 'file'
  | 'hidden'
  | 'cpf'
  | 'cnpj'
  | 'cep'
  | 'phone-br'
  | 'currency'
  | 'custom';

/**
 * Field metadata
 */
export interface FieldMetadata {
  /** Field unique identifier */
  id: string;
  /** Field name attribute */
  name: string;
  /** Field type */
  type: FieldType;
  /** Human-readable label */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Helper text */
  hint?: string;
  /** Whether field is required */
  required?: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Whether field is read-only */
  readonly?: boolean;
  /** Field group/section */
  group?: string;
  /** Display order */
  order?: number;
  /** Custom attributes */
  attributes?: Record<string, any>;
}

/**
 * Field validation configuration
 */
export interface FieldValidationConfig {
  /** Single validator or array of validators */
  validators: Validator<any> | Validator<any>[];
  /** Whether to validate on change */
  validateOnChange?: boolean;
  /** Whether to validate on blur */
  validateOnBlur?: boolean;
  /** Debounce time for onChange validation (ms) */
  debounce?: number;
  /** Dependencies - other fields that trigger revalidation */
  dependencies?: string[];
}

/**
 * Field formatting configuration
 */
export interface FieldFormattingConfig {
  /** Single formatter or array of formatters */
  formatters: Formatter<any, any> | Formatter<any, any>[];
  /** When to apply formatting */
  applyOn?: 'change' | 'blur' | 'submit' | 'display';
  /** Whether formatting is display-only */
  displayOnly?: boolean;
}

/**
 * Complete field configuration
 */
export interface FieldConfig extends FieldMetadata {
  /** Initial value */
  initialValue?: any;
  /** Validation configuration */
  validation?: FieldValidationConfig;
  /** Formatting configuration */
  formatting?: FieldFormattingConfig;
  /** Custom field options */
  options?: FieldOptions;
}

/**
 * Field state
 */
export interface FieldState {
  /** Current value */
  value: any;
  /** Original/initial value */
  initialValue: any;
  /** Whether field has been touched */
  touched: boolean;
  /** Whether field has been changed */
  dirty: boolean;
  /** Whether field is currently being validated */
  validating: boolean;
  /** Validation error (if any) */
  error?: string;
  /** Whether field is valid */
  valid: boolean;
  /** Whether field is disabled */
  disabled: boolean;
}

/**
 * Field options for different field types
 */
export interface FieldOptions {
  /** Select/Radio options */
  choices?: Array<{
    label: string;
    value: any;
    disabled?: boolean;
    group?: string;
  }>;
  /** Min value (for numbers/dates) */
  min?: number | string | Date;
  /** Max value (for numbers/dates) */
  max?: number | string | Date;
  /** Step value (for numbers) */
  step?: number;
  /** Pattern (regex) */
  pattern?: string | RegExp;
  /** Min length */
  minLength?: number;
  /** Max length */
  maxLength?: number;
  /** Accept (for file inputs) */
  accept?: string;
  /** Multiple selection/files */
  multiple?: boolean;
  /** Autocomplete attribute */
  autocomplete?: string;
  /** Custom options */
  custom?: Record<string, any>;
}

/**
 * Field rule - combines validation and formatting
 */
export interface FieldRule {
  /** Field type or name pattern */
  matcher: FieldType | RegExp | ((field: FieldMetadata) => boolean);
  /** Validators to apply */
  validators?: Validator<any>[];
  /** Formatters to apply */
  formatters?: Formatter<any, any>[];
  /** Default options */
  defaultOptions?: Partial<FieldOptions>;
}

/**
 * Field value type inference
 */
export type FieldValue<T extends FieldType> = 
  T extends 'checkbox' ? boolean :
  T extends 'number' | 'currency' ? number :
  T extends 'date' | 'datetime' | 'time' ? Date :
  T extends 'file' ? File | File[] :
  T extends 'select' ? string | string[] :
  string;

/**
 * Form values type
 */
export type FormValues = Record<string, any>;

/**
 * Form errors type
 */
export type FormErrors = Record<string, string | undefined>;

/**
 * Form touched fields type
 */
export type FormTouched = Record<string, boolean>;

/**
 * Form configuration
 */
export interface FormConfig {
  /** Form fields */
  fields: Record<string, FieldConfig>;
  /** Initial values */
  initialValues?: FormValues;
  /** Global validation options */
  validation?: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    validateOnMount?: boolean;
    debounce?: number;
  };
  /** Global formatting options */
  formatting?: {
    formatOnChange?: boolean;
    formatOnBlur?: boolean;
    formatOnSubmit?: boolean;
  };
}

/**
 * Form state
 */
export interface FormState {
  /** Current values */
  values: FormValues;
  /** Initial values */
  initialValues: FormValues;
  /** Validation errors */
  errors: FormErrors;
  /** Touched fields */
  touched: FormTouched;
  /** Whether form is submitting */
  submitting: boolean;
  /** Whether form is validating */
  validating: boolean;
  /** Whether form is valid */
  valid: boolean;
  /** Whether form has been modified */
  dirty: boolean;
}
