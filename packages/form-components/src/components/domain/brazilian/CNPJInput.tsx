/**
 * CNPJInput Component
 * 
 * Specialized input for Brazilian CNPJ (Cadastro Nacional da Pessoa Jurídica)
 * Integrates validation and formatting automatically
 */

import React, { forwardRef } from 'react';
import { createCNPJValidator, createCNPJFormatter } from '@wsolutions/form-validation';
import { FieldGroup, type FieldGroupProps } from '../../field/FieldGroup';

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
export const CNPJInput = forwardRef<HTMLInputElement, CNPJInputProps>(
  ({ allowFormatted = true, ...props }, ref) => {
    // Create validator and formatter
    const validator = React.useMemo(
      () => createCNPJValidator({ allowFormatted }),
      [allowFormatted]
    );
    
    const formatter = React.useMemo(
      () => createCNPJFormatter(),
      []
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

CNPJInput.displayName = 'CNPJInput';

export default CNPJInput;
