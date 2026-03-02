/**
 * CPFInput Component
 * 
 * Specialized input for Brazilian CPF (Cadastro de Pessoas Físicas)
 * Integrates validation and formatting automatically
 */

import React, { forwardRef } from 'react';
import { createCPFValidator, createCPFFormatter } from '@wsolutions/form-validation';
import { FieldGroup, type FieldGroupProps } from '../../field/FieldGroup';

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
export const CPFInput = forwardRef<HTMLInputElement, CPFInputProps>(
  ({ allowFormatted = true, ...props }, ref) => {
    // Create validator and formatter
    const validator = React.useMemo(
      () => createCPFValidator({ allowFormatted }),
      [allowFormatted]
    );
    
    const formatter = React.useMemo(
      () => createCPFFormatter(),
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

CPFInput.displayName = 'CPFInput';

export default CPFInput;
