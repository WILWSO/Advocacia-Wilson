-- =========================================================================
-- FIX URGENTE: Error subconsulta en triggers de processos_juridicos
-- =========================================================================
-- Error: "more than one row returned by a subquery used as an expression"
-- Causa: Las funciones de auditoría tienen subconsultas que pueden retornar múltiples filas
-- Solución: Usar COUNT(*) en lugar de subconsultas directas
--
-- INSTRUCCIONES:
-- 1. Abre Supabase Dashboard → SQL Editor
-- 2. Copia y pega TODO este script
-- 3. Ejecuta (Run)
-- =========================================================================

-- 1. Corregir función audit_creado_por - USAR COUNT
CREATE OR REPLACE FUNCTION audit_creado_por()
RETURNS TRIGGER AS $$
DECLARE
    usuario_count INTEGER;
BEGIN
    -- Contar cuántos registros del usuario existen en la tabla usuarios
    SELECT COUNT(*)
    INTO usuario_count
    FROM usuarios
    WHERE id = auth.uid();
    
    -- Solo asignar creado_por si el usuario existe en usuarios
    IF usuario_count > 0 THEN
        NEW.creado_por = auth.uid();
        NEW.atualizado_por = auth.uid();
    ELSE
        -- Registrar advertencia pero permitir la inserción
        RAISE WARNING 'Usuario % no encontrado en tabla usuarios. Registro creado sin creado_por.', auth.uid();
        -- Dejar creado_por como NULL
        NEW.creado_por = NULL;
        NEW.atualizado_por = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Corregir función audit_atualizado_por - USAR COUNT
CREATE OR REPLACE FUNCTION audit_atualizado_por()
RETURNS TRIGGER AS $$
DECLARE
    usuario_count INTEGER;
BEGIN
    -- Contar cuántos registros del usuario existen en la tabla usuarios
    SELECT COUNT(*)
    INTO usuario_count
    FROM usuarios
    WHERE id = auth.uid();
    
    -- Solo asignar atualizado_por si el usuario existe en usuarios
    IF usuario_count > 0 THEN
        NEW.atualizado_por = auth.uid();
    ELSE
        RAISE WARNING 'Usuario % no encontrado en tabla usuarios. Update sin atualizado_por.', auth.uid();
        NEW.atualizado_por = NULL;
    END IF;
    
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Verificar que las funciones se hayan actualizado correctamente
SELECT 
    proname as function_name,
    prosrc as function_code
FROM pg_proc
WHERE proname IN ('audit_creado_por', 'audit_atualizado_por');

-- 4. Verificar triggers activos
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    tgenabled as enabled
FROM pg_trigger
WHERE tgname LIKE '%audit%'
ORDER BY tgrelid::regclass;

-- 5. Comentarios
COMMENT ON FUNCTION audit_creado_por() IS 
'Función de auditoría corregida - usa COUNT para evitar error de subconsulta múltiple';

COMMENT ON FUNCTION audit_atualizado_por() IS 
'Función de auditoría corregida - usa COUNT para evitar error de subconsulta múltiple';

-- =========================================================================
-- FIN DEL SCRIPT - Ahora puedes crear procesos con archivos sin error
-- =========================================================================
