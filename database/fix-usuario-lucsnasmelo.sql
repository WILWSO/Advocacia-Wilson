-- -- ============================================================================
-- SOLUCIÓN ALTERNATIVA: Sincronización completa paso a paso
-- ============================================================================
-- Este script es más robusto y verifica cada paso
-- ============================================================================

-- PASO 0: Verificar estado actual
SELECT 
    'Estado ANTES de la corrección' as momento,
    au.id as auth_id,
    u.id as usuarios_id,
    au.email,
    (au.id = u.id) as ids_coinciden
FROM auth.users au
INNER JOIN usuarios u ON au.email = u.email
WHERE au.email = 'lucsnasmelo@gmail.com';

-- ============================================================================
-- SOLUCIÓN: Insertar nuevo usuario y migrar referencias
-- ============================================================================

DO $$
DECLARE
    id_auth UUID := 'a4a8cb7a-ef23-44fa-af48-2055b31502b2';  -- ID de auth.users
    id_usuarios UUID := 'eb4dd273-34e3-4ffb-b8bb-162dbac92971';  -- ID actual en usuarios
    registros_afectados INT;
BEGIN
    RAISE NOTICE '=== INICIANDO MIGRACIÓN ===';
    RAISE NOTICE 'ID en auth.users: %', id_auth;
    RAISE NOTICE 'ID en usuarios: %', id_usuarios;
    
    -- PASO 1: Verificar si ya existe el usuario con ID correcto
    IF EXISTS (SELECT 1 FROM usuarios WHERE id = id_auth) THEN
        RAISE NOTICE 'El usuario con ID correcto YA EXISTE. Saltando creación.';
    ELSE
        -- Cambiar temporalmente el email para evitar conflicto
        UPDATE usuarios 
        SET email = 'lucsnasmelo_TEMP_' || id_usuarios::text || '@gmail.com'
        WHERE id = id_usuarios;
        
        RAISE NOTICE 'Email temporal asignado';
        
        -- Crear nuevo usuario con ID correcto
        INSERT INTO usuarios (id, email, nome, role, foto_perfil_url, ativo, data_criacao)
        SELECT 
            id_auth,
            'lucsnasmelo@gmail.com',
            u.nome,
            u.role,
            u.foto_perfil_url,
            u.ativo,
            u.data_criacao
        FROM usuarios u
        WHERE u.id = id_usuarios;
        
        RAISE NOTICE 'Usuario creado con ID correcto: %', id_auth;
    END IF;
    
    -- PASO 2: Migrar processos_juridicos.advogado_responsavel
    UPDATE processos_juridicos
    SET advogado_responsavel = id_auth
    WHERE advogado_responsavel = id_usuarios;
    
    GET DIAGNOSTICS registros_afectados = ROW_COUNT;
    RAISE NOTICE 'Migrados % processos (advogado_responsavel)', registros_afectados;
    
    -- PASO 3: Migrar processos_juridicos.creado_por
    UPDATE processos_juridicos
    SET creado_por = id_auth
    WHERE creado_por = id_usuarios;
    
    GET DIAGNOSTICS registros_afectados = ROW_COUNT;
    RAISE NOTICE 'Migrados % processos (creado_por)', registros_afectados;
    
    -- PASO 4: Migrar processos_juridicos.atualizado_por
    UPDATE processos_juridicos
    SET atualizado_por = id_auth
    WHERE atualizado_por = id_usuarios;
    
    GET DIAGNOSTICS registros_afectados = ROW_COUNT;
    RAISE NOTICE 'Migrados % processos (atualizado_por)', registros_afectados;
    
    -- PASO 5: Migrar clientes.creado_por
    UPDATE clientes
    SET creado_por = id_auth
    WHERE creado_por = id_usuarios;
    
    GET DIAGNOSTICS registros_afectados = ROW_COUNT;
    RAISE NOTICE 'Migrados % clientes (creado_por)', registros_afectados;
    
    -- PASO 6: Migrar clientes.atualizado_por
    UPDATE clientes
    SET atualizado_por = id_auth
    WHERE atualizado_por = id_usuarios;
    
    GET DIAGNOSTICS registros_afectados = ROW_COUNT;
    RAISE NOTICE 'Migrados % clientes (atualizado_por)', registros_afectados;
    
    -- PASO 7: Eliminar registro antiguo
    DELETE FROM usuarios WHERE id = id_usuarios;
    
    RAISE NOTICE '=== MIGRACIÓN COMPLETADA ===';
    RAISE NOTICE 'Usuario antiguo (%) eliminado', id_usuarios;
    RAISE NOTICE 'Usuario nuevo (%) activo', id_auth;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERROR: %', SQLERRM;
        RAISE EXCEPTION 'Migración fallida: %', SQLERRM;
END $$;

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

-- 1. Verificar el usuario específico
SELECT 
    '✓ Usuario corregido' as estado,
    au.id as auth_id,
    u.id as usuarios_id,
    au.email,
    (au.id = u.id) as ids_coinciden
FROM auth.users au
INNER JOIN usuarios u ON au.email = u.email
WHERE au.email = 'lucsnasmelo@gmail.com';

-- 2. Estado general
SELECT 
    (SELECT COUNT(*) FROM auth.users) as total_auth_users,
    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM auth.users au WHERE NOT EXISTS (SELECT 1 FROM usuarios u WHERE u.id = au.id)) as usuarios_faltantes,
    (SELECT COUNT(*) FROM auth.users au WHERE EXISTS (SELECT 1 FROM usuarios u WHERE u.email = au.email AND u.id != au.id)) as emails_duplicados,
    (SELECT COUNT(*) FROM usuarios u WHERE NOT EXISTS (SELECT 1 FROM auth.users au WHERE au.id = u.id)) as usuarios_huerfanos;

-- Resultado esperado:
-- ids_coinciden: true
-- emails_duplicados: 0
-- usuarios_huerfanos: 0
-- usuarios_faltantes: 1 (el otro pendiente)
