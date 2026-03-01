/**
 * Core validators test
 * Tests for implemented validators
 */

import { describe, it, expect } from 'vitest';
import { VERSION } from '../src/index';
import {
  createRequiredValidator,
  createEmailValidator,
  createLengthValidator,
  createNumberValidator,
  createUrlValidator,
  createRegexValidator,
  createDateValidator,
} from '../src/validators/core';

describe('Package Configuration', () => {
  it('should export VERSION constant', () => {
    expect(VERSION).toBeDefined();
    expect(typeof VERSION).toBe('string');
    expect(VERSION).toBe('0.1.0');
  });
});

describe('Required Validator', () => {
  const validator = createRequiredValidator();

  it('should pass for non-empty strings', () => {
    const result = validator.validate('hello');
    expect(result.isValid).toBe(true);
  });

  it('should fail for empty strings', () => {
    const result = validator.validate('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should fail for null', () => {
    const result = validator.validate(null);
    expect(result.isValid).toBe(false);
  });

  it('should pass for null when allowNull is true', () => {
    const validator2 = createRequiredValidator({ allowNull: true });
    const result = validator2.validate(null);
    expect(result.isValid).toBe(true);
  });

  it('should fail for whitespace-only strings', () => {
    const result = validator.validate('   ');
    expect(result.isValid).toBe(false);
  });

  it('should pass for number 0', () => {
    const result = validator.validate(0);
    expect(result.isValid).toBe(true);
  });

  it('should pass for boolean false', () => {
    const result = validator.validate(false);
    expect(result.isValid).toBe(true);
  });
});

describe('Email Validator', () => {
  const validator = createEmailValidator();

  it('should pass for valid emails', () => {
    expect(validator.validate('user@example.com').isValid).toBe(true);
    expect(validator.validate('john.doe@company.org').isValid).toBe(true);
    expect(validator.validate('test+tag@domain.co.uk').isValid).toBe(true);
  });

  it('should fail for invalid emails', () => {
    expect(validator.validate('invalid').isValid).toBe(false);
    expect(validator.validate('@example.com').isValid).toBe(false);
    expect(validator.validate('user@').isValid).toBe(false);
    expect(validator.validate('user @example.com').isValid).toBe(false);
  });

  it('should trim whitespace by default', () => {
    const result = validator.validate('  user@example.com  ');
    expect(result.isValid).toBe(true);
  });

  it('should enforce domain restrictions', () => {
    const validator2 = createEmailValidator({ domains: ['company.com'] });
    expect(validator2.validate('user@company.com').isValid).toBe(true);
    expect(validator2.validate('user@other.com').isValid).toBe(false);
  });
});

describe('Length Validator', () => {
  it('should validate minimum length', () => {
    const validator = createLengthValidator({ min: 3 });
    expect(validator.validate('abc').isValid).toBe(true);
    expect(validator.validate('ab').isValid).toBe(false);
  });

  it('should validate maximum length', () => {
    const validator = createLengthValidator({ max: 5 });
    expect(validator.validate('hello').isValid).toBe(true);
    expect(validator.validate('toolong').isValid).toBe(false);
  });

  it('should validate exact length', () => {
    const validator = createLengthValidator({ exact: 4 });
    expect(validator.validate('test').isValid).toBe(true);
    expect(validator.validate('tests').isValid).toBe(false);
  });

  it('should validate length range', () => {
    const validator = createLengthValidator({ min: 3, max: 10 });
    expect(validator.validate('hello').isValid).toBe(true);
    expect(validator.validate('ab').isValid).toBe(false);
    expect(validator.validate('verylongstring').isValid).toBe(false);
  });

  it('should work with arrays', () => {
    const validator = createLengthValidator({ min: 2, max: 4 });
    expect(validator.validate([1, 2, 3]).isValid).toBe(true);
    expect(validator.validate([1]).isValid).toBe(false);
  });
});

describe('Number Validator', () => {
  const validator = createNumberValidator();

  it('should pass for valid numbers', () => {
    expect(validator.validate(42).isValid).toBe(true);
    expect(validator.validate(0).isValid).toBe(true);
    expect(validator.validate(-15).isValid).toBe(true);
    expect(validator.validate(3.14).isValid).toBe(true);
  });

  it('should pass for numeric strings', () => {
    expect(validator.validate('42').isValid).toBe(true);
    expect(validator.validate('3.14').isValid).toBe(true);
  });

  it('should fail for non-numeric values', () => {
    expect(validator.validate('abc').isValid).toBe(false);
    expect(validator.validate('12abc').isValid).toBe(false);
  });

  it('should validate min/max', () => {
    const validator2 = createNumberValidator({ min: 0, max: 100 });
    expect(validator2.validate(50).isValid).toBe(true);
    expect(validator2.validate(-1).isValid).toBe(false);
    expect(validator2.validate(101).isValid).toBe(false);
  });

  it('should validate integers only', () => {
    const validator2 = createNumberValidator({ integer: true });
    expect(validator2.validate(42).isValid).toBe(true);
    expect(validator2.validate(42.5).isValid).toBe(false);
  });

  it('should validate positive numbers', () => {
    const validator2 = createNumberValidator({ positive: true });
    expect(validator2.validate(10).isValid).toBe(true);
    expect(validator2.validate(-5).isValid).toBe(false);
  });
});

describe('URL Validator', () => {
  const validator = createUrlValidator();

  it('should pass for valid URLs', () => {
    expect(validator.validate('https://example.com').isValid).toBe(true);
    expect(validator.validate('http://www.example.com').isValid).toBe(true);
    // FTP is allowed by default in protocols but we'll test it separately
  });

  it('should pass for URLs without protocol', () => {
    expect(validator.validate('example.com').isValid).toBe(true);
    expect(validator.validate('www.example.com').isValid).toBe(true);
  });

  it('should fail for invalid URLs', () => {
    expect(validator.validate('not a url').isValid).toBe(false);
    expect(validator.validate('http://').isValid).toBe(false);
  });

  it('should require protocol when specified', () => {
    const validator2 = createUrlValidator({ requireProtocol: true });
    expect(validator2.validate('https://example.com').isValid).toBe(true);
    expect(validator2.validate('example.com').isValid).toBe(false);
  });

  it('should require HTTPS when specified', () => {
    const validator2 = createUrlValidator({ requireHttps: true });
    expect(validator2.validate('https://example.com').isValid).toBe(true);
    expect(validator2.validate('http://example.com').isValid).toBe(false);
  });
});

describe('Regex Validator', () => {
  it('should validate against regex pattern', () => {
    const validator = createRegexValidator({ pattern: /^\d{3}-\d{3}-\d{4}$/ });
    expect(validator.validate('123-456-7890').isValid).toBe(true);
    expect(validator.validate('1234567890').isValid).toBe(false);
  });

  it('should work with string patterns', () => {
    const validator = createRegexValidator({ pattern: '^[A-Z][a-z]+$' });
    expect(validator.validate('Hello').isValid).toBe(true);
    expect(validator.validate('hello').isValid).toBe(false);
  });

  it('should support invert mode', () => {
    const validator = createRegexValidator({ pattern: /[<>]/, invert: true });
    expect(validator.validate('safe text').isValid).toBe(true);
    expect(validator.validate('unsafe <script>').isValid).toBe(false);
  });
});

describe('Date Validator', () => {
  const validator = createDateValidator();

  it('should pass for valid dates', () => {
    expect(validator.validate(new Date()).isValid).toBe(true);
    expect(validator.validate('2024-01-15').isValid).toBe(true);
    expect(validator.validate(1704038400000).isValid).toBe(true); // timestamp
  });

  it('should fail for invalid dates', () => {
    expect(validator.validate('invalid').isValid).toBe(false);
    expect(validator.validate('2024-13-45').isValid).toBe(false);
  });

  it('should validate min/max dates', () => {
    const validator2 = createDateValidator({
      min: '2024-01-01',
      max: '2024-12-31',
    });
    expect(validator2.validate('2024-06-15').isValid).toBe(true);
    expect(validator2.validate('2023-12-31').isValid).toBe(false);
    expect(validator2.validate('2025-01-01').isValid).toBe(false);
  });

  it('should reject future dates when allowFuture is false', () => {
    const validator2 = createDateValidator({ allowFuture: false });
    expect(validator2.validate(new Date()).isValid).toBe(true);
    
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    expect(validator2.validate(futureDate).isValid).toBe(false);
  });
});

