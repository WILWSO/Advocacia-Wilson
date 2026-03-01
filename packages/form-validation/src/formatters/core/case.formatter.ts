/**
 * Case formatter
 * Transforms string case (uppercase, lowercase, title case, etc.)
 */

import type {
  Formatter,
  FormatterConfig,
  CaseFormatterOptions,
} from '../../types/formatter.types';

/**
 * Convert string to uppercase
 */
function toUpperCase(str: string, locale?: string): string {
  return locale ? str.toLocaleUpperCase(locale) : str.toUpperCase();
}

/**
 * Convert string to lowercase
 */
function toLowerCase(str: string, locale?: string): string {
  return locale ? str.toLocaleLowerCase(locale) : str.toLowerCase();
}

/**
 * Convert string to title case (capitalize first letter of each word)
 */
function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

/**
 * Convert string to sentence case (capitalize first letter of first word)
 */
function toSentenceCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to camelCase
 */
function toCamelCase(str: string): string {
  return str
    .replace(/[\s_-]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * Convert string to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .replace(/[\s_-]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[a-z]/, (char) => char.toUpperCase());
}

/**
 * Convert string to snake_case
 */
function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[\s-]+/g, '_')
    .replace(/^_/, '')
    .toLowerCase();
}

/**
 * Convert string to kebab-case
 */
function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/[\s_]+/g, '-')
    .replace(/^-/, '')
    .toLowerCase();
}

/**
 * Create a case formatter
 * 
 * @example
 * ```ts
 * const upperFormatter = createCaseFormatter({ case: 'upper' });
 * upperFormatter.format('hello world'); // "HELLO WORLD"
 * 
 * const titleFormatter = createCaseFormatter({ case: 'title' });
 * titleFormatter.format('hello world'); // "Hello World"
 * 
 * const camelFormatter = createCaseFormatter({ case: 'camel' });
 * camelFormatter.format('hello world'); // "helloWorld"
 * ```
 */
export function createCaseFormatter(
  options: CaseFormatterOptions = {}
): Formatter<string, string> {
  const {
    case: caseType = 'lower',
    locale,
    preserveOnError = true,
  } = options;

  const config: FormatterConfig<string, string> = {
    name: 'case',
    description: `Transform string to ${caseType} case`,
    format: (value: string): string => {
      if (typeof value !== 'string') {
        return preserveOnError ? value : '';
      }

      try {
        switch (caseType) {
          case 'upper':
            return toUpperCase(value, locale);
          case 'lower':
            return toLowerCase(value, locale);
          case 'title':
            return toTitleCase(value);
          case 'sentence':
            return toSentenceCase(value);
          case 'camel':
            return toCamelCase(value);
          case 'pascal':
            return toPascalCase(value);
          case 'snake':
            return toSnakeCase(value);
          case 'kebab':
            return toKebabCase(value);
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
export function createUpperCaseFormatter(options: Omit<CaseFormatterOptions, 'case'> = {}) {
  return createCaseFormatter({ ...options, case: 'upper' });
}

export function createLowerCaseFormatter(options: Omit<CaseFormatterOptions, 'case'> = {}) {
  return createCaseFormatter({ ...options, case: 'lower' });
}

export function createTitleCaseFormatter(options: Omit<CaseFormatterOptions, 'case'> = {}) {
  return createCaseFormatter({ ...options, case: 'title' });
}

export function createSentenceCaseFormatter(options: Omit<CaseFormatterOptions, 'case'> = {}) {
  return createCaseFormatter({ ...options, case: 'sentence' });
}

export function createCamelCaseFormatter(options: Omit<CaseFormatterOptions, 'case'> = {}) {
  return createCaseFormatter({ ...options, case: 'camel' });
}

export function createPascalCaseFormatter(options: Omit<CaseFormatterOptions, 'case'> = {}) {
  return createCaseFormatter({ ...options, case: 'pascal' });
}

export function createSnakeCaseFormatter(options: Omit<CaseFormatterOptions, 'case'> = {}) {
  return createCaseFormatter({ ...options, case: 'snake' });
}

export function createKebabCaseFormatter(options: Omit<CaseFormatterOptions, 'case'> = {}) {
  return createCaseFormatter({ ...options, case: 'kebab' });
}

/**
 * Standalone format functions
 */
export function formatCase(value: string, options: CaseFormatterOptions = {}): string {
  const formatter = createCaseFormatter(options);
  return formatter.format(value);
}

// Default export
export default createCaseFormatter;
