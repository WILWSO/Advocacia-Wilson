-- =====================================================
-- SCRIPT: Cambiar campo "descricao" a NULLABLE
-- Tabla: processos_juridicos
-- =====================================================
-- Este script modifica el campo "descricao" para que
-- NO sea obligatorio (acepta valores NULL)
-- =====================================================

-- Verificar estado actual del campo
SELECT 
    column_name AS "Campo",
    data_type AS "Tipo",
    is_nullable AS "¿Acepta NULL?",
    CASE 
        WHEN is_nullable = 'NO' THEN 'REQUERIDO ❌'
        ELSE 'OPCIONAL ✓'
    END AS "Estado"
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name = 'processos_juridicos'
    AND column_name = 'descricao';

-- =====================================================
-- EJECUTAR: Cambiar campo a NULLABLE
-- =====================================================

ALTER TABLE processos_juridicos 
ALTER COLUMN descricao DROP NOT NULL;

-- =====================================================
-- VERIFICAR: Confirmar el cambio
-- =====================================================

SELECT 
    column_name AS "Campo",
    data_type AS "Tipo",
    is_nullable AS "¿Acepta NULL?",
    CASE 
        WHEN is_nullable = 'NO' THEN 'REQUERIDO ❌'
        ELSE 'OPCIONAL ✓ (cambio exitoso)'
    END AS "Estado"
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name = 'processos_juridicos'
    AND column_name = 'descricao';
