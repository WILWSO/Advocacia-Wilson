-- ============================================================================
-- DIAGNÓSTICO DE USUARIOS: Ejecuta cada sección para ver los problemas
-- ============================================================================
-- Resultados actuales: 1 faltante, 1 duplicado, 1 huérfano
-- Sigue estos pasos:
-- 1. Ejecuta las 3 consultas SELECT de diagnóstico (líneas 8, 19, 47)
-- 2. Anota los IDs y emails que aparecen
-- 3. Ejecuta la solución correspondiente (A, B o C)
-- 4. Verifica con el query final (línea 105)
-- ============================================================================

-- 1. Usuario faltante en tabla usuarios (tiene auth pero no usuarios)
SELECT 
    'FALTANTE - Crear este usuario' as accion,
    au.id,
    au.email,
    au.created_at,
    au.raw_user_meta_data
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios u WHERE u.id = au.id
);

-- 2. Email duplicado (mismo email, diferentes IDs)
SELECT 
    'DUPLICADO - Decidir cuál mantener' as accion,
    'auth.users' as origen,
    au.id,
    au.email,
    au.created_at as fecha
FROM auth.users au
WHERE EXISTS (
    SELECT 1 FROM usuarios u 
    WHERE u.email = au.email AND u.id != au.id
)
UNION ALL
SELECT 
    'DUPLICADO - Decidir cuál mantener' as accion,
    'usuarios' as origen,
    u.id,
    u.email,
    u.data_criacao as fecha
FROM usuarios u
WHERE EXISTS (
    SELECT 1 FROM auth.users au 
    WHERE au.email = u.email AND au.id != u.id
)
ORDER BY email, origen;

-- 3. Usuario huérfano (tiene usuarios pero no auth)
SELECT 
    'HUÉRFANO - Posiblemente eliminar o crear auth' as accion,
    u.id,
    u.email,
    u.nome,
    u.role,
    u.data_criacao
FROM usuarios u
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users au WHERE au.id = u.id
);

-- ==============================================================
-- SOLUCIONES SEGÚN EL CASO
-- ==============================================================

-- SOLUCIÓN A: Crear usuario faltante en tabla usuarios
-- Ejecutar solo si el diagnóstico #1 muestra un usuario
/*
INSERT INTO usuarios (id, email, nome, role, ativo, data_criacao)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'nome', au.email),
    COALESCE(au.raw_user_meta_data->>'role', 'assistente'),
    true,
    NOW()
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM usuarios u WHERE u.id = au.id)
  AND NOT EXISTS (SELECT 1 FROM usuarios u WHERE u.email = au.email);
*/

-- SOLUCIÓN B: Resolver email duplicado
-- Opción B1: Actualizar el ID del registro en usuarios para que coincida con auth.users
/*
UPDATE usuarios 
SET id = (SELECT id FROM auth.users WHERE email = usuarios.email LIMIT 1)
WHERE email = 'lucsnasmelo@gmail.com'
  AND id != (SELECT id FROM auth.users WHERE email = usuarios.email LIMIT 1);
*/

-- Opción B2: Eliminar el duplicado de usuarios y dejar que se recree
/*
DELETE FROM usuarios 
WHERE email = 'lucsnasmelo@gmail.com'
  AND id NOT IN (SELECT id FROM auth.users WHERE email = usuarios.email);
*/

-- SOLUCIÓN C: Eliminar usuario huérfano
-- Solo si está seguro de que no se necesita
/*
DELETE FROM usuarios
WHERE id NOT IN (SELECT id FROM auth.users);
*/

-- ==============================================================
-- VERIFICACIÓN FINAL
-- ==============================================================

-- Ejecutar después de aplicar las soluciones
SELECT 
    (SELECT COUNT(*) FROM auth.users) as total_auth_users,
    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
    (SELECT COUNT(*) FROM auth.users au WHERE NOT EXISTS (SELECT 1 FROM usuarios u WHERE u.id = au.id)) as usuarios_faltantes,
    (SELECT COUNT(*) FROM auth.users au WHERE EXISTS (SELECT 1 FROM usuarios u WHERE u.email = au.email AND u.id != au.id)) as emails_duplicados,
    (SELECT COUNT(*) FROM usuarios u WHERE NOT EXISTS (SELECT 1 FROM auth.users au WHERE au.id = u.id)) as usuarios_huerfanos;

-- Resultado esperado:
-- usuarios_faltantes: 0
-- emails_duplicados: 0
-- usuarios_huerfanos: 0
