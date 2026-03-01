/**
 * Universal phone number validator
 * Supports multiple countries with country code (DDI)
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  CreateValidatorOptions,
} from '../types/validator.types';

/**
 * Country phone configuration
 */
export interface CountryPhoneConfig {
  /** Country code (DDI) without + */
  code: string;
  /** Country name */
  name: string;
  /** Valid area code ranges */
  areaCodes?: { min: number; max: number };
  /** Mobile number length (after area code) */
  mobileLength?: number;
  /** Landline number length (after area code) */
  landlineLength?: number;
  /** Total length without country code */
  totalLength?: number[];
  /** Mobile number starts with specific digit */
  mobileStartsWith?: string;
  /** Custom validation function */
  customValidator?: (phone: string) => boolean;
}

/**
 * Phone validator options
 */
export interface UniversalPhoneValidatorOptions extends CreateValidatorOptions {
  /** Custom error message */
  message?: string;
  /** Allow formatted phone (with parentheses, spaces, dash) */
  allowFormatted?: boolean;
  /** Require mobile numbers only */
  mobileOnly?: boolean;
  /** Require landline numbers only */
  landlineOnly?: boolean;
  /** Country code (DDI) - e.g., '55' for Brazil, '54' for Argentina */
  countryCode?: string;
  /** Require country code in the input */
  requireCountryCode?: boolean;
}

/**
 * Predefined country configurations
 */
export const COUNTRY_PHONE_CONFIGS: Record<string, CountryPhoneConfig> = {
  // Brazil (+55)
  '55': {
    code: '55',
    name: 'Brasil',
    areaCodes: { min: 11, max: 99 },
    mobileLength: 9,
    landlineLength: 8,
    totalLength: [10, 11],
    mobileStartsWith: '9',
  },
  // Argentina (+54)
  '54': {
    code: '54',
    name: 'Argentina',
    totalLength: [10, 11], // Area code (2-4 digits) + number (6-8 digits)
    customValidator: (phoneWithoutCountry: string) => {
      // Argentine phones: area code can be 2, 3, or 4 digits
      // Area code + number = 10 digits (without 15 for mobile)
      // Mobile: 9 + area code + number (11 digits with leading 9)
      const isMobile = phoneWithoutCountry.startsWith('9') && phoneWithoutCountry.length === 11;
      const isLandline = phoneWithoutCountry.length === 10;
      return isMobile || isLandline;
    },
  },
  // USA/Canada (+1)
  '1': {
    code: '1',
    name: 'USA/Canada',
    totalLength: [10],
    customValidator: (phoneWithoutCountry: string) => {
      // NPA-NXX-XXXX format
      return phoneWithoutCountry.length === 10;
    },
  },
  // Spain (+34)
  '34': {
    code: '34',
    name: 'España',
    totalLength: [9],
    mobileStartsWith: '6,7', // Mobile starts with 6 or 7
  },
  // Mexico (+52)
  '52': {
    code: '52',
    name: 'México',
    totalLength: [10],
  },
};

/**
 * Remove non-numeric characters from phone
 */
function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Extract country code and phone number
 */
function parsePhone(phone: string): { countryCode: string | null; number: string } {
  const cleaned = cleanPhone(phone);

  // Try to detect country code (check longer codes first)
  const configs = Object.values(COUNTRY_PHONE_CONFIGS).sort((a, b) => b.code.length - a.code.length);
  
  for (const config of configs) {
    if (cleaned.startsWith(config.code)) {
      return {
        countryCode: config.code,
        number: cleaned.substring(config.code.length),
      };
    }
  }

  return { countryCode: null, number: cleaned };
}

/**
 * Validate phone number for specific country
 */
function validatePhoneForCountry(
  phoneNumber: string,
  config: CountryPhoneConfig,
  mobileOnly: boolean,
  landlineOnly: boolean
): boolean {
  // Use custom validator if provided
  if (config.customValidator) {
    return config.customValidator(phoneNumber);
  }

  // Check total length
  if (config.totalLength && !config.totalLength.includes(phoneNumber.length)) {
    return false;
  }

  // Extract area code and number
  let areaCode: string | undefined;
  let number: string;

  if (config.areaCodes) {
    areaCode = phoneNumber.substring(0, 2);
    number = phoneNumber.substring(2);

    // Validate area code range
    const areaCodeNum = parseInt(areaCode);
    if (areaCodeNum < config.areaCodes.min || areaCodeNum > config.areaCodes.max) {
      return false;
    }
  } else {
    number = phoneNumber;
  }

  // Check mobile/landline
  const hasMobileLength = config.mobileLength && number.length === config.mobileLength;
  const hasLandlineLength = config.landlineLength && number.length === config.landlineLength;
  
  // Check if mobile starts with required prefix
  const mobileStartsPrefixes = config.mobileStartsWith
    ? config.mobileStartsWith.split(',').map(p => p.trim())
    : [];
  
  const startsWithMobilePrefix = mobileStartsPrefixes.length > 0
    ? mobileStartsPrefixes.some(prefix => number.startsWith(prefix))
    : false;

  // Determine if mobile or landline
  const isMobile = hasMobileLength && (mobileStartsPrefixes.length === 0 || startsWithMobilePrefix);
  const isLandline = hasLandlineLength && !startsWithMobilePrefix;

  // Apply restrictions
  if (mobileOnly && !isMobile) return false;
  if (landlineOnly && !isLandline) return false;

  // Must be valid mobile or landline if lengths are defined
  if ((config.mobileLength || config.landlineLength) && !isMobile && !isLandline) {
    return false;
  }

  // Reject patterns with all same digits
  if (/^(\d)\1+$/.test(number)) {
    return false;
  }

  return true;
}

/**
 * Validate universal phone number
 */
function isValidUniversalPhone(
  phone: string,
  countryCode: string | undefined,
  requireCountryCode: boolean,
  mobileOnly: boolean,
  landlineOnly: boolean
): boolean {
  const cleaned = cleanPhone(phone);
  const hasExplicitCountryCode = phone.trim().startsWith('+');
  
  let finalCountryCode: string | undefined;
  let numberToParse: string;

  if (countryCode) {
    // CountryCode specified in options
    // Only detect if input explicitly has country code
    if (hasExplicitCountryCode || cleaned.startsWith(countryCode)) {
      const parsed = parsePhone(phone);
      if (parsed.countryCode && parsed.countryCode !== countryCode) {
        // Mismatch: input has different country code than expected
        return false;
      }
      if (parsed.countryCode === countryCode) {
        finalCountryCode = countryCode;
        numberToParse = parsed.number;
      } else {
        // Input doesn't have country code, use specified one
        finalCountryCode = countryCode;
        numberToParse = cleaned;
      }
    } else {
      // Input doesn't have country code, use specified one
      finalCountryCode = countryCode;
      numberToParse = cleaned;
    }
  } else {
    // Auto-detect country code from input
    const parsed = parsePhone(phone);
    finalCountryCode = parsed.countryCode || undefined;
    numberToParse = parsed.number;
  }

  // Check if country code is required but missing
  // Only consider explicit country codes (those with +)
  if (requireCountryCode && !hasExplicitCountryCode) {
    return false;
  }

  // If no country code specified or detected, try all countries
  if (!finalCountryCode) {
    return Object.values(COUNTRY_PHONE_CONFIGS).some(config =>
      validatePhoneForCountry(numberToParse, config, mobileOnly, landlineOnly)
    );
  }

  // Validate for specific country
  const config = COUNTRY_PHONE_CONFIGS[finalCountryCode];
  if (!config) {
    return false; // Unknown country code
  }

  return validatePhoneForCountry(numberToParse, config, mobileOnly, landlineOnly);
}

/**
 * Create a universal phone validator
 * 
 * @example
 * ```ts
 * import { createUniversalPhoneValidator } from '@wsolutions/form-validation';
 * 
 * // Brazil
 * const validatorBR = createUniversalPhoneValidator({ countryCode: '55' });
 * await validatorBR.validate('(11) 98765-4321'); // { isValid: true }
 * await validatorBR.validate('+5511987654321');  // { isValid: true }
 * 
 * // Argentina
 * const validatorAR = createUniversalPhoneValidator({ countryCode: '54' });
 * await validatorAR.validate('+54 9 11 1234-5678'); // { isValid: true }
 * 
 * // Auto-detect country
 * const validatorAuto = createUniversalPhoneValidator();
 * await validatorAuto.validate('+5511987654321'); // Brazil
 * await validatorAuto.validate('+5491112345678'); // Argentina
 * ```
 */
export function createUniversalPhoneValidator(
  options: UniversalPhoneValidatorOptions = {}
): Validator<string> {
  const {
    message = 'Teléfono inválido',
    allowFormatted = true,
    mobileOnly = false,
    landlineOnly = false,
    countryCode,
    requireCountryCode = false,
  } = options;

  // Validate options
  if (mobileOnly && landlineOnly) {
    throw new Error('Cannot require both mobile and landline');
  }

  if (countryCode && !COUNTRY_PHONE_CONFIGS[countryCode]) {
    throw new Error(`Unknown country code: ${countryCode}`);
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
          error: 'Teléfono debe contener solo números',
          details: { code: 'FORMAT_ERROR' },
        };
      }

      // Validate phone
      if (!isValidUniversalPhone(value, countryCode, requireCountryCode, mobileOnly, landlineOnly)) {
        let errorMessage = message;
        if (mobileOnly) {
          errorMessage = 'Número debe ser celular';
        } else if (landlineOnly) {
          errorMessage = 'Número debe ser fijo';
        } else if (requireCountryCode) {
          errorMessage = 'Código de país requerido';
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
 * Standalone universal phone validation function
 */
export function validateUniversalPhone(
  phone: string,
  options: Omit<UniversalPhoneValidatorOptions, 'message'> = {}
): boolean {
  const {
    countryCode,
    requireCountryCode = false,
    mobileOnly = false,
    landlineOnly = false,
  } = options;

  return isValidUniversalPhone(phone, countryCode, requireCountryCode, mobileOnly, landlineOnly);
}

/**
 * Get country config by code
 */
export function getCountryConfig(countryCode: string): CountryPhoneConfig | undefined {
  return COUNTRY_PHONE_CONFIGS[countryCode];
}

/**
 * Default export
 */
export default createUniversalPhoneValidator;
