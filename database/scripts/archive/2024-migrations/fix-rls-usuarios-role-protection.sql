-- =====================================================
-- FIX RLS: Protección de cambio de ROLE en usuarios
-- =====================================================
-- Execute este script no Supabase SQL Editor para aplicar
-- a correção que impede usuários não-admin de mudarem
-- seu próprio role ou status ativo.
--
-- Data: 17 de enero de 2026
-- =====================================================

-- 1. ELIMINAR política antigua
DROP POLICY IF EXISTS "usuarios_update_policy" ON usuarios;

-- 2. CREAR política corregida con protección de ROLE y ATIVO
CREATE POLICY "usuarios_update_policy" 
ON usuarios FOR UPDATE 
USING (
  -- Admin pode atualizar qualquer usuário
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role = 'admin'
  )
  OR
  -- Usuário pode atualizar apenas seus próprios dados
  id = auth.uid()
)
WITH CHECK (
  -- Admin pode fazer qualquer mudança
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role = 'admin'
  )
  OR
  -- Usuário não-admin NÃO pode mudar seu próprio role ou status ativo
  (
    id = auth.uid()
    AND role = (SELECT role FROM usuarios WHERE id = auth.uid())
    AND ativo = (SELECT ativo FROM usuarios WHERE id = auth.uid())
  )
);

-- 3. VERIFICAR política criada
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename = 'usuarios'
  AND policyname = 'usuarios_update_policy';

-- =====================================================
-- RESULTADO ESPERADO:
-- =====================================================
-- ✅ Admin: Pode mudar role, ativo e todos os campos de qualquer usuário
-- ✅ Usuário normal: Pode editar seus próprios dados, MAS NÃO pode mudar seu role ou ativo
-- ✅ Usuário normal: Tentativa de mudar role será rejeitada pelo banco
-- =====================================================

COMMENT ON POLICY usuarios_update_policy ON usuarios IS 
'Admin pode editar qualquer usuário. Usuários podem editar seus próprios dados mas não podem mudar seu role ou status ativo.';
