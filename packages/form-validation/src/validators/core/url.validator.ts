/**
 * URL validator
 * Validates URLs with various options
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  CommonValidatorOptions,
} from '../../types/validator.types';

/**
 * URL validator options
 */
export interface UrlValidatorOptions extends CommonValidatorOptions {
  /** Custom error message */
  message?: string;
  /** Require protocol (http://, https://, etc.) */
  requireProtocol?: boolean;
  /** Allowed protocols */
  protocols?: string[];
  /** Require TLD */
  requireTld?: boolean;
  /** Allow localhost */
  allowLocalhost?: boolean;
  /** Allow IP addresses */
  allowIp?: boolean;
  /** Require HTTPS */
  requireHttps?: boolean;
}

/**
 * URL regex pattern
 */
const URL_REGEX = /^(?:(?:https?|ftp):\/\/)?(?:(?:[^\s@]+@)?(?:(?:(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])|(?:\d{1,3}\.){3}\d{1,3}|localhost))(?::\d{2,5})?(?:\/[^\s]*)?$/i;

/**
 * URL regex with required protocol
 */
const URL_REGEX_WITH_PROTOCOL = /^(?:https?|ftp):\/\/(?:(?:[^\s@]+@)?(?:(?:(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])|(?:\d{1,3}\.){3}\d{1,3}|localhost))(?::\d{2,5})?(?:\/[^\s]*)?$/i;

/**
 * Parse URL safely
 */
function parseUrl(url: string): URL | null {
  try {
    // Add protocol if missing for URL parser
    const urlWithProtocol = url.match(/^https?:\/\//i) ? url : `http://${url}`;
    return new URL(urlWithProtocol);
  } catch {
    return null;
  }
}

/**
 * Check if URL is localhost
 */
function isLocalhost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

/**
 * Check if hostname is an IP address
 */
function isIpAddress(hostname: string): boolean {
  // IPv4
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ipv4Regex.test(hostname)) return true;

  // IPv6 (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  return ipv6Regex.test(hostname);
}

/**
 * Create a URL validator
 * 
 * @example
 * ```ts
 * const validator = createUrlValidator();
 * validator.validate('https://example.com'); // { isValid: true }
 * validator.validate('not-a-url'); // { isValid: false }
 * 
 * // Require HTTPS
 * const validator2 = createUrlValidator({ requireHttps: true });
 * validator2.validate('http://example.com'); // { isValid: false }
 * 
 * // Allow specific protocols
 * const validator3 = createUrlValidator({
 *   protocols: ['https', 'ftp']
 * });
 * ```
 */
export function createUrlValidator(
  options: UrlValidatorOptions = {}
): Validator<string> {
  const {
    message = 'Please enter a valid URL',
    requireProtocol = false,
    protocols = ['http', 'https', 'ftp'],
    requireTld = true,
    allowLocalhost = true,
    allowIp = true,
    requireHttps = false,
    allowNull = false,
    allowUndefined = false,
    allowEmpty = false,
    trim = true,
  } = options;

  const config: ValidatorConfig<string> = {
    name: 'url',
    message,
    validate: (value: string, context?: ValidationContext): ValidationResult => {
      // Handle null/undefined/empty
      if (value === null && allowNull) return { isValid: true };
      if (value === undefined && allowUndefined) return { isValid: true };
      if (value === '' && allowEmpty) return { isValid: true };

      if (typeof value !== 'string') {
        return {
          isValid: false,
          error: 'URL must be a string',
          details: { value, fieldName: context?.fieldName },
        };
      }

      // Trim if needed
      const url = trim ? value.trim() : value;

      // Basic regex validation
      const regex = requireProtocol ? URL_REGEX_WITH_PROTOCOL : URL_REGEX;
      if (!regex.test(url)) {
        return {
          isValid: false,
          error: message,
          details: { value: url, fieldName: context?.fieldName },
        };
      }

      // Parse URL for detailed validation
      const parsed = parseUrl(url);
      if (!parsed) {
        return {
          isValid: false,
          error: message,
          details: { value: url, fieldName: context?.fieldName },
        };
      }

      // Check protocol
      const protocol = parsed.protocol.replace(':', '');
      if (!protocols.includes(protocol)) {
        return {
          isValid: false,
          error: `Protocol must be one of: ${protocols.join(', ')}`,
          details: { value: url, protocol, allowedProtocols: protocols, fieldName: context?.fieldName },
        };
      }

      // Require HTTPS
      if (requireHttps && protocol !== 'https') {
        return {
          isValid: false,
          error: 'URL must use HTTPS protocol',
          details: { value: url, protocol, fieldName: context?.fieldName },
        };
      }

      // Check localhost
      if (!allowLocalhost && isLocalhost(parsed.hostname)) {
        return {
          isValid: false,
          error: 'Localhost URLs are not allowed',
          details: { value: url, hostname: parsed.hostname, fieldName: context?.fieldName },
        };
      }

      // Check IP addresses
      if (!allowIp && isIpAddress(parsed.hostname)) {
        return {
          isValid: false,
          error: 'IP address URLs are not allowed',
          details: { value: url, hostname: parsed.hostname, fieldName: context?.fieldName },
        };
      }

      // Check TLD
      if (requireTld && !isLocalhost(parsed.hostname) && !isIpAddress(parsed.hostname)) {
        const hasTld = parsed.hostname.includes('.') && parsed.hostname.split('.').length >= 2;
        if (!hasTld) {
          return {
            isValid: false,
            error: 'URL must have a valid top-level domain',
            details: { value: url, hostname: parsed.hostname, fieldName: context?.fieldName },
          };
        }
      }

      return { isValid: true };
    },
  };

  return {
    config,
    validate: config.validate,
    getName: () => config.name,
    getMessage: () => config.message,
    isAsync: () => false,
  };
}

/**
 * Standalone URL validation function
 */
export function validateUrl(
  value: string,
  options: UrlValidatorOptions = {}
): ValidationResult {
  const validator = createUrlValidator(options);
  return validator.validate(value) as ValidationResult;
}

// Default export
export default createUrlValidator;
