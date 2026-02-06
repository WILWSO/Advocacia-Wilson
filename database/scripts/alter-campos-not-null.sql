-- =====================================================
-- SCRIPT: Cambiar campos a NOT NULL (obligatorios)
-- Tabla: processos_juridicos
-- Campos: numero_processo, cliente_id
-- =====================================================
-- Este script modifica los campos para que
-- sean obligatorios (NO aceptan valores NULL)
-- =====================================================
-- IMPORTANTE: Antes de ejecutar, asegúrate de que
-- NO existen registros con estos campos en NULL
-- =====================================================

-- =====================================================
-- PASO 1: Verificar estado actual de los campos
-- =====================================================

SELECT 
    column_name AS "Campo",
    data_type AS "Tipo",
    is_nullable AS "¿Acepta NULL?",
    CASE 
        WHEN is_nullable = 'NO' THEN 'REQUERIDO ✓'
        ELSE 'OPCIONAL (acepta NULL) ❌'
    END AS "Estado Actual"
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name = 'processos_juridicos'
    AND column_name IN ('numero_processo', 'cliente_id')
ORDER BY
    column_name;

-- =====================================================
-- PASO 2: Verificar si hay registros con NULL
-- =====================================================
-- Si este query retorna registros, debes actualizar
-- esos registros antes de hacer los campos NOT NULL

SELECT 
    id,
    titulo,
    CASE 
        WHEN numero_processo IS NULL THEN '❌ numero_processo es NULL'
        ELSE '✓ numero_processo tiene valor'
    END AS "Estado numero_processo",
    CASE 
        WHEN cliente_id IS NULL THEN '❌ cliente_id es NULL'
        ELSE '✓ cliente_id tiene valor'
    END AS "Estado cliente_id"
FROM 
    processos_juridicos
WHERE 
    numero_processo IS NULL 
    OR cliente_id IS NULL;

-- =====================================================
-- PASO 3: EJECUTAR - Cambiar campos a NOT NULL
-- =====================================================
-- ⚠️ SOLO EJECUTAR SI EL PASO 2 NO RETORNÓ NINGÚN REGISTRO

-- Cambiar numero_processo a NOT NULL
ALTER TABLE processos_juridicos 
ALTER COLUMN numero_processo SET NOT NULL;

-- Cambiar cliente_id a NOT NULL
ALTER TABLE processos_juridicos 
ALTER COLUMN cliente_id SET NOT NULL;

-- =====================================================
-- PASO 4: VERIFICAR - Confirmar los cambios
-- =====================================================

SELECT 
    column_name AS "Campo",
    data_type AS "Tipo",
    is_nullable AS "¿Acepta NULL?",
    CASE 
        WHEN is_nullable = 'NO' THEN 'REQUERIDO ✓ (cambio exitoso)'
        ELSE 'OPCIONAL ❌ (cambio falló)'
    END AS "Estado Final"
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name = 'processos_juridicos'
    AND column_name IN ('numero_processo', 'cliente_id')
ORDER BY
    column_name;
