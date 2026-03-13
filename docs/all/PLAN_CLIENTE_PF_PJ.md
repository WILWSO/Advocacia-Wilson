# 📋 PLAN ARQUITECTÓNICO: Cliente Pessoa Física / Pessoa Jurídica

## 🎯 OBJETIVO
Implementar sistema para diferenciar **Pessoa Física (PF)** y **Pessoa Jurídica (PJ)** en el formulario de clientes, con dinámica UI/UX y validaciones específicas para cada tipo.

---

## 🏗️ ARQUITECTURA BASADA EN PRINCIPIOS

### 🔹 SRP (Single Responsibility Principle)
- **Cada componente tiene UNA responsabilidad**:
  - Backend: Solo almacena `tipo_cliente`
  - Hook personalizado: Solo maneja lógica de fields mapping
  - Componente visual: Solo render condicional
  - Paquete forms: Solo validación y formateo

### 🔹 SSoT (Single Source of Truth)
- **Campo `tipo_cliente` es la ÚNICA fuente de verdad**
- **Mapeo de campos centralizado en UN SOLO lugar**
- **Configuración de labels centralizada**

### 🔹 DRY (Don't Repeat Yourself)
- **Hook reutilizable** para cualquier formulario que necesite PF/PJ
- **Mapeo declarativo** de configuraciones (no código repetido)
- **Componentes del paquete reutilizados** (CPFInput, CNPJInput)

### 🔹 KISS (Keep It Simple, Stupid)
- **Estado local simple**: Solo `tipo_cliente: 'PF' | 'PJ'`
- **Render condicional simple**: Un objeto de configuración
- **Sin over-engineering**: No crear abstracciones innecesarias

---

## 📊 DECISIÓN DE IMPLEMENTACIÓN

### ⚙️ A IMPLEMENTAR EN EL PROYECTO LOCAL (Advocacia-Wilson):
1. ✅ Campo `tipo_cliente` en tabla `clientes` (Backend/DB)
2. ✅ Tipo TypeScript `TipoCliente = 'PF' | 'PJ'`
3. ✅ Hook `useClientTypeFields` - lógica de mapeo de campos
4. ✅ Selector UI para tipo de cliente
5. ✅ Configuración declarativa de labels dinámicos
6. ✅ Lógica de visibilidad condicional de campos
7. ✅ Migración de datos existentes (default: 'PF')

### 📦 A REUTILIZAR DEL PAQUETE @wsolutions/form-components:
1. ✅ `CPFInput` (ya existe)
2. ✅ `CNPJInput` (ya existe)
3. ✅ `BrazilianPhoneInput` (ya existe)
4. ✅ `EmailInput` (ya existe)
5. ✅ Validadores y formatters brasileños

### 🚫 NO IMPLEMENTAR EN EL PAQUETE:
- Lógica de tipo de cliente (Es específica del dominio de este proyecto)
- Mapeo de campos CPF↔CNPJ (Es regla de negocio local)
- UI/UX del selector (No es reutilizable genericalmente)

**RAZÓN**: El paquete debe permanecer **genérico** y **reutilizable**. La lógica de "tipo de cliente" es **dominio específico** de tu sistema.

---

## 📐 DISEÑO DE SOLUCIÓN

### 1️⃣ BACKEND (Database Layer)

**Ubicación**: `database/migration-tipo-cliente.sql`

```sql
-- Agregar campo tipo_cliente a tabla clientes
ALTER TABLE clientes 
ADD COLUMN tipo_cliente VARCHAR(2) DEFAULT 'PF' CHECK (tipo_cliente IN ('PF', 'PJ'));

-- Índice para búsquedas por tipo
CREATE INDEX idx_clientes_tipo ON clientes(tipo_cliente);

-- Migración de datos existentes (todos PF por default)
UPDATE clientes SET tipo_cliente = 'PF' WHERE tipo_cliente IS NULL;

-- Comentarios
COMMENT ON COLUMN clientes.tipo_cliente IS 'Tipo de cliente: PF (Pessoa Física) ou PJ (Pessoa Jurídica)';
```

---

### 2️⃣ TYPES (Type System Layer)

**Ubicación**: `src/types/cliente.ts`

```typescript
/**
 * Tipo de cliente: Pessoa Física o Pessoa Jurídica
 */
export type TipoCliente = 'PF' | 'PJ';

/**
 * Interface principal para Cliente - ACTUALIZADA
 */
export interface Cliente extends BaseEntity {
  // Nuevo campo
  tipo_cliente: TipoCliente; // REQUIRED - Single Source of Truth
  
  // Información Personal (campos existentes)
  nome_completo: string
  cpf_cnpj?: string
  rg?: string
  // ... resto de campos
}
```

---

### 3️⃣ HOOK DE CONFIGURACIÓN (Business Logic Layer)

**Ubicación**: `src/hooks/cliente/useClientTypeFields.ts`

**Responsabilidad**: Configuración declarativa de campos según tipo de cliente

```typescript
import { TipoCliente } from '@/types/cliente';

/**
 * Configuración de campo dinámico
 */
interface FieldConfig {
  label: string;
  placeholder?: string;
  component: 'CPFInput' | 'CNPJInput' | 'text' | 'date';
  required?: boolean;
  visible: boolean;
}

/**
 * Hook para obtener configuración de campos según tipo de cliente
 * 
 * @principle SRP - Solo responsable de mapear configuraciones
 * @principle SSoT - Centraliza TODA la lógica de mapeo en un lugar
 * @principle DRY - Reutilizable en cualquier formulario de cliente
 */
export function useClientTypeFields(tipoCliente: TipoCliente) {
  const fieldsConfig = {
    // Campo dinámico: CPF/CNPJ
    cpf_cnpj: {
      label: tipoCliente === 'PF' ? 'CPF' : 'CNPJ',
      placeholder: tipoCliente === 'PF' ? '000.000.000-00' : '00.000.000/0000-00',
      component: tipoCliente === 'PF' ? 'CPFInput' : 'CNPJInput',
      required: false,
      visible: true,
    } as FieldConfig,
    
    // Campo dinámico: Nome Completo / Razão Social
    nome_completo: {
      label: tipoCliente === 'PF' ? 'Nome Completo' : 'Razão Social',
      placeholder: tipoCliente === 'PF' ? 'Nome completo do cliente' : 'Razão social da empresa',
      component: 'text',
      required: true,
      visible: true,
    } as FieldConfig,
    
    // Campo dinámico: RG / Inscrição Estadual
    rg: {
      label: tipoCliente === 'PF' ? 'RG' : 'Inscrição Estadual',
      placeholder: tipoCliente === 'PF' ? 'RG' : 'Inscrição Estadual',
      component: 'text',
      required: false,
      visible: true,
    } as FieldConfig,
    
    // Campo dinámico: Data de Nascimento / Início das Atividades
    data_nascimento: {
      label: tipoCliente === 'PF' ? 'Data de Nascimento' : 'Início das Atividades',
      placeholder: '',
      component: 'date',
      required: false,
      visible: true,
    } as FieldConfig,
    
    // Campo condicional: Estado Civil (SOLO PF)
    estado_civil: {
      label: 'Estado Civil',
      placeholder: 'Selecione',
      component: 'select',
      required: false,
      visible: tipoCliente === 'PF', // 🔹 SSoT: Una sola expresión define visibilidad
    } as FieldConfig,
    
    // Campo dinámico: Nacionalidade / Natureza Jurídica
    nacionalidade: {
      label: tipoCliente === 'PF' ? 'Nacionalidade' : 'Natureza Jurídica',
      placeholder: tipoCliente === 'PF' ? 'Ex: Brasileiro' : 'Ex: Sociedade Limitada',
      component: 'text',
      required: false,
      visible: true,
    } as FieldConfig,
    
    // Campo dinámico: Profissão / Atividade Principal
    profissao: {
      label: tipoCliente === 'PF' ? 'Profissão' : 'Atividade Principal',
      placeholder: tipoCliente === 'PF' ? 'Profissão' : 'Atividade principal da empresa',
      component: 'text',
      required: false,
      visible: true,
    } as FieldConfig,
  };
  
  return fieldsConfig;
}
```

---

### 4️⃣ COMPONENTE SELECTOR (UI Component Layer)

**Ubicación**: `src/components/domain/ClientTypeSelector.tsx`

**Responsabilidade**: Apenas renderizar selector visual

```tsx
import React from 'react';
import { TipoCliente } from '@/types/cliente';
import { User, Building2 } from 'lucide-react';

interface ClientTypeSelectorProps {
  value: TipoCliente;
  onChange: (tipo: TipoCliente) => void;
  disabled?: boolean;
}

/**
 * Selector de tipo de cliente (Pessoa Física/Jurídica)
 * 
 * @principle SRP - Solo responsable de renderizar el selector
 * @principle KISS - Implementación simple con botones
 */
export function ClientTypeSelector({ value, onChange, disabled }: ClientTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">
        Tipo de Cliente
      </label>
      
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => !disabled && onChange('PF')}
          disabled={disabled}
          className={`
            flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all
            ${value === 'PF' 
              ? 'border-primary-500 bg-primary-50 text-primary-700' 
              : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <User size={20} />
          <span className="font-medium">Pessoa Física</span>
        </button>
        
        <button
          type="button"
          onClick={() => !disabled && onChange('PJ')}
          disabled={disabled}
          className={`
            flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all
            ${value === 'PJ' 
              ? 'border-primary-500 bg-primary-50 text-primary-700' 
              : 'border-neutral-300 bg-white text-neutral-600 hover:border-neutral-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Building2 size={20} />
          <span className="font-medium">Pessoa Jurídica</span>
        </button>
      </div>
    </div>
  );
}
```

---

### 5️⃣ INTEGRACIÓN EN FORMULARIO (Feature Layer)

**Ubicación**: `src/pages/ClientesPage.tsx` (modificaciones)

**Cambios necesarios**:

1. **Agregar estado de tipo_cliente al formData**
2. **Usar el hook useClientTypeFields**
3. **Renderizar selector**
4. **Aplicar configuración dinámica a campos**

```tsx
// En ClientesPage.tsx

// 1. Importar nuevos elementos
import { ClientTypeSelector } from '@/components/domain/ClientTypeSelector';
import { useClientTypeFields } from '@/hooks/cliente/useClientTypeFields';
import { CNPJInput } from '@wsolutions/form-components';

// 2. Dentro del formulario modal:

{/* NUEVO: Selector de Tipo de Cliente - PRIMERO EN EL FORMULARIO */}
<div className="mb-6 p-4 bg-neutral-50 rounded-lg">
  <ClientTypeSelector
    value={clienteForm.formData.tipo_cliente || 'PF'}
    onChange={(tipo) => clienteForm.handleFormChange({
      ...clienteForm.formData, 
      tipo_cliente: tipo,
      // Limpiar estado_civil si cambia a PJ
      ...(tipo === 'PJ' ? { estado_civil: undefined } : {})
    })}
    disabled={!clienteForm.isAdmin && clienteForm.editingCliente !== null}
  />
</div>

{/* INFORMACIÓN PERSONAL - Con campos dinámicos */}
<div>
  <h3 className="text-base sm:text-lg font-semibold text-neutral-700 mb-4 flex items-center gap-2">
    <User size={18} />
    Informações {fieldsConfig.nome_completo.label.includes('Razão') ? 'da Empresa' : 'Pessoais'}
  </h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Nome Completo / Razão Social - Dinámico */}
    <div className="md:col-span-2">
      <RestrictedInput
        label={fieldsConfig.nome_completo.label}
        placeholder={fieldsConfig.nome_completo.placeholder}
        type="text"
        required={fieldsConfig.nome_completo.required}
        value={clienteForm.formData.nome_completo}
        onChange={(e) => clienteForm.handleFormChange({
          ...clienteForm.formData, 
          nome_completo: e.target.value
        })}
        isRestricted={!clienteForm.isAdmin && clienteForm.editingCliente !== null}
      />
    </div>
    
    {/* CPF/CNPJ - Dinámico con componente condicional */}
    <div>
      {fieldsConfig.cpf_cnpj.component === 'CPFInput' ? (
        <CPFInput
          key={`cpf-${clienteForm.editingCliente?.id || 'new'}`}
          name="cpf_cnpj"
          label={fieldsConfig.cpf_cnpj.label}
          placeholder={fieldsConfig.cpf_cnpj.placeholder}
          initialValue={clienteForm.formData.cpf_cnpj || ''}
          onChange={(_, __, clean) => clienteForm.handleFormChange({
            ...clienteForm.formData, 
            cpf_cnpj: clean
          })}
          inputClassName="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          labelClassName="block text-sm font-medium text-neutral-700 mb-2"
          errorClassName="text-sm text-red-600 mt-1"
        />
      ) : (
        <CNPJInput
          key={`cnpj-${clienteForm.editingCliente?.id || 'new'}`}
          name="cpf_cnpj"
          label={fieldsConfig.cpf_cnpj.label}
          placeholder={fieldsConfig.cpf_cnpj.placeholder}
          initialValue={clienteForm.formData.cpf_cnpj || ''}
          onChange={(_, __, clean) => clienteForm.handleFormChange({
            ...clienteForm.formData, 
            cpf_cnpj: clean
          })}
          inputClassName="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          labelClassName="block text-sm font-medium text-neutral-700 mb-2"
          errorClassName="text-sm text-red-600 mt-1"
        />
      )}
    </div>
    
    {/* RG / Inscrição Estadual - Dinámico */}
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        {fieldsConfig.rg.label}
      </label>
      <input
        type="text"
        placeholder={fieldsConfig.rg.placeholder}
        value={clienteForm.formData.rg || ''}
        onChange={(e) => clienteForm.handleFormChange({
          ...clienteForm.formData, 
          rg: e.target.value
        })}
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    </div>
    
    {/* Data Nascimento / Início Atividades - Dinámico */}
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        {fieldsConfig.data_nascimento.label}
      </label>
      <input
        type="date"
        value={clienteForm.formData.data_nascimento || ''}
        onChange={(e) => clienteForm.handleFormChange({
          ...clienteForm.formData, 
          data_nascimento: e.target.value
        })}
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    </div>
    
    {/* Estado Civil - Solo PF (Condicional) */}
    {fieldsConfig.estado_civil.visible && (
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {fieldsConfig.estado_civil.label}
        </label>
        <select
          value={clienteForm.formData.estado_civil || ''}
          onChange={(e) => clienteForm.handleFormChange({
            ...clienteForm.formData, 
            estado_civil: e.target.value === '' ? undefined : e.target.value as Cliente['estado_civil']
          })}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="">Selecione</option>
          <option value="solteiro">Solteiro(a)</option>
          <option value="casado">Casado(a)</option>
          <option value="divorciado">Divorciado(a)</option>
          <option value="viuvo">Viúvo(a)</option>
          <option value="uniao_estavel">União Estável</option>
        </select>
      </div>
    )}
    
    {/* Profissão / Atividade Principal - Dinámico */}
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        {fieldsConfig.profissao.label}
      </label>
      <input
        type="text"
        placeholder={fieldsConfig.profissao.placeholder}
        value={clienteForm.formData.profissao || ''}
        onChange={(e) => clienteForm.handleFormChange({
          ...clienteForm.formData, 
          profissao: e.target.value
        })}
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    </div>
    
    {/* Nacionalidade / Natureza Jurídica - Dinámico */}
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        {fieldsConfig.nacionalidade.label}
      </label>
      <input
        type="text"
        placeholder={fieldsConfig.nacionalidade.placeholder}
        value={clienteForm.formData.nacionalidade || ''}
        onChange={(e) => clienteForm.handleFormChange({
          ...clienteForm.formData, 
          nacionalidade: e.target.value
        })}
        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
    </div>
  </div>
</div>
```

---

### 6️⃣ ACTUALIZAR HOOK useClienteForm (State Management)

**Ubicación**: `src/hooks/cliente/useClienteForm.ts`

**Cambios**:

```typescript
// Dentro de useClienteForm:

const fieldsConfig = useClientTypeFields(formData.tipo_cliente || 'PF');

// Cuando se abre el modal para editar:
const handleEdit = (cliente: Cliente) => {
  setFormData({
    ...cliente,
    tipo_cliente: cliente.tipo_cliente || 'PF', // Default PF si no existe
  });
  setEditingCliente(cliente);
  setShowModal(true);
};

// Cuando se abre el modal para crear:
const handleCreate = () => {
  setFormData({
    nome_completo: '',
    celular: '',
    status: 'ativo',
    tipo_cliente: 'PF', // 🔹 Default: Pessoa Física
  });
  setEditingCliente(null);
  setShowModal(true);
};
```

---

## 🧪 CASOS DE USO Y VALIDACIONES

### Caso 1: Crear nuevo cliente PF
1. Usuario abre modal → Default: `tipo_cliente = 'PF'`
2. Labels aparecen: "CPF", "Nome Completo", "RG", "Data de Nascimento", etc.
3. Estado Civil es visible
4. Componente CPFInput renderizado
5. Al guardar → Valida CPF + guarda `tipo_cliente = 'PF'`

### Caso 2: Cambiar de PF a PJ durante creación
1. Usuario hace click en botón "Pessoa Jurídica"
2. Hook `useClientTypeFields` recalcula configuración
3. Labels cambian a: "CNPJ", "Razão Social", "Inscrição Estadual", etc.
4. Estado Civil desaparece (y se limpia en formData)
5. Componente CNPJInput renderizado
6. Al guardar → Valida CNPJ + guarda `tipo_cliente = 'PJ'`

### Caso 3: Editar cliente existente
1. Al abrir modal → Lee `cliente.tipo_cliente` del DB
2. Si es 'PJ' → Renderiza campos de empresa
3. Si es 'PF' → Renderiza campos de persona
4. Selector puede cambiar tipo (lógica igual que creación)

### Caso 4: Migración de datos legacy
- Todos los clientes existentes (sin `tipo_cliente`) → Default `'PF'`
- Al editarlos, admin puede cambiar a PJ si corresponde

---

## 📦 ESTRUCTURA DE ARCHIVOS

```
Advocacia-Wilson/
│
├── database/
│   └── migration-tipo-cliente.sql ← NUEVO
│
├── src/
│   ├── types/
│   │   └── cliente.ts ← MODIFICAR (agregar TipoCliente)
│   │
│   ├── hooks/
│   │   └── cliente/
│   │       ├── useClienteForm.ts ← MODIFICAR
│   │       └── useClientTypeFields.ts ← NUEVO
│   │
│   ├── components/
│   │   └── domain/
│   │       └── ClientTypeSelector.tsx ← NUEVO
│   │
│   └── pages/
│       └── ClientesPage.tsx ← MODIFICAR
│
└── packages/ (NO MODIFICAR - Ya tiene todo lo necesario)
    ├── form-components/
    │   └── src/components/domain/brazilian/
    │       ├── CPFInput.tsx ✅
    │       └── CNPJInput.tsx ✅
    │
    └── form-validation/
        ├── validators/brazilian/
        │   ├── cpf.validator.ts ✅
        │   └── cnpj.validator.ts ✅
        └── formatters/brazilian/
            ├── cpf.formatter.ts ✅
            └── cnpj.formatter.ts ✅
```

---

## 🔄 FLUJO DE DATOS

```
┌─────────────────────────────────────────────────────────────┐
│                    SINGLE SOURCE OF TRUTH                    │
│                   campo: tipo_cliente (DB)                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              useClienteForm (State Management)               │
│             formData.tipo_cliente: 'PF' | 'PJ'              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│          useClientTypeFields(tipo_cliente) - Hook           │
│        📋 Retorna configuración declarativa de campos       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                ClientesPage (Presentation)                   │
│          🎨 Renderiza campos según configuración            │
│  ┌──────────────┐      ┌──────────────┐                   │
│  │ Tipo = 'PF'  │      │ Tipo = 'PJ'  │                   │
│  │              │      │              │                   │
│  │ CPFInput     │      │ CNPJInput    │                   │ 
│  │ Nome Completo│      │ Razão Social │                   │
│  │ RG           │      │ Insc. Estadual│                  │
│  │ Estado Civil │      │ (hidden)     │                   │
│  │ Profissão    │      │ Atividade    │                   │
│  └──────────────┘      └──────────────┘                   │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│     @wsolutions/form-components (Reutilizable Package)      │
│     ✅ CPFInput + CNPJInput (validators + formatters)       │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### FASE 1: Backend (Database) 🗄️
- [ ] Crear migration `database/migration-tipo-cliente.sql`
- [ ] Ejecutar migration en Supabase
- [ ] Verificar campo creado con `SELECT * FROM clientes LIMIT 1`
- [ ] Verificar migración de datos existentes a 'PF'

### FASE 2: Types (TypeScript) 📘
- [ ] Agregar `export type TipoCliente = 'PF' | 'PJ'` en `cliente.ts`
- [ ] Agregar `tipo_cliente: TipoCliente` a interface `Cliente`
- [ ] Agregar campo a `ClienteFormData`
- [ ] Verificar errores de TypeScript (`tsc --noEmit`)

### FASE 3: Business Logic (Hooks) 🔧
- [ ] Crear hook `useClientTypeFields.ts`
- [ ] Implementar mapeo declarativo de configuraciones
- [ ] Testear retorno del hook con ambos tipos
- [ ] Actualizar `useClienteForm.ts`:
  - [ ] Agregar `tipo_cliente: 'PF'` en formData inicial
  - [ ] Limpiar `estado_civil` cuando cambia a 'PJ'
  - [ ] Asegurar default 'PF' al editar clientes legacy

### FASE 4: UI Components (Visual Layer) 🎨
- [ ] Crear `ClientTypeSelector.tsx`
- [ ] Testear visualmente ambos estados (PF/PJ)
- [ ] Verificar estilos responsivos
- [ ] Testear estado disabled

### FASE 5: Integration (Feature) 🔗
- [ ] Importar `CNPJInput` en `ClientesPage.tsx`
- [ ] Agregar `ClientTypeSelector` al inicio del formulario
- [ ] Obtener `fieldsConfig` del hook
- [ ] Aplicar labels dinámicos a todos los campos
- [ ] Implementar render condicional CPFInput/CNPJInput
- [ ] Implementar visibilidad condicional de Estado Civil
- [ ] Testear cambio de tipo en modo creación
- [ ] Testear cambio de tipo con datos existentes (debe limpiar estado_civil)

### FASE 6: Testing (Quality Assurance) ✅
- [ ] **Crear PF**: Verificar labels, validación CPF, estado civil visible
- [ ] **Crear PJ**: Verificar labels, validación CNPJ, estado civil oculto
- [ ] **Cambiar PF→PJ**: Verificar limpieza de estado_civil
- [ ] **Cambiar PJ→PF**: Verificar todos los campos visibles
- [ ] **Editar PF existente**: Verificar carga correcta
- [ ] **Editar PJ existente**: Verificar carga correcta
- [ ] **Migración legacy**: Editar cliente antiguo → debe mostrar PF
- [ ] **Validación**: Digitar CPF inválido en PF → debe mostrar error
- [ ] **Validación**: Digitar CNPJ inválido en PJ → debe mostrar error
- [ ] **Formato**: Verificar formato automático en blur
- [ ] **DB Storage**: Verificar que guarda solo dígitos limpios

### FASE 7: Documentation & Git 📝
- [ ] Documentar cambios en este plan
- [ ] Commit migration: "feat(db): add tipo_cliente field"
- [ ] Commit types: "feat(types): add TipoCliente type"
- [ ] Commit hook: "feat(hooks): add useClientTypeFields"
- [ ] Commit component: "feat(components): add ClientTypeSelector"
- [ ] Commit integration: "feat(clientes): implement PF/PJ dynamic fields"

---

## 🎓 PRINCIPIOS APLICADOS - RESUMEN

| Principio | Aplicación en el Diseño |
|-----------|-------------------------|
| **SRP** | Cada capa tiene una responsabilidad: DB → Types → Hook → UI |
| **SSoT** | `tipo_cliente` es la ÚNICA fuente que determina el comportamiento |
| **DRY** | Hook centraliza configuración, no se repite lógica de mapeo |
| **KISS** | Estado simple (string 'PF'/'PJ'), sin abstracciones complejas |
| **Separation of Concerns** | Paquete genérico ≠ Lógica de negocio específica |
| **Scalability** | Fácil agregar nuevos tipos en el futuro |
| **Maintainability** | Cambio en labels → solo modificar hook |
| **Reusability** | Hook puede usarse en otros formularios del sistema |

---

## 📌 RECOMENDACIONES FINALES

### ✅ RECOMIENDO (Mi sugerencia):
1. **Implementar en proyecto local** (no en paquete) - Todo el sistema PF/PJ
2. **Usar enum/select** en lugar de booleano para tipo_cliente (más escalable)
3. **Default 'PF'** para todos los clientes existentes
4. **Validación en frontend Y backend** (nunca confiar solo en cliente)
5. **Migración gradual**: No forzar cambio en clientes existentes hasta edición

### ⚠️ CONSIDERACIONES:
- **Performance**: Hook recalcula en cada re-render → usar `useMemo` si es necesario
- **Validación DB**: Agregar constraint CHECK para forzar 'PF' o 'PJ'
- **Reporting**: Futuras queries pueden filtrar por `tipo_cliente`
- **Audit Trail**: Considerar registrar cuando se cambia tipo de cliente (auditoría)

---

## 🚀 DECISIÓN FINAL: TÚ DECIDES

**Opciones:**

**A)** Seguir este plan exactamente como está ✅ (Recomendado)

**B)** Modificar algo específico del plan (especifica qué)

**C)** Posponer implementación

**D)** Implementar algo del paquete de otra forma

---

¿Qué decides? 🎯
