/**
 * Brazilian phone number validator
 * Supports landline and mobile numbers with optional country code
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  CreateValidatorOptions,
} from '../../types/validator.types';

/**
 * Phone validator options
 */
export interface PhoneValidatorOptions extends CreateValidatorOptions {
  /** Custom error message */
  message?: string;
  /** Allow formatted phone (with parentheses, spaces, dash) */
  allowFormatted?: boolean;
  /** Require mobile (9 digits) */
  mobileOnly?: boolean;
  /** Require landline (8 digits) */
  landlineOnly?: boolean;
}

/**
 * Remove non-numeric characters from phone
 */
function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Validate Brazilian phone number
 */
function isValidPhone(phone: string, mobileOnly: boolean, landlineOnly: boolean): boolean {
  const cleaned = cleanPhone(phone);

  // Remove country code if present (+55 or 55)
  const withoutCountryCode = cleaned.startsWith('55') ? cleaned.substring(2) : cleaned;

  // Phone must have 10 or 11 digits after removing country code
  // Format: (XX) XXXX-XXXX (landline) or (XX) 9XXXX-XXXX (mobile)
  if (withoutCountryCode.length !== 10 && withoutCountryCode.length !== 11) {
    return false;
  }

  // Extract area code (DDD) and number
  const areaCode = withoutCountryCode.substring(0, 2);
  const number = withoutCountryCode.substring(2);

  // Validate area code (11-99, excluding some invalid codes)
  const areaCodeNum = parseInt(areaCode);
  if (areaCodeNum < 11 || areaCodeNum > 99) {
    return false;
  }

  // Check if it's mobile (9 digits, starts with 9)
  const isMobile = number.length === 9 && number[0] === '9';
  
  // Check if it's landline (8 digits)
  const isLandline = number.length === 8;

  // Apply mobile/landline restrictions
  if (mobileOnly && !isMobile) {
    return false;
  }

  if (landlineOnly && !isLandline) {
    return false;
  }

  // Must be either valid mobile or valid landline
  if (!isMobile && !isLandline) {
    return false;
  }

  // Reject patterns with all same digits
  if (/^(\d)\1+$/.test(number)) {
    return false;
  }

  return true;
}

/**
 * Create a Brazilian phone validator
 * 
 * @example
 * ```ts
 * import { createPhoneValidator } from '@wsolutions/form-validation';
 * 
 * const validator = createPhoneValidator();
 * await validator.validate('(11) 98765-4321'); // { isValid: true } - mobile
 * await validator.validate('(11) 3456-7890');  // { isValid: true } - landline
 * await validator.validate('11987654321');     // { isValid: true }
 * await validator.validate('+5511987654321');  // { isValid: true }
 * 
 * // Only accept mobile numbers
 * const validator2 = createPhoneValidator({ mobileOnly: true });
 * await validator2.validate('(11) 3456-7890'); // { isValid: false }
 * 
 * // Only accept landline numbers
 * const validator3 = createPhoneValidator({ landlineOnly: true });
 * await validator3.validate('(11) 98765-4321'); // { isValid: false }
 * ```
 */
export function createPhoneValidator(
  options: PhoneValidatorOptions = {}
): Validator<string> {
  const {
    message = 'Telefone inválido',
    allowFormatted = true,
    mobileOnly = false,
    landlineOnly = false,
  } = options;

  // Validate options
  if (mobileOnly && landlineOnly) {
    throw new Error('Cannot require both mobile and landline');
  }

  const config: ValidatorConfig<string> = {
    name: 'phone',
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

      const cleaned = cleanPhone(value);

      // If formatted not allowed, check original value format
      if (!allowFormatted && value !== cleaned && value !== `+${cleaned}`) {
        return {
          isValid: false,
          error: 'Telefone deve conter apenas números',
          details: { code: 'FORMAT_ERROR' },
        };
      }

      // Validate phone
      if (!isValidPhone(value, mobileOnly, landlineOnly)) {
        let errorMessage = message;
        if (mobileOnly) {
          errorMessage = 'Número deve ser celular (9 dígitos)';
        } else if (landlineOnly) {
          errorMessage = 'Número deve ser fixo (8 dígitos)';
        }

        return {
          isValid: false,
          error: errorMessage,
          details: { code: 'INVALID_PHONE' },
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
 * Standalone phone validation function
 */
export function validatePhone(phone: string, mobileOnly = false, landlineOnly = false): boolean {
  return isValidPhone(phone, mobileOnly, landlineOnly);
}

/**
 * Default export
 */
export default createPhoneValidator;
