# Migración: Campo advogado_responsavel Obligatorio

## 📋 Resumen
El campo `advogado_responsavel` ahora es obligatorio (NOT NULL) tanto en la base de datos como en el frontend. Todo proceso jurídico debe tener un abogado responsable asignado.

## 🎯 Justificación
En una oficina jurídica, todo caso debe tener un responsable asignado para:
- Trazabilidad y responsabilidad clara
- Filtrado eficiente de casos por abogado
- Cumplimiento de requisitos legales y administrativos
- Mejor organización del trabajo

## ✅ Cambios Implementados

### 1. Base de Datos

#### Script de Migración
**Archivo:** [database/migration-advogado-responsavel-required.sql](../database/migration-advogado-responsavel-required.sql)

**Pasos de ejecución:**
```sql
-- 1. Verificar procesos sin abogado
SELECT id, titulo, advogado_responsavel 
FROM processos_juridicos 
WHERE advogado_responsavel IS NULL;

-- 2. Asignar abogado por defecto (si hay casos sin asignar)
UPDATE processos_juridicos 
SET advogado_responsavel = (
  SELECT id FROM usuarios 
  WHERE role IN ('admin', 'advogado') 
  AND ativo = true 
  LIMIT 1
)
WHERE advogado_responsavel IS NULL;

-- 3. Aplicar restricción NOT NULL
ALTER TABLE processos_juridicos 
ALTER COLUMN advogado_responsavel SET NOT NULL;
```

#### Schema Actualizado
**Archivo:** [database/schema.sql](../database/schema.sql)
- ✅ Columna `advogado_responsavel UUID NOT NULL`
- ✅ Mantiene `ON DELETE SET NULL` (cambiará a RESTRICT en producción)

### 2. Frontend (TypeScript)

#### Tipos Actualizados
**Archivo:** [src/types/processo.ts](../src/types/processo.ts)

**Antes:**
```typescript
export interface ProcessoJuridico {
  advogado_responsavel?: string  // Opcional
}
```

**Después:**
```typescript
export interface ProcessoJuridico {
  advogado_responsavel: string  // Obligatorio ✅
}
```

#### Formulario Actualizado
**Archivo:** [src/pages/ProcessosPage.tsx](../src/pages/ProcessosPage.tsx)

**Cambios:**
- ✅ Label con asterisco rojo: `Advogado Responsável *`
- ✅ Atributo `required` en el select
- ✅ Validación visual para campo obligatorio

#### Validación en Hook
**Archivo:** [src/hooks/forms/useProcessoForm.ts](../src/hooks/forms/useProcessoForm.ts)

**Validación agregada:**
```typescript
if (!formData.advogado_responsavel) {
  warning('Selecione um advogado responsável')
  return
}
```

## 🔄 Proceso de Migración

### Para Base de Datos Existente:

1. **Hacer backup** de la tabla `processos_juridicos`
   ```sql
   -- Supabase tiene backups automáticos, pero puedes hacer uno manual
   ```

2. **Identificar casos problemáticos**
   ```sql
   SELECT COUNT(*) 
   FROM processos_juridicos 
   WHERE advogado_responsavel IS NULL;
   ```

3. **Asignar abogado por defecto**
   - Opción A: Primer admin/abogado disponible
   - Opción B: Usuario que creó el proceso
   - Opción C: Asignación manual caso por caso

4. **Ejecutar migración**
   ```bash
   # En Supabase SQL Editor
   # Copiar y ejecutar: migration-advogado-responsavel-required.sql
   ```

5. **Verificar**
   ```sql
   SELECT column_name, is_nullable 
   FROM information_schema.columns
   WHERE table_name = 'processos_juridicos'
   AND column_name = 'advogado_responsavel';
   -- Resultado esperado: is_nullable = 'NO'
   ```

### Para Nueva Instalación:
- Ejecutar `schema.sql` actualizado directamente
- El campo ya estará como NOT NULL desde el inicio

## 🧪 Testing

### Test Case 1: Crear proceso sin abogado
**Esperado:** ❌ Error de validación
```
Input: Formulario sin seleccionar abogado
Output: Warning "Selecione um advogado responsável"
```

### Test Case 2: Crear proceso con abogado
**Esperado:** ✅ Creación exitosa
```
Input: Formulario con abogado seleccionado
Output: Proceso creado correctamente
```

### Test Case 3: Editar proceso sin cambiar abogado
**Esperado:** ✅ Actualización exitosa
```
Input: Editar título manteniendo abogado existente
Output: Cambios guardados correctamente
```

### Test Case 4: Intentar enviar form vacío
**Esperado:** ❌ HTML5 validation
```
Input: Click en "Guardar" sin llenar campos
Output: Navegador marca campo requerido
```

## ⚠️ Consideraciones Importantes

1. **Migración Retroactiva**
   - Afecta todos los procesos existentes
   - Puede requerir asignación manual de abogados a casos antiguos

2. **Permisos de Usuarios**
   - Solo administradores pueden cambiar abogado responsable en procesos existentes
   - Al crear proceso, cualquier usuario con permisos asigna abogado

3. **Políticas RLS**
   - Verificar que las políticas RLS permitan UPDATE de este campo
   - Considerar restricciones adicionales por rol

4. **ON DELETE Behavior**
   - Actualmente: `ON DELETE SET NULL` (conflicto con NOT NULL)
   - **Recomendación:** Cambiar a `ON DELETE RESTRICT` para prevenir eliminación de abogados con casos asignados
   - **Alternativa:** Crear trigger para reasignar casos antes de eliminar usuario

## 🔧 Ajuste Recomendado (Opcional)

```sql
-- Cambiar comportamiento de eliminación
ALTER TABLE processos_juridicos
DROP CONSTRAINT processos_juridicos_advogado_responsavel_fkey;

ALTER TABLE processos_juridicos
ADD CONSTRAINT processos_juridicos_advogado_responsavel_fkey
FOREIGN KEY (advogado_responsavel) 
REFERENCES usuarios(id) 
ON DELETE RESTRICT;  -- Previene eliminar abogado con casos
```

## 📊 Impacto en la Aplicación

### Positivo ✅
- Mejora integridad de datos
- Trazabilidad completa de responsabilidades
- Filtrado más confiable por abogado
- Cumplimiento de mejores prácticas

### Cuidado ⚠️
- Requiere migración cuidadosa de datos existentes
- Proceso de creación tiene paso adicional obligatorio
- Necesita comunicación clara a usuarios

## 📝 Checklist de Implementación

- [x] Crear script de migración SQL
- [x] Actualizar schema.sql principal
- [x] Actualizar tipos TypeScript
- [x] Agregar validación en hook useProcessoForm
- [x] Actualizar formulario (required + asterisco)
- [x] Documentar cambios
- [ ] Ejecutar migración en Supabase
- [ ] Asignar abogados a procesos sin responsable
- [ ] Verificar restricción aplicada
- [ ] Testing completo del formulario
- [ ] Comunicar cambio a usuarios finales
- [ ] Considerar cambiar ON DELETE a RESTRICT

## 🚀 Próximos Pasos

1. **Ejecutar en Desarrollo:** Probar migración en ambiente de desarrollo primero
2. **Validar Datos:** Asegurarse que todos los procesos tienen abogado asignado
3. **Testing:** Probar creación/edición de procesos
4. **Ejecutar en Producción:** Con ventana de mantenimiento si es necesario
5. **Monitorear:** Verificar que no haya errores después del despliegue

---

**Fecha:** 29 de enero de 2026  
**Tipo de cambio:** Breaking change (requiere migración de datos)  
**Prioridad:** Alta  
**Impacto:** Base de datos + Frontend
