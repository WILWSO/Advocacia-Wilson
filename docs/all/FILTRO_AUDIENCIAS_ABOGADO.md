# Filtros de Audiencias

## 📋 Descripción

Sistema de filtrado de audiencias con dos criterios principales:
1. **Por abogado responsable del proceso** - Basado en la relación transitiva Audiencia → Proceso → Abogado
2. **Por proceso jurídico** - Filtra directamente por el proceso al que pertenece la audiencia

Cada audiencia está vinculada a un proceso, y cada proceso tiene un abogado asignado, permitiendo filtrar las audiencias por estos criterios.

**⚖️ Nota importante:** En una oficina jurídica, los administradores (`role='admin'`) también ejercen funciones de abogado y manejan casos. Por lo tanto, el filtro de abogados incluye tanto usuarios con `role='advogado'` como `role='admin'`.

## 🔗 Relación de Datos

```
Audiencia → Proceso Jurídico → Abogado
   |              |                |
proceso_id   advogado_responsavel  id
```

**Filtros disponibles:**

### 1. Filtro por Abogado (indirecto)
- Usa relación transitiva: Audiencia → Proceso → Abogado
- Flujo: `audiencia.proceso_id → processos_juridicos.advogado_responsavel → usuarios.id`

### 2. Filtro por Proceso (directo)
- Usa relación directa: Audiencia → Proceso
- Flujo: `audiencia.proceso_id → processos_juridicos.id`

## 🎯 Características Implementadas

### 1. Hook `useAdvogados`
**Ubicación:** [src/hooks/data-access/useAdvogados.ts](src/hooks/data-access/useAdvogados.ts)

**Funcionalidad:**
- Carga lista de abogados y administradores activos desde la tabla `usuarios`
- Filtra por `role IN ('admin', 'advogado')` y `ativo=true`
- ⚠️ **Importante:** Los admins también ejercen como abogados en la oficina jurídica
- Ordena alfabéticamente por nombre
- Expone: `advogados`, `loading`, `error`, `refetch()`

**Tipo de datos:**
```typescript
interface Advogado {
  id: string;
  nome: string;
  nome_completo: string | null;
  email: string;
  role: 'admin' | 'advogado'; // ✨ Incluye ambos roles
}
```

### 2. Hook `useAudiencias` Actualizado
**Ubicación:** [src/hooks/data-access/useAudiencias.ts](src/hooks/data-access/useAudiencias.ts)

**Cambios:**
- Ahora acepta opciones: `{ procesoId?, advogadoId? }`
- Query incluye `advogado_id` en el JOIN con `processos_juridicos`
- Filtrado por abogado se hace en el cliente (post-query) debido a relación anidada
- useEffect se actualiza cuando cambia `advogadoId`

**Ejemplo de uso:**
```typescript
const { audiencias } = useAudiencias({ 
  advogadoId: 'uuid-del-abogado' 
});
```

### 3. Hook `useAudienciaForm` Actualizado
**Ubicación:** [src/hooks/forms/useAudienciaForm.ts](src/hooks/forms/useAudienciaForm.ts)

**Cambios:**
- Acepta opciones de filtrado: `UseAudienciaFormOptions`
- Propaga opciones al hook `useAudiencias`
- Mantiene compatibilidad con uso sin filtros

### 4. Tipo `AudienciaWithProcesso` Extendido
**Ubicación:** [src/types/audiencia.ts](src/types/audiencia.ts)

**Cambios:**
```typescript
export interface AudienciaWithProcesso extends Audiencia {
  proceso?: {
    numero_processo: string;
    titulo: string;
    advogado_id?: string; // ✨ Nuevo campo
  };
}
```

### 5. Interfaz de Usuario en AgendaPage
**Ubicación:** [src/pages/AgendaPage.tsx](src/pages/AgendaPage.tsx)

**Elementos añadidos:**
- Selector dropdown con lista de abogados (incluye admins con 👑)
- Badge "Filtro activo" cuando hay filtro aplicado
- Botón para limpiar filtro (X)
- Estilos visuales diferenciales cuando filtro está activo (borde azul, fondo azul claro)
- Diseño responsive (label oculto en móvil)
- Integrado en el panel de controles de navegación
- Los administradores aparecen con emoji 👑 para distinguirlos

**Estados:**
```typescript
const [selectedAdvogado, setSelectedAdvogado] = useState<string>('todos');
```

## 🎨 Interfaz de Usuario

### Desktop
```
┌─────────────────────────────────────────────────────────────┐
│ [<] [Hoy] [>]  Enero 2026        [Mes][Semana][Día][Lista] │
├─────────────────────────────────────────────────────────────┤
│ 👤 Abogado: [Todos los Abogados ▼]  [Filtro activo] [X]   │
└─────────────────────────────────────────────────────────────┘
```

### Mobile
```
┌────────────────────────────┐
│ [<] [Hoy] [>]  Enero 2026 │
│ [Mes][Semana][Día][Lista] │
├────────────────────────────┤
│ 👤 [Todos ▼]            [X]│
└────────────────────────────┘
```

## 🔄 Flujo de Funcionamiento

1. **Carga inicial:**
   - `useAdvogados` carga lista de abogados
   - `useAudiencias` carga todas las audiencias con datos del proceso

2. **Selección de filtro:**
   - Usuario selecciona abogado del dropdown
   - `setSelectedAdvogado(advogadoId)` actualiza estado
   - `useAudienciaForm` recibe nuevo `advogadoId`
   - `useAudiencias` detecta cambio en dependencia
   - Re-ejecuta `fetchAudiencias()`
   - Filtra audiencias donde `proceso.advogado_id === advogadoId`
   - Actualiza vista de calendario/lista

3. **Limpiar filtro:**
   - Click en botón X o selección de "Todos"
   - `setSelectedAdvogado('todos')`
   - `advogadoId` pasa a `undefined`
   - Muestra todas las audiencias

## 📊 Rendimiento

**Optimizaciones:**
- Query única trae todos los datos necesarios (JOIN eficiente)
- Filtrado en cliente evita múltiples llamadas al servidor
- useEffect con dependencias específicas previene re-renders innecesarios
- Lista de abogados se carga una sola vez (sin dependencias en useEffect)

**Consideraciones futuras:**
- Si hay muchas audiencias (>1000), considerar filtrado en servidor
- Implementar paginación si es necesario
- Agregar índice en `processos_juridicos(advogado_id)` en BD

## 🧪 Testing Manual

### Caso 1: Sin filtro
- [x] Debe mostrar todas las audiencias
- [x] Dropdown muestra "Todos los Abogados"
- [x] No aparece badge "Filtro activo"
- [x] Botón X no se muestra

### Caso 2: Con filtro
- [x] Seleccionar abogado del dropdown
- [x] Solo aparecen audiencias de procesos del abogado
- [x] Dropdown tiene borde azul y fondo azul claro
- [x] Aparece badge "Filtro activo"
- [x] Botón X visible y funcional

### Caso 3: Limpiar filtro
- [x] Click en X limpia filtro
- [x] Vuelve a "Todos los Abogados"
- [x] Muestra todas las audiencias nuevamente

### Caso 4: Responsive
- [x] En móvil, label "Abogado:" se oculta (solo ícono)
- [x] Badge "Filtro activo" se oculta en móvil
- [x] Dropdown y botón X se ajustan correctamente

## 🔐 Permisos

**Todos los roles pueden:**
- Ver el filtro de abogados
- Filtrar audiencias por cualquier abogado
- Ver audiencias de todos los abogados (si no filtran)

**No hay restricciones especiales** ya que las audiencias son visibles según las políticas RLS de la base de datos.

## 📝 Archivos Modificados

1. ✅ [src/hooks/data-access/useAdvogados.ts](src/hooks/data-access/useAdvogados.ts) - Nuevo
2. ✅ [src/hooks/data-access/useAudiencias.ts](src/hooks/data-access/useAudiencias.ts) - Modificado
3. ✅ [src/hooks/forms/useAudienciaForm.ts](src/hooks/forms/useAudienciaForm.ts) - Modificado
4. ✅ [src/types/audiencia.ts](src/types/audiencia.ts) - Modificado
5. ✅ [src/pages/AgendaPage.tsx](src/pages/AgendaPage.tsx) - Modificado

## 🚀 Próximas Mejoras Sugeridas

1. **Filtros múltiples:**
   - Por fecha (hoy, esta semana, este mes)
   - Por tipo de audiencia
   - Por forma (presencial/virtual/híbrida)
   - Por estado (realizada, pendiente, cancelada)

2. **Estadísticas filtradas:**
   - Actualizar cards de "Hoy", "Esta Semana", "Próximas" según filtro activo

3. **Persistencia:**
   - Guardar filtro seleccionado en localStorage
   - Restaurar al recargar página

4. **Búsqueda avanzada:**
   - Búsqueda por número de proceso
   - Búsqueda por cliente del proceso
   - Filtro combinado (abogado + fecha + tipo)

5. **Exportación:**
   - Exportar audiencias filtradas a PDF/Excel
   - Incluir datos del abogado responsable

---

**Fecha de implementación:** 29 de enero de 2026  
**Desarrollador:** Sistema de IA  
**Versión:** 1.0
