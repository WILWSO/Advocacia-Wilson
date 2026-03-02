/**
 * BrazilianPhoneInput Component
 * 
 * Specialized input for Brazilian phone numbers
 * Integrates validation and formatting automatically
 */

import React, { forwardRef } from 'react';
import { createBrazilianPhoneValidator, createBrazilianPhoneFormatter } from '@wsolutions/form-validation';
import { FieldGroup, type FieldGroupProps } from '../../field/FieldGroup';

/**
 * BrazilianPhoneInput props
 */
export interface BrazilianPhoneInputProps extends Omit<FieldGroupProps, 'validator' | 'formatter'> {
  /** Allow formatted input */
  allowFormatted?: boolean;
  /** Only accept mobile numbers (9 digits) */
  mobileOnly?: boolean;
  /** Only accept landline numbers (8 digits) */
  landlineOnly?: boolean;
  /** Include country code (+55) in formatted output */
  includeCountryCode?: boolean;
}

/**
 * BrazilianPhoneInput component
 * 
 * @example
 * ```tsx
 * import { BrazilianPhoneInput } from '@wsolutions/form-components';
 * 
 * function MyForm() {
 *   return (
 *     <BrazilianPhoneInput
 *       name="phone"
 *       label="Telefone"
 *       placeholder="(00) 00000-0000"
 *       mobileOnly
 *       required
 *     />
 *   );
 * }
 * ```
 */
export const BrazilianPhoneInput = forwardRef<HTMLInputElement, BrazilianPhoneInputProps>(
  ({ allowFormatted = true, mobileOnly = false, landlineOnly = false, includeCountryCode = false, ...props }, ref) => {
    // Create validator and formatter
    const validator = React.useMemo(
      () => createBrazilianPhoneValidator({ allowFormatted, mobileOnly, landlineOnly }),
      [allowFormatted, mobileOnly, landlineOnly]
    );
    
    const formatter = React.useMemo(
      () => createBrazilianPhoneFormatter({ includeCountryCode }),
      [includeCountryCode]
    );

    return (
      <FieldGroup
        ref={ref}
        validator={validator as any}
        formatter={formatter as any}
        {...props}
      />
    );
  }
);

BrazilianPhoneInput.displayName = 'BrazilianPhoneInput';

export default BrazilianPhoneInput;
