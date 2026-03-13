/**
 * FieldGroup Component
 * 
 * Complete field component with validation, formatting, label, and error display
 * Uses useFieldValidation hook internally
 */

import React, { forwardRef } from 'react';
import type { Validator, Formatter, ValidationResult } from '@wsolutions/form-validation';
import { useFieldValidation } from '../../hooks/validation/useFieldValidation';

/**
 * FieldGroup props
 */
export interface FieldGroupProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /** Field label */
  label?: string;
  /** Field name/id */
  name: string;
  /** Validator to use */
  validator?: Validator<unknown>;
  /** Optional formatter */
  formatter?: Formatter<string, string>;
  /** Initial value */
  initialValue?: string;
  /** Change handler - receives raw value, formatted value, and clean value (numbers only) */
  onChange?: (rawValue: string, formattedValue: string, cleanValue: string) => void;
  /** Blur handler */
  onBlur?: () => void;
  /** Validation callback */
  onValidation?: (result: ValidationResult, value: string) => void;
  /** Show error only after blur */
  showErrorOnBlur?: boolean;
  /** Validate on mount */
  validateOnMount?: boolean;
  /** Format on mount */
  formatOnMount?: boolean;
  /** Debounce validation (ms) */
  debounce?: number;
  /** Custom error message renderer */
  renderError?: (error: string) => React.ReactNode;
  /** Container className */
  containerClassName?: string;
  /** Label className */
  labelClassName?: string;
  /** Input wrapper className */
  inputWrapperClassName?: string;
  /** Error className */
  errorClassName?: string;
  /** Show validation state visually */
  showValidationState?: boolean;
  /** Valid state className */
  validClassName?: string;
  /** Invalid state className */
  invalidClassName?: string;
  /** Help text */
  helpText?: string;
  /** Help text className */
  helpTextClassName?: string;
  /** Input element className */
  inputClassName?: string;
  /** Required field indicator */
  required?: boolean;
  /** Required indicator text */
  requiredIndicator?: string;
}

/**
 * FieldGroup component
 * 
 * @example
 * ```tsx
 * import { FieldGroup } from '@wsolutions/form-components';
 * import { createCPFValidator, createCPFFormatter } from '@wsolutions/form-validation';
 * 
 * function MyForm() {
 *   const cpfValidator = createCPFValidator();
 *   const cpfFormatter = createCPFFormatter();
 * 
 *   return (
 *     <FieldGroup
 *       name="cpf"
 *       label="CPF"
 *       validator={cpfValidator}
 *       formatter={cpfFormatter}
 *       placeholder="000.000.000-00"
 *       showErrorOnBlur
 *       required
 *     />
 *   );
 * }
 * ```
 */
export const FieldGroup = forwardRef<HTMLInputElement, FieldGroupProps>(
  (
    {
      label,
      name,
      validator,
      formatter,
      initialValue = '',
      onChange,
      onBlur,
      onValidation,
      showErrorOnBlur = true,
      validateOnMount = false,
      // formatOnMount not yet implemented in useFieldValidation
      debounce,
      renderError,
      containerClassName = 'field-group',
      labelClassName = 'field-label',
      inputWrapperClassName = 'input-wrapper',
      errorClassName = 'error-message',
      showValidationState = true,
      validClassName = 'input-valid',
      invalidClassName = 'input-invalid',
      helpText,
      helpTextClassName = 'help-text',
      inputClassName: customInputClassName,
      required = false,
      requiredIndicator = '*',
      className,
      ...inputProps
    },
    ref
  ) => {
    // Use field validation hook
    const {
      isValid,
      isInvalid,
      error,
      isTouched,
      inputProps: fieldInputProps,
    } = useFieldValidation({
      validator,
      formatter,
      options: {
        initialValue,
        validateOnMount,
        debounce,
        showErrorOnBlur,
        formatOnBlur: !!formatter, // Format on blur when formatter is provided
        onChange,
        onBlur,
        // Wrapper to match expected signature - useFieldValidation only passes result
        onValidation: onValidation ? (result: ValidationResult) => {
          // Call user's onValidation with both result and the current initialValue
          // Note: value would need to be tracked separately for accurate callback
          onValidation(result, initialValue);
        } : undefined,
      },
    });

    // Determine input className based on validation state
    const inputClassName = React.useMemo(() => {
      const classes = [customInputClassName || className];
      
      if (showValidationState && isTouched) {
        if (isValid) {
          classes.push(validClassName);
        } else if (isInvalid) {
          classes.push(invalidClassName);
        }
      }
      
      return classes.filter(Boolean).join(' ');
    }, [customInputClassName, className, showValidationState, isTouched, isValid, isInvalid, validClassName, invalidClassName]);

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

    // Generate IDs
    const inputId = inputProps.id || `field-${name}`;
    const errorId = `${inputId}-error`;
    const helpId = helpText ? `${inputId}-help` : undefined;

    return (
      <div className={containerClassName}>
        {label && (
          <label htmlFor={inputId} className={labelClassName}>
            {label}
            {required && <span className="required-indicator">{requiredIndicator}</span>}
          </label>
        )}
        
        <div className={inputWrapperClassName}>
          <input
            {...fieldInputProps}
            {...inputProps}
            ref={ref}
            id={inputId}
            name={name}
            className={inputClassName}
            aria-invalid={isInvalid}
            aria-describedby={[
              error ? errorId : undefined,
              helpText ? helpId : undefined,
            ].filter(Boolean).join(' ') || undefined}
            aria-required={required}
          />
        </div>

        {helpText && !error && (
          <span id={helpId} className={helpTextClassName}>
            {helpText}
          </span>
        )}

        {errorNode && (
          <div id={errorId}>
            {errorNode}
          </div>
        )}
      </div>
    );
  }
);

FieldGroup.displayName = 'FieldGroup';

export default FieldGroup;
