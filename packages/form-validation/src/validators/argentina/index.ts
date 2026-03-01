/**
 * Argentine validators
 * Domain-specific validators for Argentine documents and formats
 */

export { createDNIValidator, validateDNI } from './dni.validator';
export type { DNIValidatorOptions } from './dni.validator';

export {
  createCUILValidator,
  createCUITValidator,
  validateCUIL,
  validateCUIT,
} from './cuil.validator';
export type { CUILValidatorOptions } from './cuil.validator';
