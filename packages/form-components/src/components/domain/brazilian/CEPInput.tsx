/**
 * CEPInput Component
 * 
 * Specialized input for Brazilian CEP (Código de Endereçamento Postal)
 * Integrates validation and formatting automatically
 */

import React, { forwardRef } from 'react';
import { createCEPValidator, createCEPFormatter } from '@wsolutions/form-validation';
import { FieldGroup, type FieldGroupProps } from '../../field/FieldGroup';

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
export const CEPInput = forwardRef<HTMLInputElement, CEPInputProps>(
  ({ allowFormatted = true, ...props }, ref) => {
    // Create validator and formatter
    const validator = React.useMemo(
      () => createCEPValidator({ allowFormatted }),
      [allowFormatted]
    );
    
    const formatter = React.useMemo(
      () => createCEPFormatter(),
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

CEPInput.displayName = 'CEPInput';

export default CEPInput;
