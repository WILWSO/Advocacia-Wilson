-- =====================================================
-- ACTUALIZACIÓN DE POLÍTICAS RLS - TITULO, STATUS Y ADVOGADO_RESPONSAVEL
-- =====================================================
-- Este script modifica las políticas RLS para:
-- 1. Proteger el campo 'titulo' en processos_juridicos (solo admin puede editar)
-- 2. Proteger el campo 'advogado_responsavel' en processos_juridicos (solo admin puede editar)
-- 3. Permitir que advogado (además de admin) pueda editar el campo 'status' en processos_juridicos
-- 4. Assistente NO puede editar titulo, advogado_responsavel ni status en processos_juridicos
-- =====================================================

-- ========================================
-- ACTUALIZAR POLÍTICAS DE PROCESSOS_JURIDICOS
-- ========================================

-- Remover políticas antiguas de processos
DROP POLICY IF EXISTS "processos_select_policy" ON processos_juridicos;
DROP POLICY IF EXISTS "processos_insert_policy" ON processos_juridicos;
DROP POLICY IF EXISTS "processos_update_policy" ON processos_juridicos;
DROP POLICY IF EXISTS "processos_delete_policy" ON processos_juridicos;

-- SELECT: Todos os usuários autenticados podem ver processos
CREATE POLICY "processos_select_policy" 
ON processos_juridicos FOR SELECT 
USING (
  auth.role() = 'authenticated'
);

-- INSERT: Admin, advogado y assistente podem criar processos
CREATE POLICY "processos_insert_policy" 
ON processos_juridicos FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role IN ('admin', 'advogado', 'assistente')
  )
);

-- UPDATE: Admin, advogado y assistente podem editar processos
-- RESTRICCIONES:
-- 1. assistente y advogado NO pueden editar 'numero_processo'
-- 2. assistente y advogado NO pueden editar 'titulo'
-- 3. assistente y advogado NO pueden editar 'advogado_responsavel'
-- 4. assistente NO puede editar 'status' (solo admin y advogado)
CREATE POLICY "processos_update_policy" 
ON processos_juridicos FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role IN ('admin', 'advogado', 'assistente')
  )
)
WITH CHECK (
  -- Admin pode fazer qualquer mudança
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role = 'admin'
  )
  OR
  -- Advogado puede editar todo EXCEPTO numero_processo, titulo y advogado_responsavel
  (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.role = 'advogado'
    )
    AND (
      numero_processo IS NULL 
      OR numero_processo = (SELECT numero_processo FROM processos_juridicos WHERE id = processos_juridicos.id)
    )
    AND titulo = (SELECT titulo FROM processos_juridicos WHERE id = processos_juridicos.id)
    AND (
      advogado_responsavel IS NULL
      OR advogado_responsavel = (SELECT advogado_responsavel FROM processos_juridicos WHERE id = processos_juridicos.id)
    )
  )
  OR
  -- Assistente NO puede cambiar numero_processo, titulo, advogado_responsavel ni status
  (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.role = 'assistente'
    )
    AND (
      numero_processo IS NULL 
      OR numero_processo = (SELECT numero_processo FROM processos_juridicos WHERE id = processos_juridicos.id)
    )
    AND titulo = (SELECT titulo FROM processos_juridicos WHERE id = processos_juridicos.id)
    AND (
      advogado_responsavel IS NULL
      OR advogado_responsavel = (SELECT advogado_responsavel FROM processos_juridicos WHERE id = processos_juridicos.id)
    )
    AND status = (SELECT status FROM processos_juridicos WHERE id = processos_juridicos.id)
  )
);

-- DELETE: Apenas admin pode excluir processos
CREATE POLICY "processos_delete_policy" 
ON processos_juridicos FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role = 'admin'
  )
);

-- ========================================
-- VERIFICACIÓN DE POLÍTICAS
-- ========================================

-- Verificar políticas de processos_juridicos
SELECT 
  tablename, 
  policyname, 
  permissive, 
  cmd,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING: ' || qual 
    ELSE '' 
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check 
    ELSE '' 
  END as with_check_clause
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'processos_juridicos'
ORDER BY tablename, policyname;

-- ========================================
-- NOTAS IMPORTANTES
-- ========================================
-- RESTRICCIONES POR ROL EN PROCESSOS_JURIDICOS:
-- 
-- ADMIN:
--   ✅ Puede editar todos los campos sin restricciones
--   ✅ Puede cambiar: titulo, numero_processo, advogado_responsavel, status, y todos los demás
-- 
-- ADVOGADO:
--   ✅ Puede crear processos
--   ✅ Puede editar la mayoría de campos
--   ❌ NO puede editar: numero_processo
--   ❌ NO puede editar: titulo
--   ❌ NO puede editar: advogado_responsavel (no puede reasignar processos)
--   ✅ PUEDE editar: status (a diferencia de assistente)
-- 
-- ASSISTENTE:
--   ✅ Puede crear processos
--   ✅ Puede editar campos generales
--   ❌ NO puede editar: numero_processo
--   ❌ NO puede editar: titulo
--   ❌ NO puede editar: advogado_responsavel (no puede reasignar processos)
--   ❌ NO puede editar: status
-- 
-- IMPORTANTE: Los cambios se validan comparando el valor nuevo con el valor
-- actual en la base de datos para asegurar que los campos protegidos no cambien.
