/**
 * Brazilian formatters
 * Domain-specific formatters for Brazilian documents and formats
 */

export {
  createCPFFormatter,
  createUnformatCPFFormatter,
} from './cpf.formatter';

export {
  createCNPJFormatter,
  createUnformatCNPJFormatter,
} from './cnpj.formatter';

export {
  createCEPFormatter,
  createUnformatCEPFormatter,
} from './cep.formatter';

export {
  createPhoneFormatter,
  createUnformatPhoneFormatter,
} from './phone.formatter';
export type { PhoneFormatterOptions } from './phone.formatter';
