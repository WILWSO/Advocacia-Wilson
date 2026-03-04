/**
 * Security sanitization utilities for user input
 * Prevents XSS, injection attacks, and malicious content
 */

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param value - Input string to sanitize
 * @returns Escaped string safe for HTML rendering
 */
export function escapeHtml(value: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return value.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Removes potentially dangerous characters from input
 * Allows: alphanumeric, spaces, common punctuation, accented characters
 * @param value - Input string to clean
 * @returns Cleaned string
 */
export function cleanInput(value: string): string {
  // Remove control characters and most special chars except safe ones
  // Allows: letters (including accented), numbers, spaces, and safe punctuation: . , - _ @ ()
  return value
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/[^\w\s.,\-_@()áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/gi, ''); // Allow safe chars
}

/**
 * Strict alphanumeric filter - removes everything except letters and numbers
 * @param value - Input string to filter
 * @returns String with only alphanumeric characters
 */
export function alphanumericOnly(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Removes all non-numeric characters
 * @param value - Input string
 * @returns String with only digits
 */
export function numericOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Trims whitespace and normalizes multiple spaces to single space
 * @param value - Input string
 * @returns Normalized string
 */
export function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/**
 * Comprehensive input sanitization combining multiple strategies
 * Use this for general text inputs where security is a concern
 * @param value - Input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(value: string): string {
  return normalizeWhitespace(cleanInput(value));
}

/**
 * Sanitizes email input - allows only valid email characters
 * @param value - Email string to sanitize
 * @returns Sanitized email string
 */
export function sanitizeEmail(value: string): string {
  // Allow: alphanumeric, @, ., -, _, +
  return value
    .toLowerCase()
    .replace(/[^a-z0-9@.\-_+]/g, '')
    .trim();
}

/**
 * Prevents SQL injection by escaping single quotes
 * Note: This is a basic protection. Use parameterized queries in backend!
 * @param value - Input string
 * @returns String with escaped quotes
 */
export function escapeSqlQuotes(value: string): string {
  return value.replace(/'/g, "''");
}
