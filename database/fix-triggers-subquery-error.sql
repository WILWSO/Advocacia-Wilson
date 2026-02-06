-- Corrección: Error de subconsulta en triggers de auditoría Y políticas RLS
-- Fecha: 2026-02-03
-- Error: "more than one row returned by a subquery used as an expression"
-- Solución: 
--   1. Simplificar la lógica de verificación usando COUNT en lugar de EXISTS en triggers
--   2. Corregir política RLS de UPDATE en clientes que tiene subconsulta errónea

-- PASO 1: Corregir función audit_creado_por
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

-- 2. Corregir función audit_atualizado_por
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

-- 3. Verificar que los triggers estén activos
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    proname as function_name,
    tgenabled as enabled
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname IN ('audit_creado_por_trigger', 'audit_atualizado_por_trigger')
ORDER BY tgrelid::regclass;

-- 4. Comentarios
COMMENT ON FUNCTION audit_creado_por() IS 
'Función de auditoría corregida que asigna creado_por y atualizado_por usando COUNT para evitar error de subconsulta múltiple';

COMMENT ON FUNCTION audit_atualizado_por() IS 
'Función de auditoría corregida que asigna atualizado_por usando COUNT para evitar error de subconsulta múltiple';

-- ===================================================================
-- PASO 2: CORREGIR POLÍTICA RLS DE UPDATE EN CLIENTES
-- ===================================================================
-- El problema está en la política con subconsulta mal escrita
-- SOLUCIÓN: Simplificar política RLS + agregar trigger para validar nome_completo

-- Primero, eliminar la política problemática
DROP POLICY IF EXISTS "Admin advogado assistente podem atualizar clientes" ON clientes;

-- Recrear la política simplificada (sin subconsulta problemática)
CREATE POLICY "Admin advogado assistente podem atualizar clientes" 
    ON clientes FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.id = auth.uid()
            AND usuarios.role IN ('admin', 'advogado', 'assistente')
        )
    );

COMMENT ON POLICY "Admin advogado assistente podem atualizar clientes" ON clientes IS 
'Política simplificada: Admin, advogado y assistente pueden actualizar. La validación de nome_completo se hace en trigger.';

-- Crear trigger para validar que advogado/assistente no cambien nome_completo
CREATE OR REPLACE FUNCTION validate_nome_completo_change()
RETURNS TRIGGER AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Obtener el rol del usuario actual
    SELECT role INTO user_role
    FROM usuarios
    WHERE id = auth.uid();
    
    -- Si no se encuentra el usuario o es admin, permitir cualquier cambio
    IF user_role IS NULL OR user_role = 'admin' THEN
        RETURN NEW;
    END IF;
    
    -- Si es advogado o assistente y está intentando cambiar nome_completo
    IF user_role IN ('advogado', 'assistente') AND OLD.nome_completo IS DISTINCT FROM NEW.nome_completo THEN
        RAISE EXCEPTION 'Solo admin puede modificar el campo nome_completo'
            USING ERRCODE = 'P0001';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger si existe
DROP TRIGGER IF EXISTS validate_nome_completo_trigger ON clientes;

-- Crear el trigger BEFORE UPDATE
CREATE TRIGGER validate_nome_completo_trigger
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION validate_nome_completo_change();

COMMENT ON FUNCTION validate_nome_completo_change() IS 
'Valida que solo admin pueda cambiar nome_completo en clientes. Advogado/assistente no pueden modificar este campo.';
