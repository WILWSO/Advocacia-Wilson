/**
 * Universal phone number formatter
 * Formats phone numbers for multiple countries with country code (DDI)
 */

import type {
  Formatter,
  FormatterConfig,
  StringFormatterOptions,
} from '../types/formatter.types';

/**
 * Country phone format configuration
 */
export interface CountryPhoneFormat {
  /** Country code (DDI) without + */
  code: string;
  /** Country name */
  name: string;
  /** Format function */
  format: (number: string, includeCountryCode: boolean, international: boolean) => string;
}

/**
 * Phone formatter options
 */
export interface UniversalPhoneFormatterOptions extends StringFormatterOptions {
  /** Include country code (+XX) */
  includeCountryCode?: boolean;
  /** Use international format with spaces */
  internationalFormat?: boolean;
  /** Country code (DDI) - e.g., '55' for Brazil, '54' for Argentina */
  countryCode?: string;
}

/**
 * Remove non-numeric characters
 */
function removeNonNumeric(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Format Brazilian phone
 */
function formatBrazilianPhone(number: string, includeCountryCode: boolean, international: boolean): string {
  if (number.length < 2) return number;

  const areaCode = number.substring(0, 2);
  const phoneNumber = number.substring(2);

  const isMobile = phoneNumber.length >= 9;

  let formatted = '';

  // Use international format if country code should be included or if explicitly requested
  const useInternational = international || includeCountryCode;

  if (useInternational) {
    if (includeCountryCode) {
      formatted = '+55 ';
    }
    formatted += `${areaCode} `;

    if (isMobile && phoneNumber.length >= 5) {
      formatted += `${phoneNumber.substring(0, 5)}-${phoneNumber.substring(5, 9)}`;
    } else if (phoneNumber.length >= 4) {
      formatted += `${phoneNumber.substring(0, 4)}-${phoneNumber.substring(4, 8)}`;
    } else {
      formatted += phoneNumber;
    }
  } else {
    formatted = `(${areaCode}) `;

    if (isMobile && phoneNumber.length >= 5) {
      formatted += `${phoneNumber.substring(0, 5)}-${phoneNumber.substring(5, 9)}`;
    } else if (phoneNumber.length >= 4) {
      formatted += `${phoneNumber.substring(0, 4)}-${phoneNumber.substring(4, 8)}`;
    } else {
      formatted += phoneNumber;
    }
  }

  return formatted;
}

/**
 * Format Argentine phone
 */
function formatArgentinePhone(number: string, includeCountryCode: boolean, international: boolean): string {
  // Argentine phones can have variable area code length (2-4 digits)
  // Mobile: 9 + area code + number = 11 digits total
  // Landline: area code + number = 10 digits total

  if (number.length < 2) return number;

  const isMobile = number.startsWith('9') && number.length >= 11;
  
  // Use international format if country code should be included or if explicitly requested
  const useInternational = international || includeCountryCode;

  let formatted = '';
  let areaCode = '';
  let phoneNumber = '';

  if (isMobile) {
    // Mobile: 9 + area code + number
    const withoutNine = number.substring(1); // Remove leading 9
    
    // Buenos Aires (11) has 2-digit area code
    // Most other major cities have 3-digit area codes
    if (withoutNine.startsWith('11')) {
      areaCode = '11';
      phoneNumber = withoutNine.substring(2);
    } else if (withoutNine.length >= 3) {
      areaCode = withoutNine.substring(0, 3);
      phoneNumber = withoutNine.substring(3);
    }
  } else {
    // Landline: area code + number
    if (number.length === 10) {
      // Try 2-digit area code first (Buenos Aires and similar)
      if (number.startsWith('11')) {
        areaCode = '11';
        phoneNumber = number.substring(2);
      } else {
        // Most common: 3-digit area code
        areaCode = number.substring(0, 3);
        phoneNumber = number.substring(3);
      }
    }
  }

  if (useInternational) {
    if (includeCountryCode) {
      formatted = '+54 ';
    }
    
    if (isMobile) {
      formatted += `9 ${areaCode} `;
    } else {
      formatted += `${areaCode} `;
    }

    // Format phoneNumber part
    if (phoneNumber.length >= 4) {
      const split = Math.ceil(phoneNumber.length / 2);
      formatted += `${phoneNumber.substring(0, split)}-${phoneNumber.substring(split)}`;
    } else {
      formatted += phoneNumber;
    }
  } else {
    // National format (without country code, but keeping area code structure)
    formatted = `${areaCode} `;

    if (phoneNumber.length >= 4) {
      const split = Math.ceil(phoneNumber.length / 2);
      formatted += `${phoneNumber.substring(0, split)}-${phoneNumber.substring(split)}`;
    } else {
      formatted += phoneNumber;
    }
  }

  return formatted;
}

/**
 * Format US/Canada phone
 */
function formatUSPhone(number: string, includeCountryCode: boolean, _international: boolean): string {
  if (number.length < 3) return number;

  const areaCode = number.substring(0, 3);
  const exchange = number.substring(3, 6);
  const subscriber = number.substring(6, 10);

  let formatted = '';
  
  if (includeCountryCode) {
    formatted = '+1 ';
  }

  formatted += `(${areaCode}) ${exchange}`;
  if (subscriber) {
    formatted += `-${subscriber}`;
  }

  return formatted;
}

/**
 * Predefined country formatters
 */
export const COUNTRY_PHONE_FORMATTERS: Record<string, CountryPhoneFormat> = {
  '55': {
    code: '55',
    name: 'Brasil',
    format: formatBrazilianPhone,
  },
  '54': {
    code: '54',
    name: 'Argentina',
    format: formatArgentinePhone,
  },
  '1': {
    code: '1',
    name: 'USA/Canada',
    format: formatUSPhone,
  },
  '34': {
    code: '34',
    name: 'España',
    format: (number, includeCountryCode, _international) => {
      // Spanish format: +34 XXX XXX XXX
      if (number.length < 3) return number;
      
      let formatted = includeCountryCode ? '+34 ' : '';
      formatted += `${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6, 9)}`;
      return formatted;
    },
  },
  '52': {
    code: '52',
    name: 'México',
    format: (number, includeCountryCode, _international) => {
      // Mexican format: +52 XX XXXX-XXXX
      if (number.length < 2) return number;
      
      const areaCode = number.substring(0, 2);
      const phoneNumber = number.substring(2);
      
      let formatted = includeCountryCode ? '+52 ' : '';
      formatted += `${areaCode} `;
      
      if (phoneNumber.length >= 4) {
        formatted += `${phoneNumber.substring(0, 4)}-${phoneNumber.substring(4, 8)}`;
      } else {
        formatted += phoneNumber;
      }
      
      return formatted;
    },
  },
};

/**
 * Parse phone to extract country code and number
 */
function parsePhone(phone: string): { countryCode: string | null; number: string } {
  const cleaned = removeNonNumeric(phone);

  // Try to detect country code (check longer codes first)
  const formatters = Object.values(COUNTRY_PHONE_FORMATTERS).sort((a, b) => b.code.length - a.code.length);
  
  for (const config of formatters) {
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
 * Create a universal phone formatter
 * 
 * @example
 * ```ts
 * import { createUniversalPhoneFormatter } from '@wsolutions/form-validation';
 * 
 * // Brazil
 * const formatterBR = createUniversalPhoneFormatter({ countryCode: '55' });
 * formatterBR.format('11987654321');     // "(11) 98765-4321"
 * 
 * // With country code
 * const formatterBR2 = createUniversalPhoneFormatter({ 
 *   countryCode: '55',
 *   includeCountryCode: true 
 * });
 * formatterBR2.format('11987654321');    // "+55 (11) 98765-4321"
 * 
 * // Argentina
 * const formatterAR = createUniversalPhoneFormatter({ 
 *   countryCode: '54',
 *   includeCountryCode: true,
 *   internationalFormat: true
 * });
 * formatterAR.format('91112345678');     // "+54 9 11 1234-5678"
 * 
 * // Auto-detect
 * const formatterAuto = createUniversalPhoneFormatter({ includeCountryCode: true });
 * formatterAuto.format('5511987654321');  // "+55 (11) 98765-4321"
 * formatterAuto.format('5491112345678');  // "+54 9 11 1234-5678"
 * ```
 */
export function createUniversalPhoneFormatter(
  options: UniversalPhoneFormatterOptions = {}
): Formatter<string, string> {
  const {
    preserveOnError = true,
    includeCountryCode = false,
    internationalFormat = false,
    countryCode,
  } = options;

  if (countryCode && !COUNTRY_PHONE_FORMATTERS[countryCode]) {
    throw new Error(`Unknown country code: ${countryCode}`);
  }

  const config: FormatterConfig<string, string> = {
    name: 'phone',
    description: 'Format universal phone number',
    format: (value: string): string => {
      if (typeof value !== 'string') {
        return preserveOnError ? String(value) : '';
      }

      try {
        const cleaned = removeNonNumeric(value);

        // If no digits, preserve original if requested
        if (cleaned.length === 0) {
          return preserveOnError ? value : '';
        }

        // Determine country code
        let finalCountryCode: string | undefined;
        let numberToParse: string;

        if (countryCode) {
          // CountryCode specified in options
          // Only detect if input explicitly has country code (starts with + or exact code)
          if (value.trim().startsWith('+') || cleaned.startsWith(countryCode)) {
            const parsed = parsePhone(value);
            if (parsed.countryCode === countryCode) {
              finalCountryCode = countryCode;
              numberToParse = parsed.number;
            } else {
              // Input doesn't have country code or has different one
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
          const parsed = parsePhone(value);
          finalCountryCode = parsed.countryCode || undefined;
          numberToParse = parsed.number;
        }

        // Format based on country
        if (finalCountryCode && COUNTRY_PHONE_FORMATTERS[finalCountryCode]) {
          const formatter = COUNTRY_PHONE_FORMATTERS[finalCountryCode];
          if (formatter) {
            return formatter.format(numberToParse, includeCountryCode, internationalFormat);
          }
        }

        // Default: return cleaned number with country code if requested
        let formatted = includeCountryCode && finalCountryCode ? `+${finalCountryCode} ` : '';
        formatted += numberToParse;
        return formatted;
      } catch (error) {
        return preserveOnError ? value : '';
      }
    },
  };

  return {
    config,
    format: config.format,
    getName: () => config.name,
    getDescription: () => config.description,
  };
}

/**
 * Create an unformat phone formatter (remove all formatting)
 */
export function createUnformatPhoneFormatter(
  options: StringFormatterOptions = {}
): Formatter<string, string> {
  const { preserveOnError = true } = options;

  const config: FormatterConfig<string, string> = {
    name: 'unformat-phone',
    description: 'Remove phone formatting',
    format: (value: string): string => {
      if (typeof value !== 'string') {
        return preserveOnError ? String(value) : '';
      }

      try {
        return removeNonNumeric(value);
      } catch (error) {
        return preserveOnError ? value : '';
      }
    },
  };

  return {
    config,
    format: config.format,
    getName: () => config.name,
    getDescription: () => config.description,
  };
}

/**
 * Get country formatter by code
 */
export function getCountryFormatter(countryCode: string): CountryPhoneFormat | undefined {
  return COUNTRY_PHONE_FORMATTERS[countryCode];
}

/**
 * Default export
 */
export default createUniversalPhoneFormatter;
