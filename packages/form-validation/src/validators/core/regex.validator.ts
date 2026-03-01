/**
 * Regex (pattern) validator
 * Validates values against regular expression patterns
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  CommonValidatorOptions,
} from '../../types/validator.types';

/**
 * Regex validator options
 */
export interface RegexValidatorOptions extends CommonValidatorOptions {
  /** Regular expression pattern */
  pattern: RegExp | string;
  /** Custom error message */
  message?: string;
  /** Flags for regex (if pattern is string) */
  flags?: string;
  /** Invert match (value must NOT match pattern) */
  invert?: boolean;
}

/**
 * Create a regex from string or use existing RegExp
 */
function createRegex(pattern: RegExp | string, flags?: string): RegExp {
  if (pattern instanceof RegExp) {
    return pattern;
  }
  return new RegExp(pattern, flags);
}

/**
 * Create a regex/pattern validator
 * 
 * @example
 * ```ts
 * // Validate phone pattern
 * const validator = createRegexValidator({
 *   pattern: /^\d{3}-\d{3}-\d{4}$/,
 *   message: 'Phone must be in format: 123-456-7890'
 * });
 * 
 * // Validate alphanumeric
 * const validator2 = createRegexValidator({
 *   pattern: '^[a-zA-Z0-9]+$',
 *   message: 'Only letters and numbers allowed'
 * });
 * 
 * // Invert match (exclude pattern)
 * const validator3 = createRegexValidator({
 *   pattern: /[<>]/,
 *   message: 'Cannot contain < or > characters',
 *   invert: true
 * });
 * ```
 */
export function createRegexValidator(
  options: RegexValidatorOptions
): Validator<string> {
  const {
    pattern,
    message = 'Value does not match required pattern',
    flags,
    invert = false,
    allowNull = false,
    allowUndefined = false,
    allowEmpty = false,
    trim = true,
  } = options;

  if (!pattern) {
    throw new Error('RegexValidator requires a pattern');
  }

  const regex = createRegex(pattern, flags);

  const config: ValidatorConfig<string> = {
    name: 'regex',
    message,
    validate: (value: string, context?: ValidationContext): ValidationResult => {
      // Handle null/undefined/empty
      if (value === null && allowNull) return { isValid: true };
      if (value === undefined && allowUndefined) return { isValid: true };
      if (value === '' && allowEmpty) return { isValid: true };

      if (typeof value !== 'string') {
        return {
          isValid: false,
          error: 'Value must be a string',
          details: { value, fieldName: context?.fieldName },
        };
      }

      // Trim if needed
      const testValue = trim ? value.trim() : value;

      // Test pattern
      const matches = regex.test(testValue);
      const isValid = invert ? !matches : matches;

      if (!isValid) {
        return {
          isValid: false,
          error: message,
          details: {
            value: testValue,
            pattern: pattern.toString(),
            invert,
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
 * Common regex patterns
 */
export const REGEX_PATTERNS = {
  /** Alphanumeric only */
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  /** Letters only */
  ALPHA: /^[a-zA-Z]+$/,
  /** Numbers only */
  NUMERIC: /^\d+$/,
  /** Hexadecimal */
  HEX: /^[0-9A-Fa-f]+$/,
  /** IP Address (v4) */
  IP_V4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
  /** Username (alphanumeric, underscore, hyphen) */
  USERNAME: /^[a-zA-Z0-9_-]+$/,
  /** Slug (lowercase, numbers, hyphen) */
  SLUG: /^[a-z0-9-]+$/,
  /** No special characters */
  NO_SPECIAL_CHARS: /^[a-zA-Z0-9\s]+$/,
  /** Credit card (basic format) */
  CREDIT_CARD: /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/,
} as const;

/**
 * Create validators for common patterns
 */
export function createAlphanumericValidator(options: Omit<RegexValidatorOptions, 'pattern'> = {}) {
  return createRegexValidator({
    ...options,
    pattern: REGEX_PATTERNS.ALPHANUMERIC,
    message: options.message || 'Only letters and numbers are allowed',
  });
}

export function createAlphaValidator(options: Omit<RegexValidatorOptions, 'pattern'> = {}) {
  return createRegexValidator({
    ...options,
    pattern: REGEX_PATTERNS.ALPHA,
    message: options.message || 'Only letters are allowed',
  });
}

export function createNumericValidator(options: Omit<RegexValidatorOptions, 'pattern'> = {}) {
  return createRegexValidator({
    ...options,
    pattern: REGEX_PATTERNS.NUMERIC,
    message: options.message || 'Only numbers are allowed',
  });
}

export function createUsernameValidator(options: Omit<RegexValidatorOptions, 'pattern'> = {}) {
  return createRegexValidator({
    ...options,
    pattern: REGEX_PATTERNS.USERNAME,
    message: options.message || 'Only letters, numbers, underscores and hyphens are allowed',
  });
}

export function createSlugValidator(options: Omit<RegexValidatorOptions, 'pattern'> = {}) {
  return createRegexValidator({
    ...options,
    pattern: REGEX_PATTERNS.SLUG,
    message: options.message || 'Only lowercase letters, numbers and hyphens are allowed',
  });
}

/**
 * Standalone regex validation function
 */
export function validateRegex(
  value: string,
  options: RegexValidatorOptions
): ValidationResult {
  const validator = createRegexValidator(options);
  return validator.validate(value) as ValidationResult;
}

// Default export
export default createRegexValidator;
