-- SCRIPT DE MIGRAÇÃO: Normalização de Clientes
-- Execute este script APÓS criar a tabela clientes
-- Este script atualiza processos_juridicos para referenciar a nova tabela clientes

-- 1. Adicionar coluna cliente_id na tabela processos_juridicos
ALTER TABLE processos_juridicos 
ADD COLUMN cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL;

-- 2. Renomear cliente_nome para manter compatibilidade temporária (opcional)
-- Se preferir, pode deletar a coluna cliente_nome após migrar os dados
-- ALTER TABLE processos_juridicos DROP COLUMN cliente_nome;

-- 3. Criar índice para cliente_id
CREATE INDEX IF NOT EXISTS idx_processos_cliente ON processos_juridicos(cliente_id);

-- 4. Adicionar política RLS para DELETE - apenas admin pode deletar processos
DROP POLICY IF EXISTS "Apenas admin pode deletar processos" ON processos_juridicos;
CREATE POLICY "Apenas admin pode deletar processos" ON processos_juridicos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE usuarios.id = auth.uid() 
            AND usuarios.role = 'admin'
        )
    );

-- 5. Adicionar política RLS para DELETE - apenas admin pode deletar clientes
DROP POLICY IF EXISTS "Apenas admin pode deletar clientes" ON clientes;
CREATE POLICY "Apenas admin pode deletar clientes" ON clientes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE usuarios.id = auth.uid() 
            AND usuarios.role = 'admin'
        )
    );

-- 6. Recriar VIEW view_processos_completos com JOIN à tabela clientes
DROP VIEW IF EXISTS view_processos_completos;
CREATE VIEW view_processos_completos AS
SELECT 
    p.id,
    p.titulo,
    p.descricao,
    p.status,
    p.advogado_responsavel,
    p.data_criacao,
    p.data_atualizacao,
    p.cliente_id,
    p.cliente_email,
    p.cliente_telefone,
    p.numero_processo,
    p.prioridade,
    p.area_direito,
    p.valor_causa,
    p.data_vencimento,
    u.nome as advogado_nome,
    u.email as advogado_email,
    c.nome_completo as cliente_nome,
    c.cpf_cnpj as cliente_cpf_cnpj,
    c.celular as cliente_celular,
    c.status as cliente_status,
    c.categoria as cliente_categoria,
    (SELECT COUNT(*) FROM comentarios_processos co WHERE co.processo_id = p.id) as total_comentarios,
    (SELECT COUNT(*) FROM documentos_processos d WHERE d.processo_id = p.id) as total_documentos
FROM processos_juridicos p
LEFT JOIN usuarios u ON p.advogado_responsavel = u.id
LEFT JOIN clientes c ON p.cliente_id = c.id;

-- COMENTÁRIOS
COMMENT ON COLUMN processos_juridicos.cliente_id IS 'Referência ao cliente na tabela clientes (normalizado)';
COMMENT ON VIEW view_processos_completos IS 'View completa de processos com dados de advogado e cliente';

-- NOTA: Para migrar dados existentes, execute queries como:
-- UPDATE processos_juridicos p
-- SET cliente_id = (
--     SELECT c.id FROM clientes c 
--     WHERE c.nome_completo = p.cliente_nome 
--     OR c.email = p.cliente_email
--     LIMIT 1
-- )
-- WHERE p.cliente_nome IS NOT NULL;
