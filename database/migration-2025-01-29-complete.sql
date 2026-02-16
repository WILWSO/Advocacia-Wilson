-- ============================================================================
-- MIGRATION SCRIPT - 2025-01-29
-- ============================================================================
-- Este script realiza las siguientes operaciones:
-- 1. Renombrar tabla: comentarios_posts_social → comentarios_sociais
-- 2. Crear tabla: documentos_clientes
-- 3. Crear tabla: audit_log
-- 4. Crear tabla: jurisprudencias
-- ============================================================================

-- ============================================================================
-- 1. RENOMBRAR TABLA: comentarios_posts_social → comentarios_sociais
-- ============================================================================

-- Verificar si existe la tabla antigua
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'comentarios_posts_social'
    ) THEN
        -- Renombrar la tabla
        ALTER TABLE comentarios_posts_social RENAME TO comentarios_sociais;
        
        -- Renombrar índices
        ALTER INDEX IF EXISTS idx_comentarios_post_id 
            RENAME TO idx_comentarios_sociais_post_id;
        
        ALTER INDEX IF EXISTS idx_comentarios_data_criacao 
            RENAME TO idx_comentarios_sociais_data_criacao;
        
        ALTER INDEX IF EXISTS idx_comentarios_aprovado 
            RENAME TO idx_comentarios_sociais_aprovado;
        
        -- Actualizar constraint si existe
        ALTER TABLE comentarios_sociais 
            DROP CONSTRAINT IF EXISTS comentarios_posts_social_comentario_check;
        
        ALTER TABLE comentarios_sociais 
            ADD CONSTRAINT comentarios_sociais_comentario_check 
            CHECK (char_length(comentario) >= 1 AND char_length(comentario) <= 1000);
        
        -- Actualizar comentario de la tabla
        COMMENT ON TABLE comentarios_sociais IS 'Comentários dos posts sociais do site';
        
        RAISE NOTICE 'Tabla comentarios_posts_social renombrada exitosamente a comentarios_sociais';
    ELSE
        RAISE NOTICE 'Tabla comentarios_posts_social no existe, puede que ya se haya renombrado';
    END IF;
END $$;

-- ============================================================================
-- 2. CREAR TABLA: documentos (polimórfica para todas las entidades)
-- ============================================================================
-- ⚠️  ADVERTENCIA: TABLA OBSOLETA - REMOVIDA EL 16/02/2026
-- Esta tabla NUNCA fue utilizada en el frontend.
-- El sistema usa campos JSONB en su lugar (documentos_cliente, documentos_processo).
-- Si estás ejecutando este script en una base de datos nueva, OMITE esta sección.
-- Para bases de datos existentes, ejecuta: migration-eliminar-documentos-jurisprudencias.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS documentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Referencia polimórfica (sin FK constraint)
    entity_type VARCHAR(50) NOT NULL, -- 'cliente', 'processo', 'jurisprudencia', 'usuario', 'post', etc.
    entity_id UUID NOT NULL, -- ID de la entidad relacionada
    
    -- Información del documento
    nome_documento VARCHAR(255) NOT NULL,
    tipo_documento VARCHAR(100), -- 'RG', 'CPF', 'CNH', 'Contrato', 'Procuração', 'Sentença', etc.
    descricao TEXT,
    
    -- Almacenamiento
    url_arquivo TEXT NOT NULL, -- URL del archivo en Supabase Storage
    tamanho_bytes INTEGER,
    mime_type VARCHAR(100),
    
    -- Metadatos
    data_upload TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_expiracao DATE, -- Opcional para documentos que expiran
    
    -- Auditoría
    upload_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    
    -- Constraint para validar entity_type
    CONSTRAINT documentos_entity_type_check 
        CHECK (entity_type IN ('cliente', 'processo', 'jurisprudencia', 'usuario', 'post', 'audiencia'))
);

-- Índices para documentos
CREATE INDEX IF NOT EXISTS idx_documentos_entity 
    ON documentos(entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_documentos_entity_id 
    ON documentos(entity_id);

CREATE INDEX IF NOT EXISTS idx_documentos_tipo 
    ON documentos(tipo_documento);

CREATE INDEX IF NOT EXISTS idx_documentos_upload_por 
    ON documentos(upload_por);

CREATE INDEX IF NOT EXISTS idx_documentos_data_upload 
    ON documentos(data_upload DESC);

CREATE INDEX IF NOT EXISTS idx_documentos_ativo 
    ON documentos(ativo);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_documentos_updated_at
    BEFORE UPDATE ON documentos
    FOR EACH ROW
    EXECUTE FUNCTION update_data_atualizacao();

-- RLS para documentos
ALTER TABLE documentos ENABLE ROW LEVEL SECURITY;

-- Política: Solo usuarios autenticados pueden ver documentos
CREATE POLICY "Usuarios autenticados podem ver documentos"
    ON documentos
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.id = auth.uid()
        )
    );

-- Política: Advogados y admins pueden insertar documentos
CREATE POLICY "Advogados e admins podem insertar documentos"
    ON documentos
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.id = auth.uid()
            AND usuarios.role IN ('admin', 'advogado', 'assistente')
        )
    );

-- Política: Advogados y admins pueden actualizar documentos
CREATE POLICY "Advogados e admins podem actualizar documentos"
    ON documentos
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.id = auth.uid()
            AND usuarios.role IN ('admin', 'advogado', 'assistente')
        )
    );

-- Política: Solo admins pueden eliminar documentos
CREATE POLICY "Apenas admins podem eliminar documentos"
    ON documentos
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.id = auth.uid()
            AND usuarios.role = 'admin'
        )
    );

COMMENT ON TABLE documentos IS 'Tabla polimórfica de documentos para todas las entidades del sistema';
COMMENT ON COLUMN documentos.entity_type IS 'Tipo de entidad: cliente, processo, jurisprudencia, usuario, post, audiencia';
COMMENT ON COLUMN documentos.entity_id IS 'ID de la entidad relacionada (polimórfico)';
COMMENT ON COLUMN documentos.tipo_documento IS 'Tipo de documento: RG, CPF, CNH, Contrato, Procuração, Sentença, etc.';
COMMENT ON COLUMN documentos.data_expiracao IS 'Data de expiração del documento (opcional)';

-- ============================================================================
-- 3. CREAR TABLA: audit_log
-- ============================================================================

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
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name 
    ON audit_log(table_name);

CREATE INDEX IF NOT EXISTS idx_audit_log_record_id 
    ON audit_log(record_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_operation 
    ON audit_log(operation);

CREATE INDEX IF NOT EXISTS idx_audit_log_usuario_id 
    ON audit_log(usuario_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp 
    ON audit_log(timestamp DESC);

-- Índice compuesto para consultas comunes
CREATE INDEX IF NOT EXISTS idx_audit_log_table_record 
    ON audit_log(table_name, record_id, timestamp DESC);

-- Índice GIN para búsqueda en JSONB
CREATE INDEX IF NOT EXISTS idx_audit_log_old_data 
    ON audit_log USING GIN (old_data);

CREATE INDEX IF NOT EXISTS idx_audit_log_new_data 
    ON audit_log USING GIN (new_data);

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
COMMENT ON COLUMN audit_log.table_name IS 'Nombre de la tabla afectada';
COMMENT ON COLUMN audit_log.record_id IS 'ID del registro afectado';
COMMENT ON COLUMN audit_log.operation IS 'Tipo de operación: INSERT, UPDATE, DELETE';
COMMENT ON COLUMN audit_log.old_data IS 'Estado anterior del registro (UPDATE/DELETE)';
COMMENT ON COLUMN audit_log.new_data IS 'Estado nuevo del registro (INSERT/UPDATE)';
COMMENT ON COLUMN audit_log.changed_fields IS 'Array con los nombres de los campos modificados';

-- ============================================================================
-- 4. CREAR TABLA: jurisprudencias (simplificada)
-- ============================================================================
-- ⚠️  ADVERTENCIA: TABLA OBSOLETA - REMOVIDA EL 16/02/2026
-- Esta tabla NUNCA fue utilizada en el frontend.
-- El sistema usa campo JSONB en su lugar (processos_juridicos.jurisprudencia).
-- Si estás ejecutando este script en una base de datos nueva, OMITE esta sección.
-- Para bases de datos existentes, ejecuta: migration-eliminar-documentos-jurisprudencias.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS jurisprudencias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Información básica
    titulo VARCHAR(500) NOT NULL,
    ementa TEXT NOT NULL, -- Resumen/síntesis de la decisión
    link TEXT, -- Link externo (jurisprudência online)
    documento UUID, -- Referencia a tabla documentos (archivo PDF/DOC)
    
    -- Vinculación con processos
    processos_relacionados JSONB DEFAULT '[]'::jsonb, -- Array de IDs de processos
    
    -- Notas del usuario
    notas TEXT,
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    
    -- Auditoría
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Índices para jurisprudencias
CREATE INDEX IF NOT EXISTS idx_jurisprudencias_ativo 
    ON jurisprudencias(ativo);

CREATE INDEX IF NOT EXISTS idx_jurisprudencias_documento 
    ON jurisprudencias(documento);

CREATE INDEX IF NOT EXISTS idx_jurisprudencias_created_by 
    ON jurisprudencias(created_by);

-- Índice GIN para JSONB
CREATE INDEX IF NOT EXISTS idx_jurisprudencias_processos 
    ON jurisprudencias USING GIN (processos_relacionados);

-- Índice de texto completo para búsqueda
CREATE INDEX IF NOT EXISTS idx_jurisprudencias_busca_texto 
    ON jurisprudencias USING GIN (
        to_tsvector('portuguese', 
            coalesce(titulo, '') || ' ' || 
            coalesce(ementa, '') || ' ' || 
            coalesce(notas, '')
        )
    );

-- Trigger para actualizar updated_at
CREATE TRIGGER update_jurisprudencias_updated_at
    BEFORE UPDATE ON jurisprudencias
    FOR EACH ROW
    EXECUTE FUNCTION update_data_atualizacao();

-- Triggers de auditoría
CREATE TRIGGER jurisprudencias_audit_insert
    BEFORE INSERT ON jurisprudencias
    FOR EACH ROW
    EXECUTE FUNCTION audit_creado_por();

CREATE TRIGGER jurisprudencias_audit_update
    BEFORE UPDATE ON jurisprudencias
    FOR EACH ROW
    EXECUTE FUNCTION audit_atualizado_por();

-- RLS para jurisprudencias
ALTER TABLE jurisprudencias ENABLE ROW LEVEL SECURITY;

-- Política: Todos los usuarios autenticados pueden ver jurisprudencias activas
CREATE POLICY "Usuarios autenticados podem ver jurisprudencias"
    ON jurisprudencias
    FOR SELECT
    USING (
        ativo = true AND
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.id = auth.uid()
        )
    );

-- Política: Advogados y admins pueden insertar jurisprudencias
CREATE POLICY "Advogados e admins podem insertar jurisprudencias"
    ON jurisprudencias
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.id = auth.uid()
            AND usuarios.role IN ('admin', 'advogado')
        )
    );

-- Política: Advogados pueden actualizar sus propias jurisprudencias
CREATE POLICY "Advogados podem actualizar sus jurisprudencias"
    ON jurisprudencias
    FOR UPDATE
    USING (
        created_by = auth.uid() OR
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.id = auth.uid()
            AND usuarios.role = 'admin'
        )
    );

-- Política: Solo admins pueden eliminar jurisprudencias
CREATE POLICY "Apenas admins podem eliminar jurisprudencias"
    ON jurisprudencias
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM usuarios
            WHERE usuarios.id = auth.uid()
            AND usuarios.role = 'admin'
        )
    );

COMMENT ON TABLE jurisprudencias IS 'Base de conhecimento de jurisprudências (simplificada)';
COMMENT ON COLUMN jurisprudencias.ementa IS 'Síntese/resumo da decisão judicial';
COMMENT ON COLUMN jurisprudencias.link IS 'Link externo para jurisprudência online';
COMMENT ON COLUMN jurisprudencias.documento IS 'ID del documento relacionado (PDF/DOC de la jurisprudencia)';
COMMENT ON COLUMN jurisprudencias.processos_relacionados IS 'Array JSONB com IDs de processos relacionados';

-- ============================================================================
-- FINALIZACIÓN
-- ============================================================================

-- Mensaje de finalización
DO $$
BEGIN
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'MIGRACIÓN COMPLETADA EXITOSAMENTE - 2025-01-29';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE '✅ Tabla comentarios_posts_social renombrada a comentarios_sociais';
    RAISE NOTICE '✅ Tabla documentos (polimórfica) creada';
    RAISE NOTICE '✅ Tabla audit_log creada';
    RAISE NOTICE '✅ Tabla jurisprudencias (simplificada) creada';
    RAISE NOTICE '============================================================================';
END $$;
