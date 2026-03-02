/**
 * FormattedInput Component
 * 
 * Input component with integrated formatting from @wsolutions/form-validation
 * Uses useFormatter hook internally
 */

import React, { forwardRef } from 'react';
import type { Formatter } from '@wsolutions/form-validation';
import { useFormatter } from '../../hooks/formatting/useFormatter';

/**
 * FormattedInput props
 */
export interface FormattedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'onBlur'> {
  /** Formatter to use */
  formatter: Formatter<string, string>;
  /** Current value (raw or formatted) */
  value?: string;
  /** Change handler - receives formatted and raw values */
  onChange: (formattedValue: string, rawValue: string) => void;
  /** Blur handler */
  onBlur?: (formattedValue: string, rawValue: string) => void;
  /** Format on mount */
  formatOnMount?: boolean;
  /** Format on blur only (not on change) */
  formatOnBlur?: boolean;
  /** Preserve cursor position after formatting */
  preserveCursor?: boolean;
  /** Container className */
  containerClassName?: string;
}

/**
 * FormattedInput component
 * 
 * @example
 * ```tsx
 * import { FormattedInput } from '@wsolutions/form-components';
 * import { createCPFFormatter } from '@wsolutions/form-validation';
 * 
 * function MyForm() {
 *   const [cpf, setCpf] = useState('');
 *   const cpfFormatter = createCPFFormatter();
 * 
 *   return (
 *     <FormattedInput
 *       formatter={cpfFormatter}
 *       value={cpf}
 *       onChange={(formatted, raw) => setCpf(formatted)}
 *       placeholder="000.000.000-00"
 *     />
 *   );
 * }
 * ```
 */
export const FormattedInput = forwardRef<HTMLInputElement, FormattedInputProps>(
  (
    {
      formatter,
      value: initialValue = '',
      onChange,
      onBlur,
      formatOnMount = false,
      formatOnBlur = false,
      preserveCursor = true,
      containerClassName,
      className,
      ...inputProps
    },
    ref
  ) => {
    // Use formatter hook
    const {
      formattedValue,
      rawValue,
      handleChange: handleFormatterChange,
      handleBlur: handleFormatterBlur,
      setValue,
    } = useFormatter(formatter, {
      formatOnMount,
      formatOnBlur,
      preserveCursor,
    });

    // Sync initial value
    React.useEffect(() => {
      if (initialValue !== formattedValue && initialValue !== rawValue) {
        setValue(initialValue, formatOnMount);
      }
    }, [initialValue, formattedValue, rawValue, setValue, formatOnMount]);

    // Handle change
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        handleFormatterChange(newValue);
        
        // Call onChange with both formatted and raw values
        // In formatOnBlur mode, both will be the same until blur
        const formatted = formatOnBlur ? newValue : formatter.format(newValue);
        // Raw value is just the input value without formatting
        onChange(formatted, newValue);
      },
      [handleFormatterChange, onChange, formatter, formatOnBlur]
    );

    // Handle blur
    const handleBlur = React.useCallback(() => {
      handleFormatterBlur();
      
      if (onBlur) {
        // After blur, formattedValue should be up to date
        onBlur(formattedValue, rawValue);
      }
    }, [handleFormatterBlur, onBlur, formattedValue, rawValue]);

    // Render component
    if (containerClassName) {
      return (
        <div className={containerClassName}>
          <input
            ref={ref}
            value={formattedValue}
            onChange={handleChange}
            onBlur={handleBlur}
            className={className}
            {...inputProps}
          />
        </div>
      );
    }

    return (
      <input
        ref={ref}
        value={formattedValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className={className}
        {...inputProps}
      />
    );
  }
);

FormattedInput.displayName = 'FormattedInput';

export default FormattedInput;
