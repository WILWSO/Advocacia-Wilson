# Sistema de Notificaciones Inline

## Descripción

Sistema de notificaciones contextuales que aparecen dentro del formulario que las genera, proporcionando mejor UX y feedback visual más cercano a la acción del usuario.

## Componentes Creados

### 1. `InlineNotification` (Component)
**Archivo:** `src/components/shared/InlineNotification.tsx`

Componente visual para mostrar notificaciones inline dentro de formularios.

**Props:**
- `type`: 'success' | 'error' | 'warning' | 'info'
- `message`: string - Mensaje a mostrar
- `onClose?`: () => void - Callback para cerrar manualmente
- `duration?`: number - Duración en ms (default: 5000, 0 = no auto-cierre)
- `className?`: string - Clases adicionales

**Características:**
- Animaciones suaves con Framer Motion
- Auto-dismiss configurable
- Botón de cierre manual
- 4 tipos de notificación con colores apropiados
- Diseño responsive

### 2. `useInlineNotification` (Hook)
**Archivo:** `src/hooks/useInlineNotification.ts`

Hook personalizado para gestionar el estado de notificaciones inline.

**API:**
```typescript
const {
  notification,     // Estado actual: { show, type, message }
  showNotification, // Función genérica
  success,          // Helper para success
  error,            // Helper para error
  warning,          // Helper para warning
  info,             // Helper para info
  hide              // Ocultar notificación
} = useInlineNotification();
```

## Uso en Formularios

### Ejemplo: ContactForm

```tsx
import { useInlineNotification } from '../../../hooks/useInlineNotification';
import { InlineNotification } from '../InlineNotification';

export const ContactForm = () => {
  // 1. Importar el hook
  const { notification, success, error, hide } = useInlineNotification();
  
  // 2. Usar en la lógica del componente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSuccess = await submitForm();
    
    if (isSuccess) {
      success('Mensagem enviada com sucesso!');
    } else {
      error('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 3. Renderizar la notificación dentro del formulario */}
      {notification.show && (
        <InlineNotification
          type={notification.type}
          message={notification.message}
          onClose={hide}
          className="mb-4"
        />
      )}
      
      {/* Campos del formulario */}
      <input type="text" name="name" />
      <button type="submit">Enviar</button>
    </form>
  );
};
```

## Patrón de Implementación

### Para cualquier formulario:

```tsx
// 1. Importaciones
import { useInlineNotification } from '../../hooks/useInlineNotification';
import { InlineNotification } from '../../components/shared/InlineNotification';

export const YourFormComponent = () => {
  // 2. Hook
  const { notification, success, error, warning, hide } = useInlineNotification();
  
  // 3. Uso en funciones
  const handleAction = async () => {
    try {
      await someAsyncOperation();
      success('Operación exitosa!');
    } catch (err) {
      error('Error en la operación');
    }
  };

  // 4. Renderizado
  return (
    <div className="form-container">
      {/* Notificación al inicio o donde prefieras */}
      {notification.show && (
        <InlineNotification
          type={notification.type}
          message={notification.message}
          onClose={hide}
          duration={5000}
          className="mb-4"
        />
      )}
      
      {/* Tu formulario */}
      <form>...</form>
    </div>
  );
};
```

## Casos de Uso

### Formularios que pueden beneficiarse:

1. **UsuariosPage** - Modal de creación/edición de usuarios
   - Validaciones de contraseña
   - Conflictos de email
   - Éxito en operaciones

2. **ClientesPage** - Modal de creación/edición de clientes
   - Validaciones de datos
   - Conflictos de documento
   - Confirmaciones

3. **ProcessosPage** - Modales de proceso, links, jurisprudencia, audiencias
   - Validaciones de campos
   - Éxito en guardado
   - Errores de permisos

4. **DocumentManager** - Upload/download de documentos
   - Validación de tamaño
   - Validación de tipo de archivo
   - Confirmaciones de acción

## Posicionamiento

### Inline vs Global

**Inline Notification** (nuevo):
- Aparece dentro del formulario/componente
- Contextual y cercana a la acción
- Mejor para validaciones y feedback de formulario
- Se posiciona relativamente al contenedor padre

**Toast Notification** (existente):
- Aparece en top-right de la pantalla
- Para notificaciones globales
- Mejor para acciones que afectan toda la app
- Ejemplo: Logout, cambios de configuración global

## Recomendaciones

### Cuándo usar Inline:
- ✅ Formularios de creación/edición
- ✅ Validaciones de campos
- ✅ Feedback inmediato de acciones locales
- ✅ Errores contextuales

### Cuándo usar Toast (global):
- ✅ Notificaciones de sistema
- ✅ Actualizaciones que afectan múltiples áreas
- ✅ Acciones que no tienen contexto visual claro
- ✅ Notificaciones de background (sync, websockets, etc.)

## Duración Sugerida

```typescript
// Auto-dismiss en 5 segundos (default)
<InlineNotification ... duration={5000} />

// Auto-dismiss rápido (solo confirmación visual)
<InlineNotification ... duration={2000} />

// Sin auto-dismiss (requiere acción del usuario)
<InlineNotification ... duration={0} />
```

## Accesibilidad

- ✅ Botón de cierre con `aria-label`
- ✅ Iconos semánticos para cada tipo
- ✅ Contraste de colores WCAG AA
- ✅ Animaciones suaves (respeta prefers-reduced-motion si se configura)

## Próximos Pasos

1. Migrar otros formularios al sistema inline
2. Mantener sistema toast para notificaciones globales
3. Considerar agregar sonidos para accesibilidad
4. Agregar soporte para múltiples notificaciones simultáneas si es necesario
