/**
 * Maintenance Access Utilities
 * 
 * Utility functions for checking maintenance mode status and access
 * @module features/maintenance/utils
 */

import { MAINTENANCE_CONFIG } from '../config/maintenance.config';
import type { MaintenanceStatus } from '../types/maintenance.types';

/**
 * Check if maintenance mode is currently active
 * 
 * @returns {boolean} True if maintenance mode is active
 * 
 * @example
 * ```typescript
 * if (isMaintenanceModeActive()) {
 *   console.log('System is under maintenance');
 * }
 * ```
 */
export function isMaintenanceModeActive(): boolean {
  const envValue = import.meta.env.VITE_MAINTENANCE_MODE;
  return envValue?.toLowerCase() === 'true';
}

/**
 * Parse developer emails from environment variable
 * 
 * Expected format: "email1@example.com,email2@example.com,email3@example.com"
 * - Emails are trimmed
 * - Converted to lowercase for case-insensitive comparison
 * - Invalid emails are filtered out
 * 
 * @returns {string[]} Array of valid, lowercase email addresses
 * 
 * @example
 * ```typescript
 * // VITE_MAINTENANCE_DEV_EMAILS="admin@test.com,dev@test.com"
 * const devs = parseDevEmails();
 * // Returns: ['admin@test.com', 'dev@test.com']
 * ```
 */
export function parseDevEmails(): string[] {
  const envValue = import.meta.env.VITE_MAINTENANCE_DEV_EMAILS;

  if (!envValue || typeof envValue !== 'string') {
    return [];
  }

  return envValue
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0 && isValidEmail(email));
}

/**
 * Validate email format using regex
 * 
 * Basic validation - checks for:
 * - At least one character before @
 * - @ symbol
 * - At least one character after @
 * - Dot (.)
 * - Domain extension
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 * 
 * @example
 * ```typescript
 * isValidEmail('user@example.com')  // true
 * isValidEmail('invalid-email')     // false
 * isValidEmail('no@domain')         // false
 * ```
 */
function isValidEmail(email: string): boolean {
  // Basic email regex - not RFC 5322 compliant but good enough
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if a user has developer access during maintenance
 * 
 * Compares user email (case-insensitive) against whitelist
 * 
 * @param {string | null | undefined} userEmail - Email address of current user
 * @returns {boolean} True if user is in dev whitelist
 * 
 * @example
 * ```typescript
 * hasDevAccess('admin@test.com')  // true (if in whitelist)
 * hasDevAccess('user@test.com')   // false (not in whitelist)
 * hasDevAccess(null)              // false
 * hasDevAccess(undefined)         // false
 * ```
 */
export function hasDevAccess(userEmail: string | null | undefined): boolean {
  if (!userEmail) {
    return false;
  }

  const devEmails = parseDevEmails();
  const normalizedEmail = userEmail.toLowerCase().trim();
  
  return devEmails.includes(normalizedEmail);
}

/**
 * Get comprehensive maintenance status information
 * 
 * Useful for debugging and monitoring
 * Does not expose actual dev emails for security
 * 
 * @returns {MaintenanceStatus} Object with maintenance status details
 * 
 * @example
 * ```typescript
 * const status = getMaintenanceStatus();
 * console.log(status);
 * // {
 * //   isActive: true,
 * //   devEmailsCount: 3,
 * //   timestamp: '2026-03-03T10:30:00.000Z'
 * // }
 * ```
 */
export function getMaintenanceStatus(): MaintenanceStatus {
  return {
    isActive: isMaintenanceModeActive(),
    devEmailsCount: parseDevEmails().length,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validate environment configuration
 * 
 * Checks if maintenance mode environment variables are properly configured
 * 
 * @returns {Object} Validation result with status and messages
 * 
 * @example
 * ```typescript
 * const validation = validateMaintenanceConfig();
 * if (!validation.isValid) {
 *   console.error('Config errors:', validation.errors);
 * }
 * ```
 */
export function validateMaintenanceConfig(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if VITE_MAINTENANCE_MODE is set
  const maintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE;
  if (maintenanceMode === undefined) {
    warnings.push('VITE_MAINTENANCE_MODE not set - defaulting to false');
  } else if (!['true', 'false'].includes(maintenanceMode.toLowerCase())) {
    errors.push('VITE_MAINTENANCE_MODE must be "true" or "false"');
  }

  // Check dev emails if maintenance is active
  if (maintenanceMode?.toLowerCase() === 'true') {
    const devEmails = parseDevEmails();
    
    if (devEmails.length === 0) {
      warnings.push('Maintenance mode active but no dev emails configured');
    }

    // Check for duplicate emails
    const uniqueEmails = new Set(devEmails);
    if (uniqueEmails.size !== devEmails.length) {
      warnings.push('Duplicate dev emails detected in configuration');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Log maintenance status to console (development only)
 * 
 * @param {boolean} force - Force logging even in production
 */
export function logMaintenanceStatus(force = false): void {
  if (import.meta.env.MODE !== 'development' && !force) {
    return;
  }

  const status = getMaintenanceStatus();
  const validation = validateMaintenanceConfig();

  console.group('🔧 Maintenance Mode Status');
  console.log('Active:', status.isActive);
  console.log('Dev Emails Count:', status.devEmailsCount);
  console.log('Timestamp:', status.timestamp);
  
  if (validation.warnings.length > 0) {
    console.warn('Warnings:', validation.warnings);
  }
  
  if (validation.errors.length > 0) {
    console.error('Errors:', validation.errors);
  }
  
  console.groupEnd();
}
