/**
 * Email validator
 * Validates email addresses using RFC 5322 compliant regex
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  CommonValidatorOptions,
} from '../../types/validator.types';

/**
 * Email validator options
 */
export interface EmailValidatorOptions extends CommonValidatorOptions {
  /** Custom error message */
  message?: string;
  /** Allow disposable email domains */
  allowDisposable?: boolean;
  /** Require specific domains */
  domains?: string[];
  /** Block specific domains */
  blockedDomains?: string[];
  /** Allow plus addressing (e.g., user+tag@domain.com) */
  allowPlusAddressing?: boolean;
  /** Require TLD (top-level domain) */
  requireTld?: boolean;
}

/**
 * RFC 5322 compliant email regex (simplified)
 * Covers most common email formats
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Email regex without TLD requirement
 */
const EMAIL_REGEX_NO_TLD = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;

/**
 * Common disposable email domains
 */
const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  'throwaway.email',
  'guerrillamail.com',
  '10minutemail.com',
  'mailinator.com',
  'maildrop.cc',
  'temp-mail.org',
];

/**
 * Validate email format
 */
function isValidEmailFormat(email: string, requireTld: boolean = true): boolean {
  const regex = requireTld ? EMAIL_REGEX : EMAIL_REGEX_NO_TLD;
  return regex.test(email);
}

/**
 * Extract domain from email
 */
function extractDomain(email: string): string {
  const parts = email.split('@');
  return parts.length === 2 && parts[1] ? parts[1].toLowerCase() : '';
}

/**
 * Check if domain is disposable
 */
function isDisposableDomain(domain: string): boolean {
  return DISPOSABLE_DOMAINS.includes(domain.toLowerCase());
}

/**
 * Create an email validator
 * 
 * @example
 * ```ts
 * const validator = createEmailValidator();
 * const result = validator.validate('user@example.com');
 * // { isValid: true }
 * 
 * const result2 = validator.validate('invalid-email');
 * // { isValid: false, error: 'Please enter a valid email address' }
 * 
 * const validator2 = createEmailValidator({
 *   domains: ['company.com', 'company.org']
 * });
 * const result3 = validator2.validate('user@company.com');
 * // { isValid: true }
 * ```
 */
export function createEmailValidator(
  options: EmailValidatorOptions = {}
): Validator<string> {
  const {
    message = 'Please enter a valid email address',
    allowDisposable = true,
    domains = [],
    blockedDomains = [],
    allowPlusAddressing = true,
    requireTld = true,
    allowNull = false,
    allowUndefined = false,
    allowEmpty = false,
    trim = true,
  } = options;

  const config: ValidatorConfig<string> = {
    name: 'email',
    message,
    validate: (value: string, context?: ValidationContext): ValidationResult => {
      // Handle null/undefined/empty
      if (value === null && allowNull) return { isValid: true };
      if (value === undefined && allowUndefined) return { isValid: true };
      if (value === '' && allowEmpty) return { isValid: true };

      if (!value || (typeof value !== 'string')) {
        return { isValid: false, error: message };
      }

      // Trim if needed
      const email = trim ? value.trim() : value;

      // Check for plus addressing
      if (!allowPlusAddressing && email.includes('+')) {
        return {
          isValid: false,
          error: 'Plus addressing is not allowed',
          details: { value: email, fieldName: context?.fieldName },
        };
      }

      // Validate format
      if (!isValidEmailFormat(email, requireTld)) {
        return {
          isValid: false,
          error: message,
          details: { value: email, fieldName: context?.fieldName },
        };
      }

      // Extract domain
      const domain = extractDomain(email);

      // Check blocked domains
      if (blockedDomains.length > 0 && blockedDomains.includes(domain)) {
        return {
          isValid: false,
          error: `Email domain ${domain} is not allowed`,
          details: { value: email, domain, fieldName: context?.fieldName },
        };
      }

      // Check allowed domains
      if (domains.length > 0 && !domains.includes(domain)) {
        return {
          isValid: false,
          error: `Email must be from one of these domains: ${domains.join(', ')}`,
          details: { value: email, domain, allowedDomains: domains, fieldName: context?.fieldName },
        };
      }

      // Check disposable domains
      if (!allowDisposable && isDisposableDomain(domain)) {
        return {
          isValid: false,
          error: 'Disposable email addresses are not allowed',
          details: { value: email, domain, fieldName: context?.fieldName },
        };
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
 * Standalone email validation function
 */
export function validateEmail(
  value: string,
  options: EmailValidatorOptions = {}
): ValidationResult {
  const validator = createEmailValidator(options);
  return validator.validate(value) as ValidationResult;
}

// Default export
export default createEmailValidator;
