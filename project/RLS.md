# Políticas RLS (Row Level Security)

## Reglas de Negocio

1. **Creación de Usuarios**
   - Solo el **admin** puede crear nuevo usuario y la contraseña para brindar el ingreso al sistema

2. **Edición de Datos Personales**
   - Cada usuario puede editar sus propios datos y cambiar su propia contraseña
   - **IMPORTANTE**: Los usuarios NO pueden cambiar su propio **role** ni su **status (ativo/inativo)**
   - Solo el **admin** puede cambiar el role y el status de cualquier usuario

3. **Roles del Sistema**
   - Los usuarios necesitan de un "role"
   - Los roles admitidos son: **admin**, **advogado** y **assistente**

4. **Gestión de Processos y Clientes**
   - **Admin**, **advogado** y **assistente** pueden crear y editar **processos** y **clientes**
   - **Admin**, **advogado** y **assistente** pueden subir documentos
   - **RESTRICCIONES ESPECIALES**:
     - **Advogado** y **assistente** NO pueden editar el campo `nome_completo` en la tabla **clientes**
     - **Advogado** y **assistente** NO pueden editar el campo `numero_processo`, `titulo`, `advogado_responsavel` y en la tabla **processos_juridicos**
     - Solo **admin** puede modificar estos campos protegidos

5. **Eliminación de Registros**
   - Solo **admin** puede eliminar processos, clientes y usuarios

6. **Control de Status**
   - Solo **admin** puede dejar un usuario o cliente inactivo (cambiar status)
   - Solo **Admin** y **advogado** pueden editar el campo `status` en la tabla **processos_juridicos**
---

## Protecciones Implementadas

### 🔒 **Protección de ROLE**
- **Frontend**: Campo role solo visible para admin en formularios de edición
- **Validación**: Frontend no envía campo role si usuario no es admin
- **RLS Database**: Rechaza cualquier intento de cambio de role por usuario no-admin

### 🔒 **Protección de STATUS**
- **Frontend**: Campo status/ativo deshabilitado para usuarios no-admin
- **Validación**: Frontend no envía campo status si usuario no es admin  
- **RLS Database**: Rechaza cualquier intento de cambio de status por usuario no-admin

### 🔒 **Protección de NOME_COMPLETO (Clientes)**
- **Frontend**: Campo `nome_completo` deshabilitado para advogado y assistente al editar
- **UI**: Muestra mensaje "(Apenas admin pode editar)" cuando está deshabilitado
- **RLS Database**: Valida que el valor de `nome_completo` no cambie para no-admin
- **Comportamiento**: Advogado y assistente pueden crear clientes con cualquier nombre, pero no pueden modificarlo después

### 🔒 **Protección de NUMERO_PROCESSO (Processos Jurídicos)**
- **Frontend**: Campo `numero_processo` deshabilitado para advogado y assistente al editar
- **UI**: Muestra mensaje "(Apenas admin pode editar)" cuando está deshabilitado
- **RLS Database**: Valida que el valor de `numero_processo` no cambie para no-admin
- **Comportamiento**: Advogado y assistente pueden crear processos con cualquier número, pero no pueden modificarlo después

### 🔒 **Protección de TITULO (Processos Jurídicos)**
- **Frontend**: Campo `titulo` deshabilitado para advogado y assistente al editar
- **UI**: Muestra mensaje "(Apenas admin pode editar)" cuando está deshabilitado
- **RLS Database**: Valida que el valor de `titulo` no cambie para no-admin
- **Comportamiento**: Advogado y assistente pueden crear processos con cualquier título, pero no pueden modificarlo después

### 🔒 **Protección de STATUS (Processos Jurídicos)**
- **Frontend**: Campo `status` deshabilitado solo para assistente
- **UI**: Muestra mensaje "(Apenas admin e advogado podem editar)" para assistente
- **RLS Database**: Valida que assistente no pueda cambiar el status
- **Comportamiento**: Admin y advogado pueden cambiar el status, pero assistente no

### 🔒 **Protección de ADVOGADO_RESPONSAVEL (Processos Jurídicos)**
- **Frontend**: Campo `advogado_responsavel` deshabilitado para advogado y assistente al editar
- **UI**: Muestra mensaje "(Apenas admin pode editar)" cuando está deshabilitado
- **RLS Database**: Valida que el valor de `advogado_responsavel` no cambie para no-admin
- **Comportamiento**: Advogado y assistente pueden asignar un advogado al crear el processo, pero no pueden reasignarlo después. Solo admin puede cambiar el advogado responsable

---

## Matriz de Permisos por Rol

| Acción                            | Admin  | Advogado | Assistente |
|--------                           |------- |----------|------------|
| **Ver** clientes/processos        | ✅ | ✅ | ✅ |
| **Crear** clientes/processos      | ✅ | ✅ | ✅ |
| **Editar** clientes/processos     | ✅ | ✅ con restricciones | ✅ con restricciones |
| **Eliminar** clientes/processos   | ✅ | ❌ | ❌ |
| Editar `nome_completo` (clientes) | ✅ | ❌ | ❌ |
| Editar `numero_processo`          | ✅ | ❌ | ❌ |
| Editar `titulo` (processos)       | ✅ | ❌ | ❌ |
| Editar `advogado_responsavel`     | ✅ | ❌ | ❌ |
| Editar `status` (processos)       | ✅ | ✅ | ❌ |
| Cambiar `status` (clientes)       | ✅ | ❌ | ❌ |
| Crear **usuarios**                | ✅ | ❌ | ❌ |
| Editar **role** de usuarios       | ✅ | ❌ | ❌ |
| Cambiar **status** de usuarios    | ✅ | ❌ | ❌ |
| Eliminar **usuarios**             | ✅ | ❌ | ❌ |

---

## Archivos SQL del Proyecto

- **Políticas completas actualizadas**: `src/database/rls-policies.sql`
- **Script migración titulo/status**: `scripts/update-rls-titulo-status.sql` ⭐ **NUEVO**
- **Script migración assistente**: `scripts/update-rls-assistente-advogado.sql`
- **Solución definitiva**: `scripts/rls-definitive-solution.sql`
- **Fix protección role**: `scripts/fix-rls-usuarios-role-protection.sql`

### Scripts de Actualización

Para aplicar las nuevas políticas RLS con todas las restricciones, ejecute:

```sql
-- Ejecutar en Supabase SQL Editor
\i scripts/update-rls-titulo-status.sql
```

Este script actualiza las políticas para:
- Proteger el campo **titulo** en processos_juridicos (solo admin puede editar)
- Proteger el campo **advogado_responsavel** en processos_juridicos (solo admin puede reasignar)
- Permitir que **advogado** edite el campo **status** en processos_juridicos
- **Assistente** NO puede editar titulo, numero_processo, advogado_responsavel ni status

---

## Implementación Técnica

### Backend (Supabase RLS)

Las políticas RLS utilizan la cláusula `WITH CHECK` para validar que ciertos campos no cambien:

```sql
-- Ejemplo para clientes
WITH CHECK (
  -- Admin puede hacer cualquier cambio
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role = 'admin'
  )
  OR
  -- Advogado y assistente NO pueden cambiar nome_completo
  (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.role IN ('advogado', 'assistente')
    )
    AND nome_completo = (SELECT nome_completo FROM clientes WHERE id = clientes.id)
  )
)
```

### Frontend (React/TypeScript)

Los campos protegidos se deshabilitan condicionalmente:

```tsx
<input
  type="text"
  value={formData.nome_completo}
  onChange={(e) => setFormData({...formData, nome_completo: e.target.value})}
  disabled={!isAdmin && editingCliente !== null}
  className={cn(
    "w-full px-3 py-2 border rounded-lg",
    !isAdmin && editingCliente && "bg-gray-100 cursor-not-allowed opacity-75"
  )}
/>
```

---

## Verificación de Políticas

Para verificar las políticas RLS activas en Supabase:

```sql
SELECT 
  tablename, 
  policyname, 
  permissive, 
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING: ' || qual 
    ELSE '' 
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check 
    ELSE '' 
  END as with_check_clause
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('clientes', 'processos_juridicos', 'usuarios')
ORDER BY tablename, policyname;
```

---

## Notas Importantes

1. **Campos de Auditoría**: Los campos `creado_por` y `atualizado_por` se llenan automáticamente mediante triggers, no es necesario enviarlos desde el frontend.

2. **Validación en Capas**: Las restricciones están implementadas en tres niveles:
   - **UI/Frontend**: Campos deshabilitados con feedback visual
   - **Lógica de Aplicación**: Validación antes de enviar al backend
   - **RLS Database**: Última línea de defensa, valida todas las operaciones

3. **Experiencia de Usuario**: Los usuarios ven claramente qué campos pueden editar y cuáles están protegidos con mensajes informativos.

4. **Flexibilidad**: Las políticas permiten crear registros sin restricciones, pero limitan la edición de campos críticos a solo admin.
