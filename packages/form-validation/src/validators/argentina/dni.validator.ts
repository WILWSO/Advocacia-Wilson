/**
 * DNI (Documento Nacional de Identidad) Validator
 * Argentine national identity document
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  CreateValidatorOptions,
} from '../../types/validator.types';

/**
 * DNI validator options
 */
export interface DNIValidatorOptions extends CreateValidatorOptions {
  /** Custom error message */
  message?: string;
  /** Allow formatted DNI (with dots) */
  allowFormatted?: boolean;
  /** Minimum DNI length (default: 7) */
  minLength?: number;
  /** Maximum DNI length (default: 8) */
  maxLength?: number;
}

/**
 * Remove non-numeric characters from DNI
 */
function cleanDNI(dni: string): string {
  return dni.replace(/\D/g, '');
}

/**
 * Validate DNI format
 */
function isValidDNI(dni: string, minLength: number, maxLength: number): boolean {
  const cleaned = cleanDNI(dni);

  // Must be between minLength and maxLength digits
  if (cleaned.length < minLength || cleaned.length > maxLength) {
    return false;
  }

  // Must be all digits
  if (!/^\d+$/.test(cleaned)) {
    return false;
  }

  // Reject invalid patterns (all same digit, all zeros)
  if (/^(\d)\1+$/.test(cleaned) || cleaned === '0'.repeat(cleaned.length)) {
    return false;
  }

  return true;
}

/**
 * Create a DNI validator
 * 
 * @example
 * ```ts
 * import { createDNIValidator } from '@wsolutions/form-validation';
 * 
 * const validator = createDNIValidator();
 * await validator.validate('12.345.678'); // { isValid: true }
 * await validator.validate('12345678');   // { isValid: true }
 * await validator.validate('00000000');   // { isValid: false }
 * await validator.validate('123');        // { isValid: false }
 * 
 * // Only accept unformatted DNI
 * const validator2 = createDNIValidator({ allowFormatted: false });
 * await validator2.validate('12.345.678'); // { isValid: false }
 * ```
 */
export function createDNIValidator(
  options: DNIValidatorOptions = {}
): Validator<string> {
  const {
    message = 'DNI inválido',
    allowFormatted = true,
    minLength = 7,
    maxLength = 8,
  } = options;

  const config: ValidatorConfig<string> = {
    name: 'dni',
    message,
    async: false,
    validate: (value: string, _context?: ValidationContext): ValidationResult => {
      // Check type
      if (typeof value !== 'string') {
        return {
          isValid: false,
          error: message,
          details: { code: 'TYPE_ERROR', expected: 'string' },
        };
      }

      const cleaned = cleanDNI(value);

      // If formatted not allowed, check original value
      if (!allowFormatted && value !== cleaned) {
        return {
          isValid: false,
          error: 'DNI debe contener solo números',
          details: { code: 'FORMAT_ERROR' },
        };
      }

      // Validate DNI
      if (!isValidDNI(value, minLength, maxLength)) {
        return {
          isValid: false,
          error: message,
          details: { code: 'INVALID_DNI' },
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
 * Standalone DNI validation function
 */
export function validateDNI(dni: string, minLength = 7, maxLength = 8): boolean {
  return isValidDNI(dni, minLength, maxLength);
}

/**
 * Default export
 */
export default createDNIValidator;
