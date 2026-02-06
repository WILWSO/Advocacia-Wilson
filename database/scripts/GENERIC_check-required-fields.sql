-- =====================================================
-- SCRIPT GENÉRICO: Verificar Campos Requeridos y Foreign Keys
-- =====================================================
-- INSTRUCCIONES:
-- Cambia el nombre de la tabla en la línea siguiente (tabla_config)
-- y ejecuta todo el script para analizar cualquier tabla
-- =====================================================

-- 🔧 CONFIGURACIÓN: Cambia aquí el nombre de la tabla a analizar
DO $$ 
BEGIN
    -- Variable no se puede usar en queries directos, pero podemos usar WITH
END $$;

-- Definir tabla a consultar (CAMBIA SOLO ESTE VALOR)
WITH tabla_config AS (
    SELECT 'processos_juridicos'::text AS tabla_nombre
)

-- =====================================================
-- 1. VISTA COMPLETA: Todos los campos con detalles
-- =====================================================

WITH tabla_config AS (
    SELECT 'processos_juridicos'::text AS tabla_nombre
)
SELECT 
    c.column_name AS "Campo",
    c.data_type AS "Tipo",
    CASE 
        WHEN c.is_nullable = 'NO' THEN '✓ REQUERIDO'
        ELSE '○ Opcional (acepta NULL)'
    END AS "Obligatorio",
    CASE 
        WHEN c.data_type = 'uuid' THEN '🔑 ID/UUID'
        WHEN c.column_name LIKE '%_id' THEN '🔗 Probable FK'
        ELSE ''
    END AS "Tipo Campo",
    COALESCE(
        (SELECT ccu.table_name 
         FROM information_schema.table_constraints AS tc 
         JOIN information_schema.key_column_usage AS kcu
           ON tc.constraint_name = kcu.constraint_name
           AND tc.table_schema = kcu.table_schema
         JOIN information_schema.constraint_column_usage AS ccu
           ON ccu.constraint_name = tc.constraint_name
           AND ccu.table_schema = tc.table_schema
         WHERE tc.constraint_type = 'FOREIGN KEY' 
           AND tc.table_name = (SELECT tabla_nombre FROM tabla_config)
           AND kcu.column_name = c.column_name
         LIMIT 1),
        '-'
    ) AS "Referencia (FK)",
    COALESCE(c.column_default, '-') AS "Valor por Defecto"
FROM 
    information_schema.columns c,
    tabla_config
WHERE 
    c.table_schema = 'public'
    AND c.table_name = tabla_config.tabla_nombre
ORDER BY 
    c.ordinal_position;

-- =====================================================
-- 2. RESUMEN: Campos obligatorios (NOT NULL)
-- =====================================================

WITH tabla_config AS (
    SELECT 'processos_juridicos'::text AS tabla_nombre
)
SELECT 
    column_name AS "Campos Obligatorios",
    data_type AS "Tipo",
    CASE 
        WHEN column_name LIKE '%_id' THEN '🔗 Foreign Key'
        WHEN data_type = 'uuid' THEN '🔑 UUID/ID'
        ELSE '📝 Dato'
    END AS "Categoría"
FROM 
    information_schema.columns,
    tabla_config
WHERE 
    table_schema = 'public'
    AND table_name = tabla_config.tabla_nombre
    AND is_nullable = 'NO'
ORDER BY 
    ordinal_position;

-- =====================================================
-- 3. RESUMEN: Campos ID y Foreign Keys
-- =====================================================

WITH tabla_config AS (
    SELECT 'processos_juridicos'::text AS tabla_nombre
)
SELECT 
    c.column_name AS "Campo ID/FK",
    c.data_type AS "Tipo",
    CASE 
        WHEN c.is_nullable = 'NO' THEN '✓ REQUERIDO (no acepta NULL)'
        ELSE '○ OPCIONAL (acepta NULL)'
    END AS "¿Acepta NULL?",
    COALESCE(
        (SELECT ccu.table_name 
         FROM information_schema.table_constraints AS tc 
         JOIN information_schema.key_column_usage AS kcu
           ON tc.constraint_name = kcu.constraint_name
           AND tc.table_schema = kcu.table_schema
         JOIN information_schema.constraint_column_usage AS ccu
           ON ccu.constraint_name = tc.constraint_name
           AND ccu.table_schema = tc.table_schema
         WHERE tc.constraint_type = 'FOREIGN KEY' 
           AND tc.table_name = (SELECT tabla_nombre FROM tabla_config)
           AND kcu.column_name = c.column_name
         LIMIT 1),
        'No es FK'
    ) AS "Tabla Referenciada"
FROM 
    information_schema.columns c,
    tabla_config
WHERE 
    c.table_schema = 'public'
    AND c.table_name = tabla_config.tabla_nombre
    AND (c.data_type = 'uuid' OR c.column_name LIKE '%_id')
ORDER BY 
    c.ordinal_position;

-- =====================================================
-- 4. VERIFICACIÓN: Constraints de la tabla
-- =====================================================

WITH tabla_config AS (
    SELECT 'processos_juridicos'::text AS tabla_nombre
)
SELECT 
    tc.constraint_name AS "Constraint",
    tc.constraint_type AS "Tipo",
    kcu.column_name AS "Campo",
    COALESCE(ccu.table_name, '-') AS "Referencia"
FROM 
    information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
CROSS JOIN tabla_config
WHERE 
    tc.table_schema = 'public'
    AND tc.table_name = tabla_config.tabla_nombre
ORDER BY 
    tc.constraint_type, tc.constraint_name;
