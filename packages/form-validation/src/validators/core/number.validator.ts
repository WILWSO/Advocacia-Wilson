/**
 * Number validator
 * Validates numeric values with various constraints
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  CommonValidatorOptions,
} from '../../types/validator.types';

/**
 * Number validator options
 */
export interface NumberValidatorOptions extends CommonValidatorOptions {
  /** Custom error message */
  message?: string;
  /** Minimum value (inclusive) */
  min?: number;
  /** Maximum value (inclusive) */
  max?: number;
  /** Allow only integers */
  integer?: boolean;
  /** Allow only positive numbers */
  positive?: boolean;
  /** Allow only negative numbers */
  negative?: boolean;
  /** Allow zero */
  allowZero?: boolean;
  /** Multiple of this number */
  multipleOf?: number;
  /** Maximum decimal places */
  decimals?: number;
  /** Custom min error message */
  minMessage?: string;
  /** Custom max error message */
  maxMessage?: string;
}

/**
 * Check if value is a valid number
 */
function isNumeric(value: any): boolean {
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value);
  }
  if (typeof value === 'string') {
    return value.trim() !== '' && !isNaN(Number(value)) && isFinite(Number(value));
  }
  return false;
}

/**
 * Convert value to number
 */
function toNumber(value: any): number {
  if (typeof value === 'number') return value;
  return Number(value);
}

/**
 * Count decimal places
 */
function countDecimals(num: number): number {
  if (Math.floor(num) === num) return 0;
  const str = num.toString();
  if (str.indexOf('.') !== -1) {
    const decimalPart = str.split('.')[1];
    return decimalPart ? decimalPart.length : 0;
  }
  return 0;
}

/**
 * Create a number validator
 * 
 * @example
 * ```ts
 * // Basic number validation
 * const validator = createNumberValidator();
 * validator.validate(42); // { isValid: true }
 * validator.validate('abc'); // { isValid: false }
 * 
 * // With constraints
 * const validator2 = createNumberValidator({ min: 0, max: 100 });
 * validator2.validate(50); // { isValid: true }
 * validator2.validate(150); // { isValid: false }
 * 
 * // Integer only
 * const validator3 = createNumberValidator({ integer: true });
 * validator3.validate(42); // { isValid: true }
 * validator3.validate(42.5); // { isValid: false }
 * 
 * // Positive only
 * const validator4 = createNumberValidator({ positive: true });
 * validator4.validate(10); // { isValid: true }
 * validator4.validate(-5); // { isValid: false }
 * ```
 */
export function createNumberValidator(
  options: NumberValidatorOptions = {}
): Validator<number | string> {
  const {
    message = 'Please enter a valid number',
    min,
    max,
    integer = false,
    positive = false,
    negative = false,
    allowZero = true,
    multipleOf,
    decimals,
    minMessage,
    maxMessage,
    allowNull = false,
    allowUndefined = false,
  } = options;

  // Validation: positive and negative cannot both be true
  if (positive && negative) {
    throw new Error('NumberValidator cannot have both positive and negative set to true');
  }

  const config: ValidatorConfig<number | string> = {
    name: 'number',
    message,
    validate: (value: number | string, context?: ValidationContext): ValidationResult => {
      // Handle null/undefined
      if (value === null && allowNull) return { isValid: true };
      if (value === undefined && allowUndefined) return { isValid: true };
      if (value === '' && options.allowEmpty) return { isValid: true };

      // Check if numeric
      if (!isNumeric(value)) {
        return {
          isValid: false,
          error: message,
          details: { value, fieldName: context?.fieldName },
        };
      }

      const num = toNumber(value);

      // Check zero
      if (num === 0 && !allowZero) {
        return {
          isValid: false,
          error: 'Zero is not allowed',
          details: { value: num, fieldName: context?.fieldName },
        };
      }

      // Check positive
      if (positive && num <= 0) {
        return {
          isValid: false,
          error: 'Number must be positive',
          details: { value: num, fieldName: context?.fieldName },
        };
      }

      // Check negative
      if (negative && num >= 0) {
        return {
          isValid: false,
          error: 'Number must be negative',
          details: { value: num, fieldName: context?.fieldName },
        };
      }

      // Check integer
      if (integer && !Number.isInteger(num)) {
        return {
          isValid: false,
          error: 'Number must be an integer',
          details: { value: num, fieldName: context?.fieldName },
        };
      }

      // Check decimals
      if (decimals !== undefined) {
        const actualDecimals = countDecimals(num);
        if (actualDecimals > decimals) {
          return {
            isValid: false,
            error: `Number must have at most ${decimals} decimal places`,
            details: { value: num, decimals: actualDecimals, maxDecimals: decimals, fieldName: context?.fieldName },
          };
        }
      }

      // Check min
      if (min !== undefined && num < min) {
        return {
          isValid: false,
          error: minMessage || `Number must be at least ${min}`,
          details: { value: num, min, fieldName: context?.fieldName },
        };
      }

      // Check max
      if (max !== undefined && num > max) {
        return {
          isValid: false,
          error: maxMessage || `Number must be at most ${max}`,
          details: { value: num, max, fieldName: context?.fieldName },
        };
      }

      // Check multiple of
      if (multipleOf !== undefined && num % multipleOf !== 0) {
        return {
          isValid: false,
          error: `Number must be a multiple of ${multipleOf}`,
          details: { value: num, multipleOf, fieldName: context?.fieldName },
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
 * Convenience validators
 */
export function createIntegerValidator(options: Omit<NumberValidatorOptions, 'integer'> = {}) {
  return createNumberValidator({ ...options, integer: true });
}

export function createPositiveNumberValidator(options: Omit<NumberValidatorOptions, 'positive'> = {}) {
  return createNumberValidator({ ...options, positive: true });
}

export function createNegativeNumberValidator(options: Omit<NumberValidatorOptions, 'negative'> = {}) {
  return createNumberValidator({ ...options, negative: true });
}

export function createRangeValidator(min: number, max: number, options: Omit<NumberValidatorOptions, 'min' | 'max'> = {}) {
  return createNumberValidator({ ...options, min, max });
}

/**
 * Standalone number validation function
 */
export function validateNumber(
  value: number | string,
  options: NumberValidatorOptions = {}
): ValidationResult {
  const validator = createNumberValidator(options);
  return validator.validate(value) as ValidationResult;
}

// Default export
export default createNumberValidator;
