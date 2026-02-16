-- =====================================================
-- FIX FINAL: Eliminar las 2 políticas adicionales específicas
-- Problema: Existen 6 políticas (deberían ser 4)
-- Políticas a eliminar:
--   1. "Posts publicados são visíveis para todos" (SELECT duplicado)
--   2. "Apenas admins podem gerenciar posts" (ALL - política vieja)
-- =====================================================

-- =====================================================
-- PASO 1: Ver las 6 políticas actuales
-- =====================================================
SELECT 
    policyname AS "Política",
    cmd AS "Operación",
    CASE 
        WHEN policyname = 'Posts publicados são visíveis para todos' THEN '❌ ELIMINAR - SELECT duplicado'
        WHEN policyname = 'Apenas admins podem gerenciar posts' THEN '❌ ELIMINAR - Política antigua ALL'
        WHEN policyname IN ('posts_select_policy', 'posts_insert_policy', 'posts_update_policy', 'posts_delete_policy') 
        THEN '✅ MANTENER - Política correcta'
        ELSE '❓ Revisar'
    END AS "Acción"
FROM 
    pg_policies
WHERE 
    tablename = 'posts_sociais'
ORDER BY
    cmd, policyname;

-- =====================================================
-- PASO 2: ELIMINAR LAS 2 POLÍTICAS PROBLEMÁTICAS
-- =====================================================

-- Eliminar política SELECT duplicada (en portugués)
DROP POLICY IF EXISTS "Posts publicados são visíveis para todos" ON public.posts_sociais;

-- Eliminar política antigua ALL
DROP POLICY IF EXISTS "Apenas admins podem gerenciar posts" ON public.posts_sociais;

-- Verificar que se eliminaron
SELECT 
    COUNT(*) AS "Políticas Eliminadas",
    CASE 
        WHEN COUNT(*) = 0 THEN '✓ CORRECTO - Políticas duplicadas eliminadas'
        ELSE '⚠️ Aún existen políticas con estos nombres'
    END AS "Estado"
FROM 
    pg_policies
WHERE 
    tablename = 'posts_sociais'
    AND policyname IN (
        'Posts publicados são visíveis para todos',
        'Apenas admins podem gerenciar posts'
    );

-- =====================================================
-- PASO 3: VALIDACIÓN FINAL - Deben quedar exactamente 4
-- =====================================================
SELECT 
    'Políticas Finales' AS "Check",
    COUNT(*) AS "Cantidad",
    CASE 
        WHEN COUNT(*) = 4 THEN '✅ CORRECTO - Exactamente 4 políticas'
        ELSE CONCAT('❌ ERROR - Hay ', COUNT(*), ' políticas (deberían ser 4)')
    END AS "Estado"
FROM 
    pg_policies
WHERE 
    tablename = 'posts_sociais';

-- =====================================================
-- PASO 4: Listar las 4 políticas correctas que deben quedar
-- =====================================================
SELECT 
    policyname AS "Política",
    cmd AS "Operación",
    CASE 
        WHEN cmd = 'SELECT' THEN '1️⃣ Lectura: Todos ven publicados, autenticados ven todos'
        WHEN cmd = 'INSERT' THEN '2️⃣ Crear: Admin + Advogado pueden crear'
        WHEN cmd = 'UPDATE' THEN '3️⃣ Editar: Admin todo, Advogado solo sus posts 🔒'
        WHEN cmd = 'DELETE' THEN '4️⃣ Eliminar: Admin todo, Advogado solo sus posts 🔒'
        ELSE '❓ Operación desconocida'
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
    AND policyname IN (
        'posts_select_policy',
        'posts_insert_policy', 
        'posts_update_policy',
        'posts_delete_policy'
    )
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
--
-- POLÍTICAS ELIMINADAS (2):
-- ❌ "Posts publicados são visíveis para todos" (SELECT duplicado)
-- ❌ "Apenas admins podem gerenciar posts" (ALL antigua)
--
-- POLÍTICAS QUE QUEDAN (4):
-- ✅ posts_select_policy   | SELECT | Sin ownership
-- ✅ posts_insert_policy   | INSERT | Sin ownership  
-- ✅ posts_update_policy   | UPDATE | CON OWNERSHIP 🔒
-- ✅ posts_delete_policy   | DELETE | CON OWNERSHIP 🔒
--
-- TOTAL: Exactamente 4 políticas ✓
-- =====================================================
