# @wsolutions/form-components

> React form components with integrated validation and formatting

## 🎯 Features

- ✅ **Complete Form Solution**: Hooks + Components for rapid development
- ✅ **Integrated Validation**: Uses `@wsolutions/form-validation` under the hood
- ✅ **Modal System**: Configurable modals with unsaved changes detection
- ✅ **Type Safe**: Full TypeScript support
- ✅ **Accessible**: ARIA compliant components
- ✅ **Flexible**: Use hooks only, components only, or both together
- ✅ **TailwindCSS Ready**: Styled with Tailwind (customizable)

## 📦 Installation

```bash
npm install @wsolutions/form-components
# or
yarn add @wsolutions/form-components
# or
pnpm add @wsolutions/form-components
```

**Note**: This will automatically install `@wsolutions/form-validation` as a dependency.

## 🚀 Quick Start

### Complete Form Example

```tsx
import { useForm, Modal, FormField, ValidatedInput } from '@wsolutions/form-components';
import { clienteFormSchema } from '@wsolutions/form-components/config';

function ClienteForm() {
  const form = useForm({
    initialValues: { nome: '', email: '', cpf: '' },
    schema: clienteFormSchema,
    onSubmit: async (values) => {
      await saveCliente(values);
    }
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <FormField label="Nome Completo" required error={form.errors.nome}>
        <ValidatedInput
          name="nome"
          value={form.values.nome}
          onChange={(e) => form.handleChange('nome', e.target.value)}
        />
      </FormField>

      <FormField label="Email" error={form.errors.email}>
        <ValidatedInput
          type="email"
          name="email"
          value={form.values.email}
          onChange={(e) => form.handleChange('email', e.target.value)}
        />
      </FormField>

      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  );
}
```

### Modal with Unsaved Changes Guard

```tsx
import { 
  useForm, 
  useModalState, 
  useUnsavedChanges,
  Modal 
} from '@wsolutions/form-components';

function ClienteModal() {
  const modal = useModalState();
  const form = useForm({ ... });
  const { hasChanges, confirmDiscard } = useUnsavedChanges(form);

  const handleClose = async () => {
    if (hasChanges) {
      const confirmed = await confirmDiscard();
      if (!confirmed) return;
    }
    modal.close();
  };

  return (
    <Modal
      isOpen={modal.isOpen}
      onClose={handleClose}
      title="Novo Cliente"
    >
      <Modal.Body>
        {/* Form fields here */}
      </Modal.Body>
      
      <Modal.Footer>
        <Modal.Actions
          confirmText="Salvar"
          cancelText="Cancelar"
          onConfirm={form.handleSubmit}
          onCancel={handleClose}
          confirmDisabled={!form.isValid || form.isSubmitting}
        />
      </Modal.Footer>
    </Modal>
  );
}
```

## 📚 Core Hooks

### Form Management

- `useForm(options)` - Complete form state management with validation
- `useFormState(options)` - Basic form state (without validation)
- `useFieldArray(options)` - Manage array fields (add/remove/reorder)

### Validation & Formatting

- `useFieldValidation(options)` - Single field validation
- `useFormValidation(options)` - Complete form validation
- `useFieldFormatting(options)` - Single field formatting
- `useFormFormatting(options)` - Complete form formatting

### UI State

- `useModalState()` - Modal open/close state management
- `useUnsavedChanges(form)` - Track and warn about unsaved changes
- `useFormNotifications(options)` - Form notifications (toast + inline)
- `useInlineNotification()` - Inline notification state

## 🎨 Components

### Modal Components

- `<Modal />` - Base modal with backdrop
- `<Modal.Header />` - Modal header with title and close button
- `<Modal.Body />` - Modal content area
- `<Modal.Footer />` - Modal footer for actions
- `<Modal.Actions />` - Pre-configured action buttons

### Form Components

- `<Form />` - Form wrapper with validation
- `<FormField />` - Field wrapper with label and error
- `<FormLabel />` - Accessible form label
- `<FormError />` - Error message display
- `<FormHint />` - Helper text display

### Input Components

- `<ValidatedInput />` - Text input with validation
- `<ValidatedTextarea />` - Textarea with validation
- `<ValidatedSelect />` - Select with validation
- `<ValidatedCheckbox />` - Checkbox with validation

### Notification Components

- `<InlineNotification />` - Inline notification banner
- `<Toast />` - Toast notification (positioned)

## ⚙️ Configuration

### Field Rules Configuration

```typescript
import { fieldRulesConfig } from '@wsolutions/form-components/config';

// Centralized field rules (SSoT)
// Maps field names to validation and formatting rules
```

### Form Schemas

```typescript
import { clienteFormSchema, processoFormSchema } from '@wsolutions/form-components/config';

// Pre-configured form schemas for common use cases
```

## 🧪 Testing

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## 📖 Documentation

Full documentation available at: [https://wsolutions.dev/docs/form-components](https://wsolutions.dev/docs/form-components)

## 🎨 Styling

Components are styled with TailwindCSS. You can:

1. **Use as-is** with Tailwind
2. **Override classes** via className prop
3. **Custom theme** via Tailwind config
4. **Unstyled version** (coming soon)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

MIT © Wilton

## 🔗 Related Packages

- [`@wsolutions/form-validation`](../form-validation) - Core validation and formatting logic
