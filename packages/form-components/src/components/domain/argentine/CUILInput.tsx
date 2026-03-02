/**
 * CUILInput Component
 * 
 * Specialized input for Argentine CUIL (Código Único de Identificación Laboral)
 * Integrates validation and formatting automatically
 */

import React, { forwardRef } from 'react';
import { createCUILValidator, createCUILFormatter } from '@wsolutions/form-validation';
import { FieldGroup, type FieldGroupProps } from '../../field/FieldGroup';

/**
 * CUILInput props
 */
export interface CUILInputProps extends Omit<FieldGroupProps, 'validator' | 'formatter'> {
  /** Allow formatted input (with dashes) */
  allowFormatted?: boolean;
}

/**
 * CUILInput component
 * 
 * @example
 * ```tsx
 * import { CUILInput } from '@wsolutions/form-components';
 * 
 * function MyForm() {
 *   return (
 *     <CUILInput
 *       name="cuil"
 *       label="CUIL"
 *       placeholder="20-12345678-9"
 *       required
 *     />
 *   );
 * }
 * ```
 */
export const CUILInput = forwardRef<HTMLInputElement, CUILInputProps>(
  ({ allowFormatted = true, ...props }, ref) => {
    // Create validator and formatter
    const validator = React.useMemo(
      () => createCUILValidator({ allowFormatted }),
      [allowFormatted]
    );
    
    const formatter = React.useMemo(
      () => createCUILFormatter(),
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

CUILInput.displayName = 'CUILInput';

export default CUILInput;
