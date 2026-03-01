/**
 * CPF (Cadastro de Pessoas Físicas) Validator
 * Brazilian individual taxpayer registry identification
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  CreateValidatorOptions,
} from '../../types/validator.types';

/**
 * CPF validator options
 */
export interface CPFValidatorOptions extends CreateValidatorOptions {
  /** Custom error message */
  message?: string;
  /** Allow formatted CPF (with dots and dash) */
  allowFormatted?: boolean;
}

/**
 * Remove non-numeric characters from CPF
 */
function cleanCPF(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

/**
 * Validate CPF format and checksum
 */
function isValidCPF(cpf: string): boolean {
  const cleaned = cleanCPF(cpf);

  // Must have exactly 11 digits
  if (cleaned.length !== 11) {
    return false;
  }

  // Reject known invalid CPFs (all same digits)
  if (/^(\d)\1{10}$/.test(cleaned)) {
    return false;
  }

  // Validate first check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  let checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  if (checkDigit !== parseInt(cleaned[9])) {
    return false;
  }

  // Validate second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  if (checkDigit !== parseInt(cleaned[10])) {
    return false;
  }

  return true;
}

/**
 * Create a CPF validator
 * 
 * @example
 * ```ts
 * import { createCPFValidator } from '@wsolutions/form-validation';
 * 
 * const validator = createCPFValidator();
 * await validator.validate('123.456.789-09'); // { isValid: true }
 * await validator.validate('12345678909');     // { isValid: true }
 * await validator.validate('000.000.000-00'); // { isValid: false }
 * await validator.validate('invalid');        // { isValid: false }
 * 
 * // Only accept unformatted CPF
 * const validator2 = createCPFValidator({ allowFormatted: false });
 * await validator2.validate('123.456.789-09'); // { isValid: false }
 * ```
 */
export function createCPFValidator(
  options: CPFValidatorOptions = {}
): Validator<string> {
  const {
    message = 'CPF inválido',
    allowFormatted = true,
  } = options;

  const config: ValidatorConfig<string> = {
    name: 'cpf',
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

      const cleaned = cleanCPF(value);

      // If formatted not allowed, check original value
      if (!allowFormatted && value !== cleaned) {
        return {
          isValid: false,
          error: 'CPF deve conter apenas números',
          details: { code: 'FORMAT_ERROR' },
        };
      }

      // Validate CPF
      if (!isValidCPF(value)) {
        return {
          isValid: false,
          error: message,
          details: { code: 'INVALID_CPF' },
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
 * Standalone CPF validation function
 */
export function validateCPF(cpf: string): boolean {
  return isValidCPF(cpf);
}

/**
 * Default export
 */
export default createCPFValidator;
