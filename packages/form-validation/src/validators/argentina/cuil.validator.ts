/**
 * CUIL/CUIT (Código Único de Identificación Laboral/Tributaria) Validator
 * Argentine tax identification number
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  CreateValidatorOptions,
} from '../../types/validator.types';

/**
 * CUIL/CUIT validator options
 */
export interface CUILValidatorOptions extends CreateValidatorOptions {
  /** Custom error message */
  message?: string;
  /** Allow formatted CUIL (with dashes) */
  allowFormatted?: boolean;
}

/**
 * Remove non-numeric characters from CUIL/CUIT
 */
function cleanCUIL(cuil: string): string {
  return cuil.replace(/\D/g, '');
}

/**
 * Calculate CUIL/CUIT check digit
 */
function calculateCheckDigit(cuil: string): number {
  const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let sum = 0;

  for (let i = 0; i < 10; i++) {
    const digit = cuil[i];
    const multiplier = multipliers[i];
    if (digit === undefined || multiplier === undefined) return -1;
    sum += parseInt(digit) * multiplier;
  }

  const remainder = sum % 11;
  const checkDigit = 11 - remainder;

  if (checkDigit === 11) return 0;
  if (checkDigit === 10) return 9; // Special case for CUIL/CUIT

  return checkDigit;
}

/**
 * Validate CUIL/CUIT format and checksum
 */
function isValidCUIL(cuil: string): boolean {
  const cleaned = cleanCUIL(cuil);

  // Must have exactly 11 digits
  if (cleaned.length !== 11) {
    return false;
  }

  // Must be all digits
  if (!/^\d{11}$/.test(cleaned)) {
    return false;
  }

  // Extract prefix (tipo), DNI, and check digit
  const prefix = cleaned.substring(0, 2);
  const dni = cleaned.substring(2, 10);
  const providedCheckDigit = cleaned[10] ? parseInt(cleaned[10]) : -1;

  // Validate prefix (valid types: 20, 23, 24, 27, 30, 33, 34)
  const validPrefixes = ['20', '23', '24', '27', '30', '33', '34'];
  if (!validPrefixes.includes(prefix)) {
    return false;
  }

  // Reject invalid patterns in DNI part
  if (/^(\d)\1{7}$/.test(dni) || dni === '00000000') {
    return false;
  }

  // Validate check digit
  const calculatedCheckDigit = calculateCheckDigit(cleaned.substring(0, 10));
  if (calculatedCheckDigit !== providedCheckDigit) {
    return false;
  }

  return true;
}

/**
 * Create a CUIL/CUIT validator
 * 
 * @example
 * ```ts
 * import { createCUILValidator } from '@wsolutions/form-validation';
 * 
 * const validator = createCUILValidator();
 * await validator.validate('20-12345678-9'); // { isValid: true }
 * await validator.validate('20123456789');   // { isValid: true }
 * await validator.validate('00-00000000-0'); // { isValid: false }
 * await validator.validate('invalid');       // { isValid: false }
 * 
 * // Only accept unformatted CUIL
 * const validator2 = createCUILValidator({ allowFormatted: false });
 * await validator2.validate('20-12345678-9'); // { isValid: false }
 * ```
 */
export function createCUILValidator(
  options: CUILValidatorOptions = {}
): Validator<string> {
  const {
    message = 'CUIL/CUIT inválido',
    allowFormatted = true,
  } = options;

  const config: ValidatorConfig<string> = {
    name: 'cuil',
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

      const cleaned = cleanCUIL(value);

      // If formatted not allowed, check original value
      if (!allowFormatted && value !== cleaned) {
        return {
          isValid: false,
          error: 'CUIL/CUIT debe contener solo números',
          details: { code: 'FORMAT_ERROR' },
        };
      }

      // Validate CUIL/CUIT
      if (!isValidCUIL(value)) {
        return {
          isValid: false,
          error: message,
          details: { code: 'INVALID_CUIL' },
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
 * Create a CUIT validator (alias for CUIL)
 */
export function createCUITValidator(
  options: CUILValidatorOptions = {}
): Validator<string> {
  const validator = createCUILValidator(options);
  validator.config.name = 'cuit';
  return validator;
}

/**
 * Standalone CUIL validation function
 */
export function validateCUIL(cuil: string): boolean {
  return isValidCUIL(cuil);
}

/**
 * Standalone CUIT validation function (alias)
 */
export function validateCUIT(cuit: string): boolean {
  return isValidCUIL(cuit);
}

/**
 * Default export
 */
export default createCUILValidator;
