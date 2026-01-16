-- SCRIPT SQL PARA CREAR LA TABLA DE CLIENTES EN SUPABASE
-- Execute este script en la pestaña SQL del dashboard de Supabase

-- Tabla de Clientes
CREATE TABLE clientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Información Personal
    nome_completo VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(18) UNIQUE,
    rg VARCHAR(20),
    data_nascimento DATE,
    nacionalidade VARCHAR(100),
    estado_civil VARCHAR(20) CHECK (estado_civil IN ('solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel')),
    profissao VARCHAR(100),
    
    -- Contacto
    email VARCHAR(255),
    telefone VARCHAR(20),
    celular VARCHAR(20) NOT NULL,
    telefone_alternativo VARCHAR(20),
    
    -- Dirección
    cep VARCHAR(10),
    endereco VARCHAR(500),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    pais VARCHAR(100) DEFAULT 'Brasil',
    
    -- Información Adicional
    observacoes TEXT,
    como_conheceu VARCHAR(100), -- Como conoció al despacho
    indicado_por VARCHAR(255), -- Quién lo recomendó
    
    -- Status y gestión
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'potencial')),
    categoria VARCHAR(50), -- VIP, Regular, etc.
    
    -- Metadata
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultimo_contato TIMESTAMP WITH TIME ZONE,
    
    -- Búsqueda y SEO
    search_vector tsvector
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_clientes_cpf_cnpj ON clientes(cpf_cnpj);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_nome ON clientes(nome_completo);
CREATE INDEX idx_clientes_status ON clientes(status);
CREATE INDEX idx_clientes_search ON clientes USING gin(search_vector);

-- Trigger para actualizar data_atualizacao
CREATE OR REPLACE FUNCTION update_clientes_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_clientes_data_atualizacao
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_clientes_data_atualizacao();

-- Trigger para actualizar search_vector (búsqueda full-text)
CREATE OR REPLACE FUNCTION update_clientes_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector = 
        setweight(to_tsvector('portuguese', COALESCE(NEW.nome_completo, '')), 'A') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.email, '')), 'B') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.cpf_cnpj, '')), 'B') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.telefone, '')), 'C') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.celular, '')), 'C') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.cidade, '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_clientes_search_vector
    BEFORE INSERT OR UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_clientes_search_vector();

-- Políticas RLS (Row Level Security)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios autenticados pueden ver todos los clientes
CREATE POLICY "Usuarios autenticados podem ver clientes" 
    ON clientes FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Política: Los usuarios autenticados pueden insertar clientes
CREATE POLICY "Usuarios autenticados podem criar clientes" 
    ON clientes FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Política: Los usuarios autenticados pueden actualizar clientes
CREATE POLICY "Usuarios autenticados podem atualizar clientes" 
    ON clientes FOR UPDATE 
    USING (auth.role() = 'authenticated');

-- Política: Solo admin puede eliminar clientes
CREATE POLICY "Apenas admin pode deletar clientes" 
    ON clientes FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM usuarios 
            WHERE usuarios.id = auth.uid() 
            AND usuarios.role = 'admin'
        )
    );

-- Comentarios de la tabla
COMMENT ON TABLE clientes IS 'Tabla de gestión de clientes del despacho de abogados';
COMMENT ON COLUMN clientes.cpf_cnpj IS 'CPF para persona física o CNPJ para persona jurídica';
COMMENT ON COLUMN clientes.status IS 'Status del cliente: ativo (cliente actual), inativo (ex-cliente), potencial (lead)';
COMMENT ON COLUMN clientes.categoria IS 'Categoría del cliente para segmentación (VIP, Regular, etc.)';
COMMENT ON COLUMN clientes.search_vector IS 'Vector de búsqueda full-text optimizado';

-- Datos de ejemplo (opcional)
INSERT INTO clientes (
    nome_completo,
    cpf_cnpj,
    email,
    celular,
    endereco,
    cidade,
    estado,
    status,
    categoria,
    como_conheceu
) VALUES 
(
    'Maria Silva Santos',
    '123.456.789-00',
    'maria.silva@email.com',
    '(11) 98765-4321',
    'Rua das Flores, 123',
    'São Paulo',
    'SP',
    'ativo',
    'Regular',
    'Indicação'
),
(
    'João Pedro Oliveira',
    '987.654.321-00',
    'joao.oliveira@email.com',
    '(21) 99876-5432',
    'Av. Atlântica, 456',
    'Rio de Janeiro',
    'RJ',
    'ativo',
    'VIP',
    'Google'
);
