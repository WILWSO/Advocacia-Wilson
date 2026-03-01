/**
 * Length validator
 * Validates string, array, or collection length
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  CommonValidatorOptions,
} from '../../types/validator.types';

/**
 * Length validator options
 */
export interface LengthValidatorOptions extends CommonValidatorOptions {
  /** Minimum length */
  min?: number;
  /** Maximum length */
  max?: number;
  /** Exact length */
  exact?: number;
  /** Custom error message for min length */
  minMessage?: string;
  /** Custom error message for max length */
  maxMessage?: string;
  /** Custom error message for exact length */
  exactMessage?: string;
  /** Count mode for strings */
  countMode?: 'characters' | 'bytes' | 'graphemes';
}

/**
 * Get length of value based on type
 */
function getLength(value: any, countMode: 'characters' | 'bytes' | 'graphemes' = 'characters'): number {
  if (value === null || value === undefined) {
    return 0;
  }

  // String
  if (typeof value === 'string') {
    if (countMode === 'bytes') {
      return new Blob([value]).size;
    } else if (countMode === 'graphemes') {
      // Count graphemes (handles emojis, combining chars, etc.)
      return [...value].length;
    }
    return value.length;
  }

  // Array
  if (Array.isArray(value)) {
    return value.length;
  }

  // Object (count keys)
  if (typeof value === 'object') {
    return Object.keys(value).length;
  }

  // Number (convert to string)
  if (typeof value === 'number') {
    return value.toString().length;
  }

  return 0;
}

/**
 * Create a length validator
 * 
 * @example
 * ```ts
 * // Min length
 * const validator = createLengthValidator({ min: 3 });
 * validator.validate('ab'); // { isValid: false, error: 'Must be at least 3 characters' }
 * 
 * // Max length
 * const validator2 = createLengthValidator({ max: 10 });
 * validator2.validate('hello'); // { isValid: true }
 * 
 * // Exact length
 * const validator3 = createLengthValidator({ exact: 11 });
 * validator3.validate('12345678901'); // { isValid: true }
 * 
 * // Range
 * const validator4 = createLengthValidator({ min: 3, max: 10 });
 * validator4.validate('hello'); // { isValid: true }
 * ```
 */
export function createLengthValidator(
  options: LengthValidatorOptions = {}
): Validator<any> {
  const {
    min,
    max,
    exact,
    minMessage,
    maxMessage,
    exactMessage,
    countMode = 'characters',
    allowNull = false,
    allowUndefined = false,
    allowEmpty = false,
    trim = false,
  } = options;

  // Validation: must have at least one constraint
  if (min === undefined && max === undefined && exact === undefined) {
    throw new Error('LengthValidator requires at least one of: min, max, or exact');
  }

  // Generate default messages
  const defaultMinMessage = min !== undefined ? `Must be at least ${min} characters` : '';
  const defaultMaxMessage = max !== undefined ? `Must be at most ${max} characters` : '';
  const defaultExactMessage = exact !== undefined ? `Must be exactly ${exact} characters` : '';

  const config: ValidatorConfig<any> = {
    name: 'length',
    message: exactMessage || minMessage || maxMessage,
    validate: (value: any, context?: ValidationContext): ValidationResult => {
      // Handle null/undefined/empty
      if (value === null && allowNull) return { isValid: true };
      if (value === undefined && allowUndefined) return { isValid: true };
      if (value === '' && allowEmpty) return { isValid: true };

      // Trim if needed (only for strings)
      const processedValue = (trim && typeof value === 'string') ? value.trim() : value;

      // Get length
      const length = getLength(processedValue, countMode);

      // Check exact length first
      if (exact !== undefined && length !== exact) {
        return {
          isValid: false,
          error: exactMessage || defaultExactMessage,
          details: {
            value: processedValue,
            length,
            expected: exact,
            fieldName: context?.fieldName,
          },
        };
      }

      // Check min length
      if (min !== undefined && length < min) {
        return {
          isValid: false,
          error: minMessage || defaultMinMessage,
          details: {
            value: processedValue,
            length,
            min,
            fieldName: context?.fieldName,
          },
        };
      }

      // Check max length
      if (max !== undefined && length > max) {
        return {
          isValid: false,
          error: maxMessage || defaultMaxMessage,
          details: {
            value: processedValue,
            length,
            max,
            fieldName: context?.fieldName,
          },
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
 * Create a min length validator (convenience function)
 */
export function createMinLengthValidator(
  min: number,
  options: Omit<LengthValidatorOptions, 'min'> = {}
): Validator<any> {
  return createLengthValidator({ ...options, min });
}

/**
 * Create a max length validator (convenience function)
 */
export function createMaxLengthValidator(
  max: number,
  options: Omit<LengthValidatorOptions, 'max'> = {}
): Validator<any> {
  return createLengthValidator({ ...options, max });
}

/**
 * Create an exact length validator (convenience function)
 */
export function createExactLengthValidator(
  exact: number,
  options: Omit<LengthValidatorOptions, 'exact'> = {}
): Validator<any> {
  return createLengthValidator({ ...options, exact });
}

/**
 * Standalone length validation function
 */
export function validateLength(
  value: any,
  options: LengthValidatorOptions
): ValidationResult {
  const validator = createLengthValidator(options);
  return validator.validate(value) as ValidationResult;
}

// Default export
export default createLengthValidator;
