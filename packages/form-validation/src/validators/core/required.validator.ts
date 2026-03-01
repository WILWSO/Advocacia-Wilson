/**
 * Required field validator
 * Validates that a field has a non-empty value
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  CommonValidatorOptions,
} from '../../types/validator.types';

/**
 * Required validator options
 */
export interface RequiredValidatorOptions extends CommonValidatorOptions {
  /** Custom message for required fields */
  message?: string;
  /** Allow whitespace-only strings */
  allowWhitespace?: boolean;
}

/**
 * Check if value is empty
 */
function isEmpty(value: any, allowWhitespace: boolean = false): boolean {
  // null or undefined
  if (value === null || value === undefined) {
    return true;
  }

  // String
  if (typeof value === 'string') {
    return allowWhitespace ? value.length === 0 : value.trim().length === 0;
  }

  // Array
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  // Object
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  // Boolean false is not considered empty
  if (typeof value === 'boolean') {
    return false;
  }

  // Number 0 is not considered empty
  if (typeof value === 'number') {
    return false;
  }

  return false;
}

/**
 * Create a required field validator
 * 
 * @example
 * ```ts
 * const validator = createRequiredValidator();
 * const result = validator.validate('');
 * // { isValid: false, error: 'This field is required' }
 * 
 * const validator2 = createRequiredValidator({ message: 'Name is required' });
 * const result2 = validator2.validate('John');
 * // { isValid: true }
 * ```
 */
export function createRequiredValidator(
  options: RequiredValidatorOptions = {}
): Validator<any> {
  const {
    message = 'This field is required',
    allowWhitespace = false,
    allowNull = false,
    allowUndefined = false,
  } = options;

  const config: ValidatorConfig<any> = {
    name: 'required',
    message,
    validate: (value: any, context?: ValidationContext): ValidationResult => {
      // Special cases for allowNull/allowUndefined
      if (allowNull && value === null) {
        return { isValid: true };
      }
      if (allowUndefined && value === undefined) {
        return { isValid: true };
      }

      const empty = isEmpty(value, allowWhitespace);

      if (empty) {
        return {
          isValid: false,
          error: message,
          details: { value, fieldName: context?.fieldName },
        };
      }

      return { isValid: true };
    },
  };

  return {
    config,
    validate: config.validate,
    getName: () => config.name,
    getMessage: () => config.message,
    isAsync: () => false,
  };
}

/**
 * Standalone required validation function
 */
export function validateRequired(
  value: any,
  options: RequiredValidatorOptions = {}
): ValidationResult {
  const validator = createRequiredValidator(options);
  return validator.validate(value) as ValidationResult;
}

// Default export
export default createRequiredValidator;
