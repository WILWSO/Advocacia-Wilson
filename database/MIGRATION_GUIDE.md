# Guía de Migración del Sistema

---

## 🗑️ ACTUALIZACIÓN 16/02/2026: Eliminación de Tablas Obsoletas

### Tablas Removidas
Las siguientes tablas fueron creadas pero **NUNCA utilizadas** en el frontend:

- ❌ **`documentos`** - Tabla polimórfica (eliminada)
- ❌ **`jurisprudencias`** - Tabla independiente (eliminada)

### Implementación Actual
El sistema usa **campos JSONB** en su lugar:

```typescript
// Documentos
clientes.documentos_cliente: DocumentoArquivo[]  // JSONB
processos_juridicos.documentos_processo: DocumentoArquivo[]  // JSONB

// Jurisprudencias
processos_juridicos.jurisprudencia: Jurisprudencia[]  // JSONB
```

### Scripts Relacionados
- 📄 [migration-eliminar-documentos-jurisprudencias.sql](database/migration-eliminar-documentos-jurisprudencias.sql) - Script de eliminación
- 📚 [ANALISIS_TABLAS_OBSOLETAS.md](docs/ANALISIS_TABLAS_OBSOLETAS.md) - Análisis completo

### Impacto
- ✅ Frontend: NINGUNO (nunca se usaron)
- ✅ Backend: Schema simplificado (-2 tablas, -11 índices, -8 policies)

---

# Guía de Migración: Audiencias de JSONB a Tabla Relacional

## 📋 Resumen
Esta migración convierte el campo `audiencias` (JSONB array) de la tabla `processos_juridicos` a una tabla relacional separada con relación 1:N.

## 🔄 Estado de la Migración

### ✅ Completado en Frontend
- [x] Tipos TypeScript actualizados ([src/types/processo.ts](src/types/processo.ts))
  - Eliminado `audiencias?: Audiencia[]` de `ProcessoJuridico`
  - Eliminado `audiencias: Audiencia[]` de `ProcessoFormData`
  - Agregado comentario de deprecación en interfaz `Audiencia`
  
- [x] Hook de formulario actualizado ([src/hooks/forms/useProcessoForm.ts](src/hooks/forms/useProcessoForm.ts))
  - Eliminado import de `Audiencia`
  - Eliminado `audienciasCrud` de useCrudArray
  - Eliminados estados de modales (`showAudienciaModal`, `showAudienciaViewModal`)
  - Eliminados handlers (`handleAddAudiencia`, `handleUpdateAudiencia`)
  - Eliminado campo `audiencias` de `initialFormData`
  - Eliminado campo `audiencias` de `handleSubmit`
  
- [x] Página de procesos actualizada ([src/pages/ProcessosPage.tsx](src/pages/ProcessosPage.tsx))
  - Eliminado import de `Calendar` de lucide-react
  - Eliminado `CrudListManager` de audiencias del formulario
  - Eliminada sección de audiencias del `ViewModal`

### 🔄 Pendiente en Base de Datos

#### 1. Verificar Datos Existentes
```sql
-- Ejecutar en Supabase SQL Editor
SELECT id, titulo, audiencias 
FROM processos_juridicos 
WHERE audiencias IS NOT NULL 
  AND audiencias != '[]'::jsonb 
  AND jsonb_array_length(audiencias) > 0;
```

#### 2. Migrar Datos a Nueva Tabla
Ejecutar script: [database/migration-datos-audiencias.sql](database/migration-datos-audiencias.sql)

**Características del script:**
- ✨ Extrae cada audiencia del array JSONB usando `jsonb_array_elements()`
- 🔄 Mapea campos flexiblemente (fecha/data, hora/horario, local/lugar)
- 🛡️ Asigna valores por defecto cuando faltan datos
- 🔒 Evita duplicados con `ON CONFLICT DO NOTHING`
- 📝 Preserva auditoría (creado_por, atualizado_por)

#### 3. Verificar Migración de Datos
```sql
-- Contar audiencias migradas
SELECT 
  COUNT(*) as total_audiencias_migradas,
  COUNT(DISTINCT proceso_id) as procesos_con_audiencias
FROM audiencias;

-- Ver ejemplos migrados
SELECT 
  a.fecha,
  a.hora,
  a.tipo,
  a.forma,
  p.numero_processo,
  p.titulo
FROM audiencias a
JOIN processos_juridicos p ON p.id = a.proceso_id
ORDER BY a.fecha DESC
LIMIT 20;
```

#### 4. Eliminar Campo JSONB (SOLO después de verificar)
Ejecutar script: [database/migration-eliminar-audiencias-jsonb.sql](database/migration-eliminar-audiencias-jsonb.sql)

```sql
-- ADVERTENCIA: Esta operación es IRREVERSIBLE
-- Solo ejecutar después de verificar que todos los datos fueron migrados correctamente
ALTER TABLE processos_juridicos DROP COLUMN IF EXISTS audiencias;
```

## 📊 Estructura Nueva vs Antigua

### Antes (JSONB)
```typescript
// processos_juridicos table
{
  id: uuid,
  titulo: string,
  audiencias: [  // ❌ Array JSONB embebido
    {
      data: date,
      horario: time,
      tipo: string,
      forma: string,
      lugar: string
    }
  ]
}
```

### Después (Relacional)
```typescript
// audiencias table
{
  id: uuid,
  proceso_id: uuid,  // ✅ Foreign Key a processos_juridicos
  fecha: date,
  hora: time,
  tipo: string,
  forma: 'presencial' | 'virtual' | 'hibrida',
  local: string,
  link_meet: string,
  observaciones: text,
  sincronizado_google: boolean,
  created_by: uuid,
  updated_by: uuid
}
```

## 🎯 Ventajas de la Nueva Estructura

1. **Mejor Performance**: Queries más eficientes con índices en campos individuales
2. **Integridad de Datos**: Foreign keys garantizan relaciones válidas
3. **Flexibilidad**: Fácil agregar nuevos campos sin modificar JSONB
4. **Búsquedas**: Filtrar y ordenar por fecha/hora directamente
5. **Auditoría**: Tracking individual de creación/modificación
6. **Integración**: Sincronización con Google Calendar más simple

## 📝 Orden de Ejecución

### Paso 1: Migración de Datos (database/migration-datos-audiencias.sql)
```bash
1. Abrir Supabase Dashboard
2. Ir a SQL Editor
3. Crear nueva query
4. Copiar contenido de migration-datos-audiencias.sql
5. Descomentar líneas 7-11 para verificar datos
6. Ejecutar para ver audiencias existentes
7. Si hay datos, ejecutar líneas 14-70 (INSERT)
8. Verificar con queries de líneas 73-88
```

### Paso 2: Eliminar Campo JSONB (database/migration-eliminar-audiencias-jsonb.sql)
```bash
⚠️ SOLO ejecutar después de verificar migración exitosa
1. Asegurarse que todas las audiencias están en la nueva tabla
2. Hacer backup si es necesario (Supabase tiene backups automáticos)
3. Ejecutar ALTER TABLE DROP COLUMN
4. Verificar que aplicación funciona correctamente
```

## 🔍 Validación Post-Migración

### Verificar Frontend
- [x] No hay errores de compilación TypeScript
- [x] ProcessosPage carga sin errores
- [x] Formulario de proceso funciona sin audiencias
- [ ] AgendaPage muestra audiencias desde nueva tabla

### Verificar Backend
- [ ] Campo `audiencias` eliminado de `processos_juridicos`
- [ ] Todas las audiencias están en tabla `audiencias`
- [ ] Foreign keys funcionan correctamente
- [ ] RLS policies aplicadas a tabla `audiencias`

## 🚀 Próximos Pasos

1. **Ejecutar migración de datos** (migration-datos-audiencias.sql)
2. **Verificar datos migrados** con queries de validación
3. **Eliminar campo JSONB** (migration-eliminar-audiencias-jsonb.sql)
4. **Integrar audiencias en ProcessosPage** (opcional)
   - Agregar sección que muestre audiencias relacionadas
   - Botón "Nueva Audiencia" que pre-llene proceso_id
5. **Completar funcionalidades de AgendaPage**
   - ViewModal para detalles de audiencia
   - Estadísticas reales (hoy, semana, próximas)
   - Vistas semanal y diaria
6. **Implementar sincronización Google Calendar**
   - Configurar OAuth 2.0
   - Agregar variables de entorno
   - Testing de sync

## 📚 Archivos Relevantes

### Scripts de Migración
- `database/migration-datos-audiencias.sql` - Migrar datos JSONB → tabla
- `database/migration-eliminar-audiencias-jsonb.sql` - Eliminar campo legacy

### Frontend Actualizado
- `src/types/processo.ts` - Tipos sin audiencias
- `src/hooks/forms/useProcessoForm.ts` - Hook sin lógica de audiencias
- `src/pages/ProcessosPage.tsx` - Página sin CrudListManager de audiencias

### Sistema de Audiencias (Nuevo)
- `src/types/audiencia.ts` - Tipos de audiencia relacional
- `src/hooks/data-access/useAudiencias.ts` - CRUD de audiencias
- `src/hooks/forms/useAudienciaForm.ts` - Lógica de formulario
- `src/components/admin/AudienciaFormModal.tsx` - Modal de formulario
- `src/components/agenda/CalendarioMes.tsx` - Vista mensual
- `src/components/agenda/CalendarioLista.tsx` - Vista de lista
- `src/pages/AgendaPage.tsx` - Página principal de agenda

## ⚠️ Advertencias

1. **Backup**: Supabase mantiene backups automáticos, pero considera crear uno manual antes
2. **Testing**: Probar en ambiente de desarrollo antes de producción
3. **Rollback**: Si algo falla, puedes restaurar el campo JSONB y datos desde backup
4. **Timing**: Ejecutar durante ventana de mantenimiento si hay usuarios activos

## ✅ Checklist de Migración

- [x] Frontend actualizado (tipos, hooks, componentes)
- [ ] Script de migración de datos ejecutado
- [ ] Datos verificados en nueva tabla
- [ ] Campo JSONB eliminado
- [ ] Aplicación testeada sin errores
- [ ] Usuarios notificados del cambio (si aplica)
- [ ] Documentación actualizada

---

**Fecha de creación**: 29 de enero de 2026  
**Autor**: Sistema de Migración Automatizada  
**Versión**: 1.0
