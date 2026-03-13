# Comparación de Sistemas de Botones: Legacy vs SSoT vs Híbrido

## 📊 Resumen Ejecutivo

Este documento compara tres sistemas de botones en el proyecto:
1. **Legacy**: AccessibleButton + buttonCategories (sistema antiguo)
2. **SSoT**: BaseButtons (sistema nuevo sin categorías)
3. **Híbrido**: BaseButtons + CategoryButton (sistema nuevo CON categorías)

---

## 🎯 Sistema Legacy (AccessibleButton)

### Ubicación
- `src/components/shared/buttons/AccessibleButton.tsx`
- `src/components/shared/buttons/buttonCategories.ts`

### Características
```tsx
// Uso típico
<AccessibleButton 
  category="save"
  size="lg"
  isLoading={loading}
>
  Salvar Cliente
</AccessibleButton>
```

**Ventajas:**
- ✅ Muy breve - 1 prop `category`
- ✅ Cambios globales en `buttonCategories.ts`
- ✅ 11 categorías predefinidas
- ✅ Iconos automáticos

**Desventajas:**
- ❌ Mezcla props `category` y `variant`
- ❌ Un solo componente para todo
- ❌ No separa responsabilidades
- ❌ Importa desde `config/theme.ts` pero define own categories

**Usado en:**
- ClientesPage
- ProcessosPage
- UsuariosPage
- AgendaPage
- SocialPage

---

## 🎨 Sistema SSoT Original (BaseButtons sin categorías)

### Ubicación
- `src/components/shared/BaseButtons.tsx` (versión original)

### Características
```tsx
// 4 componentes especializados

// 1. BaseButton - genérico
<BaseButton variant="primary" icon={<Save />}>
  Salvar
</BaseButton>

// 2. IconButton - solo ícono
<IconButton icon="edit" label="Editar" />

// 3. ActionButton - con confirmación
<ActionButton action="delete" onConfirm={handleDelete} />

// 4. LinkButton - enlaces
<LinkButton href="/page" variant="primary">Ver más</LinkButton>
```

**Ventajas:**
- ✅ Separación de responsabilidades
- ✅ ActionButton con confirmación integrada
- ✅ IconButton optimizado
- ✅ ButtonGroup para layouts
- ✅ Integra hooks SSoT

**Desventajas:**
- ❌ Más verboso - muchas props
- ❌ Sin sistema de categorías
- ❌ Repetir variant + icon
- ❌ Cambio global = buscar/reemplazar

**Usado en:**
- DemoSSoTPage (solo)

---

## ⚡ Sistema Híbrido (NUEVO - Opción 1)

### Ubicación
- `src/components/shared/BaseButtons.tsx` (con CategoryButton)
- `src/components/shared/buttonCategories.ts` (nuevo SSoT)

### Características

#### Método 1: CategoryButton (Recomendado)
```tsx
<CategoryButton category="save">
  Salvar Cliente
</CategoryButton>

// Con override
<CategoryButton category="save" variant="success" size="lg">
  Guardar Cambios
</CategoryButton>
```

#### Método 2: Hook useCategoryButton
```tsx
const config = useCategoryButton('save')
<BaseButton {...config}>Salvar</BaseButton>
```

#### Método 3: BaseButton manual (máximo control)
```tsx
<BaseButton 
  variant="primary" 
  icon={<Save size={18} />}
  loading={isSubmitting}
>
  Salvar Cliente
</BaseButton>
```

### Configuración Centralizada
```typescript
// src/components/shared/buttonCategories.ts
export const BUTTON_CATEGORY_CONFIG = {
  save: {
    variant: 'primary',
    icon: <Save size={18} />,
    label: 'Salvar'
  },
  delete: {
    variant: 'danger',
    icon: <Trash2 size={18} />,
    label: 'Excluir',
    confirmMessage: 'Tem certeza?'
  }
  // ... 11 categorías total
}
```

**Ventajas:**
- ✅ **Lo mejor de ambos mundos**
- ✅ Breve como legacy (`category="save"`)
- ✅ Arquitectura SSoT (4 componentes especializados)
- ✅ Cambios globales en 1 archivo
- ✅ Permite overrides cuando necesario
- ✅ Type-safe con TypeScript
- ✅ Mantiene ActionButton, IconButton, etc
- ✅ Zero breaking changes

**Desventajas:**
- ⚠️ Agrega 1 archivo nuevo (`buttonCategories.ts`)
- ⚠️ Requiere aprender nuevo componente `CategoryButton`

---

## 📈 Comparación de Código

### Caso: Botón "Salvar" en modal

#### Legacy (AccessibleButton)
```tsx
<AccessibleButton
  category="save"
  size="lg"
  isLoading={isSubmitting}
  disabled={!hasChanges}
>
  Salvar Cliente
</AccessibleButton>
```
**Props:** 4 | **Líneas:** 6 | **Imports:** 1

---

#### SSoT Original (BaseButton)
```tsx
<BaseButton
  variant="primary"
  icon={<Save size={18} />}
  size="lg"
  loading={isSubmitting}
  disabled={!hasChanges}
>
  Salvar Cliente
</BaseButton>
```
**Props:** 6 | **Líneas:** 8 | **Imports:** 2

---

#### Híbrido (CategoryButton)
```tsx
<CategoryButton
  category="save"
  size="lg"
  loading={isSubmitting}
  disabled={!hasChanges}
>
  Salvar Cliente
</CategoryButton>
```
**Props:** 4 | **Líneas:** 6 | **Imports:** 1

✅ **GANADOR: Híbrido** - misma brevedad que legacy + arquitectura SSoT

---

## 🔄 Migración de ClientesPage

### Ejemplo Real: Botón "Novo Cliente"

#### Antes (Legacy)
```tsx
import AccessibleButton from '../components/shared/buttons/AccessibleButton'

<AccessibleButton
  category="create"
  size="lg"
  onClick={() => setIsCreating(true)}
>
  <Plus className="w-5 h-5 mr-2" />
  Novo Cliente
</AccessibleButton>
```

#### Después (Híbrido)
```tsx
import { CategoryButton } from '@/components/shared'

<CategoryButton
  category="create"
  size="lg"
  onClick={() => setIsCreating(true)}
>
  Novo Cliente
</CategoryButton>
```

**Cambios:**
- ✅ Import path más corto
- ✅ Ícono automático (no need `<Plus />`)
- ✅ Misma API, mejor arquitectura

---

## 📊 Tabla Comparativa Final

| Característica | Legacy | SSoT Original | Híbrido ⭐ |
|---------------|--------|---------------|-----------|
| **Brevedad** | 🟢 Excelente | 🔴 Verboso | 🟢 Excelente |
| **Arquitectura** | 🟡 1 componente | 🟢 4 componentes | 🟢 5 componentes |
| **Categorías** | ✅ 11 categorías | ❌ No | ✅ 11 categorías |
| **Cambio global** | ✅ 1 archivo | ❌ Muchos | ✅ 1 archivo |
| **Separación responsabilidades** | ❌ No | ✅ Sí | ✅ Sí |
| **Overrides** | ⚠️ Confuso | ✅ Claro | ✅ Claro |
| **Confirmación integrada** | ❌ No | ✅ ActionButton | ✅ ActionButton |
| **Type safety** | ✅ Sí | ✅ Sí | ✅ Sí |
| **Bundle size** | 🟢 ~8KB | 🟡 ~15KB | 🟡 ~16KB |
| **Learning curve** | 🟢 Fácil | 🟡 Media | 🟢 Fácil |
| **Mantenibilidad** | 🟡 Buena | 🟡 Buena | 🟢 Excelente |

---

## 🎯 Recomendación Final

### ✅ Usar Sistema Híbrido para:
- ✅ Nuevas páginas (migración a SSoT)
- ✅ Cuando necesitas brevedad de categorías
- ✅ Cuando necesitas ActionButton/IconButton
- ✅ Proyectos que valoran DRY

### 📝 Guía de Uso

**1. Botones comunes (create, save, delete, etc):**
```tsx
<CategoryButton category="save">Salvar</CategoryButton>
```

**2. Botones con acciones confirmables:**
```tsx
<ActionButton action="delete" onConfirm={handleDelete} />
```

**3. Solo ícono en toolbar:**
```tsx
<IconButton icon="edit" label="Editar" onClick={handleEdit} />
```

**4. Control total personalizado:**
```tsx
<BaseButton variant="primary" icon={<CustomIcon />} loading={true}>
  Custom Action
</BaseButton>
```

---

## 📦 Migración Paso a Paso

### ClientesPage → Sistema Híbrido

1. **Actualizar imports:**
```tsx
// Antes
import AccessibleButton from '../components/shared/buttons/AccessibleButton'

// Después
import { CategoryButton, ActionButton } from '@/components/shared'
```

2. **Reemplazar botones comunes:**
```tsx
// Antes
<AccessibleButton category="create" />

// Después
<CategoryButton category="create" />
```

3. **Reemplazar botones de acción:**
```tsx
// Antes
<AccessibleButton 
  category="delete"
  onClick={() => {
    if (confirm('¿Eliminar?')) handleDelete()
  }}
/>

// Después
<ActionButton 
  action="delete"
  onConfirm={handleDelete}
/>
```

4. **Verificar y ajustar:**
- Probar estados loading
- Verificar disabled
- Validar iconos

**Tiempo estimado:** 45 minutos
**Archivos afectados:** 1 (ClientesPage.tsx)
**Riesgo:** Bajo (misma API)

---

## 🚀 Próximos Pasos

1. ✅ Sistema híbrido implementado
2. ⏳ Actualizar DemoSSoTPage con ejemplos
3. ⏳ Migrar ClientesPage
4. ⏳ Migrar ProcessosPage
5. ⏳ Migrar UsuariosPage
6. ⏳ Deprecar AccessibleButton legacy
7. ⏳ Remover buttonCategories.ts antiguo

---

## 📚 Referencias

- [BaseButtons.tsx](../src/components/shared/BaseButtons.tsx)
- [buttonCategories.ts](../src/components/shared/buttonCategories.ts)
- [DemoSSoTPage.tsx](../src/pages/DemoSSoTPage.tsx)
- [BUTTON_CATEGORIES.md](./BUTTON_CATEGORIES.md) (legacy)

---

**Autor:** Sistema SSoT
**Fecha:** 7 de febrero de 2026
**Versión:** 1.0.0
