-- ============================================================================
-- SCRIPT DE AUDITORÍA - CAMPOS "creado_por" Y "atualizado_por"
-- ============================================================================
-- Este script agrega campos de auditoría a las tablas principales del sistema
-- y crea triggers automáticos para mantener un registro de quién creó y 
-- modificó cada registro.
--
-- Tablas afectadas: usuarios, clientes, processos_juridicos
-- Campos agregados: creado_por, atualizado_por
-- Triggers creados: Automatizan el llenado de estos campos
-- ============================================================================

-- ============================================================================
-- PASO 1: Agregar columnas de auditoría a las tablas
-- ============================================================================

-- Agregar campos de auditoría a la tabla USUARIOS
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS creado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS atualizado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL;

COMMENT ON COLUMN usuarios.creado_por IS 'Usuario que creó este registro';
COMMENT ON COLUMN usuarios.atualizado_por IS 'Usuario que realizó la última actualización';

-- Agregar campos de auditoría a la tabla CLIENTES
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS creado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS atualizado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL;

COMMENT ON COLUMN clientes.creado_por IS 'Usuario que creó este registro';
COMMENT ON COLUMN clientes.atualizado_por IS 'Usuario que realizó la última actualización';

-- Agregar campos de auditoría a la tabla PROCESSOS_JURIDICOS
ALTER TABLE processos_juridicos 
ADD COLUMN IF NOT EXISTS creado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS atualizado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL;

COMMENT ON COLUMN processos_juridicos.creado_por IS 'Usuario que creó este registro';
COMMENT ON COLUMN processos_juridicos.atualizado_por IS 'Usuario que realizó la última actualización';

-- ============================================================================
-- PASO 2: Crear función para actualizar automáticamente "atualizado_por"
-- ============================================================================

-- Esta función se ejecuta automáticamente ANTES de cada UPDATE
-- y establece el campo "atualizado_por" con el ID del usuario actual
CREATE OR REPLACE FUNCTION audit_atualizado_por()
RETURNS TRIGGER AS $$
BEGIN
    -- Establecer atualizado_por con el usuario autenticado actual
    NEW.atualizado_por = auth.uid();
    
    -- Mantener data_atualizacao actualizada también
    IF TG_TABLE_NAME IN ('usuarios', 'clientes') THEN
        NEW.data_atualizacao = NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION audit_atualizado_por() IS 
'Función de trigger que actualiza automáticamente el campo atualizado_por con el ID del usuario actual al modificar un registro';

-- ============================================================================
-- PASO 3: Crear función para establecer "creado_por" en INSERT
-- ============================================================================

-- Esta función se ejecuta automáticamente ANTES de cada INSERT
-- y establece el campo "creado_por" con el ID del usuario actual
CREATE OR REPLACE FUNCTION audit_creado_por()
RETURNS TRIGGER AS $$
BEGIN
    -- Establecer creado_por con el usuario autenticado actual
    NEW.creado_por = auth.uid();
    
    -- También establecer atualizado_por en la creación
    NEW.atualizado_por = auth.uid();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION audit_creado_por() IS 
'Función de trigger que establece automáticamente creado_por y atualizado_por con el ID del usuario actual al crear un registro';

-- ============================================================================
-- PASO 4: Crear triggers para la tabla USUARIOS
-- ============================================================================

-- Trigger para INSERT en usuarios
DROP TRIGGER IF EXISTS usuarios_audit_insert ON usuarios;
CREATE TRIGGER usuarios_audit_insert
    BEFORE INSERT ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION audit_creado_por();

-- Trigger para UPDATE en usuarios
DROP TRIGGER IF EXISTS usuarios_audit_update ON usuarios;
CREATE TRIGGER usuarios_audit_update
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION audit_atualizado_por();

-- ============================================================================
-- PASO 5: Crear triggers para la tabla CLIENTES
-- ============================================================================

-- Trigger para INSERT en clientes
DROP TRIGGER IF EXISTS clientes_audit_insert ON clientes;
CREATE TRIGGER clientes_audit_insert
    BEFORE INSERT ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION audit_creado_por();

-- Trigger para UPDATE en clientes
DROP TRIGGER IF EXISTS clientes_audit_update ON clientes;
CREATE TRIGGER clientes_audit_update
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION audit_atualizado_por();

-- ============================================================================
-- PASO 6: Crear triggers para la tabla PROCESSOS_JURIDICOS
-- ============================================================================

-- Trigger para INSERT en processos_juridicos
DROP TRIGGER IF EXISTS processos_audit_insert ON processos_juridicos;
CREATE TRIGGER processos_audit_insert
    BEFORE INSERT ON processos_juridicos
    FOR EACH ROW
    EXECUTE FUNCTION audit_creado_por();

-- Trigger para UPDATE en processos_juridicos
DROP TRIGGER IF EXISTS processos_audit_update ON processos_juridicos;
CREATE TRIGGER processos_audit_update
    BEFORE UPDATE ON processos_juridicos
    FOR EACH ROW
    EXECUTE FUNCTION audit_atualizado_por();

-- ============================================================================
-- PASO 7: Crear índices para mejorar el rendimiento de las consultas
-- ============================================================================

-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_creado_por ON usuarios(creado_por);
CREATE INDEX IF NOT EXISTS idx_usuarios_atualizado_por ON usuarios(atualizado_por);

-- Índices para clientes
CREATE INDEX IF NOT EXISTS idx_clientes_creado_por ON clientes(creado_por);
CREATE INDEX IF NOT EXISTS idx_clientes_atualizado_por ON clientes(atualizado_por);

-- Índices para processos_juridicos
CREATE INDEX IF NOT EXISTS idx_processos_creado_por ON processos_juridicos(creado_por);
CREATE INDEX IF NOT EXISTS idx_processos_atualizado_por ON processos_juridicos(atualizado_por);

-- ============================================================================
-- PASO 8: Verificación del script
-- ============================================================================

-- Verificar que las columnas fueron creadas correctamente
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('usuarios', 'clientes', 'processos_juridicos')
    AND column_name IN ('creado_por', 'atualizado_por')
ORDER BY table_name, column_name;

-- Verificar que los triggers fueron creados correctamente
SELECT 
    trigger_name,
    event_object_table as table_name,
    action_timing,
    event_manipulation as event
FROM information_schema.triggers
WHERE trigger_name LIKE '%audit%'
ORDER BY event_object_table, trigger_name;

-- Verificar que los índices fueron creados correctamente
SELECT 
    schemaname,
    tablename,
    indexname
FROM pg_indexes
WHERE indexname LIKE '%creado_por%' OR indexname LIKE '%atualizado_por%'
ORDER BY tablename, indexname;

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
/*
1. Los campos creado_por y atualizado_por se llenan AUTOMÁTICAMENTE
   - No necesitas especificarlos en INSERT o UPDATE desde el frontend
   - Los triggers se encargan de todo automáticamente
   
2. auth.uid() retorna el UUID del usuario autenticado en Supabase
   - Esto funciona automáticamente con la sesión actual
   
3. Si un registro ya existe sin estos campos:
   - Los campos quedarán como NULL para registros antiguos
   - Los nuevos registros siempre tendrán estos campos poblados
   
4. Para ver quién creó/modificó un registro, puedes hacer un JOIN:
   
   SELECT 
       c.*,
       u_criador.nome as criador_nome,
       u_atualizador.nome as atualizador_nome
   FROM clientes c
   LEFT JOIN usuarios u_criador ON c.creado_por = u_criador.id
   LEFT JOIN usuarios u_atualizador ON c.atualizado_por = u_atualizador.id;

5. Los triggers tienen SECURITY DEFINER, lo que significa que se ejecutan
   con privilegios de superusuario para evitar problemas de permisos.
*/

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
