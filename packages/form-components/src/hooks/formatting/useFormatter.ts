/**
 * useFormatter Hook
 * 
 * React hook for using formatters from @wsolutions/form-validation
 * Provides automatic formatting as user types
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Formatter } from '@wsolutions/form-validation';

/**
 * Hook options
 */
export interface UseFormatterOptions {
  /** Format on mount */
  formatOnMount?: boolean;
  /** Format on blur only (not on change) */
  formatOnBlur?: boolean;
  /** Preserve cursor position after formatting */
  preserveCursor?: boolean;
}

/**
 * Hook return type
 */
export interface UseFormatterReturn {
  /** Current formatted value */
  formattedValue: string;
  /** Raw value (unformatted) */
  rawValue: string;
  /** Format a value */
  format: (value: string) => string;
  /** Handle input change with formatting */
  handleChange: (value: string) => void;
  /** Handle input blur */
  handleBlur: () => void;
  /** Reset to empty */
  reset: () => void;
  /** Set value programmatically */
  setValue: (value: string, shouldFormat?: boolean) => void;
}

/**
 * Hook to use a formatter with React state management
 * 
 * @example
 * ```tsx
 * import { useFormatter } from '@wsolutions/form-components';
 * import { createCPFFormatter } from '@wsolutions/form-validation';
 * 
 * function CPFInput() {
 *   const cpfFormatter = createCPFFormatter();
 *   const { formattedValue, handleChange } = useFormatter(cpfFormatter);
 * 
 *   return (
 *     <input
 *       value={formattedValue}
 *       onChange={(e) => handleChange(e.target.value)}
 *       placeholder="000.000.000-00"
 *     />
 *   );
 * }
 * ```
 */
export function useFormatter(
  formatter: Formatter<string, string>,
  options: UseFormatterOptions = {}
): UseFormatterReturn {
  const {
    formatOnMount = false,
    formatOnBlur = false,
    preserveCursor = true,
  } = options;

  const [formattedValue, setFormattedValue] = useState('');
  const [rawValue, setRawValue] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const cursorPositionRef = useRef<number | null>(null);

  /**
   * Format a value
   */
  const format = useCallback(
    (value: string): string => {
      return formatter.format(value);
    },
    [formatter]
  );

  /**
   * Handle input change with formatting
   */
  const handleChange = useCallback(
    (value: string) => {
      setRawValue(value);

      if (!formatOnBlur) {
        // Store cursor position before formatting
        if (preserveCursor && inputRef.current) {
          cursorPositionRef.current = inputRef.current.selectionStart;
        }

        const formatted = format(value);
        setFormattedValue(formatted);
      } else {
        // Don't format on change, just update raw value
        setFormattedValue(value);
      }
    },
    [format, formatOnBlur, preserveCursor]
  );

  /**
   * Handle input blur
   */
  const handleBlur = useCallback(() => {
    if (formatOnBlur) {
      const formatted = format(rawValue);
      setFormattedValue(formatted);
    }
  }, [format, formatOnBlur, rawValue]);

  /**
   * Set value programmatically
   */
  const setValue = useCallback(
    (value: string, shouldFormat = true) => {
      setRawValue(value);
      if (shouldFormat) {
        const formatted = format(value);
        setFormattedValue(formatted);
      } else {
        setFormattedValue(value);
      }
    },
    [format]
  );

  /**
   * Reset to empty
   */
  const reset = useCallback(() => {
    setFormattedValue('');
    setRawValue('');
    cursorPositionRef.current = null;
  }, []);

  /**
   * Format on mount if requested
   */
  useEffect(() => {
    if (formatOnMount && formattedValue) {
      const formatted = format(formattedValue);
      setFormattedValue(formatted);
    }
  }, [formatOnMount]);

  /**
   * Restore cursor position after formatting
   */
  useEffect(() => {
    if (preserveCursor && cursorPositionRef.current !== null && inputRef.current) {
      const newPosition = cursorPositionRef.current;
      // Try to restore cursor position
      // This is a simple implementation - may need adjustment for complex scenarios
      inputRef.current.setSelectionRange(newPosition, newPosition);
      cursorPositionRef.current = null;
    }
  }, [formattedValue, preserveCursor]);

  return {
    formattedValue,
    rawValue,
    format,
    handleChange,
    handleBlur,
    reset,
    setValue,
  };
}

/**
 * Default export
 */
export default useFormatter;
