/**
 * CEPInput Component
 * 
 * Specialized input for Brazilian CEP (Código de Endereçamento Postal)
 * Integrates validation and formatting automatically
 */

import { createCEPValidator, createCEPFormatter } from '@wsolutions/form-validation';
import { createDomainInput } from '../createDomainInput';
import type { FieldGroupProps } from '../../field/FieldGroup';

/**
 * CEPInput props
 */
export interface CEPInputProps extends Omit<FieldGroupProps, 'validator' | 'formatter'> {
  /** Allow formatted input (with dash) */
  allowFormatted?: boolean;
}

/**
 * CEPInput component
 * 
 * @example
 * ```tsx
 * import { CEPInput } from '@wsolutions/form-components';
 * 
 * function MyForm() {
 *   return (
 *     <CEPInput
 *       name="cep"
 *       label="CEP"
 *       placeholder="00000-000"
 *       required
 *     />
 *   );
 * }
 * ```
 */
export const CEPInput = createDomainInput<CEPInputProps>({
  displayName: 'CEPInput',
  createValidator: (options) => createCEPValidator({ allowFormatted: options?.allowFormatted }),
  createFormatter: () => createCEPFormatter(),
  defaultProps: {
    placeholder: '00000-000',
    maxLength: 9,
  },
});

export default CEPInput;
