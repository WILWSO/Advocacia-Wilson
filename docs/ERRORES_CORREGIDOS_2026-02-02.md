# Corrección de Errores - AgendaPage y Sistema de Autenticación

**Fecha**: 2 de febrero de 2026  
**Estado**: ✅ Correcciones aplicadas

## Resumen de Errores Identificados

### 1. ❌ Error Crítico: Orden de Hooks en React (AgendaPage)

**Error**:
```
Warning: React has detected a change in the order of Hooks called by AgendaPage.
```

**Causa**: Los hooks de React deben llamarse siempre en el mismo orden en cada render. El hook `useProcessos` tenía un `useEffect` condicional que causaba que el orden de ejecución cambiara entre renders.

**Solución Aplicada**:
- ✅ Modificado [useProcessos.ts](../src/hooks/data-access/useProcessos.ts#L162-L182) para que los `useEffect` siempre se ejecuten
- ✅ La condicionalidad ahora está dentro de los hooks, no en su invocación
- ✅ Agregado `autoFetch: true` y `enablePolling: false` en [AgendaPage.tsx](../src/pages/AgendaPage.tsx#L105-L108)

**Archivos Modificados**:
- `src/pages/AgendaPage.tsx`
- `src/hooks/data-access/useProcessos.ts`

---

### 2. ❌ Error HTTP 406: Not Acceptable en Usuarios

**Error**:
```
xsdvhabwnvrfeoyharob.supabase.co/rest/v1/usuarios?select=*&id=eq.xxx: 
Failed to load resource: the server responded with a status of 406 ()
```

**Causa**: Faltaban headers HTTP requeridos en las peticiones a Supabase. El error 406 indica que el servidor no puede producir una respuesta que coincida con los tipos aceptados por el cliente.

**Solución Aplicada**:
- ✅ Agregados headers globales en el cliente de Supabase:
  - `Accept: application/json`
  - `Content-Type: application/json`
- ✅ Configurada persistencia de sesión y auto-refresh de tokens

**Archivo Modificado**:
- `src/lib/supabase.ts`

**Código Aplicado**:
```typescript
export const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
```

---

### 3. ❌ Error HTTP 409: Constraint de Clave Foránea en Clientes

**Error**:
```
insert or update on table "clientes" violates foreign key constraint 
"clientes_creado_por_fkey"
```

**Causa**: El trigger `audit_creado_por()` asigna `auth.uid()` al campo `creado_por`, pero si el usuario no existe en la tabla `usuarios`, viola la constraint de clave foránea.

**Solución Creada**:
- ✅ Creado script de migración: `database/migration-fix-creado-por-constraint.sql`
- ✅ El trigger ahora verifica si el usuario existe en `usuarios` antes de asignar
- ✅ Si el usuario no existe, deja `creado_por` como NULL (permitido por constraint)
- ✅ Función de sincronización automática de usuarios de `auth.users` a tabla `usuarios`

**Pasos para Aplicar** (ejecutar en Supabase Dashboard):

1. **Ejecutar la migración**:
   ```sql
   -- Abrir database/migration-fix-creado-por-constraint.sql
   -- Ejecutar todo el script en el SQL Editor de Supabase
   ```

2. **⚠️ IMPORTANTE - Error Email Duplicado**:
   
   Si obtienes el error:
   ```
   ERROR: 23505: duplicate key value violates unique constraint "usuarios_email_key"
   DETAIL: Key (email)=(xxx@xxx.com) already exists.
   ```
   
   **Causa**: Existe un usuario en `auth.users` con un email que ya está en la tabla `usuarios` pero con diferente `id`.
   
   **Solución Aplicada** (✅ Script actualizado el 03/02/2026):
   - El script ahora maneja automáticamente conflictos de email
   - Omite usuarios duplicados sin causar error
   - Incluye diagnóstico completo de conflictos

3. **Verificar sincronización**:
   ```sql
   SELECT 
       COUNT(*) as usuarios_auth,
       (SELECT COUNT(*) FROM usuarios) as usuarios_tabla
   FROM auth.users;
   ```

4. **Ejecutar diagnóstico** (incluido al final del script):
   - Identifica usuarios sin registro en `usuarios`
   - Muestra emails duplicados con diferentes IDs
   - Lista usuarios huérfanos (sin `auth.users`)
   - Proporciona resumen completo del estado

5. **Resultado Esperado**: Todos los usuarios de `auth.users` deben tener un registro correspondiente en `usuarios`, excepto aquellos con email duplicado.

---

### 4. ⚠️ Errores Menores (No Críticos)

#### Error de Extensión Zotero
```
zotero.js:300 Could not establish connection. Receiving end does not exist.
```
**Estado**: ⚠️ No requiere acción - Es una extensión de Chrome externa

#### Error de DevTools
```
Download the React DevTools for a better development experience
```
**Estado**: ℹ️ Informativo - Instalar React DevTools para debugging (opcional)

---

## Próximos Pasos

### 🔧 Tareas Pendientes

1. **Ejecutar migración de base de datos**:
   - [x] Abrir Supabase Dashboard → SQL Editor
   - [x] Ejecutar `database/migration-fix-creado-por-constraint.sql`

2. **Verificar políticas RLS**:
   - Asegurar que las políticas de `usuarios` permitan:
     - Lectura por `id` (para consultas de perfil)
     - Lectura de usuarios activos (para listados)
   - Archivo de referencia: `database/rls-policies.sql`

3. **Probar funcionalidad corregida**:
   - Recargar la aplicación
   - Navegar a AgendaPage
   - Crear un nuevo cliente
   - Verificar que no aparezcan errores en consola

---

## Verificación de Correcciones

### ✅ Checklist de Validación

- [x] El error de orden de hooks ya no aparece
- [x] Los headers HTTP están configurados
- [ ] La migración de base de datos está aplicada
- [ ] Se pueden crear clientes sin error 409
- [ ] Las consultas a usuarios retornan 200 (no 406)
- [ ] Todas las audiencias se cargan correctamente

---

## Información Técnica

### Archivos Modificados

| Archivo | Cambio | Estado |
|---------|--------|--------|
| `src/pages/AgendaPage.tsx` | Orden de hooks | ✅ |
| `src/hooks/data-access/useProcessos.ts` | useEffect incondicional | ✅ |
| `src/lib/supabase.ts` | Headers globales | ✅ |
| `database/migration-fix-creado-por-constraint.sql` | Nuevo trigger | ✅ Creado |

### Dependencias

- React 18+
- Supabase JS Client v2+
- PostgreSQL 14+

---

## Soporte y Debugging

### Errores Comunes Durante la Migración

#### ❌ Error: "duplicate key value violates unique constraint usuarios_email_key"

**Mensaje completo**:
```
ERROR: 23505: duplicate key value violates unique constraint "usuarios_email_key"
DETAIL: Key (email)=(lucsnasmelo@gmail.com) already exists.
```

**Causa**: 
- Existe un usuario en `auth.users` con un email que ya está registrado en la tabla `usuarios` pero con un `id` diferente
- Esto puede ocurrir cuando:
  - Se crearon usuarios manualmente en la tabla `usuarios`
  - Hubo migraciones previas parciales
  - Se restauró un backup desincronizado

**Solución**:
1. ✅ **Script actualizado** (03/02/2026) - Ahora maneja automáticamente este caso
2. Ejecuta el script actualizado: `database/migration-fix-creado-por-constraint.sql`
3. El script ahora:
   - Omite usuarios con email duplicado
   - No genera error en estos casos
   - Muestra un NOTICE informativo
   - Continúa con la siguiente inserción

**Diagnóstico Manual** (si persiste el problema):

```sql
-- Ver usuarios con email duplicado
SELECT 
    au.id as auth_id,
    u.id as usuarios_id,
    au.email,
    au.created_at as auth_created,
    u.data_criacao as usuarios_created
FROM auth.users au
INNER JOIN usuarios u ON au.email = u.email AND au.id != u.id;

-- Decidir qué registro mantener (el más antiguo):
-- Opción 1: Mantener el de usuarios y actualizar su ID al de auth.users
UPDATE usuarios 
SET id = (SELECT id FROM auth.users WHERE email = usuarios.email)
WHERE email = 'email_duplicado@example.com';

-- Opción 2: Eliminar el duplicado de usuarios y dejar que el script lo recree
DELETE FROM usuarios WHERE email = 'email_duplicado@example.com';
-- Luego re-ejecutar el script de migración
```

---

### Comandos Útiles

**Ver logs de aplicación**:
```bash
# En la terminal de desarrollo
npm run dev
```

**Ver logs de Supabase**:
```sql
-- En Supabase SQL Editor
SELECT * FROM pg_stat_activity 
WHERE datname = current_database();
```

**Verificar triggers activos**:
```sql
SELECT * FROM information_schema.triggers 
WHERE event_object_table = 'clientes';
```

### Contacto

Si persisten errores después de aplicar estas correcciones:
1. Verificar logs de consola del navegador
2. Verificar logs de Supabase Dashboard
3. Ejecutar queries de verificación del script de migración

---

**Última actualización**: 2026-02-03 (Script corregido para manejar emails duplicados)  
**Versión del documento**: 1.1
