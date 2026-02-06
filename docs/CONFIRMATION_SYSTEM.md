# Sistema de Confirmación

## Descripción

Sistema de confirmación modal integrado en `NotificationContext` para reemplazar el `window.confirm()` nativo. Proporciona diálogos elegantes y personalizables para acciones destructivas.

## Uso Básico

```typescript
import { useNotification } from '../contexts/NotificationContext';

const MyComponent = () => {
  const { confirm, success, error } = useNotification();

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Excluir Item',
      message: 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    if (confirmed) {
      // Ejecutar acción de eliminación
      const result = await deleteItem(id);
      if (result.success) {
        success('Item excluído com sucesso!');
      } else {
        error('Erro ao excluir item.');
      }
    }
  };

  return (
    <button onClick={() => handleDelete('123')}>
      Excluir
    </button>
  );
};
```

## Opciones

### `title` (opcional)
- **Tipo**: `string`
- **Default**: `'Confirmar ação'`
- **Descripción**: Título del modal de confirmación

### `message` (requerido)
- **Tipo**: `string`
- **Descripción**: Mensaje descriptivo de la acción a confirmar

### `confirmText` (opcional)
- **Tipo**: `string`
- **Default**: `'Confirmar'`
- **Descripción**: Texto del botón de confirmación

### `cancelText` (opcional)
- **Tipo**: `string`
- **Default**: `'Cancelar'`
- **Descripción**: Texto del botón de cancelar

### `type` (opcional)
- **Tipo**: `'danger' | 'warning' | 'info'`
- **Default**: `'danger'`
- **Descripción**: Tipo de confirmación que define el color del modal

## Tipos de Confirmación

### 🔴 Danger (Peligro)
Usado para acciones destructivas e irreversibles:
- Eliminación de datos
- Borrado permanente
- Revocación de permisos

```typescript
const confirmed = await confirm({
  title: 'Excluir Cliente',
  message: 'Esta ação excluirá permanentemente o cliente e todos os seus dados.',
  type: 'danger'
});
```

### 🟡 Warning (Advertencia)
Usado para acciones que requieren atención:
- Cambios importantes
- Acciones que afectan múltiples items
- Modificaciones de configuración

```typescript
const confirmed = await confirm({
  title: 'Alterar Status',
  message: 'Esta ação afetará todos os processos vinculados.',
  type: 'warning'
});
```

### 🔵 Info (Información)
Usado para confirmaciones generales:
- Confirmación de operaciones normales
- Verificación de cambios
- Acciones reversibles

```typescript
const confirmed = await confirm({
  title: 'Publicar Conteúdo',
  message: 'Deseja publicar este conteúdo agora?',
  type: 'info'
});
```

## Ejemplos de Uso

### 1. Eliminación de Post Social
```typescript
const handleDeletePost = async (id: string) => {
  const confirmed = await confirmDialog({
    title: 'Excluir Conteúdo',
    message: 'Tem certeza que deseja excluir este conteúdo? Esta ação não pode ser desfeita.',
    confirmText: 'Excluir',
    cancelText: 'Cancelar',
    type: 'danger'
  });

  if (confirmed) {
    await deletePost(id);
    success('Conteúdo excluído com sucesso!');
  }
};
```

### 2. Desactivar Usuario
```typescript
const handleDeactivateUser = async (userId: string) => {
  const confirmed = await confirm({
    title: 'Desativar Usuário',
    message: 'O usuário não poderá mais acessar o sistema. Deseja continuar?',
    confirmText: 'Desativar',
    type: 'warning'
  });

  if (confirmed) {
    await deactivateUser(userId);
    success('Usuário desativado!');
  }
};
```

### 3. Cambio de Estado de Proceso
```typescript
const handleStatusChange = async (processoId: string) => {
  const confirmed = await confirm({
    title: 'Alterar Status',
    message: 'Esta ação notificará o cliente. Confirmar?',
    confirmText: 'Confirmar',
    type: 'info'
  });

  if (confirmed) {
    await updateProcessStatus(processoId);
    success('Status atualizado!');
  }
};
```

## Características

✅ **Promise-based**: Uso con async/await  
✅ **Personalizable**: Títulos, mensajes y textos de botones  
✅ **Tres variantes**: danger, warning, info  
✅ **Animado**: Transiciones suaves con Framer Motion  
✅ **Accesible**: Cierre con backdrop click y botones AccessibleButton (SSoT)  
✅ **Responsive**: Funciona en todos los tamaños de pantalla  
✅ **SSoT**: Usa AccessibleButton con categorías configuradas centralizadamente

## Integración con NotificationContext

El sistema de confirmación está completamente integrado con el contexto de notificaciones existente:

```typescript
const { confirm, success, error, warning, info } = useNotification();

// Flujo completo
const handleAction = async () => {
  const confirmed = await confirm({ ... });
  
  if (confirmed) {
    const result = await performAction();
    if (result.success) {
      success('Operação concluída!');
    } else {
      error('Erro na operação.');
    }
  }
};
```

## Migrando desde window.confirm()

### ❌ Antes (Nativo)
```typescript
const handleDelete = async (id: string) => {
  if (confirm('Tem certeza?')) {
    await deleteItem(id);
  }
};
```

### ✅ Después (Sistema Personalizado)
```typescript
const { confirm } = useNotification();

const handleDelete = async (id: string) => {
  const confirmed = await confirm({
    title: 'Excluir Item',
    message: 'Tem certeza que deseja excluir? Esta ação é irreversível.',
    type: 'danger'
  });

  if (confirmed) {
    await deleteItem(id);
    success('Item excluído!');
  }
};
```

## Buenas Prácticas

1. **Use `type: 'danger'`** para todas las eliminaciones
2. **Sea específico** en los mensajes sobre lo que se va a eliminar
3. **Mencione la irreversibilidad** si aplica
4. **Personalice los textos** para cada contexto
5. **Combine con notificaciones** de éxito/error después de la acción

## Notas Técnicas

- El modal se renderiza en `z-index: 151` para estar sobre otros elementos
- El backdrop tiene `z-index: 150`
- Las animaciones usan `framer-motion` con transiciones de 200ms
- El cierre con backdrop click está habilitado por defecto
- La función devuelve una Promise<boolean> que resuelve con `true` (confirmar) o `false` (cancelar)
- **Botones SSoT**: Usa `AccessibleButton` con categorías:
  - Cancelar: `category="cancel"` (botón outline neutral)
  - Danger: `category="delete"` (botón rojo)
  - Warning: `category="edit"` (botón amarillo/primary)
  - Info: `category="save"` (botón azul/primary)
- Todos los botones usan `size="lg"` para mejor UX en diálogos
