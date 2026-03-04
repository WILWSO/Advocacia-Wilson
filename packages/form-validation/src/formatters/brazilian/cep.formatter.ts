/**
 * CEP formatter
 * Formats CEP with standard Brazilian format: #####-###
 */

import type {
  Formatter,
  FormatterConfig,
  StringFormatterOptions,
} from '../../types/formatter.types';
import { removeNonNumeric } from '../../utils/string.utils';

/**
 * Format CEP with dash
 */
function formatCEP(cep: string): string {
  const cleaned = removeNonNumeric(cep);
  
  if (cleaned.length === 0) {
    return '';
  }

  // Apply CEP format: #####-###
  let formatted = '';
  for (let i = 0; i < Math.min(cleaned.length, 8); i++) {
    if (i === 5) {
      formatted += '-';
    }
    formatted += cleaned[i];
  }

  return formatted;
}

/**
 * Create a CEP formatter
 * 
 * @example
 * ```ts
 * import { createCEPFormatter } from '@wsolutions/form-validation';
 * 
 * const formatter = createCEPFormatter();
 * formatter.format('01310100');    // "01310-100"
 * formatter.format('01310-100');   // "01310-100"
 * formatter.format('01310');       // "01310" (partial)
 * ```
 */
export function createCEPFormatter(
  options: StringFormatterOptions = {}
): Formatter<string, string> {
  const { preserveOnError = true } = options;

  const config: FormatterConfig<string, string> = {
    name: 'cep',
    description: 'Format CEP with dash',
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

        return formatCEP(value);
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
 * Create an unformat CEP formatter (remove formatting)
 */
export function createUnformatCEPFormatter(
  options: StringFormatterOptions = {}
): Formatter<string, string> {
  const { preserveOnError = true } = options;

  const config: FormatterConfig<string, string> = {
    name: 'unformat-cep',
    description: 'Remove CEP formatting',
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
export default createCEPFormatter;
