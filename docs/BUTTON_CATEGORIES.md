# Sistema de Categorías de Botones

## Descripción

Sistema centralizado para gestionar estilos de botones por categoría. Permite cambiar el estilo de todos los botones de una categoría en un solo lugar.

## Categorías Disponibles

- **`create`** - Crear nuevos registros (Novo Processo, Novo Cliente)
- **`save`** - Guardar cambios
- **`edit`** - Editar registros existentes
- **`delete`** - Eliminar/acciones destructivas
- **`cancel`** - Cancelar acciones
- **`view`** - Ver detalles
- **`close`** - Cerrar modales/diálogos
- **`submit`** - Enviar formularios
- **`download`** - Descargar archivos
- **`upload`** - Subir archivos

## Uso Básico

### Con Categoría (Recomendado)

```tsx
import AccessibleButton from '../components/shared/AccessibleButton';

// Botón de crear - usa configuración centralizada
<AccessibleButton category="create" onClick={handleCreate}>
  Novo Cliente
</AccessibleButton>

// Botón de guardar
<AccessibleButton category="save" onClick={handleSave}>
  Salvar
</AccessibleButton>

// Botón de eliminar
<AccessibleButton category="delete" onClick={handleDelete}>
  Excluir
</AccessibleButton>

// Botón de cancelar
<AccessibleButton category="cancel" onClick={handleCancel}>
  Cancelar
</AccessibleButton>
```

### Personalización Individual

Si necesitas un botón que NO siga la configuración de la categoría:

```tsx
// Sobrescribir variant de categoría
<AccessibleButton 
  category="create" 
  variant="secondary"  // Tiene prioridad sobre la categoría
  onClick={handleCreate}
>
  Novo Cliente
</AccessibleButton>

// Sobrescribir icono de categoría
<AccessibleButton 
  category="save" 
  leftIcon={<CustomIcon />}  // Reemplaza el icono de la categoría
  onClick={handleSave}
>
  Salvar
</AccessibleButton>

// Usar solo variant sin categoría (modo legacy)
<AccessibleButton 
  variant="primary" 
  leftIcon={<Plus />}
  onClick={handleAction}
>
  Ação Personalizada
</AccessibleButton>
```

## Configuración Global

Para cambiar el estilo de TODOS los botones de una categoría:

1. Abre `src/config/buttonCategories.ts`
2. Modifica la configuración de la categoría deseada

### Ejemplo: Cambiar todos los botones "create" a color gold

```typescript
// En src/config/buttonCategories.ts

create: {
  variant: 'secondary',  // secondary = gold
  icon: Plus,
  defaultLabel: 'Criar'
}
```

### Ejemplo: Cambiar todos los botones "save" a outline

```typescript
// En src/config/buttonCategories.ts

save: {
  variant: 'outline',  // Cambia de primary a outline
  icon: Save,
  defaultLabel: 'Salvar'
}
```

### Ejemplo: Cambiar icono de categoría "create"

```typescript
// En src/config/buttonCategories.ts

import { PlusCircle } from 'lucide-react';

create: {
  variant: 'primary',
  icon: PlusCircle,  // Cambia de Plus a PlusCircle
  defaultLabel: 'Criar'
}
```

## Variantes Disponibles

- `primary` - Azul principal
- `secondary` - Dorado/gold
- `outline` - Borde sin relleno
- `ghost` - Transparente con hover
- `danger` - Rojo para acciones destructivas
- `warning` - Amber/amarillo para advertencias

## Prioridad de Configuración

1. **`variant` prop** - Mayor prioridad (personalización individual)
2. **`category` config** - Usa configuración centralizada
3. **Default** - `variant='primary'` si no se especifica nada

## Ejemplos Completos

### Botón de Crear con todas las opciones

```tsx
<AccessibleButton
  category="create"
  size="lg"
  onClick={handleCreate}
  aria-label="Criar novo registro"
  className="w-full sm:w-auto"
>
  Novo Registro
</AccessibleButton>
```

### Botón de Guardar con loading

```tsx
<AccessibleButton
  category="save"
  isLoading={isSaving}
  loadingText="Salvando..."
  onClick={handleSave}
>
  Salvar Alterações
</AccessibleButton>
```

### Botón de Eliminar con confirmación

```tsx
<AccessibleButton
  category="delete"
  onClick={() => {
    if (confirm('Deseja realmente excluir?')) {
      handleDelete();
    }
  }}
>
  Excluir
</AccessibleButton>
```

### Botón personalizado que NO usa categoría

```tsx
import { Star } from 'lucide-react';

<AccessibleButton
  variant="secondary"
  leftIcon={<Star />}
  onClick={handleFavorite}
>
  Adicionar aos Favoritos
</AccessibleButton>
```

## Migración desde ButtonsNew

Antes:
```tsx
import ButtonsNew from '../components/admin/ButtonsNew';

<ButtonsNew
  label="Novo Cliente"
  onClick={handleCreate}
  ariaLabel="Criar novo cliente"
  size="md"
/>
```

Después:
```tsx
import AccessibleButton from '../components/shared/AccessibleButton';

<AccessibleButton
  category="create"
  onClick={handleCreate}
  aria-label="Criar novo cliente"
  size="md"
>
  Novo Cliente
</AccessibleButton>
```

## Ventajas del Sistema de Categorías

1. **Consistencia visual**: Todos los botones de la misma acción tienen el mismo estilo
2. **Fácil mantenimiento**: Cambiar el estilo de todos los botones de una categoría en un solo lugar
3. **Flexibilidad**: Permite personalización individual cuando sea necesario
4. **Escalabilidad**: Fácil agregar nuevas categorías
5. **Type-safe**: TypeScript valida las categorías disponibles
