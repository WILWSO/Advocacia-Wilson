/**
 * CNPJInput Component
 * 
 * Specialized input for Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica)
 * Integrates validation and formatting automatically
 */

import { createCNPJValidator, createCNPJFormatter } from '@wsolutions/form-validation';
import { createDomainInput } from '../createDomainInput';
import type { FieldGroupProps } from '../../field/FieldGroup';

/**
 * CNPJInput props
 */
export interface CNPJInputProps extends Omit<FieldGroupProps, 'validator' | 'formatter'> {
  /** Allow formatted input (with dots, slash and dash) */
  allowFormatted?: boolean;
}

/**
 * CNPJInput component
 * 
 * @example
 * ```tsx
 * import { CNPJInput } from '@wsolutions/form-components';
 * 
 * function MyForm() {
 *   return (
 *     <CNPJInput
 *       name="cnpj"
 *       label="CNPJ"
 *       placeholder="00.000.000/0000-00"
 *       required
 *     />
 *   );
 * }
 * ```
 */
export const CNPJInput = createDomainInput<CNPJInputProps>({
  displayName: 'CNPJInput',
  createValidator: (options) => createCNPJValidator({ allowFormatted: options?.allowFormatted }),
  createFormatter: () => createCNPJFormatter(),
  defaultProps: {
    placeholder: '00.000.000/0000-00',
    maxLength: 18,
  },
});

export default CNPJInput;
