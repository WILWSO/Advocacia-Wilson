# Análisis de Tablas Obsoletas - Advocacia Wilson

**Fecha:** 16/02/2026  
**Análisis realizado:** Backend vs Frontend Usage  
**Estado:** ✅ Completado

---

## 📋 Resumen Ejecutivo

Se identificaron **3 objetos de base de datos** creados pero **NO utilizados** en el frontend:

| Objeto | Tipo | Backend | Frontend | Decisión |
|--------|------|---------|----------|----------|
| `documentos` | Tabla | ✅ Existe | ❌ No usada | **🗑️ ELIMINAR** |
| `jurisprudencias` | Tabla | ✅ Existe | ❌ No usada | **🗑️ ELIMINAR** |
| `view_comentarios_count` | View | ✅ Existe | ❌ No usada | **✅ MANTENER** |

---

## 🔍 Análisis Detallado

### 1. Tabla `documentos`

#### Backend
- **Ubicación:** `database/schema.sql` (líneas 338-440)
- **Tipo:** Tabla polimórfica para múltiples entidades
- **Campos principales:**
  ```sql
  - id UUID
  - entity_type VARCHAR(50)  -- 'cliente', 'processo', etc.
  - entity_id UUID
  - nome_documento VARCHAR(255)
  - tipo_documento VARCHAR(100)
  - url_arquivo TEXT
  - tamanho_bytes INTEGER
  - mime_type VARCHAR(100)
  ```
- **Índices:** 6 (entity, entity_id, tipo, upload_por, data_upload, ativo)
- **RLS Policies:** 4 (SELECT, INSERT, UPDATE, DELETE)
- **Triggers:** 1 (update_documentos_updated_at)

#### Frontend
- **Búsqueda realizada:** `src/**/*.ts`, `src/**/*.tsx`
- **Queries encontradas:** ❌ **NINGUNA**
- **Patrón buscado:** `.from('documentos')`
- **Resultado:** 0 matches

#### Implementación Real
El sistema usa **campos JSONB** en lugar de esta tabla:

```typescript
// src/types/documento.ts
interface DocumentoArquivo {
  nome: string
  url: string
  tipo: string
  tamanho?: number
  data_upload?: string
}

// Usado en:
clientes.documentos_cliente: DocumentoArquivo[]  // JSONB
processos_juridicos.documentos_processo: DocumentoArquivo[]  // JSONB
```

**Razón para JSONB:**
- ✅ Más simple para casos de uso actuales
- ✅ No requiere JOINs adicionales
- ✅ Suficiente para almacenar metadatos básicos
- ✅ Integrado con Supabase Storage

#### Decisión: 🗑️ **ELIMINAR**
- No genera valor actualmente
- Aumenta complejidad del schema innecesariamente
- Si en el futuro se necesita, se puede recrear

---

### 2. Tabla `jurisprudencias`

#### Backend
- **Ubicación:** `database/schema.sql` (líneas 520-590)
- **Tipo:** Tabla independiente para referencias legales
- **Campos principales:**
  ```sql
  - id UUID
  - titulo VARCHAR(500)
  - ementa TEXT
  - link TEXT
  - documento UUID
  - processos_relacionados JSONB
  - notas TEXT
  ```
- **Índices:** 5 (ativo, documento, created_by, processos, busca_texto)
- **RLS Policies:** 4 (SELECT, INSERT, UPDATE, DELETE)
- **Triggers:** 3 (update, audit_insert, audit_update)
- **Características especiales:** Búsqueda de texto completo en portugués

#### Frontend
- **Búsqueda realizada:** `src/**/*.ts`, `src/**/*.tsx`
- **Queries encontradas:** ❌ **NINGUNA**
- **Patrón buscado:** `.from('jurisprudencias')`
- **Resultado:** 0 matches

#### Implementación Real
El sistema usa **campo JSONB** en `processos_juridicos`:

```typescript
// src/types/processo.ts
interface Jurisprudencia {
  ementa: string
  link: string
}

// Usado en:
processos_juridicos.jurisprudencia: Jurisprudencia[]  // JSONB
```

**Gestión en frontend:**
- Editado directamente en `ProcessosPage.tsx` (líneas 776-810)
- CRUD completo con `jurisprudenciasCrud` hook
- Almacenado como array JSONB en la tabla `processos_juridicos`

#### Decisión: 🗑️ **ELIMINAR**
- Funcionalidad implementada con JSONB
- Tabla independiente es overkill para el caso de uso actual
- JSONB es suficiente para almacenar referencias simples

---

### 3. View `view_comentarios_count`

#### Backend
- **Ubicación:** `database/comentarios-social-schema.sql` (línea 64)
- **Tipo:** View (agregación)
- **Definición:**
  ```sql
  CREATE OR REPLACE VIEW view_comentarios_count AS
  SELECT 
      post_id,
      COUNT(*) as total_comentarios
  FROM comentarios_posts_social
  WHERE aprovado = true
  GROUP BY post_id;
  ```

#### Frontend
- **Búsqueda realizada:** `src/**/*`
- **Referencias encontradas:** ❌ **NINGUNA**
- **Patrón buscado:** `view_comentarios_count`, `comentarios_count`

#### Implementación Real
El hook `useComments.ts` consulta directamente `comentarios_posts_social`:

```typescript
// src/hooks/data-access/useComments.ts
const { data, error } = await supabase
  .from('comentarios_posts_social')
  .select('*')
  .eq('post_id', postId)
  .eq('aprovado', true)
  .order('data_criacao', { ascending: false });

// Conteo manual:
setComentarios(data || []);
// En componente: {comentarios.length}
```

#### Decisión: ✅ **MANTENER**
**Razones:**
- Es **liviana** (solo una agregación sin materialización)
- **No genera overhead** significativo
- **Podría ser útil** para optimizar conteos en el futuro
- **No interfiere** con la funcionalidad actual
- Fácil de eliminar después si se confirma que no se necesita

---

## 📊 Impacto de la Eliminación

### Impacto en Frontend
```
❌ NINGUNO
```
Las tablas `documentos` y `jurisprudencias` **NUNCA** fueron consultadas desde el frontend.

### Impacto en Backend
- ✅ **Simplificación del schema** (-2 tablas, -11 índices, -8 policies, -4 triggers)
- ✅ **Reducción de overhead** de RLS y triggers
- ✅ **Menos confusión** para desarrolladores futuros
- ✅ **Menor complejidad** en migraciones futuras

### Impacto en Performance
- Neutral o positivo (menos objetos que mantener)
- Sin impacto en queries existentes

---

## 🚀 Migración de Eliminación

### Script Creado
**Archivo:** `database/migration-eliminar-documentos-jurisprudencias.sql`

### Contenido del Script
1. ✅ Verificación pre-eliminación (existen las tablas?)
2. ✅ Eliminación de RLS policies (4 por tabla)
3. ✅ Eliminación de triggers (1 + 3)
4. ✅ Eliminación de índices (6 + 5)
5. ✅ Eliminación de tablas con CASCADE
6. ✅ Verificación post-eliminación
7. ✅ Mensajes informativos con RAISE NOTICE

### Seguridad
- Usa `DROP TABLE IF EXISTS` (no falla si no existe)
- Usa `CASCADE` para eliminar dependencias automáticamente
- Verifica existencia antes de eliminar
- Proporciona logs detallados

---

## 📝 Pasos para Ejecutar

### 1. Revisar el Script
```bash
cat database/migration-eliminar-documentos-jurisprudencias.sql
```

### 2. Ejecutar en Supabase
1. Abrir **Supabase Dashboard**
2. Ir a **SQL Editor**
3. Copiar contenido del script
4. Ejecutar
5. Verificar mensajes de NOTICE

### 3. Verificar Resultado
```sql
-- Verificar que las tablas fueron eliminadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('documentos', 'jurisprudencias');
-- Debe retornar 0 filas
```

### 4. Limpiar Schema Principal (Opcional)
Considerar remover las definiciones de `schema.sql` para nuevas instalaciones:
- Líneas 338-440 (documentos)
- Líneas 520-590 (jurisprudencias)

---

## 🔄 Reversión (Si es Necesario)

Si en el futuro se necesitan estas tablas:

### Opción 1: Schema Original
```sql
-- Ver database/schema.sql líneas 338-440 y 520-590
```

### Opción 2: Migración Original
```sql
-- Ver database/migration-2025-01-29-complete.sql
```

### Opción 3: Backup Pre-Eliminación
Antes de ejecutar, hacer backup:
```sql
-- Backup de definiciones
pg_dump --schema-only --table=documentos > backup_documentos.sql
pg_dump --schema-only --table=jurisprudencias > backup_jurisprudencias.sql
```

---

## ✅ Checklist de Ejecución

- [ ] Revisar script de migración
- [ ] Verificar que frontend no usa las tablas (ya verificado ✅)
- [ ] Crear backup de schema (opcional pero recomendado)
- [ ] Ejecutar script en Supabase SQL Editor
- [ ] Verificar mensajes de NOTICE (deben mostrar éxito)
- [ ] Confirmar que tablas fueron eliminadas (SELECT count)
- [ ] Probar funcionalidad de documentos en frontend (debe seguir funcionando)
- [ ] Probar funcionalidad de jurisprudencias en frontend (debe seguir funcionando)
- [ ] Actualizar `schema.sql` para futuras instalaciones (opcional)
- [ ] Documentar en changelog o notas de versión

---

## 📚 Referencias

### Archivos Analizados
- `database/schema.sql` - Definiciones originales
- `database/migration-2025-01-29-complete.sql` - Migración inicial
- `src/types/documento.ts` - Interface DocumentoArquivo
- `src/types/processo.ts` - Interface Jurisprudencia
- `src/hooks/data-access/useComments.ts` - Hook de comentarios
- `src/pages/ProcessosPage.tsx` - Gestión de jurisprudencias

### Búsquedas Realizadas
```bash
# Búsqueda de uso de tabla documentos
grep -r ".from('documentos')" src/**/*.ts src/**/*.tsx
# Resultado: 0 matches

# Búsqueda de uso de tabla jurisprudencias
grep -r ".from('jurisprudencias')" src/**/*.ts src/**/*.tsx
# Resultado: 0 matches

# Búsqueda de uso de view
grep -r "view_comentarios_count" src/**/*
# Resultado: 0 matches
```

---

## 🎯 Conclusión

Las tablas `documentos` y `jurisprudencias` fueron diseñadas con buenas intenciones (normalización, escalabilidad), pero **nunca se implementaron** en el frontend. 

La solución actual con **campos JSONB** es:
- ✅ Más simple
- ✅ Suficiente para el caso de uso
- ✅ Mejor integrada con Supabase Storage
- ✅ Más fácil de mantener

**Recomendación:** Ejecutar el script de eliminación para simplificar el schema y reducir overhead innecesario.

---

**Última actualización:** 16/02/2026  
**Autor:** Sistema de Auditoría Automatizado  
**Estado:** ✅ Listo para ejecutar
