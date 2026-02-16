-- =====================================================
-- MIGRATION: Implementar Ownership-based Permissions para Posts Sociais
-- Fecha: 16/02/2026
-- Objetivo: Advogados pueden crear posts, leer todos, 
--           pero UPDATE y DELETE únicamente en sus propias publicaciones
-- =====================================================

-- =====================================================
-- PASO 1: Verificar estructura actual de la tabla
-- =====================================================
SELECT 
    column_name AS "Campo",
    data_type AS "Tipo",
    is_nullable AS "¿Acepta NULL?",
    CASE 
        WHEN column_name = 'autor' AND is_nullable = 'NO' THEN '✓ Campo autor existe y es obligatorio'
        WHEN column_name = 'autor' THEN '⚠️ Campo autor existe pero acepta NULL'
        ELSE ''
    END AS "Validación"
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name = 'posts_sociais'
    AND column_name IN ('id', 'autor', 'titulo', 'publicado')
ORDER BY
    column_name;

-- =====================================================
-- PASO 2: Verificar posts sin autor (huérfanos)
-- =====================================================
-- ⚠️ Si este query retorna registros, necesitas asignarles un autor
-- antes de aplicar las nuevas políticas
SELECT 
    id,
    titulo,
    publicado,
    data_criacao,
    CASE 
        WHEN autor IS NULL THEN '❌ SIN AUTOR - Necesita corrección'
        ELSE '✓ Tiene autor asignado'
    END AS "Estado Autor"
FROM 
    public.posts_sociais
WHERE 
    autor IS NULL;

-- Si hay posts sin autor, puedes asignarlos a un usuario admin con:
-- UPDATE public.posts_sociais 
-- SET autor = 'UUID_DE_USUARIO_ADMIN' 
-- WHERE autor IS NULL;

-- =====================================================
-- PASO 3: Verificar políticas RLS actuales
-- =====================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd AS "Operación",
    CASE 
        WHEN cmd = 'SELECT' THEN 'Lectura'
        WHEN cmd = 'INSERT' THEN 'Crear'
        WHEN cmd = 'UPDATE' THEN 'Editar'
        WHEN cmd = 'DELETE' THEN 'Eliminar'
    END AS "Tipo"
FROM 
    pg_policies
WHERE 
    tablename = 'posts_sociais'
ORDER BY
    cmd;

-- =====================================================
-- PASO 4: DROP políticas existentes
-- =====================================================
DROP POLICY IF EXISTS "posts_select_policy" ON public.posts_sociais;
DROP POLICY IF EXISTS "posts_insert_policy" ON public.posts_sociais;
DROP POLICY IF EXISTS "posts_update_policy" ON public.posts_sociais;
DROP POLICY IF EXISTS "posts_delete_policy" ON public.posts_sociais;

-- Verificar que se eliminaron
SELECT COUNT(*) AS "Políticas Restantes (debe ser 0)" 
FROM pg_policies 
WHERE tablename = 'posts_sociais';

-- =====================================================
-- PASO 5: CREAR NUEVAS POLÍTICAS CON OWNERSHIP
-- =====================================================

-- 5.1 SELECT: Todos podem ver posts publicados, autenticados veem todos
-- ✅ SIN CAMBIOS - Lectura no requiere ownership
CREATE POLICY "posts_select_policy" 
ON public.posts_sociais FOR SELECT 
USING (
  publicado = true
  OR auth.role() = 'authenticated'
);

-- 5.2 INSERT: Admin y Advogado podem criar posts
-- ✅ SIN CAMBIOS - Creación no requiere ownership (aún no existe el post)
CREATE POLICY "posts_insert_policy" 
ON public.posts_sociais FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role IN ('admin', 'advogado')
  )
);

-- 5.3 UPDATE: Admin edita todo, Advogado SOLO sus propios posts
-- ✅ CAMBIO PRINCIPAL: Agregada validación de ownership para advogados
CREATE POLICY "posts_update_policy" 
ON public.posts_sociais FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.id = auth.uid()
    AND (
      -- Admin puede editar cualquier post
      usuarios.role = 'admin'
      OR (
        -- Advogado SOLO puede editar posts donde él es el autor
        usuarios.role = 'advogado' 
        AND posts_sociais.autor = auth.uid()
      )
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.id = auth.uid()
    AND (
      usuarios.role = 'admin'
      OR (
        usuarios.role = 'advogado' 
        AND posts_sociais.autor = auth.uid()
      )
    )
  )
);

-- 5.4 DELETE: Admin elimina todo, Advogado SOLO sus propios posts
-- ✅ CAMBIO PRINCIPAL: Advogados ahora pueden eliminar sus propios posts
CREATE POLICY "posts_delete_policy" 
ON public.posts_sociais FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.id = auth.uid()
    AND (
      -- Admin puede eliminar cualquier post
      usuarios.role = 'admin'
      OR (
        -- Advogado SOLO puede eliminar posts donde él es el autor
        usuarios.role = 'advogado' 
        AND posts_sociais.autor = auth.uid()
      )
    )
  )
);

-- =====================================================
-- PASO 6: Verificar nuevas políticas creadas
-- =====================================================
SELECT 
    policyname AS "Política",
    cmd AS "Operación",
    CASE 
        WHEN cmd = 'SELECT' THEN '✓ Todos ven publicados, autenticados ven todos'
        WHEN cmd = 'INSERT' THEN '✓ Admin + Advogado pueden crear'
        WHEN cmd = 'UPDATE' THEN '✓ Admin edita todo, Advogado solo sus posts'
        WHEN cmd = 'DELETE' THEN '✓ Admin elimina todo, Advogado solo sus posts'
    END AS "Comportamiento Esperado",
    CASE 
        WHEN policyname LIKE '%update%' OR policyname LIKE '%delete%' 
        THEN '🔒 OWNERSHIP ACTIVADO'
        ELSE 'Sin ownership'
    END AS "Ownership"
FROM 
    pg_policies
WHERE 
    tablename = 'posts_sociais'
ORDER BY
    CASE cmd
        WHEN 'SELECT' THEN 1
        WHEN 'INSERT' THEN 2
        WHEN 'UPDATE' THEN 3
        WHEN 'DELETE' THEN 4
    END;

-- =====================================================
-- PASO 7: Test de políticas (OPCIONAL - Solo para validación)
-- =====================================================
-- Estos queries pueden ejecutarse para verificar el comportamiento
-- Reemplazar 'UUID_ADVOGADO' y 'UUID_OTRO_ADVOGADO' con UUIDs reales

-- Test 1: Verificar que advogado puede ver sus propios posts
-- SET LOCAL ROLE authenticated;
-- SET LOCAL request.jwt.claim.sub = 'UUID_ADVOGADO';
-- SELECT id, titulo, autor FROM posts_sociais WHERE autor = 'UUID_ADVOGADO';
-- RESET ROLE;

-- Test 2: Verificar que advogado NO puede editar posts de otros
-- SET LOCAL ROLE authenticated;
-- SET LOCAL request.jwt.claim.sub = 'UUID_ADVOGADO';
-- UPDATE posts_sociais SET titulo = 'Test' WHERE autor = 'UUID_OTRO_ADVOGADO';
-- RESET ROLE;
-- Resultado esperado: 0 rows affected (bloqueado por RLS)

-- =====================================================
-- PASO 8: Índices de rendimiento (si no existen)
-- =====================================================
-- Mejorar performance de queries con filtro por autor
CREATE INDEX IF NOT EXISTS idx_posts_sociais_autor 
ON public.posts_sociais(autor);

-- Verificar índices existentes
SELECT 
    indexname AS "Índice",
    indexdef AS "Definición"
FROM 
    pg_indexes
WHERE 
    tablename = 'posts_sociais'
    AND indexname LIKE '%autor%';

-- =====================================================
-- RESUMEN DE CAMBIOS
-- =====================================================
-- ✅ Políticas RLS actualizadas con ownership-based permissions
-- ✅ Admin mantiene acceso total (sin cambios)
-- ✅ Advogado puede crear posts (sin cambios)
-- ✅ Advogado puede leer todos los posts (sin cambios)
-- 🔒 Advogado SOLO puede editar sus propios posts (NUEVO)
-- 🔒 Advogado SOLO puede eliminar sus propios posts (NUEVO)
-- ✅ Índice en campo 'autor' para mejor performance

-- =====================================================
-- VALIDACIÓN FINAL
-- =====================================================
-- Ejecutar este query para confirmar que todo está correcto:
SELECT 
    'Políticas Creadas' AS "Check",
    COUNT(*) AS "Cantidad",
    CASE 
        WHEN COUNT(*) = 4 THEN '✓ CORRECTO'
        ELSE '❌ ERROR: Deberían ser 4 políticas'
    END AS "Estado"
FROM 
    pg_policies
WHERE 
    tablename = 'posts_sociais'
UNION ALL
SELECT 
    'Posts sin Autor',
    COUNT(*),
    CASE 
        WHEN COUNT(*) = 0 THEN '✓ CORRECTO'
        ELSE '⚠️ Hay posts sin autor asignado'
    END
FROM 
    posts_sociais
WHERE 
    autor IS NULL
UNION ALL
SELECT 
    'Índice en Autor',
    COUNT(*),
    CASE 
        WHEN COUNT(*) > 0 THEN '✓ CORRECTO'
        ELSE '⚠️ Falta índice en campo autor'
    END
FROM 
    pg_indexes
WHERE 
    tablename = 'posts_sociais'
    AND indexname LIKE '%autor%';

-- =====================================================
-- ROLLBACK (en caso de necesitar revertir)
-- =====================================================
-- Para deshacer los cambios, ejecutar:
/*
DROP POLICY IF EXISTS "posts_select_policy" ON public.posts_sociais;
DROP POLICY IF EXISTS "posts_insert_policy" ON public.posts_sociais;
DROP POLICY IF EXISTS "posts_update_policy" ON public.posts_sociais;
DROP POLICY IF EXISTS "posts_delete_policy" ON public.posts_sociais;

-- Luego ejecutar el archivo rls-policies.sql original (versión anterior)
*/

-- =====================================================
-- NOTAS IMPORTANTES PARA EL FRONTEND
-- =====================================================
-- Después de ejecutar esta migración:
-- 1. Actualizar hook usePermissions con funciones canEditPost/canDeletePost
-- 2. Modificar SocialPage para permitir acceso a advogados
-- 3. Actualizar SocialPostCard para validar ownership antes de mostrar botones
-- 4. Probar con usuario advogado:
--    - Crear post ✓
--    - Editar su propio post ✓
--    - Editar post de otro advogado ✗ (debe fallar)
--    - Eliminar su propio post ✓
--    - Eliminar post de otro advogado ✗ (debe fallar)
-- =====================================================
