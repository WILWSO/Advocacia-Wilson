-- Migración: Corregir constraint de creado_por en clientes
-- Fecha: 2026-02-02
-- Descripción: Modificar trigger para manejar casos donde el usuario no existe en la tabla usuarios

-- 1. Modificar función audit_creado_por para verificar existencia del usuario
CREATE OR REPLACE FUNCTION audit_creado_por()
RETURNS TRIGGER AS $$
DECLARE
    usuario_existe BOOLEAN;
BEGIN
    -- Verificar si el usuario existe en la tabla usuarios
    SELECT EXISTS(
        SELECT 1 FROM usuarios WHERE id = auth.uid()
    ) INTO usuario_existe;
    
    -- Solo asignar creado_por si el usuario existe en usuarios
    IF usuario_existe THEN
        NEW.creado_por = auth.uid();
        NEW.atualizado_por = auth.uid();
    ELSE
        -- Registrar advertencia pero permitir la inserción
        RAISE WARNING 'Usuario % no encontrado en tabla usuarios. Registro creado sin creado_por.', auth.uid();
        -- Dejar creado_por como NULL (permitido por la constraint ON DELETE SET NULL)
        NEW.creado_por = NULL;
        NEW.atualizado_por = NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Modificar función audit_atualizado_por con la misma lógica
CREATE OR REPLACE FUNCTION audit_atualizado_por()
RETURNS TRIGGER AS $$
DECLARE
    usuario_existe BOOLEAN;
BEGIN
    -- Verificar si el usuario existe en la tabla usuarios
    SELECT EXISTS(
        SELECT 1 FROM usuarios WHERE id = auth.uid()
    ) INTO usuario_existe;
    
    -- Solo asignar atualizado_por si el usuario existe en usuarios
    IF usuario_existe THEN
        NEW.atualizado_por = auth.uid();
    ELSE
        RAISE WARNING 'Usuario % no encontrado en tabla usuarios. Update sin atualizado_por.', auth.uid();
        NEW.atualizado_por = NULL;
    END IF;
    
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Función helper para sincronizar usuarios de auth.users a la tabla usuarios
-- Esta función debe ejecutarse cuando se crea un nuevo usuario
CREATE OR REPLACE FUNCTION sync_auth_user_to_usuarios()
RETURNS TRIGGER AS $$
DECLARE
    email_existe BOOLEAN;
BEGIN
    -- Verificar si el email ya existe en usuarios (con otro ID)
    SELECT EXISTS(
        SELECT 1 FROM usuarios WHERE email = NEW.email AND id != NEW.id
    ) INTO email_existe;
    
    -- Solo insertar si el email no existe con otro ID
    IF NOT email_existe THEN
        INSERT INTO usuarios (
            id,
            email,
            nome,
            role,
            ativo,
            data_criacao
        )
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email),
            COALESCE(NEW.raw_user_meta_data->>'role', 'assistente'),
            true,
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;
    ELSE
        RAISE NOTICE 'Email % ya existe en usuarios con otro ID. No se creará registro duplicado.', NEW.email;
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN unique_violation THEN
        -- Si hay violación de constraint, simplemente continuar sin error
        RAISE NOTICE 'No se pudo sincronizar usuario % - %: constraint violation', NEW.id, NEW.email;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Crear trigger en auth.users para sincronizar automáticamente
-- NOTA: Este trigger debe crearse con permisos de superusuario
-- Si no tienes acceso, debes ejecutarlo manualmente en Supabase Dashboard
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--     AFTER INSERT ON auth.users
--     FOR EACH ROW
--     EXECUTE FUNCTION sync_auth_user_to_usuarios();

-- 5. Script para sincronizar usuarios existentes de auth.users a usuarios
-- Ejecutar esto una vez para migrar usuarios existentes
DO $$
DECLARE
    auth_user RECORD;
    usuarios_insertados INT := 0;
    usuarios_omitidos INT := 0;
BEGIN
    -- Este bloque debe ejecutarse con permisos adecuados
    -- Para cada usuario en auth.users que no está en usuarios
    FOR auth_user IN 
        SELECT au.id, au.email, au.raw_user_meta_data
        FROM auth.users au
        WHERE NOT EXISTS (
            SELECT 1 FROM usuarios u WHERE u.id = au.id
        )
        AND NOT EXISTS (
            -- También verificar que el email no exista con otro ID
            SELECT 1 FROM usuarios u WHERE u.email = au.email
        )
    LOOP
        BEGIN
            INSERT INTO usuarios (
                id,
                email,
                nome,
                role,
                ativo,
                data_criacao
            )
            VALUES (
                auth_user.id,
                auth_user.email,
                COALESCE(auth_user.raw_user_meta_data->>'nome', auth_user.email),
                COALESCE(auth_user.raw_user_meta_data->>'role', 'assistente'),
                true,
                NOW()
            )
            ON CONFLICT (id) DO NOTHING;
            
            usuarios_insertados := usuarios_insertados + 1;
        EXCEPTION
            WHEN unique_violation THEN
                -- Si hay violación de constraint único, simplemente omitir
                usuarios_omitidos := usuarios_omitidos + 1;
                RAISE NOTICE 'Usuario omitido (email duplicado): % - %', auth_user.id, auth_user.email;
        END;
    END LOOP;
    
    RAISE NOTICE 'Sincronización completada: % insertados, % omitidos', usuarios_insertados, usuarios_omitidos;
END $$;

-- 6. Comentarios explicativos
COMMENT ON FUNCTION audit_creado_por() IS 
'Función de auditoría que asigna creado_por y atualizado_por solo si el usuario existe en la tabla usuarios';

COMMENT ON FUNCTION audit_atualizado_por() IS 
'Función de auditoría que asigna atualizado_por solo si el usuario existe en la tabla usuarios';

COMMENT ON FUNCTION sync_auth_user_to_usuarios() IS 
'Función para sincronizar automáticamente usuarios de auth.users a la tabla usuarios';

-- 7. Verificar que todos los usuarios actuales tengan registro en usuarios
SELECT 
    COUNT(*) as usuarios_auth,
    (SELECT COUNT(*) FROM usuarios) as usuarios_tabla,
    COUNT(*) - (SELECT COUNT(*) FROM usuarios) as diferencia
FROM auth.users;

-- 8. Script de diagnóstico: Identificar conflictos potenciales
-- Ejecutar ANTES de la migración para ver qué usuarios causan problemas

-- 8.1 Usuarios en auth.users sin registro en usuarios (por ID)
SELECT 
    'Sin registro en usuarios' as problema,
    au.id,
    au.email,
    au.created_at
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios u WHERE u.id = au.id
)
ORDER BY au.created_at;

-- 8.2 Emails duplicados entre auth.users y usuarios (diferente ID)
SELECT 
    'Email duplicado con diferente ID' as problema,
    au.id as auth_id,
    u.id as usuarios_id,
    au.email,
    au.created_at as auth_created,
    u.data_criacao as usuarios_created
FROM auth.users au
INNER JOIN usuarios u ON au.email = u.email AND au.id != u.id
ORDER BY au.email;

-- 8.3 Usuarios en tabla usuarios sin correspondencia en auth.users
SELECT 
    'Huérfano (sin auth.users)' as problema,
    u.id,
    u.email,
    u.role,
    u.data_criacao
FROM usuarios u
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users au WHERE au.id = u.id
)
ORDER BY u.data_criacao;

-- 8.4 Resumen de estado
SELECT 
    (SELECT COUNT(*) FROM auth.users) as total_auth_users,
    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM auth.users au WHERE NOT EXISTS (SELECT 1 FROM usuarios u WHERE u.id = au.id)) as usuarios_faltantes,
    (SELECT COUNT(*) FROM auth.users au WHERE EXISTS (SELECT 1 FROM usuarios u WHERE u.email = au.email AND u.id != au.id)) as emails_duplicados,
    (SELECT COUNT(*) FROM usuarios u WHERE NOT EXISTS (SELECT 1 FROM auth.users au WHERE au.id = u.id)) as usuarios_huerfanos;
