# 📋 PLAN DE MODULARIZACIÓN: VALIDACIONES Y FORMATEO DE FORMULARIOS

**Fecha:** 1 de Marzo de 2026  
**Objetivo:** Crear módulos reutilizables de validación y formateo basados en SSoT, KISS y DRY  
**Estado:** 🟡 PROPUESTA PARA REVISIÓN

---

## 📊 ANÁLISIS DEL ESTADO ACTUAL

### ✅ Fortalezas Actuales

1. **Separación de Responsabilidades**
   - `FormValidator.ts`: Validaciones centralizadas
   - `fieldFormatters.ts`: Formateo centralizado
   - `useFormValidation.ts`: Hook reutilizable de validación
   - `useFormNotifications.ts`: Sistema de notificaciones unificado

2. **Cobertura Completa**
   - Validaciones en tiempo real y al enviar
   - Formateo automático mientras el usuario digita
   - Manejo de errores consistente

3. **Documentación**
   - Código bien comentado
   - Explicación de reglas de negocio

### ❌ Problemas Identificados

1. **Acoplamiento al Dominio**
   ```typescript
   // fieldFormatters.ts - Arrays hardcodeados específicos del dominio
   const VARCHAR_FIELDS = [
     'nome_completo', 'cpf', 'endereco', 'cidade', // ← Específico del proyecto
     // ...
   ]
   ```

2. **Falta de Configuración Externa**
   - Las reglas están hardcodeadas en el código
   - Cambiar reglas requiere modificar código fuente
   - Dificulta reutilización en otros proyectos

3. **Mezcla de Validadores Genéricos y Específicos**
   ```typescript
   // FormValidator.ts - Mezclados
   static validateEmail(email: string)      // ← Genérico ✅
   static validateCPF(cpf: string)          // ← Específico Brasil ⚠️
   static validateRequired(value: string)   // ← Genérico ✅
   ```

4. **Duplicación de Lógica**
   - Validación de campos vacíos repetida en varios lugares
   - Conversión uppercase/lowercase sin abstracción clara
   - Reglas de negocio duplicadas entre validación y formateo

5. **No Hay Sistema de Composición**
   - No se pueden combinar validadores fácilmente
   - No hay pipeline de transformaciones
   - Validaciones complejas requieren código custom

---

## 🏗️ ARQUITECTURA PROPUESTA: 4 CAPAS

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA 4: INTEGRATION                      │
│  (Hooks de React, composición, integración con forms)      │
│                                                             │
│  • useFormValidation()                                      │
│  • useFormFormatting()                                      │
│  • useForm() [validación + formateo + estado]              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 CAPA 3: CONFIGURATION                       │
│      (Configuración específica del proyecto)                │
│                                                             │
│  • fieldRulesConfig.ts (mapeo campos → reglas)             │
│  • validationMessages.ts (mensajes personalizados)         │
│  • formSchemas.ts (esquemas de formularios)                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  CAPA 2: DOMAIN LAYER                       │
│        (Validadores y formateadores de dominio)             │
│                                                             │
│  • validators/brazilian/ (CPF, CNPJ, CEP)                  │
│  • validators/legal/ (número proceso, etc.)                │
│  • formatters/brazilian/ (formatCPF, formatPhone)          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   CAPA 1: CORE LIBRARY                      │
│         (Validadores y formateadores genéricos)             │
│                                                             │
│  • validators/base/ (email, url, length, required)         │
│  • formatters/base/ (uppercase, lowercase, trim, mask)     │
│  • types/ (interfaces genéricas)                           │
│  • composer/ (composición de validaciones)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 ESTRUCTURA DE ARCHIVOS PROPUESTA

```
src/
└── lib/                                    # 📦 Librería modular reutilizable
    └── form-toolkit/                       # Nombre del paquete
        ├── package.json                    # Podría ser npm package separado
        ├── README.md                       # Documentación de la librería
        │
        ├── core/                           # CAPA 1: Código genérico 100% reutilizable
        │   ├── types/
        │   │   ├── validator.types.ts      # Interfaces: Validator, ValidationResult
        │   │   ├── formatter.types.ts      # Interfaces: Formatter, FormatResult
        │   │   └── field.types.ts          # Interfaces: Field, FieldConfig
        │   │
        │   ├── validators/
        │   │   ├── base/
        │   │   │   ├── required.validator.ts
        │   │   │   ├── email.validator.ts
        │   │   │   ├── url.validator.ts
        │   │   │   ├── length.validator.ts
        │   │   │   ├── regex.validator.ts
        │   │   │   ├── number.validator.ts
        │   │   │   └── date.validator.ts
        │   │   │
        │   │   └── composer/
        │   │       ├── compose.validator.ts     # Componer validadores
        │   │       ├── conditional.validator.ts # Validación condicional
        │   │       └── async.validator.ts       # Validación async
        │   │
        │   ├── formatters/
        │   │   ├── base/
        │   │   │   ├── case.formatter.ts        # uppercase, lowercase, capitalize
        │   │   │   ├── trim.formatter.ts
        │   │   │   ├── mask.formatter.ts        # Máscaras genéricas
        │   │   │   ├── number.formatter.ts
        │   │   │   └── date.formatter.ts
        │   │   │
        │   │   └── composer/
        │   │       └── compose.formatter.ts     # Pipeline de formateo
        │   │
        │   └── utils/
        │       ├── string.utils.ts
        │       ├── validation.utils.ts
        │       └── format.utils.ts
        │
        ├── domain/                         # CAPA 2: Código específico de dominio
        │   ├── brazilian/
        │   │   ├── validators/
        │   │   │   ├── cpf.validator.ts
        │   │   │   ├── cnpj.validator.ts
        │   │   │   ├── cep.validator.ts
        │   │   │   ├── phone-br.validator.ts
        │   │   │   └── rg.validator.ts
        │   │   │
        │   │   └── formatters/
        │   │       ├── cpf.formatter.ts
        │   │       ├── cnpj.formatter.ts
        │   │       ├── cep.formatter.ts
        │   │       └── phone-br.formatter.ts
        │   │
        │   └── legal/
        │       └── validators/
        │           └── processo-number.validator.ts
        │
        ├── config/                         # CAPA 3: Configuración del proyecto
        │   ├── field-rules.config.ts       # Mapeo: campo → reglas
        │   ├── validation-messages.ts      # Mensajes de error
        │   └── schemas/
        │       ├── cliente.schema.ts       # Schema de formulario Cliente
        │       ├── processo.schema.ts      # Schema de formulario Processo
        │       └── usuario.schema.ts       # Schema de formulario Usuario
        │
        └── react/                          # CAPA 4: Integración con React
            ├── hooks/
            │   ├── useFieldValidation.ts   # Validación de un campo
            │   ├── useFormValidation.ts    # Validación de formulario completo
            │   ├── useFieldFormatting.ts   # Formateo de un campo
            │   ├── useFormFormatting.ts    # Formateo de formulario completo
            │   └── useForm.ts              # Composición completa
            │
            └── components/
                ├── ValidatedInput.tsx      # Input con validación integrada
                └── FormField.tsx           # Field completo con validación + formateo
```

---

## 💻 EJEMPLOS DE CÓDIGO

### 1. CAPA 1: Core Validators (Genéricos)

```typescript
// core/types/validator.types.ts
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface Validator<T = any> {
  name: string;
  validate: (value: T, context?: any) => ValidationResult | Promise<ValidationResult>;
  message?: string | ((value: T) => string);
}

export interface ValidatorOptions {
  message?: string;
  stopOnError?: boolean;
}
```

```typescript
// core/validators/base/email.validator.ts
import { Validator, ValidationResult } from '../../types/validator.types';

export interface EmailValidatorOptions {
  message?: string;
  maxLength?: number;
  allowInternational?: boolean;
}

export const createEmailValidator = (
  options: EmailValidatorOptions = {}
): Validator<string> => {
  const {
    message = 'E-mail deve ter um formato válido',
    maxLength = 254,
    allowInternational = true
  } = options;

  return {
    name: 'email',
    message,
    validate: (value: string): ValidationResult => {
      if (!value || value.trim().length === 0) {
        return { isValid: true, errors: [] }; // Validar "required" separadamente
      }

      const errors: string[] = [];
      const trimmed = value.trim();

      // Validar longitud
      if (trimmed.length > maxLength) {
        errors.push(`E-mail não pode exceder ${maxLength} caracteres`);
      }

      // Validar formato
      const emailRegex = allowInternational
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(trimmed)) {
        errors.push(message);
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    }
  };
};
```

```typescript
// core/validators/base/required.validator.ts
import { Validator, ValidationResult } from '../../types/validator.types';

export interface RequiredValidatorOptions {
  message?: string;
  trim?: boolean;
  allowZero?: boolean;
}

export const createRequiredValidator = (
  fieldName: string,
  options: RequiredValidatorOptions = {}
): Validator => {
  const {
    message = `${fieldName} é obrigatório`,
    trim = true,
    allowZero = false
  } = options;

  return {
    name: 'required',
    message,
    validate: (value: any): ValidationResult => {
      const errors: string[] = [];

      // Null ou undefined
      if (value === null || value === undefined) {
        errors.push(message);
        return { isValid: false, errors };
      }

      // String vazia (com ou sin trim)
      if (typeof value === 'string') {
        const checkValue = trim ? value.trim() : value;
        if (checkValue.length === 0) {
          errors.push(message);
        }
      }

      // Número zero (opcional)
      if (typeof value === 'number' && value === 0 && !allowZero) {
        errors.push(message);
      }

      // Array vacío
      if (Array.isArray(value) && value.length === 0) {
        errors.push(message);
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    }
  };
};
```

```typescript
// core/validators/composer/compose.validator.ts
import { Validator, ValidationResult } from '../../types/validator.types';

export interface ComposeOptions {
  stopOnError?: boolean;
  async?: boolean;
}

/**
 * Compone múltiples validadores en uno solo
 * Ejecuta validaciones en secuencia y combina resultados
 */
export const composeValidators = (
  validators: Validator[],
  options: ComposeOptions = {}
): Validator => {
  const { stopOnError = false, async = false } = options;

  return {
    name: 'composed',
    validate: async (value: any, context?: any): Promise<ValidationResult> => {
      const allErrors: string[] = [];
      const allWarnings: string[] = [];

      for (const validator of validators) {
        const result = await Promise.resolve(validator.validate(value, context));

        if (!result.isValid) {
          allErrors.push(...result.errors);
          if (stopOnError) break;
        }

        if (result.warnings) {
          allWarnings.push(...result.warnings);
        }
      }

      return {
        isValid: allErrors.length === 0,
        errors: allErrors,
        warnings: allWarnings.length > 0 ? allWarnings : undefined
      };
    }
  };
};
```

### 2. CAPA 1: Core Formatters (Genéricos)

```typescript
// core/types/formatter.types.ts
export interface FormatResult<T = string> {
  value: T;
  formatted: string;
  changed: boolean;
}

export interface Formatter<T = any, R = string> {
  name: string;
  format: (value: T, options?: any) => R;
}
```

```typescript
// core/formatters/base/case.formatter.ts
import { Formatter } from '../../types/formatter.types';

export const uppercaseFormatter: Formatter<string, string> = {
  name: 'uppercase',
  format: (value: string): string => {
    if (!value || typeof value !== 'string') return '';
    return value.toUpperCase();
  }
};

export const lowercaseFormatter: Formatter<string, string> = {
  name: 'lowercase',
  format: (value: string): string => {
    if (!value || typeof value !== 'string') return '';
    return value.toLowerCase();
  }
};

export const capitalizeFormatter: Formatter<string, string> = {
  name: 'capitalize',
  format: (value: string): string => {
    if (!value || typeof value !== 'string') return '';
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
};
```

```typescript
// core/formatters/composer/compose.formatter.ts
import { Formatter } from '../../types/formatter.types';

/**
 * Compone múltiples formateadores en un pipeline
 * Los formateadores se aplican en secuencia
 */
export const composeFormatters = <T = any>(
  formatters: Formatter<any, any>[]
): Formatter<T, any> => {
  return {
    name: 'composed',
    format: (value: T, options?: any): any => {
      return formatters.reduce((currentValue, formatter) => {
        return formatter.format(currentValue, options);
      }, value);
    }
  };
};
```

### 3. CAPA 2: Domain Validators (Específicos)

```typescript
// domain/brazilian/validators/cpf.validator.ts
import { Validator, ValidationResult } from '../../../core/types/validator.types';

export interface CPFValidatorOptions {
  message?: string;
  required?: boolean;
}

/**
 * Validador de CPF brasileiro
 * Algoritmo oficial de dígitos verificadores
 */
export const createCPFValidator = (
  options: CPFValidatorOptions = {}
): Validator<string> => {
  const {
    message = 'CPF inválido',
    required = false
  } = options;

  return {
    name: 'cpf',
    message,
    validate: (value: string): ValidationResult => {
      if (!value || value.trim().length === 0) {
        if (required) {
          return { isValid: false, errors: ['CPF é obrigatório'] };
        }
        return { isValid: true, errors: [] };
      }

      const errors: string[] = [];
      const cleanCPF = value.replace(/[^\d]/g, '');

      // Validar longitud
      if (cleanCPF.length !== 11) {
        errors.push('CPF deve ter 11 dígitos');
        return { isValid: false, errors };
      }

      // Validar dígitos iguales
      if (/^(\d)\1+$/.test(cleanCPF)) {
        errors.push(message);
        return { isValid: false, errors };
      }

      // Validar primer dígito verificador
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
      }
      let digit = 11 - (sum % 11);
      if (digit >= 10) digit = 0;

      if (digit !== parseInt(cleanCPF.charAt(9))) {
        errors.push(message);
        return { isValid: false, errors };
      }

      // Validar segundo dígito verificador
      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
      }
      digit = 11 - (sum % 11);
      if (digit >= 10) digit = 0;

      if (digit !== parseInt(cleanCPF.charAt(10))) {
        errors.push(message);
        return { isValid: false, errors };
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    }
  };
};
```

### 4. CAPA 2: Domain Formatters (Específicos)

```typescript
// domain/brazilian/formatters/cpf.formatter.ts
import { Formatter } from '../../../core/types/formatter.types';

/**
 * Formatea CPF brasileiro: 000.000.000-00
 */
export const cpfFormatter: Formatter<string, string> = {
  name: 'cpf',
  format: (value: string): string => {
    if (!value || typeof value !== 'string') return '';

    const cleanCPF = value.replace(/[^\d]/g, '');

    if (cleanCPF.length <= 3) return cleanCPF;
    if (cleanCPF.length <= 6) return cleanCPF.replace(/(\d{3})(\d)/, '$1.$2');
    if (cleanCPF.length <= 9) return cleanCPF.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
    return cleanCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
};
```

### 5. CAPA 3: Configuration (Proyecto)

```typescript
// config/field-rules.config.ts
import { createEmailValidator } from '../core/validators/base/email.validator';
import { createRequiredValidator } from '../core/validators/base/required.validator';
import { createCPFValidator } from '../domain/brazilian/validators/cpf.validator';
import { uppercaseFormatter, lowercaseFormatter } from '../core/formatters/base/case.formatter';
import { cpfFormatter } from '../domain/brazilian/formatters/cpf.formatter';

export interface FieldRule {
  validators?: Validator[];
  formatters?: Formatter[];
  formatOn?: 'change' | 'blur' | 'submit';
  nullable?: boolean;
  defaultValue?: any;
}

export interface FieldRulesConfig {
  [fieldName: string]: FieldRule;
}

/**
 * Configuración centralizada de reglas de campos
 * SSoT para validación y formateo de todos los formularios
 */
export const fieldRulesConfig: FieldRulesConfig = {
  // Campos de Cliente
  nome_completo: {
    validators: [
      createRequiredValidator('Nome completo'),
      createLengthValidator({ min: 3, max: 255 })
    ],
    formatters: [uppercaseFormatter],
    formatOn: 'change'
  },

  email: {
    validators: [
      createEmailValidator({ maxLength: 254 })
    ],
    formatters: [lowercaseFormatter],
    formatOn: 'blur', // Solo formatea cuando pierde foco
    nullable: true
  },

  cpf_cnpj: {
    validators: [
      createCPFValidator({ required: false })
    ],
    formatters: [cpfFormatter, uppercaseFormatter],
    formatOn: 'change',
    nullable: true // Si vacío, enviar null al backend
  },

  celular: {
    validators: [
      createRequiredValidator('Celular'),
      createPhoneBRValidator({ type: 'celular' })
    ],
    formatters: [phoneBRFormatter],
    formatOn: 'change'
  },

  // Campos especiales (no formatear)
  observacoes: {
    validators: [
      createLengthValidator({ max: 5000 })
    ],
    formatters: [], // Texto libre, sin formateo
    formatOn: 'submit'
  },

  // Campos de enumeración
  status: {
    validators: [
      createEnumValidator(['ativo', 'inativo', 'arquivado'])
    ],
    formatters: [], // Ya vienen con valor correcto
    formatOn: 'submit'
  }
};
```

```typescript
// config/schemas/cliente.schema.ts
import { fieldRulesConfig } from '../field-rules.config';

/**
 * Schema completo del formulario de Cliente
 * Define qué campos usar y sus reglas
 */
export const clienteFormSchema = {
  fields: [
    'nome_completo',
    'cpf_cnpj',
    'rg',
    'email',
    'celular',
    'telefone',
    'endereco_completo',
    'cidade',
    'estado',
    'status'
  ] as const,

  // Obtener reglas de cada campo
  getFieldRule: (fieldName: string) => {
    return fieldRulesConfig[fieldName];
  },

  // Validaciones a nivel de formulario (cross-field)
  formValidators: [
    {
      name: 'cpf_unique',
      validate: async (formData, context) => {
        // Validar CPF único en base de datos
        if (!formData.cpf_cnpj) return { isValid: true, errors: [] };
        
        const exists = await context.checkCPFExists(formData.cpf_cnpj, formData.id);
        return {
          isValid: !exists,
          errors: exists ? ['CPF/CNPJ já cadastrado'] : []
        };
      }
    }
  ]
};
```

### 6. CAPA 4: React Integration

```typescript
// react/hooks/useFieldValidation.ts
import { useState, useCallback } from 'react';
import { Validator, ValidationResult } from '../../core/types/validator.types';
import { composeValidators } from '../../core/validators/composer/compose.validator';

export interface UseFieldValidationOptions {
  validators: Validator[];
  validateOn?: 'change' | 'blur' | 'submit';
  debounceMs?: number;
}

export const useFieldValidation = (options: UseFieldValidationOptions) => {
  const { validators, validateOn = 'blur', debounceMs = 0 } = options;
  
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const composedValidator = composeValidators(validators);

  const validate = useCallback(async (value: any): Promise<ValidationResult> => {
    setIsValidating(true);
    
    try {
      const result = await composedValidator.validate(value);
      setError(result.isValid ? null : result.errors[0]);
      return result;
    } finally {
      setIsValidating(false);
    }
  }, [composedValidator]);

  const clear = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isValidating,
    validate,
    clear
  };
};
```

```typescript
// react/hooks/useForm.ts
import { useState, useCallback } from 'react';
import { fieldRulesConfig } from '../../config/field-rules.config';

export interface UseFormOptions<T> {
  initialValues: T;
  schema: any; // Schema del formulario
  onSubmit: (values: T) => void | Promise<void>;
}

export const useForm = <T extends Record<string, any>>(
  options: UseFormOptions<T>
) => {
  const { initialValues, schema, onSubmit } = options;
  
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtener reglas de un campo
  const getFieldRule = (fieldName: string) => {
    return schema.getFieldRule(fieldName);
  };

  // Manejar cambio de campo
  const handleChange = useCallback((fieldName: keyof T, value: any) => {
    const rule = getFieldRule(fieldName as string);
    
    // Aplicar formateo si corresponde
    let formattedValue = value;
    if (rule?.formatOn === 'change' && rule.formatters) {
      formattedValue = rule.formatters.reduce(
        (val, formatter) => formatter.format(val),
        value
      );
    }

    setValues(prev => ({ ...prev, [fieldName]: formattedValue }));

    // Validar si corresponde
    if (rule?.validators && touched[fieldName as string]) {
      validateField(fieldName as string, formattedValue);
    }
  }, [touched]);

  // Validar campo individual
  const validateField = useCallback(async (
    fieldName: string,
    value: any
  ): Promise<boolean> => {
    const rule = getFieldRule(fieldName);
    if (!rule?.validators) return true;

    const composedValidator = composeValidators(rule.validators);
    const result = await composedValidator.validate(value);

    if (!result.isValid) {
      setErrors(prev => ({ ...prev, [fieldName]: result.errors[0] }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      return true;
    }
  }, []);

  // Validar formulario completo
  const validateForm = useCallback(async (): Promise<boolean> => {
    const fieldValidations = await Promise.all(
      schema.fields.map((field: string) => validateField(field, values[field]))
    );

    return fieldValidations.every(Boolean);
  }, [values, validateField]);

  // Submit
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      const isValid = await validateForm();
      if (!isValid) return;

      // Aplicar formateo final
      const formattedValues = { ...values };
      schema.fields.forEach((field: string) => {
        const rule = getFieldRule(field);
        if (rule?.formatOn === 'submit' && rule.formatters) {
          formattedValues[field] = rule.formatters.reduce(
            (val, formatter) => formatter.format(val),
            formattedValues[field]
          );
        }
      });

      await onSubmit(formattedValues);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleSubmit,
    validateField,
    validateForm,
    setFieldTouched: (field: keyof T) => 
      setTouched(prev => ({ ...prev, [field]: true }))
  };
};
```

---

## 🔄 PLAN DE MIGRACIÓN

### Fase 1: Preparación (1-2 días) ⚪

**Objetivo:** Crear estructura sin romper código existente

1. **Crear carpeta `src/lib/form-toolkit/`**
2. **Implementar CAPA 1 (Core):**
   - Tipos e interfaces
   - Validadores genéricos básicos
   - Formateadores genéricos básicos
   - Composer de validadores

3. **Testing:**
   - Unit tests para cada validador/formateador
   - Tests de composición

**Sin tocar código existente aún** ✅

### Fase 2: Domain Layer (2-3 días) ⚪

**Objetivo:** Migrar validadores específicos de Brasil

1. **Implementar CAPA 2 (Domain):**
   - Migrar `validateCPF` → `createCPFValidator`
   - Migrar `validateCNPJ` → `createCNPJValidator`
   - Migrar `validateCEP` → `createCEPValidator`
   - Migrar `validateTelefoneBR` → `createPhoneBRValidator`
   - Migrar formatadores brasileños

2. **Testing:**
   - Tests de validadores brasileños
   - Tests de formatadores brasileños

**Sin tocar código existente aún** ✅

### Fase 3: Configuration (1-2 días) ⚪

**Objetivo:** Externalizar configuración

1. **Implementar CAPA 3 (Configuration):**
   - Crear `field-rules.config.ts`
   - Migrar arrays hardcodeados a configuración
   - Crear schemas de formularios (Cliente, Processo, Usuario)

2. **Documentar:**
   - Cómo agregar nuevos campos
   - Cómo modificar reglas existentes

**Sin tocar código existente aún** ✅

### Fase 4: React Integration (2-3 días) 🟡

**Objetivo:** Crear hooks modernos

1. **Implementar CAPA 4 (Integration):**
   - `useFieldValidation`
   - `useFieldFormatting`
   - `useForm` (composición completa)

2. **Componentes:**
   - `ValidatedInput` (opcional)
   - `FormField` (opcional)

**Aquí empieza la migración gradual** ⚠️

### Fase 5: Migración Gradual (3-5 días) 🔴

**Objetivo:** Migrar formularios uno por uno

1. **Migrar `useClienteForm`:**
   - Reemplazar `FormValidator` por nuevo sistema
   - Reemplazar `formatFormData` por configuración
   - Mantener API externa igual (sin romper componentes)

2. **Migrar `ClientesPage`:**
   - Adaptar a nuevos hooks
   - Verificar funcionamiento

3. **Repetir para otros formularios:**
   - `useProcessoForm`
   - `useAudienciaForm`
   - `useUsuarioForm`

4. **Deprecar archivos viejos:**
   - Marcar `FormValidator.ts` como `@deprecated`
   - Marcar `fieldFormatters.ts` como `@deprecated`
   - Eliminar después de migración completa

### Fase 6: Cleanup (1 día) ⚪

**Objetivo:** Limpiar código viejo

1. **Eliminar archivos deprecados**
2. **Actualizar imports en todo el proyecto**
3. **Documentación final**
4. **Tests de regresión completos**

---

## 📊 EVALUACIÓN DE PRINCIPIOS

### ✅ SSoT (Single Source of Truth)

| Concepto | Antes | Después | Mejora |
|----------|-------|---------|--------|
| **Reglas de validación** | Duplicadas en `FormValidator` y hooks | Centralizadas en `field-rules.config.ts` | ✅ **MAYOR** |
| **Reglas de formateo** | Arrays hardcodeados en múltiples archivos | Única configuración | ✅ **MAYOR** |
| **Mensajes de error** | Mezclados en código | Centralizados en `validation-messages.ts` | ✅ **MAYOR** |
| **Lógica de negocio** | Dispersa | En schemas de formularios | ✅ **MAYOR** |

**Veredicto:** ✅ **La arquitectura propuesta mejora significativamente SSoT**

### ✅ DRY (Don't Repeat Yourself)

| Caso | Antes | Después | Mejora |
|------|-------|---------|--------|
| **Validación de email** | Repetida en varios lugares | Un solo `createEmailValidator` | ✅ **ELIMINA** duplicación |
| **Formateo uppercase** | Código repetido | Un solo `uppercaseFormatter` | ✅ **ELIMINA** duplicación |
| **Composición de validadores** | Código custom en cada hook | `composeValidators` reutilizable | ✅ **ELIMINA** duplicación |
| **Manejo de errores** | Lógica repetida | Unificada en hooks | ✅ **ELIMINA** duplicación |

**Veredicto:** ✅ **La arquitectura propuesta elimina duplicación masivamente**

### ⚖️ KISS (Keep It Simple, Stupid)

| Aspecto | Simplicidad Antes | Simplicidad Después | Análisis |
|---------|-------------------|---------------------|----------|
| **Agregar campo nuevo** | Modificar 3-4 archivos, buscar arrays correctos | Agregar regla en config, listo | ✅ **MÁS SIMPLE** |
| **Cambiar regla** | Buscar en código, modificar lógica | Editar configuración | ✅ **MÁS SIMPLE** |
| **Entender el sistema** | Leer múltiples archivos | Leer documentación + config | ⚠️ **INICIAL: más complejo** <br> ✅ **DESPUÉS: más simple** |
| **Debuggear** | Stack traces largos | Más capas de abstracción | ⚠️ **POTENCIALMENTE más complejo** |
| **Reutilizar en otro proyecto** | Copiar y buscar qué modificar | Copiar `lib/`, cambiar config | ✅ **MUCHO MÁS SIMPLE** |

**Veredicto:** ⚖️ **Complejidad inicial mayor, pero SIMPLICIDAD a largo plazo**

### 🔀 Compatibilidad SSoT + KISS + DRY

```
┌────────────────────────────────────────────────────┐
│  ¿Son compatibles SSoT, KISS y DRY?                │
│                                                    │
│  Respuesta: SÍ, pero con TRADE-OFFS               │
│                                                    │
│  ✅ SSoT + DRY = Naturalmente compatibles         │
│     (centralización elimina duplicación)           │
│                                                    │
│  ⚠️ SSoT + DRY vs KISS = TENSIÓN INICIAL          │
│     • Más capas → más complejo al principio       │
│     • Pero más simple a largo plazo                │
│                                                    │
│  Solución: KISS Progresivo                         │
│     1. Empezar simple (Core mínimo)               │
│     2. Agregar capas según necesidad               │
│     3. Documentar BIEN para reducir curva         │
└────────────────────────────────────────────────────┘
```

---

## 🎯 RECOMENDACIONES FINALES

### ✅ RECOMIENDO IMPLEMENTAR (con matices)

**Razones:**

1. **Reutilización Real:**
   - Toda la `lib/form-toolkit/` puede convertirse en paquete npm
   - Usar en múltiples proyectos sin modificación

2. **Mantenibilidad:**
   - Cambiar reglas es trivial (solo config)
   - Agregar validadores no afecta código existente
   - Tests más simples (unit tests puros)

3. **Escalabilidad:**
   - Agregar nuevos formularios es rápido
   - Equipo nuevo entiende rápido (documentación clara)
   - Menos bugs (lógica centralizada)

4. **SSoT Real:**
   - Una sola fuente de verdad para reglas
   - Configuración declarativa vs código imperativo

### ⚠️ PERO CON CAUTELA

**Recomendaciones de implementación:**

1. **NO hacer todo de una vez:**
   - ✅ Implementar por fases (migración gradual)
   - ❌ NO reescribir todo el código existente de golpe

2. **Empezar mínimo:**
   - Implementar solo validadores/formateadores que usas HOY
   - Agregar otros según necesidad real

3. **Documentar MUCHO:**
   - README detallado en `lib/form-toolkit/`
   - Ejemplos de uso para cada capa
   - Guía de migración paso a paso

4. **Tests primero:**
   - Cada validador/formateador con unit tests
   - Tests de integración de formularios completos
   - Tests de regresión antes de deprecar código viejo

5. **API compatible:**
   - Hooks nuevos con misma API que viejos
   - Migración transparente para componentes

### 🚨 RIESGOS A CONSIDERAR

1. **Over-engineering:**
   - Si solo tienes 3 formularios simples, quizás sea mucho
   - Evaluar: ¿realmente necesitas reutilizar en otros proyectos?

2. **Curva de aprendizaje:**
   - Equipo necesita entender nueva arquitectura
   - Tiempo de onboarding mayor al principio

3. **Debugging más complejo:**
   - Más capas de abstracción
   - Stack traces más largos
   - Necesitas buenas herramientas de dev

### 💡 ALTERNATIVA INTERMEDIA

Si quieres algo **menos ambicioso** pero que mejore igualmente:

```typescript
// Opción "Lite": Solo mover configuración sin toda la arquitectura

// config/field-validation-rules.ts
export const FIELD_RULES = {
  nome_completo: {
    required: true,
    minLength: 3,
    maxLength: 255,
    format: 'uppercase'
  },
  email: {
    required: false,
    type: 'email',
    format: 'lowercase'
  },
  // ...
};

// Mantener FormValidator.ts pero leerlo de config
export class FormValidator {
  static validateField(fieldName: string, value: any) {
    const rules = FIELD_RULES[fieldName];
    // Aplicar reglas dinámicamente
  }
}
```

**Pros:**
- ✅ Menos cambios
- ✅ Más rápido de implementar
- ✅ Ya mejora SSoT

**Contras:**
- ❌ Menos reutilizable
- ❌ Menos flexible
- ❌ No separas core de domain

---

## 📝 DECISIÓN FINAL: TÚ DECIDES

### Opción A: Arquitectura Completa (4 capas)
- **Tiempo:** 10-15 días
- **Complejidad:** Alta inicial, baja a largo plazo
- **Reutilización:** Excelente (puede ser paquete npm)
- **Recomendado si:** Vas a crear muchos más formularios o reutilizar en otros proyectos

### Opción B: Arquitectura Intermedia (config + refactor moderado)
- **Tiempo:** 5-7 días
- **Complejidad:** Media
- **Reutilización:** Buena para este proyecto
- **Recomendado si:** Solo necesitas mejorar mantenibilidad del proyecto actual

### Opción C: Refactor Mínimo (solo config externa)
- **Tiempo:** 2-3 días
- **Complejidad:** Baja
- **Reutilización:** Limitada
- **Recomendado si:** Solo quieres SSoT sin cambiar mucho

### Opción D: Mantener como está
- **Tiempo:** 0 días
- **Complejidad:** Ya conocida
- **Reutilización:** Ninguna
- **Recomendado si:** El sistema actual funciona bien y no necesitas cambios

---

## 🤔 PREGUNTAS PARA TI

Antes de decidir, considera:

1. **¿Cuántos formularios más vas a crear?**
   - Si > 10: Opción A
   - Si 5-10: Opción B
   - Si < 5: Opción C

2. **¿Vas a reutilizar en otros proyectos?**
   - Si sí: Opción A
   - Si no: Opción B o C

3. **¿Cuánto tiempo puedes invertir?**
   - 2 semanas disponibles: Opción A
   - 1 semana disponible: Opción B
   - 2-3 días disponibles: Opción C

4. **¿Qué tan importante es la complejidad inicial?**
   - Puedo manejarla: Opción A
   - Prefiero moderada: Opción B
   - Quiero mínima: Opción C

---

**¿Qué opción prefieres? Puedo detallarlo más o ajustar la propuesta según tus necesidades.**

---
---

# 🎯 DECISIONES FINALES (1 de Marzo de 2026)

## ✅ ARQUITECTURA APROBADA

**Decisión:** Implementar **OPCIÓN A - Arquitectura Completa de 4 Capas con 2 Paquetes Separados**

### 📦 Estructura de Paquetes:

```
@empresa/form-validation
  └── Validadores + Formatters (lógica pura, sin React)

@empresa/form-components  
  └── Hooks + Components + UI (React, depende de form-validation)
```

### 🎯 Principios Aplicados:

1. ✅ **SSoT (Single Source of Truth)**: Configuración centralizada en schemas
2. ✅ **DRY (Don't Repeat Yourself)**: Sin duplicación de lógica
3. ✅ **KISS (Keep It Simple)**: La solución más simple que logra los objetivos
4. ✅ **SRP (Single Responsibility)**: Cada módulo hace una cosa bien

### 📋 Alcance del Proyecto:

- **Validación y Formateo** de campos
- **Hooks de gestión de estado** de formularios
- **Componentes UI reutilizables**:
  - Modal base con header/footer configurable
  - Form components con validación integrada
  - Sistema de detección de cambios no guardados
  - Sistema de notificaciones (inline + toast)

---

# 📅 PLAN DE IMPLEMENTACIÓN DETALLADO

## 🏗️ FASE 1: Setup Inicial (Día 1 - 2 horas)

### Objetivo: Crear estructura de carpetas y configuración

### Tareas:

1. **Crear estructura de paquetes**
   ```
   src/lib/
   ├── form-validation/
   │   ├── package.json
   │   ├── tsconfig.json
   │   ├── README.md
   │   └── src/
   └── form-components/
       ├── package.json
       ├── tsconfig.json
       ├── README.md
       └── src/
   ```

2. **Configurar package.json de cada paquete**
   - Definir exports
   - Configurar dependencies
   - Script de build

3. **Configurar TypeScript**
   - Configuración estricta
   - Path aliases
   - Declaration files

4. **Setup de testing**
   - Vitest configurado
   - Estructura de tests

### Entregables:
- ✅ Estructura de carpetas creada
- ✅ Configuración base funcionando
- ✅ README inicial de cada paquete

---

## 📦 FASE 2: Paquete 1 - @empresa/form-validation (Días 1-3)

### DÍA 1: Core Types & Base Validators

#### 2.1. Types & Interfaces (2 horas)

**Archivos a crear:**
- `src/types/validator.types.ts`
- `src/types/formatter.types.ts`
- `src/types/field.types.ts`

**Interfaces principales:**
```typescript
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface Validator<T = any> {
  name: string;
  validate: (value: T, context?: any) => ValidationResult | Promise<ValidationResult>;
  message?: string | ((value: T) => string);
}

export interface Formatter<T = any, R = string> {
  name: string;
  format: (value: T, options?: any) => R;
}
```

**Testing:** Unit tests para tipos

#### 2.2. Core Validators (4 horas)

**Archivos a crear:**
- `src/validators/core/required.validator.ts`
- `src/validators/core/email.validator.ts`
- `src/validators/core/length.validator.ts`
- `src/validators/core/regex.validator.ts`
- `src/validators/core/url.validator.ts`
- `src/validators/core/number.validator.ts`
- `src/validators/core/date.validator.ts`

**Prioridad:** required, email, length (los más usados)

**Testing:** Unit test para cada validador

#### 2.3. Validator Composer (2 horas)

**Archivos a crear:**
- `src/validators/composer/compose.validator.ts`
- `src/validators/composer/conditional.validator.ts`

**Funcionalidad:**
- Combinar múltiples validadores
- Validación condicional (validar solo si...)
- Stop on first error (opcional)

**Testing:** Tests de composición

---

### DÍA 2: Core Formatters & Utils

#### 2.4. Core Formatters (3 horas)

**Archivos a crear:**
- `src/formatters/core/case.formatter.ts` (uppercase, lowercase, capitalize)
- `src/formatters/core/trim.formatter.ts`
- `src/formatters/core/mask.formatter.ts`
- `src/formatters/core/number.formatter.ts`

**Testing:** Unit test para cada formatter

#### 2.5. Formatter Composer (1 hora)

**Archivos a crear:**
- `src/formatters/composer/compose.formatter.ts`

**Funcionalidad:**
- Pipeline de formatters
- Aplicar secuencialmente

**Testing:** Tests de composición

#### 2.6. Utils (2 horas)

**Archivos a crear:**
- `src/utils/string.utils.ts`
- `src/utils/validation.utils.ts`
- `src/utils/format.utils.ts`

**Funciones:**
- removeNonNumeric()
- normalizeWhitespace()
- sanitizeString()

**Testing:** Unit tests

#### 2.7. Exports & Build (2 horas)

**Archivos a crear:**
- `src/index.ts` (export principal)
- `src/validators/index.ts`
- `src/formatters/index.ts`

**Build:**
- Compilar TypeScript
- Generar .d.ts files
- Verificar exports

---

### DÍA 3: Domain Validators & Formatters (Brazilian)

#### 2.8. Brazilian Validators (4 horas)

**Archivos a migrar/crear:**
- `src/validators/domain/brazilian/cpf.validator.ts`
- `src/validators/domain/brazilian/cnpj.validator.ts`
- `src/validators/domain/brazilian/cep.validator.ts`
- `src/validators/domain/brazilian/phone-br.validator.ts`
- `src/validators/domain/brazilian/rg.validator.ts`

**Migración desde:**
- `FormValidator.ts` → métodos validateCPF, validateCNPJ, etc.

**Testing:** Tests con casos brasileños reales

#### 2.9. Brazilian Formatters (2 horas)

**Archivos a migrar/crear:**
- `src/formatters/domain/brazilian/cpf.formatter.ts`
- `src/formatters/domain/brazilian/cnpj.formatter.ts`
- `src/formatters/domain/brazilian/cep.formatter.ts`
- `src/formatters/domain/brazilian/phone-br.formatter.ts`

**Migración desde:**
- `fieldFormatters.ts` → formatCPF, formatPhone, etc.

**Testing:** Tests de formateo

#### 2.10. Documentation & Polish (2 horas)

**Archivos:**
- `README.md` completo con ejemplos
- Comentarios JSDoc completos
- CHANGELOG.md inicial

**Entregables Fase 2:**
- ✅ Paquete @empresa/form-validation funcional
- ✅ Tests pasando al 100%
- ✅ Documentación completa
- ✅ Build funcionando
- ✅ Publicable a npm (incluso si es privado)

---

## 🎨 FASE 3: Paquete 2 - @empresa/form-components (Días 4-8)

### DÍA 4: Configuration Layer & Schemas

#### 3.1. Configuration (3 horas)

**Archivos a crear:**
- `src/config/field-rules.config.ts`
- `src/config/validation-messages.ts`

**Migración desde:**
- Arrays hardcodeados de `fieldFormatters.ts`
  - VARCHAR_FIELDS → config
  - EMAIL_FIELDS → config
  - ENUM_FIELDS → config
  - etc.

**Funcionalidad:**
```typescript
export const fieldRulesConfig: FieldRulesConfig = {
  nome_completo: {
    validators: [
      createRequiredValidator('Nome completo'),
      createLengthValidator({ min: 3, max: 255 })
    ],
    formatters: [uppercaseFormatter],
    formatOn: 'change',
    nullable: false
  },
  // ... más campos
};
```

**Testing:** Tests de configuración

#### 3.2. Form Schemas (3 horas)

**Archivos a crear:**
- `src/config/schemas/base.schema.ts`
- `src/config/schemas/cliente.schema.ts` (ejemplo)
- `src/config/schemas/processo.schema.ts` (ejemplo)

**Funcionalidad:**
```typescript
export const clienteFormSchema = createFormSchema({
  fields: ['nome_completo', 'email', 'cpf_cnpj', 'celular'],
  getFieldRule: (field) => fieldRulesConfig[field],
  formValidators: [
    {
      name: 'cpf_unique',
      validate: async (formData, context) => {
        // Validación cross-field
      }
    }
  ]
});
```

**Testing:** Tests de schemas

#### 3.3. React Wrappers (2 horas)

**Archivos a crear:**
- `src/hooks/validation/useValidator.ts`
- `src/hooks/formatting/useFormatter.ts`

**Funcionalidad:**
- Wrappers de React para usar validators/formatters
- Memoización correcta
- Hooks rules compliance

**Testing:** React Testing Library

---

### DÍA 5: Validation & Formatting Hooks

#### 3.4. Field Validation Hooks (3 horas)

**Archivos a crear:**
- `src/hooks/validation/useFieldValidation.ts`
- `src/hooks/validation/useFormValidation.ts`

**Funcionalidad:**
```typescript
const { error, isValidating, validate, clear } = useFieldValidation({
  validators: [emailValidator, requiredValidator],
  validateOn: 'blur',
  debounceMs: 300
});
```

**Testing:** React Testing Library + user events

#### 3.5. Field Formatting Hooks (3 horas)

**Archivos a crear:**
- `src/hooks/formatting/useFieldFormatting.ts`
- `src/hooks/formatting/useFormFormatting.ts`

**Funcionalidad:**
```typescript
const { formattedValue, format } = useFieldFormatting({
  formatters: [uppercaseFormatter, trimFormatter],
  formatOn: 'change'
});
```

**Testing:** React Testing Library

#### 3.6. Integration Tests (2 horas)

**Testing:**
- Validación + Formateo juntos
- Edge cases
- Performance tests

---

### DÍA 6: Form State Hooks

#### 3.7. useForm Hook (4 horas)

**Archivos a crear:**
- `src/hooks/state/useForm.ts`

**Funcionalidad completa:**
```typescript
const form = useForm({
  initialValues: { nome: '', email: '' },
  schema: clienteFormSchema,
  onSubmit: async (values) => { ... }
});

// API:
form.values
form.errors
form.touched
form.isSubmitting
form.isValid
form.handleChange(field, value)
form.handleBlur(field)
form.handleSubmit()
form.setFieldValue(field, value)
form.setFieldError(field, error)
form.reset()
```

**Inspiración:**
- react-hook-form (simplicidad)
- formik (API completa)
- Tu lógica actual de useClienteForm

**Testing:** Tests exhaustivos

#### 3.8. useFormState Hook (2 horas)

**Archivos a crear:**
- `src/hooks/state/useFormState.ts`

**Funcionalidad:**
- Estado interno de formulario
- Sin validación (más ligero)

**Testing:** Tests

#### 3.9. useFieldArray Hook (2 horas)

**Archivos a crear:**
- `src/hooks/state/useFieldArray.ts`

**Funcionalidad:**
```typescript
const { fields, append, remove, move } = useFieldArray({
  name: 'documentos'
});
```

**Testing:** Tests

---

### DÍA 7: UI State Hooks (migración de soluciones existentes)

#### 3.10. useUnsavedChanges Hook (2 horas)

**Archivos a migrar:**
- `src/hooks/forms/useUnsavedChanges.ts` → `src/hooks/state/useUnsavedChanges.ts`

**Mejoras:**
- Integrar con useForm
- Configuración de campos a ignorar
- Comparación profunda opcional

**Testing:** Tests mejorados

#### 3.11. useModalState Hook (2 horas)

**Archivos a migrar:**
- `src/hooks/ui/useModalState.ts` → `src/hooks/ui/useModalState.ts`

**Mejoras:**
- Tipado genérico mejorado
- Callbacks de lifecycle
- Stack de modales (opcional)

**Testing:** Tests

#### 3.12. useFormNotifications Hook (2 horas)

**Archivos a migrar:**
- `src/hooks/shared/useFormNotifications.ts` → `src/hooks/ui/useFormNotifications.ts`

**Mejoras:**
- Integración con useForm
- Queue de notificaciones
- Prioridades

**Testing:** Tests

#### 3.13. useInlineNotification Hook (2 horas)

**Archivos a migrar:**
- `src/hooks/ui/useInlineNotification.ts` → `src/hooks/ui/useInlineNotification.ts`

**Mejoras:**
- Auto-dismiss configurable
- Animaciones
- Posicionamiento

**Testing:** Tests

---

### DÍA 8: UI Components

#### 3.14. Modal Components (3 horas)

**Archivos a crear:**
- `src/components/Modal/Modal.tsx`
- `src/components/Modal/ModalHeader.tsx`
- `src/components/Modal/ModalBody.tsx`
- `src/components/Modal/ModalFooter.tsx`
- `src/components/Modal/ModalActions.tsx`

**Características:**
- Unsaved changes guard integrado
- Botones configurables
- Tailwind CSS
- Accesibilidad (ARIA)
- Focus trap
- Escape to close

**Testing:** Testing Library + a11y tests

#### 3.15. Form Components (3 horas)

**Archivos a crear:**
- `src/components/Form/Form.tsx`
- `src/components/Form/FormField.tsx`
- `src/components/Form/FormLabel.tsx`
- `src/components/Form/FormError.tsx`
- `src/components/Form/FormHint.tsx`

**Funcionalidad:**
```tsx
<Form onSubmit={form.handleSubmit}>
  <FormField label="Email" required error={form.errors.email}>
    <ValidatedInput
      name="email"
      value={form.values.email}
      onChange={form.handleChange}
    />
  </FormField>
</Form>
```

**Testing:** Testing Library

#### 3.16. Input Components (2 horas)

**Archivos a crear:**
- `src/components/Input/ValidatedInput.tsx`
- `src/components/Input/ValidatedTextarea.tsx`
- `src/components/Input/ValidatedSelect.tsx`
- `src/components/Input/ValidatedCheckbox.tsx`

**Funcionalidad:**
- Validación integrada
- Formateo automático
- Estados visuales (error, warning, success)
- Icons opcionales

**Testing:** Testing Library

---

## 🔄 FASE 4: Migración Gradual (Días 9-12)

### DÍA 9: Migrar useClienteForm

#### 4.1. Análisis de useClienteForm actual (1 hora)

**Identificar:**
- Qué lógica migrar
- Qué quedará deprecated
- Compatibilidad con componentes existentes

#### 4.2. Crear nuevo useClienteForm v2 (3 horas)

**Archivo:**
- `src/hooks/forms/useClienteForm.v2.ts`

**Usar:**
- `useForm` del paquete nuevo
- `clienteFormSchema` configurado
- Hooks de notificaciones nuevos

**Mantener API externa igual** (para no romper componentes)

**Testing:** Tests de integración

#### 4.3. Migrar FormValidator → Validators (2 horas)

**Crear wrapper temporal:**
```typescript
// FormValidator.ts (deprecated)
export class FormValidator {
  static validateEmail(email: string) {
    const validator = createEmailValidator();
    return validator.validate(email);
  }
  // ... más métodos
}
```

**Marcar como @deprecated**

**Testing:** Tests de compatibilidad

#### 4.4. Migrar fieldFormatters → Formatters (2 horas)

**Crear wrapper temporal:**
```typescript
// fieldFormatters.ts (deprecated)
export const formatCPF = (cpf: string) => {
  return cpfFormatter.format(cpf);
};
// ... más funciones
```

**Marcar como @deprecated**

**Testing:** Tests de compatibilidad

---

### DÍA 10: Migrar ClientesPage

#### 4.5. Adaptar ClientesPage (4 horas)

**Cambios:**
- Importar de paquetes nuevos
- Usar nuevos hooks
- Verificar funcionamiento

**Mantener:**
- Misma UI
- Mismo UX
- Sin breaking changes

**Testing:**
- Tests e2e con Playwright
- Tests de regresión manual

#### 4.6. Validar funcionamiento completo (2 horas)

**Checklist:**
- ✅ Crear cliente funciona
- ✅ Editar cliente funciona
- ✅ Validaciones funcionan
- ✅ Formateo funciona
- ✅ Detección de cambios funciona
- ✅ Notificaciones funcionan
- ✅ Errores se muestran correctamente

#### 4.7. Fix bugs encontrados (2 horas)

**Iterar hasta estable**

---

### DÍA 11: Migrar otros formularios

#### 4.8. useProcessoForm (3 horas)

**Repetir proceso:**
1. Crear v2 con paquetes nuevos
2. Migrar ProcessosPage
3. Testing
4. Fix bugs

#### 4.9. useAudienciaForm (3 horas)

**Repetir proceso similar**

#### 4.10. useUsuarioForm (2 horas)

**Repetir proceso similar**

---

### DÍA 12: Cleanup & Documentation

#### 4.11. Eliminar código deprecated (2 horas)

**Archivos a eliminar:**
- `FormValidator.ts` (viejo)
- `fieldFormatters.ts` (viejo)
- Hooks v1 deprecados

**Actualizar imports** en todo el proyecto

#### 4.12. Refactoring final (2 horas)

**Optimizar:**
- Imports
- Código duplicado restante
- Performance

#### 4.13. Documentation completa (4 horas)

**Crear:**
- README principal
- Guía de migración
- Ejemplos de uso
- API reference
- CHANGELOG completo

---

## 📚 FASE 5: Polish & Publish (Días 13-15)

### DÍA 13: Storybook (Opcional pero recomendado)

#### 5.1. Setup Storybook (2 horas)

**Configurar:**
- Storybook 7
- Tailwind CSS
- Addons (a11y, interactions)

#### 5.2. Stories de componentes (4 horas)

**Crear stories para:**
- Modal
- Form components
- Input components
- Notification components

#### 5.3. Interactive docs (2 horas)

**Documentación interactiva:**
- Props tables
- Actions
- Controls

---

### DÍA 14: Testing & CI/CD

#### 5.4. Tests de integración completos (3 horas)

**e2e tests:**
- Flujo completo de formulario
- Validaciones edge cases
- Performance tests

#### 5.5. Setup CI/CD (2 horas)

**GitHub Actions:**
```yaml
- Run linting
- Run type checking
- Run unit tests
- Run e2e tests
- Build packages
- Publish to npm (if tagged)
```

#### 5.6. Code coverage (1 hora)

**Objetivo:** > 80% coverage

#### 5.7. Performance audit (2 horas)

**Verificar:**
- Bundle size
- Runtime performance
- Memory leaks

---

### DÍA 15: Publish & Documentation

#### 5.8. Preparar para publicación (2 horas)

**Checklist:**
- ✅ Version numbers
- ✅ CHANGELOG updated
- ✅ README completo
- ✅ LICENSE file
- ✅ Package.json metadata
- ✅ Keywords para npm

#### 5.9. Publicar a npm (1 hora)

**Comandos:**
```bash
cd packages/form-validation
npm publish --access public

cd ../form-components
npm publish --access public
```

#### 5.10. Documentation site (3 horas)

**Opciones:**
- GitHub Pages
- Vercel
- Netlify

**Contenido:**
- Getting started
- API reference
- Examples
- Migration guide
- Storybook embebido

#### 5.11. Anuncio y marketing (2 horas)

**Compartir en:**
- README del proyecto
- GitHub releases
- Twitter/LinkedIn (opcional)
- Internal team docs

---

## 📊 RESUMEN DE TIEMPO ESTIMADO

| Fase | Duración | Descripción |
|------|----------|-------------|
| **Fase 1** | 0.5 días | Setup inicial |
| **Fase 2** | 3 días | @empresa/form-validation |
| **Fase 3** | 5 días | @empresa/form-components |
| **Fase 4** | 4 días | Migración gradual |
| **Fase 5** | 3 días | Polish & Publish |
| **TOTAL** | **15-16 días** | |

**Tiempo real:** 2-3 semanas con dedicación completa

---

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. ✅ **Aprobar este plan** (confirmado)
2. ⏭️ **Decidir nombre de paquetes**:
   - Opción 1: `@wilwso/form-validation` + `@wilwso/form-components`
   - Opción 2: `@advocacia/form-validation` + `@advocacia/form-components`
   - Opción 3: Otro nombre personalizado

3. ⏭️ **Decidir visibilidad npm**:
   - Privado (solo tus proyectos)
   - Público (community open source)

4. ⏭️ **Comenzar Fase 1**: Crear estructura

---

## ✅ DECISIONES TOMADAS

1. **Nombre de los paquetes:** `@wsolutions/form-validation` + `@wsolutions/form-components`
2. **Visibilidad:** Privados (por ahora, pueden publicarse después)
3. **Fase 1:** ✅ **COMPLETADA** (1 de Marzo de 2026)

---

## 🎉 FASE 1 COMPLETADA

### Estructura Creada:

```
packages/
├── form-validation/          ✅ Configurado
│   ├── src/                  ✅ Estructura de carpetas
│   ├── tests/                ✅ Setup de testing
│   ├── package.json          ✅ Con @wsolutions/form-validation
│   ├── tsconfig.json         ✅ TypeScript configurado
│   ├── tsup.config.ts        ✅ Build config
│   ├── vitest.config.ts      ✅ Testing config
│   ├── README.md             ✅ Documentación
│   └── LICENSE               ✅ MIT License
│
├── form-components/          ✅ Configurado
│   ├── src/                  ✅ Estructura de carpetas
│   ├── tests/                ✅ Setup de testing
│   ├── package.json          ✅ Con @wsolutions/form-components
│   ├── tsconfig.json         ✅ TypeScript configurado
│   ├── tsup.config.ts        ✅ Build config
│   ├── vitest.config.ts      ✅ Testing config
│   ├── README.md             ✅ Documentación
│   └── LICENSE               ✅ MIT License
│
├── README.md                 ✅ Documentación principal
└── SETUP_COMPLETE.md         ✅ Guía de próximos pasos
```

### Archivos Raíz:

```
pnpm-workspace.yaml           ✅ Workspace configurado
```

---

## ⏭️ PRÓXIMO: FASE 2

Ahora puedes proceder con la **Fase 2: Implementación de @wsolutions/form-validation** (Días 1-3)

### Comandos para empezar:

```bash
# 1. Instalar dependencias
pnpm install

# 2. Verificar que todo compile
cd packages/form-validation
pnpm run type-check

# 3. Iniciar desarrollo en watch mode
pnpm run dev
```

### Primera tarea de Fase 2:

Implementar los tipos básicos en `packages/form-validation/src/types/`:
- `validator.types.ts`
- `formatter.types.ts`
- `field.types.ts`

Ver detalles completos en la sección **FASE 2** arriba.
