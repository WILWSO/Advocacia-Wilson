/**
 * DNI formatter
 * Formats DNI with standard Argentine format: ##.###.###
 */

import type {
  Formatter,
  FormatterConfig,
  StringFormatterOptions,
} from '../../types/formatter.types';
import { removeNonNumeric } from '../../utils/string.utils';

/**
 * Format DNI with dots
 */
function formatDNI(dni: string): string {
  const cleaned = removeNonNumeric(dni);
  
  if (cleaned.length === 0) {
    return '';
  }

  const length = cleaned.length;

  // No formatting for 1-3 digits
  if (length <= 3) {
    return cleaned;
  }

  // 7 digits: use format #.###.###
  if (length === 7) {
    return `${cleaned[0]}.${cleaned.substring(1, 4)}.${cleaned.substring(4, 7)}`;
  }

  // 4 digits: partial of 7-digit format (#.###)
  if (length === 4) {
    return `${cleaned[0]}.${cleaned.substring(1, 4)}`;
  }

  // 5-8 digits: use format ##.###.### (8-digit format)
  let formatted = '';
  for (let i = 0; i < Math.min(length, 8); i++) {
    if (i === 2) {
      formatted += '.';
    }
    if (i === 5) {
      formatted += '.';
    }
    formatted += cleaned[i];
  }

  return formatted;
}

/**
 * Create a DNI formatter
 * 
 * @example
 * ```ts
 * import { createDNIFormatter } from '@wsolutions/form-validation';
 * 
 * const formatter = createDNIFormatter();
 * formatter.format('12345678');    // "12.345.678"
 * formatter.format('1234567');     // "1.234.567"
 * formatter.format('12.345.678');  // "12.345.678"
 * formatter.format('12345');       // "12.345" (partial)
 * ```
 */
export function createDNIFormatter(
  options: StringFormatterOptions = {}
): Formatter<string, string> {
  const { preserveOnError = true } = options;

  const config: FormatterConfig<string, string> = {
    name: 'dni',
    description: 'Format DNI with dots',
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

        return formatDNI(value);
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
 * Create an unformat DNI formatter (remove formatting)
 */
export function createUnformatDNIFormatter(
  options: StringFormatterOptions = {}
): Formatter<string, string> {
  const { preserveOnError = true } = options;

  const config: FormatterConfig<string, string> = {
    name: 'unformat-dni',
    description: 'Remove DNI formatting',
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
export default createDNIFormatter;
