/**
 * Core validator types
 * 
 * This file defines the base interfaces and types for all validators
 */

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  /** Error message if validation failed */
  error?: string;
  /** Additional error details or metadata */
  details?: Record<string, any>;
}

/**
 * Validation error with field information
 */
export interface ValidationError {
  /** Field name that failed validation */
  field: string;
  /** Error message */
  message: string;
  /** Validation rule that failed */
  rule?: string;
  /** Additional context */
  context?: Record<string, any>;
}

/**
 * Validator function signature
 */
export type ValidatorFn<T = any> = (
  value: T,
  context?: ValidationContext
) => ValidationResult | Promise<ValidationResult>;

/**
 * Validation context - provides additional information during validation
 */
export interface ValidationContext {
  /** Field name being validated */
  fieldName?: string;
  /** All form values (for cross-field validation) */
  formValues?: Record<string, any>;
  /** Custom validation options */
  options?: Record<string, any>;
  /** Locale for error messages */
  locale?: string;
}

/**
 * Validator configuration
 */
export interface ValidatorConfig<T = any> {
  /** Validator name/identifier */
  name: string;
  /** Validation function */
  validate: ValidatorFn<T>;
  /** Default error message */
  message?: string;
  /** Whether validation is async */
  async?: boolean;
}

/**
 * Validator with configuration options
 */
export interface Validator<T = any> {
  /** Validator configuration */
  config: ValidatorConfig<T>;
  /** Execute validation */
  validate: (value: T, context?: ValidationContext) => ValidationResult | Promise<ValidationResult>;
  /** Get validator name */
  getName: () => string;
  /** Get default error message */
  getMessage: () => string | undefined;
  /** Check if validator is async */
  isAsync: () => boolean;
}

/**
 * Options for creating validators
 */
export interface CreateValidatorOptions {
  /** Custom error message */
  message?: string;
  /** Custom validation options */
  options?: Record<string, any>;
}

/**
 * Validator factory function
 */
export type ValidatorFactory<T = any, O = any> = (
  options?: O & CreateValidatorOptions
) => Validator<T>;

/**
 * Common validator options
 */
export interface CommonValidatorOptions extends CreateValidatorOptions {
  /** Allow null values */
  allowNull?: boolean;
  /** Allow undefined values */
  allowUndefined?: boolean;
  /** Allow empty strings */
  allowEmpty?: boolean;
  /** Trim whitespace before validation */
  trim?: boolean;
}

/**
 * Composed validator options
 */
export interface ComposedValidatorOptions extends CreateValidatorOptions {
  /** Stop on first error */
  stopOnFirstError?: boolean;
  /** Run validators in parallel (for async validators) */
  parallel?: boolean;
}

/**
 * Conditional validator options
 */
export interface ConditionalValidatorOptions<T = any> extends CreateValidatorOptions {
  /** Condition function to determine if validator should run */
  condition: (value: T, context?: ValidationContext) => boolean;
}

/**
 * Validation schema for an object
 */
export type ValidationSchema<T = any> = {
  [K in keyof T]?: Validator<T[K]> | Validator<T[K]>[] | ValidationSchema<T[K]>;
};

/**
 * Validation errors for a schema
 */
export type ValidationErrors<T = any> = {
  [K in keyof T]?: string | ValidationErrors<T[K]>;
};

/**
 * Schema validation result
 */
export interface SchemaValidationResult<T = any> {
  /** Whether all validations passed */
  isValid: boolean;
  /** Field-level errors */
  errors: ValidationErrors<T>;
  /** List of all validation errors */
  errorList: ValidationError[];
}
