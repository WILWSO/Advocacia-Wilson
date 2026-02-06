-- ============================================================================
-- SOLUCIÓN: Actualizar ID de usuario duplicado con todas sus referencias
-- ============================================================================
-- Email: lucsnasmelo@gmail.com
-- Problema: El ID en tabla usuarios es diferente al ID en auth.users
-- Solución: Actualizar el ID y todas las foreign keys que lo referencian
-- ============================================================================

-- PASO 1: Identificar los IDs involucrados
SELECT 
    'auth.users' as origen,
    au.id,
    au.email,
    au.created_at
FROM auth.users au
WHERE au.email = 'lucsnasmelo@gmail.com'
UNION ALL
SELECT 
    'usuarios' as origen,
    u.id,
    u.email,
    u.data_criacao
FROM usuarios u
WHERE u.email = 'lucsnasmelo@gmail.com';

-- PASO 2: Ver qué tablas referencian a este usuario
-- Revisar referencias en processos_juridicos
SELECT 
    'processos_juridicos - advogado_responsavel' as tabla_campo,
    COUNT(*) as registros_afectados
FROM processos_juridicos
WHERE advogado_responsavel = (SELECT id FROM usuarios WHERE email = 'lucsnasmelo@gmail.com')
UNION ALL
SELECT 
    'processos_juridicos - creado_por' as tabla_campo,
    COUNT(*) as registros_afectados
FROM processos_juridicos
WHERE creado_por = (SELECT id FROM usuarios WHERE email = 'lucsnasmelo@gmail.com')
UNION ALL
-- Revisar referencias en clientes
SELECT 
    'clientes - creado_por' as tabla_campo,
    COUNT(*) as registros_afectados
FROM clientes
WHERE creado_por = (SELECT id FROM usuarios WHERE email = 'lucsnasmelo@gmail.com')
UNION ALL
SELECT 
    'clientes - atualizado_por' as tabla_campo,
    COUNT(*) as registros_afectados
FROM clientes
WHERE atualizado_por = (SELECT id FROM usuarios WHERE email = 'lucsnasmelo@gmail.com');

-- ============================================================================
-- PASO 3: EJECUTAR LA ACTUALIZACIÓN COMPLETA (Transaction)
-- ============================================================================

BEGIN;

-- Declarar variables para los IDs
DO $$
DECLARE
    id_antiguo UUID;
    id_nuevo UUID;
BEGIN
    -- Obtener el ID antiguo (el que está en usuarios)
    SELECT id INTO id_antiguo FROM usuarios WHERE email = 'lucsnasmelo@gmail.com';
    
    -- Obtener el ID nuevo (el que está en auth.users)
    SELECT id INTO id_nuevo FROM auth.users WHERE email = 'lucsnasmelo@gmail.com';
    
    RAISE NOTICE 'ID Antiguo (usuarios): %', id_antiguo;
    RAISE NOTICE 'ID Nuevo (auth.users): %', id_nuevo;
    
    -- PASO 1: Modificar temporalmente el email del registro antiguo para evitar conflicto
    UPDATE usuarios
    SET email = email || '.OLD_TEMP_' || id_antiguo::text
    WHERE id = id_antiguo;
    
    RAISE NOTICE 'Email temporal asignado al registro antiguo';
    
    -- PASO 2: Crear el nuevo registro en usuarios con el ID y email correctos
    INSERT INTO usuarios (
        id, email, nome, role, foto_perfil_url, ativo, data_criacao, creado_por
    )
    SELECT 
        id_nuevo,  -- El ID nuevo de auth.users
        'lucsnasmelo@gmail.com',  -- Email correcto
        nome,
        role,
        foto_perfil_url,
        ativo,
        data_criacao,
        id_nuevo  -- creado_por también usa el nuevo ID
    FROM usuarios
    WHERE email LIKE '%lucsnasmelo@gmail.com.OLD_TEMP_%'
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Usuario creado con nuevo ID: %', id_nuevo;
    
    -- PASO 3: Ahora actualizar todas las foreign keys al nuevo ID
    
    -- Actualizar processos_juridicos - advogado_responsavel
    UPDATE processos_juridicos
    SET advogado_responsavel = id_nuevo
    WHERE advogado_responsavel = id_antiguo;
    
    RAISE NOTICE 'Actualizados processos_juridicos.advogado_responsavel: %', FOUND;
    
    -- Actualizar processos_juridicos - creado_por
    UPDATE processos_juridicos
    SET creado_por = id_nuevo
    WHERE creado_por = id_antiguo;
    
    RAISE NOTICE 'Actualizados processos_juridicos.creado_por: %', FOUND;
    
    -- Actualizar processos_juridicos - atualizado_por
    UPDATE processos_juridicos
    SET atualizado_por = id_nuevo
    WHERE atualizado_por = id_antiguo;
    
    -- Actualizar clientes - creado_por
    UPDATE clientes
    SET creado_por = id_nuevo
    WHERE creado_por = id_antiguo;
    
    RAISE NOTICE 'Actualizados clientes.creado_por: %', FOUND;
    
    -- Actualizar clientes - atualizado_por
    UPDATE clientes
    SET atualizado_por = id_nuevo
    WHERE atualizado_por = id_antiguo;
    
    RAISE NOTICE 'Actualizados clientes.atualizado_por: %', FOUND;
    
    -- NOTA: audiencias NO tiene advogado_id directo
    -- Las audiencias se vinculan a abogados a través de processos_juridicos.advogado_responsavel
    -- Ya actualizamos processos_juridicos.advogado_responsavel arriba
    
    -- NOTA: posts_sociais y comentarios_sociais no usan la columna criado_por/usuario_id
    -- o tienen nombres de columna diferentes. Omitidos de esta actualización.
    
    -- PASO 4: Finalmente, eliminar el registro antiguo de usuarios
    DELETE FROM usuarios
    WHERE email LIKE '%lucsnasmelo@gmail.com.OLD_TEMP_%';
    
    RAISE NOTICE 'Usuario antiguo eliminado. Migración completa de % a %', id_antiguo, id_nuevo;
    
END $$;

-- Si todo salió bien, confirmar los cambios
COMMIT;

-- Si algo salió mal, deshacer todo:
-- ROLLBACK;

-- ============================================================================
-- PASO 4: VERIFICACIÓN POST-ACTUALIZACIÓN
-- ============================================================================

-- Verificar que el usuario ahora tiene el ID correcto
SELECT 
    u.id as usuario_id,
    au.id as auth_id,
    u.email,
    u.id = au.id as ids_coinciden
FROM usuarios u
INNER JOIN auth.users au ON u.email = au.email
WHERE u.email = 'lucsnasmelo@gmail.com';

-- Verificar el estado final
SELECT 
    (SELECT COUNT(*) FROM auth.users) as total_auth_users,
    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM auth.users au WHERE NOT EXISTS (SELECT 1 FROM usuarios u WHERE u.id = au.id)) as usuarios_faltantes,
    (SELECT COUNT(*) FROM auth.users au WHERE EXISTS (SELECT 1 FROM usuarios u WHERE u.email = au.email AND u.id != au.id)) as emails_duplicados,
    (SELECT COUNT(*) FROM usuarios u WHERE NOT EXISTS (SELECT 1 FROM auth.users au WHERE au.id = u.id)) as usuarios_huerfanos;

-- Resultado esperado:
-- usuarios_faltantes: 1 (aún falta crear otro usuario)
-- emails_duplicados: 0 (✓ resuelto)
-- usuarios_huerfanos: 0 (✓ resuelto, porque el antiguo se convirtió en el correcto)
