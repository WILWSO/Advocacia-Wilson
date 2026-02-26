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
    
    -- Dirección (Actualizado: 2026-02-26)
    -- NOTA: Campos endereco, numero, complemento, bairro fueron fusionados en endereco_completo
    cep VARCHAR(10),
    endereco_completo TEXT, -- Campo único para dirección completa (Rua, Número, Complemento, Bairro)
    cidade VARCHAR(100),
    estado VARCHAR(50), -- UF (2 caracteres para Brasil, nombre completo para otros países)
    pais VARCHAR(100) DEFAULT 'Brasil',
    
    -- Información Adicional
    observacoes TEXT,
    como_conheceu VARCHAR(100), -- Como conoció al despacho
    indicado_por VARCHAR(255), -- Quién lo recomendó
    
    -- Status y gestión
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'potencial')),
    categoria VARCHAR(50), -- VIP, Regular, etc.
    
    -- Documentos
    documentos_cliente JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultimo_contato TIMESTAMP WITH TIME ZONE,
    
    -- Campos de auditoría
    creado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    atualizado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    
    -- Búsqueda y SEO
    search_vector tsvector
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_clientes_cpf_cnpj ON clientes(cpf_cnpj);
CREATE INDEX idx_clientes_email ON clientes(email);
CREATE INDEX idx_clientes_nome ON clientes(nome_completo);
CREATE INDEX idx_clientes_status ON clientes(status);
CREATE INDEX idx_clientes_search ON clientes USING gin(search_vector);

-- Índices de auditoría
CREATE INDEX idx_clientes_creado_por ON clientes(creado_por);
CREATE INDEX idx_clientes_atualizado_por ON clientes(atualizado_por);

-- Trigger para actualizar data_atualizacao
CREATE OR REPLACE FUNCTION update_clientes_data_atualizacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_atualizacao = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- TRIGGERS DE AUDITORÍA
CREATE TRIGGER clientes_audit_insert
    BEFORE INSERT ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION audit_creado_por();

CREATE TRIGGER clientes_audit_update
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION audit_atualizado_por();

-- Trigger para actualizar data_atualizacao (legacy, ahora manejado por audit_atualizado_por)
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

-- Política SELECT: Los usuarios autenticados pueden ver todos los clientes
CREATE POLICY "Usuarios autenticados podem ver clientes" 
    ON clientes FOR SELECT 
    USING (auth.role() = 'authenticated');

-- Política INSERT: Admin, advogado y assistente podem criar clientes
CREATE POLICY "Admin advogado assistente podem criar clientes" 
    ON clientes FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.id = auth.uid()
            AND usuarios.role IN ('admin', 'advogado', 'assistente')
        )
    );

-- Política UPDATE: Admin, advogado y assistente podem editar clientes
-- IMPORTANTE: assistente y advogado NO pueden editar nome_completo
CREATE POLICY "Admin advogado assistente podem atualizar clientes" 
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

-- Política DELETE: Solo admin puede eliminar clientes
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
COMMENT ON COLUMN clientes.creado_por IS 'Usuario que creó este registro';
COMMENT ON COLUMN clientes.atualizado_por IS 'Usuario que realizó la última actualización';

-- NOTA: Los campos creado_por y atualizado_por se llenan automáticamente
-- mediante triggers. No es necesario enviarlos desde el frontend.
-- Los triggers usan auth.uid() para obtener el usuario autenticado actual.

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
