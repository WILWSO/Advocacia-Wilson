/**
 * Domain Input Factory
 * DRY abstraction for creating specialized domain input components
 * 
 * This factory eliminates code duplication across all domain inputs (CPF, CNPJ, DNI, etc.)
 * by providing a reusable pattern for creating validated and formatted inputs.
 */

import React, { forwardRef, useMemo } from 'react';
import type { Validator, Formatter } from '@wsolutions/form-validation';
import { FieldGroup, type FieldGroupProps } from '../field/FieldGroup';

/**
 * Domain input configuration
 */
export interface DomainInputConfig<TOptions = any> {
  /** Display name for React DevTools */
  displayName: string;
  /** Factory function to create validator */
  createValidator: (options?: TOptions) => Validator<any>;
  /** Factory function to create formatter */
  createFormatter: (options?: TOptions) => Formatter<any, any>;
  /** Default props to merge */
  defaultProps?: Partial<FieldGroupProps>;
}

/**
 * Creates a specialized domain input component
 * 
 * @example
 * ```tsx
 * import { createDomainInput } from '@wsolutions/form-components';
 * import { createCPFValidator, createCPFFormatter } from '@wsolutions/form-validation';
 * 
 * export interface CPFInputProps extends Omit<FieldGroupProps, 'validator' | 'formatter'> {
 *   allowFormatted?: boolean;
 * }
 * 
 * export const CPFInput = createDomainInput<CPFInputProps>({
 *   displayName: 'CPFInput',
 *   createValidator: (options) => createCPFValidator(options),
 *   createFormatter: () => createCPFFormatter(),
 *   defaultProps: {
 *     placeholder: '000.000.000-00',
 *     maxLength: 14,
 *   }
 * });
 * ```
 */
export function createDomainInput<TProps extends Omit<FieldGroupProps, 'validator' | 'formatter'> = any>(
  config: DomainInputConfig<TProps>
) {
  const { displayName, createValidator, createFormatter, defaultProps = {} } = config;

  const DomainInput = forwardRef<HTMLInputElement, TProps>((props, ref) => {
    // Extract options from props (everything that's not a FieldGroup prop)
    const options = props as any;

    // Create validator with memoization
    const validator = useMemo(
      () => createValidator(options),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(options)
    );

    // Create formatter with memoization
    const formatter = useMemo(
      () => createFormatter(options),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(options)
    );

    // Merge default props with provided props
    const mergedProps = {
      ...defaultProps,
      ...props,
    };

    return (
      <FieldGroup
        ref={ref}
        validator={validator as any}
        formatter={formatter as any}
        {...mergedProps}
      />
    );
  });

  DomainInput.displayName = displayName;

  return DomainInput;
}

/**
 * Simplified version for inputs that only need validation (no formatting)
 */
export function createValidatedDomainInput<TProps extends Omit<FieldGroupProps, 'validator' | 'formatter'> = any>(
  config: Omit<DomainInputConfig<TProps>, 'createFormatter'>
) {
  const { displayName, createValidator, defaultProps = {} } = config;

  const DomainInput = forwardRef<HTMLInputElement, TProps>((props, ref) => {
    const options = props as any;

    const validator = useMemo(
      () => createValidator(options),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(options)
    );

    const mergedProps = {
      ...defaultProps,
      ...props,
    };

    return (
      <FieldGroup
        ref={ref}
        validator={validator as any}
        {...mergedProps}
      />
    );
  });

  DomainInput.displayName = displayName;

  return DomainInput;
}

/**
 * Simplified version for inputs that only need formatting (no validation)
 */
export function createFormattedDomainInput<TProps extends Omit<FieldGroupProps, 'validator' | 'formatter'> = any>(
  config: Omit<DomainInputConfig<TProps>, 'createValidator'>
) {
  const { displayName, createFormatter, defaultProps = {} } = config;

  const DomainInput = forwardRef<HTMLInputElement, TProps>((props, ref) => {
    const options = props as any;

    const formatter = useMemo(
      () => createFormatter(options),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(options)
    );

    const mergedProps = {
      ...defaultProps,
      ...props,
    };

    return (
      <FieldGroup
        ref={ref}
        formatter={formatter as any}
        {...mergedProps}
      />
    );
  });

  DomainInput.displayName = displayName;

  return DomainInput;
}
