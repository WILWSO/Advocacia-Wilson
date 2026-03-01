/**
 * Validator composer
 * Combines multiple validators into a single validator
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  ComposedValidatorOptions,
} from '../../types/validator.types';

/**
 * Compose multiple validators into one
 * 
 * @example
 * ```ts
 * import { composeValidators, createRequiredValidator, createEmailValidator } from '@wsolutions/form-validation';
 * 
 * const validator = composeValidators([
 *   createRequiredValidator(),
 *   createEmailValidator()
 * ]);
 * 
 * const result = validator.validate('user@example.com');
 * // { isValid: true }
 * 
 * const result2 = validator.validate('');
 * // { isValid: false, error: 'This field is required' }
 * ```
 */
export function composeValidators<T = any>(
  validators: Validator<T>[],
  options: ComposedValidatorOptions = {}
): Validator<T> {
  const {
    stopOnFirstError = true,
    parallel = false,
    message,
  } = options;

  if (!validators || validators.length === 0) {
    throw new Error('composeValidators requires at least one validator');
  }

  // Check if any validator is async
  const hasAsyncValidators = validators.some(v => v.isAsync());

  const config: ValidatorConfig<T> = {
    name: 'composed',
    message,
    async: hasAsyncValidators,
    validate: async (value: T, context?: ValidationContext): Promise<ValidationResult> => {
      const errors: string[] = [];
      const details: Record<string, any> = {};

      if (parallel && hasAsyncValidators) {
        // Run all validators in parallel
        const results = await Promise.all(
          validators.map(validator => validator.validate(value, context))
        );

        for (const result of results) {
          if (!result.isValid) {
            if (result.error) {
              errors.push(result.error);
            }
            if (result.details) {
              Object.assign(details, result.details);
            }
            if (stopOnFirstError) {
              break;
            }
          }
        }
      } else {
        // Run validators sequentially
        for (const validator of validators) {
          const result = await validator.validate(value, context);
          
          if (!result.isValid) {
            if (result.error) {
              errors.push(result.error);
            }
            if (result.details) {
              Object.assign(details, result.details);
            }
            if (stopOnFirstError) {
              break;
            }
          }
        }
      }

      if (errors.length > 0) {
        return {
          isValid: false,
          error: message || errors[0], // Use first error or custom message
          details: {
            ...details,
            allErrors: errors,
            fieldName: context?.fieldName,
          },
        };
      }

      return { isValid: true };
    },
  };

  return {
    config,
    validate: config.validate,
    getName: () => config.name,
    getMessage: () => config.message,
    isAsync: () => hasAsyncValidators,
  };
}

/**
 * Create a validator that runs validators in sequence
 * (alias for composeValidators with default options)
 */
export function chainValidators<T = any>(
  validators: Validator<T>[],
  options: Omit<ComposedValidatorOptions, 'stopOnFirstError'> = {}
): Validator<T> {
  return composeValidators(validators, { ...options, stopOnFirstError: true });
}

/**
 * Create a validator that collects all errors
 * (alias for composeValidators with stopOnFirstError: false)
 */
export function allValidators<T = any>(
  validators: Validator<T>[],
  options: Omit<ComposedValidatorOptions, 'stopOnFirstError'> = {}
): Validator<T> {
  return composeValidators(validators, { ...options, stopOnFirstError: false });
}

/**
 * Create a validator where at least one must pass (OR logic)
 */
export function anyValidator<T = any>(
  validators: Validator<T>[],
  options: ComposedValidatorOptions = {}
): Validator<T> {
  const { message = 'At least one validation must pass' } = options;

  if (!validators || validators.length === 0) {
    throw new Error('anyValidator requires at least one validator');
  }

  const hasAsyncValidators = validators.some(v => v.isAsync());

  const config: ValidatorConfig<T> = {
    name: 'any',
    message,
    async: hasAsyncValidators,
    validate: async (value: T, context?: ValidationContext): Promise<ValidationResult> => {
      const errors: string[] = [];

      for (const validator of validators) {
        const result = await validator.validate(value, context);
        
        if (result.isValid) {
          // At least one passed - return success
          return { isValid: true };
        }

        if (result.error) {
          errors.push(result.error);
        }
      }

      // All failed
      return {
        isValid: false,
        error: message,
        details: {
          allErrors: errors,
          fieldName: context?.fieldName,
        },
      };
    },
  };

  return {
    config,
    validate: config.validate,
    getName: () => config.name,
    getMessage: () => config.message,
    isAsync: () => hasAsyncValidators,
  };
}

/**
 * Default export
 */
export default composeValidators;
