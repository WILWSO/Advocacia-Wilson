/**
 * CPF formatter
 * Formats CPF with standard Brazilian format: ###.###.###-##
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
 * Format CPF with dots and dash
 */
function formatCPF(cpf: string): string {
  const cleaned = removeNonNumeric(cpf);
  
  if (cleaned.length === 0) {
    return '';
  }

  // Apply CPF format: ###.###.###-##
  let formatted = '';
  for (let i = 0; i < Math.min(cleaned.length, 11); i++) {
    if (i === 3 || i === 6) {
      formatted += '.';
    } else if (i === 9) {
      formatted += '-';
    }
    formatted += cleaned[i];
  }

  return formatted;
}

/**
 * Create a CPF formatter
 * 
 * @example
 * ```ts
 * import { createCPFFormatter } from '@wsolutions/form-validation';
 * 
 * const formatter = createCPFFormatter();
 * formatter.format('12345678909');     // "123.456.789-09"
 * formatter.format('123.456.789-09');  // "123.456.789-09"
 * formatter.format('123456');          // "123.456" (partial)
 * ```
 */
export function createCPFFormatter(
  options: StringFormatterOptions = {}
): Formatter<string, string> {
  const { preserveOnError = true } = options;

  const config: FormatterConfig<string, string> = {
    name: 'cpf',
    description: 'Format CPF with dots and dash',
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

        return formatCPF(value);
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
 * Create an unformat CPF formatter (remove formatting)
 */
export function createUnformatCPFFormatter(
  options: StringFormatterOptions = {}
): Formatter<string, string> {
  const { preserveOnError = true } = options;

  const config: FormatterConfig<string, string> = {
    name: 'unformat-cpf',
    description: 'Remove CPF formatting',
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
export default createCPFFormatter;
