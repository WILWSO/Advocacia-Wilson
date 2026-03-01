/**
 * CUIL/CUIT formatter
 * Formats CUIL/CUIT with standard Argentine format: XX-XXXXXXXX-X
 */

import type {
  Formatter,
  FormatterConfig,
  StringFormatterOptions,
} from '../../types/formatter.types';

/**
 * Remove non-numeric characters
 */
function removeNonNumeric(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Format CUIL/CUIT with dashes
 */
function formatCUIL(cuil: string): string {
  const cleaned = removeNonNumeric(cuil);
  
  if (cleaned.length === 0) {
    return '';
  }

  // Apply CUIL/CUIT format: XX-XXXXXXXX-X
  let formatted = '';
  for (let i = 0; i < Math.min(cleaned.length, 11); i++) {
    if (i === 2 || i === 10) {
      formatted += '-';
    }
    formatted += cleaned[i];
  }

  return formatted;
}

/**
 * Create a CUIL/CUIT formatter
 * 
 * @example
 * ```ts
 * import { createCUILFormatter } from '@wsolutions/form-validation';
 * 
 * const formatter = createCUILFormatter();
 * formatter.format('20123456789');     // "20-12345678-9"
 * formatter.format('20-12345678-9');   // "20-12345678-9"
 * formatter.format('201234');          // "20-1234" (partial)
 * ```
 */
export function createCUILFormatter(
  options: StringFormatterOptions = {}
): Formatter<string, string> {
  const { preserveOnError = true } = options;

  const config: FormatterConfig<string, string> = {
    name: 'cuil',
    description: 'Format CUIL/CUIT with dashes',
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

        return formatCUIL(value);
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
 * Create a CUIT formatter (alias for CUIL)
 */
export function createCUITFormatter(
  options: StringFormatterOptions = {}
): Formatter<string, string> {
  const formatter = createCUILFormatter(options);
  formatter.config.name = 'cuit';
  formatter.config.description = 'Format CUIT with dashes';
  return formatter;
}

/**
 * Create an unformat CUIL/CUIT formatter (remove formatting)
 */
export function createUnformatCUILFormatter(
  options: StringFormatterOptions = {}
): Formatter<string, string> {
  const { preserveOnError = true } = options;

  const config: FormatterConfig<string, string> = {
    name: 'unformat-cuil',
    description: 'Remove CUIL/CUIT formatting',
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
 * Alias for unformat CUIT
 */
export const createUnformatCUITFormatter = createUnformatCUILFormatter;

/**
 * Default export
 */
export default createCUILFormatter;
