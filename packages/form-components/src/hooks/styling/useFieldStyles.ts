/**
 * useFieldStyles Hook
 * Merges default Tailwind styles with custom className overrides
 */

import { useMemo } from 'react';
import type { ValidationState, FieldSize } from '../config/styles.config';
import { DEFAULT_FIELD_STYLES } from '../config/styles.config';

/**
 * Utility to merge Tailwind classes
 * Later classes override earlier ones
 */
function mergeClasses(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Hook options
 */
export interface UseFieldStylesOptions {
  /** Validation state */
  state?: ValidationState;
  /** Field size */
  size?: FieldSize;
  /** Custom container className */
  containerClassName?: string;
  /** Custom label className */
  labelClassName?: string;
  /** Custom input className */
  inputClassName?: string;
  /** Custom error className */
  errorClassName?: string;
  /** Custom help className */
  helpClassName?: string;
  /** Custom required indicator className */
  requiredClassName?: string;
}

/**
 * Hook return value
 */
export interface FieldStyles {
  container: string;
  label: string;
  input: string;
  error: string;
  help: string;
  required: string;
}

/**
 * useFieldStyles - Get field styles with optional customization
 * 
 * @example
 * ```tsx
 * const styles = useFieldStyles({
 *   state: 'invalid',
 *   size: 'lg',
 *   inputClassName: 'custom-input-class'
 * });
 * 
 * <div className={styles.container}>
 *   <label className={styles.label}>Name</label>
 *   <input className={styles.input} />
 *   <span className={styles.error}>Error message</span>
 * </div>
 * ```
 */
export function useFieldStyles(options: UseFieldStylesOptions = {}): FieldStyles {
  const {
    state = 'default',
    size = 'md',
    containerClassName,
    labelClassName,
    inputClassName,
    errorClassName,
    helpClassName,
    requiredClassName,
  } = options;

  return useMemo(
    () => ({
      container: mergeClasses(
        DEFAULT_FIELD_STYLES.container,
        containerClassName
      ),
      label: mergeClasses(
        DEFAULT_FIELD_STYLES.label,
        labelClassName
      ),
      input: mergeClasses(
        DEFAULT_FIELD_STYLES.input,
        DEFAULT_FIELD_STYLES.inputSizes[size],
        state !== 'default' && DEFAULT_FIELD_STYLES.inputStates[state],
        inputClassName
      ),
      error: mergeClasses(
        DEFAULT_FIELD_STYLES.error,
        errorClassName
      ),
      help: mergeClasses(
        DEFAULT_FIELD_STYLES.help,
        helpClassName
      ),
      required: mergeClasses(
        DEFAULT_FIELD_STYLES.required,
        requiredClassName
      ),
    }),
    [
      state,
      size,
      containerClassName,
      labelClassName,
      inputClassName,
      errorClassName,
      helpClassName,
      requiredClassName,
    ]
  );
}

/**
 * Utility function for standalone class merging
 * Useful when you need to merge classes outside of a hook
 * 
 * @example
 * ```tsx
 * <input className={cn('base-class', customClass, isError && 'error-class')} />
 * ```
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
