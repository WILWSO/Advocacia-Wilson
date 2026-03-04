# @wsolutions/form-validation

> Pure logic validation and formatting library - Framework agnostic

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-green.svg)](package.json)

## 🎯 Features

- ✅ **Zero Dependencies** - Pure TypeScript, no external dependencies
- ✅ **Framework Agnostic** - Works in Node.js, Browser, React, Vue, Angular, etc.
- ✅ **Type Safe** - Full TypeScript support with strict typing
- ✅ **Composable** - Combine validators and formatters easily
- ✅ **Multi-domain** - Brazilian, Argentine, and universal validators
- ✅ **Extensible** - Create custom validators and formatters
- ✅ **Tested** - Comprehensive test coverage (77% pass rate)
- ✅ **Tree-shakeable** - Only import what you need

## 📦 Installation

```bash
npm install @wsolutions/form-validation
```

## 🚀 Quick Start

### Basic Validation

```typescript
import { createEmailValidator, createRequiredValidator } from '@wsolutions/form-validation';

const emailValidator = createEmailValidator();
const result = emailValidator.validate('test@example.com');

if (result.isValid) {
  console.log('Email is valid!');
} else {
  console.log('Errors:', result.errors);
}
```

### Basic Formatting

```typescript
import { createCPFFormatter } from '@wsolutions/form-validation';

const cpfFormatter = createCPFFormatter();
const formatted = cpfFormatter.format('12345678900');
// Result: "123.456.789-00"

const cleaned = cpfFormatter.clean('123.456.789-00');
// Result: "12345678900"
```

### Composing Validators

```typescript
import { composeValidators, createRequiredValidator, createEmailValidator } from '@wsolutions/form-validation';

const validator = composeValidators([
  createRequiredValidator({ fieldName: 'Email' }),
  createEmailValidator({ maxLength: 254 })
]);

const result = validator.validate('test@example.com');
```

### Composing Formatters

```typescript
import { composeFormatters } from '@wsolutions/form-validation';

const formatter = composeFormatters([
  { format: (v) => v.trim(), clean: (v) => v },
  { format: (v) => v.toLowerCase(), clean: (v) => v }
]);

const result = formatter.format('  HELLO  ');
// Result: "hello"
```

## 📚 Core Validators

### Generic Validators

| Validator | Description | Example |
|-----------|-------------|---------|
| `createRequiredValidator` | Required field validation | `createRequiredValidator({ fieldName: 'Email' })` |
| `createEmailValidator` | Email format (RFC 5322) | `createEmailValidator({ requireTld: true })` |
| `createLengthValidator` | Min/max length validation | `createLengthValidator({ min: 3, max: 50 })` |
| `createRegexValidator` | Custom regex validation | `createRegexValidator({ pattern: /^\d+$/, message: 'Only numbers' })` |
| `createUrlValidator` | URL format validation | `createUrlValidator({ requireProtocol: true })` |

### Brazilian Validators

| Validator | Description | Format | Algorithm |
|-----------|-------------|--------|-----------|
| `createCPFValidator` | CPF validation | 000.000.000-00 | Official check digit |
| `createCNPJValidator` | CNPJ validation | 00.000.000/0000-00 | Official check digit |
| `createCEPValidator` | Postal code | 00000-000 | Format only |
| `createPhoneBRValidator` | Phone numbers | (00) 00000-0000 | DDD + 8/9 digits |

### Argentine Validators

| Validator | Description | Format | Algorithm |
|-----------|-------------|--------|-----------|
| `createDNIValidator` | DNI validation | 00.000.000 | Format only |
| `createCUILValidator` | CUIL validation | 00-00000000-0 | Check digit |
| `createCUITValidator` | CUIT validation | 00-00000000-0 | Check digit |

### Universal Validators

| Validator | Description | Features |
|-----------|-------------|----------|
| `createPhoneValidator` | Universal phone | Multi-country support |

## 🎨 Core Formatters

### Generic Formatters

```typescript
// Text transformers
import { 
  uppercaseFormatter,
  lowercaseFormatter,
  capitalizeFormatter,
  trimFormatter
} from '@wsolutions/form-validation';

uppercaseFormatter.format('hello');     // "HELLO"
lowercaseFormatter.format('HELLO');     // "hello"
capitalizeFormatter.format('hello');    // "Hello"
trimFormatter.format('  hello  ');      // "hello"
```

### Brazilian Formatters

```typescript
import { 
  createCPFFormatter,
  createCNPJFormatter,
  createCEPFormatter,
  createPhoneBRFormatter
} from '@wsolutions/form-validation';

const cpfFormatter = createCPFFormatter();
cpfFormatter.format('12345678900');           // "123.456.789-00"
cpfFormatter.clean('123.456.789-00');         // "12345678900"

const cnpjFormatter = createCNPJFormatter();
cnpjFormatter.format('12345678000100');       // "12.345.678/0001-00"

const cepFormatter = createCEPFormatter();
cepFormatter.format('12345678');              // "12345-678"

const phoneFormatter = createPhoneBRFormatter();
phoneFormatter.format('11987654321');         // "(11) 98765-4321"
phoneFormatter.format('1134567890');          // "(11) 3456-7890"
```

### Argentine Formatters

```typescript
import { 
  createDNIFormatter,
  createCUILFormatter,
  createCUITFormatter
} from '@wsolutions/form-validation';

const dniFormatter = createDNIFormatter();
dniFormatter.format('12345678');              // "12.345.678"

const cuilFormatter = createCUILFormatter();
cuilFormatter.format('20123456789');          // "20-12345678-9"

const cuitFormatter = createCUITFormatter();
cuitFormatter.format('30123456789');          // "30-12345678-9"
```

## 🎯 Advanced Usage

### Custom Validators

```typescript
import { Validator, ValidationResult } from '@wsolutions/form-validation';

const createEvenNumberValidator = (): Validator<number> => ({
  name: 'evenNumber',
  validate: (value: number): ValidationResult => {
    const isValid = value % 2 === 0;
    return {
      isValid,
      errors: isValid ? [] : ['Number must be even']
    };
  }
});
```

### Async Validators

```typescript
import { Validator, ValidationResult } from '@wsolutions/form-validation';

const createUniqueEmailValidator = (checkFn: (email: string) => Promise<boolean>): Validator<string> => ({
  name: 'uniqueEmail',
  validate: async (value: string): Promise<ValidationResult> => {
    const isUnique = await checkFn(value);
    return {
      isValid: isUnique,
      errors: isUnique ? [] : ['Email already exists']
    };
  }
});
```

### Conditional Validation

```typescript
import { composeValidators, createRequiredValidator, createPhoneBRValidator } from '@wsolutions/form-validation';

const createConditionalPhoneValidator = (isMobile: boolean) => {
  return createPhoneBRValidator({
    allowFormatted: true,
    ...(isMobile ? { mobileOnly: true } : { landlineOnly: true })
  });
};
```

### Custom Formatters

```typescript
import { Formatter } from '@wsolutions/form-validation';

const createCreditCardFormatter = (): Formatter => ({
  name: 'creditCard',
  format: (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g) || [];
    return groups.join(' ');
  },
  clean: (value: string): string => {
    return value.replace(/\D/g, '');
  }
});
```

## 📖 API Reference

### Validator Interface

```typescript
interface Validator<T = any> {
  name: string;
  validate: (value: T, context?: any) => ValidationResult | Promise<ValidationResult>;
  message?: string | ((value: T) => string);
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}
```

### Formatter Interface

```typescript
interface Formatter<T = string, R = string> {
  name: string;
  format: (value: T, options?: any) => R;
  clean?: (value: R) => T;
}
```

### Composer Functions

```typescript
// Compose multiple validators (all must pass)
function composeValidators<T = any>(
  validators: Validator<T>[]
): Validator<T>;

// Compose multiple formatters (applied sequentially)
function composeFormatters<T = string>(
  formatters: Formatter<T>[]
): Formatter<T>;
```

### Validator Options

#### Required Validator
```typescript
interface RequiredValidatorOptions {
  fieldName?: string;
  message?: string;
  allowWhitespace?: boolean;
}
```

#### Email Validator
```typescript
interface EmailValidatorOptions {
  message?: string;
  allowDisposable?: boolean;
  requireTld?: boolean;
  maxLength?: number;
}
```

#### Length Validator
```typescript
interface LengthValidatorOptions {
  min?: number;
  max?: number;
  exact?: number;
  message?: string | {
    min?: string;
    max?: string;
    exact?: string;
  };
}
```

#### Phone BR Validator
```typescript
interface PhoneBRValidatorOptions {
  message?: string;
  allowFormatted?: boolean;
  mobileOnly?: boolean;
  landlineOnly?: boolean;
}
```

### Formatter Options

#### CPF/CNPJ Formatter
```typescript
interface BrazilianDocumentFormatterOptions {
  includeFormatting?: boolean;  // default: true
}
```

#### Phone BR Formatter
```typescript
interface PhoneBRFormatterOptions {
  includeCountryCode?: boolean;  // default: false
}
```

## 🧪 Testing

Run tests:

```bash
npm test                 # Run all tests (86 total, 66 passing)
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

Example test:

```typescript
import { describe, test, expect } from 'vitest';
import { createCPFValidator } from '@wsolutions/form-validation';

describe('CPF Validator', () => {
  test('validates valid CPF', () => {
    const validator = createCPFValidator();
    const result = validator.validate('123.456.789-09');
    
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
```

## 🤝 Integration Examples

### With React

```tsx
import { useState } from 'react';
import { createCPFValidator, createCPFFormatter } from '@wsolutions/form-validation';

function CPFInput() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const validator = createCPFValidator();
  const formatter = createCPFFormatter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatter.format(e.target.value);
    setValue(formatted);
  };

  const handleBlur = () => {
    const result = validator.validate(value);
    setError(result.isValid ? '' : result.errors[0]);
  };

  return (
    <div>
      <input value={value} onChange={handleChange} onBlur={handleBlur} />
      {error && <span>{error}</span>}
    </div>
  );
}
```

### With Node.js

```typescript
import { createCPFValidator } from '@wsolutions/form-validation';

const validator = createCPFValidator();

async function validateUser(cpf: string) {
  const result = validator.validate(cpf);
  
  if (!result.isValid) {
    throw new Error(result.errors.join(', '));
  }
  
  return true;
}
```

## 📝 License

MIT © [WSolutions](https://github.com/WILWSO/Advocacia-Wilson)

## 🔗 Related Packages

- [@wsolutions/form-components](../form-components) - React components with integrated validation and formatting
