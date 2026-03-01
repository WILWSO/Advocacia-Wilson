/**
 * Trim formatter
 * Removes whitespace or specific characters from string edges
 */

import type {
  Formatter,
  FormatterConfig,
  TrimFormatterOptions,
} from '../../types/formatter.types';

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Trim specific characters from string
 */
function trimCharacters(str: string, characters: string, type: 'start' | 'end' | 'both'): string {
  const escapedChars = escapeRegex(characters);
  const pattern = `[${escapedChars}]`;

  switch (type) {
    case 'start':
      return str.replace(new RegExp(`^${pattern}+`), '');
    case 'end':
      return str.replace(new RegExp(`${pattern}+$`), '');
    case 'both':
      return str.replace(new RegExp(`^${pattern}+|${pattern}+$`, 'g'), '');
    default:
      return str;
  }
}

/**
 * Create a trim formatter
 * 
 * @example
 * ```ts
 * // Trim whitespace (default)
 * const formatter = createTrimFormatter();
 * formatter.format('  hello  '); // "hello"
 * 
 * // Trim start only
 * const formatter2 = createTrimFormatter({ type: 'start' });
 * formatter2.format('  hello  '); // "hello  "
 * 
 * // Trim specific characters
 * const formatter3 = createTrimFormatter({ characters: '.-' });
 * formatter3.format('...hello---'); // "hello"
 * ```
 */
export function createTrimFormatter(
  options: TrimFormatterOptions = {}
): Formatter<string, string> {
  const {
    type = 'both',
    characters,
    preserveOnError = true,
  } = options;

  const config: FormatterConfig<string, string> = {
    name: 'trim',
    description: `Trim ${type === 'both' ? 'both edges' : type} of string`,
    format: (value: string): string => {
      if (typeof value !== 'string') {
        return preserveOnError ? value : '';
      }

      try {
        // If specific characters provided, use custom trim
        if (characters) {
          return trimCharacters(value, characters, type);
        }

        // Otherwise use native trim methods
        switch (type) {
          case 'start':
            return value.trimStart();
          case 'end':
            return value.trimEnd();
          case 'both':
            return value.trim();
          default:
            return value;
        }
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
 * Convenience formatters
 */
export function createTrimStartFormatter(options: Omit<TrimFormatterOptions, 'type'> = {}) {
  return createTrimFormatter({ ...options, type: 'start' });
}

export function createTrimEndFormatter(options: Omit<TrimFormatterOptions, 'type'> = {}) {
  return createTrimFormatter({ ...options, type: 'end' });
}

/**
 * Standalone format functions
 */
export function formatTrim(value: string, options: TrimFormatterOptions = {}): string {
  const formatter = createTrimFormatter(options);
  return formatter.format(value);
}

// Default export
export default createTrimFormatter;
