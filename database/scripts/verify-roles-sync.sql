-- =====================================================
-- VERIFICAÇÃO: Sincronização de Roles
-- =====================================================
-- Execute no Supabase SQL Editor para verificar
-- que os roles estão sincronizados corretamente
--
-- Data: 18 de enero de 2026
-- =====================================================

-- 1. VERIFICAR constraint atual da tabela usuarios
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.usuarios'::regclass
  AND conname = 'usuarios_role_check';

-- 2. VERIFICAR roles existentes na tabela
SELECT DISTINCT role, COUNT(*) as total
FROM usuarios
GROUP BY role
ORDER BY role;

-- 3. LISTAR usuários com roles não padrão (se houver)
SELECT id, nome, email, role
FROM usuarios
WHERE role NOT IN ('admin', 'advogado', 'assistente')
ORDER BY role, nome;

-- =====================================================
-- RESULTADO ESPERADO:
-- =====================================================
-- Constraint deve aceitar: 'admin', 'advogado', 'assistente'
-- Usuários devem ter apenas esses 3 roles
-- =====================================================

-- COMENTÁRIO sobre a tabela
COMMENT ON TABLE usuarios IS 
'Tabela de usuários do sistema. Roles permitidos: admin (controle total), advogado (gestão de processos/clientes), assistente (somente leitura e edição própria)';

COMMENT ON COLUMN usuarios.role IS 
'Role do usuário. Valores permitidos: admin, advogado, assistente';
