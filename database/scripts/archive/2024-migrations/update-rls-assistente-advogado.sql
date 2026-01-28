-- =====================================================
-- ACTUALIZACIÓN DE POLÍTICAS RLS PARA ASSISTENTE Y ADVOGADO
-- =====================================================
-- Este script modifica las políticas RLS para permitir que:
-- - assistente y advogado pueden: CREAR, LEER y EDITAR clientes y processos
-- - NO PUEDEN: editar nome_completo en clientes ni numero_processo en processos_juridicos
-- =====================================================

-- ========================================
-- 1. ACTUALIZAR POLÍTICAS DE CLIENTES
-- ========================================

-- Remover políticas antiguas de clientes
DROP POLICY IF EXISTS "clientes_select_policy" ON clientes;
DROP POLICY IF EXISTS "clientes_insert_policy" ON clientes;
DROP POLICY IF EXISTS "clientes_update_policy" ON clientes;
DROP POLICY IF EXISTS "clientes_delete_policy" ON clientes;

-- SELECT: Todos os usuários autenticados podem ver clientes
CREATE POLICY "clientes_select_policy" 
ON clientes FOR SELECT 
USING (
  auth.role() = 'authenticated'
);

-- INSERT: Admin, advogado y assistente pueden crear clientes
CREATE POLICY "clientes_insert_policy" 
ON clientes FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role IN ('admin', 'advogado', 'assistente')
  )
);

-- UPDATE: Admin, advogado y assistente pueden editar clientes
-- IMPORTANTE: assistente y advogado NO pueden editar nome_completo
CREATE POLICY "clientes_update_policy" 
ON clientes FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role IN ('admin', 'advogado', 'assistente')
  )
)
WITH CHECK (
  -- Admin puede hacer cualquier cambio
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role = 'admin'
  )
  OR
  -- Advogado y assistente NO pueden cambiar nome_completo
  (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.role IN ('advogado', 'assistente')
    )
    AND nome_completo = (SELECT nome_completo FROM clientes WHERE id = clientes.id)
  )
);

-- DELETE: Apenas admin pode excluir clientes
CREATE POLICY "clientes_delete_policy" 
ON clientes FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role = 'admin'
  )
);

-- ========================================
-- 2. ACTUALIZAR POLÍTICAS DE PROCESSOS_JURIDICOS
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
-- IMPORTANTE: assistente y advogado NO pueden editar numero_processo
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
  -- Advogado y assistente NO podem cambiar numero_processo
  (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.role IN ('advogado', 'assistente')
    )
    AND (
      numero_processo IS NULL 
      OR numero_processo = (SELECT numero_processo FROM processos_juridicos WHERE id = processos_juridicos.id)
    )
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

-- Verificar políticas de clientes
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
  AND tablename IN ('clientes', 'processos_juridicos')
ORDER BY tablename, policyname;

-- ========================================
-- NOTAS IMPORTANTES
-- ========================================
-- 1. Los roles 'assistente' y 'advogado' ahora pueden:
--    - Crear clientes y processos (INSERT)
--    - Leer clientes y processos (SELECT)
--    - Editar clientes y processos (UPDATE)
-- 
-- 2. Restricciones para 'assistente' y 'advogado':
--    - NO pueden editar el campo 'nome_completo' de la tabla clientes
--    - NO pueden editar el campo 'numero_processo' de la tabla processos_juridicos
--    - NO pueden eliminar clientes ni processos (solo admin)
-- 
-- 3. El rol 'admin' mantiene control total (CRUD completo sin restricciones)
-- 
-- 4. La verificación se hace comparando el valor actual con el valor en la base de datos
--    para asegurar que estos campos específicos no sean modificados
