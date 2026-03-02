/**
 * useFieldValidation Hook
 * 
 * Combined hook that integrates validation and formatting
 * Provides a complete solution for form fields with validation + formatting
 */

import { useState, useCallback, useEffect } from 'react';
import type { Validator, Formatter, ValidationResult } from '@wsolutions/form-validation';

/**
 * Hook options
 */
export interface UseFieldValidationOptions {
  /** Initial value */
  initialValue?: string;
  /** Validate on mount */
  validateOnMount?: boolean;
  /** Validate on change */
  validateOnChange?: boolean;
  /** Validate on blur */
  validateOnBlur?: boolean;
  /** Format on blur only (not on change) */
  formatOnBlur?: boolean;
  /** Debounce validation in ms */
  debounce?: number;
  /** Show error only after first blur */
  showErrorOnBlur?: boolean;
  /** Custom onChange handler */
  onChange?: (value: string, formattedValue: string) => void;
  /** Custom onBlur handler */
  onBlur?: () => void;
  /** Custom onValidation handler */
  onValidation?: (result: ValidationResult) => void;
}

/**
 * Hook return type
 */
export interface UseFieldValidationReturn {
  /** Current value (formatted or raw) */
  value: string;
  /** Formatted value */
  formattedValue: string;
  /** Raw value (unformatted) */
  rawValue: string;
  /** Current validation result */
  validation: ValidationResult | null;
  /** Whether the field is valid */
  isValid: boolean;
  /** Whether the field is invalid */
  isInvalid: boolean;
  /** Current error message */
  error: string | null | undefined;
  /** Whether validation is in progress */
  isValidating: boolean;
  /** Whether the field has been touched */
  isTouched: boolean;
  /** Whether the field has been modified */
  isDirty: boolean;
  /** Handle input change */
  handleChange: (value: string) => void;
  /** Handle input blur */
  handleBlur: () => void;
  /** Validate current value */
  validate: () => Promise<ValidationResult>;
  /** Format current value */
  format: () => string;
  /** Set value programmatically */
  setValue: (value: string) => void;
  /** Mark as touched */
  setTouched: (touched: boolean) => void;
  /** Reset field state */
  reset: () => void;
  /** Props to spread on input element */
  inputProps: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
  };
}

/**
 * Combined hook for field validation and formatting
 * 
 * @example
 * ```tsx
 * import { useFieldValidation } from '@wsolutions/form-components';
 * import { createCPFValidator, createCPFFormatter } from '@wsolutions/form-validation';
 * 
 * function CPFField() {
 *   const cpfValidator = createCPFValidator();
 *   const cpfFormatter = createCPFFormatter();
 *   
 *   const {
 *     value,
 *     error,
 *     isTouched,
 *     inputProps
 *   } = useFieldValidation({
 *     validator: cpfValidator,
 *     formatter: cpfFormatter,
 *     validateOnBlur: true,
 *   });
 * 
 *   return (
 *     <div>
 *       <input {...inputProps} placeholder="000.000.000-00" />
 *       {isTouched && error && <span className="error">{error}</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useFieldValidation(config: {
  validator?: Validator<string>;
  formatter?: Formatter<string, string>;
  options?: UseFieldValidationOptions;
}): UseFieldValidationReturn {
  const { validator, formatter, options = {} } = config;
  
  const {
    initialValue = '',
    validateOnMount = false,
    validateOnChange = true,
    validateOnBlur = true,
    formatOnBlur = false,
    debounce = 0,
    showErrorOnBlur = true,
    onChange,
    onBlur,
    onValidation,
  } = options;

  const [rawValue, setRawValue] = useState(initialValue);
  const [formattedValue, setFormattedValue] = useState(initialValue);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  /**
   * Format value using formatter
   */
  const formatValue = useCallback(
    (value: string): string => {
      if (!formatter) return value;
      return formatter.format(value);
    },
    [formatter]
  );

  /**
   * Validate value using validator
   */
  const validateValue = useCallback(
    async (value: string): Promise<ValidationResult> => {
      if (!validator) {
        return { isValid: true };
      }

      // Clear previous debounce timeout
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      // If debounce is enabled, delay validation
      if (debounce > 0) {
        return new Promise((resolve) => {
          const timeout = setTimeout(async () => {
            setIsValidating(true);
            const result = await validator.validate(value);
            setValidation(result);
            setIsValidating(false);
            if (onValidation) onValidation(result);
            resolve(result);
          }, debounce);
          setDebounceTimeout(timeout);
        });
      }

      // Immediate validation
      setIsValidating(true);
      const result = await validator.validate(value);
      setValidation(result);
      setIsValidating(false);
      if (onValidation) onValidation(result);
      return result;
    },
    [validator, debounce, debounceTimeout, onValidation]
  );

  /**
   * Handle input change
   */
  const handleChange = useCallback(
    (value: string) => {
      setRawValue(value);
      setIsDirty(true);

      // Format value
      let formatted = value;
      if (formatter && !formatOnBlur) {
        formatted = formatValue(value);
      }
      setFormattedValue(formatted);

      // Call custom onChange
      if (onChange) {
        onChange(value, formatted);
      }

      // Validate on change if enabled
      if (validateOnChange && validator) {
        validateValue(value);
      }
    },
    [formatter, formatOnBlur, formatValue, validateOnChange, validator, validateValue, onChange]
  );

  /**
   * Handle input blur
   */
  const handleBlur = useCallback(() => {
    setIsTouched(true);

    // Format on blur if enabled
    if (formatOnBlur && formatter) {
      const formatted = formatValue(rawValue);
      setFormattedValue(formatted);
    }

    // Validate on blur if enabled
    if (validateOnBlur && validator) {
      validateValue(rawValue);
    }

    // Call custom onBlur
    if (onBlur) {
      onBlur();
    }
  }, [formatOnBlur, formatter, formatValue, rawValue, validateOnBlur, validator, validateValue, onBlur]);

  /**
   * Set value programmatically
   */
  const setValue = useCallback(
    (value: string) => {
      setRawValue(value);
      const formatted = formatter ? formatValue(value) : value;
      setFormattedValue(formatted);
      setIsDirty(true);
    },
    [formatter, formatValue]
  );

  /**
   * Reset field state
   */
  const reset = useCallback(() => {
    setRawValue(initialValue);
    setFormattedValue(initialValue);
    setValidation(null);
    setIsValidating(false);
    setIsTouched(false);
    setIsDirty(false);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
      setDebounceTimeout(null);
    }
  }, [initialValue, debounceTimeout]);

  /**
   * Validate on mount if requested
   */
  useEffect(() => {
    if (validateOnMount && validator) {
      validateValue(initialValue);
    }
  }, [validateOnMount]);

  /**
   * Cleanup debounce timeout on unmount
   */
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  // Determine if we should show the error
  const shouldShowError = showErrorOnBlur ? isTouched : true;
  const error = validation && !validation.isValid && shouldShowError ? validation.error : null;

  // Determine which value to use (formatted vs raw)
  const displayValue = formatter ? formattedValue : rawValue;

  return {
    value: displayValue,
    formattedValue,
    rawValue,
    validation,
    isValid: validation?.isValid ?? true,
    isInvalid: validation ? !validation.isValid : false,
    error,
    isValidating,
    isTouched,
    isDirty,
    handleChange,
    handleBlur,
    validate: () => validateValue(rawValue),
    format: () => formatValue(rawValue),
    setValue,
    setTouched: setIsTouched,
    reset,
    inputProps: {
      value: displayValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value),
      onBlur: handleBlur,
    },
  };
}

/**
 * Default export
 */
export default useFieldValidation;
