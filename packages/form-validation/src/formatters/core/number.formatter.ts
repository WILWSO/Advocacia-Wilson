/**
 * Number formatter
 * Formats numbers with decimals, thousands separators, currency, etc.
 */

import type {
  Formatter,
  FormatterConfig,
  NumberFormatterOptions,
} from '../../types/formatter.types';

/**
 * Format number with custom separators
 */
function formatNumberWithSeparators(
  num: number,
  decimals?: number,
  decimalSeparator: string = '.',
  thousandsSeparator: string = ','
): string {
  // Handle decimals
  const fixed = decimals !== undefined ? num.toFixed(decimals) : num.toString();
  const parts = fixed.split('.');

  // Format integer part with thousands separator
  if (parts[0]) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  }

  // Join with decimal separator
  return parts.join(decimalSeparator);
}

/**
 * Parse string to number (handle different formats)
 */
function parseNumber(value: string | number): number | null {
  if (typeof value === 'number') {
    return isNaN(value) ? null : value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  // Remove whitespace
  const cleaned = value.trim();

  // Try to parse as-is first
  let num = Number(cleaned);
  if (!isNaN(num)) {
    return num;
  }

  // Try removing common thousands separators and converting decimal separator
  const normalized = cleaned
    .replace(/[.,\s]/g, (match) => {
      // Last occurrence is likely decimal separator
      const lastComma = cleaned.lastIndexOf(',');
      const lastDot = cleaned.lastIndexOf('.');
      const index = cleaned.indexOf(match);

      if (index === lastComma || index === lastDot) {
        return '.'; // Convert to decimal point
      }
      return ''; // Remove thousands separator
    });

  num = Number(normalized);
  return isNaN(num) ? null : num;
}

/**
 * Create a number formatter
 * 
 * @example
 * ```ts
 * // Basic formatting
 * const formatter = createNumberFormatter({ decimals: 2 });
 * formatter.format(1234.5); // "1,234.50"
 * 
 * // Brazilian format
 * const brFormatter = createNumberFormatter({
 *   decimals: 2,
 *   decimalSeparator: ',',
 *   thousandsSeparator: '.'
 * });
 * brFormatter.format(1234.5); // "1.234,50"
 * 
 * // Currency
 * const currencyFormatter = createNumberFormatter({
 *   decimals: 2,
 *   currency: 'R$',
 *   currencyPosition: 'prefix',
 *   decimalSeparator: ',',
 *   thousandsSeparator: '.'
 * });
 * currencyFormatter.format(1234.5); // "R$ 1.234,50"
 * ```
 */
export function createNumberFormatter(
  options: NumberFormatterOptions = {}
): Formatter<number | string, string> {
  const {
    decimals,
    decimalSeparator = '.',
    thousandsSeparator = ',',
    currency,
    currencyPosition = 'prefix',
    locale,
    preserveOnError = true,
  } = options;

  const config: FormatterConfig<number | string, string> = {
    name: 'number',
    description: 'Format number with separators and currency',
    format: (value: number | string): string => {
      try {
        // Parse to number
        const num = typeof value === 'number' ? value : parseNumber(value);

        if (num === null) {
          return preserveOnError ? String(value) : '';
        }

        // Use Intl.NumberFormat if locale provided
        if (locale) {
          const options: Intl.NumberFormatOptions = {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          };

          if (currency) {
            options.style = 'currency';
            options.currency = currency;
          }

          return new Intl.NumberFormat(locale, options).format(num);
        }

        // Manual formatting
        let formatted = formatNumberWithSeparators(
          num,
          decimals,
          decimalSeparator,
          thousandsSeparator
        );

        // Add currency
        if (currency) {
          formatted = currencyPosition === 'prefix'
            ? `${currency} ${formatted}`
            : `${formatted} ${currency}`;
        }

        return formatted;
      } catch (error) {
        return preserveOnError ? String(value) : '';
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
export function createCurrencyFormatter(
  currency: string,
  options: Omit<NumberFormatterOptions, 'currency'> = {}
) {
  return createNumberFormatter({
    ...options,
    currency,
    decimals: options.decimals ?? 2,
  });
}

export function createBrazilianCurrencyFormatter(
  options: Omit<NumberFormatterOptions, 'currency' | 'decimalSeparator' | 'thousandsSeparator'> = {}
) {
  return createNumberFormatter({
    ...options,
    currency: 'R$',
    currencyPosition: 'prefix',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    decimals: options.decimals ?? 2,
  });
}

export function createPercentageFormatter(
  options: Omit<NumberFormatterOptions, 'currency'> = {}
) {
  return createNumberFormatter({
    ...options,
    currency: '%',
    currencyPosition: 'suffix',
    decimals: options.decimals ?? 2,
  });
}

/**
 * Standalone format function
 */
export function formatNumber(
  value: number | string,
  options: NumberFormatterOptions = {}
): string {
  const formatter = createNumberFormatter(options);
  return formatter.format(value);
}

// Default export
export default createNumberFormatter;
