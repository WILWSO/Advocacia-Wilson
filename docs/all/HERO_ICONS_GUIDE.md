# 🎨 Guía de Hero Icons

## 📦 Instalación
Hero Icons ya está instalado en el proyecto:
```bash
npm install @heroicons/react
```

## 🎯 Dos Variantes Disponibles

### 1. **Outline** (Contorno) - Líneas finas
```tsx
import { MapPinIcon, ScaleIcon, UserIcon } from '@heroicons/react/24/outline';
```

### 2. **Solid** (Sólido) - Relleno completo
```tsx
import { MapPinIcon, ScaleIcon, UserIcon } from '@heroicons/react/24/solid';
```

## 📍 **Iconos Recomendados para el Sistema**

### LOCAL (Ubicación)
```tsx
// Outline (recomendado para UI secundaria)
import { MapPinIcon } from '@heroicons/react/24/outline';

// Solid (para énfasis)
import { MapPinIcon } from '@heroicons/react/24/solid';
```

**Uso:**
```tsx
<MapPinIcon className="h-5 w-5 text-gray-500" />
```

---

### PROCESOS JURÍDICOS
```tsx
// Outline
import { ScaleIcon } from '@heroicons/react/24/outline';

// Solid
import { ScaleIcon } from '@heroicons/react/24/solid';
```

**Alternativas:**
- `DocumentTextIcon` - Documentos legales
- `ClipboardDocumentCheckIcon` - Documentos verificados
- `BriefcaseIcon` - Maleta (negocio/trabajo)

---

### PRESENCIAL (Persona física)
```tsx
// Outline
import { UserIcon } from '@heroicons/react/24/outline';

// Solid
import { UserIcon } from '@heroicons/react/24/solid';
```

**Alternativas:**
- `UserCircleIcon` - Usuario con círculo
- `UsersIcon` - Múltiples personas
- `UserGroupIcon` - Grupo de personas

---

## 🔄 **Comparación: Lucide vs Hero Icons**

| Aspecto | Lucide (actual) | Hero Icons |
|---------|----------------|------------|
| **Estilo** | Líneas uniformes | Outline + Solid |
| **Tamaños** | Escalable con props | 20px, 24px predefinidos |
| **Cantidad** | 1000+ iconos | ~300 iconos curados |
| **Peso** | Más ligero | Ligeramente más pesado |
| **Diseño** | Minimalista | Diseño Tailwind UI |
| **Uso** | `<Icon size={20} />` | `<Icon className="h-5 w-5" />` |

---

## 💡 **Ejemplo de Implementación en el Sistema**

### Opción A: Mantener Lucide (ACTUAL) ✅
```tsx
import { getIcon } from '../config/icons';

{getIcon('mapPin', 18)}
{getIcon('gavel', 20)}
{getIcon('userRound', 24)}
```

**Ventajas:**
- Ya implementado y funcionando
- Sistema centralizado
- Fácil de mantener
- Consistente en todo el código

---

### Opción B: Migrar a Hero Icons (Outline)
```tsx
import { MapPinIcon, ScaleIcon, UserIcon } from '@heroicons/react/24/outline';

<MapPinIcon className="h-5 w-5 text-gray-400" />
<ScaleIcon className="h-6 w-6 text-gray-600" />
<UserIcon className="h-6 w-6 text-blue-600" />
```

**Ventajas:**
- Diseño más refinado
- Dos variantes (outline/solid)
- Optimizado para Tailwind CSS

**Desventajas:**
- Requiere refactorizar el sistema actual
- Menos iconos disponibles
- Tamaños menos flexibles

---

### Opción C: Híbrido (Combinar ambos) 🎯
```tsx
// Lucide para la mayoría
import { getIcon } from '../config/icons';

// Hero Icons solo para iconos específicos críticos
import { ScaleIcon } from '@heroicons/react/24/solid';

// En el componente
{getIcon('mapPin', 18)}
<ScaleIcon className="h-5 w-5 text-gray-600" />
{getIcon('userRound', 20)}
```

**Ventajas:**
- Lo mejor de ambos mundos
- Flexibilidad máxima
- Usa Hero Icons donde más impacte

---

## 🎨 **Ejemplo Visual de Hero Icons**

### Local (MapPinIcon)
```tsx
// Outline
<MapPinIcon className="h-6 w-6 text-gray-500" />

// Solid
<MapPinIcon className="h-6 w-6 text-blue-600" />
```

### Proceso Jurídico (ScaleIcon)
```tsx
// Outline - Balanza de justicia
<ScaleIcon className="h-6 w-6 text-gray-500" />

// Solid - Más impacto
<ScaleIcon className="h-6 w-6 text-blue-600" />
```

### Presencial (UserIcon / UserCircleIcon)
```tsx
// Outline
<UserIcon className="h-6 w-6 text-gray-500" />
<UserCircleIcon className="h-6 w-6 text-gray-500" />

// Solid
<UserIcon className="h-6 w-6 text-blue-600" />
<UserCircleIcon className="h-6 w-6 text-blue-600" />
```

---

## 📚 **Recursos Adicionales**

- [Hero Icons Official Site](https://heroicons.com/)
- [Hero Icons GitHub](https://github.com/tailwindlabs/heroicons)
- [Browse All Icons](https://heroicons.com/)

---

## 🎯 **Recomendación Final**

**MANTENER LUCIDE (Actual Sistema)** ✅

**Razones:**
1. Ya está implementado y funcionando perfectamente
2. Sistema centralizado en `icons.tsx` (fácil de mantener)
3. 1000+ iconos disponibles (más opciones futuras)
4. Más ligero en bundle size
5. Sintaxis más simple: `getIcon('mapPin', 18)`
6. No requiere refactorización

**Usar Hero Icons solo si:**
- Necesitas el estilo specific de Tailwind UI
- Quieres la variante Solid para énfasis visual
- Tienes un icono específico que no existe en Lucide

---

## 🔧 **Cómo Agregar Hero Icons al Sistema Actual**

Si decides agregar Hero Icons al sistema centralizado:

```tsx
// src/config/icons.tsx
import { MapPinIcon as HeroMapPin } from '@heroicons/react/24/outline';
import { ScaleIcon as HeroScale } from '@heroicons/react/24/solid';

export const SYSTEM_ICONS = {
  // Lucide (actual)
  mapPin: MapPin,
  gavel: Gavel,
  userRound: UserRound,
  
  // Hero Icons (nuevos)
  heroMapPin: HeroMapPin,
  heroScale: HeroScale,
};
```

Uso:
```tsx
{getIcon('mapPin', 18)}      // Lucide
{getIcon('heroMapPin', 18)}  // Hero Icons
```
