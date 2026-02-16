-- SCRIPT SQL PARA CRIAR AS TABELAS NO SUPABASE
-- Execute este script na aba SQL do dashboard do Supabase

-- 1. Tabela de Usuários (Advogados e Staff)
CREATE TABLE usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    titulo TEXT,
    nome VARCHAR(255) NOT NULL,
    nome_completo TEXT,
    foto_perfil_url TEXT,
    data_nascimento DATE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'advogado', 'assistente')),
    ativo BOOLEAN DEFAULT true,
    tipo_documento TEXT,
    numero_documento TEXT,
    whatsapp TEXT,
    redes_sociais JSONB,
    endereco TEXT,
    numero TEXT,
    localidade TEXT,
    estado TEXT,
    cep TEXT,
    pais TEXT DEFAULT 'Brasil',
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Campos de auditoría
    creado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    atualizado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 2. Tabela de Processos Jurídicos
CREATE TABLE processos_juridicos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo VARCHAR(500) NOT NULL,
    descricao TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'em_aberto' 
        CHECK (status IN ('em_aberto', 'em_andamento', 'fechado')),
    advogado_responsavel UUID NOT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Referencia al cliente (normalizado)
    cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
    
    -- Polo do cliente no processo (obligatorio)
    polo VARCHAR(20) NOT NULL CHECK (polo IN ('ativo', 'passivo')),
    
    -- Dados adicionais del cliente (opcional, para referencia rápida)
    cliente_email VARCHAR(255),
    cliente_telefone VARCHAR(20),
    
    -- Número do processo (opcional, UNIQUE si informado) - ✅ ACTUALIZADO 16/02/2026
    -- Todos los roles pueden editar este campo
    numero_processo VARCHAR(100) UNIQUE,
    
    -- Informação de jurisdição (JSONB: {uf, municipio, vara, juiz})
    jurisdicao JSONB DEFAULT '{}'::jsonb,
    
    -- Competência do processo (texto livre)
    competencia VARCHAR(100),
    
    -- Atividade pendente
    atividade_pendente TEXT,
    
    -- Metadados adicionais
    prioridade VARCHAR(10) DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
    area_direito VARCHAR(100),
    valor_causa DECIMAL(15,2),
    
    -- Documentos e links (JSONB)
    documentos_processo JSONB DEFAULT '[]'::jsonb,
    links_processo JSONB DEFAULT '[]'::jsonb,
    jurisprudencia JSONB DEFAULT '[]'::jsonb,
    
    -- Honorários (JSONB: {valor_honorarios, detalhes})
    honorarios JSONB DEFAULT '{}'::jsonb,
    
    -- Audiências (JSONB array: [{data, horario, tipo, forma, lugar}])
    audiencias JSONB DEFAULT '[]'::jsonb,
    
    -- Campos de auditoría
    creado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    atualizado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- TRIGGERS para atualizar automaticamente data_atualizacao
CREATE OR REPLACE FUNCTION update_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- FUNCIONES DE AUDITORÍA
-- Función para establecer creado_por en INSERT
CREATE OR REPLACE FUNCTION audit_creado_por()
RETURNS TRIGGER AS $$
BEGIN
    NEW.creado_por = auth.uid();
    NEW.atualizado_por = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar atualizado_por en UPDATE
CREATE OR REPLACE FUNCTION audit_atualizado_por()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_por = auth.uid();
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGERS DE AUDITORÍA PARA USUARIOS
CREATE TRIGGER usuarios_audit_insert
    BEFORE INSERT ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION audit_creado_por();

CREATE TRIGGER usuarios_audit_update
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION audit_atualizado_por();

-- TRIGGERS DE AUDITORÍA PARA PROCESSOS
CREATE TRIGGER processos_audit_insert
    BEFORE INSERT ON processos_juridicos
    FOR EACH ROW
    EXECUTE FUNCTION audit_creado_por();

CREATE TRIGGER processos_audit_update
    BEFORE UPDATE ON processos_juridicos
    FOR EACH ROW
    EXECUTE FUNCTION audit_atualizado_por();

-- ÍNDICES para melhor performance
CREATE INDEX idx_processos_status ON processos_juridicos(status);
CREATE INDEX idx_processos_advogado ON processos_juridicos(advogado_responsavel);
CREATE INDEX idx_processos_cliente ON processos_juridicos(cliente_id);
CREATE INDEX idx_processos_data_criacao ON processos_juridicos(data_criacao);

-- Índices para novos campos
CREATE INDEX idx_processos_competencia ON processos_juridicos(competencia);
CREATE INDEX idx_processos_polo ON processos_juridicos(polo);

-- Índices GIN para campos JSONB
CREATE INDEX idx_processos_jurisdicao ON processos_juridicos USING GIN (jurisdicao);
CREATE INDEX idx_processos_honorarios ON processos_juridicos USING GIN (honorarios);
CREATE INDEX idx_processos_audiencias ON processos_juridicos USING GIN (audiencias);
CREATE INDEX idx_processos_links ON processos_juridicos USING GIN (links_processo);
CREATE INDEX idx_processos_jurisprudencia ON processos_juridicos USING GIN (jurisprudencia);

-- Índices de auditoría
CREATE INDEX idx_usuarios_creado_por ON usuarios(creado_por);
CREATE INDEX idx_usuarios_atualizado_por ON usuarios(atualizado_por);
CREATE INDEX idx_processos_creado_por ON processos_juridicos(creado_por);
CREATE INDEX idx_processos_atualizado_por ON processos_juridicos(atualizado_por);

-- POLÍTICAS RLS (Row Level Security) - Configurar conforme necessário
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE processos_juridicos ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- NOTA: Para políticas RLS completas y actualizadas,
-- execute el archivo: src/database/rls-policies.sql
-- Este archivo contiene las políticas actualizadas que permiten:
-- - assistente y advogado: crear, leer y editar clientes y processos
-- - ✅ ACTUALIZADO 16/02/2026: TODOS los roles pueden editar numero_processo
-- - Restricciones: NO pueden editar nome_completo (clientes), titulo y advogado_responsavel (processos)
-- =====================================================

-- Ejemplo de política básica (ajustar conforme suas regras de negócio)
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
    c.cpf_cnpj as cliente_cpf_cnpj
FROM processos_juridicos p
LEFT JOIN usuarios u ON p.advogado_responsavel = u.id
LEFT JOIN clientes c ON p.cliente_id = c.id;

-- COMENTÁRIOS DAS TABELAS
COMMENT ON TABLE usuarios IS 'Tabela de usuários do sistema (advogados, assistentes, admin)';
COMMENT ON TABLE processos_juridicos IS 'Tabela principal de processos jurídicos';

-- COMENTÁRIOS DOS CAMPOS DE AUDITORIA
COMMENT ON COLUMN usuarios.creado_por IS 'Usuario que creó este registro';
COMMENT ON COLUMN usuarios.atualizado_por IS 'Usuario que realizó la última actualización';
COMMENT ON COLUMN processos_juridicos.creado_por IS 'Usuario que creó este registro';
COMMENT ON COLUMN processos_juridicos.atualizado_por IS 'Usuario que realizó la última actualización';

-- NOTA: Los campos creado_por y atualizado_por se llenan automáticamente
-- mediante triggers. No es necesario enviarlos desde el frontend.
-- Los triggers usan auth.uid() para obtener el usuario autenticado actual.

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

-- 6. Tabela de Comentários dos Posts Sociais
CREATE TABLE IF NOT EXISTS comentarios_sociais (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES posts_sociais(id) ON DELETE CASCADE,
    autor_nome VARCHAR(255) NOT NULL,
    autor_email VARCHAR(255),
    comentario TEXT NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Opcional: moderar comentários
    aprovado BOOLEAN DEFAULT true,
    
    -- Índices para melhor performance
    CONSTRAINT comentarios_sociais_comentario_check CHECK (char_length(comentario) >= 1 AND char_length(comentario) <= 1000)
);

-- Índices para comentarios_sociais
CREATE INDEX IF NOT EXISTS idx_comentarios_sociais_post_id ON comentarios_sociais(post_id);
CREATE INDEX IF NOT EXISTS idx_comentarios_sociais_data_criacao ON comentarios_sociais(data_criacao DESC);
CREATE INDEX IF NOT EXISTS idx_comentarios_sociais_aprovado ON comentarios_sociais(aprovado);

-- Habilitar Row Level Security (RLS)
ALTER TABLE comentarios_sociais ENABLE ROW LEVEL SECURITY;

-- Política: Todos podem ler comentários aprovados
CREATE POLICY "Comentários aprovados são visíveis para todos"
    ON comentarios_sociais
    FOR SELECT
    USING (aprovado = true);

-- Política: Qualquer pessoa pode criar comentários
CREATE POLICY "Qualquer pessoa pode criar comentários"
    ON comentarios_sociais
    FOR INSERT
    WITH CHECK (true);

-- Política: Apenas admins podem atualizar/deletar
CREATE POLICY "Apenas admins podem atualizar comentários"
    ON comentarios_sociais
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.email = auth.jwt() ->> 'email'
            AND usuarios.role = 'admin'
        )
    );

CREATE POLICY "Apenas admins podem deletar comentários"
    ON comentarios_sociais
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.email = auth.jwt() ->> 'email'
            AND usuarios.role = 'admin'
        )
    );

COMMENT ON TABLE comentarios_sociais IS 'Comentários dos posts sociais do site';
COMMENT ON COLUMN comentarios_sociais.aprovado IS 'Define se o comentário foi aprovado para exibição (moderação)';

-- =====================================================
-- NOTA: TABLA 'documentos' REMOVIDA - 16/02/2026
-- =====================================================
-- La tabla polimórfica 'documentos' fue eliminada porque NUNCA se utilizó en el frontend.
-- El sistema usa campos JSONB en su lugar:
-- - clientes.documentos_cliente (JSONB array de DocumentoArquivo)
-- - processos_juridicos.documentos_processo (JSONB array de DocumentoArquivo)
-- 
-- Para más información, consultar:
-- - docs/ANALISIS_TABLAS_OBSOLETAS.md
-- - database/migration-eliminar-documentos-jurisprudencias.sql
-- =====================================================

-- 7. Tabela de Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Qué tabla/entidad fue afectada
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    
    -- Tipo de operación
    operation VARCHAR(20) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    
    -- Usuario que realizó la acción
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    usuario_email VARCHAR(255),
    usuario_nome VARCHAR(255),
    
    -- Datos del cambio
    old_data JSONB, -- Estado anterior (para UPDATE y DELETE)
    new_data JSONB, -- Estado nuevo (para INSERT y UPDATE)
    changed_fields TEXT[], -- Array de campos que cambiaron
    
    -- Metadatos adicionales
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamp
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contexto adicional
    notes TEXT -- Notas o razón del cambio
);

-- Índices para audit_log
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_record_id ON audit_log(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_operation ON audit_log(operation);
CREATE INDEX IF NOT EXISTS idx_audit_log_usuario_id ON audit_log(usuario_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_record ON audit_log(table_name, record_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_old_data ON audit_log USING GIN (old_data);
CREATE INDEX IF NOT EXISTS idx_audit_log_new_data ON audit_log USING GIN (new_data);

-- RLS para audit_log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Política: Solo admins pueden ver el log de auditoría
CREATE POLICY "Apenas admins podem ver audit log"
    ON audit_log
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.id = auth.uid()
            AND usuarios.role = 'admin'
        )
    );

-- Política: El sistema puede insertar en audit_log
CREATE POLICY "Sistema pode insertar en audit log"
    ON audit_log
    FOR INSERT
    WITH CHECK (true);

COMMENT ON TABLE audit_log IS 'Registro de auditoría de todas las operaciones críticas del sistema';
COMMENT ON COLUMN audit_log.operation IS 'Tipo de operación: INSERT, UPDATE, DELETE';

-- =====================================================
-- NOTA: TABLA 'jurisprudencias' REMOVIDA - 16/02/2026
-- =====================================================
-- La tabla 'jurisprudencias' fue eliminada porque NUNCA se utilizó en el frontend.
-- El sistema usa un campo JSONB en su lugar:
-- - processos_juridicos.jurisprudencia (JSONB array de tipo Jurisprudencia)
-- 
-- Interface TypeScript (src/types/processo.ts):
-- interface Jurisprudencia {
--   ementa: string
--   link: string
-- }
-- 
-- La gestión se realiza directamente en ProcessosPage.tsx con CRUD completo.
-- 
-- Para más información, consultar:
-- - docs/ANALISIS_TABLAS_OBSOLETAS.md
-- - database/migration-eliminar-documentos-jurisprudencias.sql
-- =====================================================

-- FIN DEL SCHEMA