# @wsolutions/form-validation

> Pure logic validation and formatting library - Framework agnostic

## 🎯 Features

- ✅ **Zero Dependencies**: Pure TypeScript, no external dependencies
- ✅ **Framework Agnostic**: Works in Node.js, Browser, React, Vue, Angular, etc.
- ✅ **Type Safe**: Full TypeScript support with strict typing
- ✅ **Composable**: Combine validators and formatters easily
- ✅ **Extensible**: Create custom validators and formatters
- ✅ **Tested**: Comprehensive test coverage
- ✅ **Tree-shakeable**: Only import what you need

## 📦 Installation

```bash
npm install @wsolutions/form-validation
# or
yarn add @wsolutions/form-validation
# or
pnpm add @wsolutions/form-validation
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
import { cpfFormatter, uppercaseFormatter } from '@wsolutions/form-validation';

const formatted = cpfFormatter.format('12345678900');
// Result: "123.456.789-00"

const upper = uppercaseFormatter.format('hello world');
// Result: "HELLO WORLD"
```

### Composing Validators

```typescript
import { composeValidators, createRequiredValidator, createEmailValidator } from '@wsolutions/form-validation';

const validator = composeValidators([
  createRequiredValidator('Email'),
  createEmailValidator({ maxLength: 254 })
]);

const result = await validator.validate('test@example.com');
```

### Composing Formatters

```typescript
import { composeFormatters, trimFormatter, lowercaseFormatter } from '@wsolutions/form-validation';

const formatter = composeFormatters([
  trimFormatter,
  lowercaseFormatter
]);

const result = formatter.format('  HELLO  ');
// Result: "hello"
```

## 📚 Core Validators

### Generic Validators

- `createRequiredValidator(fieldName, options)` - Required field validation
- `createEmailValidator(options)` - Email format validation
- `createLengthValidator(options)` - Min/max length validation
- `createRegexValidator(pattern, message)` - Custom regex validation
- `createUrlValidator(options)` - URL format validation
- `createNumberValidator(options)` - Number range validation
- `createDateValidator(options)` - Date validation

### Brazilian Validators

- `createCPFValidator(options)` - CPF validation with official algorithm
- `createCNPJValidator(options)` - CNPJ validation with official algorithm
- `createCEPValidator(options)` - CEP validation
- `createPhoneBRValidator(options)` - Brazilian phone validation
- `createRGValidator(options)` - RG validation

## 🎨 Core Formatters

### Generic Formatters

- `uppercaseFormatter` - Convert to uppercase
- `lowercaseFormatter` - Convert to lowercase
- `capitalizeFormatter` - Capitalize words
- `trimFormatter` - Remove surrounding whitespace
- `maskFormatter` - Apply custom masks

### Brazilian Formatters

- `cpfFormatter` - Format CPF (000.000.000-00)
- `cnpjFormatter` - Format CNPJ (00.000.000/0000-00)
- `cepFormatter` - Format CEP (00000-000)
- `phoneBRFormatter` - Format Brazilian phone ((00) 90000-0000)

## 🔧 API Reference

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
interface Formatter<T = any, R = string> {
  name: string;
  format: (value: T, options?: any) => R;
}
```

## 🧪 Testing

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## 📖 Documentation

Full documentation available at: [https://wsolutions.dev/docs/form-validation](https://wsolutions.dev/docs/form-validation)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

MIT © Wilton

## 🔗 Related Packages

- [`@wsolutions/form-components`](../form-components) - React components with integrated validation and formatting
