-- SCRIPT PARA RENOMBRAR data_cadastro A data_criacao EN LA TABLA CLIENTES
-- Esto estandariza los campos de auditoría con las demás tablas
-- Execute este script no SQL Editor do Supabase

-- 1. Verificar que el campo existe antes de renombrar
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'clientes' 
        AND column_name = 'data_cadastro'
    ) THEN
        -- Renombrar la columna
        ALTER TABLE clientes 
        RENAME COLUMN data_cadastro TO data_criacao;
        
        RAISE NOTICE 'Columna data_cadastro renombrada a data_criacao exitosamente';
    ELSE
        RAISE NOTICE 'La columna data_cadastro no existe o ya fue renombrada';
    END IF;
END $$;

-- 2. Verificar que el campo data_criacao existe ahora
SELECT 
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_name = 'clientes'
AND column_name IN ('data_criacao', 'data_cadastro')
ORDER BY column_name;

-- 3. Verificar algunos registros de ejemplo
SELECT 
    id,
    nome_completo,
    data_criacao,
    data_atualizacao,
    creado_por,
    atualizado_por
FROM clientes
ORDER BY data_criacao DESC
LIMIT 5;
