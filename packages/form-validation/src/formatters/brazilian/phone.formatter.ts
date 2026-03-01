/**
 * Brazilian phone formatter
 * Formats phone numbers with standard Brazilian formats
 */

import type {
  Formatter,
  FormatterConfig,
  StringFormatterOptions,
} from '../../types/formatter.types';

/**
 * Phone formatter options
 */
export interface PhoneFormatterOptions extends StringFormatterOptions {
  /** Include country code (+55) */
  includeCountryCode?: boolean;
  /** Use international format with spaces */
  internationalFormat?: boolean;
}

/**
 * Remove non-numeric characters
 */
function removeNonNumeric(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Format phone number
 */
function formatPhone(
  phone: string,
  includeCountryCode: boolean,
  internationalFormat: boolean
): string {
  let cleaned = removeNonNumeric(phone);

  if (cleaned.length === 0) {
    return '';
  }

  // Remove country code if present (will add back if requested)
  const hasCountryCode = cleaned.startsWith('55') && cleaned.length >= 12;
  if (hasCountryCode) {
    cleaned = cleaned.substring(2);
  }

  // Phone format: (XX) XXXX-XXXX or (XX) 9XXXX-XXXX
  if (cleaned.length < 2) {
    return cleaned;
  }

  // Extract area code (DDD)
  const areaCode = cleaned.substring(0, 2);
  const number = cleaned.substring(2);

  // Determine if it's mobile (9 digits) or landline (8 digits)
  const isMobile = number.length >= 9;

  let formatted = '';

  if (internationalFormat) {
    // International format: +55 11 98765-4321 or +55 11 3456-7890
    if (includeCountryCode) {
      formatted = '+55 ';
    }
    formatted += `${areaCode} `;

    if (isMobile && number.length >= 5) {
      // Mobile: 9XXXX-XXXX
      formatted += `${number.substring(0, 5)}-${number.substring(5, 9)}`;
    } else if (number.length >= 4) {
      // Landline: XXXX-XXXX
      formatted += `${number.substring(0, 4)}-${number.substring(4, 8)}`;
    } else {
      formatted += number;
    }
  } else {
    // Brazilian format: (11) 98765-4321 or (11) 3456-7890
    formatted = `(${areaCode}) `;

    if (isMobile && number.length >= 5) {
      // Mobile: 9XXXX-XXXX
      formatted += `${number.substring(0, 5)}-${number.substring(5, 9)}`;
    } else if (number.length >= 4) {
      // Landline: XXXX-XXXX
      formatted += `${number.substring(0, 4)}-${number.substring(4, 8)}`;
    } else {
      formatted += number;
    }
  }

  return formatted;
}

/**
 * Create a phone formatter
 * 
 * @example
 * ```ts
 * import { createPhoneFormatter } from '@wsolutions/form-validation';
 * 
 * const formatter = createPhoneFormatter();
 * formatter.format('11987654321');     // "(11) 98765-4321"
 * formatter.format('1134567890');      // "(11) 3456-7890"
 * 
 * // With country code
 * const formatter2 = createPhoneFormatter({ includeCountryCode: true });
 * formatter2.format('11987654321');    // "+55 (11) 98765-4321"
 * 
 * // International format
 * const formatter3 = createPhoneFormatter({ 
 *   includeCountryCode: true, 
 *   internationalFormat: true 
 * });
 * formatter3.format('11987654321');    // "+55 11 98765-4321"
 * ```
 */
export function createPhoneFormatter(
  options: PhoneFormatterOptions = {}
): Formatter<string, string> {
  const {
    preserveOnError = true,
    includeCountryCode = false,
    internationalFormat = false,
  } = options;

  const config: FormatterConfig<string, string> = {
    name: 'phone',
    description: 'Format Brazilian phone number',
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

        return formatPhone(value, includeCountryCode, internationalFormat);
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
 * Create an unformat phone formatter (remove formatting)
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
 * Default export
 */
export default createPhoneFormatter;
