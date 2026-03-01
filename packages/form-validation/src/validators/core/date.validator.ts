/**
 * Date validator
 * Validates dates with various constraints
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  CommonValidatorOptions,
} from '../../types/validator.types';

/**
 * Date validator options
 */
export interface DateValidatorOptions extends CommonValidatorOptions {
  /** Custom error message */
  message?: string;
  /** Minimum date */
  min?: Date | string | number;
  /** Maximum date */
  max?: Date | string | number;
  /** Allow future dates */
  allowFuture?: boolean;
  /** Allow past dates */
  allowPast?: boolean;
  /** Require date to be today */
  today?: boolean;
  /** Input format (for string parsing) */
  format?: 'iso' | 'timestamp' | 'auto';
  /** Custom min error message */
  minMessage?: string;
  /** Custom max error message */
  maxMessage?: string;
}

/**
 * Check if value is a valid date
 */
function isValidDate(value: any): boolean {
  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
  return false;
}

/**
 * Convert value to Date object
 */
function toDate(value: Date | string | number): Date | null {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

/**
 * Check if two dates are on the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Get start of day (00:00:00.000)
 */
function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Create a date validator
 * 
 * @example
 * ```ts
 * // Basic date validation
 * const validator = createDateValidator();
 * validator.validate(new Date()); // { isValid: true }
 * validator.validate('2024-01-15'); // { isValid: true }
 * validator.validate('invalid'); // { isValid: false }
 * 
 * // With min/max
 * const validator2 = createDateValidator({
 *   min: '2024-01-01',
 *   max: '2024-12-31'
 * });
 * validator2.validate('2024-06-15'); // { isValid: true }
 * validator2.validate('2025-01-01'); // { isValid: false }
 * 
 * // No future dates
 * const validator3 = createDateValidator({ allowFuture: false });
 * validator3.validate(new Date()); // { isValid: true }
 * validator3.validate('2099-01-01'); // { isValid: false }
 * 
 * // Must be today
 * const validator4 = createDateValidator({ today: true });
 * validator4.validate(new Date()); // { isValid: true }
 * ```
 */
export function createDateValidator(
  options: DateValidatorOptions = {}
): Validator<Date | string | number> {
  const {
    message = 'Please enter a valid date',
    min,
    max,
    allowFuture = true,
    allowPast = true,
    today = false,
    minMessage,
    maxMessage,
    allowNull = false,
    allowUndefined = false,
  } = options;

  // Parse min/max dates
  const minDate = min ? toDate(min) : null;
  const maxDate = max ? toDate(max) : null;

  if (min && !minDate) {
    throw new Error('Invalid min date provided');
  }
  if (max && !maxDate) {
    throw new Error('Invalid max date provided');
  }

  const config: ValidatorConfig<Date | string | number> = {
    name: 'date',
    message,
    validate: (value: Date | string | number, context?: ValidationContext): ValidationResult => {
      // Handle null/undefined
      if (value === null && allowNull) return { isValid: true };
      if (value === undefined && allowUndefined) return { isValid: true };
      if (value === '' && options.allowEmpty) return { isValid: true };

      // Check if valid date
      if (!isValidDate(value)) {
        return {
          isValid: false,
          error: message,
          details: { value, fieldName: context?.fieldName },
        };
      }

      const date = toDate(value);
      if (!date) {
        return {
          isValid: false,
          error: message,
          details: { value, fieldName: context?.fieldName },
        };
      }

      const now = new Date();

      // Check if today
      if (today && !isSameDay(date, now)) {
        return {
          isValid: false,
          error: 'Date must be today',
          details: { value: date, fieldName: context?.fieldName },
        };
      }

      // Check future
      if (!allowFuture && date > now) {
        return {
          isValid: false,
          error: 'Future dates are not allowed',
          details: { value: date, fieldName: context?.fieldName },
        };
      }

      // Check past
      if (!allowPast && date < startOfDay(now)) {
        return {
          isValid: false,
          error: 'Past dates are not allowed',
          details: { value: date, fieldName: context?.fieldName },
        };
      }

      // Check min date
      if (minDate && date < minDate) {
        return {
          isValid: false,
          error: minMessage || `Date must be on or after ${minDate.toLocaleDateString()}`,
          details: { value: date, min: minDate, fieldName: context?.fieldName },
        };
      }

      // Check max date
      if (maxDate && date > maxDate) {
        return {
          isValid: false,
          error: maxMessage || `Date must be on or before ${maxDate.toLocaleDateString()}`,
          details: { value: date, max: maxDate, fieldName: context?.fieldName },
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
export function createPastDateValidator(options: Omit<DateValidatorOptions, 'allowPast' | 'allowFuture'> = {}) {
  return createDateValidator({ ...options, allowFuture: false, allowPast: true });
}

export function createFutureDateValidator(options: Omit<DateValidatorOptions, 'allowPast' | 'allowFuture'> = {}) {
  return createDateValidator({ ...options, allowFuture: true, allowPast: false });
}

export function createTodayValidator(options: Omit<DateValidatorOptions, 'today'> = {}) {
  return createDateValidator({ ...options, today: true });
}

export function createDateRangeValidator(
  min: Date | string | number,
  max: Date | string | number,
  options: Omit<DateValidatorOptions, 'min' | 'max'> = {}
) {
  return createDateValidator({ ...options, min, max });
}

/**
 * Standalone date validation function
 */
export function validateDate(
  value: Date | string | number,
  options: DateValidatorOptions = {}
): ValidationResult {
  const validator = createDateValidator(options);
  return validator.validate(value) as ValidationResult;
}

// Default export
export default createDateValidator;
