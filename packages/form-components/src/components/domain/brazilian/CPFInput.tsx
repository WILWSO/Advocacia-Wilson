/**
 * CPFInput Component
 * 
 * Specialized input for Brazilian CPF (Cadastro de Pessoas Físicas)
 * Integrates validation and formatting automatically
 */

import { createCPFValidator, createCPFFormatter } from '@wsolutions/form-validation';
import { createDomainInput } from '../createDomainInput';
import type { FieldGroupProps } from '../../field/FieldGroup';

/**
 * CPFInput props
 */
export interface CPFInputProps extends Omit<FieldGroupProps, 'validator' | 'formatter'> {
  /** Allow formatted input (with dots and dash) */
  allowFormatted?: boolean;
}

/**
 * CPFInput component
 * 
 * @example
 * ```tsx
 * import { CPFInput } from '@wsolutions/form-components';
 * 
 * function MyForm() {
 *   return (
 *     <CPFInput
 *       name="cpf"
 *       label="CPF"
 *       placeholder="000.000.000-00"
 *       required
 *     />
 *   );
 * }
 * ```
 */
export const CPFInput = createDomainInput<CPFInputProps>({
  displayName: 'CPFInput',
  createValidator: (options) => createCPFValidator({ allowFormatted: options?.allowFormatted }),
  createFormatter: () => createCPFFormatter(),
  defaultProps: {
    placeholder: '000.000.000-00',
    maxLength: 14,
  },
});

export default CPFInput;
