/**
 * CUITInput Component
 * 
 * Specialized input for Argentine CUIT (Código Único de Identificación Tributaria)
 * Integrates validation and formatting automatically
 */

import React, { forwardRef } from 'react';
import { createCUITValidator, createCUITFormatter } from '@wsolutions/form-validation';
import { FieldGroup, type FieldGroupProps } from '../../field/FieldGroup';

/**
 * CUITInput props
 */
export interface CUITInputProps extends Omit<FieldGroupProps, 'validator' | 'formatter'> {
  /** Allow formatted input (with dashes) */
  allowFormatted?: boolean;
}

/**
 * CUITInput component
 * 
 * @example
 * ```tsx
 * import { CUITInput } from '@wsolutions/form-components';
 * 
 * function MyForm() {
 *   return (
 *     <CUITInput
 *       name="cuit"
 *       label="CUIT"
 *       placeholder="30-12345678-9"
 *       required
 *     />
 *   );
 * }
 * ```
 */
export const CUITInput = forwardRef<HTMLInputElement, CUITInputProps>(
  ({ allowFormatted = true, ...props }, ref) => {
    // Create validator and formatter
    const validator = React.useMemo(
      () => createCUITValidator({ allowFormatted }),
      [allowFormatted]
    );
    
    const formatter = React.useMemo(
      () => createCUITFormatter(),
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

CUITInput.displayName = 'CUITInput';

export default CUITInput;
