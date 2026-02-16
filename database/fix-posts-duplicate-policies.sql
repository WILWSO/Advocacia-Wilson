-- =====================================================
-- FIX: Eliminar Políticas Duplicadas en posts_sociais
-- Problema: Existen 6 políticas en lugar de 4
-- Solución: Eliminar TODAS y recrear correctamente
-- =====================================================

-- =====================================================
-- PASO 1: Identificar todas las políticas existentes
-- =====================================================
SELECT 
    policyname AS "Política Existente",
    cmd AS "Operación",
    CASE 
        WHEN policyname LIKE '%ownership%' THEN '🆕 Nueva (con ownership)'
        WHEN policyname LIKE '%policy' THEN '🔄 Política estándar'
        ELSE '❓ Desconocida'
    END AS "Tipo"
FROM 
    pg_policies
WHERE 
    tablename = 'posts_sociais'
ORDER BY
    cmd, policyname;

-- =====================================================
-- PASO 2: ELIMINAR TODAS LAS POLÍTICAS (incluyendo duplicadas)
-- =====================================================

-- Eliminar políticas estándar
DROP POLICY IF EXISTS "posts_select_policy" ON public.posts_sociais;
DROP POLICY IF EXISTS "posts_insert_policy" ON public.posts_sociais;
DROP POLICY IF EXISTS "posts_update_policy" ON public.posts_sociais;
DROP POLICY IF EXISTS "posts_delete_policy" ON public.posts_sociais;

-- Eliminar posibles variantes con ownership
DROP POLICY IF EXISTS "posts_select_policy_ownership" ON public.posts_sociais;
DROP POLICY IF EXISTS "posts_insert_policy_ownership" ON public.posts_sociais;
DROP POLICY IF EXISTS "posts_update_policy_ownership" ON public.posts_sociais;
DROP POLICY IF EXISTS "posts_delete_policy_ownership" ON public.posts_sociais;

-- Eliminar cualquier otra variante de nombre
DROP POLICY IF EXISTS "posts_select" ON public.posts_sociais;
DROP POLICY IF EXISTS "posts_insert" ON public.posts_sociais;
DROP POLICY IF EXISTS "posts_update" ON public.posts_sociais;
DROP POLICY IF EXISTS "posts_delete" ON public.posts_sociais;

-- Verificar que NO quedan políticas
SELECT 
    COUNT(*) AS "Políticas Restantes",
    CASE 
        WHEN COUNT(*) = 0 THEN '✓ CORRECTO - Todas eliminadas'
        ELSE '❌ ERROR - Aún quedan políticas'
    END AS "Estado"
FROM 
    pg_policies
WHERE 
    tablename = 'posts_sociais';

-- =====================================================
-- PASO 3: RECREAR LAS 4 POLÍTICAS CORRECTAS CON OWNERSHIP
-- =====================================================

-- 3.1 SELECT: Todos podem ver posts publicados, autenticados veem todos
CREATE POLICY "posts_select_policy" 
ON public.posts_sociais FOR SELECT 
USING (
  publicado = true
  OR auth.role() = 'authenticated'
);

-- 3.2 INSERT: Admin y Advogado podem criar posts
CREATE POLICY "posts_insert_policy" 
ON public.posts_sociais FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role IN ('admin', 'advogado')
  )
);

-- 3.3 UPDATE: Admin edita todo, Advogado SOLO sus propios posts
CREATE POLICY "posts_update_policy" 
ON public.posts_sociais FOR UPDATE 
USING (
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

-- 3.4 DELETE: Admin elimina todo, Advogado SOLO sus propios posts
CREATE POLICY "posts_delete_policy" 
ON public.posts_sociais FOR DELETE 
USING (
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

-- =====================================================
-- PASO 4: VALIDACIÓN FINAL
-- =====================================================
SELECT 
    'Políticas Creadas' AS "Check",
    COUNT(*) AS "Cantidad",
    CASE 
        WHEN COUNT(*) = 4 THEN '✓ CORRECTO - Exactamente 4 políticas'
        ELSE CONCAT('❌ ERROR - Hay ', COUNT(*), ' políticas (deberían ser 4)')
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
-- PASO 5: Detalle de las 4 políticas creadas
-- =====================================================
SELECT 
    policyname AS "Política",
    cmd AS "Operación",
    CASE 
        WHEN cmd = 'SELECT' THEN '1️⃣ Lectura: Todos ven publicados, autenticados ven todos'
        WHEN cmd = 'INSERT' THEN '2️⃣ Crear: Admin + Advogado pueden crear'
        WHEN cmd = 'UPDATE' THEN '3️⃣ Editar: Admin todo, Advogado solo sus posts 🔒'
        WHEN cmd = 'DELETE' THEN '4️⃣ Eliminar: Admin todo, Advogado solo sus posts 🔒'
    END AS "Descripción",
    CASE 
        WHEN policyname LIKE '%update%' OR policyname LIKE '%delete%' 
        THEN '✅ OWNERSHIP ACTIVADO'
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
-- RESULTADO ESPERADO
-- =====================================================
-- Después de ejecutar este script:
-- ✓ posts_select_policy   | SELECT | Lectura sin ownership
-- ✓ posts_insert_policy   | INSERT | Crear sin ownership
-- ✓ posts_update_policy   | UPDATE | Editar con ownership 🔒
-- ✓ posts_delete_policy   | DELETE | Eliminar con ownership 🔒
--
-- TOTAL: Exactamente 4 políticas
-- =====================================================
