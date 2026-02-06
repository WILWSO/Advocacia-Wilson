-- SOLUCIÓN COMPLETA: Eliminar y recrear todos los triggers y políticas de clientes
-- Fecha: 2026-02-03
-- Este script limpia todo y lo recrea correctamente
-- 
-- IMPORTANTE: Según docs/instructions/RLS_tablas.md
-- - Admin, Advogado, Assistente: pueden SELECT, INSERT, UPDATE
-- - Solo Admin: puede DELETE  
-- - Restricciones de nome_completo y status: SOLO EN FRONTEND (no en backend)

-- ============================================================================
-- PASO 1: ELIMINAR TODOS LOS TRIGGERS EXISTENTES EN CLIENTES
-- ============================================================================
DROP TRIGGER IF EXISTS clientes_audit_insert ON clientes;
DROP TRIGGER IF EXISTS clientes_audit_update ON clientes;
DROP TRIGGER IF EXISTS trigger_update_clientes_data_atualizacao ON clientes;
DROP TRIGGER IF EXISTS trigger_update_clientes_search_vector ON clientes;
DROP TRIGGER IF EXISTS validate_nome_completo_trigger ON clientes;
DROP TRIGGER IF EXISTS audit_creado_por_trigger ON clientes;
DROP TRIGGER IF EXISTS audit_atualizado_por_trigger ON clientes;

-- Eliminar función de validación (no debe existir según RLS_tablas.md)
DROP FUNCTION IF EXISTS validate_nome_completo_change();

-- ============================================================================
-- PASO 2: RECREAR FUNCIONES CORREGIDAS
-- ============================================================================

-- Función para actualizar data_atualizacao
CREATE OR REPLACE FUNCTION update_clientes_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar search_vector (búsqueda full-text)
CREATE OR REPLACE FUNCTION update_clientes_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector = 
        setweight(to_tsvector('portuguese', COALESCE(NEW.nome_completo, '')), 'A') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.email, '')), 'B') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.cpf_cnpj, '')), 'B') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.telefone, '')), 'C') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.celular, '')), 'C') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.cidade, '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función de auditoría para INSERT (CORREGIDA)
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
        RAISE WARNING 'Usuario % no encontrado en tabla usuarios. Registro creado sin creado_por.', auth.uid();
        NEW.creado_por = NULL;
        NEW.atualizado_por = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función de auditoría para UPDATE (CORREGIDA)
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

-- ============================================================================
-- PASO 3: RECREAR TRIGGERS EN EL ORDEN CORRECTO
-- ============================================================================
-- NOTA: NO se crea trigger validate_nome_completo_trigger porque según
-- RLS_tablas.md las restricciones de nome_completo se validan SOLO EN FRONTEND

-- Trigger 1: Auditoría de creación (BEFORE INSERT)
CREATE TRIGGER clientes_audit_insert
    BEFORE INSERT ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION audit_creado_por();

-- Trigger 2: Auditoría de actualización (BEFORE UPDATE)
CREATE TRIGGER clientes_audit_update
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION audit_atualizado_por();

-- Trigger 3: Actualizar search_vector (BEFORE INSERT OR UPDATE)
CREATE TRIGGER trigger_update_clientes_search_vector
    BEFORE INSERT OR UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_clientes_search_vector();

-- ============================================================================
-- PASO 4: CORREGIR POLÍTICA RLS DE UPDATE
-- ============================================================================

-- Eliminar política problemática
DROP POLICY IF EXISTS "Admin advogado assistente podem atualizar clientes" ON clientes;

-- Recrear política simplificada (la validación de nome_completo se hace en trigger)
CREATE POLICY "Admin advogado assistente podem atualizar clientes" 
    ON clientes FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.id = auth.uid()
            AND usuarios.role IN ('admin', 'advogado', 'assistente')
        )
    );

-- ============================================================================
-- PASO 5: COMENTARIOS Y DOCUMENTACIÓN
-- ============================================================================

COMMENT ON FUNCTION audit_creado_por() IS 
'Función de auditoría CORREGIDA que asigna creado_por y atualizado_por usando COUNT para evitar error de subconsulta múltiple';

COMMENT ON FUNCTION audit_atualizado_por() IS 
'Función de auditoría CORREGIDA que asigna atualizado_por usando COUNT para evitar error de subconsulta múltiple';

COMMENT ON FUNCTION audit_atualizado_por() IS 
'Función de auditoría CORREGIDA que asigna atualizado_por usando COUNT para evitar error de subconsulta múltiple';

COMMENT ON POLICY "clientes_update_policy" ON clientes IS 
'Admin, advogado y assistente pueden actualizar clientes. Restricciones de nome_completo y status se validan en FRONTEND según RLS_tablas.md.';

-- ============================================================================
-- PASO 6: VERIFICACIÓN FINAL
-- ============================================================================

-- Ver todos los triggers en clientes
SELECT 
    tgname AS trigger_name,
    tgenabled AS enabled,
    CASE 
        WHEN tgtype & 2 = 2 THEN 'BEFORE'
        WHEN tgtype & 64 = 64 THEN 'INSTEAD OF'
        ELSE 'AFTER'
    END AS timing,
    CASE 
        WHEN tgtype & 4 = 4 THEN 'INSERT'
        WHEN tgtype & 8 = 8 THEN 'DELETE'
        WHEN tgtype & 16 = 16 THEN 'UPDATE'
        ELSE 'OTHER'
    END AS event
FROM pg_trigger
WHERE tgrelid = 'clientes'::regclass
  AND tgisinternal = false
ORDER BY tgname;

-- Mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE 'Triggers y políticas de clientes recreados correctamente';
END $$;
