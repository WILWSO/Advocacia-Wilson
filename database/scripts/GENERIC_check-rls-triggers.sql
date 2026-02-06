-- =====================================================
-- SCRIPT GENÉRICO: Verificar RLS Policies y Triggers
-- =====================================================
-- INSTRUCCIONES:
-- Cambia el nombre de la tabla en 'tabla_config'
-- y ejecuta todo el script para analizar cualquier tabla
-- =====================================================

-- =====================================================
-- 1. ESTADO DE RLS (Row Level Security)
-- =====================================================

WITH tabla_config AS (
    SELECT 'processos_juridicos'::text AS tabla_nombre
)
SELECT 
    schemaname AS "Schema",
    tablename AS "Tabla",
    CASE 
        WHEN rowsecurity THEN '✓ HABILITADO'
        ELSE '❌ DESHABILITADO'
    END AS "Estado RLS"
FROM 
    pg_tables,
    tabla_config
WHERE 
    schemaname = 'public'
    AND tablename = tabla_config.tabla_nombre;

-- =====================================================
-- 2. POLÍTICAS RLS (Row Level Security Policies)
-- =====================================================

WITH tabla_config AS (
    SELECT 'processos_juridicos'::text AS tabla_nombre
)
SELECT 
    pol.polname AS "Política",
    CASE pol.polcmd
        WHEN 'r' THEN '👁️ SELECT'
        WHEN 'a' THEN '➕ INSERT'
        WHEN 'w' THEN '✏️ UPDATE'
        WHEN 'd' THEN '🗑️ DELETE'
        WHEN '*' THEN '🌟 ALL'
        ELSE pol.polcmd::text
    END AS "Comando",
    CASE 
        WHEN pol.polpermissive THEN '✓ Permisivo'
        ELSE '⚠️ Restrictivo'
    END AS "Tipo",
    ARRAY(
        SELECT rolname 
        FROM pg_roles 
        WHERE oid = ANY(pol.polroles)
    ) AS "Roles",
    pg_get_expr(pol.polqual, pol.polrelid) AS "USING (condición para SELECT)",
    pg_get_expr(pol.polwithcheck, pol.polrelid) AS "WITH CHECK (condición para INSERT/UPDATE)"
FROM 
    pg_policy pol
JOIN pg_class pc ON pol.polrelid = pc.oid
JOIN pg_namespace pn ON pc.relnamespace = pn.oid
CROSS JOIN tabla_config
WHERE 
    pn.nspname = 'public'
    AND pc.relname = tabla_config.tabla_nombre
ORDER BY 
    pol.polname;

-- =====================================================
-- 3. RESUMEN DE POLÍTICAS POR COMANDO
-- =====================================================

WITH tabla_config AS (
    SELECT 'processos_juridicos'::text AS tabla_nombre
)
SELECT 
    CASE pol.polcmd
        WHEN 'r' THEN '👁️ SELECT'
        WHEN 'a' THEN '➕ INSERT'
        WHEN 'w' THEN '✏️ UPDATE'
        WHEN 'd' THEN '🗑️ DELETE'
        WHEN '*' THEN '🌟 ALL'
        ELSE pol.polcmd::text
    END AS "Comando",
    COUNT(*) AS "Cantidad de Políticas",
    STRING_AGG(pol.polname, ', ' ORDER BY pol.polname) AS "Nombres de Políticas"
FROM 
    pg_policy pol
JOIN pg_class pc ON pol.polrelid = pc.oid
JOIN pg_namespace pn ON pc.relnamespace = pn.oid
CROSS JOIN tabla_config
WHERE 
    pn.nspname = 'public'
    AND pc.relname = tabla_config.tabla_nombre
GROUP BY 
    pol.polcmd
ORDER BY 
    pol.polcmd;

-- =====================================================
-- 4. TRIGGERS DE LA TABLA
-- =====================================================

WITH tabla_config AS (
    SELECT 'processos_juridicos'::text AS tabla_nombre
)
SELECT 
    trig.tgname AS "Trigger",
    CASE 
        WHEN trig.tgenabled = 'O' THEN '✓ HABILITADO'
        WHEN trig.tgenabled = 'D' THEN '❌ DESHABILITADO'
        WHEN trig.tgenabled = 'R' THEN '🔄 REPLICA'
        WHEN trig.tgenabled = 'A' THEN '⚡ ALWAYS'
        ELSE trig.tgenabled::text
    END AS "Estado",
    CASE 
        WHEN trig.tgtype & 2 = 2 THEN '⏰ BEFORE'
        WHEN trig.tgtype & 64 = 64 THEN '⏱️ AFTER'
        ELSE '🔀 INSTEAD OF'
    END AS "Momento",
    CONCAT_WS(', ',
        CASE WHEN trig.tgtype & 4 = 4 THEN '➕ INSERT' END,
        CASE WHEN trig.tgtype & 8 = 8 THEN '🗑️ DELETE' END,
        CASE WHEN trig.tgtype & 16 = 16 THEN '✏️ UPDATE' END,
        CASE WHEN trig.tgtype & 32 = 32 THEN '✂️ TRUNCATE' END
    ) AS "Eventos",
    proc.proname AS "Función",
    pg_get_triggerdef(trig.oid) AS "Definición Completa"
FROM 
    pg_trigger trig
JOIN pg_class pc ON trig.tgrelid = pc.oid
JOIN pg_namespace pn ON pc.relnamespace = pn.oid
JOIN pg_proc proc ON trig.tgfoid = proc.oid
CROSS JOIN tabla_config
WHERE 
    pn.nspname = 'public'
    AND pc.relname = tabla_config.tabla_nombre
    AND NOT trig.tgisinternal
ORDER BY 
    trig.tgname;

-- =====================================================
-- 5. FUNCIONES RELACIONADAS CON LA TABLA
-- =====================================================
-- Muestra TODAS las funciones relacionadas con esta tabla:
--   1. Funciones usadas por triggers de la tabla
--   2. Funciones que mencionan el nombre de la tabla en su código
-- INFORMACIÓN MOSTRADA:
--   Nombre de la función
--   Parámetros
--   Volatilidad (IMMUTABLE/STABLE/VOLATILE)
--   Tipo (FUNCTION/PROCEDURE/AGGREGATE/WINDOW)
--   Relación (por qué está relacionada con la tabla)
--   Definición completa del código

WITH tabla_config AS (
    SELECT 'processos_juridicos'::text AS tabla_nombre
),
trigger_functions AS (
    SELECT DISTINCT trig.tgfoid
    FROM pg_trigger trig
    JOIN pg_class pc ON trig.tgrelid = pc.oid
    CROSS JOIN tabla_config
    WHERE pc.relname = tabla_config.tabla_nombre
    AND NOT trig.tgisinternal
)
SELECT 
    n.nspname AS "Schema",
    p.proname AS "Función",
    pg_get_function_identity_arguments(p.oid) AS "Parámetros",
    CASE p.provolatile
        WHEN 'i' THEN '🔒 IMMUTABLE'
        WHEN 's' THEN '📊 STABLE'
        WHEN 'v' THEN '⚡ VOLATILE'
    END AS "Volatilidad",
    CASE p.prokind
        WHEN 'f' THEN '📝 FUNCTION'
        WHEN 'p' THEN '🔄 PROCEDURE'
        WHEN 'a' THEN '📦 AGGREGATE'
        WHEN 'w' THEN '🪟 WINDOW'
    END AS "Tipo",
    CASE 
        WHEN p.oid IN (SELECT tgfoid FROM trigger_functions) THEN '🎯 Trigger de la tabla'
        ELSE '📄 Mencionada en código'
    END AS "Relación",
    pg_get_functiondef(p.oid) AS "Definición Completa"
FROM 
    pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
CROSS JOIN tabla_config
WHERE 
    n.nspname = 'public'
    AND (
        p.oid IN (SELECT tgfoid FROM trigger_functions)
        OR pg_get_functiondef(p.oid) ILIKE '%' || tabla_config.tabla_nombre || '%'
    )
ORDER BY 
    p.proname;

-- =====================================================
-- 6. TODAS LAS FUNCIONES PERSONALIZADAS (Schema public)
-- =====================================================
-- Lista completa de funciones definidas por el usuario

SELECT 
    p.proname AS "Función",
    pg_get_function_identity_arguments(p.oid) AS "Parámetros",
    CASE p.prorettype::regtype::text
        WHEN 'trigger' THEN '🎯 TRIGGER'
        ELSE '↩️ ' || p.prorettype::regtype::text
    END AS "Retorno",
    CASE p.provolatile
        WHEN 'i' THEN '🔒 IMMUTABLE'
        WHEN 's' THEN '📊 STABLE'
        WHEN 'v' THEN '⚡ VOLATILE'
    END AS "Volatilidad",
    CASE 
        WHEN p.prosecdef THEN '✓ SECURITY DEFINER'
        ELSE '○ SECURITY INVOKER'
    END AS "Seguridad",
    pg_get_functiondef(p.oid) AS "Definición Completa"
FROM 
    pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE 
    n.nspname = 'public'
    AND p.prokind IN ('f', 'p')  -- Solo funciones y procedimientos
ORDER BY 
    p.proname;

-- =====================================================
-- 7. RESUMEN GENERAL
-- =====================================================

WITH tabla_config AS (
    SELECT 'processos_juridicos'::text AS tabla_nombre
)
SELECT 
    tabla_config.tabla_nombre AS "Tabla Analizada",
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = tabla_config.tabla_nombre 
            AND rowsecurity = true
        ) THEN '✓ RLS Habilitado'
        ELSE '❌ RLS Deshabilitado'
    END AS "Estado RLS",
    COALESCE(
        (SELECT COUNT(*)::text 
         FROM pg_policy pol
         JOIN pg_class pc ON pol.polrelid = pc.oid
         JOIN pg_namespace pn ON pc.relnamespace = pn.oid
         WHERE pn.nspname = 'public'
         AND pc.relname = tabla_config.tabla_nombre),
        '0'
    ) AS "Total Políticas RLS",
    COALESCE(
        (SELECT COUNT(*)::text 
         FROM pg_trigger trig
         JOIN pg_class pc ON trig.tgrelid = pc.oid
         JOIN pg_namespace pn ON pc.relnamespace = pn.oid
         WHERE pn.nspname = 'public'
         AND pc.relname = tabla_config.tabla_nombre
         AND NOT trig.tgisinternal),
        '0'
    ) AS "Total Triggers",
    COALESCE(
        (WITH trigger_functions AS (
            SELECT DISTINCT trig.tgfoid
            FROM pg_trigger trig
            JOIN pg_class pc ON trig.tgrelid = pc.oid
            WHERE pc.relname = tabla_config.tabla_nombre
            AND NOT trig.tgisinternal
        )
        SELECT COUNT(DISTINCT p.oid)::text
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND (
            p.oid IN (SELECT tgfoid FROM trigger_functions)
            OR pg_get_functiondef(p.oid) ILIKE '%' || tabla_config.tabla_nombre || '%'
        )),
        '0'
    ) AS "Funciones Relacionadas"
FROM 
    tabla_config;
