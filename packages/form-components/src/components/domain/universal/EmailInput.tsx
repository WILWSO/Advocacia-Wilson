/**
 * EmailInput Component
 * 
 * Specialized input for email addresses with RFC 5322 validation
 * Integrates validation and formatting automatically
 */

import React, { forwardRef } from 'react';
import { createEmailValidator } from '@wsolutions/form-validation';
import { FieldGroup, type FieldGroupProps } from '../../field/FieldGroup';

/**
 * EmailInput props
 */
export interface EmailInputProps extends Omit<FieldGroupProps, 'validator' | 'formatter' | 'type'> {
  /** Allow disposable/temporary email providers (10minutemail, etc.) */
  allowDisposable?: boolean;
  /** Require top-level domain (.com, .br, etc.) */
  requireTld?: boolean;
  /** Maximum email length (RFC 5322 = 254) */
  maxLength?: number;
}

/**
 * EmailInput component
 * 
 * @example
 * ```tsx
 * import { EmailInput } from '@wsolutions/form-components';
 * 
 * function MyForm() {
 *   return (
 *     <EmailInput
 *       name="email"
 *       label="Email"
 *       placeholder="seu@email.com"
 *       required
 *     />
 *   );
 * }
 * ```
 */
export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ allowDisposable = false, requireTld = true, maxLength = 254, ...props }, ref) => {
    // Create validator
    const validator = React.useMemo(
      () => createEmailValidator({ 
        allowDisposable, 
        requireTld
      }),
      [allowDisposable, requireTld]
    );

    return (
      <FieldGroup
        ref={ref}
        type="email"
        validator={validator as any}
        maxLength={maxLength}
        {...props}
      />
    );
  }
);

EmailInput.displayName = 'EmailInput';

export default EmailInput;
