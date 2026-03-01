/**
 * Formatter composer
 * Combines multiple formatters into a single formatter
 */

import type {
  Formatter,
  FormatterConfig,
  FormatterOptions,
  ComposedFormatterOptions,
} from '../../types/formatter.types';

/**
 * Compose multiple formatters into one
 * Formatters are applied in sequence (left to right)
 * 
 * @example
 * ```ts
 * import { composeFormatters, createTrimFormatter, createUpperCaseFormatter } from '@wsolutions/form-validation';
 * 
 * const formatter = composeFormatters([
 *   createTrimFormatter(),
 *   createUpperCaseFormatter()
 * ]);
 * 
 * formatter.format('  hello world  '); // "HELLO WORLD"
 * 
 * // With error handling
 * const formatter2 = composeFormatters([
 *   createTrimFormatter(),
 *   createMaskFormatter({ mask: '###.###.###-##' })
 * ], { stopOnError: true });
 * ```
 */
export function composeFormatters<I = any, O = any>(
  formatters: Formatter<any, any>[],
  options: ComposedFormatterOptions = {}
): Formatter<I, O> {
  const { stopOnError = false } = options;

  if (!formatters || formatters.length === 0) {
    throw new Error('composeFormatters requires at least one formatter');
  }

  const config: FormatterConfig<I, O> = {
    name: 'composed',
    description: `Composed formatter with ${formatters.length} formatters`,
    format: (value: I, formatterOptions?: FormatterOptions): O => {
      let result: any = value;

      for (const formatter of formatters) {
        try {
          result = formatter.format(result, formatterOptions);
        } catch (error) {
          if (stopOnError) {
            // Return current result if stop on error
            return result;
          }
          // Otherwise continue with next formatter
        }
      }

      return result as O;
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
 * Pipe formatters (alias for composeFormatters)
 * More intuitive name for sequential formatting
 */
export function pipeFormatters<I = any, O = any>(
  formatters: Formatter<any, any>[],
  options: ComposedFormatterOptions = {}
): Formatter<I, O> {
  return composeFormatters(formatters, options);
}

/**
 * Chain formatters (alias for composeFormatters)
 */
export function chainFormatters<I = any, O = any>(
  formatters: Formatter<any, any>[],
  options: ComposedFormatterOptions = {}
): Formatter<I, O> {
  return composeFormatters(formatters, options);
}

/**
 * Create a conditional formatter
 * Applies formatter only when condition is met
 */
export function createConditionalFormatter<I = any, O = any>(
  formatter: Formatter<I, O>,
  condition: (value: I) => boolean,
  options: FormatterOptions = {}
): Formatter<I, O> {
  const config: FormatterConfig<I, O> = {
    name: 'conditional',
    description: `Conditional: ${formatter.getDescription() || formatter.getName()}`,
    format: (value: I, formatterOptions?: FormatterOptions): O => {
      const mergedOptions = { ...options, ...formatterOptions };
      
      if (condition(value)) {
        return formatter.format(value, mergedOptions);
      }
      
      return value as unknown as O;
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
 * Create a formatter that applies only when value is not empty
 */
export function createWhenNotEmptyFormatter<I = any, O = any>(
  formatter: Formatter<I, O>,
  options: FormatterOptions = {}
): Formatter<I, O> {
  return createConditionalFormatter(
    formatter,
    (value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    },
    options
  );
}

/**
 * Default export
 */
export default composeFormatters;
