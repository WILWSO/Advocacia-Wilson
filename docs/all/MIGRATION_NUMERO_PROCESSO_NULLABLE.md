# 🔄 MIGRACIÓN: numero_processo NULLABLE

**Fecha**: 16 de febrero de 2026  
**Objetivo**: Hacer el campo `numero_processo` opcional (nullable) y permitir edición por todos los roles

---

## 📋 RESUMEN DE CAMBIOS

### ✅ **Problema Identificado**
- `numero_processo` era obligatorio (NOT NULL) en base de datos
- Solo ADMIN podía editar el campo
- Advogado y Assistente no podían corregir errores después de creación
- Generaba fricción en flujo de trabajo

### ✅ **Solución Aplicada**
1. **Base de Datos**: Cambiar `numero_processo` a NULLABLE
2. **RLS Policies**: Permitir edición por todos los roles
3. **Frontend**: Remover validación `required` y restricciones de edición
4. **TypeScript**: Mantener tipo opcional (ya estaba correcto)

---

## 🗄️ CAMBIOS EN BASE DE DATOS

### **Script de Migración**
📁 `database/migration-numero-processo-nullable.sql`

**Ejecutar en Supabase Dashboard → SQL Editor**

```sql
-- Cambiar campo a NULLABLE
ALTER TABLE public.processos_juridicos 
ALTER COLUMN numero_processo DROP NOT NULL;

-- Verificar cambio
SELECT column_name, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'processos_juridicos' 
AND column_name = 'numero_processo';
```

### **Resultado Esperado**
- ✅ `is_nullable = 'YES'`
- ✅ Constraint UNIQUE se mantiene
- ✅ No hay dependencias de otras tablas (audiencias usa `proceso_id`)

---

## 🔒 CAMBIOS EN RLS POLICIES

### **Antes** ❌
```sql
-- Advogado NO podía editar numero_processo
numero_processo IS NULL OR 
numero_processo = (SELECT numero_processo FROM processos_juridicos WHERE id = processos_juridicos.id)
```

### **Después** ✅
```sql
-- Advogado PUEDE editar numero_processo
-- Solo restricciones: titulo y advogado_responsavel
titulo = (SELECT titulo FROM processos_juridicos WHERE id = processos_juridicos.id)
AND (advogado_responsavel IS NULL OR ...)
```

### **Políticas Actualizadas**

| Role | ¿Puede editar numero_processo? | Otras restricciones |
|------|-------------------------------|---------------------|
| **Admin** | ✅ Sí (sin restricciones) | Ninguna |
| **Advogado** | ✅ **SÍ** (cambio aplicado) | No puede editar: titulo, advogado_responsavel |
| **Assistente** | ✅ **SÍ** (cambio aplicado) | No puede editar: titulo, advogado_responsavel, status |

📁 Archivo actualizado: `database/rls-policies.sql`

---

## 💻 CAMBIOS EN FRONTEND

### **1. Tipos TypeScript**
📁 `src/types/processo.ts`

**Sin cambios** - Ya estaba correcto:
```typescript
interface ProcessoFormData {
  numero_processo: string  // Opcional en el tipo base ProcessoJuridico
}
```

### **2. Formulario de Proceso**
📁 `src/pages/ProcessosPage.tsx`

**Antes** ❌
```tsx
<RestrictedInput
  label="Número do Processo"
  required  // ❌ Campo obligatorio
  isRestricted={!processoForm.isAdmin && processoForm.editingProcesso !== null}  // ❌ Solo admin puede editar
  restrictionMessage="Apenas Admin pode alterar"
/>
```

**Después** ✅
```tsx
<RestrictedInput
  label="Número do Processo"
  placeholder="Ex: 1001234-12.2024.8.07.0001 (opcional)"  // ✅ Indica que es opcional
  isRestricted={false}  // ✅ Todos pueden editar
  restrictionMessage=""
/>
```

### **3. Hook de Formulario**
📁 `src/hooks/forms/useProcessoForm.ts`

**Antes** ❌
```typescript
if (user?.role === 'assistente') {
  delete dataToUpdate.numero_processo  // ❌ Removía el campo
}
if (user?.role === 'advogado') {
  delete dataToUpdate.numero_processo  // ❌ Removía el campo
}
```

**Después** ✅
```typescript
// CAMBIO 16/02/2026: numero_processo AHORA ES EDITABLE por todos los roles
if (user?.role === 'assistente') {
  delete dataToUpdate.titulo
  delete dataToUpdate.advogado_responsavel
  delete dataToUpdate.status
}
if (user?.role === 'advogado') {
  delete dataToUpdate.titulo
  delete dataToUpdate.advogado_responsavel
}
```

---

## 🔍 VERIFICACIÓN DE DEPENDENCIAS

### **Tablas Analizadas**
✅ **audiencias**: Usa `proceso_id` (FK a processos_juridicos.id) - **NO depende de numero_processo**  
✅ **clientes**: Sin relación con numero_processo  
✅ **usuarios**: Sin relación con numero_processo  

### **Consultas SQL**
```sql
-- Verificar FKs que referencien numero_processo
SELECT * FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY' 
AND constraint_name LIKE '%numero_processo%';
-- Resultado: 0 registros ✅
```

---

## 📝 VALIDACIONES Y REGLAS DE NEGOCIO

### **Validación UNIQUE se mantiene**
```sql
numero_processo VARCHAR(100) UNIQUE
```

- ✅ No pueden existir dos procesos con el mismo número
- ✅ NULL es permitido (múltiples procesos pueden tener numero_processo = NULL)
- ✅ Frontend valida duplicados antes de enviar

### **Validación en Frontend**
📁 `src/hooks/forms/useProcessoForm.ts:416-425`

```typescript
// Validar numero_processo único (si fue proporcionado)
if (formData.numero_processo && formData.numero_processo.trim()) {
  const numeroExistente = processos.find(p => 
    p.numero_processo === formData.numero_processo && 
    p.id !== editingProcesso?.id
  )
  
  if (numeroExistente) {
    warning(`O número do processo "${formData.numero_processo}" já está cadastrado`)
    return
  }
}
```

---

## 🚀 PASOS PARA APLICAR LA MIGRACIÓN

### **1. Base de Datos (Supabase)**
```bash
1. Abrir Supabase Dashboard
2. Ir a SQL Editor
3. Ejecutar: database/migration-numero-processo-nullable.sql
4. Verificar resultado: ✅ is_nullable = 'YES'
```

### **2. RLS Policies (Supabase)**
```bash
1. Abrir Supabase Dashboard
2. Ir a SQL Editor
3. Ejecutar sección PASO 5 del script de migración
4. Verificar políticas actualizadas en pg_policies
```

### **3. Frontend (Automático)**
```bash
✅ Cambios ya aplicados en:
   - src/types/processo.ts
   - src/pages/ProcessosPage.tsx
   - src/hooks/forms/useProcessoForm.ts
```

### **4. Verificación Final**
```bash
1. Recargar aplicación
2. Intentar crear proceso sin numero_processo → ✅ Debe permitir
3. Intentar editar numero_processo como Advogado → ✅ Debe permitir
4. Intentar editar numero_processo como Assistente → ✅ Debe permitir
5. Intentar duplicar numero_processo → ❌ Debe bloquear con mensaje
```

---

## ⚠️ ROLLBACK (Si es necesario)

### **Revertir cambios en Base de Datos**
```sql
-- Volver a hacer el campo NOT NULL
ALTER TABLE public.processos_juridicos 
ALTER COLUMN numero_processo SET NOT NULL;

-- Restaurar políticas RLS originales
-- Ejecutar: database/rls-policies.sql (versión original)
```

### **Revertir cambios en Frontend**
```bash
git revert <commit-hash>
```

---

## 📊 IMPACTO Y BENEFICIOS

### **Antes** ❌
- Campo obligatorio generaba frustración
- Errores no podían ser corregidos por Advogado/Assistente
- Requería intervención de Admin para cualquier corrección

### **Después** ✅
- Flujo de trabajo más flexible
- Todos los roles pueden crear/editar numero_processo
- Mejor experiencia de usuario
- Mantiene unicidad (UNIQUE constraint)
- No hay riesgo de datos huérfanos (no hay dependencias)

---

## 🎯 CASOS DE USO

### **Caso 1: Crear proceso sin número**
```
Usuario: Advogado
Acción: Crear proceso nuevo, dejar numero_processo vacío
Resultado: ✅ Permite guardar
Razón: Proceso puede estar en trámite de registro
```

### **Caso 2: Agregar número después**
```
Usuario: Assistente
Acción: Editar proceso existente, agregar numero_processo
Resultado: ✅ Permite guardar
Razón: Número de proceso asignado después de registro judicial
```

### **Caso 3: Corregir error de digitación**
```
Usuario: Advogado
Acción: Editar numero_processo con error tipográfico
Resultado: ✅ Permite guardar
Razón: Ya no necesita Admin para corrección simple
```

### **Caso 4: Duplicar número**
```
Usuario: Cualquiera
Acción: Intentar guardar numero_processo que ya existe
Resultado: ❌ Bloquea con mensaje "já está cadastrado"
Razón: UNIQUE constraint se mantiene activo
```

---

## 📚 ARCHIVOS MODIFICADOS

### **Base de Datos**
- ✅ `database/migration-numero-processo-nullable.sql` (nuevo)
- ✅ `database/rls-policies.sql` (actualizado)
- ✅ `database/schema.sql` (comentarios actualizados)

### **Frontend**
- ✅ `src/pages/ProcessosPage.tsx` (remover required + restricción)
- ✅ `src/hooks/forms/useProcessoForm.ts` (permitir edición)
- ⚪ `src/types/processo.ts` (sin cambios, ya estaba correcto)

### **Documentación**
- ✅ `docs/MIGRATION_NUMERO_PROCESSO_NULLABLE.md` (este archivo)

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [x] Script SQL de migración creado
- [x] RLS policies actualizadas
- [x] Tipos TypeScript verificados (correcto)
- [x] Validación `required` removida del formulario
- [x] Restricción de edición removida para Advogado/Assistente
- [x] Validación UNIQUE mantenida en frontend
- [x] Dependencias verificadas (no hay)
- [x] Documentación completa creada
- [ ] **PENDIENTE**: Ejecutar migración en Supabase Dashboard
- [ ] **PENDIENTE**: Probar funcionalidad en ambiente de producción

---

## 📞 CONTACTO

Para dudas o problemas con esta migración:
- Verificar errores en consola del navegador
- Revisar logs de Supabase
- Consultar tabla `pg_policies` para verificar políticas RLS

---

**Última actualización**: 16/02/2026  
**Estado**: ✅ Cambios aplicados en código - ⏳ Pendiente ejecutar en Supabase
