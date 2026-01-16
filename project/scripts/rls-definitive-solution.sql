-- SOLUCIÓN DEFINITIVA: Políticas RLS correctas para sistema jurídico
-- Este script configura Row Level Security de forma permanente y segura

-- 1. LIMPIAR políticas existentes
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON usuarios;
DROP POLICY IF EXISTS "Advogados podem ver todos os processos" ON processos_juridicos;
DROP POLICY IF EXISTS "authenticated_users_select_usuarios" ON usuarios;
DROP POLICY IF EXISTS "authenticated_users_insert_usuarios" ON usuarios;
DROP POLICY IF EXISTS "authenticated_users_update_usuarios" ON usuarios;
DROP POLICY IF EXISTS "authenticated_users_select_processos" ON processos_juridicos;
DROP POLICY IF EXISTS "authenticated_users_insert_processos" ON processos_juridicos;
DROP POLICY IF EXISTS "authenticated_users_update_processos" ON processos_juridicos;
DROP POLICY IF EXISTS "authenticated_users_delete_processos" ON processos_juridicos;
DROP POLICY IF EXISTS "authenticated_users_select_comentarios" ON comentarios_processos;
DROP POLICY IF EXISTS "authenticated_users_insert_comentarios" ON comentarios_processos;
DROP POLICY IF EXISTS "authenticated_users_update_comentarios" ON comentarios_processos;
DROP POLICY IF EXISTS "authenticated_users_delete_comentarios" ON comentarios_processos;
DROP POLICY IF EXISTS "authenticated_users_select_documentos" ON documentos_processos;
DROP POLICY IF EXISTS "authenticated_users_insert_documentos" ON documentos_processos;
DROP POLICY IF EXISTS "authenticated_users_update_documentos" ON documentos_processos;
DROP POLICY IF EXISTS "authenticated_users_delete_documentos" ON documentos_processos;

-- 2. GARANTIR que RLS está habilitado
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE processos_juridicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios_processos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_processos ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS DEFINITIVAS para USUARIOS
-- Os usuários podem ver todos os outros usuários (necessário para atribuições)
CREATE POLICY "users_can_read_all_users" ON usuarios
    FOR SELECT USING (
        auth.uid() IS NOT NULL
    );

-- Usuários podem atualizar apenas seus próprios dados
CREATE POLICY "users_can_update_own_data" ON usuarios
    FOR UPDATE USING (
        auth.uid()::text = id::text
    );

-- Apenas admins podem inserir novos usuários
CREATE POLICY "admins_can_insert_users" ON usuarios
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- 4. POLÍTICAS DEFINITIVAS para PROCESSOS JURÍDICOS
-- Todos os usuários autenticados podem ler processos
CREATE POLICY "authenticated_users_read_processos" ON processos_juridicos
    FOR SELECT USING (
        auth.uid() IS NOT NULL
    );

-- Todos os usuários autenticados podem criar processos
CREATE POLICY "authenticated_users_create_processos" ON processos_juridicos
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
    );

-- Usuários podem atualizar processos (advogados seus próprios, admins todos)
CREATE POLICY "users_can_update_processos" ON processos_juridicos
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND (
            -- Advogado responsável pelo processo pode editar
            advogado_responsavel::text = auth.uid()::text OR
            -- Admins podem editar qualquer processo
            EXISTS (
                SELECT 1 FROM usuarios 
                WHERE id::text = auth.uid()::text 
                AND role = 'admin'
            )
        )
    );

-- Apenas admins podem deletar processos
CREATE POLICY "admins_can_delete_processos" ON processos_juridicos
    FOR DELETE USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- 5. POLÍTICAS DEFINITIVAS para COMENTÁRIOS
-- Todos podem ler comentários dos processos que têm acesso
CREATE POLICY "users_can_read_comentarios" ON comentarios_processos
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM processos_juridicos p
            WHERE p.id = processo_id
        )
    );

-- Usuários autenticados podem criar comentários
CREATE POLICY "authenticated_users_create_comentarios" ON comentarios_processos
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL AND
        autor::text = auth.uid()::text
    );

-- Usuários podem editar apenas seus próprios comentários
CREATE POLICY "users_can_update_own_comentarios" ON comentarios_processos
    FOR UPDATE USING (
        auth.uid() IS NOT NULL AND
        autor::text = auth.uid()::text
    );

-- Usuários podem deletar seus comentários, admins podem deletar qualquer um
CREATE POLICY "users_can_delete_comentarios" ON comentarios_processos
    FOR DELETE USING (
        auth.uid() IS NOT NULL AND (
            autor::text = auth.uid()::text OR
            EXISTS (
                SELECT 1 FROM usuarios 
                WHERE id::text = auth.uid()::text 
                AND role = 'admin'
            )
        )
    );

-- 6. POLÍTICAS DEFINITIVAS para DOCUMENTOS
-- Políticas similares aos comentários
CREATE POLICY "users_can_read_documentos" ON documentos_processos
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND
        EXISTS (
            SELECT 1 FROM processos_juridicos p
            WHERE p.id = processo_id
        )
    );

CREATE POLICY "authenticated_users_create_documentos" ON documentos_processos
    FOR INSERT WITH CHECK (
        auth.uid() IS NOT NULL
    );

CREATE POLICY "users_can_update_documentos" ON documentos_processos
    FOR UPDATE USING (
        auth.uid() IS NOT NULL
    );

CREATE POLICY "users_can_delete_documentos" ON documentos_processos
    FOR DELETE USING (
        auth.uid() IS NOT NULL AND (
            EXISTS (
                SELECT 1 FROM processos_juridicos p
                WHERE p.id = processo_id 
                AND p.advogado_responsavel::text = auth.uid()::text
            ) OR
            EXISTS (
                SELECT 1 FROM usuarios 
                WHERE id::text = auth.uid()::text 
                AND role = 'admin'
            )
        )
    );

-- 7. GARANTIR que existe pelo menos um admin
-- Atualizar usuário Wilson para admin se não existir admin
UPDATE usuarios 
SET role = 'admin' 
WHERE email = 'wil.oliv.advogados@gmail.com';

-- 8. VERIFICAÇÃO FINAL
-- Verificar políticas criadas
SELECT 
    tablename,
    policyname,
    cmd,
    permissive,
    roles
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('usuarios', 'processos_juridicos', 'comentarios_processos', 'documentos_processos')
ORDER BY tablename, policyname;

-- Verificar RLS habilitado
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('usuarios', 'processos_juridicos', 'comentarios_processos', 'documentos_processos');

COMMIT;