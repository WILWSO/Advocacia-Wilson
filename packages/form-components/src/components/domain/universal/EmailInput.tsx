/**
 * EmailInput Component
 * 
 * Specialized input for email addresses with RFC 5322 validation
 * Integrates validation and formatting automatically
 */

import { createEmailValidator } from '@wsolutions/form-validation';
import { createValidatedDomainInput } from '../createDomainInput';
import type { FieldGroupProps } from '../../field/FieldGroup';

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
export const EmailInput = createValidatedDomainInput<EmailInputProps>({
  displayName: 'EmailInput',
  createValidator: (options) => createEmailValidator({ 
    allowDisposable: options?.allowDisposable,
    requireTld: options?.requireTld ?? true
  }),
  defaultProps: {
    type: 'email',
    placeholder: 'seu@email.com',
    maxLength: 254,
  },
});

export default EmailInput;
