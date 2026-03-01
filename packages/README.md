# @wsolutions Packages

Monorepo containing reusable form validation and component libraries.

## 📦 Packages

### [@wsolutions/form-validation](./form-validation)

Pure logic validation and formatting library - Framework agnostic

```bash
npm install @wsolutions/form-validation
```

**Features:**
- ✅ Zero Dependencies
- ✅ Framework Agnostic
- ✅ Type Safe
- ✅ Composable validators and formatters
- ✅ Brazilian document validation (CPF, CNPJ, CEP)

### [@wsolutions/form-components](./form-components)

React form components with integrated validation and formatting

```bash
npm install @wsolutions/form-components
```

**Features:**
- ✅ Complete form solution (Hooks + Components)
- ✅ Modal system with unsaved changes detection
- ✅ Type Safe with full TypeScript support
- ✅ Accessible (ARIA compliant)
- ✅ TailwindCSS ready

## 🚀 Quick Start

```tsx
import { useForm, Modal, FormField, ValidatedInput } from '@wsolutions/form-components';

function MyForm() {
  const form = useForm({
    initialValues: { name: '', email: '' },
    onSubmit: async (values) => {
      console.log(values);
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <FormField label="Name" error={form.errors.name}>
        <ValidatedInput
          name="name"
          value={form.values.name}
          onChange={(e) => form.handleChange('name', e.target.value)}
        />
      </FormField>
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 📚 Documentation

- [Form Validation Docs](./form-validation/README.md)
- [Form Components Docs](./form-components/README.md)

## 🛠️ Development

```bash
# Install dependencies
npm install
# o con pnpm: pnpm install

# Build all packages
npm run build
# o con pnpm: pnpm run build

# Run tests
npm test
# o con pnpm: pnpm run test

# Watch mode (development)
npm run dev
# o con pnpm: pnpm run dev
```

## 📄 License

MIT © Wilton
