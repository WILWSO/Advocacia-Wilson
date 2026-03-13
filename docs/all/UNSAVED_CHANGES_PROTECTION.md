# Sistema de Protección contra Pérdida de Datos en Modales

## 📋 Descripción

Sistema centralizado para prevenir la pérdida accidental de datos en formularios modales. Detecta cambios no guardados y solicita confirmación antes de cerrar usando el sistema de confirmación del **NotificationContext** (SSoT).

## 🎯 Características

- ✅ Detección automática de cambios en formularios
- ✅ Confirmación elegante vía NotificationContext (no window.confirm nativo)
- ✅ Mensajes centralizados en SSoT (`messages.ts`)
- ✅ Protección en backdrop click, botón X y tecla Escape
- ✅ Soporte para objetos anidados y arrays
- ✅ Fácil integración en modales existentes
- ✅ Diálogos animados y personalizables

## 🔧 Componentes

### 1. `useUnsavedChanges` Hook
Detecta cambios comparando estado inicial vs actual.

### 2. `useConfirmNavigation` Hook (Opcional)
Integra confirmación en handlers de navegación personalizados.

### 3. `BaseModal` & `FormModal`
Modales actualizados con soporte para confirmación automático usando NotificationContext.

## 📖 Uso Básico

### Opción 1: Con `FormModal` (Recomendado - Automático)

```tsx
import { FormModal } from '../shared/modales/FormModal';
import { useUnsavedChanges } from '../../hooks/forms/useUnsavedChanges';

const MyFormModal = ({ isOpen, onClose, initialData }) => {
  const [formData, setFormData] = useState(initialData);
  
  // Detectar cambios
  const { hasChanges, updateCurrent, resetInitial } = useUnsavedChanges(initialData);
  
  // Actualizar al cambiar inputs
  const handleChange = (e) => {
    const newData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newData);
    updateCurrent(newData); // 👈 Notificar cambios
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveData(formData);
    resetInitial(formData); // 👈 Marcar como guardado
    onClose();
  };
  
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Mi Formulario"
      hasUnsavedChanges={hasChanges} // 👈 Activa confirmación automática
    >
      <input
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
      />
      {/* más campos... */}
    </FormModal>
  );
};
```

**Nota**: `FormModal` y `BaseModal` automáticamente usan `useNotification()` internamente, no necesitas pasarlo como prop.

### Opción 2: Con handler personalizado y `useConfirmNavigation`

```tsx
import { useNotification } from '../notifications/NotificationContext';
import { useConfirmNavigation } from '../../hooks/forms/useConfirmNavigation';
import { useUnsavedChanges } from '../../hooks/forms/useUnsavedChanges';

const MyComponent = ({ onNavigate }) => {
  const { hasChanges } = useUnsavedChanges(data);
  const { confirm } = useNotification();
  const handleNavigate = useConfirmNavigation(onNavigate, hasChanges, confirm);
  
  return <button onClick={handleNavigate}>Salir</button>;
};
```

## 🔄 Ejemplo Completo: CreatePostModal

```tsx
import React, { useState, useEffect } from 'react';
import { FormModal } from '../shared/modales/FormModal';
import { useUnsavedChanges } from '../../hooks/forms/useUnsavedChanges';
import type { Post } from '../../types/post';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Partial<Post>) => void;
  editingPost?: Post | null;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingPost 
}) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    tipo: 'article' as Post['tipo'],
    tags: '',
  });
  
  // Datos iniciales para comparación
  const initialData = editingPost ? {
    titulo: editingPost.titulo,
    conteudo: editingPost.conteudo,
    tipo: editingPost.tipo,
    tags: editingPost.tags.join(', '),
  } : {
    titulo: '',
    conteudo: '',
    tipo: 'article' as Post['tipo'],
    tags: '',
  };
  
  // Hook de cambios no guardados
  const { hasChanges, updateCurrent, resetInitial } = useUnsavedChanges(initialData);
  
  // Cargar datos al abrir/editar
  useEffect(() => {
    setFormData(initialData);
    resetInitial(initialData);
  }, [editingPost, isOpen]);
  
  // Manejar cambios en inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newData);
    updateCurrent(newData); // Notificar cambio
  };
  
  // Guardar datos
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    resetInitial(formData); // Marcar como guardado
    onClose();
  };
  
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={editingPost ? 'Editar Post' : 'Crear Post'}
      hasUnsavedChanges={hasChanges} // 👈 Protección activada
    >
      <div className="space-y-4">
        <input
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          placeholder="Título"
          required
        />
        
        <textarea
          name="conteudo"
          value={formData.conteudo}
          onChange={handleChange}
          placeholder="Contenido"
          rows={5}
          required
        />
        
        <select name="tipo" value={formData.tipo} onChange={handleChange}>
          <option value="article">Artículo</option>
          <option value="video">Video</option>
          <option value="image">Imagen</option>
        </select>
        
        <input
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (separadas por coma)"
        />
      </div>
    </FormModal>
  );
};

export default CreatePostModal;
```

## 🎨 Personalización

### Mensaje Personalizado

```tsx
<FormModal
  hasUnsavedChanges={hasChanges}
  confirmMessage="Você perderá todo o progresso. Deseja realmente sair?"
>
```

### Sin Confirmación en Backdrop

```tsx
<BaseModal
  hasUnsavedChanges={hasChanges}
  closeOnBackdropClick={false} // Solo X y Escape requieren confirmación
>
```

### Tipo de Diálogo

El diálogo de confirmación usa `type: 'warning'` por defecto (botón amarillo). Esto está configurado internamente y usa el sistema de `NotificationContext` que soporta:

- `'danger'` - Rojo (para eliminaciones)
- `'warning'` - Amarillo (para cambios importantes - usado aquí)
- `'info'` - Azul (para confirmaciones generales)

## 🔗 Integración con NotificationContext

El sistema usa automáticamente el `NotificationContext` para mostrar diálogos elegantes:

```tsx
// BaseModal internamente hace:
const { confirm } = useNotification();

const handleClose = async () => {
  if (hasUnsavedChanges) {
    const confirmed = await confirm({
      title: 'Descartar alterações?',
      message: confirmMessage || CONFIRMATION_MESSAGES.DISCARD_CHANGES,
      confirmText: 'Descartar',
      cancelText: 'Continuar editando',
      type: 'warning'
    });
    if (confirmed) {
      onClose();
    }
  } else {
    onClose();
  }
};
```

**Ventajas sobre window.confirm():**
- ✅ Diálogo elegante y animado
- ✅ Consistente con el diseño del sistema
- ✅ Personalizable (títulos, mensajes, botones)
- ✅ Soporte para diferentes tipos visuales
- ✅ Usa AccessibleButton (SSoT para botones)
- ✅ Mejor UX y accesibilidad

## ⚙️ API Reference

### `useUnsavedChanges<T>(initialData: T)`

**Returns:**
- `hasChanges: boolean` - Si hay cambios pendientes
- `updateCurrent(data: T): void` - Actualizar estado actual
- `resetInitial(data: T): void` - Resetear a nuevo estado inicial
- `markAsSaved(): void` - Marcar actual como guardado

### `useConfirmNavigation(onClose, hasChanges, confirm, customMessage?)`

**Params:**
- `onClose: () => void` - Handler original
- `hasChanges: boolean` - Si hay cambios
- `confirm: ConfirmFunction` - Función confirm del NotificationContext
- `customMessage?: string` - Mensaje personalizado

**Returns:** `() => Promise<void>` - Handler async con confirmación

**Ejemplo:**
```tsx
const { hasChanges } = useUnsavedChanges(data);
const { confirm } = useNotification();
const handleClose = useConfirmNavigation(onClose, hasChanges, confirm);
```

### FormModal Props Adicionales

- `hasUnsavedChanges?: boolean` - Activar confirmación
- `confirmMessage?: string` - Mensaje personalizado

### BaseModal Props Adicionales

- `hasUnsavedChanges?: boolean` - Activar confirmación
- `confirmMessage?: string` - Mensaje personalizado

## 📝 Notas

1. **Performance**: `useUnsavedChanges` usa deep comparison. Para formularios muy grandes, considera optimizaciones.

2. **Reinicio en Apertura**: Siempre resetea `initialData` cuando el modal se abre:
   ```tsx
   useEffect(() => {
     if (isOpen) {
       resetInitial(data);
     }
   }, [isOpen]);
   ```

3. **Después de Guardar**: Siempre llama `resetInitial()` después de guardar exitosamente.

4. **Mensajes SSoT**: Los mensajes están centralizados en `src/config/messages.ts`.

5. **Sistema de Confirmación SSoT**: Usa `NotificationContext.confirm()` en lugar de `window.confirm()` nativo para mantener consistencia visual y UX en todo el sistema.

6. **Async/Await**: Los handlers de cierre ahora son asíncronos debido al uso de `confirm()` que retorna una Promise.

## 🔍 Single Source of Truth (SSoT)

El sistema respeta completamente el principio SSoT:

- ✅ **Mensajes**: `src/config/messages.ts` (CONFIRMATION_MESSAGES)
- ✅ **Confirmación**: `NotificationContext.confirm()` (único sistema de diálogos)
- ✅ **Botones**: `AccessibleButton` con categorías centralizadas
- ✅ **Estilos**: Sistema centralizado de confirmación con animaciones
- ✅ **Lógica**: Hooks reutilizables en lugar de código duplicado

## 🔍 Aplicación a Modales Existentes

### Checklist de Migración

Para cada modal de formulario:

- [ ] Importar `useUnsavedChanges`
- [ ] Definir `initialData` basado en props
- [ ] Crear estado local con `useState`
- [ ] Configurar hook: `const { hasChanges, updateCurrent, resetInitial } = useUnsavedChanges(initialData)`
- [ ] Llamar `updateCurrent(newData)` en cada cambio de input
- [ ] Llamar `resetInitial(data)` después de guardar y al abrir modal
- [ ] Agregar prop `hasUnsavedChanges={hasChanges}` al modal

### Modales a Actualizar

1. ✅ Sistema implementado y documentado
2. 🔄 Pendiente: Aplicar a modales existentes
   - `CreatePostModal.tsx`
   - `AudienciaFormModal.tsx`
   - `CrudListManager.tsx` (modales internos)
   - Otros modales de formulario en el sistema

## 📚 Recursos

- Archivo de mensajes: `src/config/messages.ts`
- Hook principal: `src/hooks/forms/useUnsavedChanges.ts`
- Hook auxiliar: `src/hooks/forms/useConfirmNavigation.ts`
- Modal base: `src/components/shared/modales/BaseModal.tsx`
- Modal formulario: `src/components/shared/modales/FormModal.tsx`
