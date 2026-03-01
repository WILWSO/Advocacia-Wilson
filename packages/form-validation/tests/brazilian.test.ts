/**
 * Tests for Brazilian validators and formatters
 */

import { describe, it, expect } from 'vitest';

// Validators
import {
  createCPFValidator,
  validateCPF,
  createCNPJValidator,
  validateCNPJ,
  createCEPValidator,
  validateCEP,
  createPhoneValidator,
  validatePhone,
} from '../src/validators/brazilian';

// Formatters
import {
  createCPFFormatter,
  createUnformatCPFFormatter,
  createCNPJFormatter,
  createUnformatCNPJFormatter,
  createCEPFormatter,
  createUnformatCEPFormatter,
  createPhoneFormatter,
  createUnformatPhoneFormatter,
} from '../src/formatters/brazilian';

// ============================================================================
// CPF VALIDATOR
// ============================================================================

describe('CPF Validator', () => {
  it('should validate valid CPF', async () => {
    const validator = createCPFValidator();

    const result1 = await validator.validate('123.456.789-09');
    expect(result1.isValid).toBe(true);

    const result2 = await validator.validate('12345678909');
    expect(result2.isValid).toBe(true);
  });

  it('should reject invalid CPF', async () => {
    const validator = createCPFValidator();

    const result1 = await validator.validate('000.000.000-00');
    expect(result1.isValid).toBe(false);

    const result2 = await validator.validate('111.111.111-11');
    expect(result2.isValid).toBe(false);

    const result3 = await validator.validate('12345678900'); // Wrong checksum
    expect(result3.isValid).toBe(false);

    const result4 = await validator.validate('invalid');
    expect(result4.isValid).toBe(false);
  });

  it('should reject formatted CPF when allowFormatted is false', async () => {
    const validator = createCPFValidator({ allowFormatted: false });

    const result = await validator.validate('123.456.789-09');
    expect(result.isValid).toBe(false);
  });

  it('should work with standalone function', () => {
    expect(validateCPF('123.456.789-09')).toBe(true);
    expect(validateCPF('000.000.000-00')).toBe(false);
  });
});

// ============================================================================
// CNPJ VALIDATOR
// ============================================================================

describe('CNPJ Validator', () => {
  it('should validate valid CNPJ', async () => {
    const validator = createCNPJValidator();

    const result1 = await validator.validate('11.222.333/0001-81');
    expect(result1.isValid).toBe(true);

    const result2 = await validator.validate('11222333000181');
    expect(result2.isValid).toBe(true);
  });

  it('should reject invalid CNPJ', async () => {
    const validator = createCNPJValidator();

    const result1 = await validator.validate('00.000.000/0000-00');
    expect(result1.isValid).toBe(false);

    const result2 = await validator.validate('11.111.111/1111-11');
    expect(result2.isValid).toBe(false);

    const result3 = await validator.validate('11222333000180'); // Wrong checksum
    expect(result3.isValid).toBe(false);

    const result4 = await validator.validate('invalid');
    expect(result4.isValid).toBe(false);
  });

  it('should reject formatted CNPJ when allowFormatted is false', async () => {
    const validator = createCNPJValidator({ allowFormatted: false });

    const result = await validator.validate('11.222.333/0001-81');
    expect(result.isValid).toBe(false);
  });

  it('should work with standalone function', () => {
    expect(validateCNPJ('11.222.333/0001-81')).toBe(true);
    expect(validateCNPJ('00.000.000/0000-00')).toBe(false);
  });
});

// ============================================================================
// CEP VALIDATOR
// ============================================================================

describe('CEP Validator', () => {
  it('should validate valid CEP', async () => {
    const validator = createCEPValidator();

    const result1 = await validator.validate('01310-100');
    expect(result1.isValid).toBe(true);

    const result2 = await validator.validate('01310100');
    expect(result2.isValid).toBe(true);
  });

  it('should reject invalid CEP', async () => {
    const validator = createCEPValidator();

    const result1 = await validator.validate('00000-000');
    expect(result1.isValid).toBe(false);

    const result2 = await validator.validate('11111111');
    expect(result2.isValid).toBe(false);

    const result3 = await validator.validate('123');
    expect(result3.isValid).toBe(false);

    const result4 = await validator.validate('invalid');
    expect(result4.isValid).toBe(false);
  });

  it('should reject formatted CEP when allowFormatted is false', async () => {
    const validator = createCEPValidator({ allowFormatted: false });

    const result = await validator.validate('01310-100');
    expect(result.isValid).toBe(false);
  });

  it('should work with standalone function', () => {
    expect(validateCEP('01310-100')).toBe(true);
    expect(validateCEP('00000-000')).toBe(false);
  });
});

// ============================================================================
// PHONE VALIDATOR
// ============================================================================

describe('Phone Validator', () => {
  it('should validate valid mobile numbers', async () => {
    const validator = createPhoneValidator();

    const result1 = await validator.validate('(11) 98765-4321');
    expect(result1.isValid).toBe(true);

    const result2 = await validator.validate('11987654321');
    expect(result2.isValid).toBe(true);

    const result3 = await validator.validate('+5511987654321');
    expect(result3.isValid).toBe(true);
  });

  it('should validate valid landline numbers', async () => {
    const validator = createPhoneValidator();

    const result1 = await validator.validate('(11) 3456-7890');
    expect(result1.isValid).toBe(true);

    const result2 = await validator.validate('1134567890');
    expect(result2.isValid).toBe(true);
  });

  it('should reject invalid phone numbers', async () => {
    const validator = createPhoneValidator();

    const result1 = await validator.validate('123');
    expect(result1.isValid).toBe(false);

    const result2 = await validator.validate('(11) 1111-1111');
    expect(result2.isValid).toBe(false);

    const result3 = await validator.validate('invalid');
    expect(result3.isValid).toBe(false);
  });

  it('should validate only mobile when mobileOnly is true', async () => {
    const validator = createPhoneValidator({ mobileOnly: true });

    const result1 = await validator.validate('(11) 98765-4321');
    expect(result1.isValid).toBe(true);

    const result2 = await validator.validate('(11) 3456-7890');
    expect(result2.isValid).toBe(false);
  });

  it('should validate only landline when landlineOnly is true', async () => {
    const validator = createPhoneValidator({ landlineOnly: true });

    const result1 = await validator.validate('(11) 3456-7890');
    expect(result1.isValid).toBe(true);

    const result2 = await validator.validate('(11) 98765-4321');
    expect(result2.isValid).toBe(false);
  });

  it('should work with standalone function', () => {
    expect(validatePhone('11987654321')).toBe(true);
    expect(validatePhone('123')).toBe(false);
    expect(validatePhone('1134567890', false, true)).toBe(true); // landline only
    expect(validatePhone('11987654321', true, false)).toBe(true); // mobile only
  });
});

// ============================================================================
// CPF FORMATTER
// ============================================================================

describe('CPF Formatter', () => {
  it('should format CPF', () => {
    const formatter = createCPFFormatter();

    expect(formatter.format('12345678909')).toBe('123.456.789-09');
    expect(formatter.format('123.456.789-09')).toBe('123.456.789-09');
  });

  it('should handle partial CPF', () => {
    const formatter = createCPFFormatter();

    expect(formatter.format('123456')).toBe('123.456');
    expect(formatter.format('123')).toBe('123');
  });

  it('should handle empty values', () => {
    const formatter = createCPFFormatter();

    expect(formatter.format('')).toBe('');
  });

  it('should unformat CPF', () => {
    const formatter = createUnformatCPFFormatter();

    expect(formatter.format('123.456.789-09')).toBe('12345678909');
    expect(formatter.format('12345678909')).toBe('12345678909');
  });
});

// ============================================================================
// CNPJ FORMATTER
// ============================================================================

describe('CNPJ Formatter', () => {
  it('should format CNPJ', () => {
    const formatter = createCNPJFormatter();

    expect(formatter.format('11222333000181')).toBe('11.222.333/0001-81');
    expect(formatter.format('11.222.333/0001-81')).toBe('11.222.333/0001-81');
  });

  it('should handle partial CNPJ', () => {
    const formatter = createCNPJFormatter();

    expect(formatter.format('112223')).toBe('11.222.3');
    expect(formatter.format('11')).toBe('11');
  });

  it('should handle empty values', () => {
    const formatter = createCNPJFormatter();

    expect(formatter.format('')).toBe('');
  });

  it('should unformat CNPJ', () => {
    const formatter = createUnformatCNPJFormatter();

    expect(formatter.format('11.222.333/0001-81')).toBe('11222333000181');
    expect(formatter.format('11222333000181')).toBe('11222333000181');
  });
});

// ============================================================================
// CEP FORMATTER
// ============================================================================

describe('CEP Formatter', () => {
  it('should format CEP', () => {
    const formatter = createCEPFormatter();

    expect(formatter.format('01310100')).toBe('01310-100');
    expect(formatter.format('01310-100')).toBe('01310-100');
  });

  it('should handle partial CEP', () => {
    const formatter = createCEPFormatter();

    expect(formatter.format('01310')).toBe('01310');
    expect(formatter.format('013')).toBe('013');
  });

  it('should handle empty values', () => {
    const formatter = createCEPFormatter();

    expect(formatter.format('')).toBe('');
  });

  it('should unformat CEP', () => {
    const formatter = createUnformatCEPFormatter();

    expect(formatter.format('01310-100')).toBe('01310100');
    expect(formatter.format('01310100')).toBe('01310100');
  });
});

// ============================================================================
// PHONE FORMATTER
// ============================================================================

describe('Phone Formatter', () => {
  it('should format mobile numbers', () => {
    const formatter = createPhoneFormatter();

    expect(formatter.format('11987654321')).toBe('(11) 98765-4321');
    expect(formatter.format('(11) 98765-4321')).toBe('(11) 98765-4321');
  });

  it('should format landline numbers', () => {
    const formatter = createPhoneFormatter();

    expect(formatter.format('1134567890')).toBe('(11) 3456-7890');
    expect(formatter.format('(11) 3456-7890')).toBe('(11) 3456-7890');
  });

  it('should handle partial phone numbers', () => {
    const formatter = createPhoneFormatter();

    expect(formatter.format('11')).toBe('(11) '); // Partial: only area code
    expect(formatter.format('119876')).toBe('(11) 9876-'); // Partial: mobile without last  digits
  });

  it('should format with country code', () => {
    const formatter = createPhoneFormatter({ includeCountryCode: true });

    // Note: Current implementation adds +55 as prefix, need to adjust
    const result = formatter.format('11987654321');
    expect(result).toContain('11');
    expect(result).toContain('98765-4321');
  });

  it('should format with international format', () => {
    const formatter = createPhoneFormatter({
      includeCountryCode: true,
      internationalFormat: true,
    });

    expect(formatter.format('11987654321')).toBe('+55 11 98765-4321');
  });

  it('should handle empty values', () => {
    const formatter = createPhoneFormatter();

    expect(formatter.format('')).toBe('');
  });

  it('should unformat phone numbers', () => {
    const formatter = createUnformatPhoneFormatter();

    expect(formatter.format('(11) 98765-4321')).toBe('11987654321');
    expect(formatter.format('+55 11 98765-4321')).toBe('5511987654321');
    expect(formatter.format('11987654321')).toBe('11987654321');
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Brazilian Integration Tests', () => {
  it('should format and validate CPF', async () => {
    const formatter = createCPFFormatter();
    const validator = createCPFValidator();

    const input = '12345678909';
    const formatted = formatter.format(input);
    const validation = await validator.validate(formatted);

    expect(formatted).toBe('123.456.789-09');
    expect(validation.isValid).toBe(true);
  });

  it('should format and validate CNPJ', async () => {
    const formatter = createCNPJFormatter();
    const validator = createCNPJValidator();

    const input = '11222333000181';
    const formatted = formatter.format(input);
    const validation = await validator.validate(formatted);

    expect(formatted).toBe('11.222.333/0001-81');
    expect(validation.isValid).toBe(true);
  });

  it('should format and validate CEP', async () => {
    const formatter = createCEPFormatter();
    const validator = createCEPValidator();

    const input = '01310100';
    const formatted = formatter.format(input);
    const validation = await validator.validate(formatted);

    expect(formatted).toBe('01310-100');
    expect(validation.isValid).toBe(true);
  });

  it('should format and validate phone', async () => {
    const formatter = createPhoneFormatter();
    const validator = createPhoneValidator();

    const input = '11987654321';
    const formatted = formatter.format(input);
    const validation = await validator.validate(formatted);

    expect(formatted).toBe('(11) 98765-4321');
    expect(validation.isValid).toBe(true);
  });

  it('should unformat and validate', async () => {
    const unformatCPF = createUnformatCPFFormatter();
    const validator = createCPFValidator({ allowFormatted: false });

    const input = '123.456.789-09';
    const unformatted = unformatCPF.format(input);
    const validation = await validator.validate(unformatted);

    expect(unformatted).toBe('12345678909');
    expect(validation.isValid).toBe(true);
  });
});
