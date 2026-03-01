/**
 * Conditional validator
 * Runs validator only when condition is met
 */

import type {
  Validator,
  ValidatorConfig,
  ValidationResult,
  ValidationContext,
  ConditionalValidatorOptions,
} from '../../types/validator.types';

/**
 * Create a conditional validator
 * Validator only runs when condition function returns true
 * 
 * @example
 * ```ts
 * import { createConditionalValidator, createEmailValidator } from '@wsolutions/form-validation';
 * 
 * // Only validate email if value is not empty
 * const validator = createConditionalValidator(
 *   createEmailValidator(),
 *   {
 *     condition: (value) => value !== '' && value !== null && value !== undefined
 *   }
 * );
 * 
 * validator.validate(''); // { isValid: true } - condition not met, skip validation
 * validator.validate('invalid'); // { isValid: false } - condition met, validate
 * 
 * // Validate based on other field values
 * const validator2 = createConditionalValidator(
 *   createRequiredValidator(),
 *   {
 *     condition: (value, context) => {
 *       return context?.formValues?.type === 'business';
 *     }
 *   }
 * );
 * ```
 */
export function createConditionalValidator<T = any>(
  validator: Validator<T>,
  options: ConditionalValidatorOptions<T>
): Validator<T> {
  const { condition, message } = options;

  if (!condition) {
    throw new Error('ConditionalValidator requires a condition function');
  }

  const config: ValidatorConfig<T> = {
    name: 'conditional',
    message: message || validator.getMessage(),
    async: validator.isAsync(),
    validate: async (value: T, context?: ValidationContext): Promise<ValidationResult> => {
      // Check condition
      const shouldValidate = condition(value, context);

      if (!shouldValidate) {
        // Condition not met - skip validation, return as valid
        return { isValid: true };
      }

      // Condition met - run validator
      return await validator.validate(value, context);
    },
  };

  return {
    config,
    validate: config.validate,
    getName: () => config.name,
    getMessage: () => config.message,
    isAsync: () => validator.isAsync(),
  };
}

/**
 * Create validator that only runs when value is not empty
 */
export function createWhenNotEmptyValidator<T = any>(
  validator: Validator<T>,
  options: Omit<ConditionalValidatorOptions<T>, 'condition'> = {}
): Validator<T> {
  return createConditionalValidator(validator, {
    ...options,
    condition: (value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    },
  });
}

/**
 * Create validator that only runs when specific field has specific value
 */
export function createWhenFieldEqualsValidator<T = any>(
  validator: Validator<T>,
  fieldName: string,
  expectedValue: any,
  options: Omit<ConditionalValidatorOptions<T>, 'condition'> = {}
): Validator<T> {
  return createConditionalValidator(validator, {
    ...options,
    condition: (_value, context) => {
      return context?.formValues?.[fieldName] === expectedValue;
    },
  });
}

/**
 * Create validator that only runs when custom condition on form values is met
 */
export function createWhenFormValuesValidator<T = any>(
  validator: Validator<T>,
  condition: (formValues: Record<string, any>) => boolean,
  options: Omit<ConditionalValidatorOptions<T>, 'condition'> = {}
): Validator<T> {
  return createConditionalValidator(validator, {
    ...options,
    condition: (_value, context) => {
      return context?.formValues ? condition(context.formValues) : false;
    },
  });
}

/**
 * Default export
 */
export default createConditionalValidator;
