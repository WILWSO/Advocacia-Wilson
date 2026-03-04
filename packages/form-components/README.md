# @wsolutions/form-components

> React form components with integrated validation and formatting for Brazilian and Argentine documents

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg)](https://reactjs.org/)

## 📦 Installation

```bash
npm install @wsolutions/form-components @wsolutions/form-validation
```

## ✨ Features

- 🎯 **Type-safe** - Full TypeScript support with strict types
- 🎨 **Flexible Styling** - Bring your own CSS classes
- ♿ **Accessible** - ARIA attributes and semantic HTML
- 🌍 **Multi-domain** - Brazilian, Argentine, and universal components
- 🔄 **Real-time Validation** - Instant feedback with customizable timing
- 📱 **Responsive** - Works on all screen sizes
- 🪝 **Custom Hooks** - Use validation/formatting logic independently
- 🎭 **Composition** - Build complex validations from simple ones

## 🚀 Quick Start

### Brazilian CPF Input

```tsx
import { CPFInput } from '@wsolutions/form-components';

function MyForm() {
  const [cpf, setCPF] = useState('');

  return (
    <CPFInput
      name="cpf"
      label="CPF"
      value={cpf}
      onChange={(e) => setCPF(e.target.value)}
      required
    />
  );
}
```

### Brazilian Phone Input

```tsx
import { BrazilianPhoneInput } from '@wsolutions/form-components';

function MyForm() {
  return (
    <BrazilianPhoneInput
      name="celular"
      label="Celular"
      mobileOnly  // Only accept 9-digit mobile numbers
      required
    />
  );
}
```

### Email Input

```tsx
import { EmailInput } from '@wsolutions/form-components';

function MyForm() {
  return (
    <EmailInput
      name="email"
      label="Email"
      placeholder="seu@email.com"
      required
    />
  );
}
```

## 📚 Components

### Brazilian Components

| Component | Description | Format Example |
|-----------|-------------|----------------|
| `CPFInput` | Brazilian CPF (individual taxpayer ID) | 123.456.789-00 |
| `CNPJInput` | Brazilian CNPJ (company taxpayer ID) | 12.345.678/0001-00 |
| `CEPInput` | Brazilian postal code | 12345-678 |
| `BrazilianPhoneInput` | Brazilian phone numbers | (11) 98765-4321 |

### Argentine Components

| Component | Description | Format Example |
|-----------|-------------|----------------|
| `DNIInput` | Argentine DNI (national identity) | 12.345.678 |
| `CUILInput` | Argentine CUIL (labor ID) | 20-12345678-9 |
| `CUITInput` | Argentine CUIT (taxpayer ID) | 30-12345678-9 |

### Universal Components

| Component | Description |
|-----------|-------------|
| `EmailInput` | Email with RFC 5322 validation |
| `PhoneInput` | Universal phone with country selector |

### Base Components

| Component | Description |
|-----------|-------------|
| `ValidatedInput` | Input with validation only |
| `FormattedInput` | Input with formatting only |
| `FieldGroup` | Complete field (label + input + help + error) |

## 🎨 Styling

All components accept className props for customization:

```tsx
<CPFInput
  name="cpf"
  label="CPF"
  containerClassName="my-field"
  labelClassName="my-label"
  inputClassName="my-input"
  errorClassName="my-error"
  helpTextClassName="my-help"
/>
```

### Validation State Classes

```tsx
<CPFInput
  name="cpf"
  label="CPF"
  showValidationState  // Enable state classes
  validClassName="border-green-500"
  invalidClassName="border-red-500"
/>
```

## 🪝 Hooks

Use validation/formatting logic without UI:

### useValidator

```tsx
import { useValidator } from '@wsolutions/form-components';
import { createCPFValidator } from '@wsolutions/form-validation';

function MyComponent() {
  const cpfValidator = createCPFValidator();
  
  const {
    value,
    error,
    isValid,
    handleChange,
    validate
  } = useValidator({
    validator: cpfValidator,
    initialValue: ''
  });

  return (
    <input
      value={value}
      onChange={handleChange}
      onBlur={() => validate()}
    />
  );
}
```

### useFormatter

```tsx
import { useFormatter } from '@wsolutions/form-components';
import { createCPFFormatter } from '@wsolutions/form-validation';

function MyComponent() {
  const cpfFormatter = createCPFFormatter();
  
  const {
    value,        // Formatted value
    rawValue,     // Unformatted value
    handleChange
  } = useFormatter({
    formatter: cpfFormatter,
    initialValue: ''
  });

  return <input value={value} onChange={handleChange} />;
}
```

### useFieldValidation

Combined validation + formatting:

```tsx
import { useFieldValidation } from '@wsolutions/form-components';
import { createCPFValidator, createCPFFormatter } from '@wsolutions/form-validation';

function MyComponent() {
  const {
    value,
    rawValue,
    error,
    isValid,
    inputProps  // Spread directly on input
  } = useFieldValidation({
    validator: createCPFValidator(),
    formatter: createCPFFormatter(),
    options: {
      validateOnBlur: true,
      showErrorOnBlur: true
    }
  });

  return <input {...inputProps} />;
}
```

## 🎯 Advanced Usage

### Custom Error Rendering

```tsx
<CPFInput
  name="cpf"
  label="CPF"
  renderError={(error) => (
    <div className="flex items-center gap-2 text-red-600">
      <AlertIcon />
      <span>{error}</span>
    </div>
  )}
/>
```

### Validation Callbacks

```tsx
<CPFInput
  name="cpf"
  label="CPF"
  onValidation={(result, value) => {
    console.log('Is valid:', result.isValid);
    console.log('Errors:', result.errors);
    console.log('Value:', value);
  }}
/>
```

### Conditional Phone Validation

```tsx
<BrazilianPhoneInput
  name="phone"
  label="Telefone"
  mobileOnly={isMobile}        // Dynamic validation
  landlineOnly={!isMobile}
  includeCountryCode={false}
/>
```

### Universal Phone with Country Selector

```tsx
import { PhoneInput } from '@wsolutions/form-components';

<PhoneInput
  name="phone"
  label="Telefone"
  defaultCountry="BR"
  countries={['BR', 'AR', 'US']}
  onCountryChange={(country) => console.log('Selected:', country)}
/>
```

## 📖 API Reference

### Common Props

All specialized inputs (`CPFInput`, `EmailInput`, etc.) inherit from `FieldGroupProps`:

```tsx
interface CommonProps {
  // Required
  name: string;
  
  // Optional
  label?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  
  // Validation
  required?: boolean;
  showErrorOnBlur?: boolean;
  validateOnMount?: boolean;
  onValidation?: (result: ValidationResult, value: string) => void;
  
  // Styling
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  helpTextClassName?: string;
  
  // Validation State
  showValidationState?: boolean;
  validClassName?: string;
  invalidClassName?: string;
  
  // Help
  helpText?: string;
  requiredIndicator?: string;
  
  // Custom Rendering
  renderError?: (error: string) => ReactNode;
  
  // Plus all standard HTML input attributes
}
```

### CPFInput Props

```tsx
interface CPFInputProps extends CommonProps {
  /** Allow formatted input (with dots and dash) */
  allowFormatted?: boolean;  // default: true
}
```

### BrazilianPhoneInput Props

```tsx
interface BrazilianPhoneInputProps extends CommonProps {
  /** Allow formatted input */
  allowFormatted?: boolean;         // default: true
  /** Only accept mobile numbers (9 digits) */
  mobileOnly?: boolean;             // default: false
  /** Only accept landline numbers (8 digits) */
  landlineOnly?: boolean;           // default: false
  /** Include country code (+55) in formatted output */
  includeCountryCode?: boolean;     // default: false
}
```

### EmailInput Props

```tsx
interface EmailInputProps extends CommonProps {
  /** Allow disposable/temporary email providers */
  allowDisposable?: boolean;  // default: false
  /** Require top-level domain (.com, .br, etc.) */
  requireTld?: boolean;       // default: true
  /** Maximum email length (RFC 5322 = 254) */
  maxLength?: number;         // default: 254
}
```

## 🧪 Testing

Components are built with testing in mind:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CPFInput } from '@wsolutions/form-components';

test('validates CPF on blur', async () => {
  render(<CPFInput name="cpf" label="CPF" />);
  
  const input = screen.getByLabelText('CPF');
  fireEvent.change(input, { target: { value: '12345678900' } });
  fireEvent.blur(input);
  
  // Error message should appear
  expect(await screen.findByRole('alert')).toBeInTheDocument();
});
```

Run tests:

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## 🤝 Integration with Form Libraries

### React Hook Form

```tsx
import { useForm, Controller } from 'react-hook-form';
import { CPFInput } from '@wsolutions/form-components';

function MyForm() {
  const { control } = useForm();

  return (
    <Controller
      name="cpf"
      control={control}
      render={({ field }) => (
        <CPFInput
          {...field}
          label="CPF"
        />
      )}
    />
  );
}
```

## 📝 License

MIT © [WSolutions](https://github.com/WILWSO/Advocacia-Wilson)

## 🔗 Related Packages

- [@wsolutions/form-validation](../form-validation) - Validation and formatting logic
