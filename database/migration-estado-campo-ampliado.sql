-- ================================================================
-- MIGRACIÓN: Ampliar campo estado para países no brasileños
-- Fecha: 04/02/2026
-- ================================================================
-- 
-- DESCRIPCIÓN:
-- El campo "estado" actualmente permite solo 2 caracteres (UF brasileña).
-- Esta migración amplía el campo a 50 caracteres para permitir nombres
-- completos de estados/provincias de otros países.
--
-- IMPACTO:
-- - Tabla afectada: clientes
-- - Datos existentes: Preservados (VARCHAR(2) es compatible con VARCHAR(50))
-- - Índices: No afectados
-- - Rendimiento: Cambio mínimo, operación rápida
-- ================================================================

-- Ampliar el campo estado de VARCHAR(2) a VARCHAR(50)
ALTER TABLE clientes 
ALTER COLUMN estado TYPE VARCHAR(50);

-- Verificar el cambio
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'clientes' 
        AND column_name = 'estado' 
        AND character_maximum_length = 50
    ) THEN
        RAISE NOTICE '✓ Campo estado ampliado exitosamente a VARCHAR(50)';
    ELSE
        RAISE EXCEPTION '✗ Error: El campo estado no se actualizó correctamente';
    END IF;
END $$;

-- Actualizar comentario del campo
COMMENT ON COLUMN clientes.estado IS 'Estado/UF (2 caracteres para Brasil, nombre completo para otros países)';

-- ================================================================
-- INSTRUCCIONES DE EJECUCIÓN:
-- ================================================================
-- 1. Abrir Supabase Dashboard
-- 2. Ir a SQL Editor
-- 3. Copiar y pegar este script completo
-- 4. Ejecutar (Run)
-- 5. Verificar mensaje de éxito en la consola
-- ================================================================
