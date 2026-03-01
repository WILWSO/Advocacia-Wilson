/**
 * Mask formatter
 * Applies masks to strings (e.g., phone numbers, documents)
 */

import type {
  Formatter,
  FormatterConfig,
  MaskFormatterOptions,
} from '../../types/formatter.types';

/**
 * Remove all non-numeric characters
 */
function removeNonNumeric(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Apply mask to value
 */
function applyMask(
  value: string,
  mask: string,
  placeholder: string = '#',
  reverse: boolean = false
): string {
  let result = '';
  let valueIndex = reverse ? value.length - 1 : 0;
  const increment = reverse ? -1 : 1;

  for (let maskIndex = reverse ? mask.length - 1 : 0; 
       reverse ? maskIndex >= 0 : maskIndex < mask.length; 
       maskIndex += increment) {
    
    const maskChar = mask[maskIndex];

    if (maskChar === placeholder) {
      // Placeholder - insert value character
      if (reverse ? valueIndex >= 0 : valueIndex < value.length) {
        result = reverse ? value[valueIndex] + result : result + value[valueIndex];
        valueIndex += increment;
      } else {
        // No more value characters
        break;
      }
    } else {
      // Literal character - insert mask character
      result = reverse ? maskChar + result : result + maskChar;
    }
  }

  return result;
}

/**
 * Create a mask formatter
 * 
 * @example
 * ```ts
 * // Phone mask
 * const phoneFormatter = createMaskFormatter({
 *   mask: '(###) ###-####'
 * });
 * phoneFormatter.format('1234567890'); // "(123) 456-7890"
 * 
 * // CPF mask
 * const cpfFormatter = createMaskFormatter({
 *   mask: '###.###.###-##'
 * });
 * cpfFormatter.format('12345678900'); // "123.456.789-00"
 * 
 * // Currency (reverse)
 * const currencyFormatter = createMaskFormatter({
 *   mask: '#.###.###,##',
 *   reverse: true
 * });
 * currencyFormatter.format('123456'); // "1.234,56"
 * ```
 */
export function createMaskFormatter(
  options: MaskFormatterOptions
): Formatter<string, string> {
  const {
    mask,
    placeholder = '#',
    allowIncomplete = true,
    reverse = false,
    preserveOnError = true,
  } = options;

  if (!mask) {
    throw new Error('MaskFormatter requires a mask pattern');
  }

  // Count expected characters
  const expectedLength = (mask.match(new RegExp(escapeRegex(placeholder), 'g')) || []).length;

  const config: FormatterConfig<string, string> = {
    name: 'mask',
    description: `Apply mask pattern: ${mask}`,
    format: (value: string): string => {
      if (typeof value !== 'string') {
        return preserveOnError ? String(value) : '';
      }

      try {
        // Remove all non-numeric characters (adjust if needed for non-numeric masks)
        const cleaned = removeNonNumeric(value);

        // If no digits found, preserve original if preserveOnError is true
        if (cleaned.length === 0) {
          return preserveOnError ? value : '';
        }

        // Check if we have enough characters
        if (!allowIncomplete && cleaned.length < expectedLength) {
          return preserveOnError ? value : '';
        }

        // Apply mask
        const masked = applyMask(cleaned, mask, placeholder, reverse);

        return masked;
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
 * Helper to escape regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Remove mask from value (get only the data)
 */
export function removeMask(value: string): string {
  return removeNonNumeric(value);
}

/**
 * Standalone format function
 */
export function formatMask(value: string, options: MaskFormatterOptions): string {
  const formatter = createMaskFormatter(options);
  return formatter.format(value);
}

// Default export
export default createMaskFormatter;
