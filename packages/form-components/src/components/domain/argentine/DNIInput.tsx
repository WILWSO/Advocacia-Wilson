/**
 * DNIInput Component
 * 
 * Specialized input for Argentine DNI (Documento Nacional de Identidad)
 * Integrates validation and formatting automatically
 */

import React, { forwardRef } from 'react';
import { createDNIValidator, createDNIFormatter } from '@wsolutions/form-validation';
import { FieldGroup, type FieldGroupProps } from '../../field/FieldGroup';

/**
 * DNIInput props
 */
export interface DNIInputProps extends Omit<FieldGroupProps, 'validator' | 'formatter'> {
  /** Allow formatted input (with dots) */
  allowFormatted?: boolean;
}

/**
 * DNIInput component
 * 
 * @example
 * ```tsx
 * import { DNIInput } from '@wsolutions/form-components';
 * 
 * function MyForm() {
 *   return (
 *     <DNIInput
 *       name="dni"
 *       label="DNI"
 *       placeholder="12.345.678"
 *       required
 *     />
 *   );
 * }
 * ```
 */
export const DNIInput = forwardRef<HTMLInputElement, DNIInputProps>(
  ({ allowFormatted = true, ...props }, ref) => {
    // Create validator and formatter
    const validator = React.useMemo(
      () => createDNIValidator({ allowFormatted }),
      [allowFormatted]
    );
    
    const formatter = React.useMemo(
      () => createDNIFormatter(),
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

DNIInput.displayName = 'DNIInput';

export default DNIInput;
