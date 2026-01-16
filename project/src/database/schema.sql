-- SCRIPT SQL PARA CRIAR AS TABELAS NO SUPABASE
-- Execute este script na aba SQL do dashboard do Supabase

-- 1. Tabela de Usuários (Advogados e Staff)
CREATE TABLE usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'advogado', 'assistente')),
    ativo BOOLEAN DEFAULT true,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Processos Jurídicos
CREATE TABLE processos_juridicos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(500) NOT NULL,
    descricao TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'em_aberto' 
        CHECK (status IN ('em_aberto', 'em_andamento', 'fechado')),
    advogado_responsavel UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Referencia al cliente (normalizado)
    cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
    
    -- Dados adicionais del cliente (opcional, para referencia rápida)
    cliente_email VARCHAR(255),
    cliente_telefone VARCHAR(20),
    
    -- Número do processo (opcional)
    numero_processo VARCHAR(100) UNIQUE,
    
    -- Metadados adicionais
    prioridade VARCHAR(10) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    area_direito VARCHAR(100),
    valor_causa DECIMAL(15,2),
    data_vencimento DATE
);

-- 3. Tabela de Comentários/Atualizações dos Processos
CREATE TABLE comentarios_processos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    processo_id UUID NOT NULL REFERENCES processos_juridicos(id) ON DELETE CASCADE,
    comentario TEXT NOT NULL,
    autor UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tipo VARCHAR(20) DEFAULT 'comentario' 
        CHECK (tipo IN ('comentario', 'status_change', 'documento', 'prazo'))
);

-- 4. Tabela de Documentos (opcional para futura expansão)
CREATE TABLE documentos_processos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    processo_id UUID NOT NULL REFERENCES processos_juridicos(id) ON DELETE CASCADE,
    nome_arquivo VARCHAR(255) NOT NULL,
    tipo_documento VARCHAR(100),
    url_arquivo VARCHAR(1000),
    tamanho_bytes INTEGER,
    usuario_upload UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    data_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TRIGGERS para atualizar automaticamente data_atualizacao
CREATE OR REPLACE FUNCTION update_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_data_atualizacao
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_data_atualizacao();

CREATE TRIGGER update_processos_data_atualizacao
    BEFORE UPDATE ON processos_juridicos
    FOR EACH ROW
    EXECUTE FUNCTION update_data_atualizacao();

-- ÍNDICES para melhor performance
CREATE INDEX idx_processos_status ON processos_juridicos(status);
CREATE INDEX idx_processos_advogado ON processos_juridicos(advogado_responsavel);
CREATE INDEX idx_processos_cliente ON processos_juridicos(cliente_id);
CREATE INDEX idx_processos_data_criacao ON processos_juridicos(data_criacao);
CREATE INDEX idx_comentarios_processo ON comentarios_processos(processo_id);
CREATE INDEX idx_documentos_processo ON documentos_processos(processo_id);

-- POLÍTICAS RLS (Row Level Security) - Configurar conforme necessário
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE processos_juridicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios_processos ENABLE ROW LEVEL SECURITY;
ALTER TABLE documentos_processos ENABLE ROW LEVEL SECURITY;

-- Exemplo de política básica (ajustar conforme suas regras de negócio)
CREATE POLICY "Usuários podem ver seus próprios dados" ON usuarios
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Advogados podem ver todos os processos" ON processos_juridicos
    FOR SELECT USING (true); -- Ajustar conforme necessário

-- Política: Solo admin puede eliminar procesos
CREATE POLICY "Apenas admin pode deletar processos" ON processos_juridicos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE usuarios.id = auth.uid() 
            AND usuarios.role = 'admin'
        )
    );

-- DADOS INICIAIS (opcional)
-- Inserir usuários padrão (ajustar dados reais)
INSERT INTO usuarios (email, nome, role) VALUES
('wilson@advocaciaintegral.com', 'Dr. Wilson Santos', 'admin'),
('lucas@advocaciaintegral.com', 'Dr. Lucas Nascimento', 'advogado'),
('rosimeire@advocaciaintegral.com', 'Dra. Rosimeire Albuquerque', 'advogado');

-- VIEWS úteis
CREATE VIEW view_processos_completos AS
SELECT 
    p.*,
    u.nome as advogado_nome,
    u.email as advogado_email,
    c.nome_completo as cliente_nome,
    c.cpf_cnpj as cliente_cpf_cnpj,
    (SELECT COUNT(*) FROM comentarios_processos co WHERE co.processo_id = p.id) as total_comentarios,
    (SELECT COUNT(*) FROM documentos_processos d WHERE d.processo_id = p.id) as total_documentos
FROM processos_juridicos p
LEFT JOIN usuarios u ON p.advogado_responsavel = u.id
LEFT JOIN clientes c ON p.cliente_id = c.id;

-- COMENTÁRIOS DAS TABELAS
COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema (advogados, assistentes, admin)';
COMMENT ON TABLE processos_juridicos IS 'Tabela principal de processos jurídicos';
COMMENT ON TABLE comentarios_processos IS 'Comentários e atualizações dos processos';
COMMENT ON TABLE documentos_processos IS 'Documentos anexados aos processos';

-- 5. Tabela de Posts Sociais (Nova funcionalidade)
CREATE TABLE posts_sociais (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(500) NOT NULL,
    conteudo TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('article', 'video', 'image', 'announcement')),
    image_url VARCHAR(1000),
    video_url VARCHAR(1000),
    youtube_id VARCHAR(20),
    tags TEXT[], -- Array de tags
    autor UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    publicado BOOLEAN DEFAULT false,
    destaque BOOLEAN DEFAULT false,
    likes INTEGER DEFAULT 0,
    comentarios INTEGER DEFAULT 0,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar data_atualizacao em posts_sociais
CREATE TRIGGER update_posts_sociais_data_atualizacao
    BEFORE UPDATE ON posts_sociais
    FOR EACH ROW
    EXECUTE FUNCTION update_data_atualizacao();

-- Índices para posts sociais
CREATE INDEX idx_posts_sociais_publicado ON posts_sociais(publicado);
CREATE INDEX idx_posts_sociais_destaque ON posts_sociais(destaque);
CREATE INDEX idx_posts_sociais_tipo ON posts_sociais(tipo);
CREATE INDEX idx_posts_sociais_autor ON posts_sociais(autor);
CREATE INDEX idx_posts_sociais_data_criacao ON posts_sociais(data_criacao);

-- RLS para posts sociais
ALTER TABLE posts_sociais ENABLE ROW LEVEL SECURITY;

-- Políticas para posts sociais
CREATE POLICY "Posts publicados são visíveis para todos" ON posts_sociais
    FOR SELECT USING (publicado = true);

CREATE POLICY "Apenas admins podem gerenciar posts" ON posts_sociais
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

COMMENT ON TABLE posts_sociais IS 'Tabela de posts para área social (notícias, vídeos, artigos)';