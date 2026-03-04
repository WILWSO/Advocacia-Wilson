/**
 * Shared string utility functions
 * Single Source of Truth for string manipulation
 */

/**
 * Removes all non-numeric characters from a string
 * @param value - Input string
 * @returns String containing only digits (0-9)
 * @example
 * removeNonNumeric('(11) 98765-4321') // '11987654321'
 * removeNonNumeric('123-456-7890') // '1234567890'
 */
export function removeNonNumeric(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Removes all non-alphanumeric characters from a string
 * @param value - Input string
 * @returns String containing only letters and numbers
 * @example
 * removeNonAlphanumeric('Hello, World!') // 'HelloWorld'
 * removeNonAlphanumeric('test-123') // 'test123'
 */
export function removeNonAlphanumeric(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Removes all whitespace from a string
 * @param value - Input string
 * @returns String without any whitespace
 * @example
 * removeWhitespace('  Hello World  ') // 'HelloWorld'
 */
export function removeWhitespace(value: string): string {
  return value.replace(/\s+/g, '');
}

/**
 * Truncates a string to a maximum length, adding ellipsis if needed
 * @param value - Input string
 * @param maxLength - Maximum length (including ellipsis)
 * @returns Truncated string
 * @example
 * truncate('Hello World', 8) // 'Hello...'
 */
export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalizes the first letter of a string
 * @param value - Input string
 * @returns String with first letter capitalized
 * @example
 * capitalize('hello') // 'Hello'
 */
export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/**
 * Converts a string to title case (each word capitalized)
 * @param value - Input string
 * @returns String in title case
 * @example
 * toTitleCase('hello world') // 'Hello World'
 */
export function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Checks if a string contains only digits
 * @param value - Input string
 * @returns True if string contains only digits
 * @example
 * isNumeric('123') // true
 * isNumeric('12a') // false
 */
export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * Checks if a string contains only alphanumeric characters
 * @param value - Input string
 * @returns True if string contains only letters and numbers
 * @example
 * isAlphanumeric('abc123') // true
 * isAlphanumeric('abc-123') // false
 */
export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value);
}
