/**
 * Core formatter types
 * 
 * This file defines the base interfaces and types for all formatters
 */

/**
 * Formatter function signature
 */
export type FormatterFn<I = any, O = any> = (
  value: I,
  options?: FormatterOptions
) => O;

/**
 * Formatter options
 */
export interface FormatterOptions {
  /** Locale for formatting */
  locale?: string;
  /** Custom formatting options */
  options?: Record<string, any>;
}

/**
 * Formatter configuration
 */
export interface FormatterConfig<I = any, O = any> {
  /** Formatter name/identifier */
  name: string;
  /** Formatting function */
  format: FormatterFn<I, O>;
  /** Description of what this formatter does */
  description?: string;
}

/**
 * Formatter with configuration options
 */
export interface Formatter<I = any, O = any> {
  /** Formatter configuration */
  config: FormatterConfig<I, O>;
  /** Execute formatting */
  format: (value: I, options?: FormatterOptions) => O;
  /** Get formatter name */
  getName: () => string;
  /** Get formatter description */
  getDescription: () => string | undefined;
}

/**
 * Options for creating formatters
 */
export interface CreateFormatterOptions {
  /** Custom formatting options */
  options?: Record<string, any>;
}

/**
 * Formatter factory function
 */
export type FormatterFactory<I = any, O = any, Opts = any> = (
  options?: Opts & CreateFormatterOptions
) => Formatter<I, O>;

/**
 * String formatter options
 */
export interface StringFormatterOptions extends CreateFormatterOptions {
  /** Preserve original if formatting fails */
  preserveOnError?: boolean;
}

/**
 * Case transformation options
 */
export interface CaseFormatterOptions extends StringFormatterOptions {
  /** Case type */
  case?: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab';
  /** Locale for case transformation */
  locale?: string;
}

/**
 * Trim options
 */
export interface TrimFormatterOptions extends StringFormatterOptions {
  /** Where to trim */
  type?: 'start' | 'end' | 'both';
  /** Characters to trim (default: whitespace) */
  characters?: string;
}

/**
 * Mask formatter options
 */
export interface MaskFormatterOptions extends StringFormatterOptions {
  /** Mask pattern (e.g., "###.###.###-##") */
  mask: string;
  /** Character to use for mask placeholders (default: "#") */
  placeholder?: string;
  /** Allow incomplete values */
  allowIncomplete?: boolean;
  /** Reverse mask (apply from right to left) */
  reverse?: boolean;
}

/**
 * Number formatter options
 */
export interface NumberFormatterOptions extends CreateFormatterOptions {
  /** Decimal places */
  decimals?: number;
  /** Decimal separator */
  decimalSeparator?: string;
  /** Thousands separator */
  thousandsSeparator?: string;
  /** Currency symbol */
  currency?: string;
  /** Currency position */
  currencyPosition?: 'prefix' | 'suffix';
  /** Locale for number formatting */
  locale?: string;
}

/**
 * Date formatter options
 */
export interface DateFormatterOptions extends CreateFormatterOptions {
  /** Date format pattern */
  format?: string;
  /** Input format (for parsing strings) */
  inputFormat?: string;
  /** Locale for date formatting */
  locale?: string;
  /** Timezone */
  timezone?: string;
}

/**
 * Phone formatter options
 */
export interface PhoneFormatterOptions extends StringFormatterOptions {
  /** Country code */
  countryCode?: string;
  /** Format style */
  format?: 'international' | 'national' | 'e164' | 'rfc3966';
  /** Include country code */
  includeCountryCode?: boolean;
}

/**
 * Document formatter options (CPF, CNPJ, etc.)
 */
export interface DocumentFormatterOptions extends StringFormatterOptions {
  /** Document type */
  type?: 'cpf' | 'cnpj' | 'rg' | 'cep' | 'auto';
  /** Remove formatting */
  unformat?: boolean;
}

/**
 * Composed formatter options
 */
export interface ComposedFormatterOptions extends CreateFormatterOptions {
  /** Stop on first error */
  stopOnError?: boolean;
}

/**
 * Format configuration for a field
 */
export interface FieldFormatConfig {
  /** Formatter to apply */
  formatter: Formatter<any, any>;
  /** When to apply formatting */
  when?: 'onChange' | 'onBlur' | 'onSubmit' | 'always';
  /** Whether to format on display only */
  displayOnly?: boolean;
}

/**
 * Format schema for an object
 */
export type FormatSchema<T = any> = {
  [K in keyof T]?: Formatter<any, any> | Formatter<any, any>[] | FieldFormatConfig;
};
