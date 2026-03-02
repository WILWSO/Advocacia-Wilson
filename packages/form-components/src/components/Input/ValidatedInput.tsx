/**
 * ValidatedInput Component
 * 
 * Input component with integrated validation from @wsolutions/form-validation
 * Uses useValidator hook internally
 */

import React, { forwardRef } from 'react';
import type { Validator } from '@wsolutions/form-validation';
import { useValidator } from '../../hooks/validation/useValidator';

/**
 * ValidatedInput props
 */
export interface ValidatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Validator to use */
  validator: Validator<unknown>;
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Show error only after blur */
  showErrorOnBlur?: boolean;
  /** Validate on mount */
  validateOnMount?: boolean;
  /** Debounce validation (ms) */
  debounce?: number;
  /** Custom error message renderer */
  renderError?: (error: string) => React.ReactNode;
  /** Container className */
  containerClassName?: string;
  /** Error className */
  errorClassName?: string;
  /** Show validation state visually */
  showValidationState?: boolean;
  /** Valid state className */
  validClassName?: string;
  /** Invalid state className */
  invalidClassName?: string;
}

/**
 * ValidatedInput component
 * 
 * @example
 * ```tsx
 * import { ValidatedInput } from '@wsolutions/form-components';
 * import { createCPFValidator } from '@wsolutions/form-validation';
 * 
 * function MyForm() {
 *   const [cpf, setCpf] = useState('');
 *   const cpfValidator = createCPFValidator();
 * 
 *   return (
 *     <ValidatedInput
 *       validator={cpfValidator}
 *       value={cpf}
 *       onChange={setCpf}
 *       placeholder="000.000.000-00"
 *       showErrorOnBlur
 *     />
 *   );
 * }
 * ```
 */
export const ValidatedInput = forwardRef<HTMLInputElement, ValidatedInputProps>(
  (
    {
      validator,
      value,
      onChange,
      onBlur,
      showErrorOnBlur = true,
      validateOnMount = false,
      debounce,
      renderError,
      containerClassName,
      errorClassName = 'error-message',
      showValidationState = true,
      validClassName = 'input-valid',
      invalidClassName = 'input-invalid',
      className,
      ...inputProps
    },
    ref
  ) => {
    // Use validator hook
    const {
      isValid,
      isInvalid,
      error,
      validate,
      setTouched,
      isTouched,
    } = useValidator(validator, {
      validateOnMount,
      debounce,
      showErrorOnBlur,
    });

    // Handle change
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        validate(newValue);
      },
      [onChange, validate]
    );

    // Handle blur
    const handleBlur = React.useCallback(() => {
      setTouched(true);
      onBlur?.();
    }, [setTouched, onBlur]);

    // Determine input className based on validation state
    const inputClassName = React.useMemo(() => {
      const classes = [className];
      
      if (showValidationState && isTouched) {
        if (isValid) {
          classes.push(validClassName);
        } else if (isInvalid) {
          classes.push(invalidClassName);
        }
      }
      
      return classes.filter(Boolean).join(' ');
    }, [className, showValidationState, isTouched, isValid, isInvalid, validClassName, invalidClassName]);

    // Render error message
    const errorNode = React.useMemo(() => {
      if (!error) return null;
      
      if (renderError) {
        return renderError(error);
      }
      
      return (
        <span className={errorClassName} role="alert">
          {error}
        </span>
      );
    }, [error, renderError, errorClassName]);

    // Render component
    if (containerClassName) {
      return (
        <div className={containerClassName}>
          <input
            ref={ref}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName}
            aria-invalid={isInvalid}
            aria-describedby={error ? `${inputProps.id}-error` : undefined}
            {...inputProps}
          />
          {errorNode && (
            <div id={`${inputProps.id}-error`}>
              {errorNode}
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        <input
          ref={ref}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClassName}
          aria-invalid={isInvalid}
          aria-describedby={error ? `${inputProps.id}-error` : undefined}
          {...inputProps}
        />
        {errorNode && (
          <div id={`${inputProps.id}-error`}>
            {errorNode}
          </div>
        )}
      </>
    );
  }
);

ValidatedInput.displayName = 'ValidatedInput';

export default ValidatedInput;
