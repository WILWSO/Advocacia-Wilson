/**
 * Brazilian validators
 * Domain-specific validators for Brazilian documents and formats
 */

export { createCPFValidator, validateCPF } from './cpf.validator';
export type { CPFValidatorOptions } from './cpf.validator';

export { createCNPJValidator, validateCNPJ } from './cnpj.validator';
export type { CNPJValidatorOptions } from './cnpj.validator';

export { createCEPValidator, validateCEP } from './cep.validator';
export type { CEPValidatorOptions } from './cep.validator';

export { createPhoneValidator, validatePhone } from './phone.validator';
export type { PhoneValidatorOptions } from './phone.validator';
