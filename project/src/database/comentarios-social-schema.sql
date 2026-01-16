-- SCRIPT SQL PARA CRIAR A TABELA DE COMENTÁRIOS DE POSTS SOCIAIS
-- Execute este script na aba SQL do dashboard do Supabase

-- Tabela de Comentários dos Posts Sociais
CREATE TABLE IF NOT EXISTS comentarios_posts_social (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES posts_sociais(id) ON DELETE CASCADE,
    autor_nome VARCHAR(255) NOT NULL,
    autor_email VARCHAR(255),
    comentario TEXT NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Opcional: moderar comentários
    aprovado BOOLEAN DEFAULT true,
    
    -- Índices para melhor performance
    CONSTRAINT comentarios_posts_social_comentario_check CHECK (char_length(comentario) >= 1 AND char_length(comentario) <= 1000)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_comentarios_post_id ON comentarios_posts_social(post_id);
CREATE INDEX IF NOT EXISTS idx_comentarios_data_criacao ON comentarios_posts_social(data_criacao DESC);
CREATE INDEX IF NOT EXISTS idx_comentarios_aprovado ON comentarios_posts_social(aprovado);

-- Habilitar Row Level Security (RLS)
ALTER TABLE comentarios_posts_social ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler comentários aprovados
CREATE POLICY "Comentários aprovados são visíveis para todos"
    ON comentarios_posts_social
    FOR SELECT
    USING (aprovado = true);

-- Política: Qualquer pessoa pode criar comentários
CREATE POLICY "Qualquer pessoa pode criar comentários"
    ON comentarios_posts_social
    FOR INSERT
    WITH CHECK (true);

-- Política: Apenas admins podem atualizar/deletar
CREATE POLICY "Apenas admins podem atualizar comentários"
    ON comentarios_posts_social
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.email = auth.jwt() ->> 'email'
            AND usuarios.role = 'admin'
        )
    );

CREATE POLICY "Apenas admins podem deletar comentários"
    ON comentarios_posts_social
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.email = auth.jwt() ->> 'email'
            AND usuarios.role = 'admin'
        )
    );

-- View para contar comentários por post
CREATE OR REPLACE VIEW view_comentarios_count AS
SELECT 
    post_id,
    COUNT(*) as total_comentarios
FROM comentarios_posts_social
WHERE aprovado = true
GROUP BY post_id;

-- Comentários
COMMENT ON TABLE comentarios_posts_social IS 'Comentários dos posts sociais do site';
COMMENT ON COLUMN comentarios_posts_social.aprovado IS 'Define se o comentário foi aprovado para exibição (moderação)';
