-- SCRIPT PARA VERIFICAR Y RECREAR TRIGGERS DE AUDITORÍA
-- Execute este script no SQL Editor do Supabase

-- 1. Eliminar triggers existentes si hay
DROP TRIGGER IF EXISTS usuarios_audit_insert ON usuarios;
DROP TRIGGER IF EXISTS usuarios_audit_update ON usuarios;
DROP TRIGGER IF EXISTS clientes_audit_insert ON clientes;
DROP TRIGGER IF EXISTS clientes_audit_update ON clientes;
DROP TRIGGER IF EXISTS processos_audit_insert ON processos_juridicos;
DROP TRIGGER IF EXISTS processos_audit_update ON processos_juridicos;

-- 2. Recrear funciones de auditoría
CREATE OR REPLACE FUNCTION audit_creado_por()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo establecer creado_por y atualizado_por si están NULL
    IF NEW.creado_por IS NULL THEN
        NEW.creado_por = auth.uid();
    END IF;
    
    IF NEW.atualizado_por IS NULL THEN
        NEW.atualizado_por = auth.uid();
    END IF;
    
    -- Establecer data_criacao si está NULL
    IF NEW.data_criacao IS NULL THEN
        NEW.data_criacao = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION audit_atualizado_por()
RETURNS TRIGGER AS $$
BEGIN
    -- Siempre actualizar atualizado_por y data_atualizacao en UPDATE
    NEW.atualizado_por = auth.uid();
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crear triggers para USUARIOS
CREATE TRIGGER usuarios_audit_insert
    BEFORE INSERT ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION audit_creado_por();

CREATE TRIGGER usuarios_audit_update
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION audit_atualizado_por();

-- 4. Crear triggers para CLIENTES
CREATE TRIGGER clientes_audit_insert
    BEFORE INSERT ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION audit_creado_por();

CREATE TRIGGER clientes_audit_update
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION audit_atualizado_por();

-- 5. Crear triggers para PROCESSOS
CREATE TRIGGER processos_audit_insert
    BEFORE INSERT ON processos_juridicos
    FOR EACH ROW
    EXECUTE FUNCTION audit_creado_por();

CREATE TRIGGER processos_audit_update
    BEFORE UPDATE ON processos_juridicos
    FOR EACH ROW
    EXECUTE FUNCTION audit_atualizado_por();

-- 6. Verificar que los triggers se crearon correctamente
SELECT 
    trigger_name,
    event_manipulation as event,
    event_object_table as table_name,
    action_timing as timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name LIKE '%audit%'
ORDER BY event_object_table, trigger_name;

-- 7. Actualizar registros existentes que no tienen información de auditoría
-- NOTA: Esto es opcional, solo si quieres llenar datos históricos

-- Obtener el primer admin (o puedes cambiar este ID)
DO $$
DECLARE
    first_admin_id UUID;
BEGIN
    -- Obtener el ID del primer admin
    SELECT id INTO first_admin_id 
    FROM usuarios 
    WHERE role = 'admin' 
    ORDER BY data_criacao 
    LIMIT 1;
    
    -- Actualizar usuarios sin creado_por
    UPDATE usuarios
    SET 
        creado_por = first_admin_id,
        atualizado_por = first_admin_id
    WHERE creado_por IS NULL;
    
    -- Actualizar clientes sin creado_por
    UPDATE clientes
    SET 
        creado_por = first_admin_id,
        atualizado_por = first_admin_id
    WHERE creado_por IS NULL;
    
    -- Actualizar procesos sin creado_por
    UPDATE processos_juridicos
    SET 
        creado_por = first_admin_id,
        atualizado_por = first_admin_id
    WHERE creado_por IS NULL;
    
    RAISE NOTICE 'Registros históricos actualizados con admin: %', first_admin_id;
END $$;

-- 8. Verificar resultados
SELECT 
    'usuarios' as tabla,
    COUNT(*) as total,
    COUNT(creado_por) as con_creado_por,
    COUNT(*) - COUNT(creado_por) as sin_creado_por
FROM usuarios
UNION ALL
SELECT 
    'clientes' as tabla,
    COUNT(*) as total,
    COUNT(creado_por) as con_creado_por,
    COUNT(*) - COUNT(creado_por) as sin_creado_por
FROM clientes
UNION ALL
SELECT 
    'processos_juridicos' as tabla,
    COUNT(*) as total,
    COUNT(creado_por) as con_creado_por,
    COUNT(*) - COUNT(creado_por) as sin_creado_por
FROM processos_juridicos;
