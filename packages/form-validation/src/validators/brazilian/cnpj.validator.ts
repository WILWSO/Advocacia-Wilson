/**
 * CNPJ (Cadastro Nacional da Pessoa Jurídica) Validator
 * Brazilian company taxpayer registry identification
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  CreateValidatorOptions,
} from '../../types/validator.types';

/**
 * CNPJ validator options
 */
export interface CNPJValidatorOptions extends CreateValidatorOptions {
  /** Custom error message */
  message?: string;
  /** Allow formatted CNPJ (with dots, slash and dash) */
  allowFormatted?: boolean;
}

/**
 * Remove non-numeric characters from CNPJ
 */
function cleanCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '');
}

/**
 * Validate CNPJ format and checksum
 */
function isValidCNPJ(cnpj: string): boolean {
  const cleaned = cleanCNPJ(cnpj);

  // Must have exactly 14 digits
  if (cleaned.length !== 14) {
    return false;
  }

  // Reject known invalid CNPJs (all same digits)
  if (/^(\d)\1{13}$/.test(cleaned)) {
    return false;
  }

  // Validate first check digit
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    const digit = cleaned[i];
    if (digit === undefined) return false;
    sum += parseInt(digit) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let checkDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  const firstCheck = cleaned[12] ? parseInt(cleaned[12]) : -1;
  if (checkDigit !== firstCheck) {
    return false;
  }

  // Validate second check digit
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    const digit = cleaned[i];
    if (digit === undefined) return false;
    sum += parseInt(digit) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  checkDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  const secondCheck = cleaned[13] ? parseInt(cleaned[13]) : -1;
  if (checkDigit !== secondCheck) {
    return false;
  }

  return true;
}

/**
 * Create a CNPJ validator
 * 
 * @example
 * ```ts
 * import { createCNPJValidator } from '@wsolutions/form-validation';
 * 
 * const validator = createCNPJValidator();
 * await validator.validate('11.222.333/0001-81'); // { isValid: true }
 * await validator.validate('11222333000181');     // { isValid: true }
 * await validator.validate('00.000.000/0000-00'); // { isValid: false }
 * await validator.validate('invalid');           // { isValid: false }
 * 
 * // Only accept unformatted CNPJ
 * const validator2 = createCNPJValidator({ allowFormatted: false });
 * await validator2.validate('11.222.333/0001-81'); // { isValid: false }
 * ```
 */
export function createCNPJValidator(
  options: CNPJValidatorOptions = {}
): Validator<string> {
  const {
    message = 'CNPJ inválido',
    allowFormatted = true,
  } = options;

  const config: ValidatorConfig<string> = {
    name: 'cnpj',
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

      const cleaned = cleanCNPJ(value);

      // If formatted not allowed, check original value
      if (!allowFormatted && value !== cleaned) {
        return {
          isValid: false,
          error: 'CNPJ deve conter apenas números',
          details: { code: 'FORMAT_ERROR' },
        };
      }

      // Validate CNPJ
      if (!isValidCNPJ(value)) {
        return {
          isValid: false,
          error: message,
          details: { code: 'INVALID_CNPJ' },
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
 * Standalone CNPJ validation function
 */
export function validateCNPJ(cnpj: string): boolean {
  return isValidCNPJ(cnpj);
}

/**
 * Default export
 */
export default createCNPJValidator;
