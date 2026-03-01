/**
 * CEP (Código de Endereçamento Postal) Validator
 * Brazilian postal code
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  CreateValidatorOptions,
} from '../../types/validator.types';

/**
 * CEP validator options
 */
export interface CEPValidatorOptions extends CreateValidatorOptions {
  /** Custom error message */
  message?: string;
  /** Allow formatted CEP (with dash) */
  allowFormatted?: boolean;
}

/**
 * Remove non-numeric characters from CEP
 */
function cleanCEP(cep: string): string {
  return cep.replace(/\D/g, '');
}

/**
 * Validate CEP format
 */
function isValidCEP(cep: string): boolean {
  const cleaned = cleanCEP(cep);

  // Must have exactly 8 digits
  if (cleaned.length !== 8) {
    return false;
  }

  // Must be all digits
  if (!/^\d{8}$/.test(cleaned)) {
    return false;
  }

  // Reject invalid patterns (all same digit, all zeros)
  if (/^(\d)\1{7}$/.test(cleaned) || cleaned === '00000000') {
    return false;
  }

  return true;
}

/**
 * Create a CEP validator
 * 
 * @example
 * ```ts
 * import { createCEPValidator } from '@wsolutions/form-validation';
 * 
 * const validator = createCEPValidator();
 * await validator.validate('01310-100'); // { isValid: true }
 * await validator.validate('01310100');  // { isValid: true }
 * await validator.validate('00000-000'); // { isValid: false }
 * await validator.validate('123');       // { isValid: false }
 * 
 * // Only accept unformatted CEP
 * const validator2 = createCEPValidator({ allowFormatted: false });
 * await validator2.validate('01310-100'); // { isValid: false }
 * ```
 */
export function createCEPValidator(
  options: CEPValidatorOptions = {}
): Validator<string> {
  const {
    message = 'CEP inválido',
    allowFormatted = true,
  } = options;

  const config: ValidatorConfig<string> = {
    name: 'cep',
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

      const cleaned = cleanCEP(value);

      // If formatted not allowed, check original value
      if (!allowFormatted && value !== cleaned) {
        return {
          isValid: false,
          error: 'CEP deve conter apenas números',
          details: { code: 'FORMAT_ERROR' },
        };
      }

      // Validate CEP
      if (!isValidCEP(value)) {
        return {
          isValid: false,
          error: message,
          details: { code: 'INVALID_CEP' },
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
 * Standalone CEP validation function
 */
export function validateCEP(cep: string): boolean {
  return isValidCEP(cep);
}

/**
 * Default export
 */
export default createCEPValidator;
