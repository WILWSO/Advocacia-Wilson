/**
 * Tests for Argentine validators, formatters + Universal phone
 */

import { describe, it, expect } from 'vitest';

// Argentine Validators
import {
  createDNIValidator,
  validateDNI,
  createCUILValidator,
  createCUITValidator,
  validateCUIL,
  validateCUIT,
} from '../src/validators/argentina';

// Argentine Formatters
import {
  createDNIFormatter,
  createUnformatDNIFormatter,
  createCUILFormatter,
  createCUITFormatter,
  createUnformatCUILFormatter,
} from '../src/formatters/argentina';

// Universal Phone
import {
  createUniversalPhoneValidator,
  validateUniversalPhone,
  COUNTRY_PHONE_CONFIGS,
} from '../src/validators/phone.validator';

import {
  createUniversalPhoneFormatter,
  createUnformatPhoneFormatter,
  COUNTRY_PHONE_FORMATTERS,
} from '../src/formatters/phone.formatter';

// ============================================================================
// DNI VALIDATOR
// ============================================================================

describe('DNI Validator', () => {
  it('should validate valid DNI', async () => {
    const validator = createDNIValidator();

    const result1 = await validator.validate('12.345.678');
    expect(result1.isValid).toBe(true);

    const result2 = await validator.validate('12345678');
    expect(result2.isValid).toBe(true);

    const result3 = await validator.validate('1234567'); // 7 digits
    expect(result3.isValid).toBe(true);
  });

  it('should reject invalid DNI', async () => {
    const validator = createDNIValidator();

    const result1 = await validator.validate('00000000');
    expect(result1.isValid).toBe(false);

    const result2 = await validator.validate('11111111');
    expect(result2.isValid).toBe(false);

    const result3 = await validator.validate('123'); // Too short
    expect(result3.isValid).toBe(false);

    const result4 = await validator.validate('invalid');
    expect(result4.isValid).toBe(false);
  });

  it('should reject formatted DNI when allowFormatted is false', async () => {
    const validator = createDNIValidator({ allowFormatted: false });

    const result = await validator.validate('12.345.678');
    expect(result.isValid).toBe(false);
  });

  it('should work with standalone function', () => {
    expect(validateDNI('12345678')).toBe(true);
    expect(validateDNI('00000000')).toBe(false);
  });
});

// ============================================================================
// CUIL/CUIT VALIDATOR
// ============================================================================

describe('CUIL/CUIT Validator', () => {
  it('should validate valid CUIL', async () => {
    const validator = createCUILValidator();

    // Valid CUIL example: 20-12345678-9 (need to calculate valid check digit)
    // Let's use a known valid CUIL for testing
    const result1 = await validator.validate('20-30000005-4'); // Known valid
    expect(result1.isValid).toBe(true);

    const result2 = await validator.validate('20300000054');
    expect(result2.isValid).toBe(true);
  });

  it('should reject invalid CUIL', async () => {
    const validator = createCUILValidator();

    const result1 = await validator.validate('00-00000000-0');
    expect(result1.isValid).toBe(false);

    const result2 = await validator.validate('11-11111111-1'); // Invalid prefix
    expect(result2.isValid).toBe(false);

    const result3 = await validator.validate('20-12345678-0'); // Wrong check digit
    expect(result3.isValid).toBe(false);

    const result4 = await validator.validate('invalid');
    expect(result4.isValid).toBe(false);
  });

  it('should validate CUIT', async () => {
    const validator = createCUITValidator();

    const result1 = await validator.validate('20-30000005-4');
    expect(result1.isValid).toBe(true);
  });

  it('should reject formatted CUIL when allowFormatted is false', async () => {
    const validator = createCUILValidator({ allowFormatted: false });

    const result = await validator.validate('20-30000005-4');
    expect(result.isValid).toBe(false);
  });

  it('should work with standalone functions', () => {
    expect(validateCUIL('20-30000005-4')).toBe(true);
    expect(validateCUIT('20-30000005-4')).toBe(true);
    expect(validateCUIL('00-00000000-0')).toBe(false);
  });
});

// ============================================================================
// DNI FORMATTER
// ============================================================================

describe('DNI Formatter', () => {
  it('should format DNI with 8 digits', () => {
    const formatter = createDNIFormatter();

    expect(formatter.format('12345678')).toBe('12.345.678');
    expect(formatter.format('12.345.678')).toBe('12.345.678');
  });

  it('should format DNI with 7 digits', () => {
    const formatter = createDNIFormatter();

    expect(formatter.format('1234567')).toBe('1.234.567');
  });

  it('should handle partial DNI', () => {
    const formatter = createDNIFormatter();

    expect(formatter.format('12345')).toBe('12.345');
    expect(formatter.format('123')).toBe('123');
  });

  it('should handle empty values', () => {
    const formatter = createDNIFormatter();

    expect(formatter.format('')).toBe('');
  });

  it('should unformat DNI', () => {
    const formatter = createUnformatDNIFormatter();

    expect(formatter.format('12.345.678')).toBe('12345678');
    expect(formatter.format('12345678')).toBe('12345678');
  });
});

// ============================================================================
// CUIL/CUIT FORMATTER
// ============================================================================

describe('CUIL/CUIT Formatter', () => {
  it('should format CUIL', () => {
    const formatter = createCUILFormatter();

    expect(formatter.format('20300000054')).toBe('20-30000005-4');
    expect(formatter.format('20-30000005-4')).toBe('20-30000005-4');
  });

  it('should format CUIT', () => {
    const formatter = createCUITFormatter();

    expect(formatter.format('20300000054')).toBe('20-30000005-4');
  });

  it('should handle partial CUIL', () => {
    const formatter = createCUILFormatter();

    expect(formatter.format('203000')).toBe('20-3000');
    expect(formatter.format('20')).toBe('20');
  });

  it('should handle empty values', () => {
    const formatter = createCUILFormatter();

    expect(formatter.format('')).toBe('');
  });

  it('should unformat CUIL', () => {
    const formatter = createUnformatCUILFormatter();

    expect(formatter.format('20-30000005-4')).toBe('20300000054');
    expect(formatter.format('20300000054')).toBe('20300000054');
  });
});

// ============================================================================
// UNIVERSAL PHONE VALIDATOR
// ============================================================================

describe('Universal Phone Validator', () => {
  describe('Brazil (+55)', () => {
    it('should validate Brazilian mobile', async () => {
      const validator = createUniversalPhoneValidator({ countryCode: '55' });

      const result1 = await validator.validate('(11) 98765-4321');
      expect(result1.isValid).toBe(true);

      const result2 = await validator.validate('11987654321');
      expect(result2.isValid).toBe(true);

      const result3 = await validator.validate('+5511987654321');
      expect(result3.isValid).toBe(true);
    });

    it('should validate Brazilian landline', async () => {
      const validator = createUniversalPhoneValidator({ countryCode: '55' });

      const result1 = await validator.validate('(11) 3456-7890');
      expect(result1.isValid).toBe(true);

      const result2 = await validator.validate('1134567890');
      expect(result2.isValid).toBe(true);
    });
  });

  describe('Argentina (+54)', () => {
    it('should validate Argentine mobile', async () => {
      const validator = createUniversalPhoneValidator({ countryCode: '54' });

      const result1 = await validator.validate('91112345678'); // 9 11 1234-5678
      expect(result1.isValid).toBe(true);

      const result2 = await validator.validate('+5491112345678');
      expect(result2.isValid).toBe(true);
    });

    it('should validate Argentine landline', async () => {
      const validator = createUniversalPhoneValidator({ countryCode: '54' });

      const result1 = await validator.validate('1112345678'); // 11 1234-5678
      expect(result1.isValid).toBe(true);
    });
  });

  describe('Auto-detect country', () => {
    it('should auto-detect country code', async () => {
      const validator = createUniversalPhoneValidator();

      const result1 = await validator.validate('+5511987654321'); // Brazil
      expect(result1.isValid).toBe(true);

      const result2 = await validator.validate('+5491112345678'); // Argentina
      expect(result2.isValid).toBe(true);

      const result3 = await validator.validate('+12125551234'); // USA
      expect(result3.isValid).toBe(true);
    });
  });

  describe('Require country code', () => {
    it('should require country code when specified', async () => {
      const validator = createUniversalPhoneValidator({ requireCountryCode: true });

      const result1 = await validator.validate('+5511987654321');
      expect(result1.isValid).toBe(true);

      const result2 = await validator.validate('11987654321'); // Missing country code
      expect(result2.isValid).toBe(false);
    });
  });

  it('should work with standalone function', () => {
    expect(validateUniversalPhone('+5511987654321')).toBe(true);
    expect(validateUniversalPhone('11987654321', { countryCode: '55' })).toBe(true);
    expect(validateUniversalPhone('+5491112345678')).toBe(true);
    expect(validateUniversalPhone('invalid')).toBe(false);
  });

  it('should have country configs defined', () => {
    expect(COUNTRY_PHONE_CONFIGS['55']).toBeDefined();
    expect(COUNTRY_PHONE_CONFIGS['54']).toBeDefined();
    expect(COUNTRY_PHONE_CONFIGS['1']).toBeDefined();
  });
});

// ============================================================================
// UNIVERSAL PHONE FORMATTER
// ============================================================================

describe('Universal Phone Formatter', () => {
  describe('Brazil (+55)', () => {
    it('should format Brazilian mobile', () => {
      const formatter = createUniversalPhoneFormatter({ countryCode: '55' });

      expect(formatter.format('11987654321')).toBe('(11) 98765-4321');
    });

    it('should format with country code', () => {
      const formatter = createUniversalPhoneFormatter({
        countryCode: '55',
        includeCountryCode: true,
      });

      const result = formatter.format('11987654321');
      expect(result).toContain('11');
      expect(result).toContain('98765-4321');
    });

    it('should format international', () => {
      const formatter = createUniversalPhoneFormatter({
        countryCode: '55',
        includeCountryCode: true,
        internationalFormat: true,
      });

      expect(formatter.format('11987654321')).toBe('+55 11 98765-4321');
    });
  });

  describe('Argentina (+54)', () => {
    it('should format Argentine mobile', () => {
      const formatter = createUniversalPhoneFormatter({ countryCode: '54' });

      const result = formatter.format('91112345678');
      expect(result).toContain('11');
      expect(result).toContain('1234');
    });

    it('should format with country code', () => {
      const formatter = createUniversalPhoneFormatter({
        countryCode: '54',
        includeCountryCode: true,
        internationalFormat: true,
      });

      const result = formatter.format('91112345678');
      expect(result).toContain('+54');
      expect(result).toContain('11');
    });
  });

  describe('Auto-detect', () => {
    it('should auto-detect and format', () => {
      const formatter = createUniversalPhoneFormatter({ includeCountryCode: true });

      const result1 = formatter.format('5511987654321');
      expect(result1).toContain('55');
      expect(result1).toContain('11');

      const result2 = formatter.format('5491112345678');
      expect(result2).toContain('54');
    });
  });

  it('should unformat phone', () => {
    const formatter = createUnformatPhoneFormatter();

    expect(formatter.format('(11) 98765-4321')).toBe('11987654321');
    expect(formatter.format('+55 11 98765-4321')).toBe('5511987654321');
    expect(formatter.format('+54 9 11 1234-5678')).toBe('5491112345678');
  });

  it('should have country formatters defined', () => {
    expect(COUNTRY_PHONE_FORMATTERS['55']).toBeDefined();
    expect(COUNTRY_PHONE_FORMATTERS['54']).toBeDefined();
    expect(COUNTRY_PHONE_FORMATTERS['1']).toBeDefined();
  });
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

describe('Argentine + Universal Phone Integration', () => {
  it('should format and validate DNI', async () => {
    const formatter = createDNIFormatter();
    const validator = createDNIValidator();

    const input = '12345678';
    const formatted = formatter.format(input);
    const validation = await validator.validate(formatted);

    expect(formatted).toBe('12.345.678');
    expect(validation.isValid).toBe(true);
  });

  it('should format and validate CUIL', async () => {
    const formatter = createCUILFormatter();
    const validator = createCUILValidator();

    const input = '20300000054';
    const formatted = formatter.format(input);
    const validation = await validator.validate(formatted);

    expect(formatted).toBe('20-30000005-4');
    expect(validation.isValid).toBe(true);
  });

  it('should format and validate universal phone (Brazil)', async () => {
    const formatter = createUniversalPhoneFormatter({
      countryCode: '55',
      includeCountryCode: true,
      internationalFormat: true,
    });
    const validator = createUniversalPhoneValidator({ countryCode: '55' });

    const input = '11987654321';
    const formatted = formatter.format(input);
    const validation = await validator.validate(formatted);

    expect(formatted).toBe('+55 11 98765-4321');
    expect(validation.isValid).toBe(true);
  });

  it('should format and validate universal phone (Argentina)', async () => {
    const formatter = createUniversalPhoneFormatter({
      countryCode: '54',
    });
    const validator = createUniversalPhoneValidator({ countryCode: '54' });

    const input = '91112345678';
    const formatted = formatter.format(input);
    const validation = await validator.validate(formatted);

    expect(validation.isValid).toBe(true);
  });

  it('should handle cross-country scenarios', async () => {
    const formatterAuto = createUniversalPhoneFormatter({ includeCountryCode: true });
    const validatorAuto = createUniversalPhoneValidator();

    // Brazil
    const br = formatterAuto.format('5511987654321');
    const brValid = await validatorAuto.validate(br);
    expect(brValid.isValid).toBe(true);

    // Argentina
    const ar = formatterAuto.format('5491112345678');
    const arValid = await validatorAuto.validate(ar);
    expect(arValid.isValid).toBe(true);
  });
});
