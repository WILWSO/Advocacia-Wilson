-- =====================================================
-- POLÍTICAS RLS (Row Level Security) PARA SUPABASE
-- =====================================================
-- Execute este script no dashboard do Supabase (SQL Editor)
-- para configurar as permissões baseadas em roles
-- 
-- Roles: admin, advogado, usuario
-- =====================================================

-- ========================================
-- 1. TABLA USUARIOS
-- ========================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "usuarios_select_policy" ON usuarios;
DROP POLICY IF EXISTS "usuarios_insert_policy" ON usuarios;
DROP POLICY IF EXISTS "usuarios_update_policy" ON usuarios;
DROP POLICY IF EXISTS "usuarios_delete_policy" ON usuarios;

-- HABILITAR RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- SELECT: Todos os usuários autenticados podem ver todos os usuários ativos
CREATE POLICY "usuarios_select_policy" 
ON usuarios FOR SELECT 
USING (
  auth.role() = 'authenticated'
);

-- INSERT: Apenas admin pode criar novos usuários
CREATE POLICY "usuarios_insert_policy" 
ON usuarios FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role = 'admin'
  )
);

-- UPDATE: Admin pode editar todos, outros usuários apenas seus próprios dados
-- IMPORTANTE: Usuários NÃO-ADMIN não podem mudar seu próprio ROLE ou STATUS ATIVO
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

-- DELETE: Apenas admin pode excluir usuários
CREATE POLICY "usuarios_delete_policy" 
ON usuarios FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role = 'admin'
  )
);

-- ========================================
-- 2. TABLA PROCESSOS_JURIDICOS
-- ========================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "processos_select_policy" ON processos_juridicos;
DROP POLICY IF EXISTS "processos_insert_policy" ON processos_juridicos;
DROP POLICY IF EXISTS "processos_update_policy" ON processos_juridicos;
DROP POLICY IF EXISTS "processos_delete_policy" ON processos_juridicos;

-- HABILITAR RLS
ALTER TABLE processos_juridicos ENABLE ROW LEVEL SECURITY;

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
-- RESTRICCIONES ACTUALIZADAS (16/02/2026):
-- 1. ✅ TODOS los roles PUEDEN editar 'numero_processo' (cambio aplicado)
-- 2. assistente y advogado NO pueden editar 'titulo'
-- 3. assistente y advogado NO pueden editar 'advogado_responsavel'
-- 4. assistente NO puede editar 'status' (solo admin y advogado)
-- NOTA: numero_processo es UNIQUE pero NULLABLE
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
  -- Advogado PUEDE EDITAR numero_processo (cambio 16/02/2026)
  -- Restricciones: titulo y advogado_responsavel
  (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.role = 'advogado'
    )
    AND titulo = (SELECT titulo FROM processos_juridicos WHERE id = processos_juridicos.id)
    AND (
      advogado_responsavel IS NULL
      OR advogado_responsavel = (SELECT advogado_responsavel FROM processos_juridicos WHERE id = processos_juridicos.id)
    )
  )
  OR
  -- Assistente PUEDE EDITAR numero_processo (cambio 16/02/2026)
  -- Restricciones: titulo, advogado_responsavel y status
  (
    EXISTS (
      SELECT 1 FROM usuarios
      WHERE usuarios.id = auth.uid()
      AND usuarios.role = 'assistente'
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
-- 3. TABLA CLIENTES
-- ========================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "clientes_select_policy" ON clientes;
DROP POLICY IF EXISTS "clientes_insert_policy" ON clientes;
DROP POLICY IF EXISTS "clientes_update_policy" ON clientes;
DROP POLICY IF EXISTS "clientes_delete_policy" ON clientes;

-- HABILITAR RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- SELECT: Todos os usuários autenticados podem ver clientes
CREATE POLICY "clientes_select_policy" 
ON clientes FOR SELECT 
USING (
  auth.role() = 'authenticated'
);

-- INSERT: Admin, advogado y assistente podem criar clientes
CREATE POLICY "clientes_insert_policy" 
ON clientes FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role IN ('admin', 'advogado', 'assistente')
  )
);

-- UPDATE: Admin, advogado y assistente podem editar clientes
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
  -- Admin pode fazer qualquer mudança
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
-- 4. TABLA COMENTARIOS_PROCESSOS
-- ========================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "comentarios_select_policy" ON comentarios_processos;
DROP POLICY IF EXISTS "comentarios_insert_policy" ON comentarios_processos;
DROP POLICY IF EXISTS "comentarios_update_policy" ON comentarios_processos;
DROP POLICY IF EXISTS "comentarios_delete_policy" ON comentarios_processos;

-- HABILITAR RLS
ALTER TABLE comentarios_processos ENABLE ROW LEVEL SECURITY;

-- SELECT: Todos os usuários autenticados podem ver comentários
CREATE POLICY "comentarios_select_policy" 
ON comentarios_processos FOR SELECT 
USING (
  auth.role() = 'authenticated'
);

-- INSERT: Admin e advogado podem criar comentários
CREATE POLICY "comentarios_insert_policy" 
ON comentarios_processos FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role IN ('admin', 'advogado')
  )
);

-- UPDATE: Apenas o autor pode editar seu próprio comentário
CREATE POLICY "comentarios_update_policy" 
ON comentarios_processos FOR UPDATE 
USING (
  autor = auth.uid()
);

-- DELETE: Admin pode deletar qualquer comentário, outros apenas os próprios
CREATE POLICY "comentarios_delete_policy" 
ON comentarios_processos FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role = 'admin'
  )
  OR autor = auth.uid()
);

-- ========================================
-- 5. TABLA POSTS_SOCIAIS
-- ========================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "posts_select_policy" ON posts_sociais;
DROP POLICY IF EXISTS "posts_insert_policy" ON posts_sociais;
DROP POLICY IF EXISTS "posts_update_policy" ON posts_sociais;
DROP POLICY IF EXISTS "posts_delete_policy" ON posts_sociais;

-- HABILITAR RLS
ALTER TABLE posts_sociais ENABLE ROW LEVEL SECURITY;

-- SELECT: Todos podem ver posts publicados, autenticados veem todos
CREATE POLICY "posts_select_policy" 
ON posts_sociais FOR SELECT 
USING (
  publicado = true
  OR auth.role() = 'authenticated'
);

-- INSERT: Apenas admin e advogado podem criar posts
CREATE POLICY "posts_insert_policy" 
ON posts_sociais FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role IN ('admin', 'advogado')
  )
);

-- UPDATE: Admin e advogado podem editar posts
CREATE POLICY "posts_update_policy" 
ON posts_sociais FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role IN ('admin', 'advogado')
  )
);

-- DELETE: Apenas admin pode excluir posts
CREATE POLICY "posts_delete_policy" 
ON posts_sociais FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role = 'admin'
  )
);

-- ========================================
-- 6. TABLA DOCUMENTOS_PROCESSOS (se existir)
-- ========================================

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "documentos_select_policy" ON documentos_processos;
DROP POLICY IF EXISTS "documentos_insert_policy" ON documentos_processos;
DROP POLICY IF EXISTS "documentos_update_policy" ON documentos_processos;
DROP POLICY IF EXISTS "documentos_delete_policy" ON documentos_processos;

-- HABILITAR RLS (se a tabela existir)
ALTER TABLE documentos_processos ENABLE ROW LEVEL SECURITY;

-- SELECT: Todos os usuários autenticados podem ver documentos
CREATE POLICY "documentos_select_policy" 
ON documentos_processos FOR SELECT 
USING (
  auth.role() = 'authenticated'
);

-- INSERT: Admin e advogado podem fazer upload de documentos
CREATE POLICY "documentos_insert_policy" 
ON documentos_processos FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role IN ('admin', 'advogado')
  )
);

-- UPDATE: Admin e advogado podem atualizar documentos
CREATE POLICY "documentos_update_policy" 
ON documentos_processos FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role IN ('admin', 'advogado')
  )
);

-- DELETE: Apenas admin pode excluir documentos
CREATE POLICY "documentos_delete_policy" 
ON documentos_processos FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM usuarios
    WHERE usuarios.id = auth.uid()
    AND usuarios.role = 'admin'
  )
);

-- ========================================
-- VERIFICAÇÃO DAS POLÍTICAS
-- ========================================

-- Execute este comando para verificar as políticas criadas:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;

-- ========================================
-- NOTAS IMPORTANTES
-- ========================================
-- 1. auth.uid() retorna o ID do usuário autenticado do Supabase Auth
-- 2. auth.role() retorna 'authenticated' para usuários logados ou 'anon' para anônimos
-- 3. O campo 'role' na tabla usuarios define: 'admin', 'advogado', 'assistente'
-- 4. Admin tem controle total (CRUD completo)
-- 5. Advogado pode criar/editar processos e clientes, mas não deletar
-- 6. Assistente só pode editar seus próprios dados
-- 7. Solo admin pode mudar status (ativo/inativo) de usuários e clientes
