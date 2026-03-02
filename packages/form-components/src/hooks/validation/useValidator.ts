/**
 * useValidator Hook
 * 
 * React hook for using validators from @wsolutions/form-validation
 * Provides a simple interface to validate values with real-time feedback
 */

import { useState, useCallback, useEffect } from 'react';
import type { Validator, ValidationResult } from '@wsolutions/form-validation';

/**
 * Hook options
 */
export interface UseValidatorOptions {
  /** Validate on mount */
  validateOnMount?: boolean;
  /** Debounce delay in ms (0 = no debounce) */
  debounce?: number;
  /** Show error only after first blur */
  showErrorOnBlur?: boolean;
}

/**
 * Hook return type
 */
export interface UseValidatorReturn {
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
  /** Whether the field has been touched (blurred) */
  isTouched: boolean;
  /** Validate a value */
  validate: (value: unknown) => Promise<ValidationResult>;
  /** Mark field as touched */
  setTouched: (touched: boolean) => void;
  /** Reset validation state */
  reset: () => void;
}

/**
 * Hook to use a validator with React state management
 * 
 * @example
 * ```tsx
 * import { useValidator } from '@wsolutions/form-components';
 * import { createCPFValidator } from '@wsolutions/form-validation';
 * 
 * function CPFInput() {
 *   const [value, setValue] = useState('');
 *   const cpfValidator = createCPFValidator();
 *   const { isValid, error, validate, isTouched, setTouched } = useValidator(cpfValidator);
 * 
 *   return (
 *     <div>
 *       <input
 *         value={value}
 *         onChange={(e) => {
 *           setValue(e.target.value);
 *           validate(e.target.value);
 *         }}
 *         onBlur={() => setTouched(true)}
 *       />
 *       {isTouched && error && <span className="error">{error}</span>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useValidator<T = unknown>(
  validator: Validator<T>,
  options: UseValidatorOptions = {}
): UseValidatorReturn {
  const {
    validateOnMount = false,
    debounce = 0,
    showErrorOnBlur = true,
  } = options;

  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  /**
   * Validate a value
   */
  const validate = useCallback(
    async (value: unknown): Promise<ValidationResult> => {
      // Clear previous debounce timeout
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      // If debounce is enabled, delay validation
      if (debounce > 0) {
        return new Promise((resolve) => {
          const timeout = setTimeout(async () => {
            setIsValidating(true);
            const result = await validator.validate(value as T);
            setValidation(result);
            setIsValidating(false);
            resolve(result);
          }, debounce);
          setDebounceTimeout(timeout);
        });
      }

      // Immediate validation
      setIsValidating(true);
      const result = await validator.validate(value as T);
      setValidation(result);
      setIsValidating(false);
      return result;
    },
    [validator, debounce, debounceTimeout]
  );

  /**
   * Reset validation state
   */
  const reset = useCallback(() => {
    setValidation(null);
    setIsValidating(false);
    setIsTouched(false);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
      setDebounceTimeout(null);
    }
  }, [debounceTimeout]);

  /**
   * Validate on mount if requested
   */
  useEffect(() => {
    if (validateOnMount) {
      validate(undefined);
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

  return {
    validation,
    isValid: validation?.isValid ?? false,
    isInvalid: validation ? !validation.isValid : false,
    error,
    isValidating,
    isTouched,
    validate,
    setTouched: setIsTouched,
    reset,
  };
}

/**
 * Default export
 */
export default useValidator;
