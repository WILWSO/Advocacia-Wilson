# Sistema de Modo de Mantenimiento

Sistema integrado para controlar el acceso durante mantenimientos de base de datos o actualizaciones críticas del sistema.

## 📋 Características

✅ **Control via ENV** - Activación sin cambios de código  
✅ **Whitelist de Desarrolladores** - Acceso selectivo durante mantenimiento  
✅ **UI Elegante** - Pantalla profesional de mantenimiento  
✅ **Badge para DEVs** - Indicador visual de Modo Desarrollador  
✅ **100% TypeScript** - Type-safe y autocompletado  
✅ **Modular** - Copiable a otros proyectos  
✅ **Zero Dependencies** - Solo usa hooks existentes  

---

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

Agregar a tu archivo `.env` o `.env.local`:

```bash
# Activar mantenimiento
VITE_MAINTENANCE_MODE=true

# Agregar emails de desarrolladores (separados por coma)
VITE_MAINTENANCE_DEV_EMAILS=admin@example.com,dev@example.com
```

### 2. Ya Está Integrado ✅

El sistema ya está integrado en [App.tsx](../App.tsx) y funciona automáticamente.

### 3. Probar en Desarrollo

```bash
# Terminal 1: Configurar modo mantenimiento
echo "VITE_MAINTENANCE_MODE=true" >> .env.local
echo "VITE_MAINTENANCE_DEV_EMAILS=tu-email@example.com" >> .env.local

# Terminal 2: Reiniciar servidor
npm run dev

# Resultado:
# ✅ Si tu email está en la lista → App funciona + Badge amarillo
# ❌ Otros usuarios → Pantalla de mantenimiento
```

---

## 📁 Estructura de Archivos

```
src/features/maintenance/
├── components/
│   ├── MaintenanceGuard.tsx    # Wrapper principal (App.tsx)
│   ├── MaintenanceScreen.tsx   # Pantalla de mantenimiento
│   └── MaintenanceBadge.tsx    # Badge para desarrolladores
├── hooks/
│   └── useMaintenanceMode.ts   # Hook principal
├── utils/
│   └── checkMaintenanceAccess.ts  # Funciones utilitarias
├── config/
│   └── maintenance.config.ts   # Configuración centralizada
├── types/
│   └── maintenance.types.ts    # Interfaces TypeScript
└── index.ts                    # Exports públicos
```

---

## 🔌 Integración

### En App.tsx (Ya integrado ✅)

```tsx
import { MaintenanceGuard, MaintenanceBadge, useMaintenanceMode } from './features/maintenance';

function App() {
  const { isMaintenanceMode, isDevAccess } = useMaintenanceMode();
  const showDevBadge = isMaintenanceMode && isDevAccess;

  return (
    <MaintenanceGuard>
      {/* Tu aplicación */}
      <Router>...</Router>
      
      {/* Badge opcional para DEVs */}
      {showDevBadge && <MaintenanceBadge />}
    </MaintenanceGuard>
  );
}
```

---

## 🎨 Componentes

### MaintenanceGuard

Wrapper que intercepts rendering y decide si mostrar app o pantalla de mantenimiento.

```tsx
<MaintenanceGuard
  loadingComponent={<CustomLoader />}  // Opcional
  maintenanceScreen={<CustomScreen />} // Opcional
>
  <App />
</MaintenanceGuard>
```

**Lógica:**
- `VITE_MAINTENANCE_MODE=false` → Renderiza app normalmente
- `VITE_MAINTENANCE_MODE=true` + Email en whitelist → Renderiza app
- `VITE_MAINTENANCE_MODE=true` + Email NO en whitelist → Muestra maintenance screen

### MaintenanceScreen

Pantalla elegante que se muestra a usuarios regulares durante mantenimiento.

```tsx
<MaintenanceScreen 
  title="Sistema en Mantenimiento"
  message="Volveremos pronto con mejoras"
  estimatedTime="20-30 minutos"
  contactEmail="soporte@wilsonalbuquerque.adv.br"
  showIcon={true}
  showEstimatedTime={true}
  showContact={true}
/>
```

**Props personalizables:**
- `title` - Título principal
- `message` - Mensaje explicativo
- `estimatedTime` - Tiempo estimado de retorno
- `contactEmail` - Email de contacto para urgencias
- `logoUrl` - URL de logo personalizado
- `showIcon` - Mostrar ícono animado (default: `true`)
- `showEstimatedTime` - Mostrar sección de tiempo (default: `true`)
- `showContact` - Mostrar información de contacto (default: `true`)

### MaintenanceBadge

Badge flotante que indica a desarrolladores que están en Modo Mantenimiento.

```tsx
<MaintenanceBadge 
  position="top-right"
  text="🛠️ Modo Desarrollador"
  animated={true}
/>
```

**Props:**
- `position` - Posición: `'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'`
- `text` - Texto del badge (default: "🛠️ Modo Desarrollador")
- `animated` - Animación de pulso (default: `true`)
- `className` - Clases CSS adicionales

---

## 🪝 Hooks

### useMaintenanceMode

Hook principal para verificar estado de mantenimiento.

```tsx
import { useMaintenanceMode } from '@/features/maintenance';

function MyComponent() {
  const { 
    isMaintenanceMode, // true si mantenimiento activo
    isDevAccess,       // true si usuario tiene acceso dev
    isLoading,         // true mientras verifica auth
    devEmails          // lista de emails (debug only)
  } = useMaintenanceMode();

  if (isLoading) return <Loader />;
  if (isMaintenanceMode && !isDevAccess) return <Maintenance />;
  
  return <App />;
}
```

**Return:**
- `isMaintenanceMode: boolean` - Si modo mantenimiento está activo
- `isDevAccess: boolean` - Si usuario actual tiene acceso dev
- `isLoading: boolean` - Si todavía está verificando autenticación
- `devEmails: string[]` - Emails en whitelist (para debugging)

---

## 🛠️ Utilidades

### checkMaintenanceAccess.ts

Funciones helpers para verificación de acceso:

```tsx
import {
  isMaintenanceModeActive,
  parseDevEmails,
  hasDevAccess,
  getMaintenanceStatus,
  validateMaintenanceConfig,
  logMaintenanceStatus
} from '@/features/maintenance';

// Verificar si mantenimiento está activo
const active = isMaintenanceModeActive(); // true | false

// Parsear emails de ENV
const devs = parseDevEmails(); // ['admin@test.com', 'dev@test.com']

// Verificar acceso de usuario
const access = hasDevAccess('admin@test.com'); // true | false

// Obtener status completo
const status = getMaintenanceStatus();
// {
//   isActive: true,
//   devEmailsCount: 2,
//   timestamp: '2026-03-03T10:30:00.000Z'
// }

// Validar configuración
const validation = validateMaintenanceConfig();
// {
//   isValid: true,
//   errors: [],
//   warnings: []
// }

// Log de status (development only)
logMaintenanceStatus(); // Imprime en consola
```

---

## ⚙️ Configuración

### maintenance.config.ts

Configuración centralizada del sistema.

```tsx
export const MAINTENANCE_CONFIG = {
  ENV_KEYS: {
    MAINTENANCE_MODE: 'VITE_MAINTENANCE_MODE',
    DEV_EMAILS: 'VITE_MAINTENANCE_DEV_EMAILS',
  },
  MESSAGES: {
    TITLE: 'Sistema en Mantenimiento',
    MESSAGE: 'Estamos trabajando para mejorar...',
    ESTIMATED_TIME: '15-30 minutos',
    CONTACT_EMAIL: 'soporte@wilsonalbuquerque.adv.br',
    LOADING: 'Verificando estado del sistema...',
  },
  UI: {
    ICON_SIZE: 80,
    ANIMATION_DURATION: '3s',
    SHOW_CONTACT: true,
    SHOW_ESTIMATED_TIME: true,
    SHOW_ICON: true,
  },
  DEV_BADGE: {
    ENABLED: true,
    TEXT: 'Modo Desarrollador',
    POSITION: 'top-right',
    ANIMATED: true,
  },
};
```

**Personalización:**
1. Modificar valores en `MAINTENANCE_CONFIG`
2. O pasar props personalizadas a componentes
3. Las props sobrescriben la config por defecto

---

## 🧪 Testing

### Escenario 1: Mantenimiento Desactivado

```bash
# .env.local
VITE_MAINTENANCE_MODE=false
VITE_MAINTENANCE_DEV_EMAILS=
```

**Resultado:** App funciona normalmente para todos los usuarios.

### Escenario 2: Mantenimiento Activado - Usuario Regular

```bash
# .env.local
VITE_MAINTENANCE_MODE=true
VITE_MAINTENANCE_DEV_EMAILS=admin@test.com,dev@test.com
```

**Login con:** `usuario@test.com` (NO en whitelist)  
**Resultado:** Se muestra `MaintenanceScreen`, app bloqueada.

### Escenario 3: Mantenimiento Activado - Usuario Dev

```bash
# .env.local
VITE_MAINTENANCE_MODE=true
VITE_MAINTENANCE_DEV_EMAILS=admin@test.com,dev@test.com
```

**Login con:** `admin@test.com` (SÍ en whitelist)  
**Resultado:** App funciona normalmente + `MaintenanceBadge` visible.

### Escenario 4: Usuario No Autenticado

```bash
# .env.local
VITE_MAINTENANCE_MODE=true
VITE_MAINTENANCE_DEV_EMAILS=admin@test.com
```

**Sin login** (no authenticated)  
**Resultado:** Se muestra `MaintenanceScreen`, acceso bloqueado.

---

## 🔐 Seguridad

### ✅ Buenas Prácticas

- **Emails en lowercase:** Auto-convertidos para comparación case-insensitive
- **Validación de emails:** Formato validado antes de agregar a whitelist
- **ENV variables:** No exponen service keys sensibles
- **Type safety:** TypeScript previene errores en tiempo de compilación
- **No backend dependency:** Control desde ENV, no requiere API

### ⚠️ Consideraciones

- Los emails en `VITE_MAINTENANCE_DEV_EMAILS` son visibles en el bundle del cliente (solo en dev builds)
- No exponer la lista de emails dev en producción via devTools
- La whitelist es para identificación, no para autenticación (usa sistema auth existente)

---

## 🚀 Despliegue en Producción

### Vercel

```bash
# Settings → Environment Variables
VITE_MAINTENANCE_MODE=false (o true para activar)
VITE_MAINTENANCE_DEV_EMAILS=admin@prod.com,support@prod.com

# Redeploy para aplicar cambios
vercel --prod
```

### Netlify

```bash
# Site settings → Environment variables → Edit variables
VITE_MAINTENANCE_MODE=false
VITE_MAINTENANCE_DEV_EMAILS=admin@prod.com

# Trigger deploy
netlify deploy --prod
```

### Otros Hostings

1. Agregar variables en panel de control del hosting
2. Redeploy la aplicación
3. Cambios se aplican inmediatamente después del deploy

**Nota:** Cambiar `VITE_MAINTENANCE_MODE` requiere rebuild/redeploy (son variables en tiempo de build).

---

## 📦 Portabilidad a Otros Proyectos

### Paso 1: Copiar Carpeta

```bash
# Desde proyecto actual
cp -r src/features/maintenance nuevo-proyecto/src/features/

# O usar tu IDE/File Explorer
```

### Paso 2: Ajustar Import (1 línea)

Editar `src/features/maintenance/hooks/useMaintenanceMode.ts`:

```tsx
// ANTES (en este proyecto)
import { useAuthLogin } from '../../../components/auth/useAuthLogin';

// DESPUÉS (en nuevo proyecto)
import { useAuth } from '@/hooks/useAuth'; // Tu hook de auth

// Ajustar línea ~31
const { user, isLoading: authLoading } = useAuth(); // En vez de useAuthLogin
```

**Requisitos del hook de auth:**
- Debe retornar `user` con propiedad `email`
- Debe retornar `isLoading` boolean

### Paso 3: Agregar ENV Variables

```bash
# En nuevo proyecto .env
VITE_MAINTENANCE_MODE=false
VITE_MAINTENANCE_DEV_EMAILS=
```

### Paso 4: Actualizar vite-env.d.ts

```tsx
// nuevo-proyecto/src/vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_MAINTENANCE_MODE: string;
  readonly VITE_MAINTENANCE_DEV_EMAILS: string;
  // ... otras variables
}
```

### Paso 5: Integrar en App

```tsx
// nuevo-proyecto/src/App.tsx
import { MaintenanceGuard, MaintenanceBadge, useMaintenanceMode } from '@/features/maintenance';

function App() {
  const { isMaintenanceMode, isDevAccess } = useMaintenanceMode();
  
  return (
    <MaintenanceGuard>
      <Router>...</Router>
      {isMaintenanceMode && isDevAccess && <MaintenanceBadge />}
    </MaintenanceGuard>
  );
}
```

✅ **Listo! El sistema funciona igual en el nuevo proyecto.**

---

## 🐛 Troubleshooting

### Problema: "MaintenanceScreen se muestra siempre"

**Causa:** `VITE_MAINTENANCE_MODE=true` en ENV.

**Solución:**
```bash
# Verificar archivo .env o .env.local
cat .env.local | grep MAINTENANCE

# Si está en true y no deseas mantenimiento
echo "VITE_MAINTENANCE_MODE=false" > .env.local

# Reiniciar dev server
npm run dev
```

### Problema: "Badge no aparece para desarrolladores"

**Causa 1:** Email no está en whitelist.

**Solución:**
```bash
# Verificar email del usuario logueado
console.log(user.email) # En DevTools

# Agregar email a whitelist
echo "VITE_MAINTENANCE_DEV_EMAILS=tu-email@test.com" >> .env.local
```

**Causa 2:** `isMaintenanceMode` es `false`.

**Solución:**
```bash
# Activar mantenimiento
echo "VITE_MAINTENANCE_MODE=true" >> .env.local
npm run dev
```

### Problema: "ENV variables no se actualizan"

**Causa:** Vite cachea variables en build time.

**Solución:**
```bash
# Detener servidor
Ctrl + C

# Limpiar cache (opcional)
rm -rf node_modules/.vite

# Reiniciar
npm run dev
```

### Problema: "TypeScript errors con useMaintenanceMode"

**Causa:** Tipos de retorno del hook no coinciden con `useAuthLogin`.

**Solución:**
```tsx
// Verificar que tu hook de auth retorne:
interface AuthHookReturn {
  user: { email: string } | null;
  isLoading: boolean;
}

// Si tu hook retorna diferente, ajustar useMaintenanceMode.ts
```

---

## 📚 Recursos Adicionales

- [Plan Completo de Implementación](./PLAN_MAINTENANCE_MODE.md)
- [Documentación de Variables ENV (Vite)](https://vitejs.dev/guide/env-and-mode.html)
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)

---

## 📄 Licencia

Este sistema es parte del proyecto **Advocacia Wilson** y sigue la misma licencia del proyecto principal.

---

**Creado con ❤️ para facilitar el mantenimiento de sistemas en producción.**
