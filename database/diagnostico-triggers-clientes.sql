-- Diagnóstico de triggers y políticas en tabla clientes
-- Ejecutar en Supabase Dashboard para ver el estado actual

-- 1. Ver todos los triggers en tabla clientes
SELECT 
    t.tgname AS trigger_name,
    t.tgenabled AS enabled,
    p.proname AS function_name,
    pg_get_triggerdef(t.oid) AS trigger_definition
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE c.relname = 'clientes'
  AND t.tgisinternal = false
ORDER BY t.tgname;

-- 2. Ver el código de las funciones de auditoría actuales
SELECT 
    proname AS function_name,
    pg_get_functiondef(oid) AS function_definition
FROM pg_proc
WHERE proname IN ('audit_creado_por', 'audit_atualizado_por', 'validate_nome_completo_change')
ORDER BY proname;

-- 3. Ver todas las políticas RLS en clientes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'clientes'
ORDER BY policyname;
