/**
 * CNPJ formatter
 * Formats CNPJ with standard Brazilian format: ##.###.###/####-##
 */

import type {
  Formatter,
  FormatterConfig,
  StringFormatterOptions,
} from '../../types/formatter.types';
import { removeNonNumeric } from '../../utils/string.utils';

/**
 * Format CNPJ with dots, slash and dash
 */
function formatCNPJ(cnpj: string): string {
  const cleaned = removeNonNumeric(cnpj);
  
  if (cleaned.length === 0) {
    return '';
  }

  // Apply CNPJ format: ##.###.###/####-##
  let formatted = '';
  for (let i = 0; i < Math.min(cleaned.length, 14); i++) {
    if (i === 2 || i === 5) {
      formatted += '.';
    } else if (i === 8) {
      formatted += '/';
    } else if (i === 12) {
      formatted += '-';
    }
    formatted += cleaned[i];
  }

  return formatted;
}

/**
 * Create a CNPJ formatter
 * 
 * @example
 * ```ts
 * import { createCNPJFormatter } from '@wsolutions/form-validation';
 * 
 * const formatter = createCNPJFormatter();
 * formatter.format('11222333000181');      // "11.222.333/0001-81"
 * formatter.format('11.222.333/0001-81');  // "11.222.333/0001-81"
 * formatter.format('112223');              // "11.222.3" (partial)
 * ```
 */
export function createCNPJFormatter(
  options: StringFormatterOptions = {}
): Formatter<string, string> {
  const { preserveOnError = true } = options;

  const config: FormatterConfig<string, string> = {
    name: 'cnpj',
    description: 'Format CNPJ with dots, slash and dash',
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

        return formatCNPJ(value);
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
 * Create an unformat CNPJ formatter (remove formatting)
 */
export function createUnformatCNPJFormatter(
  options: StringFormatterOptions = {}
): Formatter<string, string> {
  const { preserveOnError = true } = options;

  const config: FormatterConfig<string, string> = {
    name: 'unformat-cnpj',
    description: 'Remove CNPJ formatting',
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
export default createCNPJFormatter;
